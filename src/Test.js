var Test = function (name, code, moduleName) {
	this.name = name;
	this.code = code;
	this.assertions = 0;
	this.broken = 0;
	this.expected = undefined;
	this.hasCrashed = false;
	this.module = moduleName;

	this.check = function () {
		console.assert(typeof this.name === "string", "test name should be a string");
		console.assert(this.assertions === 0, "test", this.name, "should start with 0 assertions");
		console.assert(this.broken === 0, "test", this.name, "should start with 0 broken assertions");
		console.assert(typeof this.code === "function", this.name, "should have code");
	};
};

exports.Test = Test;