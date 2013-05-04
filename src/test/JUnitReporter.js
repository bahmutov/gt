delete require.cache[require.resolve('../JUnitReporter')];
var reporter = require('../JUnitReporter').Reporter;
var fs = require('fs');

QUnit.module('JUnitReporter');

QUnit.test('log empty list of modules', function () {
	var filename = 'report.xml';
	reporter.log([], filename);
	QUnit.ok(fs.existsSync(filename), 'file', filename, 'exists');
	fs.unlinkSync(filename);
});