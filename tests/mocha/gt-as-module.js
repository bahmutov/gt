/* jshint indent:2 */
/* globals describe, it */
require('lazy-ass');
var check = require('check-types');
var join = require('path').join;
var exists = require('fs').existsSync;

describe('gt as module', function () {
  var gt = require('../..');
  la(check.object(gt), 'expected gt', gt);
  var testsFilename = join(__dirname, '../../examples/basic/tests.js');
  la(exists(testsFilename), 'missing file', testsFilename);

  it('has framework', function () {
    la(check.object(gt.TestingFramework), 'missing pure testing framework', gt);
  });

  it('runs basic tests without coverage', function (done) {
    var options = {
      files: [testsFilename]
    };
    la(gt.TestingFramework.init(options), 'could not init', options);
    gt.TestingFramework.run(function finished(failedN) {
      la(failedN === 0, 'expected no failures');
      done();
    });
  });
});
