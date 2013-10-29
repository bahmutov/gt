var glob = require('glob');
var check = require('check-types');
var path = require('path');
var unary = require('allong.es').es.unary;

module.exports.discoverSourceFiles = function(files) {
	check.verify.array(files, 'expect list of filenames');

	var filenames = files.reduce(function (all, shortName) {
		check.verify.string(shortName, 'missing filename');
		var files = glob.sync(shortName);
		return all.concat(files);
	}, []);

    log.debug(filenames);
	filenames = filenames.map(unary(path.resolve));
	return filenames;
};
