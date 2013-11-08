gt.module('stop / start support');

gt.test('stop and start', function () {
  gt.func(gt.stop, 'has stop function');
  gt.func(gt.start, 'has start function');
});

gt.async('start inside async test', function () {
  setTimeout(function () {
    console.log('finished timeout, calling start');
    gt.start();
  }, 100);
});

gt.test('stop and start inside sync test', 1, function () {
  gt.stop();
  setTimeout(function () {
    console.log('finished timeout, calling start');
    gt.ok(true, 'timeout finished');
    gt.start();
  }, 100);
});
