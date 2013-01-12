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