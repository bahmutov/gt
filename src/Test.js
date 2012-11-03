var sprintf = require('sprintf').sprintf;

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

	this.hasFailed = function () {
		if (this.broken > 0) {
			log.debug(this.name, "has", this.broken, "broken assertions, failed");
			return true;
		}
		if (this.hasCrashed) {
			log.debug(this.name, "has crashed, failed");
			return true;
		}
		if (("undefined" !== typeof this.expected) && (this.expected !== this.assertions)) {
			log.debug(this.name, "has expected", this.expected, "assertions, checked", this.assertions, "failed");
			return true;
		}

		return false;
	};

	this.status = function () {
		var status = "PASS";
		if (this.hasFailed()) {
			status = "FAIL";
		}
		if (("undefined" !== typeof this.expected) && (this.expected !== this.assertions)) {
			status = "INCOMPLETE";
		}
		if (this.hasCrashed) {
			status = "CRASH";
		}
		return status;
	};

	this.formMessage = function () {

		var good = this.assertions - this.broken;
		var percent = (this.assertions === 0 ? 100 : good / this.assertions * 100);

		var message = "";
		if ("string" === typeof this.module) {
			message = sprintf("%-70s : %3d%% (%d / %d)", this.module + ': ' + this.name, percent, good, this.assertions);
		} else {
			message = sprintf("%-70s : %3d%% (%d / %d)", this.name, percent, good, this.assertions);
		}

		var fullMessage = sprintf("%-90s : %s", message, this.status());
		return fullMessage;
	};
};

exports.Test = Test;