var consoleHider = require('./ConsoleHider').ConsoleHider;
var TestRunInfo = require('./TestRunInfo').TestRunInfo;

var TestRunner = {
	init: function (config) {
		console.assert(config, 'missing config');
		TestRunInfo._currentTest = null;
		this._tests = null;
		this.config = config;
	},

	runTest: function (test) {
		console.assert(test, 'expected a test argument');

		test.check();
		TestRunInfo._currentTest = test;

		try {
			if (!this.config.output) {
				consoleHider.hideConsole();
			} else {
				log.info("starting test '" + test.name + "'");
			}
			test.code();
		} catch (errors) {
			console.error("crash in test '" + test.name + "'\n", errors);
			console.trace(errors);
			test.hasCrashed = true;
		}
		finally {
			if (!this.config.output) {
				test.stdout = consoleHider.restoreConsole();
			}
		}
		log.debug("finished test '" + test.name + "'", 
			TestRunInfo._currentTest.assertions + " assertions,", 
			TestRunInfo._currentTest.broken, "broken");
		TestRunInfo._afterTest();
	},

	runTests: function () {
		console.assert(this._tests, "runner has no test collection");
		this._tests.forEach(this.runTest.bind(this));
	},

	// hooks to be used by the unit tests
	equal: function (a, b, message) {
		TestRunInfo._beforeAssertion();

		if (a !== b) {
			TestRunInfo._brokenAssertion(a + " !== " + b + ", " + message);
		}
	},

	ok: function (condition, message) {
		TestRunInfo._beforeAssertion();

		if (!condition) {
			TestRunInfo._brokenAssertion("'" + condition + "' failed, " + message);
		}
	},

	expect: function (numberOfAssertions) {
		console.assert(TestRunInfo._currentTest !== undefined, "current test is undefined");
		console.assert(numberOfAssertions >= 0, "invalid number of expected assertion", numberOfAssertions, 
			"test", TestRunInfo._currentTest.name);
		TestRunInfo._currentTest.expected = numberOfAssertions;
	},

	func: function (f, message) {
		this.equal(typeof f, 'function', message);
	},

	arity: function (f, n, message) {
		console.assert(TestRunInfo._currentTest, "current test is undefined");
		this.func(f, message);
		if (TestRunInfo._currentTest.expected) {
			TestRunInfo._currentTest.expected++;
		}
		this.equal(f.length, n, message);
	},

	raises: function (code, expectedExceptionType, message) {
		console.assert(TestRunInfo._currentTest !== undefined, "current test is undefined");
		var typeName = null;
		if (!message && typeof expectedExceptionType === 'string') {
			message = expectedExceptionType;
			expectedExceptionType = null;
		} else {
			console.assert(expectedExceptionType !== undefined, "undefined expected exception type, message:", message);
			typeName = expectedExceptionType.name;
		}
		console.assert(typeof message === "string", "message should be a string");
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
	},

	raisesAssertion: function (code, message) {
  	this.raises(code, 'AssertionError', message);
  },
};

exports.TestRunner = TestRunner;