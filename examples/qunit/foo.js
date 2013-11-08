QUnit.module('foo tests using QUnit');

QUnit.test('sample', function () {
	QUnit.ok(true, 'this test passes');
});

QUnit.test('push', function () {
  QUnit.push(true, true, false, 'condition, expected, actual, message');
});

QUnit.test('FAIL: push', function () {
  QUnit.push(false, 'foo', 'bar', 'condition, expected, actual, message');
});
