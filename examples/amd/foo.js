/**
* this is an AMD module
*/
define(['./bar'], function (bar) {
	function notCalled() {
		if (true) {
			return 'this is not called';
		}
	}
	console.assert(bar === 'bar', 'invalid bar value', bar);

	return function () {
		return 'foo';
	};
});