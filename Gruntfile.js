/*global module:false*/
module.exports = function (grunt) {
    require('time-grunt')(grunt);
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        lineending: {
            index: {
                options: {
                    eol: 'lf'
                },
                files: {
                    'gt.js': 'gt.js'
                }
            }
        },
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
        complexity: grunt.file.readJSON('complexity.json'),
        bump: {
            options: {
                commit: true,
                commitMessage: 'Release v%VERSION%',
                commitFiles: ['-a'], // '-a' for all files
                createTag: true,
                tagName: '%VERSION%',
                tagMessage: 'Version %VERSION%',
                push: true,
                pushTo: 'origin'
            }
        },
        readme: {
            options: {
                readme: './docs/README.tmpl.md',
                templates: './docs',
                docs: '.'
            }
        }
    });

    var plugins = module.require('matchdep').filterDev('grunt-*');
    plugins.forEach(grunt.loadNpmTasks);

    grunt.registerTask('pre-check', ['deps-ok', 'jsonlint',
        'jshint', 'nice-package', 'complexity']);
    grunt.registerTask('default', ['pre-check', 'lineending']);
    grunt.registerTask('release', ['bump-only:patch', 'readme', 'bump-commit']);
};
