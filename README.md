gt
==

Simple JS unit testing framework similar to QUnit

## Run

```shell
node gt ./tests.js -l 0

options:
	-l debug level: 0 = debug, 1 = standard, 2 = warnings, 3 = errors
```

Compatible with istanbul JS coverage tool

```shell
istanbul cover gt.js ./tests.js -- -l 0
```

## Changes

* 0.1.0 - refactored code into separate modules for storing / running code.
* 0.0.9 - added custom logger with different verbosity levels, use -l option.
		-l 0 prints debug messages, verbose
		-l 1 is the standard output
		-l 2 prints warnings
		-l 3 prints errors only
* 0.0.8 - added incomplete tests (using number of expected assertions)
* 0.0.7 - handle crashes inside test code, report them.
* 0.0.6 - run unit tests using npm commands
		npm test
		npm run-script cover
* 0.0.5 - added help message and program arguments
* 0.0.4 - moved console reporting methods to separate module
* 0.0.3 - framework methods (test, ok, equal, etc) are added to global space, so that
	unit tests do not have to require gt module.
* 0.0.2 - added expect command, better formatting
* 0.0.1 - initial version, colored output, number of assertions failed, number of tests failed