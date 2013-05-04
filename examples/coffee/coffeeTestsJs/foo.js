function foo() {
	return 'foo';
}

function notCalled() {
	return 'this is never called';
}

exports.foo = foo;