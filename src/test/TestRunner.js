delete require.cache[require.resolve('../TestRunner')];
var runner = require('../TestRunner').TestRunner;
var Test = require('../Test').Test;

QUnit.module('TestRunner');

QUnit.test('init test', function () {
	// runner.init();
});