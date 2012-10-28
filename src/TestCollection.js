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
			hasCrashed: false
		};
	},
	
	getNumberOfTests: function () {
		return Object.keys(this._tests).length;
	}
};

exports.TestCollection = TestCollection;