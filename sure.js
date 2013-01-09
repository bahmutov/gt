var config = {
	files: [], // test files to process
	xml: null, // output xml report filename, compatible with JUnit
	reporter: 0, // reporter format
	modules: [],
	colors: true,
	output: false
};

if (typeof log === 'undefined') {
	// if there is no custom logger (like custom-logger), do not show debug statements
	global.log = console;
	global.log.debug = function() {};
}

if (typeof Function.prototype.bind !== "function") {
  Function.prototype.bind = function (o) {
      var thisFunction = this;
      return function () {
          return thisFunction.apply(o, [].slice.call(arguments));
      };
  };
  log.debug('added Function.prototype.bind manually');
}

var Reporter = require("./src/Reporter").Reporter;
var JUnitReporter = require("./src/JUnitReporter").Reporter;
var TestCollection = require("./src/TestCollection").TestCollection;
var TestRunner = require("./src/TestRunner").TestRunner;

function initConfig(options) {
	options = options || {};
	config.files = options._ || options.files || config.files;
	config.xml = options.xml || config.xml;
	config.reporter = options.r || options.reporter || options.report || config.reporter;
	config.modules = options.module || config.modules;
	config.colors = options.colors || options.color;
	config.output = options.output || config.output;
}

function init(options) {
	initConfig(options);
	console.assert(config, "undefined config");

	console.assert(TestCollection, "TestCollection is undefined");
	console.assert(TestRunner, "cannot find TestRunner");

	log.debug("binding methods to preserve original object information in global invocations");
	console.assert(typeof Function.prototype.bind === "function", "bind is unavailable!");

	// clear any preexisting results (tests might be run multiple times)
	TestCollection.init();
	TestRunner.init(config);

	// do not pollute global namespace, put all our stuff under single object
	global.gt = {
		module: TestCollection.module.bind(TestCollection),
		test: TestCollection.add.bind(TestCollection),

		// a few basic assertions
		deepEqual: TestRunner.equal.bind(TestRunner),
		equal: TestRunner.equal.bind(TestRunner),
		ok: TestRunner.ok.bind(TestRunner),
		expect: TestRunner.expect.bind(TestRunner),
		raises: TestRunner.raises.bind(TestRunner),
		raisesAssertion: TestRunner.raisesAssertion.bind(TestRunner),
		arity: TestRunner.arity.bind(TestRunner),
		func: TestRunner.func.bind(TestRunner),

		// a few extra utility assertion methods, implemented using simpler ones
		aequal: function(array1, array2, message) {
			this.equal(array1.toString(), array2.toString(), message);
		},
		notDeepEqual: function () {
			return !this.deepEqual(arguments);
		},
		number: function (n, message) {
			this.equal(typeof n, 'number', message);
		},
		string: function (s, message) {
			this.equal(typeof s, 'string', message);
		},
		array: function (a, message) {
			this.ok(Array.isArray(a), message);
		}
	};
}

function collectTests() {
	console.assert(Array.isArray(config.files), "config files is not an arrya");
	var allTestModules = TestCollection.collectTests(config.files, config.modules);
	console.log();
	return allTestModules;
}

function runTests() {
	TestRunner._tests = TestCollection.getAllTests();
	console.assert(Array.isArray(TestRunner._tests), "could not get all tests");
	TestRunner.runTests();
	console.log();
}

function writeReport() {
	log.debug("reporting test results, skipping passed tests?", config.reporter);
	Reporter.log(TestCollection.modules, config);
	if (config.xml) {
		JUnitReporter.log(TestCollection.modules, config.xml);
	}
}

function reportFinalCount() {
	var failedTests = TestCollection.getFailedTests();
	console.assert(Array.isArray(failedTests), "could not get failed tests", failedTests);

	var clc = require('cli-color');
	var color = (failedTests.length > 0 ? clc.redBright : clc.greenBright);
	var percent = TestCollection.passedPercentage();
	console.assert(percent >= 0.0 && percent <= 100.0, "invalid tests passed percentage", percent);

	var goodTests = TestCollection.getNumberOfTests() - failedTests.length;
	var message = Math.round(percent) + "% (" + goodTests + " / " + TestCollection.getNumberOfTests() + ") tests passed";
	if (config.colors) {
		console.log(color(message));
	} else {
		console.log(message);
	}
	return failedTests.length;
}

module.exports = {
	init: init,
	run: function () {
		var allTestModules = collectTests();
		console.assert(Array.isArray(allTestModules), 'all test modules should be an array');
		runTests();
		writeReport();
		return [reportFinalCount(), allTestModules];
	}
};