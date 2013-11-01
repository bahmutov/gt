var ConsoleHider = require('./utils/ConsoleHider').ConsoleHider;
var TestRunInfo = require('./TestRunInfo').TestRunInfo;
var BasicAssertions = require('./assertions/PrimaryAssertions');
var SecondaryAssertions = require('./assertions/SecondaryAssertions');
var TertiaryAssertions = require('./assertions/TertiaryAssertions');

var check = require('check-types');
var _ = require('lodash');
var async = require('async');
var Q = require('q');

var TestRunner = {
	init: function (config) {
		config = config || {};
		config.output = config.output || false;

		TestRunInfo._currentTest = null;
		this.modules = null;
		this.config = config;
	},

	// todo: add started / finished info
	executeTest: function (test, callback) {
		check.verify.object(test, 'expected a test object');
		check.verify.fn(callback, 'expected callback object');

		test.check();
		if (test.skip) {
			log.info('skipping test "' + test.name + '"');
			callback();
			return;
		}

		TestRunInfo._currentTest = test;
		var hider = null;

		function onTestFinished() {
			if (hider) {
				test.stdout = hider.restoreConsole();
			}
			log.debug('finished test "' + test.name + '"',
				TestRunInfo._currentTest.assertions + ' assertions,',
				TestRunInfo._currentTest.broken, 'broken');
			TestRunInfo._afterTest();
			callback();
		}

		try {
			test.start(onTestFinished);

			if (!this.config.output) {
				hider = new ConsoleHider();
				hider.hideConsole();
			} else {
				log.info('starting test "' + test.name + '"');
			}
			test.code(global.gt);
		} catch (errors) {
			console.error('crash in test "' + test.name + '"\n', errors);
			console.trace(errors);
			test.hasCrashed = true;
			test.finished = new Date();
		} finally {
			if (TestRunInfo._currentTest && !TestRunInfo._currentTest.async) {
				TestRunInfo._currentTest.finished = new Date();
				// console.log('sync test', TestRunInfo._currentTest.name, 'has finished');
				onTestFinished();
			}
		}
	},

	runTests: function (verifyIntegrity, onAllTestsFinished) {
		check.verify.array(this.modules, 'runner has no test collection');
		check.verify.fn(onAllTestsFinished, 'missing all tests completed function');

		async.eachSeries(this.modules,
			this.runModule.bind(this, verifyIntegrity),
			function (err) {
				if (err) {
					throw err;
				}
				// console.log('finished all tests from all modules');
				onAllTestsFinished();
			});
	},

	runSingleTest: function (preTest, verifyIntegrity, postTest, test, callback) {
		check.verify.fn(preTest, 'missing preTest');
		check.verify.fn(verifyIntegrity, 'missing verifyIntegrity');
		check.verify.fn(postTest, 'missing postTest');

		check.verify.object(test, 'missing test');
		check.verify.fn(callback, 'missing callback function');

		var self = this;

		Q.when(preTest()).then(function () {
			self.executeTest(test, function () {
				verifyIntegrity();
				Q.when(postTest()).then(function () {
					callback();
				});
			});
		});
	},

	runModule: function (verifyIntegrity, testModule, allModuleTestsCompleted) {
		check.verify.fn(verifyIntegrity, 'verify integrity should be a function');
		check.verify.object(testModule, 'missing test module');
		check.verify.fn(allModuleTestsCompleted, 'missing module completed function');

		var preEachTest = testModule.lifecycle.setup;
		check.verify.fn(preEachTest, 'module setup should be a function');
		var postEachTest = testModule.lifecycle.teardown;
		check.verify.fn(postEachTest, 'module teardown should be a function');

		async.eachSeries(testModule._tests,
			this.runSingleTest.bind(this, preEachTest, verifyIntegrity, postEachTest),
			allModuleTestsCompleted);
	}
};

_.extend(TestRunner, BasicAssertions, SecondaryAssertions, TertiaryAssertions);

TestRunner.getBindMethods = function () {
	return this.basic().concat(this.secondary()).concat(TertiaryAssertions.assertions());
};

exports.TestRunner = TestRunner;
