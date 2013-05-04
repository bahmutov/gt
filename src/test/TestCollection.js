delete require.cache[require.resolve('../TestCollection')];
var tc = require('../TestCollection').TestCollection;

QUnit.module('TestCollection');

QUnit.test('default collection', function () {
	var filenames = tc.getTestFilenames();
	QUnit.ok(Array.isArray(filenames), 'returns list of test filenames');
	QUnit.equal(filenames.length, 0, 'empty list');

	tc.setTestFilename('foo.js');
	filenames = tc.getTestFilenames();
	QUnit.ok(Array.isArray(filenames), 'returns list of test filenames');
	QUnit.equal(filenames.length, 1, 'list with single test filename');	

	var tests = tc.getAllTests();
	QUnit.equal(tests.length, 0, 'there are no tests');
	QUnit.equal(tc.getNumberOfTests(), 0, 'returns zero');
	QUnit.equal(tc.getFailedTests().length, 0, 'zero failed tests');
	QUnit.equal(tc.passedPercentage(), 100, '100% passed');
});