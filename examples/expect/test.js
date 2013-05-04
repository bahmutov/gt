gt.module('expect');

gt.test('set number of expected', 2, function() {
	gt.ok(true, '1/2 assertion');
	gt.ok(true, '2/2 assertion');
});

gt.test('INCOMPLETE: exceed number of expected', 2, function() {
	gt.ok(true, '1/2 assertion');
	gt.ok(true, '2/2 assertion');
	gt.ok(true, '3/2 assertion');
});

gt.test('change number of expected assertions', function() {
	gt.expect(2);
	gt.expect(3);
	gt.ok(true, '1/3 assertion');
	gt.ok(true, '2/3 assertion');
	gt.ok(true, '3/3 assertion');
})

gt.test("test without assertions", function () {
	gt.expect(0);
});

gt.test("CRASH: wrong number of expected assertions", function () {
	gt.expect(-2);
});

gt.test("INCOMPLETE: incomplete", function () {
	gt.expect(4);
	gt.ok(true, "single existing assertion out of 4");
});

gt.test("INCOMPLETE: incomplete with failed tests", function () {
	gt.expect(4);
	gt.ok(true, "good assertion out of 4");
	gt.ok(false, "bad assertion out of 4");
});

gt.test('INCOMPLETE: more assertions than expected', function () {
	gt.expect(2);
	gt.ok(true, '1/2 assertion');
	gt.ok(true, '2/2 assertion');
	gt.ok(true, '3/2 assertion');
});

gt.test('INCOMPLETE: more assertions and crashing', function () {
	gt.expect(2);
	gt.ok(true, '1/2 assertion');
	gt.ok(true, '2/2 assertion');
	gt.ok(false, '3/2 assertion is false');
});