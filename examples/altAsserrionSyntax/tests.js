gt.module('alternative assertions');

gt.test('is', function() {
	gt.is.ok(true, 'true is ok');
	gt.is.equal(true, true, 'true is true');
	gt.is.equal('foo', 'f' + 'oo', 'equal strings');
	gt.is.func(function (){}, 'is a function');
	gt.is.object({}, 'is empty object');
	gt.is.defined(gt, 'gt is defined');
	var foo;
	gt.is.undefined(foo, 'foo is undefined');
	gt.is.number(55, '55 is a number');
	gt.is.string('something', 'string');
	gt.is.array([], 'empty array is an array');
	gt.is.zero(0, '0 is zero');
});

gt.test('FAIL: is NO', function() {
	gt.is.ok(!true, 'false is not ok');
	gt.is.equal(true, 8, 'true is not 8');
	gt.is.equal('foo', 'f', 'non equal strings');
	gt.is.func(88, '88 is NOT a function');
	gt.is.object('foo', 'string is empty object');
	var foo;
	gt.is.defined(foo, 'foo is NOT defined');
	gt.is.undefined(gt, 'gt is NOT undefined');
	gt.is.number({}, 'object is NOT a number');
	gt.is.string([], 'array is NOT a string');
	gt.is.array({}, 'empty object is NOT an array');
	gt.is.zero(10, '10 is NOT zero');
	gt.is.zero('0', '"0" is NOT zero');
});