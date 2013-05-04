delete require.cache[require.resolve('../utils')];
var utils = require('../utils');

QUnit.module('utils');

QUnit.test('getLines without arguments', function () {
	QUnit.raises(function () {
		utils.getLines();
	}, 'without arguments get an exception');
});

QUnit.test('getLines', function () {
	QUnit.equal(utils.getLines(1), '=', '1 =');
	QUnit.equal(utils.getLines(2), '==', '2 ==');
});

QUnit.test('centerMessage without arguments', function () {
	QUnit.raises(function () {
		utils.centerMessage();
	}, 'without arguments get an exception');
});

QUnit.test('center message no content', function () {
	QUnit.equal(utils.centerMessage(1), '=', '1 char');
	QUnit.equal(utils.centerMessage(2), '==', '2 char');
});

QUnit.test('center message with not enough space', function () {
	QUnit.equal(utils.centerMessage(1, 'foo'), ' foo ', 'super short message 1');
	QUnit.equal(utils.centerMessage(2, 'foo'), ' foo ', 'super short message 2');
	QUnit.equal(utils.centerMessage(3, 'foo'), ' foo ', 'super short message 3');
	QUnit.equal(utils.centerMessage(4, 'foo'), ' foo ', 'super short message 4');
});

QUnit.test('center small message', function () {
	QUnit.equal(utils.centerMessage(5, 'foo'), ' foo ', 'short message');
	QUnit.equal(utils.centerMessage(6, 'foo'), ' foo =', 'short message');
	QUnit.equal(utils.centerMessage(7, 'foo'), '= foo =', 'short message');
});

QUnit.test('get caller', function () {
	QUnit.equal(typeof utils.getCallerFilename, 'function', "it's a function");
});