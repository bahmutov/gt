var gt = require('../../sure.js');
gt.init();

/*
    We need to instrument the loaded js source code ourselves.
    1. Load module API to Istanbul code coverage tool
    2. Update dojo source
        - add the following to dojo/dojo.js around line 1337 inside function evalModuleText
    
    evalModuleText = function(text, module){
        // add the next check and call
        if (userConfig.moduleTransform) {
            text = userConfig.moduleTransform(text, module);
        }
        ...
*/
var cover = require('../../lib/coverage.js');

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
    }],
    moduleTransform: function(moduleText, moduleDefinition) {
        if (/^src\/|^test\//.test(moduleDefinition.mid)) {
            var filename = moduleDefinition.mid;
            if (!/\.js$/.test(filename)) {
                filename += '.js';
            }
            console.log('transforming module', filename, 'for dojo');
            var instrumented = cover.instrumentCode(moduleText, filename);
            return instrumented;
        }
        return moduleText;
    }
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
    cover.writeReports('cover');
    process.exit(failed);
});
