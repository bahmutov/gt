var Q = require('Q');

var asyncSetupFinished;

gt.module('module setup returns a promise', {
  setup: function () {
    var defer = Q.defer();
    setTimeout(function () {
      console.log('module setup finished');
      asyncSetupFinished = true;
      defer.resolve();
    }, 1000);
    return defer.promise;
  }
});

gt.test('test after async module setup', function () {
  console.log('testing after async setup');

  gt.ok(true, 'simple assertion');
  // enable once module setup async support is complete
  gt.ok(asyncSetupFinished, 'module setup was async');
});

gt.module('module without any setup');

gt.test('normal test', function () {
  gt.ok(true, 'normal test finished');
});
