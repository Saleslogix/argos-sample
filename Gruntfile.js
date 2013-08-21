module.exports = function(grunt) { 
    grunt.initConfig({
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
        }
    });
    
    grunt.loadNpmTasks('grunt-contrib-less');

    grunt.registerTask('default', ['less']);
};
