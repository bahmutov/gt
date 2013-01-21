var Test = require("./Test").Test;
var _ = require('lodash');

var ModuleTests = function (name) {
	this._tests = [];
	this.name = ("string" === typeof name ? name : "default");

	this.add = function (name, code, filename) {
		console.assert(this._tests, "this._tests is defined");
		console.assert(typeof code === 'function', 'expected a test function');
		console.assert(typeof filename === 'string', 'expected a filename string');

		var test = new Test(name, code, this.name, filename);
		this._tests.push(test);
	};

	this.getNumberOfTests = function () {
		return this._tests.length;
	};

	this.getTests = function () {
		return this._tests;
	};

	this.getTestFilenames = function () {
		var filenames = this._tests.map(function (test) {
			return test.filename;
		});
		filenames = _.uniq(filenames);
		return filenames;
	};

	this.hasFailed = function () {
		var failed = this._tests.some(function(test) {
			return test.hasReallyFailed();
		})

		return failed;
	};

	this.getFailedTests = function () {
		console.assert(Array.isArray(this._tests), "tests are not defined");

		var failedTests = this._tests.filter(function(test) {
			return test.hasReallyFailed();
		});

		return failedTests;
	};

	// returns number of good (passed) tests
	this.getPassedTests = function () {
		var good = 0;

		this._tests.forEach(function (test) {
			if (!test.hasReallyFailed()) {
				good += 1;
			}
		});
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