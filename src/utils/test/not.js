var _ = require('lodash');
var not = require('../not');

gt.module('not');

gt.test('not basics', function () {
	gt.func(not, 'not is a function');
	gt.arity(not, 1, 'expects single input');
	gt.raisesAssertion(function() {
		not();
	}, 'needs argument');
});

gt.test('calling not', function () {
	function foo() {
		return false;
	}

	gt.ok(not(foo)(), 'not of foo is true');
});

gt.test('calling not with arguments', function () {
	function foo(a) {
		return a;
	}

	gt.ok(!foo(false), '!foo is true');
	gt.ok(not(foo)(false), 'not of foo(false) is true');
});

gt.test('pluck on object', function () {
	var obj = {
		age: 78,
		isOld: function() {
			return this.age > 50;
		}
	};
	gt.ok(obj.isOld(), 'object is old');
	gt.ok(pluck('isOld')(obj), 'obj pluck is old');
});

gt.test('not pluck on object', function () {
	var obj = {
		age: 78,
		isOld: function() {
			return this.age > 50;
		}
	};
	gt.ok(obj.isOld(), 'object is old');
	gt.ok(!not(pluck('isOld'))(obj), 'not obj pluck is old');
});

gt.module('not with pluck');
var objects = require('./pluckObjects').objects;
var pluck = require('../pluckFunction');

gt.test('by pluck function', function () {
	var results = _.filter(objects, not(pluck('isChild')));
	gt.array(results, 'returned an array');
});

gt.test('not by pluck function in prototype', function () {
	var results = _.filter(objects, not(pluck('isOlderThan4')));
	gt.equal(results.length, 1, 'one is NOT older than 4');
});

gt.test('not pluck property does not exist', function () {
	var results = _.filter(objects, not(pluck('something')));
	gt.equal(results.length, 3, 'entire array is returned');
});
