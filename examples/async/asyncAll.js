var Q = require('q');

var counter = 0;

gt.module('module setup, teardown and tests are async', {
  setup: function () {
    var defer = Q.defer();
    setTimeout(function () {
      console.log('module setup finished');
      counter += 1;
      defer.resolve();
    }, 1000);
    return defer.promise;
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

gt.async('first test', function () {
  gt.equal(counter, 1, 'setup finished');

  process.nextTick(function () {
    counter += 10;
    gt.start();
  });
});

gt.test('second test', function () {
  gt.equal(counter, 13, 'setup / first test / teardown / setup finished');
});
