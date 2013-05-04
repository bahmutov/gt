gt.module('override gt');

gt.test('destroy gt', function () {
	gt.ok(true, 'everything is ok');
	gt = null; // destroy gt
});

gt.test('try using gt', function () {
	console.assert(gt, 'gt is ok');
	gt.ok(true, 'second test');
});