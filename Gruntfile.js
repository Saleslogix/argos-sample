module.exports = function(grunt) {

  // Load per-task config from separate files
  grunt.loadTasks('grunt-tasks');

  grunt.registerTask('default', ['argos-deps', 'less']);
};
