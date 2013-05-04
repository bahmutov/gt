gt.module('custom user assertions');

// extend GT framework with custom assertion
gt.isOne = function (variable, message) {
	gt.equal(variable, 1, message);
};

gt.test('new assertion method', function () {
	gt.func(gt.isOne, 'gt.isOne is a function');
	gt.arity(gt.isOne, 2, 'expects 2 arguments');
});

gt.test('test user assertion', function () {
	var one = 1;
	gt.isOne(one, 'variable is 1');
	gt.isOne(0 + 1, 'expression is 1');
	gt.isOne(+'1', 'converted string is 1');
});