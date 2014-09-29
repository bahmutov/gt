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
  var setup = false;

  beforeEach(function () {
    setup = true;
  });

  afterEach(function () {
    ranAfterEach = true;
  });

  it('ran before each callback', function () {
    console.assert(setup, 'setup is true');
  });
});

it('ran after each', function () {
  console.assert(ranAfterEach, 'ran after each');
});
