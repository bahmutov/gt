// #! /usr/bin/env node
try {
	var log = require("custom-logger");
} catch (err) {
	console.error(err);
	console.error('could not load custom logger, have you forgot to run npm install?');
	process.exit(-1);
}

// grab command line arguments
(function() {
	var optimist = require("optimist");
	args = optimist.usage("JS unit testing and coverage in a single shot.\nUsage: $0")
			.default({
				log: 1,
				report: 0,
				help: 0,
				cover: "cover",
				xml: null
			}).alias('l', 'log').alias('r', 'report').alias('h', 'help').alias('c', 'cover')
			.string("cover").string("xml")
			.describe('l', "log level, 0 - debug, 1 - normal, 2 - warnings, 3 - errors only")
			.describe('r', "report level, 0 - all test results, 1 - skip passed tests")
			.describe("cover", "output folder with coverage")
			.describe("xml", "output JUnit xml filename")
			.argv;

	if (!module.parent) {
		if (args.h || args.help || !args._.length) {
			optimist.showHelp();
			process.exit(0);
		}
	}
}());

// setup logger
(function() {
	var logMode = (typeof args.l === "number" ? args.l : 1);
	log["new"]({
		debug: { level: 0, event: "debug", color: "yellow" },
		log: { level: 1, event: "log" },
		warn: { level: 2, event: "warn", color: "orange" },
		error: { level: 3, event: "error", color: "red" }
	});

	log.config({
		level: logMode
	});
	log.debug("log level", logMode);
	global.log = log;

	log.debug("module dir name", __dirname);
	var currDirname = process.cwd();
	log.debug("working dir name", currDirname);
}());

var sure = require('./covered');
console.assert(typeof sure === "object", 'loaded sure module');

sure.init(args);
var failed = sure.run();
process.exit(failed);