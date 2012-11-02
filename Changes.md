## Vesion history

* 0.2.1 - better usage message using *optimist* module
* 0.2.0 - better reporting, including module name

* 0.1.9 - added test module resolution, so relative paths work well. 
This will compute test results and js coverage for all local modules including unit tests themselves.

		gt example\basic\tests.js example\basic\something.js ...

* 0.1.8 - every module required that does not come from *node_modules* 
folder will be instrumented. Coverage results will be written into folder *cover*

* 0.1.7 - added running istanbul as a module to gt. 
Still need to figure out how to determine which files to instrument!

* 0.1.6 - Global install of **gt** is working.

		npm i -g gt
		gt <test module full path>

* 0.1.5 - trying to install gt as bin node tool
* 0.1.4
    * added raises(function, expected error type, message) support
    * you can run multiple tests at once, just list all test modules
    * *note* to pass parameters to **gt** from istanbul use *--* and then list arguments, for example
				
				C:\git\gt>istanbul cover gt.js ./examples/exceptionTests ./examples/tests -- -r 1
		
* 0.1.3 - added option to report only failed tests

```shell
		-r 1 reports failed tests only
		-r 0 (default) report all test results
```

* 0.1.2 - added example that uses RequireJS module loading system.
* 0.1.1 - moved code around.
* 0.1.0 - refactored code into separate modules for storing / running code.
* 0.0.9 - added custom logger with different verbosity levels, use -l option.

```shell
    -l 0 prints debug messages, verbose
    -l 1 is the standard output
    -l 2 prints warnings
    -l 3 prints errors only
```

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