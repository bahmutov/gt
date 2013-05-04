/**
	@function optional
	Replaces
		if (condition) {
			foo(args);
		}
	with

		optional(foo)(condition, args);
		*/
		module.exports.optional = function (fn) {
			return function(condition) {
				if (condition) {
					return fn.apply(this, [].slice.call(arguments, 1));
				}
			};
		}

/**
	@function defaults
	Returns first non null defined value, good for default parameter values

	Replaces
		config = config || {}
	with
		config = defaults(config, {});

	var foo = defaults(config.foo, options.foo, 'foo');

	Leads to much lower cyclomatic complexity
	*/
	module.exports.defaults = function () {
		var args = [].slice.call(arguments, 0);
		var foundValue = null;
		args.some(function (value) {
		// console.log('checking value', value);
		if (typeof value !== 'undefined' &&
			value !== null) {
			foundValue = value;
		return true;
	}
	return false;
});
		return foundValue;
	}

	function getLines(n) {
		console.assert(n >= 0 && n < 200, "invalid number of characters", n);
		if (n === 0) {
			return "";
		}

		var str = "";
		var k;
		for (k = 0; k < n; k += 1) {
			str += "=";
		}
		return str;
	}

	function centerMessage(n, message) {
		console.assert(n > 0 && n < 200, "invalid number of characters", n);

		var str = '';
		if (typeof message === "string" && message.length > 0) {
			message = ' ' + message + ' ';
			if (n < message.length) {
				n = message.length;
				str = message;
			} else {
				var start = Math.floor((n - message.length) / 2);
				if (start < 0) {
					start = 0;
				}
				var end = n - start - message.length;
			// console.log("start", start, "message", message.length, "end", end);
			str = getLines(start) + message;
			if (end > 0) {
				str += getLines(end);
			} else {
				end = 0;
			}
		}
	} else {
		str = getLines(n);
	}

	console.assert(str.length === n, "need string with", n, "characters, got", str.length, "string '" + str + "'");
	return str;
}

// from http://stackoverflow.com/questions/13227489/how-can-one-get-the-file-path-of-the-caller-function-in-node-js
function getCallerFilename() {
	var stack = getStack();

	//console.log(__filename);
  // Remove superfluous function calls on stack
  while (stack.length) {
  	stack.shift();
  	stack.shift();
  	stack.shift();
  	// stack.shift();
  	//console.log(stack[0]);
  	// console.log(stack[0].receiver);
  	return stack[0].receiver.filename;
  };
  console.log('could not find filename');
  return null;
  // Return caller's caller
  //return stack[0].receiver;
}

function getStack() {
  // Save original Error.prepareStackTrace
  var origPrepareStackTrace = Error.prepareStackTrace

  // Override with function that just returns `stack`
  Error.prepareStackTrace = function (_, stack) {
  	return stack
  }

  // Create a new `Error`, which automatically gets `stack`
  var err = new Error();

  // Evaluate `err.stack`, which calls our new `Error.prepareStackTrace`
  var stack = err.stack;

  // Restore original `Error.prepareStackTrace`
  Error.prepareStackTrace = origPrepareStackTrace

  // Remove superfluous function call on stack
  stack.shift() // getStack --> Error
  return stack;
}

exports.getLines = getLines;
exports.centerMessage = centerMessage;
exports.getCallerFilename = getCallerFilename;