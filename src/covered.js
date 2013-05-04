var sure = require('./sure');
var watchFiles = require('./utils/WatchFiles').watchFiles;
var coverage = require("../lib/coverage");
var path = require('path');
var fs = require('fs');
var untested = require('untested');
var _ = require('lodash');
var check = require('check-types');
var unary = require('allong.es').es.unary;
check.verifyFunction(unary, 'unary is not a function');

var optional = require('./utils/utils').optional;
var defaults = require('./utils/utils').defaults;

var config = {
	files: [], // files to compute coverage for
	cover: null, // output cover folder name
	log: 1, // log level
	colors: true,
	output: false, // hide console.log messages by defaults
	watch: false, // watch files, rerun if changed
	untested: false, // call "untested" with coverage results
	target: 'gt', // global object name for framework, for example gt or QUnit
	quickFail: false // exit on first failed test
};

function initConfig(options) {
	options = defaults(options, {});
	config.files = defaults(options.files, options.module, config.files);
	config.cover = defaults(options.cover, config.cover);
	config.report = defaults(options.report, 1);
	config.log = defaults(options.log, 1);
	config.colors = defaults(options.colors, options.color);
	config.output = defaults(options.output, config.output);
	config.watch = defaults(options.watch, config.watch);
	config.untested = defaults(options.untested, config.untested);
	config.target = defaults(options.target, config.target);
	config.quickFail = defaults(options.quickFail, config.quickFail);
}

function excludeFromCoverage(filename) {
	check.verifyString(filename, 'expected filename');

	var excluded = [
	/node_modules/i,
	/dohInterface.js/i,
	/jsunityInterface.js/i
	];

	return _(excluded).invoke('test', filename).some();
}

function installCoverage(testModules) {
	check.verifyArray(testModules, "test modules is not an array");
	if (testModules.length < 1) {
		log.info('empty list of test modules');
		return;
	}

	var verboseCoverageHook = false;
	coverage.hookRequire(verboseCoverageHook,
		sure.preTransform, excludeFromCoverage);

	testModules = testModules.map(unary(path.resolve));
	testModules.forEach(coverage.addInstrumentCandidate);
}

function init(options) {
	initConfig(options);

	optional(installCoverage)(config.cover, config.files);
	sure.init(options);
}

function writeCoverageReport() {
	if (config.cover && coverage) {
		coverage.writeReports(config.cover);
	}
}

function updateUntestedDb(coverageReport) {
	var testFilenames = sure.getTestFilenames();
	check.verifyArray(testFilenames, 'expected list of test filenames');

	untested.update({
		test: testFilenames,
		coverage: coverageReport
	});
}

function writeCoverageSummary(coverFolder, basePath) {
	console.assert(coverage, 'null coverage object');
	check.verifyFunction(coverage.getFinalCoverage, 'getFinalCoverage does not exist');
	var info = coverage.getFinalCoverage();
	check.verifyObject(info, 'could not get final coverage info');
	basePath = defaults(basePath, '.');
	check.verifyString(basePath, 'null base path');

	var coverageReport = untested.getCoverageSummary(info);
	check.verifyObject(coverageReport, 'could not get coverage summary from\n', JSON.stringify(info, null, 2));

	if (coverFolder) {
		var reportFilename = path.join(coverFolder, 'code_coverage_report.json');
		fs.writeFileSync(reportFilename, JSON.stringify(coverageReport, null, 2));
		log.info('wrote coverage json to', reportFilename);

		optional(updateUntestedDb)(config.untested, coverageReport);
	}
}

function runTests(callback) {
	sure.run(function (failed, filenames) {
		writeCoverageReport();
		optional(writeCoverageSummary)(config.cover, config.cover, '.');
		if (check.isFunction(callback)) {
			callback(failed, filenames);
		}
	});
}

function onFileChanged(file, prev, curr, action) {
	init(config);
	log.info('file', file, action);
	runTests();
}

function run(callback) {
	check.verifyFunction(callback, 'expected callback function');

	runTests(function (failed, filenames) {
		console.assert(failed >= 0, 'number of failed tests should be >= 0');
		check.verifyArray(filenames, 'expect filenames to be an array');

		optional(watchFiles)(config.watch, filenames, onFileChanged);
		callback(failed);
	});
}

module.exports = {
	init: init,
	run: run
};