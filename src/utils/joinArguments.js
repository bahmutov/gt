var check = require('check-types');

function joinArguments(args, index) {
	console.assert(args, 'missing arguments');
	index = index || 0;
	console.assert(index >= 0, 'invalid index', index);
	if (args && args.length > index) {
		return Array.prototype.slice.call(args, index).join(' ');
	}
	return '';
}

module.exports = joinArguments;