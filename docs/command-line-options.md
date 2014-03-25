# command line options

## --no-cover part-of-path

{%= name %} excludes certain common paths from coverage,
speeding up the test runs: node_modules, bower_components, etc.
You can add paths to this list, for example to exclude all files
loaded from `vendor` folders:

    gt --no-cover vendor src/*.js tests/*.js

The option is used as case insensitive regular expression.
