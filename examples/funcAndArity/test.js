gt.module('function arity');

gt.test('test empty function', function () {
	var foo = function() {};
	gt.func(foo, 'foo is a function');
	gt.arity(foo, 0, 'without arguments');
});

gt.test('test add function', function () {
	function add(a, b) {
		return a + b;
	}
	gt.func(add, 'add is a function');
	gt.arity(add, 2, 'expects two arguments');
});
