var foo = require('./foo.coffee').foo;

gt.module('testing coffee module');

gt.test('foo', function () {
	gt.func(foo, 'foo is a function');
	gt.equal(foo(), 'foo', 'returns correct value');
});