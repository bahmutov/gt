require('lazy-ass');
var covered = require('./src/covered');
var sure = require('./src/sure');
module.exports = {
	TestingWithCoverage: covered,
	TestingFramework: sure
};

if (!module.parent) {
	throw new Error('Use bin/gt.js as a stand alone command');
}
