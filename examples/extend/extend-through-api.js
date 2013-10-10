QUnit.module('extend assertions through API');

QUnit.extend(QUnit.assert, {
  _custom_assertion: function (value, message) {
    QUnit.push(value === '44', value, '44', message);
  }
});

QUnit.test('custom assertion', function (assert) {
  assert.func(assert._custom_assertion, 'custom assertion function');
});

QUnit.test('try using custom assertion', function (assert) {
  assert._custom_assertion('44', '44 passes custom assertion');
});
