var Q = require('Q');

var counter = 0;

gt.module('module setup and tear down return a promise', {
  setup: function () {
    counter += 1;
  },
  teardown: function () {
    var defer = Q.defer();
    setTimeout(function () {
      console.log('module teardown finished');
      counter += 1;
      defer.resolve();
    }, 1000);
    return defer.promise;
  }
});

gt.test('first test', function () {
  gt.equal(counter, 1, 'setup finished');
});

gt.test('second test', function () {
  // enable once module teardown async support is complete
  gt.equal(counter, 3, 'setup / teardown / setup finished');
});
