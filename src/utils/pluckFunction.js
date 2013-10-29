var check = require('check-types');

function pluckFunction(property) {
	check.verify.string(property, 'missing property name');
	function propertyCall(obj) {
		check.verify.object(obj, 'missing object');
		if (check.fn(obj[property])) {
			return obj[property].call(obj);
		}
		return false;
	}
	return propertyCall;
}

module.exports = pluckFunction;
