var TestRunInfo = require('../TestRunInfo').TestRunInfo;
var check = require('check-types');
var joinArguments = require('../utils/joinArguments');

function tooLong(str) {
	check.verifyString(str, 'expected string to compare length');
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
		return ['equal', 'ok', 'expect', 'raises', 'start'];
 	},

	/**
	Starts testing framework (after async delay for example)

	@method start
	@memberOf gt
	@category Test
	*/
 	start: function () {
 		check.verifyObject(TestRunInfo._currentTest, "current test is undefined");
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
			var message = '"' + condition + '" failed';
			message += ' ' + joinArguments(arguments, 1);
			TestRunInfo._brokenAssertion(message);
		}
	},

	/**
	Asserts that given function raises an assertion when executed.

	@method raises
	@memberOf gt
	@category Basic assertions
	*/
	raises: function (code, expectedExceptionType, message) {
		check.verifyObject(TestRunInfo._currentTest, "current test is undefined");
		var typeName = null;
		if (!message && typeof expectedExceptionType === 'string') {
			message = expectedExceptionType;
			expectedExceptionType = null;
		} else {
			console.assert(expectedExceptionType !== undefined, "undefined expected exception type, message:", message);
			typeName = expectedExceptionType.name;
		}
		check.verifyString(message, "message should be a string");
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
			TestRunInfo._brokenAssertion("expected exception of type '" + typeName + "', caught '" + caughtType + "' '" + message + "'");
			return;
		}
		if (typeName) {
			TestRunInfo._brokenAssertion("exception of type '" + typeName + "' not thrown, '" + message + "'");
		} else {
			TestRunInfo._brokenAssertion("exception NOT thrown, '" + message + "'");
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
	check.verifyObject(TestRunInfo._currentTest, "current test is undefined");
	console.assert(numberOfAssertions >= 0, "invalid number of expected assertion", numberOfAssertions,
		"test", TestRunInfo._currentTest.name);
	TestRunInfo._currentTest.expected = numberOfAssertions;
};

module.exports = PrimaryAssertions;