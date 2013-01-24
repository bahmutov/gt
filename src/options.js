var optimist = require("optimist");

function getArguments() {
	var args = optimist.usage("JS unit testing and coverage in a single shot.\nUsage: $0")
	.default({
		log: 1,
		report: 0,
		help: false,
		cover: "cover",
		xml: null,
		colors: true,
		module: [], // all files with test and code
		output: false,
		watch: false,
		jsunity: false,
		doh: false,
		untested: true,
		target: 'gt'
		})
	.alias('l', 'log')
	.alias('r', 'report')
	.alias('h', 'help')
	.alias('c', 'cover')
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
	.boolean('doh').describe('doh', 'unit tests follow Dojo DOH syntax (including define)')
	.boolean('untested').alias('u', 'untested')
	.describe('untested', 'add coverage for test to "untested" if it is installed')
	.alias('target', 't').string('target')
	.describe('target', 'global object name to use for the framework, for example QUnit')
	.argv;

	if (args.h || args.help || !args._.length) {
		optimist.showHelp();
		console.log(args);
		process.exit(0);
	}
	return args;
}

exports.run = getArguments;