gt.module('loading failing test');

var path = require('path');
var gtPath = path.join(__dirname, '../../gt.js');
var testFile = path.join(__dirname, 'oneFails.js');

gt.async('expect fail', 1, function () {
	gt.exec('node', [gtPath, testFile], 1, 'gt returns 1');
}, 10000);