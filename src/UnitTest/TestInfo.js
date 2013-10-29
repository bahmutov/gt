var check = require('check-types');

// test information updated during unit test execution (assertions, crashes, messages)
var TestInfo = function () {
	this.assertions = 0;
	this.broken = 0;
	this.hasCrashed = false;
	this.messages = [];
	this.stdout = null;
	this.hasRun = false;
};

TestInfo.prototype.check = function () {
	check.verify.string(this.name, "test name should be a string");
	console.assert(!this.assertions, "test", this.name, "should start with 0 assertions");
	console.assert(!this.broken, "test", this.name, "should start with 0 broken assertions");
	check.verify.fn(this.code, this.name, "should have code");
	check.verify.string(this.filename, this.name, 'should have original source filename');
	return true;
};

TestInfo.prototype.errorMessage = function(msg) {
	this.messages.push(msg);
};

TestInfo.prototype.getMessages = function () {
	return this.messages;
};

module.exports.TestInfo = TestInfo;
