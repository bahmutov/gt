var TestRunner = {
	runTests: function () {
		console.assert(this._tests, "runner has no test collection");
		
		for (var testName in this._tests) {
			if (this._tests.hasOwnProperty(testName)) {
				var test = this._beforeTest(testName);
				console.assert(test, "could not get test", testName);
				console.assert(test.code, "could not find code for test", testName);
				
				log.debug("starting test '" + testName + "'");
				try {
					test.code();
				} catch (errors) {
					console.error("crash in test '" + testName + "'\n", errors);
					test.hasCrashed = true;
				}
				log.debug("finished test '" + testName + "'", this._currentTest.assertions + " assertions,", this._currentTest.broken, "broken");
			}
		}
	},
	
	// hooks to be used by the unit tests
	equal: function (a, b, message) {
		this._beforeAssertion();
		
		if (a !== b) {
			this._brokenAssertion("computed " + a + ", expected " + b + ", " + message);
		}
	},

	ok: function(condition, message) {
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

	module: function (name) {
		log.log("module '" + name + "'");
	},
	
	raises: function(code, expectedExceptionType, message) {
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
	
	_beforeTest: function (name) {
		console.assert(name, "missing test name");
		var test = this._tests[name];
		console.assert(test.name === name, "test name mismatch");
		console.assert(test.assertions === 0, "test", name, "should start with 0 assertions");
		console.assert(test.broken === 0, "test", name, "should start with 0 broken assertions");
		console.assert(typeof test.code === "function", name, "should have code");
		this._currentTest = test;
		return test;
	},

	_beforeAssertion: function () {
		console.assert(this._currentTest !== undefined, "current test is undefined");
		this._currentTest.assertions += 1;
	},

	_brokenAssertion: function (message) {
		console.assert(this._currentTest !== undefined, "current test is undefined");
		this._currentTest.broken += 1;
		console.error("ERROR in '" + this._currentTest.name + "', " + message);
	}
};

exports.TestRunner = TestRunner;