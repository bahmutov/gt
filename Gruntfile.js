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
        }
    });

    grunt.loadNpmTasks('grunt-deps-ok');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.registerTask('default', ['deps-ok', 'jshint']);
    grunt.loadNpmTasks('grunt-bump');
};