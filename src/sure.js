var _ = require('lodash');
// support loading .coffee source files
require('coffee-script');
var defaults = require('./utils/utils').defaults;
var verify = require('check-types').verify;

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
	verify.array(collectionMethods, 'expected list of method names');
	collectionMethods.forEach(function (method) {
		testingFramework[method] = TestCollection[method].bind(TestCollection);
	});

	var assertionMethods = TestRunner.getBindMethods();
	verify.array(assertionMethods, 'expected list of method names');
	assertionMethods.forEach(function (method) {
		verify.fn(TestRunner[method], 'could not function ' + method);
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

	testingFramework.assert = testingFramework;
}

function exposeSupportedFeatures() {
	testingFramework.supports = {
		setup: true,
		teardown: true,
		setupOnce: true,
		teardownOnce: true
	};
}

// do not pollute global namespace, put all our stuff under single object
function registerTarget(targetName) {
	verify.string(targetName, 'missing target name');
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
	verify.object(config, 'undefined config');

	verify.object(TestCollection, 'TestCollection is undefined');
	verify.object(TestRunner, 'cannot find TestRunner');

	log.debug('binding methods to preserve original object information in global invocations');
	verify.fn(Function.prototype.bind, 'bind is unavailable!');

	// clear any preexisting results (tests might be run multiple times)
	TestCollection.init();
	TestRunner.init(config);
	bindTestingFramework();
	exposeAlternativeAssertions();
	exposeSupportedFeatures();

	verify.array(config.target, 'targets should be an array');
	config.target.forEach(registerTarget);

	verify.fn(_.extend, 'missing extend function');
	testingFramework.extend = function (target, extras) {
		verify.object(target, 'cannot find target to extend');
		verify.object(extras, 'cannot find object to extend with');
		target = _.extend(target, extras);
	};

	require('./dohInterface');
	require('./jsunityInterface');
}

function collectTests() {
	verify.array(config.files, 'config files is not an array');
	var allTestModules = TestCollection.collectTests(config.files,
		config.modules, config.filter);
	return allTestModules;
}

function runTests(callback) {
	verify.array(TestCollection.modules, 'modules should be an array');
	verify.fn(callback, 'expected callback function');

	TestRunner.modules = TestCollection.modules;
	TestRunner.runTests(verifyIntegrity, function (err) {
		if (err) {
			console.log('test runner returned an error', err);
		}
		callback(err);
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
	verify.array(failedTests, 'could not get failed tests', failedTests);

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
	collect: collectTests,
	run: function (callback) {
		verify.fn(callback, 'missing all tests completed callback');
		var allTestModules = collectTests();
		verify.array(allTestModules, 'all test modules should be an array');

		runTests(function (err) {
			if (err) {
				console.error('all tests finished with error', err);
			}
			writeReport();
			callback(err ? 1 : reportFinalCount(), allTestModules);
		});
	},
	getTestFilenames: TestCollection.getTestFilenames.bind(TestCollection),
	setTestFilename: TestCollection.setTestFilename.bind(TestCollection),
	preTransform: TestCollection.preTransform.bind(TestCollection)
};
