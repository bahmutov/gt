/* jshint indent:2 */
gt.module('two tests, one failing for filtering');

gt.test('good test', function () {
  gt.ok(true, 'good test passes');
});

gt.test('bad test', function () {
  gt.ok(false, 'this test is bad, does not pass');
});
