gt.module('skip unit tests');

gt.test(function normal() {
	gt.ok(true, 'assertion passes');
});

gt.skip(function skipped() {
	console.log('should not be executing this test');
	gt.ok(false, 'fails on purpose');
	throw new Error('fail this test');
});