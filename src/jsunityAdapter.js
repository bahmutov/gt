/*global gt:true, jsUnity:true*/
var path = require('path');
var fs = require('fs');
var vm = require('vm');

// gt unit testing framework with jsunity support adapter
var sure = require('./covered.js');
sure.init({
	cover: 'cover',
	colors: true
});
console.assert(gt, 'could not find gt framework global object');

function run(allFiles) {
	console.assert(Array.isArray(allFiles), 'expect list of files');

	global.jsUnity = gt;
	jsUnity.assertions = {
		assertEqual: gt.equal.bind(gt),
		assertException: function (code) {
			gt.raises(code, 'raises assertion');
		}
	};

	function isTestFile(filename) {
		var code = fs.readFileSync(filename, 'utf-8');
		return (/TestSuite\./).test(code);
	}

	function testFiles(files) {
		console.assert(Array.isArray(files), 'expected list of files');

		files.forEach(function (filename) {
			if (!isTestFile(filename)) {
				console.log('including source file', filename);
				include(filename);
			} else {
				global.TestSuite = {};
				gt.module(path.basename(filename));
				include(filename);
				console.log('collected', Object.keys(global.TestSuite).length, 'tests from', filename);
				Object.keys(global.TestSuite).forEach(function (testName) {
					var test = global.TestSuite[testName];
					gt.test(testName, test);
				});
			}
		});
	}

	var cover = require('../lib/coverage.js');

	function include(filename, doNotInstrument) {
		var code = fs.readFileSync(filename, 'utf-8');
		if (doNotInstrument) {
			vm.runInThisContext(code, filename);
		} else {
			var instrumented = cover.instrumentCode(code, filename);
			vm.runInThisContext(instrumented, filename);
		}
	}

	testFiles(allFiles);
	sure.run();
}

module.exports.run = run;