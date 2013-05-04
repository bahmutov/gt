#!/usr/bin/env node

try {
	var log = require("custom-logger");
} catch (err) {
	console.error(err);
	console.error('could not load custom logger, have you forgot to run npm install?');
	process.exit(-1);
}

var options = require('./src/options').run();
if (typeof options.module === 'string') {
	options.module = [options.module];
}

var covered = require('./src/covered');
console.assert(typeof covered === "object", 'could not load test framework');

var sure = require('./src/sure');
var logger = require('optional-color-logger');

var discoverSourceFiles = require('./src/utils/discoverFiles').discoverSourceFiles;

if (!module.parent) {
	logger.init(options);
	options.module = options.module.concat(options._);
	options.module = discoverSourceFiles(options.module);

	var failed = 0;
	if (options.jsunity) {
		options.watch = false;
		var jsunityAdapter = require('./src/jsunityAdapter');
		failed = jsunityAdapter.run(options.module);
	} else if (options.doh) {
		options.watch = false;
		var dohAdapter = require('./src/dohAdapter');
		failed = dohAdapter.run(options.module);
	} else {
		covered.init(options);
		covered.run(function (failed) {
			if (!options.watch) {
				process.exit(failed);
			}
		});
	}
}

exports.TestingWithCoverage = covered;
exports.TestingFramework = sure;