var sure = require('./sure');
var coverage = require("./lib/coverage");
var path = require('path');
var fs = require('fs');

var config = {
	files: [], // files to compute coverage for
	cover: null // output cover folder name
};

function initConfig(options) {
	options = options || {};
	config.files = options._ || options.files || config.files;
	config.cover = options.cover || config.cover;
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
			log.log("will add code coverage for", testModuleName);
			testModules[k] = testModuleName;
			coverage.addInstrumentCandidate(testModuleName);
		}
	}

	installCoverage(config.files);
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

      var relativePath = basePath + '\\' + path.relative(basePath, filename);
      // console.log(relativePath, covered + '%');

      coverageReport[relativePath] = {
          name: relativePath,
          coverage: covered
      };
  });
  // console.log(coverageReport);

  var reportFilename = coverFolder + '\\code_coverage_report.json';
  fs.writeFileSync(reportFilename, JSON.stringify(coverageReport));
  log.info('wrote complexity json to', reportFilename);
}

module.exports = {
	init: init,
	run: function() {
		var failed = sure.run();
		writeCoverageReport();
		writeCoverageSummary(config.cover, '.');
		return failed;
	}
};