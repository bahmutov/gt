var watch = require('nodewatch');
var check = require('check-types');
var unary = require('allong.es').unary;

module.exports.watchFiles = function(filenames, callBack) {
	check.verifyArray(filenames, 'expected list of files');
	if (!filenames.length) {
		return;
	}
	console.log('watching', filenames.length, 'files...');
	filenames.forEach(unary(watch.add.bind(watch)));
	watch.onChange(callBack);
}