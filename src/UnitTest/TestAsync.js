var check = require('check-types');
var quote = require('quote');

// async unit test support
var TestAsync = function(options) {
	this.async = options.async;
	this.timeout = +options.timeout || 5000;
	check.verify.positiveNumber(this.timeout, 'should be positive number (timeout ms)', this.timeout);
};

TestAsync.prototype.start = function (callback, timeout) {
	this.hasRun = true;
	this.started = new Date();
	// console.log('test "' + this.name + '" started on', this.started);
	if (this.async) {
		// console.log('starting async test', this.name);
		check.verify.fn(callback, 'missing callback function in', this.name);
		timeout = timeout || this.timeout;
		check.verify.positiveNumber(timeout, 'expect timeout number, not', timeout);
		this.startTimeout(callback, timeout);
	} else {
		// allow sync tests to execute callback, for example after calling
		// gt.test(
		// 		gt.stop();
		//		gt.start();
		this.onFinished = callback;
	}
};

TestAsync.prototype.startTimeout = function(callback, timeout) {
	timeout = timeout || 5000;
	check.verify.fn(callback, 'callback should be a function');
	check.verify.positiveNumber(timeout, 'invalid timeout', timeout);
	this.onFinished = callback;
	this.timeoutId = setTimeout(this.checkTestIsStillRunning.bind(this), timeout);
};

TestAsync.prototype.checkTestIsStillRunning = function() {
	// console.log('checking if still running test "' + this.name + '"');
	console.assert(this.started, 'missing started timestampt for', this.name);
	if (typeof this.finished === 'undefined') {
		this.finished = new Date();
		this.timedOut = true;
		log.error('test ' + quote(this.name) + ' is still executing, timed out after',
			(this.finished - this.started) + 'ms');
		check.verify.fn(this.onFinished, 'missing on finished function');
		setTimeout(this.onFinished, 1);
	}
};

TestAsync.prototype.continueWithTest = function() {
	// console.log('start called on test', this.name);
	console.assert(this.async, 'only async unit tests should call start()');
	console.assert(this.timeoutId, 'missing timeout id when continuing test', this);
	clearTimeout(this.timeoutId);
	delete this.timeoutId;

	this.finished = new Date();
	// current test will continue, then we get control back
	// and can run next async test (if any)
	setTimeout(this.onFinished, 1);
};

TestAsync.prototype.pause = function () {
	this.async = true;
	this.timeoutId = setTimeout(this.checkTestIsStillRunning.bind(this), 5000);
};

TestAsync.prototype.duration = function() {
	if (this.skip) {
		return 0;
	}
	console.assert(this.started, 'missing started timestamp for test ' + quote(this.name));
	console.assert(this.finished, 'missing finished timestamp for test ' + quote(this.name));
	return this.finished - this.started;
}

module.exports.TestAsync = TestAsync;
