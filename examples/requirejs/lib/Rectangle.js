if (typeof define !== 'function') {
	var define = require('amdefine')(module);
}

define(["./Foo"], function (Foo) {
	function Rectangle(width, height) {
		this.width = width;
		this.height = height;
	}

	// console.log("Returning Rectangle");
	return Rectangle;
});