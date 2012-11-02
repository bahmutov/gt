var TestCollection = {
	_tests: {},
	
	add: function (name, code) {
		console.assert(this._tests, "this._tests is defined");
		
		this._tests[name] = {
			name: name,
			code: code,
			assertions: 0,
			broken: 0,
			expected: undefined,
			hasCrashed: false,
			module: this._moduleName
		};
		// log.debug("added test", name, "module", this._moduleName);
	},
	
	module: function (name) {
		console.assert(name && (typeof name === "string"), "module name should be a string");
		log.log("module '" + name + "'");
		this._moduleName = name;
	},
	
	getNumberOfTests: function () {
		return Object.keys(this._tests).length;
	}
};

exports.TestCollection = TestCollection;