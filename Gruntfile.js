/*
 * angular-google-places-map
 *
 * Copyright (c) 2015 Davide Pedone
 * Licensed under the MIT license.
 * https://github.com/davidepedone/angular-google-places-map
 */

'use strict';

module.exports = function (grunt) {
	// Load grunt tasks automatically
	require('load-grunt-tasks')(grunt);

	grunt.initConfig({

		clean: {
            js: [ 'dist/js' ],
            css: [ 'dist/css' ],
            build: [ 'dist/' ]
		},
        less: {
        	dist:{
	            options: {
	                paths: [ "less" ],
	                compress: true
	            },
	            files: {
	                "dist/css/ngmapcluster.min.css": [ "src/less/ngmapcluster.less" ]
	            }
        	}
        },
		uglify: {
			dist: {
                // options:{
                //     beautify: true,
                //     compress: false
                // },
				files: {
					'dist/js/ngmapcluster.min.js': ['src/js/ngmapcluster.js']
				}
			}
		},
        jshint: {
            options: {
                jshintrc: '.jshintrc',
            },
            js: [ 'src/js/**/*.js']
        },
        watch: {
            js: {
                files: 'src/js/*.js',
                tasks: [ 'clean:js', 'jshint', 'uglify' ]
            },
            css:{
                files: 'src/less/*.less',
                tasks: [ 'clean:css', 'less']
            }
        }
	});

	grunt.registerTask('build', ['clean:build', 'less', 'jshint', 'uglify']);

	grunt.registerTask('default', ['build']);
};
