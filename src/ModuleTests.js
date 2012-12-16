var Test = require("./Test").Test;

var ModuleTests = function (name) {
	this._tests = [];
	this.name = ("string" === typeof name ? name : "default");

	this.add = function (name, code) {
		console.assert(this._tests, "this._tests is defined");
		var test = new Test(name, code, this.name);
		this._tests.push(test);
	};

	this.getNumberOfTests = function () {
		return this._tests.length;
	};

	this.getTests = function () {
		return this._tests;
	};

	this.hasFailed = function () {
		var k;
		for (k = 0; k < this._tests.length; k += 1) {
			var test = this._tests[k];
			if (test.hasReallyFailed()) {
				return true;
			}
		}
		return false;
	};

	this.getFailedTests = function () {
		console.assert(Array.isArray(this._tests), "tests are not defined");
		var failedTests = [];

		var k;
		for (k = 0; k < this._tests.length; k += 1) {
			var test = this._tests[k];
			if (test.hasReallyFailed()) {
				failedTests.push(test);
			}
		}
		return failedTests;
	};

	this.getPassedTests = function () {
		var good = 0;
		var k;
		for (k = 0; k < this._tests.length; k += 1) {
			if (!this._tests[k].hasReallyFailed()) {
				good += 1;
			}
		}
		return good;
	};

	this.passedPercentage = function () {
		var failed = this.getFailedTests();
		var goodTests = this._tests.length - failed.length;
		var percent = (this._tests.length > 0 ? goodTests / this._tests.length : 1) * 100;
		return percent;
	};
};

exports.ModuleTests = ModuleTests;