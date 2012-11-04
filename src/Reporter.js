// formatting results utility functions
var getLines = require('./utils').getLines;
var centerMessage = require('./utils').centerMessage;
var sprintf = require('sprintf').sprintf;
var clc = require('cli-color');

var Test = require("./Test").Test;
console.assert("string" === typeof Test.PASS, "Test.PASS is undefined");

function _report(tests) {
	console.assert(Array.isArray(tests), "tests is not an array");

	var lineLength = 100;
	console.log(centerMessage(lineLength, "Individual Test Results"));

	var k;
	for (k = 0; k < tests.length; k += 1) {
		var test = tests[k];
		var message = test.formMessage();
		var status = test.status();
		console.assert("string" === typeof status, "could not get status", message);
		var color = _statusColor(status);
		console.assert("function" === typeof color, "could not get color for test status", test.status());
		console.log(color(message));
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