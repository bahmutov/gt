/* jshint indent:2 */
gt.module('loading expected crash');

var join = require('path').join;
var gtPath = join(__dirname, '../../gt.js');
var testFile = join(__dirname, 'filterCLI.js');

gt.async('selecting only good test', 1, function () {
  gt.exec('node', [gtPath, testFile, '--test', 'good'], 0, 'good test passes');
}, 10000);

gt.async('selecting only good test using more complicated regexp', 1, function () {
  gt.exec('node', [gtPath, testFile, '--test', '.ood'], 0, 'good test passes');
}, 10000);

gt.async('filtering alias', 1, function () {
  gt.exec('node', [gtPath, testFile, '--filter', '..od'], 0, 'good test passes');
}, 10000);
