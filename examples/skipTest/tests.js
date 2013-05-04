gt.module('skip few tests');

gt.test('run this test', function () {
	gt.ok(true, 'this tests runs');
});

gt.skip('skip test using gt.skip', function () {
	gt.ok(false, 'should not be executed');
	throw new Error('Skip test using gt.skip');
});

gt.notest('skip test using gt.notest', function () {
	gt.ok(false, 'should not be executed');
	throw new Error('Skip test using gt.notest');
});