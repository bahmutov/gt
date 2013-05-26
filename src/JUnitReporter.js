var fs = require('fs');

exports.Reporter = {
	log: function (modules, outputXmlFileName) {
		console.assert(outputXmlFileName, 'missing output xml filename');
		log.log('writing JUnit report to', outputXmlFileName);

		var out = '<?xml version="1.0" encoding="UTF-8"?>\n';
		out += '<testsuites>\n';
		modules.forEach(function (M) {
			out += '<testsuite name="' + M.name + '">\n';
			var tests = M.getTests();
			tests.forEach(function (test) {
				out += '\t<testcase name="' + test.name + '">\n';
				if (test.hasFailed()) {
					var messages = test.getMessages();
					messages.forEach(function (message) {
						out += '\t\t<failure type="error">' + message + '</failure>\n';
					});
					out += '<system-err>\n' + messages.join('\n') + '\n</system-err>\n';
				}
				out += '\t</testcase>\n';
			});
			out += '</testsuite>\n';
		});
		out += '</testsuites>\n';

		fs.writeFileSync(outputXmlFileName, out);
	}
};