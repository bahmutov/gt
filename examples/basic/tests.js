console.assert(typeof gt === "object", "gt is undefined");
console.assert(typeof gt.module === "function", "module is undefined");
console.assert(typeof gt.test === "function", "test is undefined");
console.assert(typeof gt.equal === "function", "equal is undefined");
console.assert(typeof gt.ok === "function", "ok is undefined");
console.assert(typeof gt.expect === "function", "expect is undefined");

var path = require('path');

// load code to be tested
var code = require("./code");
console.assert(typeof code.add === "function", "add is not defined");

var add = code.add,
	getLines = code.getLines,
	centerMessage = code.centerMessage;

gt.module('new assertions');

gt.test(function namedTestFunction () {
	gt.expect(0);
});

gt.test('gt.func test', function () {
	gt.func(function () {}, 'empty function');
});

gt.test('arrays', function () {
	gt.aequal([1, 2, 3], [1, 2, 3], 'arrays should be equal');
});

gt.test('array check', function () {
	gt.array([], 'empty array is ok');
	gt.array([1, 3, 3], 'non empty array is ok');
});

gt.test('FAIL: object is not an array', function () {
	gt.array({}, 'object is not an array');
});

gt.test('true number', function () {
	gt.number(4, '4 is a number');
});

gt.test('FAIL: string is NOT a number', function () {
	gt.number('4', '"4" is not a number');
});

gt.test('true string', function () {
	gt.string('foo', 'foo is a string');
});

gt.test('FAIL: string is not a number', function () {
	gt.string(99, '99 is not a string');
});

gt.test('FAIL: string is not a number', function () {
	gt.number('99', '"99" is not a number');
});

gt.module('few basic tests');

gt.test("comparing with undefined", function () {
	gt.expect(1);
	if ("undefined" === typeof ffff) {
		gt.ok(true, "ffff is undefined");
	} else {
		gt.ok(false, "ffff is defined!");
	}
});

gt.test("FAIL: several failed oks", function() {
	gt.ok(false, "ok 1 failed");
	gt.ok(false, "ok 2 failed");
	gt.ok(false, "ok 3 failed");
});

gt.test("CRASH: crash after assertions", function () {
	var obj = {};
	gt.equal(typeof obj, "object", "obj exists");
	// fail assertion on purpose
	gt.equal(typeof obj.foo, "string", "obj.foo is a string");
	// crash on purpose
	gt.equal(typeof bar.foo, "string", "bar is undefined, crash!");
	gt.ok(false, "never reach here");
});

gt.test("CRASH: just crash", function () {
	// crash on purpose
	gt.equal(typeof bar.foo, "string", "bar is undefined, crash!");
	gt.ok(false, "never reach here");
});

gt.test("CRASH: crash inside ok condition", function () {
	gt.ok(typeof obj.foo === "something", "condition on non existent object");
});

gt.test("code functions exist", function () {
	gt.equal(typeof code.getLines, "function", "code.getLines is not a function");
	gt.equal(typeof getLines, "function", "getLines is not a function");
	gt.equal(typeof add, "function", "add is not a function");
	gt.equal(typeof centerMessage, "function", "centerMessage is not a function");
});

gt.module("code functions");

gt.test("get N '='", function () {
	gt.ok(typeof getLines === "function", "getLines is a function");
	gt.equal(getLines(0), "", "0 character");
	gt.equal(getLines(1), "=", "1 character");
	gt.equal(getLines(3), "===", "3 character");
	gt.equal(getLines(6), "======", "6 character");
});

gt.test("center message", function () {
	gt.equal(centerMessage(1, "a"), " a ", "single character");
	gt.equal(centerMessage(2, "a"), " a ", "single character with space");
	gt.equal(centerMessage(3, "a"), " a ", "3 a");
	gt.equal(centerMessage(4, "a"), " a =", "4 a");
	gt.equal(centerMessage(5, "a"), "= a =", "5 a");
	gt.equal(centerMessage(5, "aa"), " aa =", "5 aa");
	gt.equal(centerMessage(5, "a"), "= a =", "5 a");

	gt.equal(centerMessage(1, ""), "=", "1 empty");
	gt.equal(centerMessage(2, ""), "==", "2 empty");
	gt.equal(centerMessage(5, ""), "=====", "5 empty");
});

gt.test("basic +", function () {
	gt.equal(add(1, 2), 3, "1 + 2 = 3");
	gt.equal(add(2, 1), 3, "2 + 1 = 3");
	gt.equal(add(-1, 1), 0, "-1 + 1 = 0");
});

gt.test("FAIL: add is a function", function () {
	gt.ok(typeof add === "function", "add exists and is a function");
	// now fail!
	gt.ok(false, "ok with false condition on purpose");
});

gt.test("FAIL: fail +", function () {
	gt.equal(add(10, 0), 10, "10 + 0 = 10");
	// now fail!
	gt.equal(add(0, 0), 3, "0 + 0 = 3 should fail.");
});

gt.module('module with no tests');