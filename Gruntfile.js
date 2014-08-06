module.exports = function(grunt) { 
    grunt.initConfig({
		jshint: {
            options: {
                jshintrc: '.jshintrc'
            },
            all: ['src/**/*.js']
        },
        less: {
            development: {
                options: {
                    paths: ['content/css']
                },
                files: {
                    'min/css/themes/sample/sample.min.debug.css': 'content/css/themes/sample.less'
                }
            },
            production: {
                options: {
                    paths: ['content/css'],
                    yuicompress: true
                },
                files: {
                    'min/css/themes/sample/sample.min.css': 'content/css/themes/sample.less'
                }
            }
        },
		watch: {
            options: {
                livereload: true
            },
            scripts: {
                files: ['src/**/*.js', 'configuration/**/*.js', '../../argos-sdk/src/**/*.js'],
                tasks: ['jshint'],
                options: {
                    spawn: false
                }
            },
            less: {
                // To get livereload to work with less files, you need to go into node_modules\grunt-contrib-watch\node_modules\tiny-lr\lib\public\livereload.js
                // and modify the reloadLess function and remove the cache busting code.
                // See: https://github.com/mklabs/tiny-lr/issues/22#issuecomment-34702527
                files: ['content/**/*.less'],
                tasks: ['less'],
                options: {
                    spawn: false
                }
            }
        }
    });
    
    grunt.loadNpmTasks('grunt-contrib-less');
	grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-watch');

    grunt.registerTask('default', ['less']);
};
