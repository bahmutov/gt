var ModuleTests = require("./ModuleTests").ModuleTests;
var getCallerFilename = require('../utils/utils').getCallerFilename;
var check = require('check-types');
var quote = require('quote');

var CollectionMethods = {
	module: function (name, lifecycle) {
		check.verify.string(name, "module name should be a string");
		check.verify.array(this.modules, "modules is not an array");
		check.verify.object(this.testOnlyModules, 'test modules should be an object');

		if (this.shouldTestModule(name) && !this.shouldSkipModule(name)) {
			log.debug("module " + quote(name));
			this.currentModule = new ModuleTests(name, lifecycle);
			this.modules.push(this.currentModule);
		}
	},

	_addTest: function (options) {
		check.verify.object(options, 'missing test options');
		options.skip = !!options.skip;
		options.async = !!options.async;

		this._startModuleIfNecessary();
		check.verify.object(this.currentModule, "current module is not defined, cannot add test", options.name);

		if (check.number(options.code) && !options.timeout) {
			options.timeout = options.code;
		}

		if (check.fn(options.expected) && !check.fn(options.code)) {
			options.code = options.expected;
			options.expected = undefined;
		}

		if (check.fn(options.name) && !check.fn(options.code)) {
			options.code = options.name;
			options.name = options.code.name;
		}
		check.verify.string(options.name, 'missing unit test name');
		var testFilename = getCallerFilename() || this.currentFileName;
		check.verify.string(testFilename, 'could not get filename for test', options.name);
		if (options.timeout) {
			options.timeout = +options.timeout;
		}

		this.currentModule.add({
			name: options.name,
			code: options.code,
			filename: testFilename,
			skip: options.skip,
			async: options.async,
			timeout: options.timeout,
			expected: options.expected
		});
	},

	asyncTest: function (name, expected, code, timeoutMs) {
		this._addTest({
			name: name,
			expected: expected,
			code: code,
			skip: false,
			async: true,
			timeout: timeoutMs
		});
	},

	async: function () {
		this.asyncTest.apply(this, Array.prototype.slice.call(arguments));
	},

	test: function (name, expected, code) {
		this._addTest({
			name: name,
			code: code,
			expected: expected,
			skip: false,
			async: false
		});
	},

	notest: function () {
		this.skip.apply(this, Array.prototype.slice.call(arguments));
	},

	skip: function (name, expected, code) {
		this._addTest({
			name: name,
			code: code,
			expected: expected,
			skip: true,
			async: false
		});
	}
};
exports.CollectionMethods  = CollectionMethods;
