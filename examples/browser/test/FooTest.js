require(["src/Foo"], function (foo) {
	console.log('Running Foo tests');
  gt.module("Foo tests");

  gt.test("Foo tests", function () {
		gt.equal(typeof foo, 'function', 'foo is a function');
    gt.equal(foo(), 'foo', 'foo returns string foo');
  });

  /*
	gt.test("fail test on purpose", function () {
		gt.ok(false, 'this assertion fails on purpose');
	});
	*/

  gt.test('test document', function () {
  	gt.equal(typeof document, 'object', 'document exists');
  	var canvas = document.createElement('canvas');
  	gt.equal(typeof canvas, 'object', 'inserted a canvas into document');
  	canvas.setAttribute('id', 'testCanvas');
  	canvas.setAttribute('width', '100');
  	canvas.setAttribute('height', '50');

  	gt.equal(typeof document.body, 'object', 'document.body exists');
  	document.body.appendChild(canvas);

  	canvas = document.getElementById('testCanvas');
  	gt.equal(typeof canvas, 'object', 'fetched canvas by id');
  	console.log(canvas);
  });
});