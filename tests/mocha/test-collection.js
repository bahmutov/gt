/* jshint indent:2 */
/* globals describe, it, beforeEach */
var assert = require('assert');
var join = require('path').join;
var _ = require('lodash');
require('console.json');

describe('gt', function () {
  var gt = require('../..').TestingFramework;
  var testsFilename = join(__dirname, '../../examples/basic/tests.js');

  it('test basics', function () {
    assert.equal(typeof gt.collect, 'function', 'collect function');
    assert(require('fs').existsSync(testsFilename), 'test file exists');
  });

  describe('all test collection', function () {

    beforeEach(function () {
      gt.init();
    });

    it('collects test functions', function () {
      var filenames = gt.collect(testsFilename);
      assert(Array.isArray(filenames), 'returns array');
      assert.equal(filenames.length, 1, 'single file');
    });

    it('can get all tests after collection', function () {
      gt.collect(testsFilename);
      var tests = gt.getAllTests();
      assert(Array.isArray(tests), 'returns an array of tests');
      assert(tests.length > 10, 'there are lots of tests');
      assert(tests.every(function (t) {
        return t.name;
      }), 'every test has a name');
    });

    it('look at one test', function () {
      gt.collect(testsFilename);
      var tests = gt.getAllTests();
      var t = _.find(tests, {
        name: 'array check'
      });
      assert.equal(t.name, 'array check');
      assert(t.code, 'has code');
      var code = t.code.toString();
      assert.equal(typeof code, 'string', 'code can be serialized');
      assert(/gt\.array/.test(code), 'has correct content');
    });
  });

  describe('filtering collected tests', function () {

    beforeEach(function () {
      gt.init();
    });

    it('filters function by name', function () {
      var filter = /^array/;
      gt.collect(testsFilename, filter);
      var tests = gt.getAllTests();
      assert.equal(tests.length, 2, '2 unit tests with array in the name');
    });

  });
});
