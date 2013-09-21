function linesString() {
  return 'this is\n' +
    'a string\n' +
    'across multiple lines\n';
}

gt.module('long strings in equal assertions');

gt.test('FAIL: compare long strings', function () {
  var str1 = 'this is a long string, so it should not appear on one line';
  var str2 = 'this is a second long string, so it should not appear on one line';
  gt.equal(str1, str2);
});

gt.test('FAIL: compare long strings with message', function () {
  var str1 = 'this is a long string, so it should not appear on one line';
  var str2 = 'this is a second long string, so it should not appear on one line';
  gt.equal(str1, str2, 'comparing two long different strings');
});

gt.test('FAIL: short strings', function () {
  gt.equal('foo', 'bar', 'two different short strings');
});

gt.test('FAIL: multiline strings', function () {
  gt.equal('foo', linesString(), 'short string vs multi line string');
});