var check = require('check-types');

// basic test information: name, parent module name, source filename, etc
var TestBaseInfo = function (options) {
	check.verifyObject(options, 'missing Test options');
	check.verifyString(options.name, "test name should be a string, not", options.name);
	check.verifyString(options.moduleName, options.name, "should have module name");
	check.verifyFunction(options.code, options.name, "should have code function");
	check.verifyString(options.filename, options.name, 'should have original source filename');

	this.name = options.name;
	this.code = options.code;
	this.module = options.moduleName;
	this.filename = options.filename;
	this.skip = options.skip;

	this.expected = check.isNumber(options.expected) ? options.expected : undefined;
};

module.exports.TestBaseInfo = TestBaseInfo;

