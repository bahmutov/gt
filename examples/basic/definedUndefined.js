gt.module('defined tests');

gt.test('gt.defined', function () {
	gt.func(gt.defined, 'gt.defined is a function');
	gt.defined(gt, 'gt is defined');

	var foo = null;
	gt.defined(foo, 'foo is defined');

	var bar = 'bar';
	gt.defined(bar, 'bar is defined');

	gt.defined([], 'empty array is defined');
	gt.defined(true, 'true is defined');
	gt.defined(false, 'false is defined');
	gt.defined('', 'empty string is defined');
});

gt.test('gt.undefined', function () {
	gt.defined(gt.undefined, 'gt.undefined is defined');
	gt.func(gt.undefined, 'gt.undefined is a function');

	var foo;
	gt.undefined(foo, 'var foo is undefined');
	gt.raises(function () {
		gt.undefined(bar, 'still raises ReferenceError');
	}, 'ReferenceError', 'bar still is invalid reference');
});