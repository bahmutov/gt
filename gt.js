var log = require("custom-logger");

var args = require("optimist").argv,
	help = "run just tests:\n\tnode gt <test module> \n\
run tests and coverage:\n\tistanbul cover gt <test module> \n\
example:\n\tnode gt tests.js \n\
options: -l <log level, from 0 (debug) to 3 (errors only)";

if (args.h || args.help || !args._.length) {
	console.log(help);
	process.exit(0);
}

var logMode = (typeof args.l === "number" ? args.l : 1);

log.new({
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

var testModuleName = args._[0];
 
log.debug("importing test reporter module");
var Reporter = require("./src/Reporter").Reporter;
console.assert(Reporter, "Reporter is undefined");

log.debug("importing test collection module");
var TestCollection = require("./src/TestCollection").TestCollection;
console.assert(TestCollection, "TestCollection is undefined");

log.debug("importing test runner module");
var TestRunner = require("./src/TestRunner").TestRunner;
console.assert(TestRunner, "cannot find TestRunner");

log.debug("binding methods to preserve original object information in global invocations");
console.assert(typeof Function.prototype.bind === "function", "bind is unavailable!");
global.test = TestCollection.add.bind(TestCollection);
global.moduleName = TestRunner.module.bind(TestRunner);
global.equal = TestRunner.equal.bind(TestRunner);
global.ok = TestRunner.ok.bind(TestRunner);
global.expect = TestRunner.expect.bind(TestRunner);

log.debug("loading module with unit tests", testModuleName);
try {
	require(testModuleName);
} catch (errors) {
	console.error(errors);
	console.log();
	console.log(help);
	process.exit(1);
}
log.debug("loaded", TestCollection.getNumberOfTests(), "tests from '" + testModuleName + "'");
console.log();

// todo: replace with mixin
TestRunner._tests = TestCollection._tests;
TestRunner.runTests();

console.log();
var failedTestNumber = Reporter.log(TestCollection._tests);
console.assert(typeof failedTestNumber === "number", "reporter has not returned number of failed tests");
process.exit(failedTestNumber);