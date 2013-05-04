var _ = require('lodash');
var objects = require('./pluckObjects').objects;
var pluckFunction = require('../pluckFunction');

gt.module('pluck using function');
gt.test('pluckFunction', function () {
	gt.func(pluckFunction, 'pluckFunction is a function');
	gt.arity(pluckFunction, 1, 'expects single input');
	gt.raisesAssertion(function() {
		pluckFunction();
	}, 'needs argument');
});

gt.test('by pluck function', function () {
	var results = _.filter(objects, pluckFunction('isChild'));
	gt.array(results, 'returned an array');
});

gt.test('check prototype function', function () {
	gt.ok(!objects[0].isOlderThan4(), 'first is not');
	gt.ok(objects[1].isOlderThan4(), 'second is');
	gt.ok(objects[2].isOlderThan4(), 'third is');
});

gt.test('by pluck function in prototype', function () {
	var results = _.filter(objects, pluckFunction('isOlderThan4'));
	gt.equal(results.length, 2, 'two are older than 4');
});

gt.test('pluck property does not exist', function () {
	var results = _.filter(objects, pluckFunction('something'));
	gt.equal(results.length, 0, 'empty array is returned');
});

gt.test('Array.some', function() {
	var anyChildren = objects.some(pluckFunction('isChild'));
	gt.ok(anyChildren, 'there are childre');

	var nothing = objects.some(pluckFunction('something'));
	gt.ok(!nothing, 'property does not exist');
});