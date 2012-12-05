require(["src/Foo"], function (foo) {
	console.log('Running Foo tests');
  gt.module("Foo tests");
  gt.test("Foo tests", function () {
		gt.equal(typeof foo, 'function', 'foo is a function');
    gt.equal(foo(), 'foo', 'foo returns string foo');
  });
});