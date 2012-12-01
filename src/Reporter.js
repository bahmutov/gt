// formatting results utility functions
var getLines = require('./utils').getLines;
var centerMessage = require('./utils').centerMessage;
var sprintf = require('sprintf').sprintf;
var clc = require('cli-color');

var Test = require("./Test").Test;
console.assert("string" === typeof Test.PASS, "Test.PASS is undefined");

function _reportTests(tests, skipPassed) {
	console.assert(Array.isArray(tests), "tests is not an array");

	var k;
	for (k = 0; k < tests.length; k += 1) {
		var test = tests[k];
		if (!test.hasFailed() && skipPassed) {
			continue;
		}
		var message = test.formMessage();
		var status = test.status();
		console.assert("string" === typeof status, "could not get status", message);

		var useColors = true;
		if (typeof args !== 'undefined') {
			useColors = args.colors;
		}

		if (useColors) {
			var color = _statusColor(status);
			console.assert("function" === typeof color, "could not get color for test status", test.status());
			console.log(color(message));
		} else {
			console.log(message);
		}
	}
}

function _report(modules, skipPassed) {
	console.assert(Array.isArray(modules), "modules is not an array");

	var lineLength = 100;
	console.log(centerMessage(lineLength, "Individual Test Results"));

	var k;
	for (k = 0; k < modules.length; k += 1) {
		var module = modules[k];
		console.assert("string" === typeof module.name, "could not find name for module", k);
		_reportTests(module.getTests(), skipPassed);

		var good = module.getPassedTests();
		var total = module.getNumberOfTests();
		var percentage = module.passedPercentage();
		var message = module.name  + " : " + Math.round(percentage) + "% (" + good + "/" + total + ")";

		var useColors = true;
		if (typeof args !== 'undefined') {
			useColors = args.colors;
		}
		if (useColors) {
			var color = (module.hasFailed() ? clc.redBright : clc.greenBright);
			console.log(color(message));
		} else {
			console.log(message);
		}
	}

	console.log(centerMessage(lineLength));
}

function _statusColor(status) {
	console.assert("string" === typeof status, "status is not a string", status);
	console.assert("string" === typeof Test.PASS, "Test.PASS is undefined");

	switch (status) {
	case Test.PASS:
		return clc.greenBright;
	case Test.FAIL:
		return clc.redBright.bold;
	case Test.CRASH:
		return clc.magentaBright;
	case Test.INCOMPLETE:
		return clc.yellowBright;
	default:
		return clc.orangeBright;
	}
}

exports.Reporter = {
	log: _report
};