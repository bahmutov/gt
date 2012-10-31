# gt

Simple JS unit testing framework similar to QUnit.

## Goals
1. Make sure QUnit tests work with [istanbul](https://github.com/gotwarlost/istanbul "Istanbul at GitHub") JS coverage tool
2. Experiment with JS unit testing by writing a framework from scratch.

## Install and run

**gt** requires *nodejs* and a few modules to run.

	npm install

npm application will look through the *package.json* and will install all necessary modules.

```shell
node gt ./tests.js -l 0

options:
	-l debug level: 0 = debug, 1 = standard, 2 = warnings, 3 = errors
```

Compatible with istanbul JS coverage tool

	istanbul cover gt.js ./tests.js -- -l 0

## Example

A simple example is in [examples subfolder](gt/tree/master/examples "gt Examples")

Unit tests

```javascript
test("get N '='", function () {
	ok(typeof getLines === "function", "getLines is a function");
	equal(getLines(0), "", "0 character");
	equal(getLines(1), "=", "1 character");
	equal(getLines(3), "===", "3 character");
	equal(getLines(6), "======", "6 character");
});
...
```

Create unit test report

	C:\git\gt>node gt.js ./examples/tests.js

Sample output [image](gt/blob/master/examples/example.png "Console screenshot")

Create JS coverage by executing the next command (assuming *istanbul* is installed)

	C:\git\gt>istanbul cover gt.js ./examples/tests.js

Sample coverage output [image](gt/blob/master/examples/coverage.png "Coverage page screenshot")

## RequireJS example

One can use *amdefine* package to simulate define/require features in place of Node
modules. See [require js](http://requirejs.org/docs/node.html#nodeModules "requirejs.org with AMD")

**gt** supports unit testing these modules

	C:\git\gt\examples\requirejs>node c:\git\gt\gt.js ./examples/requirejs/test/RectangleTest

Unfortunately, JS code coverage using *istanbul* is not working in these situations yet.

## Changes

* 0.1.6 - Global install of **gt** is working.

		npm i -g gt
		gt <test module full path>

* 0.1.5 - trying to install gt as bin node tool
* 0.1.4
    * added raises(function, expected error type, message) support
    * you can run multiple tests at once, just list all test modules
    * *note* to pass parameters to **gt** from istanbul use *--* and then list arguments, for example
				
				C:\git\gt>istanbul cover gt.js ./examples/exceptionTests ./examples/tests -- -r 1
		
* 0.1.3
    * added option to report only failed tests
    * -r 1 reports failed tests only
    * -r 0 (default) report all test results

* 0.1.2 - added example that uses RequireJS module loading system.
* 0.1.1 - moved code around.
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