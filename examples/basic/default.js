function deFault() {
	var args = [].slice.call(arguments, 0);
	var foundValue = null;
	args.some(function (value) {
		// console.log('checking value', value);
		if (typeof value !== 'undefined' &&
			value !== null) {
			foundValue = value;
			return true;
		}
		return false;
	});
	return foundValue;
}

gt.module('deFault');

gt.test(function simple() {
	var foo = deFault(undefined, undefined, 'foo');
	gt.equal(foo, 'foo', 'correct foo value');
});

gt.test(function numerical() {
	gt.equal(deFault(null, undefined, 1, 2), 1, 'correct numerical value');
	gt.equal(deFault(undefined, 0, 1, 2), 0, 'correct numerical value 0');
});
