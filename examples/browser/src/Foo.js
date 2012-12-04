console.log('original foo');

define([], function () {
	return function() {
		if (5 > 10) {
			return 'bar';
		}
		return 'foo';
	};
});

function notCalled() {
	console.log('this does not get called!');
}