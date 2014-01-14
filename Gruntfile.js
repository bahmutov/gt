/*global module:false*/
module.exports = function (grunt) {

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        jshint: {
            options: {
                jshintrc: '.jshintrc',
                reporter: require('jshint-stylish')
            },
            'default': {
                src: [ '*.js', 'src/*.js' ]
            }
        },
        jsonlint: {
            all: {
                src: ['*.json']
            }
        },
        'nice-package': {
            all: {}
        },
        complexity: grunt.file.readJSON('complexity.json')
    });

    var plugins = module.require('matchdep').filterDev('grunt-*');
    plugins.forEach(grunt.loadNpmTasks);

    grunt.registerTask('pre-check', ['deps-ok', 'jsonlint',
        'jshint', 'nice-package', 'complexity']);
    grunt.registerTask('default', ['pre-check']);
};
