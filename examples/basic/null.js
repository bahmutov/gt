gt.module('null tests');

gt.test('gt.null', function () {
	gt.func(gt.null, 'gt.null is a function');

	var foo = null;
	gt.defined(foo, 'foo is defined');
	gt.null(foo, 'foo is null');
});

gt.test('FAIL: not null', function () {
	gt.null('foo', 'foo is not null');
});

gt.test('CRASH: crash on purpose', function () {
  throw new Error('a problem');
});
