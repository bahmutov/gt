var TestRunInfo = {
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
		var msg = "ERROR in '" + this._currentTest.name;
		if (message) {
			msg += "', " + message;
		}
		console.error(msg);
		this._currentTest.errorMessage(msg);
	}
};

exports.TestRunInfo = TestRunInfo;