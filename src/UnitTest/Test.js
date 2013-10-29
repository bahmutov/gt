var TestBaseInfo = require('./TestBaseInfo').TestBaseInfo;
var TestInfo = require('./TestInfo').TestInfo;
var TestAsync = require('./TestAsync').TestAsync;
var TestReport = require('./TestReport').TestReport;
var _ = require('lodash');
var check = require('check-types');

// individual unit test
var Test = function (options) {
	TestBaseInfo.call(this, options);
	TestInfo.call(this);
	TestAsync.call(this, options);
};

Test.prototype = Object.create(TestAsync.prototype);
_.extend(Test.prototype, TestInfo.prototype);
_.extend(Test.prototype, TestReport);

Test.prototype.hasFailed = function () {
	if (!this.hasReallyFailed()) {
		return false;
	}
	if (this.expectsCertainStatus()) {
		return !this.achievedExpectedResult();
	}
	return true;
};

Test.prototype.hasReallyFailed = function () {
	var stat = this.status();
	check.verify.string(stat, 'could not get status for', this.name);
	return stat !== Test.PASS && stat !== Test.SKIP;
};

Test.prototype.expectsCertainStatus = function () {
	if (this.name.indexOf(Test.PASS) === 0) {
		return true;
	}
	if (this.name.indexOf(Test.FAIL) === 0) {
		return true;
	}
	if (this.name.indexOf(Test.CRASH) === 0) {
		return true;
	}
	if (this.name.indexOf(Test.INCOMPLETE) === 0) {
		return true;
	}
	return false;
};

Test.prototype.achievedExpectedResult = function() {
	var stat = this.status();
	check.verify.string(stat, 'could not get test status for', this.name);
	return this.name.indexOf(stat) === 0;
};

Test.prototype.status = function () {
	check.verify.string(Test.PASS, "Test.PASS is undefined");
	if (check.number(this.expected) && (this.expected !== this.assertions)) {
		return Test.INCOMPLETE;
	}

	if (this.timedOut) {
		return Test.INCOMPLETE;
	}
	if (this.hasCrashed) {
		return Test.CRASH;
	}
	if (this.skip) {
		return Test.SKIP;
	}
	if (this.broken > 0) {
		log.debug(this.name, "has", this.broken, "broken assertions, failed");
		return Test.FAIL;
	}
	return Test.PASS;
};

Test.PASS = "PASS";
Test.FAIL = "FAIL";
Test.CRASH = "CRASH";
Test.INCOMPLETE = "INCOMPLETE";
Test.SKIP = "SKIP";

exports.Test = Test;
