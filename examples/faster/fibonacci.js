module.exports.fibonacci = function fibonacci(n) {
	console.assert(n >= 0, 'invalid n', n);
	n = +n; // make sure input is a number
	if (n < 2) {
		return n;
	} else {
		return fibonacci(n - 2) + fibonacci(n - 1);
	}
};

var store = [0, 1];
module.exports.fibonacciMemo = function fibonacciMemo(n) {
	console.assert(n >= 0, 'invalid n', n);
	if (typeof store[n] === 'number') {
		return store[n];
	}
	return store[n] = fibonacciMemo(n - 2) + fibonacciMemo(n - 1);
}