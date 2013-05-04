gt.module('two failing unit tests');

gt.test('first failing test', function() {
	gt.ok(false, 'assertion fails');
});

gt.test('second failing test', function() {
	gt.ok(false, 'assertion fails');
});