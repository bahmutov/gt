/* jshint indent:2 */
/* globals describe, it */
var assert = require('assert');
var join = require('path').join;
var _ = require('lodash');
require('console.json');

describe('gt', function () {
  describe('test collection', function () {
    var gt = require('../..').TestingFramework;

    it('has collect method', function () {
      assert.equal(typeof gt.collect, 'function');
    });

    it('collects test functions', function () {
      var filename = join(__dirname, '../../examples/basic/tests.js');
      var filenames = gt.collect(filename);
      assert(Array.isArray(filenames), 'returns array');
      assert.equal(filenames.length, 1, 'single file');
    });

    it('can get all tests after collection', function () {
      var filename = join(__dirname, '../../examples/basic/tests.js');
      gt.collect(filename);
      var modules = gt.getAllTests();
      assert(Array.isArray(modules), 'returns an array of tests');
      assert(modules.length > 10, 'there are lots of tests');
      assert(modules.every(function (t) {
        return t.name;
      }), 'every test has a name');
    });

    it('look at one test', function () {
      var filename = join(__dirname, '../../examples/basic/tests.js');
      gt.collect(filename);
      var modules = gt.getAllTests();
      var t = _.find(modules, {
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

  });
});
