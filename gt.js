#!/usr/bin/env node

try {
	var log = require("custom-logger");
} catch (err) {
	console.error(err);
	console.error('could not load custom logger, have you forgot to run npm install?');
	process.exit(-1);
}
var path = require('path');

// grab command line arguments
var options = (function() {
	var optimist = require("optimist");
	var args = optimist.usage("JS unit testing and coverage in a single shot.\nUsage: $0")
		.default({
			log: 1,
			report: 0,
			help: 0,
			cover: "cover",
			xml: null,
			colors: true,
			module: [], // all files with test and code
			output: false,
			watch: false,
			jsunity: false
		}).alias('l', 'log').alias('r', 'report').alias('h', 'help').alias('c', 'cover')
		.string("cover").string("xml")
		.boolean("colors")
		.describe('l', "log level, 0 - debug, 1 - normal, 2 - warnings, 3 - errors only")
		.describe('r', "report level, 0 - all test results, 1 - skip passed tests")
		.describe("cover", "output folder with coverage")
		.describe("xml", "output JUnit xml filename")
		.describe('colors', 'use terminal colors for output, might not work with continuous build servers')
		.describe('module', 'test module to run, can be used multiple times')
		.boolean('output').describe('output', 'do not hide standard and warning console output messages')
		.alias('w', 'watch').boolean('watch')
		.describe('watch', 'watch files for changes, rerun the unit tests')
		.boolean('jsunity').describe('jsunity', 'unit tests follow jsunity rules')
		.argv;

	if (!module.parent) {
		if (args.h || args.help || !args._.length) {
			optimist.showHelp();
			console.log(args);
			process.exit(0);
		}
	}
	return args;
}());

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
} else {
	var covered = require('./covered');
	console.assert(typeof covered === "object", 'could not load test framework');

	covered.init(options);
	failed = covered.run();
}

if (!options.watch) {
	process.exit(failed);
}