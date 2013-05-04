var fluent = require('allong.es').es.fluent;

gt.module('allong.es fluent');
gt.test('fluent basics', function () {
	gt.func(fluent, 'fluent is a function');
});

var Foo = function () {
	this.value = 'foo';
};

Foo.prototype.set = fluent(function (value) {
	this.value = value;
});

Foo.prototype.double = fluent(function () {
	this.value = this.value + this.value;
});

gt.test('Foo', function() {
	gt.func(Foo, 'Foo is a function');
	var f = new Foo();
	gt.object(f, 'f is an object');
	var b = f.set('bar').double();
	gt.object(b, 'returns an object');
	gt.equal(b, f, 'returns same object');
});

gt.test('Correct value', function () {
	var f = new Foo();
	gt.equal(f.set(5).value, 5, 'set 5');
	gt.equal(f.double().value, 10, 'doubled 5');
	gt.equal(f.set('b').double().value, 'bb', 'doubled b');
});




