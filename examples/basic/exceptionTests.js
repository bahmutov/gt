if (typeof moduleName === "undefined") {
	moduleName = module;
}

moduleName("exception testing");

test("raises exists", function () {
	equal(typeof raises, "function", "raises exists");
});

test("CRASH: raises crashes without error type", function () {
	raises(function () {});
});

test("CRASH: raises crashes without message", function () {
	raises(function () {}, Error);
});

test("FAIL: catches if exception is not thrown", function () {
	raises(function () {
		return "foo";
	}, Error, "function does not raises an exception on purpose");
});

test("FAIL: raises wrong type", function () {
	raises(function () {
		throw "something";
	}, Error, "function raises an error");
});

test("correct raises string", function () {
	raises(function () {
		throw "something";
	}, "string", "function raises a string");
});

test("correct raises Error", function () {
	raises(function () {
		throw new Error("something");
	}, Error, "function raises an Error");
});