// mimics BDD (mocha, jasmine) interface using gt methods
// only implements a basic few methods

var beforeEachCallbacks, afterEachCallbacks;

global.it = function it(name, code) {

  if (Array.isArray(beforeEachCallbacks)) {
    beforeEachCallbacks.forEach(function (fn) {
      fn();
    });
  }

  gt.test(name, code);

  if (Array.isArray(afterEachCallbacks)) {
    afterEachCallbacks.forEach(function (fn) {
      fn();
    });
  }
};

global.describe = function describe(name, code) {
  beforeEachCallbacks = [];
  afterEachCallbacks = [];

  gt.module('name');
  code();
};

global.beforeEach = function beforeEach(fn) {
  beforeEachCallbacks.push(fn);
};

global.afterEach = function afterEach(fn) {
  afterEachCallbacks.push(fn);
};
