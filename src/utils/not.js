var check = require('check-types');

module.exports = not;

function not(fn) {
	check.verify.fn(fn, 'expected a function');
	return function() {
		// console.log('inner arguments\n', JSON.stringify(arguments, null, 2));
		var args = Array.prototype.slice.call(arguments, 0);
		// console.log('args\n', JSON.stringify(args, null, 2));
		// console.log('calling fn ' + fn.name);
		return !fn.apply(undefined, args);
	};
}
