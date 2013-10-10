/*global module:false*/
module.exports = function (grunt) {

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        jshint: {
            options: {
                jshintrc: '.jshintrc',
            },
            'default': {
                src: [ '*.js', 'src/*.js' ]
            }
        },
        'nice-package': {
            all: {}
        }
    });

    var plugins = module.require('matchdep').filterDev('grunt-*');
    plugins.forEach(grunt.loadNpmTasks);

    grunt.registerTask('default', ['deps-ok', 'nice-package', 'jshint']);
};
