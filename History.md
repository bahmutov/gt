
0.8.20 / 2013-11-09
==================

  * added setupOnce and teardownOnce support

```javascript
gt.module('example', {
  setupOnce: function() {
    // runs before all tests in the module
  },
  setup: function() {
    // runs before each test
  },
  teardown: function() {
    // runs after each test
  },
  teardownOnce: function() {
    // runs after all tests in the module
  }
});
```

  * added setup and teardown supports flags

```javascript
gt.supports // an object
gt.supports.setupOnce    // frameworks supports module.setupOnce
gt.supports.teardownOnce // frameworks supports module.teardownOnce
```

0.8.19 / 2013-11-09
==================

  * added module.setup exception handling
  * added module.teardown exception handling

0.8.18 / 2013-11-07
==================

  * added QUnit.push support
  * added QUnit.start support

0.8.17 / 2013-11-07
==================

  * supporting QUnit.extend(QUnit.assert, ...) API for adding custom assertions
  * added grunt-complexity
  * added pre-git
  * clipping long error stacks
  * added async module setup wrapped in once tests

0.8.16 / 2013-10-31
==================

  * testing async module lifecycle
  * added support for async module teardown functions returning promises
  * added support for async module setup functions returning promises

0.8.15 / 2013-10-29
==================

  * using check-types@1.1.0
  * bumped to latest
  * added unit tests for extending assertions through API QUnit.extend

0.8.14 / 2013-10-10
==================

  * passing assert object into unit tests

0.8.13 / 2013-10-10
==================

  * added grunt-nice-package
  * added update notifier
