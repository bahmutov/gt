var CollectionMethods = require('./CollectionMethods').CollectionMethods;
console.assert(CollectionMethods, 'missing test collection methods');

var path = require('path');
var _ = require('lodash');
var check = require('check-types');
var defaults = require('../utils/utils').defaults;

var nodejsDefine = 'if (typeof define!=="function") {\n' +
'function define(A,F){ module.exports=F.apply(null,A.map(require)); }}\n';

var TestCollection = {
	modules: [],
	currentModule: undefined,
	testOnlyModules: {},
	skipTestModules: {},
	currentFileName: undefined,
	prependAMD: false,

	init: function () {
		this.modules = [];
		this.currentModule = undefined;
		this.testOnlyModules = {};
		this.skipTestModules = {};
		this.currentFileName = undefined;
		this.prependAMD = false;
	},

	determineSkipped: function(testModules) {
		testModules = defaults(testModules, []);
		check.verify.array(testModules, "expected list of modules to process, not", JSON.stringify(testModules));
		testModules.forEach(function(item) {
			if (/^!/.test(item)) {
				item = item.substr(1);
				log.debug('need to skip module', item);
				this.skipTestModules[item] = item;
			} else {
				this.testOnlyModules[item] = item;
			}
		}, this);
	},

	attemptAMD: function (moduleName, initialError) {
		check.verify.string(moduleName, 'missing module name');

		if (initialError.name === 'ReferenceError' && initialError.message === 'define is not defined') {
			console.log('module', moduleName, 'uses AMD define');
			this.prependAMD = true;
			delete require.cache[moduleName];
			require(moduleName);
			this.prependAMD = false;
		} else {
			throw initialError;
		}
	},

	loadModule: function (moduleName) {
		check.verify.string(moduleName, "expected a module name", moduleName);
		log.debug("loading module with unit tests", moduleName);

		// jsUnity support, will collect unit tests
		global.TestSuite = {};

		try {
			this.currentFileName = path.resolve(moduleName);

			try {
				delete require.cache[moduleName]; // clear cache just in case to make sure the module is loaded
				require(moduleName);
			} catch (initialError) {
				this.attemptAMD(moduleName, initialError);
			}

			if (Object.keys(global.TestSuite).length) {
				console.log('collected', Object.keys(global.TestSuite).length, 'jsUnity tests from', this.currentFileName);
				gt.module(this.currentFileName);
				Object.keys(global.TestSuite).forEach(function (testName) {
					var test = global.TestSuite[testName];
					gt.test(testName, test);
				});
			}
		} catch (errors) {
			console.error(errors + ' while loading ' + moduleName);
			console.trace(errors);
			process.exit(1);
		}
	},

	collectTests: function (moduleNames, testModules, testNameFilter) {
		check.verify.array(moduleNames, "expected list of test modules");
		this.determineSkipped(testModules);

		moduleNames.forEach(this.loadModule, this);
		log.debug("loaded", this.getNumberOfTests(), "tests from");

		if (testNameFilter) {
			this.filterTests(testNameFilter);
		}

		return moduleNames;
	},

	preTransform: function (code, filename) {
		if (this.prependAMD) {
			// console.log('prepending AMD support to code for', filename);
			code = nodejsDefine + code;
		}
		return code;
	},

	setTestFilename: function (filename) {
		check.verify.string(filename, 'trying to set empty filename');
		this.currentFileName = filename;
	},

	getTestFilenames: function () {
		check.verify.array(this.modules, 'undefined test modules');
		if (!this.modules.length) {
			if (this.currentFileName) {
				return [this.currentFileName];
			}
		}

		var testFilenames = _(testFilenames)
		.invoke('getTestFilenames')
		.flatten()
		.uniq()
		.value();
		// console.log('test filenames\n', testFilenames);
		return testFilenames;
	},

	_startModuleIfNecessary: function() {
		if ("undefined" === typeof this.currentModule) {
			this.module("unnamed");
		}
		check.verify.string(this.currentFileName, 'current filename not set');
	},

	shouldTestModule: function (name) {
		check.verify.string(name, "module name should be a string");
		if (!Object.keys(this.testOnlyModules).length) {
			return true;
		}
		return !!this.testOnlyModules[name];
	},

	shouldSkipModule: function (name) {
		check.verify.string(name, "module name should be a string");
		check.verify.object(this.skipTestModules, 'skip test modules should be an object');
		return !!this.skipTestModules[name];
	},

	filterTests: function (nameExpression) {
		if (!nameExpression) {
			return;
		}
		this.modules.forEach(function (m) {
			m.filterTests(nameExpression);
		});
		// todo: remove modules without tests
	},

	getAllTests: function () {
		check.verify.array(this.modules, "modules is not an array");

		return this.modules.reduce(function(all, m) {
			var tests = m.getTests();
			return all.concat(tests);
		}, []);
	},

	getNumberOfTests: function () {
		check.verify.array(this.modules, "modules is not an array");

		return this.modules.reduce(function (total, m) {
			return total + m.getNumberOfTests();
		}, 0);
	},

	getFailedTests: function () {
		check.verify.array(this.modules, "modules are not defined");

		return this.modules.reduce(function(failed, testModule) {
			var moduleFailed = testModule.getFailedTests();
			check.verify.array(moduleFailed, "could not get failed tests from module", testModule.name);
			return failed.concat(moduleFailed);
		}, []);
	},

	passedPercentage: function () {
		var all = this.getNumberOfTests();
		var failed = this.getFailedTests();
		var goodTests = all - failed.length;
		var percent = (all > 0 ? goodTests / all * 100 : 100);
		return percent;
	},

	getBindMethods: function () {
		return ['module', 'test', 'skip', 'notest', 'asyncTest', 'async'];
	}
};

_.extend(TestCollection, CollectionMethods);

exports.TestCollection = TestCollection;
