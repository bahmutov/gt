// a few extra utility assertion methods, implemented using simpler ones
var SecondaryAssertions = require('./SecondaryAssertions');
var check = require('check-types');
var joinArguments = require('../utils/joinArguments');

check.verifyObject(SecondaryAssertions, 'missing secondary assertions');

var Assertions = {
	fn: function() {
		this.func(arguments);
	},

	empty: function (value) {
		var message = joinArguments(arguments, 1);
		if (check.isString(value)) {
			this.equal(value, '', message);
		} else if (check.isArray(value)) {
			this.equal(value.length, 0, message);
		} else if (check.isObject(value)) {
			this.equal(JSON.stringify(value), '{}', message);
		} else {
			this.ok(false, 'Don\' know how to compare object ' + JSON.stringify(value));
		}
	},

	/**
	Strict comparison assertion

	@method deepEqual
	@memberOf gt
	@category Comparisons
	*/
	deepEqual: function() {
		this.equal(arguments);
	},

	/**
	Compares arrays as strings

	@method aequal
	@memberOf gt
	@category Comparisons
	*/
	aequal: function(array1, array2, message) {
		this.equal(array1.toString(), array2.toString(), message);
	},

	/**
	Strict not equal comparison.

	@method notDeepEqual
	@memberOf gt
	@category Comparisons
	*/
	notDeepEqual: function () {
		return !this.deepEqual(arguments);
	},

	/**
	Asserts given value is a number

	@method number
	@memberOf gt
	@category Type assertions
	*/
	number: function (n, message) {
		this.equal(typeof n, 'number', message);
	},

	/**
	Asserts given value is a string

	@method string
	@memberOf gt
	@category Type assertions
	*/
	string: function (s, message) {
		this.equal(typeof s, 'string', message);
	},

	/**
	Asserts given value is a number equal to 0

	@method zero
	@memberOf gt
	@category Type assertions
	*/
	zero: function (n, message) {
		this.ok(typeof n === 'number' && !n, message);
	}
};

Assertions.assertions = function () {
	var names = Object.keys(Assertions);
	return names;
};

module.exports = Assertions;