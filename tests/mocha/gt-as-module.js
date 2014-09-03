/* jshint indent:2 */
/* globals describe, it */
require('lazy-ass');
var check = require('check-types');
var join = require('path').join;
var exists = require('fs').existsSync;

describe('gt as module', function () {
  var gt = require('../..');
  la(check.object(gt), 'expected gt', gt);

  it('has pure unit test framework (without coverage)', function () {
    la(check.object(gt.TestingFramework), 'missing pure testing framework', gt);
  });

  it('has unit test framework with coverage', function () {
    la(check.object(gt.TestingWithCoverage), 'missing testing framework coverage', gt);
  });

  it('runs basic tests without coverage', function (done) {
    var testsFilename = join(__dirname, '../../examples/basic/tests.js');
    la(exists(testsFilename), 'missing file', testsFilename);
    var options = {
      files: [testsFilename]
    };
    la(gt.TestingFramework.init(options), 'could not init', options);
    gt.TestingFramework.run(function finished(failedN) {
      la(failedN === 0, 'expected no failures');
      done();
    });
  });

  it('runs bdd test without coverage', function (done) {
    var bddTestFilename = join(__dirname, '../../examples/bdd/spec.js');
    la(exists(bddTestFilename), 'missing file', bddTestFilename);

    var options = {
      files: [bddTestFilename],
      bdd: true
    };
    la(gt.TestingFramework.init(options), 'could not init', options);
    gt.TestingFramework.run(function finished(failedN) {
      la(failedN === 0, 'expected no failures');
      done();
    });
  });

  it('runs bdd test WITH coverage', function (done) {
    var bddTestFilename = join(__dirname, '../../examples/bdd/spec.js');
    la(exists(bddTestFilename), 'missing file', bddTestFilename);
    var outputCoverage = join(__dirname, 'coverage');

    var options = {
      files: [bddTestFilename],
      bdd: true,
      cover: outputCoverage
    };
    la(gt.TestingWithCoverage.init(options), 'could not init', options);
    gt.TestingWithCoverage.run(function finished(failedN) {
      la(failedN === 0, 'expected no failures');
      la(exists(outputCoverage), 'created output coverage folder', outputCoverage);
      done();
    });
  });
});
