var ConsoleHider = {
	bufferMessage: function () {
		var msg = [].slice.call(arguments).join('');
		this.buffered.push(msg);
	},

	hideConsole: function () {
		this._log = console.log;
		this._warn = console.warn;
		this._error = console.error;
		this.buffered = [];
		console.log = console.warn = console.error = this.bufferMessage.bind(this);
	},

	restoreConsole: function () {
		console.log = this._log;
		console.warn = this._warn;
		console.error = this._error;
		return this.buffered.join('\n');
	},
};

exports.ConsoleHider = ConsoleHider;