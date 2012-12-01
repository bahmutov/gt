var config = {
	files: [], // test files to process
	xml: null, // output xml report filename, compatible with JUnit
	reporter: 0 // reporter format
};

if (typeof log === 'undefined') {
	// if there is no custom logger (like custom-logger), do not show debug statements
	global.log = console;
	global.log.debug = function() {};
}

var Reporter = require("./src/Reporter").Reporter;
var JUnitReporter = require("./src/JUnitReporter").Reporter;
var TestCollection = require("./src/TestCollection").TestCollection;
var TestRunner = require("./src/TestRunner").TestRunner;

function initConfig(options) {
	options = options || {};
	config.files = options._ || options.files || config.files;
	config.xml = options.xml || config.xml;
	config.reporter = options.r || config.reporter;
}

function init(options) {
	initConfig(options);
	console.assert(config, "undefined config");

	console.assert(TestCollection, "TestCollection is undefined");
	console.assert(TestRunner, "cannot find TestRunner");

	log.debug("binding methods to preserve original object information in global invocations");
	console.assert(typeof Function.prototype.bind === "function", "bind is unavailable!");

	global.test = TestCollection.add.bind(TestCollection);
	global.moduleName = TestCollection.module.bind(TestCollection);

	global.deepEqual = global.equal = TestRunner.equal.bind(TestRunner);
	global.aequal = function(array1, array2, message) {
		global.equal(array1.toString(), array2.toString(), message);
	};
	global.ok = TestRunner.ok.bind(TestRunner);
	global.expect = TestRunner.expect.bind(TestRunner);
	global.raises = TestRunner.raises.bind(TestRunner);
	global.raisesAssertion = TestRunner.raisesAssertion.bind(TestRunner);
	global.notDeepEqual = function () {
		return !global.deepEqual(arguments);
	};
}

function collectTests() {
	console.assert(Array.isArray(config.files), "config files is not an arrya");
	TestCollection.collectTests(config.files);
	console.log();
}

function runTests() {
	TestRunner._tests = TestCollection.getAllTests();
	console.assert(Array.isArray(TestRunner._tests), "could not get all tests");
	TestRunner.runTests();
	console.log();
}

function writeReport() {
	log.debug("reporting test results, skipping passed tests?", config.reporter);
	Reporter.log(TestCollection.modules, config.reporter);
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
	var useColors = true;
	if (typeof args !== 'undefined') {
		useColors = args.colors;
	}
	if (useColors) {
		console.log(color(message));
	} else {
		console.log(message);
	}
	return failedTests.length;
}

module.exports = {
	init: init,
	run: function () {
		collectTests();
		runTests();
		writeReport();
		return reportFinalCount();	
	}
};