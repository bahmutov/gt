var _ = require('lodash');
// support loading .coffee source files
require('coffee-script');
var defaults = require('./utils/utils').defaults;
var check = require('check-types');

var config = {
	files: [], // test and code files to process
	filter: null, // regular expression to match against test names
	xml: null, // output xml report filename, compatible with JUnit
	reporter: 0, // reporter format
	colors: true,
	output: false,
	quickFail: false,
	target: ['gt', 'QUnit'] // register global framework under these names
};

require('./shiv.js');
var Reporter = require('./Reporter').Reporter;
var JUnitReporter = require('./JUnitReporter').Reporter;
var TestCollection = require('./UnitTest/TestCollection').TestCollection;
var TestRunner = require('./TestRunner').TestRunner;

function initConfig(options) {
	options = defaults(options, {});
	config.files = defaults(options.files, options.module, config.files);
	if (options.test) {
		config.filter = new RegExp(options.test, 'ig');
	}
	config.xml = defaults(options.xml, config.xml);
	config.reporter = defaults(options.r, options.reporter, options.report, config.reporter);
	config.colors = defaults(options.colors, options.color);
	config.output = defaults(options.output, config.output);
	config.quickFail = defaults(options.quickFail, config.quickFail);

	if (options.target) {
		config.target = config.target.concat(options.target);
	}
	if (!Array.isArray(config.target)) {
		config.target = [config.target];
	}
	config.target = _.flatten(config.target);
	config.target = _.uniq(config.target);
}

var testingFramework = {};

function bindTestingFramework() {
	var collectionMethods = TestCollection.getBindMethods();
	check.verifyArray(collectionMethods, 'expected list of method names');
	collectionMethods.forEach(function (method) {
		testingFramework[method] = TestCollection[method].bind(TestCollection);
	});

	var assertionMethods = TestRunner.getBindMethods();
	check.verifyArray(assertionMethods, 'expected list of method names');
	assertionMethods.forEach(function (method) {
		testingFramework[method] = TestRunner[method].bind(TestRunner);
	});
}

// add gt.is.<something> syntax
function exposeAlternativeAssertions() {
	testingFramework.is = {
		ok: testingFramework.ok,
		equal: testingFramework.equal,
		func: testingFramework.func,
		object: testingFramework.object,
		defined: testingFramework.defined,
		undefined: testingFramework.undefined,
		number: testingFramework.number,
		string: testingFramework.string,
		array: testingFramework.array,
		zero: testingFramework.zero
	};
}

// do not pollute global namespace, put all our stuff under single object
function registerTarget(targetName) {
	check.verifyString(targetName, 'missing target name');
	global[targetName] = testingFramework;
}

function verifyIntegrity() {
	if (!config.target.every(function (bindName) {
		return global[bindName] === testingFramework;
	})) {
		log.error('Unit test switched framework binding');
		config.target.forEach(registerTarget);
	}
}

function init(options) {
	initConfig(options);
	check.verifyObject(config, 'undefined config');

	check.verifyObject(TestCollection, 'TestCollection is undefined');
	check.verifyObject(TestRunner, 'cannot find TestRunner');

	log.debug('binding methods to preserve original object information in global invocations');
	check.verifyFunction(Function.prototype.bind, 'bind is unavailable!');

	// clear any preexisting results (tests might be run multiple times)
	TestCollection.init();
	TestRunner.init(config);
	bindTestingFramework();
	exposeAlternativeAssertions();

	check.verifyArray(config.target, 'targets should be an array');
	config.target.forEach(registerTarget);
	require('./dohInterface');
	require('./jsunityInterface');
}

function collectTests() {
	check.verifyArray(config.files, 'config files is not an array');
	var allTestModules = TestCollection.collectTests(config.files, config.modules);
	return allTestModules;
}

function runTests(callback) {
	check.verifyArray(TestCollection.modules, 'modules should be an array');
	check.verifyFunction(callback, 'expected callback function');

	TestRunner.modules = TestCollection.modules;
	TestRunner.runTests(verifyIntegrity, function () {
		callback();
	});
}

function writeReport() {
	log.debug('reporting test results, skipping passed tests?', config.reporter);
	Reporter.log(TestCollection.modules, config);
	if (config.xml) {
		JUnitReporter.log(TestCollection.modules, config.xml);
	}
}

function reportFinalCount() {
	var failedTests = TestCollection.getFailedTests();
	check.verifyArray(failedTests, 'could not get failed tests', failedTests);

	var clc = require('cli-color');
	var color = (failedTests.length > 0 ? clc.redBright : clc.greenBright);
	var percent = TestCollection.passedPercentage();
	console.assert(percent >= 0.0 && percent <= 100.0, 'invalid tests passed percentage', percent);

	var goodTests = TestCollection.getNumberOfTests() - failedTests.length;
	var numberOfTests = TestCollection.getNumberOfTests();
	percent = Math.round(percent);
	var message = percent + '% (' + goodTests + ' / ' + numberOfTests + ') tests passed';
	if (config.colors) {
		console.log(color(message));
	} else {
		console.log(message);
	}
	return failedTests.length;
}

module.exports = {
	init: init,
	run: function (callback) {
		check.verifyFunction(callback, 'missing all tests completed callback');
		var allTestModules = collectTests();
		check.verifyArray(allTestModules, 'all test modules should be an array');

		runTests(function () {
			writeReport();
			callback(reportFinalCount(), allTestModules);
		});
	},
	getTestFilenames: TestCollection.getTestFilenames.bind(TestCollection),
	setTestFilename: TestCollection.setTestFilename.bind(TestCollection),
	preTransform: TestCollection.preTransform.bind(TestCollection)
};