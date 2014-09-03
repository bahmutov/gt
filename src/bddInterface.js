// mimics BDD (mocha, jasmine) interface using gt methods
// only implements few methods
global.it = function (name, code) {
  gt.test(name, code);
};

global.describe = function (name, code) {
  gt.module('name');
  code();
};
