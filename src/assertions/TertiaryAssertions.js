/** @module assertions/tertiary */

// a few extra utility assertion methods, implemented using simpler ones
var SecondaryAssertions = require('./SecondaryAssertions');
var check = require('check-types');

check.verifyObject(SecondaryAssertions, 'missing secondary assertions');

var Assertions = {
	fn: function() {
		this.func(arguments);
	},
	deepEqual: function() {
		this.equal(arguments);
	},
	aequal: function(array1, array2, message) {
		this.equal(array1.toString(), array2.toString(), message);
	},
	notDeepEqual: function () {
		return !this.deepEqual(arguments);
	},
	number: function (n, message) {
		this.equal(typeof n, 'number', message);
	},
	string: function (s, message) {
		this.equal(typeof s, 'string', message);
	},
	zero: function (n, message) {
		this.ok(typeof n === 'number' && !n, message);
	}
};

Assertions.assertions = function () {
	var names = Object.keys(Assertions);
	return names;
};

module.exports = Assertions;