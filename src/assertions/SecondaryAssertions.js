var TestRunInfo = require('../TestRunInfo').TestRunInfo;
var joinArguments = require('../utils/joinArguments');
var check = require('check-types');
var spawn = require('child_process').spawn;

// returns total execution time
function timeCode(code, n) {
	check.verify.fn(code, 'missing code to time');
	check.verify.positiveNumber(n, 'incorrect number of times to execute', n);
	var start = new Date();
	var k = n;
	for(; k > 0; k -= 1) {
		code();
	}
	var end = new Date();
	return end - start;
}

var SecondaryAssertions = {
	/**
 	Asserts the two functions return same result for every
 	input in the list.

 	@method sameResults
	@memberOf gt
	@category Secondary assertions
	*/
	sameResults: function (f1, f2, inputs, message) {
		check.verify.fn(f1, 'missing first function');
		check.verify.fn(f2, 'missing second function');
		check.verify.array(inputs, 'inputs should be a array');
		if (!check.string(message)) {
			message = f1.name + ' vs ' + f2.name;
		}
		console.assert(inputs.length > 0, 'empty inputs array');
		inputs.forEach(function (args) {
			gt.equal(f1.call(null, args), f2.call(null, args),
				message + ' with inputs ' + args.join(' '));
		});
	},

	deferCall: function(fn) {
		check.verify.fn(fn, 'expected a function');
		var args = Array.prototype.slice.call(arguments, 1);
		return function() {
			return fn.apply(null, args);
		};
	},

	/**
 	Asserts the given function runs faster than specified limit.

 	@method faster
	@memberOf gt
	@category Performance assertions
	*/
	faster: function (name, code, n, limitMs) {
		check.verify.string(name, 'name should be a string');
		check.verify.fn(code, 'missing function code');
		if (check.positiveNumber(n) && !limitMs) {
			limitMs = n;
			n = 1;
		}
		check.verify.positiveNumber(n, 'incorrect number of times to execute', n);
		check.verify.positiveNumber(limitMs, 'missing limit ms', limitMs);

		var time = timeCode(code, n);
		gt.ok(time < limitMs, name + ' ' + n + ' time(s) took '
			+ time + 'ms exceeded ' + limitMs + 'ms limit');
	},

	/**
 	Asserts the first function runs faster than the second.

 	@method fasterThan
	@memberOf gt
	@category Performance assertions
	*/
	fasterThan: function (name, f1, f2, n) {
		check.verify.string(name, 'name should be a string');
		check.verify.fn(f1, 'missing first function');
		check.verify.fn(f2, 'missing second function');
		if (!check.positiveNumber(n)) {
			n = 1;
		}
		var time1 = timeCode(f1, n);
		var time2 = timeCode(f2, n);
		gt.ok(time1 < time2, name + ' first function is slower than second, ' +
			time1 + 'ms vs ' + time2 + 'ms on ' + n + ' runs');
	},

	/**
	Asserts that given value is defined

	@method defined
	@memberOf gt
	@category Type assertions
	*/
	defined: function (value) {
		var message = joinArguments(arguments, 1);
		this.ok(typeof value !== 'undefined', message);
	},

	/**
	Asserts that given value is undefined

	@method undefined
	@memberOf gt
	@category Type assertions
	*/
	undefined: function (value) {
		var message = joinArguments(arguments, 1);
		this.equal(typeof value, 'undefined', message);
	},

	/**
	Asserts that given value is null

	@method null
	@memberOf gt
	@category Type assertions
	*/
	null: function (value) {
		var message = joinArguments(arguments, 1);
		this.equal(value, null, message);
	},

	/**
	Asserts the given value is a function

	@method func
	@memberOf gt
	@category Type assertions
	*/
	func: function (f) {
		var message = joinArguments(arguments, 1);
		// console.log(message);
		this.equal(typeof f, 'function', message);
	},

	/**
	Asserts given value is an object

	@method object
	@memberOf gt
	@category Type assertions
	*/
	object: function (o) {
		var message = joinArguments(arguments, 1);
		this.equal(typeof o, 'object', message);
	},

	/**
	Asserts given value is an array

	@method array
	@memberOf gt
	@category Type assertions
	*/
	array: function (array) {
		var message = joinArguments(arguments, 1) || 'checking if ' + array + ' is an array';
		this.ok(Array.isArray(array), message);
	},

	/**
	Asserts given value is a function that takes in specified
	number of arguments

	@method arity
	@memberOf gt
	@category Secondary assertions
	*/
	arity: function (f, n, message) {
		check.verify.object(TestRunInfo, 'missing test run info');
		check.verify.object(TestRunInfo._currentTest, "current test is undefined");
		this.func(f, message);
		if (TestRunInfo._currentTest.expected) {
			TestRunInfo._currentTest.expected += 1;
		}
		this.equal(f.length, n, message);
	},

	/**
	Asserts exit code from an external process.

	@method exec
	@memberOf gt
	@category Secondary assertions
	*/
	exec: function (command, args, expectedExitCode, message) {
		check.verify.object(TestRunInfo._currentTest, "current test is undefined");
		check.verify.string(command, 'command should be a string');
		console.assert(expectedExitCode >= 0, 'invalid expected exit code', expectedExitCode);
		// throw new Error('gt.exec is not implemented yet');
		var program = spawn(command, args);
		program.stdout.setEncoding('utf-8');
		program.stdout.on('data', function (data) {
			console.log('exec:', data.trim());
		});
		program.on('exit', function (code) {
			console.log('exec exit code:', code);
			gt.equal(code, expectedExitCode, message);
			gt.start();
		});
	},

	/**
	Asserts given code raises AssertionError

	@method raisesAssertion
	@memberOf gt
	@category Secondary assertions
	*/
	raisesAssertion: function (code, message) {
		this.raises(code, 'AssertionError', message);
	},

	/**
	Asserts given code raises ReferenceError

	@method raisesReference
	@memberOf gt
	@category Secondary assertions
	*/
	raisesReference: function (code, message) {
		this.raises(code, 'ReferenceError', message);
	}
};

SecondaryAssertions.secondary = function () {
	var names = Object.keys(SecondaryAssertions);
	return names;
};

module.exports = SecondaryAssertions;
