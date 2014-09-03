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
