var check = require('check-types');

function pluckFunction(property) {
	check.verifyString(property, 'missing property name');
	function propertyCall(obj) {
		check.verifyObject(obj, 'missing object');
		if (check.isFunction(obj[property])) {
			return obj[property].call(obj);
		}
		return false;
	}
	return propertyCall;
}

module.exports = pluckFunction;
