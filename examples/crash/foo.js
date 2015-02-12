require('cute-stack')(require('bad-line'));

gt.module('crash in unit test');

gt.test('crashes', function () {
  'use strict';
  doesNotExist = 'foo';
});
