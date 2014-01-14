gt.module('module.teardown crashes');

var path = require('path');
var gtPath = path.join(__dirname, '../../gt.js');
var testFile = path.join(__dirname, 'teardownException.js');

gt.async('expect fail on exception in module\'s teardown', 1, function () {
  gt.exec('node', [gtPath, testFile], 1, 'gt returns 1');
}, 10000);
