// mimics BDD (mocha, jasmine) interface using gt methods
// only implements a basic few methods

var beforeEachCallbacks, afterEachCallbacks;

function runBefore() {
  if (Array.isArray(beforeEachCallbacks)) {
    beforeEachCallbacks.forEach(function (fn) {
      fn();
    });
  }
}

function runAfter() {
  if (Array.isArray(afterEachCallbacks)) {
    afterEachCallbacks.forEach(function (fn) {
      fn();
    });
  }
}

global.it = function it(name, code) {

  function fullTest() {
    runBefore();
    code();
    runAfter();
  }

  gt.test(name, fullTest);
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
