// formatting results utility functions
var getLines = require('./utils').getLines;
var centerMessage = require('./utils').centerMessage;
var sprintf = require('sprintf').sprintf;

// console colors
var clc = require('cli-color');
var fail = clc.redBright.bold;
var success = clc.greenBright;
var crash = clc.magentaBright;
var incomplete = clc.yellowBright;

function _log(tests) {
	console.assert(tests, "tests is undefined");
	
	function printResult(info, percent, good, total, failed, test)
	{
		var status = (failed > 0 ? "FAIL" : "PASS");
		var color = (failed > 0 ? fail : success);
		if (test) {
			if (test.hasCrashed) {
				status = "CRASH";
			} else if ((typeof test.expected !== "undefined") && (test.expected != test.assertions)) {
				status = "INCOMPLETE";
				total = test.expected;
			}
		}
		
		if (test && test.module) {
			message = sprintf("%-70s : %3d%% (%d / %d)", test.module + ':' + info, percent, good, total, failed);
		} else {
			message = sprintf("%-70s : %3d%% (%d / %d)", info, percent, good, total, failed);
		}
		
		var fullMessage = sprintf("%-90s : %s", message, status);
		
		var color = (failed > 0 ? fail : success);
		if (test) {
			if (test.hasCrashed) {
				color = crash;
			} else if ((typeof test.expected !== "undefined") && (test.expected != test.assertions)) {
				color = incomplete;
			}
		}
		console.log(color(fullMessage));
	}

	var lineLength = 100;
	console.log(centerMessage(lineLength, "Individual Test Results"));
	// console.dir(_tests);

	var totalTests = 0;
	var totalFailedTests = 0;
	var failedTests = [];

	for (var testName in tests) {
		if (tests.hasOwnProperty(testName)) {
			var test = tests[testName];
			var good = test.assertions - test.broken;
			var percent = (test.assertions === 0 ? 100 : good / test.assertions * 100);
			printResult(test.name, percent, good, test.assertions, test.broken, test);
			
			totalTests += 1;
			if (test.broken > 0 || test.hasCrashed) {
				totalFailedTests += 1;
				failedTests.push(test);
			}
		}
	};

	console.log(centerMessage(lineLength));
	var good = totalTests - totalFailedTests;
	var percent = (totalTests === 0 ? 100 : good / totalTests * 100);

	console.assert(totalTests >= 0, "invalid total tests", totalTests);
	console.assert((totalFailedTests >= 0) && (totalFailedTests <= totalTests), "invalid failed tests", totalFailedTests, "total", totalTests);
	printResult("passed tests", percent, good, totalTests, totalFailedTests);
	
	return totalFailedTests;
}

exports.Reporter = {
	log: _log
};