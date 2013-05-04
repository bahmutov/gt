var joinArguments = require('../joinArguments');

gt.module('passing arguments');

gt.test('simple array', function() {
	var result = joinArguments([0, 1, 2], 1);
	gt.equal(result, '1 2');
});

gt.test('calling with arguments', function() {
	function foo() {
		return joinArguments(arguments);
	}
	var result = foo(0, 1, 2);
	gt.equal(result, '0 1 2');
});

gt.test('calling with arguments and index', function() {
	function foo() {
		return joinArguments(arguments, 1);
	}
	var result = foo(0, 1, 2);
	gt.equal(result, '1 2');
});