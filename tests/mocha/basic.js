/* jshint indent:2 */
/* globals describe, it */
var assert = require('assert');
var _ = require('lodash');
var gt = require('../../gt');

describe('gt', function () {
  it('should be available as a module', function () {
    assert(_.isObject(gt), 'gt is an object');
    assert(_.isObject(gt.TestingFramework), 'has testing TestingFramework');
  });
});
