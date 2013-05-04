// Adapts GT framework names to QUnit test runner
if (typeof QUnit === 'object' && 
	typeof QUnit.extend === 'function') {
	QUnit.extend( QUnit, {
		aequal: function(array1, array2, message) {
			var a1 = array1.toString();
			var a2 = array2.toString();
			var passes = (a1 === a2);
			QUnit.push(passes, a1, a2, message);
		}
	});
	gt = QUnit;
}