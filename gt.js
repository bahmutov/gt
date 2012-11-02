// #! /usr/bin/env node
var log = require("custom-logger");

var optimist = require("optimist");
var args = optimist.usage("JS unit testing and coverage in a single shot.\nUsage: $0")
		.default({
			log: 1,
			report: 0,
			help: 0
		}).alias('l', 'log').alias('r', 'report').alias('h', 'help')
		.describe('l', "log level, 0 - debug, 1 - normal, 2 - warnings, 3 - errors only")
		.describe('r', "report level, 0 - all test results, 1 - failed tests only")
		.argv;

if (args.h || args.help || !args._.length) {
	console.log(optimist.showHelp());
	process.exit(0);
}

var coverage = require("./lib/coverage");

var logMode = (typeof args.l === "number" ? args.l : 1);
var reporterLevel = (typeof args.r === "number" ? args.r : 0);

log["new"]({
	debug: { level: 0, event: "debug", color: "yellow" },
	log: { level: 1, event: "log" },
	warn: { level: 2, event: "warn", color: "orange" },
	error: { level: 3, event: "error", color: "red" }
});

log.config({
	level: logMode
});
log.debug("log level", logMode);
global.log = log;

log.debug("module dir name", __dirname);
var currDirname = process.cwd();
log.debug("working dir name", currDirname);

log.debug("importing test reporter module, level", reporterLevel);
var Reporter;
switch (reporterLevel) {
case 0:
	log.debug("using standard reporter of all tests");
	Reporter = require("./src/Reporter").Reporter;
	break;
case 1:
	log.debug("using reporter of failed tests only");
	Reporter = require("./src/FailedTestsReporter").Reporter;
	break;
default:
	log.debug("using standard reporter of all tests");
	Reporter = require("./src/Reporter").Reporter;
}
console.assert(Reporter, "Reporter is undefined, level", reporterLevel);

log.debug("importing test collection module");
var TestCollection = require("./src/TestCollection").TestCollection;
console.assert(TestCollection, "TestCollection is undefined");

log.debug("importing test runner module");
var TestRunner = require("./src/TestRunner").TestRunner;
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
	var k;
	var testModuleName;

	for (k = 0; k < testModules.length; k += 1) {
		testModuleName = testModules[k];
		testModuleName = path.resolve(testModuleName);
		log.log("will add code coverage for", testModuleName);
		testModules[k] = testModuleName;
		coverage.addInstrumentCandidate(testModuleName);
	}
}

installCoverage(args._);
TestCollection.collectTests(args._);
console.log();

process.once("exit", function () {
	console.log("writing code coverage");
	coverage.writeReports("cover");
});

TestRunner._tests = TestCollection._tests;
TestRunner.runTests();

console.log();
var failedTestNumber = Reporter.log(TestCollection._tests);
console.assert(typeof failedTestNumber === "number", "reporter has not returned number of failed tests");
log.debug(failedTestNumber, "tests failed");
process.exit(failedTestNumber);