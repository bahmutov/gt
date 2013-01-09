var Test = require("./Test").Test;
var ModuleTests = require("./ModuleTests").ModuleTests;

var TestCollection = {
	modules: [],
	currentModule: undefined,
	testOnlyModules: {},
	skipTestModules: {},

	init: function () {
		this.modules = [];
		this.currentModule = undefined;
		this.testOnlyModules = {};
		this.skipTestModules = {};
	},

	collectTests: function (moduleNames, testModules) {
		console.assert(Array.isArray(moduleNames), "expected list of test modules");

		testModules = testModules || [];
		console.assert(Array.isArray(testModules), "expected list of modules to process, not", JSON.stringify(testModules));
		testModules.forEach(function(item) {
			if (/^!/.test(item)) {
				item = item.substr(1);
				log.debug('need to skip module', item);
				this.skipTestModules[item] = item;
			} else {
				this.testOnlyModules[item] = item;
			}
		}, this);

		moduleNames.forEach(function (testModuleName) {
			console.assert(typeof testModuleName === "string", "expected a module name", testModuleName);
			log.debug("loading module with unit tests", testModuleName);
			try {
				// clear cache just in case to make sure the module is loaded
				delete require.cache[testModuleName];
				require(testModuleName);
			} catch (errors) {
				console.error(errors);
				process.exit(1);
			}
		});
		log.debug("loaded", this.getNumberOfTests(), "tests from");

		return moduleNames;
	},

	add: function (name, code) {
		if ("undefined" === typeof this.currentModule) {
			this.module("unnamed");
		}

		if (!this.currentModule) {
			return;
		}
		console.assert(this.currentModule, "current module is not defined, cannot add test", name);
		this.currentModule.add(name, code);
	},

	module: function (name) {
		console.assert(name && (typeof name === "string"), "module name should be a string");
		console.assert(Array.isArray(this.modules), "modules is not an array");

		var addTest = true;
		if (Object.keys(this.testOnlyModules).length > 0) {
			if (this.testOnlyModules[name]) {
				addTest = true;
			} else {
				addTest = false;
			}
		}

		if (addTest) {
			if (!this.skipTestModules[name]) {
				log.debug("module '" + name + "'");
				this.currentModule = new ModuleTests(name);
				this.modules.push(this.currentModule);
			}
		}
	},

	getAllTests: function () {
		console.assert(Array.isArray(this.modules), "modules is not an array");

		var all = [];
		this.modules.forEach(function (testModule) {
			var tests = testModule.getTests();
			console.assert(Array.isArray(tests), "could not get tests from module", testModule.name);
			all = all.concat(tests);
		});
		return all;
	},

	getNumberOfTests: function () {
		console.assert(Array.isArray(this.modules), "modules is not an array");
		var total = 0;
		this.modules.forEach(function (testModule) {
			total += testModule.getNumberOfTests();
		});
		return total;
	},

	getFailedTests: function () {
		console.assert(Array.isArray(this.modules), "modules are not defined");
		var failedTests = [];

		this.modules.forEach(function (testModule) {
			var moduleFailed = testModule.getFailedTests();
			console.assert(Array.isArray(moduleFailed), "could not get failed tests from module", testModule.name);
			failedTests = failedTests.concat(moduleFailed);
		});
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