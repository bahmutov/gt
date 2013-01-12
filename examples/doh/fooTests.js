define(['./foo.js'], function (foo) {
	console.assert(doh, 'doh exists');

	doh.register("dohSanity", [
  	function fooExists() {
      doh.assertTrue(foo, 'foo exists');
      doh.assertEqual(typeof foo, 'function');
  	},

  	function returnValue() {
  		var result = foo();
      doh.assertEqual(typeof result, 'string', 'returns string');
      doh.assertEqual(result, 'foo', 'correct return value');
      doh.assertFalse(false, 'this is false value');
  	}
  ]);

  function notCalled() {
  	return 'this function is not called';
  }
});