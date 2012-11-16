var TestRunner = {
	runTests: function () {
		console.assert(this._tests, "runner has no test collection");

		var k;
		for (k = 0; k < this._tests.length; k += 1) {
			var test = this._tests[k];

			console.assert(test, "could not get test", k);
			test.check();
			this._currentTest = test;

			log.debug("starting test '" + test.name + "'");
			try {
				test.code();
			} catch (errors) {
				console.error("crash in test '" + test.name + "'\n", errors);
				test.hasCrashed = true;
			}
			log.debug("finished test '" + test.name + "'", this._currentTest.assertions + " assertions,", this._currentTest.broken, "broken");
			this._afterTest();
		}
	},

	// hooks to be used by the unit tests
	equal: function (a, b, message) {
		this._beforeAssertion();

		if (a !== b) {
			this._brokenAssertion(a + " !== " + b + ", " + message);
		}
	},

	ok: function (condition, message) {
		this._beforeAssertion();

		if (!condition) {
			this._brokenAssertion("'" + condition + "' failed, " + message);
		}
	},

	expect: function (numberOfAssertions) {
		console.assert(this._currentTest !== undefined, "current test is undefined");
		console.assert(numberOfAssertions >= 0, "invalid number of expected assertion", numberOfAssertions, "test", this._currentTest.name);
		this._currentTest.expected = numberOfAssertions;
	},

	raises: function (code, expectedExceptionType, message) {
		console.assert(this._currentTest !== undefined, "current test is undefined");
		console.assert(expectedExceptionType !== undefined, "expected error type undefined");
		console.assert(typeof message === "string", "message should be a string");
		this._beforeAssertion();

		var typeName = expectedExceptionType.name;
		try {
			code();
		} catch (error) {
			if (error.name === typeName) {
				return;
			}
			var caughtType = error.name || typeof error;
			this._brokenAssertion("expected exception of type '" + typeName + "', caught '" + caughtType + "' '" + message + "'");
			return;
		}
		this._brokenAssertion("exception of type '" + typeName + "' not thrown, '" + message + "'");
	},

	// collecting errors during unit test run
	_currentTest: undefined,

	_afterTest: function () {
		this._currentTest = undefined;
	},

	_beforeAssertion: function () {
		console.assert(this._currentTest !== undefined, "current test is undefined");
		this._currentTest.assertions += 1;
	},

	_brokenAssertion: function (message) {
		console.assert(this._currentTest !== undefined, "current test is undefined");
		this._currentTest.broken += 1;
		var msg = "ERROR in '" + this._currentTest.name + "', " + message;
		console.error(msg);
		this._currentTest.errorMessage(msg);
	}
};

exports.TestRunner = TestRunner;