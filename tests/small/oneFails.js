gt.module('fails to check exit code');

gt.test('this test fails on purpose', function() {
	gt.ok(false, 'this assertion fails');
});