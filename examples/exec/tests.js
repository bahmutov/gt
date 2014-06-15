gt.module('testing foo execution');

var path = require('path');
var fs = require('fs');
var spawn = require('child_process').spawn;

var folder = __dirname;
var fooPath = path.join(folder, 'foo.js');

gt.test('foo is valid', function () {
	gt.ok(fs.existsSync(fooPath), fooPath, 'exists');
});

gt.async('explicit spawn 1', function () {
	var program = spawn('node', [fooPath]);
	program.on('exit', function (code) {
		gt.equal(code, 0, 'expected return code 0');
		gt.start();
	});
});

gt.async('explicit spawn 2', function () {
	var program = spawn('node', [fooPath, 2, 3, 4]);
	program.on('exit', function (code) {
		gt.equal(code, 3, 'wrong return code');
		gt.start();
	});
});

gt.async('test without arguments', function () {
	gt.exec('node', [fooPath], 0,
		'should return 0 without any arguments');
});

gt.async('test with 1 argument', function () {
	gt.exec('node', [fooPath, 2], 1,
		'should return 1 if there is 1 argument');
});

gt.async('without exit code assumes code 0', function () {
	gt.exec('node', [fooPath],  'should return 0 without any arguments');
});

gt.async('without arguments or exit code', function () {
	gt.exec('ls', 'should return 0 without any arguments');
});

gt.async('without message', function () {
	gt.exec('node', ['-v']);
});
