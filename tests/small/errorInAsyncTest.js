gt.module('error in async test handled');

var path = require('path');
var gtPath = path.join(__dirname, '../../gt.js');
var testFile = path.join(__dirname, 'errorInAsync.js');
var fs = require('fs');

gt.test('file exists', function () {
  gt.ok(fs.existsSync(testFile), 'file', testFile, 'exists');
});

gt.async('expect error', 1, function () {
  gt.exec('node', [gtPath, testFile], 1, 'gt returns 1');
}, 10000);