gt.module('make sure all arguments are reported when ok assertion fails');

gt.test('FAIL: 2 arguments', function () {
	gt.ok(true, 'everything is ok');
	gt.ok(false, 'this is single message');
	gt.ok(false, 'first of two', 'second of two');
	gt.ok(false); // no message on purpose
});

gt.test('FAIL: equal with arguments', function () {
	gt.equal(1, 2);
	gt.equal(1, 2, 'single argument');
	gt.equal(1, 2, 'single argument of two', 'second argument');
});

gt.test('FAIL: func with arguments', function () {
	var foo = 'not a function';
	gt.func(foo);
	gt.func(foo, 'single argument');
	gt.func(foo, 'single argument of two', 'second argument');
});

gt.test('FAIL: fn with arguments', function () {
	var foo = 'not a function';
	gt.fn(foo);
	gt.fn(foo, 'single argument');
	gt.fn(foo, 'single argument of two', 'second argument');
});