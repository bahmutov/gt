foo = require('./foo').foo

QUnit.module 'Coffeescript module'

QUnit.test 'example test', -> 
	QUnit.ok true, 'sample true assertion'

QUnit.test 'foo result', ->
	QUnit.equal foo(), 'foo', 'correct return value'