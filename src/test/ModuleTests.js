delete require.cache[require.resolve('../ModuleTests')];
var ModuleTests = require('../ModuleTests').ModuleTests;

QUnit.module('ModuleTests');

QUnit.test('default tests', function () {
	var m = new ModuleTests();
	QUnit.ok(!m.hasFailed(), 'nothing has failed by default');
	QUnit.equal(m.getNumberOfTests(), 0, 'no tests');
	QUnit.ok(!m.getFilename(), 'first filename undefined');
	QUnit.ok(Array.isArray(m.getTests()), 'returns an empty array of tests');
	var filenames = m.getTestFilenames();
	QUnit.equal(filenames.length, 0, 'no test filenames');
	QUnit.ok(!m.hasFailed(), 'nothing has failed yet');
	var failed = m.getFailedTests();
	QUnit.ok(Array.isArray(failed), 'returns array');
	QUnit.equal(failed.length, 0, 'nothing has failed');
	QUnit.equal(m.getPassedTests(), 0, 'nothing passed by default');
	QUnit.equal(m.passedPercentage(), 100, '100% passed');
});

QUnit.test('add test', function () {
	var m = new ModuleTests();
	m.add('test1', function () {}, 'foo.js');
	QUnit.equal(m.getNumberOfTests(), 1, 'single test');
	QUnit.equal(m.getFilename(), 'foo.js', 'first filename');
	QUnit.ok(Array.isArray(m.getTests()), 'returns an array of tests');
	var filenames = m.getTestFilenames();
	QUnit.equal(filenames.length, 1, 'single test filename');
	QUnit.equal(filenames[0], 'foo.js', 'correct filename');
	QUnit.ok(!m.hasFailed(), 'nothing has failed yet');
	var failed = m.getFailedTests();
	QUnit.ok(Array.isArray(failed), 'returns array');
	QUnit.equal(failed.length, 0, 'nothing has failed');
	QUnit.equal(m.getPassedTests(), 1, 'test has passed by default');
	QUnit.equal(m.passedPercentage(), 100, '100% passed');
});