gt.module('throws');

gt.test("throws exists", function () {
    gt.func(gt.throws, "throws function exists");
});

gt.test("throws a string", function () {
    gt.throws(function () {
        throw "something";
    }, "string", "function throws a string");
});

gt.test("throws Error", function () {
    gt.throws(function () {
        throw new Error("something");
    }, Error, "function throws an Error");
});