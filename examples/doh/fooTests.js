({
  define: typeof define === 'function' ? define :
  function(A, F) { module.exports = F.apply(null, A.map(require)); }
}).
define(['./foo'], function (foo) {
	console.assert(doh, 'doh exists');

	function fooExists() {
    doh.assertTrue(foo, 'foo exists');
    doh.assertEqual(typeof foo, 'function');
	}

	function returnValue() {
		var result = foo();
    doh.assertEqual(typeof result, 'string', 'returns string');
    doh.assertEqual(result, 'foo', 'correct return value');
    doh.assertFalse(false, 'this is false value');
	}

  doh.register("dohSanity", [
    fooExists,
    returnValue
  ]);

  function notCalled() {
  	return 'this function is not called';
  }
});