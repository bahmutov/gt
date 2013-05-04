gt.module('fails on purpose, shows quick fail mode');

gt.test('first failing test', function () {
	gt.ok(true, 'this is ok');
	gt.ok(false, 'this fails');
});

gt.test('second failing test', function () {
	gt.ok(true, 'this is ok');
	gt.ok(false, 'this fails');
});

gt.test('third failing test', function () {
	gt.ok(true, 'this is ok');
	gt.ok(false, 'this fails');
});

gt.module('this module is ok');

gt.test(function goodTest() {
	gt.ok(true, 'passes');
});