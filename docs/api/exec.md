## exec

Spawns new proces, waits for it to finish, then
checks the exit code. Automatically restarts the test queue

```js
gt.async('run Nodejs program', function () {
  gt.exec('node', ['index.js', 'arg1', 'arg2'], 0,
    'expect "node index.js arg1 arg2" to exit with code 0');
});
```

Full [exec unit test](examples/exec/tests.js)