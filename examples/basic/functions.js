gt.module('functions');

gt.test('func', function () {
	function foo() {};
	gt.ok(foo, 'foo is ok');
	gt.func(foo, 'foo is a function');
	gt.arity(foo, 0, 'foo does not take any arguments');
});

gt.test('arity + expect number', function () {
	function foo() {};
	gt.expect(1);
	gt.arity(foo, 0, 'foo without arguments');
}); 

gt.test('arity 1', function () {
	gt.arity(function (foo) {}, 1, 'needs 1 argument');
});