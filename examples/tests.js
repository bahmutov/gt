console.assert(typeof test === "function", "test is undefined");
console.assert(typeof equal === "function", "equal is undefined");
console.assert(typeof ok === "function", "ok is undefined");
console.assert(typeof expect === "function", "expect is undefined");

if (typeof moduleName === "undefined") {
	moduleName = module;
}
console.assert(typeof moduleName === "function", "module is undefined");

// load code to be tested
var code = require("./code");
console.assert(typeof code.add === "function", "add is not defined");

var add = code.add,
	getLines = code.getLines,
	centerMessage = code.centerMessage;

test("test without assertions", function () {
	expect(0);
});

test("wrong number of expected assertions", function () {
	expect(-2);
});

test("crash after assertions", function () {
	var obj = {};
	equal(typeof obj, "object", "obj exists");
	// fail assertion on purpose
	equal(typeof obj.foo, "string", "obj.foo is a string");
	// crash on purpose
	equal(typeof bar.foo, "string", "bar is undefined, crash!");
	ok(false, "never reach here");
});

test("just crash", function () {
	// crash on purpose
	equal(typeof bar.foo, "string", "bar is undefined, crash!");
	ok(false, "never reach here");
});

test("incomplete", function () {
	expect(4);
	ok(true, "single existing assertion out of 4");
});

test("incomplete with failed tests", function () {
	expect(4);
	ok(true, "good assertion out of 4");
	ok(false, "bad assertion out of 4");
});

test("crash inside ok condition", function () {
	ok(typeof obj.foo === "something", "condition on non existent object");
});

test("code functions exist", function () {
	equal(typeof code.getLines, "function", "code.getLines is not a function");
	equal(typeof getLines, "function", "getLines is not a function");
	equal(typeof add, "function", "add is not a function");
	equal(typeof centerMessage, "function", "centerMessage is not a function");
});

moduleName("code functions");

test("get N '='", function () {
	ok(typeof getLines === "function", "getLines is a function");
	equal(getLines(0), "", "0 character");
	equal(getLines(1), "=", "1 character");
	equal(getLines(3), "===", "3 character");
	equal(getLines(6), "======", "6 character");
});

test("center message", function () {
	equal(centerMessage(1, "a"), " a ", "single character");
	equal(centerMessage(2, "a"), " a ", "single character with space");
	equal(centerMessage(3, "a"), " a ", "3 a");
	equal(centerMessage(4, "a"), " a =", "4 a");
	equal(centerMessage(5, "a"), "= a =", "5 a");
	equal(centerMessage(5, "aa"), " aa =", "5 aa");
	equal(centerMessage(5, "a"), "= a =", "5 a");
	
	equal(centerMessage(1, ""), "=", "1 empty");
	equal(centerMessage(2, ""), "==", "2 empty");
	equal(centerMessage(5, ""), "=====", "5 empty");
});

test("add is a function", function () {
	ok(typeof add === "function", "add exists and is a function");
	// now fail!
	ok(false, "ok with false condition on purpose");
});

test("basic +", function () {
	equal(add(1, 2), 3, "1 + 2 = 3");
	equal(add(2, 1), 3, "2 + 1 = 3");
	equal(add(-1, 1), 0, "-1 + 1 = 0");
});

test("fail +", function () {
	equal(add(10, 0), 10, "10 + 0 = 10");
	// now fail!
	equal(add(0, 0), 3, "0 + 0 = 3 should fail.");
});