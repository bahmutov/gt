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
	.options('colors', {
		boolean: true,
		default: true,
		description: 'use terminal colors for output,\n' +
		' might not work with continuous build servers'
	})
	.options('module', {
		default: [],
		description: 'deprecated: test module to run, can be used multiple times'
	})
	.options('output', {
		boolean: true,
		default: false,
		description: 'show standard and warning console output messages'
	})
	.options('watch', {
		alias: 'w',
		boolean: true,
		default: false,
		description: 'watch files for changes, rerun the unit tests'
	})
	.options('jsunity', {
		boolean: true,
		default: false,
		description: 'unit tests follow jsunity rules'
	})
	.options('doh', {
		boolean: true,
		default: false,
		description: 'unit tests follow Dojo DOH syntax (including define)'
	})
	.options('untested', {
		boolean: true,
		alias: 'u',
		default: true,
		description: 'add coverage for test to "untested" if it is installed'
	})
	.options('target', {
		string: true,
		default: 'gt',
		alias: 't',
		description: 'global object name to use for the framework, for example QUnit'
	})
	.options('test', {
		string: true,
		default: null,
		description: 'only run tests with name matching regular expression'
	})
	.argv;

	if (args.version) {
		var pkg = require('../package.json');
		console.log(pkg.name, 'by', JSON.stringify(pkg.author), 'version', pkg.version);
		process.exit(0);
	}

	if (args.h || args.help || !args._.length) {
		optimist.showHelp();
		// console.log(args);
		process.exit(0);
	}
	return args;
}

exports.run = getArguments;