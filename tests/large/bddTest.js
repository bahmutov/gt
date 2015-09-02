gt.module('BDD interface');

var path = require('path');
var gtPath = path.join(__dirname, '../../bin/gt.js');
var testFile = path.join(__dirname, '../../examples/bdd/spec.js');

gt.async('bdd spec runs', 1, function () {
	gt.exec('node', [gtPath, testFile, '--bdd'], 0, 'gt runs bdd spec');
}, 10000);
