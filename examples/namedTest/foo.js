gt.module('named test');

gt.test('test with name', function () {
	gt.ok(true, 'this test has name and anonymous function');
});

gt.test(function namedUnitTest() {
	gt.ok(true, 'this unit test takes name from its function');
});