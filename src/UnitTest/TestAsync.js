var check = require('check-types');

// async unit test support
var TestAsync = function(options) {
	this.async = options.async;
	this.timeout = +options.timeout || 5000;
	check.verifyPositiveNumber(this.timeout, 'should be positive number (timeout ms)', this.timeout);
};

TestAsync.prototype.start = function (callback, timeout) {
	this.hasRun = true;
	this.started = new Date();
	// console.log('test "' + this.name + '" started on', this.started);
	if (this.async) {
		// console.log('starting async test', this.name);
		check.verifyFunction(callback, 'missing callback function in', this.name);
		timeout = timeout || this.timeout;
		check.verifyPositiveNumber(timeout, 'expect timeout number, not', timeout);
		this.startTimeout(callback, timeout);
	}
};

TestAsync.prototype.startTimeout = function(callback, timeout) {
	timeout = timeout || 5000;
	check.verifyFunction(callback, 'callback should be a function');
	check.verifyPositiveNumber(timeout, 'invalid timeout', timeout);
	this.onFinished = callback;
	this.timeoutId = setTimeout(this.checkTestIsStillRunning.bind(this), timeout);
};

TestAsync.prototype.checkTestIsStillRunning = function() {
	// console.log('checking if still running test "' + this.name + '"');
	console.assert(this.started, 'missing started timestampt for', this.name);
	if (typeof this.finished === 'undefined') {
		this.finished = new Date();
		this.timedOut = true;
		log.error('test "' + this.name + '" is still executing, timed out after', 
			(this.finished - this.started) + 'ms');
		check.verifyFunction(this.onFinished, 'missing on finished function');
		setTimeout(this.onFinished, 1);
	}
};

TestAsync.prototype.continueWithTest = function() {
	// console.log('start called on test', this.name);
	console.assert(this.async, 'only async unit tests should call start()');
	console.assert(this.timeoutId, 'missing timeout id');
	clearTimeout(this.timeoutId);
	delete this.timeoutId;

	this.finished = new Date();
	// current test will continue, then we get control back 
	// and can run next async test (if any)
	setTimeout(this.onFinished, 1);
};

TestAsync.prototype.duration = function() {
	if (this.skip) {
		return 0;
	}
	console.assert(this.started, 'missing started timestamp for test "' + this.name + '"');
	console.assert(this.finished, 'missing finished timestamp for test "' + this.name + '"');
	return this.finished - this.started;
}

module.exports.TestAsync = TestAsync;