gt.module('async tests');
console.log('async timeout tests, will take < 10 seconds');

gt.asyncTest('INCOMPLETE: does not call start', function () {
});

gt.asyncTest('INCOMPLETE: does not call start, custom timeout', function () {
}, 400);

gt.asyncTest('INCOMPLETE: long times out', function () {
	setTimeout(function() {
	}, 7000);
}, 2000);

gt.async('INCOMPLETE: does not call start after time out', function () {
	setTimeout(function() {
		gt.ok(true, 'everything is ok');
	}, 1000);
}, 1500);
