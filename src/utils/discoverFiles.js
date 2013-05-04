var glob = require('glob');
var check = require('check-types');
var path = require('path');
var unary = require('allong.es').es.unary;

module.exports.discoverSourceFiles = function(files) {
	check.verifyArray(files, 'expect list of filenames');

	var filenames = files.reduce(function (all, shortName) {
		check.verifyString(shortName, 'missing filename');
		var files = glob.sync(shortName);
		return all.concat(files);
	}, []);

    console.log(filenames);
	filenames = filenames.map(unary(path.resolve));
	return filenames;
};