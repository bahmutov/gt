gt.module('loading crash test');

var path = require('path');
var gtPath = path.join(__dirname, '../../gt.js');
var testFile = path.join(__dirname, 'loadingCrash.js');

gt.async('loading crashing module', 1, function () {
	gt.exec('node', [gtPath, testFile], 1, 'gt returns 1');
}, 10000);