gt.module('incomplete expect');

gt.test("INCOMPLETE: expect 4 get 0", function () {
	gt.expect(4);
});

gt.test("INCOMPLETE: expect 4 get 1", function () {
	gt.expect(4);
	gt.ok(true, "single existing assertion out of 4");
});

gt.test("INCOMPLETE: expect 4 get 2", function () {
	gt.expect(4);
	gt.ok(true, "good assertion out of 4");
	gt.ok(false, "bad assertion out of 4");
});