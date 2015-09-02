gt.module('skipped tests');

var path = require('path');
var gtPath = path.join(__dirname, '../../bin/gt.js');
var testFile = path.join(__dirname, 'skip.js');

gt.async('call skip tests', 1, function () {
	gt.exec('node', [gtPath, testFile], 0, 'gt returns 0');
}, 10000);
