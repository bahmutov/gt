# gt v0.8.27

> JavaScript native QUnit runner with code coverage and multiple extensions

[![NPM][gt-icon] ][gt-url]

[![Build status][gt-ci-image] ][gt-ci-url]
[![dependencies][gt-dependencies-image] ][gt-dependencies-url]
[![devdependencies][gt-devdependencies-image] ][gt-devdependencies-url]

[gt-icon]: https://nodei.co/npm/gt.png?downloads=true
[gt-url]: https://npmjs.org/package/gt
[gt-ci-image]: https://travis-ci.org/bahmutov/gt.png?branch=master
[gt-ci-url]: https://travis-ci.org/bahmutov/gt
[gt-dependencies-image]: https://david-dm.org/bahmutov/gt.png
[gt-dependencies-url]: https://david-dm.org/bahmutov/gt
[gt-devdependencies-image]: https://david-dm.org/bahmutov/gt/dev-status.png
[gt-devdependencies-url]: https://david-dm.org/bahmutov/gt#info=devDependencies



## Install and run

**gt** requires *nodejs* and a few modules to run. Assuming you wrote a few qunit tests in tests.js:

```sh
sudo npm install -g gt
gt tests.js

some of the options (-h for all):
  -l <debug level> 0 = debug, 1 = default, 2 = warnings, 3 = errors
  -r <report level> 0 = all (default), 1 = failed tests only
```


## Goals

1. Make sure QUnit tests work with [istanbul](https://github.com/gotwarlost/istanbul "Istanbul at GitHub") JS coverage tool
2. Experiment with JS unit testing by writing a framework from scratch.

### Example

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

### CoffeeScript support

You can write your unit tests using [coffeescript](http://coffeescript.org/), which allows very concise code.
So far, the code coverage does not include the unit test files themselves, they will be omitted from the coverage report.
See *examples/coffee* folder.

### Running in browser

See example **examples/browser**

## API

### exec

Spawns new proces, waits for it to finish, then
checks the exit code. Automatically restarts the test queue

```js
gt.async('run Nodejs program', function () {
  gt.exec('node', ['index.js', 'arg1', 'arg2'], 0, 
    'expect "node index.js arg1 arg2" to exit with code 0');
});
```




### Small print

Author: Gleb Bahmutov &copy; 2014

* [@bahmutov](https://twitter.com/bahmutov)
* [glebbahmutov.com](http://glebbahmutov.com)
* [blog](http://bahmutov.calepin.co/)

License: [MIT](MIT-License.txt) - do anything with the code, but don't blame me if it does not work.

Spread the word: tweet, star on github, etc.

Support: if you find any problems with this module, email / tweet / 
open [issue on Github](https://github.com/bahmutov/gt/issues)



[![Bitdeli Badge](https://d2weczhvl823v0.cloudfront.net/bahmutov/gt/trend.png)](https://bitdeli.com/free "Bitdeli Badge")

