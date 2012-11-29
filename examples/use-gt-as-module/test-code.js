var gt = require('../../sure.js');
gt.init({
	files: ['fooTest.js']
});
var failed = gt.run();
console.log(failed + ' tests failed');
process.exit(failed);