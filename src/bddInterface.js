// mimics BDD (mocha, jasmine) interface using gt methods
// only implements a basic few methods

var beforeEachCallbacks = [], afterEachCallbacks = [];

function runCallbacks(callbacks) {
  callbacks.forEach(function (fn) {
    fn();
  });
}

global.it = function it(name, code) {

  var before = beforeEachCallbacks.slice(0);
  var after = afterEachCallbacks.slice(0);
  function fullTest() {
    runCallbacks(before);
    code();
    runCallbacks(after);
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
