// formatting results utility functions
var getLines = require('./utils/utils').getLines;
var centerMessage = require('./utils/utils').centerMessage;
var pluck = require('./utils/pluckFunction');
var sprintf = require('sprintf').sprintf;
var clc = require('cli-color');
var sprintf = require('sprintf').sprintf;
var _ = require('lodash');
var check = require('check-types');

var Test = require("./UnitTest/Test").Test;
check.verifyString(Test.PASS, "Test.PASS is undefined");

var lineLength = process.stdout.isTTY ? 
process.stdout.getWindowSize()[0] : 100;
check.verifyPositiveNumber(lineLength, 'invalid terminal line length', lineLength);

function _reportTests(tests, config) {
	check.verifyArray(tests, "tests is not an array");

	config = config || {};
	var skipPassed = config.reporter;
	var useColors = !!config.colors;

	tests.forEach(function (test) {
		if (!test.hasFailed() && skipPassed) {
			return;
		}
		if (!test.hasRun) {
			return;
		}
		var message = test.formMessage(lineLength);
		var status = test.status();
		check.verifyString(status, "could not get status", message);

		if (useColors) {
			var color = _statusColor(status);
			check.verifyFunction(color, "could not get color for test status", test.status());
			console.log(color(message));
		} else {
			console.log(message);
		}
		if (test.hasReallyFailed() && test.stdout) {
			console.log('  from: ' + test.filename);
			console.log(test.stdout, '\n');
		}
	});
}

function _writeMessage(msg, failed, useColors) {
	check.verifyString(msg, 'nothing to write');

	if (useColors) {
		var color = (failed ? clc.redBright : clc.greenBright);
		console.log(color(msg));
	} else {
		console.log(msg);
	}
}

function _report(modules, config) {
	check.verifyArray(modules, "modules is not an array");
	if (!modules.length) {
		log.debug('nothing to report, no test modules');
		return;
	}
	var skipPassed = config.reporter;
	var useColors = !!config.colors;
	
	var title = "Individual Test Results";

	var moduleFiles = modules.map(pluck('getFilename'));
	moduleFiles = _(moduleFiles).uniq().filter().value();
	if (moduleFiles.length === 1) {
		title = moduleFiles[0];
	}
	// console.log('modules comes from', moduleFiles);
	console.log(centerMessage(lineLength, title));
	var finalFormat = "    %-" + (lineLength - 32) + "s   %3d%% (%d / %d)";

	modules.forEach(function (module) {
		check.verifyString(module.name, "could not find name for module");

		var failed = module.hasFailed();
		if (!failed && config.quickFail) {
			if (!module.notRun()) {
				return;
			}
		}
		var duration = module.duration();
		console.assert(duration >= 0, 'expected duration number for module', module.name);
		_writeMessage(module.name + ' ' + duration + 'ms', failed, useColors);

		_reportTests(module.getTests(), config);

		var good = module.getPassedTests();
		var total = module.getNumberOfTests();
		var percentage = module.passedPercentage();
		var filename = module.getFilename() || 'unknown file';
		check.verifyString(filename, 'module', module.name, 'does not have filename');
		var message = sprintf(finalFormat, filename, Math.round(percentage), good, total);
		_writeMessage(message, failed, useColors);
	});

	console.log(centerMessage(lineLength));
}

var statusColors = {};
statusColors[Test.PASS] = clc.greenBright;
statusColors[Test.FAIL] = clc.redBright.bold;
statusColors[Test.CRASH] = clc.magentaBright;
statusColors[Test.INCOMPLETE] = clc.yellowBright;
statusColors[Test.SKIP] = clc.blueBright;

function _statusColor(status) {
	check.verifyString(status, "status is not a string", status);
	var color = statusColors[status];
	console.assert(color, 'could not find color for status', status);
	return color;
}

exports.Reporter = {
	log: _report
};