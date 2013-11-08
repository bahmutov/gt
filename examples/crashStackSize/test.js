var foo = require('./foo');

gt.module('crash stack size');

gt.test('CRASH: long stack should be cut', function () {
  foo(0);
});
