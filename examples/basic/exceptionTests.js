gt.module("exception testing");

gt.test("raises exists", function () {
	gt.equal(typeof gt.raises, "function", "raises exists");
});

gt.test("CRASH: raises crashes without error type", function () {
	gt.raises(function () {});
});

gt.test("CRASH: raises crashes without message", function () {
	gt.raises(function () {}, Error);
});

gt.test('expect AssertionError', function () {
	gt.raisesAssertion(function () {
		console.assert(false, 'this always raises assertion error');
	}, 'should raise assertion error');
});

gt.test("FAIL: catches if exception is not thrown", function () {
	gt.raises(function () {
		return "foo";
	}, Error, "function does not raises an exception on purpose");
});

gt.test("FAIL: raises wrong type", function () {
	gt.raises(function () {
		throw "something";
	}, Error, "function raises an error");
});

gt.test("correct raises string", function () {
	gt.raises(function () {
		throw "something";
	}, "string", "function raises a string");
});

gt.test("correct raises Error", function () {
	gt.raises(function () {
		throw new Error("something");
	}, Error, "function raises an Error");
});