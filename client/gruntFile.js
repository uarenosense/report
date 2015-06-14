module.exports = function(grunt){
    //load npm task
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-html2js');
    // Default task.
    grunt.registerTask('default', ['build']);
    grunt.registerTask('build', ['clean', 'copy', 'concat', 'html2js','index:build']);
    grunt.registerTask('release', ['clean', 'copy:img', 'cssmin', 'html2js', 'uglify','index:release']);
    //multi task
    grunt.registerMultiTask('index', 'Parse index html.', function(){
        var options = this.options();
        var cdnDomain = options.cdn||'./';
        var indexSrc = grunt.file.read(options.indexSrc, {encoding:'utf-8'});
        var cssFiles = [];
        var jsFiles = [];
        this.files.forEach(function(file){
            if(/\.css$/.test(file.dest)){
                cssFiles.push(cdnDomain+file.dest);
            }else if(/\.js$/.test(file.dest)){
                jsFiles.push(cdnDomain+file.dest);
            }
        });
        grunt.file.write(options.indexDest,grunt.template.process(indexSrc, {data:{css:cssFiles, js:jsFiles}}), {encoding:'utf-8'});
    });

    grunt.initConfig({
        distdir: 'dist',
        pkg: grunt.file.readJSON('package.json'),
        clean: ['<%= distdir %>/*'],
        copy:{
            bootstrap:{
                expand:true,
                cwd:'bower_components/bootstrap/dist',
                src:[
                    'fonts/*',
                    'css/bootstrap.css'
                ],
                dest:'<%= distdir %>/bootstrap/'
            },
            css:{
                expand:true,
                cwd:'src',
                src:['**/*.css'],
                dest:'<%= distdir %>'
            },
            img:{
                expand:true,
                cwd:'src',
                src:['img/**'],
                dest:'<%= distdir %>'
            },
            js:{
                expand:true,
                cwd:'src',
                src:['common/**/*.js', 'app/**/*.js', 'app.js'],
                dest:'<%= distdir %>'
            }
        },
        concat:{
            jquery:{
                src:[
                    'bower_components/jquery/dist/jquery.js',
                    'bower_components/JavaScript-MD5/js/md5.js'
                ],
                dest:'<%= distdir %>/jquery.js'
            },
            angular: {
                src:[
                    'bower_components/angular/angular.js',
                    'bower_components/angular-ui-router/release/angular-ui-router.js',
                    'bower_components/angular-sanitize/angular-sanitize.js',
                    'bower_components/angular-bootstrap/ui-bootstrap.js',
                    'bower_components/angular-bootstrap/ui-bootstrap-tpls.js'
                ],
                dest: '<%= distdir %>/angular.js'
            }
        },
        uglify:{
            jquery:{
                src:['<%= concat.jquery.src%>'],
                dest:'<%= concat.jquery.dest%>'
            },
            angular:{
                src:['<%= concat.angular.src%>'],
                dest:'<%= concat.angular.dest%>'
            },
            template:{
                src:['<%= html2js.app.dest%>', '<%= html2js.common.dest%>'],
                dest:'<%= distdir%>/template.js'
            },
            js:{
                src:['src/common/**/*.js', 'src/app/**/*.js', 'src/app.js'],
                dest:'<%= distdir%>/main.js'
            }
        },
        html2js: {
            app: {
                options: {
                    base: 'src/app'
                },
                src: ['src/app/**/*.tpl.html'],
                dest: '<%= distdir %>/templates/app.js',
                module: 'templates.app'
            },
            common: {
                options: {
                    base: 'src/common'
                },
                src: ['src/common/**/*.tpl.html'],
                dest: '<%= distdir %>/templates/common.js',
                module: 'templates.common'
            }
        },
        cssmin:{
            release:{
                src:['bower_components/bootstrap/dist/css/bootstrap.css', 'src/css/main.css'],
                dest:'<%= distdir%>/css/main.css'
            }
        },
        index:{
            options:{
                indexSrc:'src/index.html',
                indexDest:'<%= distdir %>/index.html'
            },
            build:{
                expand:true,
                cwd:'<%= distdir %>',
                src:[
                    'jquery.js',
                    'angular.js',
                    'templates/**/*.js',
                    '<%= copy.js.src %>',
                    'css/main.css']
            },
            release:{
                expand:true,
                cwd:'<%= distdir %>',
                src:[
                    'jquery.js',
                    'angular.js',
                    'template.js',
                    'main.js',
                    '**/*.css']
            }
        },
        watch:{
            build:{
                files:['src/**/*.js', 'src/**/*.tpl.html', 'src/**/*.css'],
                tasks:['build']
            }
        }
    });
};