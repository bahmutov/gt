// QUnit async api
// http://qunitjs.com/cookbook/#asynchronous-callbacks
gt.module('async tests');
console.log('async tests, will take < 5 seconds');

/*
gt.asyncTest('async with expected', 1, function () {
	gt.ok(true, 'single assertion');
	gt.start();
});
*/

gt.async('INCOMPLETE: async with not enough assertions', 1, function () {
	gt.start();
});

gt.asyncTest('calls start right away', function () {
	gt.start();
});

gt.asyncTest('asyncTest 1', function () {
	gt.ok(true, 'first assertion');
	setTimeout(function() {
		gt.ok(true, "async1 timeout has finished");
		console.log('async 1 finished, calling start()');
		gt.start();
	}, 2000);
});

gt.async('async 2 using async name', function () {
	setTimeout(function() {
		gt.ok(true, "async2 timeout has finished");
		console.log('async 2 finished, calling start()');
		gt.start();
	}, 1000);
});

gt.asyncTest('FAIL: failing async test', function () {
	setTimeout(function() {
		gt.ok(false, 'fails on purpose');
		gt.start();
	}, 100);
});
