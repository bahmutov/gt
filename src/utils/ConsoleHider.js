function ConsoleHider() {
	this.buffered = [];
	this._log = this._warn = this._error = undefined;
}

ConsoleHider.prototype.bufferMessage = function () {
	var msg = [].slice.call(arguments).join('');
	this.buffered.push(msg);
};

ConsoleHider.prototype.hideConsole = function () {
	this._log = console.log;
	this._warn = console.warn;
	this._error = console.error;
	this.buffered = [];
	console.log = console.warn = console.error = this.bufferMessage.bind(this);
};

ConsoleHider.prototype.restoreConsole = function () {
	console.log = this._log;
	console.warn = this._warn;
	console.error = this._error;
	this._log = this._warn = this._error = undefined;
	return this.buffered.join('\n');
};

exports.ConsoleHider = ConsoleHider;