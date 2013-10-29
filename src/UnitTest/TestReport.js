var sprintf = require('sprintf').sprintf;
var check = require('check-types');

var TestReport = {};

TestReport.formMessage = function (lineLength) {
	lineLength = lineLength || 100;
	var maxNameLength = lineLength - 32;
	if (maxNameLength < 10) {
		maxNameLength = 10;
	}
	var format = "  %-" + maxNameLength + "s   %3d%% (%d / %d) : %s";

	var maxAssertions = (this.expected ? this.expected : this.assertions);
	var good = this.assertions - this.broken;
	var percent = (this.assertions === 0 ? 100 : good / this.assertions * 100);

	var testNameFitted = this.name.length < maxNameLength ?
	this.name :
	this.name.substr(0, maxNameLength - 3) + '...'
	var status = this.status();
	check.verify.string(status, "could not get status for", message);
	var message = sprintf(format, testNameFitted, percent, good, maxAssertions, this.status());
	return message;
};

module.exports.TestReport = TestReport;
