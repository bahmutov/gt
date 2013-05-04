delete require.cache[require.resolve('../TestRunInfo')];
var info = require('../TestRunInfo').TestRunInfo;
var Test = require('../Test').Test;

QUnit.module('TestRunInfo');

QUnit.test('general run', function () {
	QUnit.equal(typeof info._currentTest, 'undefined', 'initially undefined test');
	info._currentTest = new Test('foo', function() {}, 'test module', 'foo.js');
	info._beforeAssertion();
	QUnit.equal(info._currentTest.assertions, 1, 'single assertion');
	info._brokenAssertion('failed');
	QUnit.equal(info._currentTest.broken, 1, 'single assertion is broken');
	info._afterTest();
});