gt.module('module.setup crashes');

var path = require('path');
var gtPath = path.join(__dirname, '../../bin/gt.js');
var testFile = path.join(__dirname, 'setupException.js');

gt.async('expect fail on exception in module\'s setup', 1, function () {
  gt.exec('node', [gtPath, testFile], 1, 'gt returns 1');
}, 10000);
