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


function _report(tests) {
	console.assert(Array.isArray(tests), "tests is not an array");
	var k;
	for (k = 0; k < tests.length; k += 1) {
		var test = tests[k];
		var message = test.formMessage();
		console.log(message);
	}
}

function _log(tests) {
	console.assert(tests, "tests is undefined");

	function printResult(info, percent, good, total, failed, test) {
		console.assert(typeof info === "string", "info should be a string", info);
		console.assert(!isNaN(percent), "percent should be a number", percent);
		console.assert(!isNaN(good), "good is not a number", good);
		console.assert(!isNaN(total), "total is not a number", total);
		console.assert(!isNaN(failed), "failed is not a number", failed);

		var status = (failed > 0 ? "FAIL" : "PASS");
		if (test) {
			if (test.hasCrashed) {
				status = "CRASH";
			} else if ((test.expected !== "undefined") && test.expected && (test.expected !== test.assertions)) {
				status = "INCOMPLETE";
				total = test.expected;
				console.assert(!isNaN(total), "total expected for incomplete is not a number", total, "test", test.name);
			}
		}

		var message = "";
		if (test && test.module) {
			console.assert(typeof test.module === "string", "test module should be a string", test.module);
			message = sprintf("%-70s : %3d%% (%d / %d)", test.module + ': ' + info, percent, good, total, failed);
		} else {
			message = sprintf("%-70s : %3d%% (%d / %d)", info, percent, good, total, failed);
		}

		var fullMessage = sprintf("%-90s : %s", message, status);

		var color = (failed > 0 ? fail : success);
		if (test) {
			if (test.hasCrashed) {
				color = crash;
			} else if ((test.expected !== "undefined") && test.expected && (test.expected !== test.assertions)) {
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
	var testName;

	for (testName in tests) {
		if (tests.hasOwnProperty(testName)) {
			var test = tests[testName];
			var good = test.assertions - test.broken;
			var percent = (test.assertions === 0 ? 100 : good / test.assertions * 100);
			console.assert(test.assertions >= 0, "invalid number of assertions", test.assertions, "test", testName);
			printResult(test.name, percent, good, test.assertions, test.broken, test);

			totalTests += 1;
			if (test.broken > 0 || test.hasCrashed) {
				totalFailedTests += 1;
				failedTests.push(test);
			}
		}
	}

	console.log(centerMessage(lineLength));
	var goodTests = totalTests - totalFailedTests;
	var percentPassed = (totalTests === 0 ? 100 : goodTests / totalTests * 100);

	console.assert(totalTests >= 0, "invalid total tests", totalTests);
	console.assert((totalFailedTests >= 0) && (totalFailedTests <= totalTests), "invalid failed tests", totalFailedTests, "total", totalTests);
	printResult("passed tests", percentPassed, goodTests, totalTests, totalFailedTests);

	return totalFailedTests;
}

exports.Reporter = {
	// log: _log
	log: _report
};