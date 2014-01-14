gt.module('error in async');

gt.async('exception inside async test', function () {
  console.log('causing ReferenceError on purpose');
  foo.bar(); // foo is undefined on purpose
});