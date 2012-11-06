var Test = require("./Test").Test;
var ModuleTests = require("./ModuleTests").ModuleTests;

var TestCollection = {
	modules: [],
	currentModule: undefined,

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
				process.exit(1);
			}
		}
		log.debug("loaded", this.getNumberOfTests(), "tests from '" + testModuleName + "'");
	},

	add: function (name, code) {
		if ("undefined" === typeof this.currentModule) {
			this.module("unnamed");
		}

		console.assert(this.currentModule, "current module is not defined");
		this.currentModule.add(name, code);
	},

	module: function (name) {
		console.assert(name && (typeof name === "string"), "module name should be a string");
		console.assert(Array.isArray(this.modules), "modules is not an array");

		log.log("module '" + name + "'");
		this.currentModule = new ModuleTests(name);
		this.modules.push(this.currentModule);
	},

	getAllTests: function () {
		console.assert(Array.isArray(this.modules), "modules is not an array");

		var all = [];
		var k;
		for (k = 0; k < this.modules.length; k += 1) {
			var tests = this.modules[k].getTests();
			console.assert(Array.isArray(tests), "could not get tests from module", k, this.modules[k].name);
			all = all.concat(tests);
		}
		return all;
	},

	getNumberOfTests: function () {
		console.assert(Array.isArray(this.modules), "modules is not an array");
		var total = 0, k;
		for (k = 0; k < this.modules.length; k += 1) {
			total += this.modules[k].getNumberOfTests();
		}
		return total;
	},

	getFailedTests: function () {
		console.assert(Array.isArray(this.modules), "modules are not defined");
		var failedTests = [];

		var k;
		for (k = 0; k < this.modules.length; k += 1) {
			var module = this.modules[k];
			var moduleFailed = module.getFailedTests();
			console.assert(Array.isArray(moduleFailed), "could not get failed tests from module", module.name);
			failedTests = failedTests.concat(moduleFailed);
		}
		return failedTests;
	},

	passedPercentage: function () {
		var all = this.getNumberOfTests();
		var failed = this.getFailedTests();
		var goodTests = all - failed.length;
		var percent = (all > 0 ? goodTests / all * 100 : 100);
		return percent;
	}
};

exports.TestCollection = TestCollection;