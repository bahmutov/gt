require('./tests');

gt.module('few tests in parent file');

gt.test('empty', function() {
	gt.ok(true, 'parent test ok');
});