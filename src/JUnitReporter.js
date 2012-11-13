var fs = require("fs");


// see what Jenkins JUnit plugin reads from xml
// https://github.com/jenkinsci/jenkins/blob/master/core/src/main/java/hudson/tasks/junit/SuiteResult.java#L125
exports.Reporter = {
	log: function(modules, outputXmlFileName) {
		console.assert(outputXmlFileName, "missing output xml filename");
		log.log("writing JUnit report to", outputXmlFileName);
		
		var out = '<?xml version="1.0" encoding="UTF-8"?>\n';
		modules.forEach(function(M) {
			out += '<testsuite name="' + M.name + '">\n';
			var tests = M.getTests();
			tests.forEach(function(test) {
				out += '\t<testcase name="' + test.name + '">\n';
				if (test.hasFailed()) {
					out += '\t\t<error message="' + test.formMessage() + '" />\n';
				}
				out += '\t</testcase>\n';
			});
			/*
			<error message="something is wrong"/>
		</testcase>
		*/
			out += '</testsuite>';
		});

		fs.writeFileSync(outputXmlFileName, out);
	}
};