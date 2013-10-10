QUnit.module('assert object passed into each test');

QUnit.test('basics', function (assert) {
  QUnit.object(assert, 'assert object is passed into test');
  QUnit.func(assert.ok, 'assert.ok is a function');
  QUnit.func(assert.equal, 'assert.equal is a function');
});

QUnit.test('testing actual assertion execution', function (assert) {
  assert.ok(true, 'assert.ok passes');
});

QUnit.test('FAIL: failing ok on purpose', function (assert) {
  assert.ok(false, 'should not pass');
});
