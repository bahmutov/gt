## module

Creates new suite of tests with given name

```js
gt.module('math tests');
```

You can specify additional functions to run before / after
each unit tests. You can also specify a function to run once
before any tests, and after all tests.

```js
gt.module('server tests', {
    setupOnce: function () {
        // setup server
    },
    setup: function () {
        // clear data before each unit test
    },
    teardown: function () {
        // clean up after each unit test
    },
    teardownOnce: function () {
        // stop server
    }
});
```

See [module tests](examples/moduleSetupTeardown/test.js) for more information and examples