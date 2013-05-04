foo = -> return 'foo'
bar = -> return foo()

module.exports.foo = foo;