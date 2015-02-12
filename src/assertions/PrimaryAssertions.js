var TestRunInfo = require('../TestRunInfo').TestRunInfo;
var check = require('check-types');
var joinArguments = require('../utils/joinArguments');
var quote = require('quote');

function tooLong(str) {
	check.verify.string(str, 'expected string to compare length');
	var LIMIT = 10;
	return str.length > LIMIT;
}

function formatEqualMessage(actual, expected, info) {
	var first = JSON.stringify(actual, null, 2);
	var second = JSON.stringify(expected, null, 2);
	var message = '';

	if (tooLong(first)) {
		message += '\n' + first + '\n';
	} else {
		message = first;
	}

	message += " !== ";

	if (tooLong(second)) {
		message += '\n' + second + '\n';
	} else {
		message += second;
	}

	if (info) {
		message += ' ' + info;
	}
	return message;
}

var PrimaryAssertions = {
	basic: function () {
		return ['equal', 'ok', 'expect', 'raises', 'stop', 'start', 'push'];
 	},

 	/**
	Stops testing framework (test wants to do async call for example).
	Async tests do not have to call stop, it is done automatically

	@method stop
	@memberOf gt
	@category Test
	*/
 	stop: function () {
 		check.verify.object(TestRunInfo._currentTest, "current test is undefined");
 		TestRunInfo._currentTest.pause();
 	},

	/**
	Starts testing framework (after async delay for example)

	@method start
	@memberOf gt
	@category Test
	*/
 	start: function () {
 		check.verify.object(TestRunInfo._currentTest, "current test is undefined");
 		TestRunInfo._currentTest.continueWithTest();
 	},

 	/**
 	Asserts strict equality

 	@method equal
	@memberOf gt
	@category Basic assertions
	*/
	equal: function (a, b) {
		TestRunInfo._beforeAssertion();

		if (a !== b) {
			var message = formatEqualMessage(a, b, joinArguments(arguments, 2));
			/*
			var message = a + " !== " + b;
			message += ' ' + joinArguments(arguments, 2);
			*/
			TestRunInfo._brokenAssertion(message);
		}
	},

	/**
 	Asserts if condition evaluates to true

 	@method ok
	@memberOf gt
	@category Basic assertions
	*/
	ok: function (condition) {
		TestRunInfo._beforeAssertion();

		if (!condition) {
			var message = quote(condition) + ' failed';
			message += ' ' + joinArguments(arguments, 1);
			TestRunInfo._brokenAssertion(message);
		}
	},

	push: function (condition, expected, actual, message) {
		this.ok(condition, 'expected ' + quote(expected) + ' got ' + quote(actual) + ' ' + message);
	},

	/**
	Asserts that given function raises an assertion when executed.

	@method raises
	@memberOf gt
	@category Basic assertions
	*/
	raises: function (code, expectedExceptionType, message) {
		check.verify.object(TestRunInfo._currentTest, "current test is undefined");
		var typeName = null;
		if (!message && typeof expectedExceptionType === 'string') {
			message = expectedExceptionType;
			expectedExceptionType = null;
		} else {
			console.assert(expectedExceptionType !== undefined, "undefined expected exception type, message:", message);
			typeName = expectedExceptionType.name;
		}
		check.verify.string(message, "message should be a string");
		TestRunInfo._beforeAssertion();

		try {
			code();
		} catch (error) {
			if (!typeName ||
				expectedExceptionType === typeof error ||
				error.name === expectedExceptionType ||
				error.name === typeName) {
				return;
			}
			var caughtType = error.name || typeof error;
			TestRunInfo._brokenAssertion("expected exception of type " + quote(typeName) + ", caught " + quote(caughtType) + " " + quote(message));
			return;
		}
		if (typeName) {
			TestRunInfo._brokenAssertion("exception of type " + quote(typeName) + " not thrown, " + quote(message));
		} else {
			TestRunInfo._brokenAssertion("exception NOT thrown, " + quote(message));
		}
	}
};

/**
Expect given number of assertions

@method expect
@memberOf gt
@category Test
*/
PrimaryAssertions.expect = function (numberOfAssertions) {
	check.verify.object(TestRunInfo._currentTest, "current test is undefined");
	console.assert(numberOfAssertions >= 0, "invalid number of expected assertion", numberOfAssertions,
		"test", TestRunInfo._currentTest.name);
	TestRunInfo._currentTest.expected = numberOfAssertions;
};

module.exports = PrimaryAssertions;
