// fixes environment if running inside  phantomjs
if (typeof log === 'undefined') {
	// if there is no custom logger (like custom-logger), do not show debug statements
	global.log = console;
	global.log.debug = function() {};
}

if (typeof Function.prototype.bind !== "function") {
  Function.prototype.bind = function (o) {
      var thisFunction = this;
      return function () {
          return thisFunction.apply(o, [].slice.call(arguments));
      };
  };
  log.debug('added Function.prototype.bind manually');
}