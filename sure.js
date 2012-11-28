console.assert(args, "null args object");

var coverage = require("./lib/coverage");
var Reporter = require("./src/Reporter").Reporter;
var JUnitReporter = require("./src/JUnitReporter").Reporter;
var TestCollection = require("./src/TestCollection").TestCollection;
var TestRunner = require("./src/TestRunner").TestRunner;

function init() {
	console.assert(TestCollection, "TestCollection is undefined");
	console.assert(TestRunner, "cannot find TestRunner");

	log.debug("binding methods to preserve original object information in global invocations");
	console.assert(typeof Function.prototype.bind === "function", "bind is unavailable!");

	global.test = TestCollection.add.bind(TestCollection);
	global.moduleName = TestCollection.module.bind(TestCollection);

	global.deepEqual = global.equal = TestRunner.equal.bind(TestRunner);
	global.ok = TestRunner.ok.bind(TestRunner);
	global.expect = TestRunner.expect.bind(TestRunner);
	global.raises = TestRunner.raises.bind(TestRunner);
	global.notDeepEqual = function () {
		return !global.deepEqual(arguments);
	};

	function installCoverage(testModules) {
		var verboseCoverageHook = false;
		coverage.hookRequire(verboseCoverageHook);

		var path = require("path");
		for (var k = 0; k < testModules.length; k += 1) {
			var testModuleName = testModules[k];
			testModuleName = path.resolve(testModuleName);
			log.log("will add code coverage for", testModuleName);
			testModules[k] = testModuleName;
			coverage.addInstrumentCandidate(testModuleName);
		}
	}

	installCoverage(args._);
}

function collectTests() {
	TestCollection.collectTests(args._);
	console.log();
}

function runTests() {
	TestRunner._tests = TestCollection.getAllTests();
	console.assert(Array.isArray(TestRunner._tests), "could not get all tests");
	TestRunner.runTests();
	console.log();
}

function writeReport() {
	log.debug("reporting test results, skipping passed tests?", args.r);
	Reporter.log(TestCollection.modules, args.r);
	if (args.xml) {
		JUnitReporter.log(TestCollection.modules, args.xml);
	}
}

function writeCoverateReport() {
	if (args.cover && coverage) {
		log.debug("writing code coverage to folder", args.cover);
		coverage.writeReports(args.cover);
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
	console.log(color(Math.round(percent) + "%", "(" + goodTests, "/", TestCollection.getNumberOfTests() + ") tests passed"));
	return failedTests.length;
}

module.exports = {
	init: init,
	collect: collectTests,
	run: runTests,
	report: function () {
		writeReport();
		writeCoverateReport();
		return reportFinalCount();
	}
};