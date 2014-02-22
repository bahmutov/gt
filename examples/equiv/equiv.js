/* globals QUnit */
/* jshint indent:2 */
QUnit.module('QUnit.equiv');

QUnit.test('Use QUnit.equiv for deep equality', function () {
  QUnit.equal(typeof QUnit.equiv, 'function', 'equiv is a function');
  var foo1 = {
    bar: 'bar'
  };
  var foo2 = {};
  foo2.bar = 'bar';
  QUnit.ok(QUnit.equiv(foo1, foo2), 'objects are equivalent');
});
