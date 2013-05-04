gt.module('arrays');

gt.test(function simpleArray() {
	gt.func(gt.array, 'gt.array is a function');
	gt.array([], 'empty array is an array');
	gt.array([]);
});