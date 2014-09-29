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
    console.assert(setup === 2, 'both before each blocks ran ' + setup);
    setup = 0;
  });

  it('ran them again', function () {
    console.assert(setup === 2, 'both before each blocks ran ' + setup);
  });

});

it('ran after each', function () {
  console.assert(ranAfterEach, 'ran after each');
});

describe('setting done', function () {
  var done = false;
  function doIt() { done = true; }

  beforeEach(function () {
    done = false;
  });

  it('first spec', function () {
    la(!done, '!done initially');
    doIt();
    la(done);
  });

  it('second spec', function () {
    la(!done, '!done initially');
    doIt();
    la(done);
  });
});
