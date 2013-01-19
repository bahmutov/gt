var consoleHider = require('./ConsoleHider').ConsoleHider;
var TestRunInfo = require('./TestRunInfo').TestRunInfo;

var TestRunner = {
	init: function (config) {
		console.assert(config, 'missing config');
		TestRunInfo._currentTest = null;
		this._tests = null;
		this.config = config;
	},

	runTests: function () {
		console.assert(this._tests, "runner has no test collection");

		var k;
		for (k = 0; k < this._tests.length; k += 1) {
			var test = this._tests[k];
			console.assert(test, "could not get test");
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
		}
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
		console.assert(numberOfAssertions >= 0, "invalid number of expected assertion", numberOfAssertions, "test", this._currentTest.name);
		TestRunInfo._currentTest.expected = numberOfAssertions;
	},

	func: function (f, message) {
		this.equal(typeof f, 'function', message);
	},

	arity: function (f, n, message) {
		console.assert(this._currentTest, "current test is undefined");
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
			if (!typeName) {
				// caught some exception, nothing specific was expected
				return;
			}
			if (expectedExceptionType === typeof error) {
				return;
			}
			if (error.name === expectedExceptionType) {
				return;
			}
			if (error.name === typeName) {
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