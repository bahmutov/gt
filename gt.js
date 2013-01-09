#!/usr/bin/env node

try {
	var log = require("custom-logger");
} catch (err) {
	console.error(err);
	console.error('could not load custom logger, have you forgot to run npm install?');
	process.exit(-1);
}

// grab command line arguments
var arguments = (function() {
	var optimist = require("optimist");
	var args = optimist.usage("JS unit testing and coverage in a single shot.\nUsage: $0")
		.default({
			log: 1,
			report: 0,
			help: 0,
			cover: "cover",
			xml: null,
			colors: true,
			module: [],
			output: false
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

if (typeof arguments.module === 'string') {
	arguments.module = [arguments.module];
}

var logger = require('optional-color-logger');
logger.init(arguments);

var sure = require('./covered');
console.assert(typeof sure === "object", 'loaded sure module');

sure.init(arguments);
var failed = sure.run();
process.exit(failed);