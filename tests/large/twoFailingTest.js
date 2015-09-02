gt.module('exit code = number of failed unit tests');

var path = require('path');
var gtPath = path.join(__dirname, '../../bin/gt.js');
var testFile = path.join(__dirname, 'twoFailing.js');

gt.async('two failing unit tests', 1, function () {
	gt.exec('node', [gtPath, testFile], 2, 'gt returns 2');
}, 10000);
