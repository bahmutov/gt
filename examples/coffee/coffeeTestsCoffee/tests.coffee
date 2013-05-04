foo = require('./foo.coffee').foo

gt.module 'coffee unit tests for coffee module'

gt.test 'foo', ->
	gt.func foo, 'foo is a function'
	gt.equal foo(), 'foo', 'correct return value'