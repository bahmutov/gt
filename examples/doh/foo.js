({
  define: typeof define === 'function' ? define :
  function(A, F) { module.exports = F.apply(null, A.map(require)); }
}).
define([], function () {
	function notCalled() {
		if (true) {
			return 'this is not called';
		}
	}

	return function () {
		return 'foo';
	};
});