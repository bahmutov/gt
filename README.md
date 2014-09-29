# gt v0.8.43

> JavaScript native QUnit runner with code coverage and multiple extensions

[![NPM][gt-icon] ][gt-url]

[![Build status][gt-ci-image] ][gt-ci-url]
[![Coverage Status][gt-coverage-image] ][gt-coverage-url]
[![dependencies][gt-dependencies-image] ][gt-dependencies-url]
[![devdependencies][gt-devdependencies-image] ][gt-devdependencies-url]

[gt-icon]: https://nodei.co/npm/gt.png?downloads=true
[gt-url]: https://npmjs.org/package/gt
[gt-ci-image]: https://travis-ci.org/bahmutov/gt.png?branch=master
[gt-ci-url]: https://travis-ci.org/bahmutov/gt
[gt-coverage-image]: https://coveralls.io/repos/bahmutov/gt/badge.png
[gt-coverage-url]: https://coveralls.io/r/bahmutov/gt
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

### BDD support

gt provides minimal BDD support and can run Mocha/Jasmine specs that have `describe` and `it` calls.
See [spec example](examples/bdd/spec.js). You can run it using `gt --bdd spec.js` command.

## API

### module

Creates new suite of tests with given name

```js
gt.module('math tests');
```

You can specify additional functions to run before / after
each unit tests. You can also specify a function to run once
before any tests, and after all tests.

```js
gt.module('server tests', {
    setupOnce: function () {
        // setup server
    },
    setup: function () {
        // clear data before each unit test
    },
    teardown: function () {
        // clean up after each unit test
    },
    teardownOnce: function () {
        // stop server
    }
});
```

See [module tests](examples/moduleSetupTeardown/test.js) for more information and examples.

A very convenient feature: each method can return a promise object
to tell the test engine when it is done. See [example](examples/async/asyncSetup.js)



### exec

Spawns new proces, waits for it to finish, then
checks the exit code. Automatically restarts the test queue

**Checking just the exit code**

```js
gt.async('run Nodejs program', function () {
  gt.exec('node', ['index.js', 'arg1', 'arg2'], 0,
    'expect "node index.js arg1 arg2" to exit with code 0');
});
```

**Checking the exit code and the output**

```js
gt.async('run a program', function () {
  gt.exec('node', ['index.js', 'arg1', 'arg2'], 0,
    function (stdout, stderr) {
      if (/error/.test(stdout)) {
        throw new Error('Errors in output ' + stdout);
      }
    });
});
```

Full [exec unit test](examples/exec/tests.js)

**shortcuts:**

```js
gt.exec(cmd, [...], 'msg');
// same as
gt.exec(cmd, [...], 0, 'msg');

gt.exec(cmd, 'msg');
// same as
gt.exec(cmd, [], 0, msg);

gt.exec(cmd);
// same as
gt.exec(cmd, [], 0);
```



### gt.equiv

Performs deep equality comparison between two objects.







## command line options

### --no-cover part-of-path

gt excludes certain common paths from coverage,
speeding up the test runs: node_modules, bower_components, etc.
You can add paths to this list, for example to exclude all files
loaded from `vendor` folders:

    gt --no-cover vendor src/*.js tests/*.js

The option is used as case insensitive regular expression.



### Small print

Author: Gleb Bahmutov &copy; 2014

* [@bahmutov](https://twitter.com/bahmutov)
* [glebbahmutov.com](http://glebbahmutov.com)
* [blog](http://bahmutov.calepin.co/)

License: [MIT](MIT-License.txt) - do anything with the code, but don't blame me if it does not work.

Spread the word: tweet, star on github, etc.

Support: if you find any problems with this module, email / tweet /
[open issue](https://github.com/bahmutov/gt/issues) on Github.



[![Bitdeli Badge](https://d2weczhvl823v0.cloudfront.net/bahmutov/gt/trend.png)](https://bitdeli.com/free "Bitdeli Badge")

