if (typeof define !== 'function') {
	var define = require('amdefine')(module);
}

define(function () {
	function Foo(name) {
		this.name = name;
	}

	return Foo;
});