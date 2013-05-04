delete require.cache[require.resolve('../Test')];
var Test = require('../Test').Test;

QUnit.module('Test');

QUnit.test('default test', function () {
	var t = new Test('foo', function () {}, 'bar', 'foo.js');
	QUnit.ok(t.check(), 'checked test');
	QUnit.ok(!t.hasFailed(), 'new test has not failed');
	QUnit.ok(!t.hasReallyFailed(), 'new test has not really failed');
	QUnit.equal(typeof t.status(), 'string', 'status returns a string');
	QUnit.equal(typeof t.formMessage(), 'string', 'formMessage returns a string');
});

QUnit.test('default test assertions', function () {
	var t = new Test('foo', function () {}, 'bar', 'foo.js');
	QUnit.equal(t.assertions, 0, 'start with 0 assertions');
});