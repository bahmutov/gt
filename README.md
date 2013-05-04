# gt

Simple JS unit testing framework similar to QUnit.

## Goals
1. Make sure QUnit tests work with [istanbul](https://github.com/gotwarlost/istanbul "Istanbul at GitHub") JS coverage tool
2. Experiment with JS unit testing by writing a framework from scratch.

## Install and run

**gt** requires *nodejs* and a few modules to run. Assuming you wrote a few qunit tests in tests.js:

	npm install -g gt
	gt tests.js

	some of the options (-h for all):
		-l <debug level> 0 = debug, 1 = default, 2 = warnings, 3 = errors
		-r <report level> 0 = all (default), 1 = failed tests only

## Example

A simple example is in [examples subfolder](gt/tree/master/examples/basic "gt Examples")

Unit tests follow QUnit approach:

```javascript
gt.module("Basic tests");

gt.test("get N '='", function () {
	gt.ok(typeof getLines === "function", "getLines is a function");
	gt.equal(getLines(0), "", "0 character");
	gt.equal(getLines(1), "=", "1 character");
});
```

Creates unit test report (stdout only) and JS code coverage (stdout plus Lines of Code + HTML in folder cover)

	gt ./examples/basic/tests ./examples/basic/exceptionTests

Sample unit test output [image](gt/blob/master/examples/example.png "Console screenshot")

Sample JS coverage output [image](gt/blob/master/examples/coverage.png "Coverage page screenshot")

## CoffeeScript support

You can write your unit tests using [coffeescript](http://coffeescript.org/), which allows very concise code. 
So far, the code coverage does not include the unit test files themselves, they will be omitted from the coverage report.
See *examples/coffee* folder.

## Running in browser

See example **examples/browser**

## License

The MIT License, see [*MIT-License.txt*](gt/blob/master/MIT-License.txt "MIT-License.txt")

## Contact

Gleb Bahmutov <gleb.bahmutov@gmail.com>