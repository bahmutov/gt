function foo(n) {
  if (n === 100) {
    throw new Error('reached limit');
  }
  foo(n + 1);
}

module.exports = foo;
