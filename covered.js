var sure = require('./sure');
var coverage = require("./lib/coverage");
var path = require('path');
var fs = require('fs');
var watch = require('nodewatch');

var config = {
	files: [], // files to compute coverage for
	cover: null, // output cover folder name
	log: 1, // log level
	colors: true,
	output: false, // hide console.log messages by default
	watch: false, // watch files, rerun if changed
	untested: false // call "untested" with coverage results
};

function initConfig(options) {
	options = options || {};
	config.files = options.files || options.module || config.files;
	config.cover = options.cover || config.cover;
	config.report = options.report || 1;
	config.log = options.log || 1;
	config.colors = options.colors || options.color;
	config.output = options.output || config.output;
	config.watch = options.watch || config.watch;
	config.untested = options.untested || config.untested;
}

function init(options) {
	initConfig(options);

	function installCoverage(testModules) {
		console.assert(Array.isArray(testModules), "test modules is not an array");
		if (testModules.length < 1) {
			log.warn('empty list of test modules');
			return;
		}
		var verboseCoverageHook = false;
		coverage.hookRequire(verboseCoverageHook);

		var path = require("path");
		for (var k = 0; k < testModules.length; k += 1) {
			var testModuleName = testModules[k];
			testModuleName = path.resolve(testModuleName);
			log.debug("will add code coverage for", testModuleName);
			testModules[k] = testModuleName;
			coverage.addInstrumentCandidate(testModuleName);
		}
	}

	if (config.cover) {
		installCoverage(config.files);
	} else {
		log.debug('skipping coverage hooks');
	}
	sure.init(options);
}

function writeCoverageReport() {
	if (config.cover && coverage) {
		log.debug("writing code coverage to folder", config.cover);
		coverage.writeReports(config.cover);
	}
}

function coveredPercent(fileLineInfo) {
  var lines = Object.keys(fileLineInfo);

  var covered = 0;
  var total = 0;

  lines.forEach(function(line) {
      var timesCovered = fileLineInfo[line];
      console.assert(timesCovered >= 0, "invalid number of times covered", timesCovered);
      covered += (timesCovered > 0 ? 1 : 0);
      total += 1;
  });

  console.assert(!isNaN(covered), 'number of covered lines', covered, 'is not a number');
  console.assert(!isNaN(total), 'total lines', total, 'is not a number');
  if (total < 1) {
      return 100.0;
  } else {
      return Math.round(covered / total * 100);
  }
}

function writeCoverageSummary(coverFolder, basePath) {
  console.assert(coverage, 'null coverage object');
  console.assert(typeof coverage.getFinalCoverage === 'function', 'getFinalCoverage does not exist');
  var info = coverage.getFinalCoverage();
  console.assert(info, 'could not get final coverage info');
  basePath = basePath || '.';
  console.assert(basePath, 'null base path');

  var coverageReport = {};

  Object.keys(info).forEach(function(filename) {
      var fileInfo = info[filename];
      var covered = coveredPercent(fileInfo.l);
      console.assert(covered >= 0.0 && covered <= 100.0, "invalid coverage % " + covered + " for file " + filename);

      // console.log(filename, covered + '%');
      coverageReport[filename] = {
          name: filename,
          coverage: covered
      };
  });

  if (coverFolder) {
  	var reportFilename = path.join(coverFolder, 'code_coverage_report.json');
  	fs.writeFileSync(reportFilename, JSON.stringify(coverageReport, null, 2));
  	log.info('wrote complexity json to', reportFilename);

  	if (config.untested) {
  		var untested = require('untested');
  		var testFilenames = sure.getTestFilenames();
  		console.assert(Array.isArray(testFilenames), 'expected list of test filenames');

  		untested.update({
  			test: testFilenames, 
  			coverage: coverageReport
  		});
  	}
	}
}

function runTests() {
	var failedAndTests = sure.run();
	writeCoverageReport();
	if (config.cover) {
		writeCoverageSummary(config.cover, '.');
	}
	return failedAndTests;
}

module.exports = {
	init: init,
	run: function() {
		var failedAndTests = runTests();
		console.assert(Array.isArray(failedAndTests), 'expected results array');
		var failed = failedAndTests[0];
		console.assert(failed >= 0, 'number of failed tests should be >= 0');
		var filenames = failedAndTests[1];
		console.assert(Array.isArray(filenames), 'expect filenames to be an array');

		if (config.watch && filenames.length) {
			console.log('watching', filenames.length, 'files...');
			filenames.forEach(function (filename) {
				watch.add(filename);
			});

			var that = this;
			watch.onChange(function (file, prev, curr, action){
				that.init(config);
				log.info('file', file, action);
				runTests();
			});
		}
		return failed;
	}
};