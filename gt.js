#!/usr/bin/env node

try {
	var log = require("custom-logger");
} catch (err) {
	console.error(err);
	console.error('could not load custom logger, have you forgot to run npm install?');
	process.exit(-1);
}

var options = require('./src/options').run();
var path = require('path');

if (typeof options.module === 'string') {
	options.module = [options.module];
}

var logger = require('optional-color-logger');
logger.init(options);

function discoverSourceFiles(files) {
	console.assert(Array.isArray(files), 'expect list of filenames');	
	var glob = require("glob");

	var filenames = [];
	files.forEach(function (shortName) {
		var files = glob.sync(shortName);
		filenames = filenames.concat(files);
	});

	filenames = filenames.map(function (shortName) {
		return path.resolve(shortName);
	});
	return filenames;
}

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
	var covered = require('./covered');
	console.assert(typeof covered === "object", 'could not load test framework');

	covered.init(options);
	failed = covered.run();
}

if (!options.watch) {
	process.exit(failed);
}