gt.module('exception in setup', {
  setup: function () {
    foo.bar = false;
    // cause ReferenceError on purpose
  }
});

gt.test('a test', 0, function () {});
