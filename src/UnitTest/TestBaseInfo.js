var check = require('check-types');

// basic test information: name, parent module name, source filename, etc
var TestBaseInfo = function (options) {
	check.verify.object(options, 'missing Test options');
	check.verify.string(options.name, "test name should be a string, not", options.name);
	check.verify.string(options.moduleName, options.name, "should have module name");
	check.verify.fn(options.code, options.name, "should have code function");
	check.verify.string(options.filename, options.name, 'should have original source filename');

	this.name = options.name;
	this.code = options.code;
	this.module = options.moduleName;
	this.filename = options.filename;
	this.skip = options.skip;

	this.expected = check.number(options.expected) ? options.expected : undefined;
};

module.exports.TestBaseInfo = TestBaseInfo;

