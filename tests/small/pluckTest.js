var _ = require('lodash');
var objects = require('./pluckObjects').objects;

gt.module('pluck using lodash');

gt.test('simple function', function () {
	function isEven(n) { return n % 2 === 0; }
	var numbers = [1, 2, 3, 4, 5, 6, 7];
	var evens = _.filter(numbers, isEven);
	gt.aequal(evens, [2, 4, 6], 'filtered even numbers');
});

gt.test('by property', function () {
	var results = _.filter(objects, 'child');
	gt.equal(results.length, 2, 'picked two objects');
	gt.aequal(results, [objects[0], objects[1]], 'picked');
});

gt.test('by bool property value', function () {
	var results = _.filter(objects, {child: true});
	gt.equal(results.length, 2, 'picked two objects');
	gt.aequal(results, [objects[0], objects[1]], 'picked');
});

gt.test('by string property value', function () {
	var results = _.filter(objects, {name: 'a'});
	gt.equal(results.length, 1, 'picked 1 object');
	gt.aequal(results, [objects[0]], 'picked');
});

gt.test('by two properties', function () {
	var results = _.filter(objects, {
		child: true,
		age: 5
	});
	gt.equal(results.length, 1, 'picked 1 object');
	gt.aequal(results, [objects[1]], 'picked');
});

gt.test('testing isChild', 3, function() {
	gt.ok(objects[0].isChild(), 'is child');
	gt.ok(objects[1].isChild(), 'is child');
	gt.ok(!objects[2].isChild(), 'is NOT child');
});

gt.test('by bool function', function () {
	var results = _.filter(objects, 'isChild');
	// all objects have function names isChild
	gt.equal(results.length, 3, 'picked all objects');
	gt.aequal(results, objects, 'picked');
});
