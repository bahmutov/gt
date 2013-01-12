TestSuite.test_exists = function() {
	jsUnity.assertions.assertEqual(typeof foo, 'object');
	jsUnity.assertions.assertEqual(typeof foo.get, 'function');
};

TestSuite.test_returnValue = function() {
	var result = foo.get();
  jsUnity.assertions.assertEqual(result, 'foo');
};

TestSuite.test_nonExisting = function () {
	jsUnity.assertions.assertException(function() {
  	foo.set();
  });
};

function notCalled() {
	return 'this method is not called!';
}