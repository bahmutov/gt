/* global gt:true */
/* jshint indent:2 */
console.assert(gt, 'gt framework not registered');
var _ = require('lodash');

if (typeof gt.equiv === 'undefined') {
  // deep equiality comparison
  gt.equiv = _.isEqual;
}
console.assert(typeof gt.equiv === 'function',
  'expected .equiv property to be a function');
