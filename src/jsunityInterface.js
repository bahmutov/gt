console.assert(gt, 'gt framework not registered');

global.jsUnity = gt;
jsUnity.assertions = {
	assertEqual: gt.equal.bind(gt),
	assertException: function(code) {
		gt.raises(code, 'raises assertion');
	}
};

// note: testing framework will create new global.TestSuite
// before loading each file