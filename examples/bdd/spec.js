// BDD interface for GT example
// you can confirm this test is typical BDD
//  mocha -R spec spec.js
it('runs a stand alone test', function () {
  console.assert('foo' === 'foo');
});

describe('addition', function () {
  it('adds integers', function () {
    console.assert(2 + 2 === 4);
  });
});

var ranAfterEach = false;

describe('before and after', function () {
  var setup = 0;

  beforeEach(function () {
    setup = 1;
  });

  beforeEach(function () {
    setup = 2;
  });

  afterEach(function () {
    ranAfterEach = true;
  });

  it('ran before each callback', function () {
    console.assert(setup === 2, 'both before each blocks ran');
    setup = 0;
  });

  it('ran them again', function () {
    console.assert(setup === 2, 'both before each blocks ran');
  });

});

it('ran after each', function () {
  console.assert(ranAfterEach, 'ran after each');
});
