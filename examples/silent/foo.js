module.exports.foo = function () {
	console.log('exporting foo');
	console.log('more console.log messages from foo');
	console.warn('this is a warning using console.warn');
	console.error('this is console.error message');
	return 'foo';
};