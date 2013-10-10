var assert = require('assert');
gt.module('using assert module');

gt.test('equality', function () {
	assert.equal          (4, 4);
	assert.strictEqual    (4 > 2, true);
});

gt.test('passing notEqual', function () {
	assert.notEqual       (4, 2);
	assert.notStrictEqual (1, true);
});

gt.test('CRASH: passing notEqual', function () {
	assert.notEqual       (2, 2);
	assert.notStrictEqual (false, false);
});