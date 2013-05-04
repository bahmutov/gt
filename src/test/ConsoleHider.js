delete require.cache[require.resolve('../ConsoleHider')];
var ConsoleHider = require('../ConsoleHider').ConsoleHider;

QUnit.module('ConsoleHider');

QUnit.test('Hide/show single message', function () {
	QUnit.equal(typeof ConsoleHider, 'function', 'ConsoleHider is an function');
	var hider = new ConsoleHider();
	QUnit.equal(typeof hider, 'object', 'hider is an object');

	hider.hideConsole();
	var msg = 'this is a message';
	console.log(msg);
	var messages = hider.restoreConsole();
	QUnit.equal(messages, msg, 'returned correct message');
});

QUnit.test('all streams are captured', function () {
	var hider = new ConsoleHider();
	hider.hideConsole();
	console.log('one');
	console.warn('two');
	console.error('three');
	console.log('four');
	QUnit.equal(hider.restoreConsole(), 'one\ntwo\nthree\nfour', 'all streams are returned');
});