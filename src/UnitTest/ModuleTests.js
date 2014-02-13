/* jshint indent:2 */
var Test = require('./Test').Test;
var _ = require('lodash');
var check = require('check-types');
var verify = check.verify;
var pluck = require('../utils/pluckFunction');
verify.fn(pluck, 'could not load pluck function');

var noop = function () {};

var ModuleTests = function (name, lifecycle) {
  this._tests = [];
  if (name) {
    verify.unemptyString(name, 'module name should be a string, not', name);
  }
  this.name = name || 'default';
  if (lifecycle) {
    check.verify.object(lifecycle, 'lifecycle should be an object');
  }
  this.lifecycle = lifecycle || {};
  this.lifecycle.setup = this.lifecycle.setup || noop;
  this.lifecycle.teardown = this.lifecycle.teardown || noop;

  // crashed somewhere in the lifecycle functions
  this.crashed = false;
};

ModuleTests.prototype.add = function (options) {
  verify.object(options, 'missing test options');
  verify.string(options.name, 'missing test name');
  verify.fn(options.code, 'expected a test function');
  verify.string(options.filename, 'expected a filename string');

  verify.array(this._tests, 'this._tests is defined');
  options.moduleName = this.name;
  var test = new Test(options);
  this._tests.push(test);
};

ModuleTests.prototype.getNumberOfTests = function () {
  return this._tests.length;
};

ModuleTests.prototype.getTests = function () {
  return this._tests;
};

ModuleTests.prototype.getFilename = function () {
  var filenames = this.getTestFilenames();
  verify.array(filenames, 'filenames should be an array');
  return filenames[0];
};

ModuleTests.prototype.getTestFilenames = function () {
  var filenames = _.pluck(this._tests, 'filename');
  filenames = _.uniq(filenames);
  return filenames;
};

ModuleTests.prototype.hasFailed = function () {
  return !this.crashed && this._tests.some(pluck('hasFailed'));
};

ModuleTests.prototype.notRun = function () {
  return !this.getFailedTests() && !this.getPassedTests();
};

ModuleTests.prototype.getFailedTests = function () {
  verify.array(this._tests, 'tests are not defined');
  var failedTests = this._tests.filter(pluck('hasFailed'));
  return failedTests;
};

ModuleTests.prototype.getPassedTests = function () {
  return this._tests.reduce(function (good, test) {
    return good + !test.hasFailed();
  }, 0);
};

ModuleTests.prototype.passedPercentage = function () {
  var failed = this.getFailedTests();
  var goodTests = this._tests.length - failed.length;
  var percent = (this._tests.length > 0 ? goodTests / this._tests.length : 1) * 100;
  return percent;
};

ModuleTests.prototype.duration = function () {
  if (this.crashed) {
    return 0;
  }
  return this._tests.reduce(function (total, test) {
    return total += test.duration();
  }, 0);
};

ModuleTests.prototype.filterTests = function (expression) {
  console.assert(_.isRegExp(expression), 'filter expression should be RegExp');
  this._tests = this._tests.filter(function (test) {
    return expression.test(test.name);
  });
};

exports.ModuleTests = ModuleTests;
