gt.module('fails');

gt.test('this test fails', function() {
	gt.ok(false, 'this assertion fails');
});