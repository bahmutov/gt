(function moduleLifecycleTests(gt) {
	var foo = null;
	var counter = 0;

	gt.module('module setup and teardown', {
		setup: function () {
			console.log('test module setup');
			foo = 'foo';
			counter += 1;
		},
		teardown: function () {
			console.log('test module teardown');
			console.assert(foo === 'foo', 'foo had value');
			foo = 'bar';
		}
	});

	gt.test('foo was initialized', function () {
		gt.string(foo, 'foo is a string');
		gt.equal(foo, 'foo', 'foo value');
		gt.equal(counter, 1, 'valid counter');
	});

	gt.test('foo was initialized again', function () {
		gt.string(foo, 'foo is a string');
		gt.equal(foo, 'foo', 'foo value');
		gt.equal(counter, 2, 'valid counter');
	});

	gt.module('second module with just setup', {
		setup: function () {
			counter += 1;
		}
	});

	gt.test('counter was initialized previously', function () {
		gt.equal(counter, 3, 'valid counter');
	});

	gt.test('counter incremented', function () {
		gt.equal(counter, 4, 'valid counter');
	});

	gt.module('third module with just teardown', {
		teardown: function () {
			counter += 1;
		}
	});

	gt.test('counter has same value', function () {
		gt.equal(counter, 4, 'valid counter');
	});

	gt.test('counter once', function () {
		gt.equal(counter, 5, 'valid counter');
	});

}(gt));

(function setupOnceTests(gt) {
	var counter = 0;

	gt.module('setupOnce tests', {
		setupOnce: function () {
			counter = 100;
		},
		setup: function () {
			console.assert(counter >= 100, 'counter >= 100');
			counter += 1;
		}
	});

	gt.test('first', function () {
		gt.equal(counter, 101, 'counter has been initialized in setupOnce');
	});

	gt.test('second', function () {
		gt.equal(counter, 102, 'counter has been initialized in setupOnce');
	});
}(gt));

gt.module('supports setup and teardown properties');

gt.test('supports object', function () {
	gt.object(gt.supports, 'supports is an object');
	gt.ok(gt.supports.setup, 'module.setup is supported');
	gt.ok(gt.supports.teardown, 'module.teardown is supported');
});

gt.test('supports setupOnce and teardownOnce', function () {
	gt.ok(gt.supports.setupOnce, 'module.setupOnce is supported natively');
	gt.ok(gt.supports.teardownOnce, 'module.teardownOnce is supported natively');
});
