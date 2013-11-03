var Q = require('q');
var once = require('lodash').once;

var counter = 0;

function init() {
  var defer = Q.defer();
  setTimeout(function () {
    counter += 1;
    defer.resolve(counter);
  }, 1000);
  return defer.promise;
}

gt.module('async init module once', {
  setup: once(init)
});

gt.test('first init', function () {
  gt.equal(counter, 1, 'first init set counter to 1');
});

gt.test('second test', function () {
  gt.equal(counter, 1, 'second init has not done anything');
});
