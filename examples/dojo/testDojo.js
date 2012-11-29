var gt = require('../../sure.js');
gt.init();

dojoConfig = {
    async: false,
    cacheBust: true,
    baseUrl: ".",
    packages: [
    {
        name: 'dojo',
        location: './dojo-1.8.1'
    },
    {
        name: "test",
        location: "test"
    },
    {
        name: "src",
        location: "src"
    }]
};

console.assert(!global.require, "there is global require before dojo loading");
// in order to work, need to use dojo source files, not compiled release!
require('./dojo-1.8.1/dojo.js');
console.assert(global.require, "dojo installed global require function");

global.require([
    "test/FooTest"
], function () {
    console.log('running tests');
    var failed = gt.run();
    console.log(failed + ' tests failed');
    process.exit(failed);
});
