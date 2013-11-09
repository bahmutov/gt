gt.module('exception in teardown', {
  teardown: function () {
    foo.bar = false;
    // cause ReferenceError on purpose
  }
});

gt.test('a test', 0, function () {});
