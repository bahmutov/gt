gt.module('loading expected crash');

var path = require('path');
var gtPath = path.join(__dirname, '../../gt.js');
var testFile = path.join(__dirname, 'expectedCrash.js');

gt.async('expecting crash', 1, function () {
	gt.exec('node', [gtPath, testFile], 1, 'gt returns 1');
}, 10000);