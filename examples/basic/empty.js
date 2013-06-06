gt.module('empty');

gt.test('empty values', function () {
    gt.func(gt.empty, 'have empty assertion');
    gt.empty([], 'empty array');
    gt.empty('', 'empty string');
    gt.empty({}, 'empty object');
});

gt.test('FAIL not empty array', function () {
    gt.empty(['f'], 'non empty array');
});

gt.test('FAIL not empty object', function () {
    gt.empty({foo: 'foo'}, 'non empty object');
});

gt.test('FAIL not empty string', function () {
    gt.empty('fff', 'non empty string');
});

gt.test('FAIL unknown empty type', function () {
    gt.empty(0, 'cannot handle a number');
});