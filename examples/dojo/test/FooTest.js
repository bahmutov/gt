define([
    "src/Foo.js"
], function (foo) {
    moduleName("Foo tests");
    test("Foo tests", function () {
        equal(typeof foo, 'function', 'foo is a function');
        equal(foo(), 'foo', 'foo returns string foo');
    });
});