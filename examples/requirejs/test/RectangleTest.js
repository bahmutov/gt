if (typeof define !== 'function') {
	var define = require('amdefine')(module);
}

var Rectangle = require("../lib/Rectangle");

moduleName("Rectangle tests");
test("create rectangle", function () {
	equal(typeof Rectangle, "function", "Rectangle is a function");
	var r = new Rectangle(100, 45);
	equal(typeof r, "object", "r is an object");
	equal(r.width, 100, "width is correct");
	equal(r.height, 45, "height is correct");
});

test("create rectangle, default width is undefined", function () {
	equal(typeof Rectangle, "function", "Rectangle is a function");
	var r = new Rectangle();
	equal(typeof r, "object", "r is an object");
	equal(r.width, undefined, "default width is undefined");
	equal(r.height, undefined, "default height is undefined");
});