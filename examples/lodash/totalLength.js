var _ = require('lodash');

function totalLength(strings) {
	console.assert(Array.isArray(strings), 'need array');
	var lengths = strings.reduce(function(sum, str) {
		return sum + str.length;
	}, 0);
	return lengths;
}

gt.module('computing sum of string lengths');

gt.test('single string', function () {
	gt.equal(totalLength(['foo']), 3, 'correct length for foo');
});

gt.test('two strings', function () {
	gt.equal(totalLength(['foo', 'b']), 4, 'two strings');
});
