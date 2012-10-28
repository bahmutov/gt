function getLines (n) {
	console.assert(n >= 0 && n < 200, "invalid number of characters", n);
	if (n === 0) {
		return "";
	}
	
	var str = "";
	for (var k = 0; k < n; k += 1) {
		str += "=";
	}
	return str;
}

function centerMessage(n, message) {
	console.assert(n > 0 && n < 200, "invalid number of characters", n);
	
	var str = '';
	if (typeof message === "string" && message.length > 0) {
		message = ' ' + message + ' ';
		if (n < message.length) {
			n = message.length;
			str = message;
		} else {
			var start = Math.floor((n - message.length) / 2);
			if (start < 0) {
				start = 0;
			}
			var end = n - start - message.length;
			// console.log("start", start, "message", message.length, "end", end);
			str = getLines(start) + message;
			if (end > 0) {
				str += getLines(end);
			} else {
				end = 0;
			}
		}
	} else {
		str = getLines(n);
	}
	
	console.assert(str.length === n, "need string with", n, "characters, got", str.length, "string '" + str + "'");
	return str;
}

exports.getLines = getLines;
exports.centerMessage = centerMessage;