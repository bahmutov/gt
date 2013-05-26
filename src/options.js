var optimist = require('optimist');

function getArguments() {
	var args = optimist
	.usage('JS unit testing and coverage in a single shot.\nUsage: $0')
	.options('quickFail', {
		boolean: true,
		default: false,
		alias: 'q',
		description: 'exit on first failed test'
	})
	.options('log', {
		default: 1,
		alias: 'l',
		description: 'log level, 0 - debug, 1 - normal, 2 - warnings, 3 - errors only'
	})
	.options('report', {
		default: 0,
		alias: 'r',
		description: 'report level, 0 - all test results, 1 - skip passed tests'
	})
	.options('version', {
		boolean: true,
		default: false,
		alias: 'v',
		description: 'show version and exit'
	})
	.options('cover', {
		string: true,
		default: 'cover',
		alias: 'c',
		description: 'output folder with coverage info'
	})
	.options('xml', {
		string: true,
		default: null,
		description: 'output JUnit xml filename'
	})
	.default({
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
	.boolean('colors')
	.describe('colors', 'use terminal colors for output,\n' +
		' might not work with continuous build servers')
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

	if (args.version) {
		var pkg = require('../package.json');
		console.log(pkg.name, 'by', JSON.stringify(pkg.author), 'version', pkg.version);
		process.exit(0);
	}

	if (args.h || args.help || !args._.length) {
		optimist.showHelp();
		console.log(args);
		process.exit(0);
	}
	return args;
}

exports.run = getArguments;