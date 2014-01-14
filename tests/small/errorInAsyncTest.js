gt.module('error in async test handled');

var path = require('path');
var gtPath = path.join(__dirname, '../../gt.js');
var testFile = path.join(__dirname, 'errorinAsync.js');

gt.async('expect error', 1, function () {
  gt.exec('node', [gtPath, testFile], 1, 'gt returns 1');
}, 10000);