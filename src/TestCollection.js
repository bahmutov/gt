var Test = require("./Test").Test;

var TestCollection = {
	_tests: [],

	collectTests: function (moduleNames) {
		console.assert(Array.isArray(moduleNames), "expected list of test modules");

		var k;
		for (k = 0; k < moduleNames.length; k += 1) {
			var testModuleName = moduleNames[k];
			console.assert(typeof testModuleName === "string", "expected a module name", testModuleName);
			log.debug("loading module with unit tests", testModuleName);
			try {
				require(testModuleName);
			} catch (errors) {
				console.error(errors);
				console.log();
				console.log(help);
				process.exit(1);
			}
		}
		log.debug("loaded", this.getNumberOfTests(), "tests from '" + testModuleName + "'");
	},

	add: function (name, code) {
		console.assert(this._tests, "this._tests is defined");
		var test = new Test(name, code, this._moduleName);
		this._tests.push(test);
	},

	module: function (name) {
		console.assert(name && (typeof name === "string"), "module name should be a string");
		log.log("module '" + name + "'");
		this._moduleName = name;
	},

	getNumberOfTests: function () {
		return this._tests.length;
	},

	getFailedTests: function () {
		console.assert(Array.isArray(this._tests), "tests are not defined");
		var failedTests = [];

		var k;
		for (k = 0; k < this._tests.length; k += 1) {
			var test = this._tests[k];
			if (test.hasFailed()) {
				failedTests.push(test);
			}
		}
		return failedTests;
	},

	passedPercentage: function () {
		var failed = this.getFailedTests();
		var goodTests = this._tests.length - failed.length;
		var percent = (this._tests.length > 0 ? goodTests / this._tests.length : 100) * 100;
		return percent;
	}
};

exports.TestCollection = TestCollection;