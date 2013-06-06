gt.module('arrays');

gt.test(function simpleArray() {
	gt.func(gt.array, 'gt.array is a function');
	gt.array([], 'empty array is an array');
	gt.array([]);
});

gt.test('empty array', function () {
    gt.empty([], 'array is empty');
});

gt.test('FAIL empty array', function () {
    gt.empty(['d'], 'array is NOT empty');
});