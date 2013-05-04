// var safeFoo = optional(foo);
// safeFoo(condition, arg1, arg2);
function optional(fn) {
	return function(condition) {
		if (condition) {
			return fn.apply(this, [].slice.call(arguments, 1));
		}
	};
}

gt.module('optional');

var foo = function() { return 'foo'; };
var echo = function(value) { return value; }

gt.test(function basic() {
	gt.func(foo, 'foo is a function');
	gt.equal(foo(), 'foo', 'foo returns correct value');

	var safeFoo = optional(foo);
	gt.func(safeFoo, 'safe foo is a function');
	gt.equal(safeFoo(true), 'foo', 'called foo because condition is true');
});

gt.test(function falseCondition() {
	var safeFoo = optional(foo);
	gt.func(safeFoo, 'safe foo is a function');
	gt.undefined(safeFoo(false), 'not called foo');
});

gt.test(function variableCondition() {
	var safeFoo = optional(foo);
	gt.func(safeFoo, 'safe foo is a function');
	var condition = false;
	gt.undefined(safeFoo(condition), 'not called foo');
	condition = true;
	gt.equal(safeFoo(condition), 'foo', 'called foo');
});

gt.test(function passingArguments() {
	var safeEcho = optional(echo);
	gt.equal(safeEcho(true, 'f'), 'f', 'echoed f');
	gt.equal(safeEcho(true, 2), 2, 'echoed 2');
	gt.undefined(safeEcho(false, 4), 'nothing echoed');
});
