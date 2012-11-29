function foo() {
	return 'foo';
}

test('foo test', function () {
	equal(typeof foo, 'function', 'foo is a function');
	equal(foo(), 'foo', 'foo returns string foo');
});