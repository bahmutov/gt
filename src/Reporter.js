// formatting results utility functions
var getLines = require('./utils').getLines;
var centerMessage = require('./utils').centerMessage;
var sprintf = require('sprintf').sprintf;
var clc = require('cli-color');
var sprintf = require('sprintf').sprintf;
var _ = require('lodash');

var Test = require("./Test").Test;
console.assert("string" === typeof Test.PASS, "Test.PASS is undefined");

function _reportTests(tests, config) {
	console.assert(Array.isArray(tests), "tests is not an array");

	config = config || {};
	var skipPassed = config.reporter;
	var useColors = !!config.colors;

	tests.forEach(function (test) {
		if (!test.hasFailed() && skipPassed) {
			return;
		}
		var message = test.formMessage();
		var status = test.status();
		console.assert("string" === typeof status, "could not get status", message);

		if (useColors) {
			var color = _statusColor(status);
			console.assert("function" === typeof color, "could not get color for test status", test.status());
			console.log(color(message));
		} else {
			console.log(message);
		}
		if (test.hasFailed() && test.stdout) {
			console.log('  from: ' + test.filename);
			console.log(test.stdout, '\n');
		}
	});
}

function _writeMessage(msg, failed, useColors) {
	console.assert(msg, 'nothing to write');

	if (useColors) {
		var color = (failed ? clc.redBright : clc.greenBright);
		console.log(color(msg));
	} else {
		console.log(msg);
	}
}

function _report(modules, config) {
	console.assert(Array.isArray(modules), "modules is not an array");
	if (!modules.length) {
		log.debug('nothing to report, no test modules');
		return;
	}
	var skipPassed = config.reporter;
	var useColors = !!config.colors;
	
	var lineLength = 100;
	console.log(centerMessage(lineLength, "Individual Test Results"));

	modules.forEach(function (module) {
		console.assert("string" === typeof module.name, "could not find name for module");

		var failed = module.hasFailed();
		_writeMessage(module.name, failed, useColors);

		_reportTests(module.getTests(), config);

		var good = module.getPassedTests();
		var total = module.getNumberOfTests();
		var percentage = module.passedPercentage();
		var message = sprintf("  %-60s   %3d%% (%d / %d)", '', Math.round(percentage), good, total);
		_writeMessage(message, failed, useColors);
	});

	console.log(centerMessage(lineLength));
}

var statusColors = {};
statusColors[Test.PASS] = clc.greenBright;
statusColors[Test.FAIL] = clc.redBright.bold;
statusColors[Test.CRASH] = clc.magentaBright;
statusColors[Test.INCOMPLETE] = clc.yellowBright;

function _statusColor(status) {
	console.assert("string" === typeof status, "status is not a string", status);
	var color = statusColors[status];
	console.assert(color, 'could not find color for status', status);
	return color;
}

exports.Reporter = {
	log: _report
};