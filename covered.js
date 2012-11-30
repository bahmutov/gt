var sure = require('./sure');
var coverage = require("./lib/coverage");

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

module.exports = {
	init: init,
	run: function() {
		var failed = sure.run();
		writeCoverageReport();
		return failed;
	}
};