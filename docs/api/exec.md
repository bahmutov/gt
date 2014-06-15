## exec

Spawns new proces, waits for it to finish, then
checks the exit code. Automatically restarts the test queue

**Checking just the exit code**

```js
gt.async('run Nodejs program', function () {
  gt.exec('node', ['index.js', 'arg1', 'arg2'], 0,
    'expect "node index.js arg1 arg2" to exit with code 0');
});
```

**Checking the exit code and the output**

```js
gt.async('run a program', function () {
  gt.exec('node', ['index.js', 'arg1', 'arg2'], 0,
    function (stdout, stderr) {
      if (/error/.test(stdout)) {
        throw new Error('Errors in output ' + stdout);
      }
    });
});
```

Full [exec unit test](examples/exec/tests.js)

**shortcuts:**

```js
gt.exec(cmd, [...], 'msg');
// same as
gt.exec(cmd, [...], 0, 'msg');

gt.exec(cmd, 'msg');
// same as
gt.exec(cmd, [], 0, msg);

gt.exec(cmd);
// same as
gt.exec(cmd, [], 0);
```
