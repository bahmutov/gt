var Test = require("./Test").Test;

var TestCollection = {
	_tests: [],

	collectTests: function (moduleNames) {
		console.assert(Array.isArray(moduleNames), "expected list of test modules");

		var k;
		for (k = 0; k < moduleNames.length; k += 1) {
			var testModuleName = moduleNames[k];
			console.assert(typeof testModuleName === "string", "expected a module name", testModuleName);
			log.debug("loading module with unit tests", testModuleName);
			try {
				require(testModuleName);
			} catch (errors) {
				console.error(errors);
				console.log();
				console.log(help);
				process.exit(1);
			}
		}
		log.debug("loaded", this.getNumberOfTests(), "tests from '" + testModuleName + "'");
	},

	add: function (name, code) {
		console.assert(this._tests, "this._tests is defined");

		/*
		this._tests[name] = {
			name: name,
			code: code,
			assertions: 0,
			broken: 0,
			expected: undefined,
			hasCrashed: false,
			module: this._moduleName
		};
		*/
		var test = new Test(name, code, this._moduleName);
		this._tests.push(test);
		// log.debug("added test", name, "module", this._moduleName);
	},

	module: function (name) {
		console.assert(name && (typeof name === "string"), "module name should be a string");
		log.log("module '" + name + "'");
		this._moduleName = name;
	},

	getNumberOfTests: function () {
		return this._tests.length;
	}
};

exports.TestCollection = TestCollection;