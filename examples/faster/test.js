var fibonacci = require('./fibonacci').fibonacci;
var fibonacciMemo = require('./fibonacci').fibonacciMemo;

gt.module('faster');

gt.test('empty', function () {
	gt.func(fibonacci, 'fibonacci is a function');
	gt.ok(true, 'before faster');
	gt.faster('empty function', function () {}, 100);
	gt.ok(true, 'after faster');
})

gt.test('fibonacci 10', function () {
	gt.func(fibonacci, 'fibonacci is a function at the start');
	gt.faster('fibonacci of 10', function() {
		gt.func(fibonacci, 'fibonacci is a function');
		var result = fibonacci(10);
		gt.equal(result, 55, 'correct result');
	}, 10);
});

gt.test('fibonacci 10 using deferCall', function () {
	gt.faster('fibonacci of 10',
		gt.deferCall(fibonacci, 10),
		10, 40);
});

gt.test('FAIL: fibonacci 20', function () {
	gt.faster('fibonacci of 20', function() {
		var result = fibonacci(20);
		gt.equal(result, 6765, 'correct result');
	}, 10);
});

gt.test('fibonacci 5 1000 times', function () {
	gt.faster('fibonacci of 5 1000 times', function() {
		var result = fibonacci(5);
	}, 1000, 170);
});

gt.module('fibonacci memoized');

gt.test('memoized version correctness', function () {
	gt.equal(fibonacciMemo(10), 55, 'correct for n = 10');
});

gt.test('compare two implementations', function () {
	gt.fasterThan('memoized version is faster',
		function () {
			fibonacciMemo(20);
		},
		function () {
			fibonacci(20)
		});
});

gt.test('FAIL: compare two implementations', function () {
	gt.fasterThan('memoized version is slower?',
		function () {
			fibonacci(20)
		},
		function () {
			fibonacciMemo(20);
		}, 5);
});

gt.test('function defer call shortcut', function () {
	gt.fasterThan('memoized version is faster',
		gt.deferCall(fibonacciMemo, 20),
		gt.deferCall(fibonacci, 20));
});

gt.test('fibonacci memoized 20', function () {
	gt.faster('fibonacci of 20',
		gt.deferCall(fibonacciMemo, 20), 5);
});

gt.test('fibonacci and fibonacciMemo compute same reslts',
	function () {
		var inputs = [[0], [1], [2], [5], [10], [20]];
		gt.sameResults(fibonacci, fibonacciMemo, inputs,
			'fibonacci vs fibonacciMemo');
	});

gt.test('fibonacci and fibonacciMemo without message',
	function () {
		var inputs = [[0], [1], [2], [5], [10], [20]];
		gt.sameResults(fibonacci, fibonacciMemo, inputs);
	});