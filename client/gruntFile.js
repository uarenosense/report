module.exports = function(grunt){
    grunt.loadNpmTasks('grunt-bower-task');
    var path = require('path');

    grunt.initConfig({
        distdir: 'dist',
        bower:{
            install:{
                options:{
                    targetDir:'src/vendor',
                    cleanTargetDir:true,
                    cleanBowerDir:false,
                    layout:'byComponent'
                }
            }
        }
    });
};