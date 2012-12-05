// var gt = require('../../sure.js');
// gt.init();
// var coverage = require("../../lib/coverage");

/*
 * Qt+WebKit powered headless test runner using Phantomjs
 *
 * Phantomjs installation: http://code.google.com/p/phantomjs/wiki/BuildInstructions
 *
 * Run with:
 *  phantomjs runner.js [url-of-your-qunit-testsuite]
 *
 * E.g.
 *      phantomjs runner.js http://localhost/qunit/test
 */

var fs = require('fs');

/*jshint latedef:false */
/*global phantom:true require:true console:true */
var url = phantom.args[0],
	page = require('webpage').create();

if (!url) {
	console.error("missing page url");
	phantom.exit(-1);
}

// Route "console.log()" calls from within the Page context to the main Phantom context (i.e. current "this")
page.onConsoleMessage = function(msg) {
	console.log(msg);
};

page.onInitialized = function() {
	page.evaluate(addLogging);
};
page.open(url, function(status){
	if (status !== "success") {
		console.log("Unable to access network: " + status);
		phantom.exit(1);
	} else {
		// page.evaluate(addLogging);
		var interval = setInterval(function() {
			if (finished()) {
				clearInterval(interval);
				onfinishedTests();
			}
		}, 500);
	}
});

function finished() {
	return page.evaluate(function(){
		return !!window.qunitDone;
	});
}


function coveredPercent(fileLineInfo) {
	console.assert(fileLineInfo, "undefined file line info");
	// console.log("file info", fileLineInfo);

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

function writeCoverageSummary(info, coverFolder, basePath) {
  console.assert(info, 'could not get final coverage info');
  basePath = basePath || '.';
  console.assert(basePath, 'null base path');

  var coverageReport = {};

  Object.keys(info).forEach(function(filename) {
      var fileInfo = info[filename];
      console.log(filename, "file info", JSON.stringify(fileInfo.s));

      // var covered = coveredPercent(fileInfo.l);
      var covered = coveredPercent(fileInfo.s);
      console.assert(covered >= 0.0 && covered <= 100.0, "invalid coverage % " + covered + " for file " + filename);

      var relativePath = basePath + '\\' + path.relative(basePath, filename);
      // console.log(relativePath, covered + '%');

      coverageReport[relativePath] = {
          name: relativePath,
          coverage: covered
      };
  });
  console.log(coverageReport);

  /*
  var reportFilename = coverFolder + '\\code_coverage_report.json';
  fs.writeFileSync(reportFilename, JSON.stringify(coverageReport));
  log.info('wrote complexity json to', reportFilename);
  */
}

function onfinishedTests() {
	var output = page.evaluate(function() {
			return JSON.stringify(window.qunitDone);
	});

	var testResults = JSON.parse(output);
	var codeCoverageResults = page.evaluate(function() {
		return window.__coverage__;
	});
	// console.log('code coverage results\n', codeCoverageResults);
	// writeCoverageSummary(codeCoverageResults, 'report');
	var file = fs.open('code_coverage_report.json', "w");
  file.writeLine(JSON.stringify(codeCoverageResults));
  file.close();

	phantom.exit(testResults.failed > 0 ? 1 : 0);
}

function addLogging() {
	window.document.addEventListener( "DOMContentLoaded", function() {
		var current_test_assertions = [];

		QUnit.testDone(function(result) {
			var i,
				name = result.module + ': ' + result.name;

			if (result.failed) {
				console.log('Assertion Failed: ' + name);

				for (i = 0; i < current_test_assertions.length; i++) {
					console.log('    ' + current_test_assertions[i]);
				}
			}

			current_test_assertions = [];
		});

		QUnit.log(function(details) {
			var response;

			if (details.result) {
				return;
			}

			response = details.message || '';

			if (typeof details.expected !== 'undefined') {
				if (response) {
					response += ', ';
				}

				response += 'expected: ' + details.expected + ', but was: ' + details.actual;
			}

			current_test_assertions.push('Failed assertion: ' + response);
		});

		QUnit.done(function(result){
			console.log('Took ' + result.runtime +  'ms to run ' + result.total + ' tests. ' + result.passed + ' passed, ' + result.failed + ' failed.');
			window.qunitDone = result;
		});
	}, false );
}
