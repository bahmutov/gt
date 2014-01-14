# Install and run

**gt** requires *nodejs* and a few modules to run. Assuming you wrote a few qunit tests in tests.js:

```sh
sudo npm install -g gt
gt tests.js

some of the options (-h for all):
  -l <debug level> 0 = debug, 1 = default, 2 = warnings, 3 = errors
  -r <report level> 0 = all (default), 1 = failed tests only
```