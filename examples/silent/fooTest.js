var foo = require('./foo').foo;

gt.module('foo');

gt.test('testing foo', function () {
	gt.func(foo, 'foo is a function');
	console.log('a message from test function');
	var result = foo();
	gt.string(result, 'foo returns a string');
	gt.equal(result, 'foo', 'foo returns foo');
});

gt.test('broken on purpose', function () {
	console.log('this test fails on purpose');
	var result = foo();
	gt.ok(false, 'ok false!');
	console.log('you should see these messages after the test');
});