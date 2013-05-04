/*
    gt unit testing framework with Dojo doh support adapter
    requires DOJO toolkit.
     
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

var cover = require('../lib/coverage.js');
function loadDojo() {
    var path = require('path');
    var dojoPath = path.join(__dirname, 'dojo-1.8.1');

    dojoConfig = {
        async: false,
        cacheBust: true,
        baseUrl: ".",
        packages: [
        {
            name: 'dojo',
            location: dojoPath
        },
        {
            name: '.',
            location: '.'
        }
        ],
        moduleTransform: function(moduleText, moduleDefinition) {
            if (!/^dojo/.test(moduleDefinition.mid)) {
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
    require(path.join(dojoPath, 'dojo.js'));
    console.assert(global.require, "dojo installed global require function");
    console.assert(global.define, 'define is not defined');
}

function run(allFiles) {
    console.assert(Array.isArray(allFiles), 'expect list of files');

    loadDojo();
    var sure = require('../sure.js');
    sure.init({
        colors: true
    });
    console.assert(gt, 'could not find gt framework global object');
    
    require('./dohInterface');

    global.require(allFiles, function () {
        console.log('loaded files', allFiles);
        var failed = sure.run()[0];
        cover.writeReports('cover');
    });
}

module.exports.run = run;