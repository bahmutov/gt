define(["./foo"], function (foo) {
  gt.module('AMD test');

  gt.test('foo', function () {
    gt.func(foo, 'foo is a function');
    gt.equal(foo(), 'foo', 'foo returns correct value');
  });
});