// Generated on 2014-03-11 using generator-angular 0.6.0


// # Globbing
// for performance reasons we're only matching one level down:
// 'test/spec/{,*/}*.js'
// use this if you want to recursively match all subfolders:
// 'test/spec/**/*.js'

var debug = true;

module.exports = function (grunt) {
  'use strict';
  // Load grunt tasks automatically
  require('load-grunt-tasks')(grunt);

  // Time how long tasks take. Can help when optimizing build times
  require('time-grunt')(grunt);

  // Define the configuration for all the tasks
  grunt.initConfig({

    // Project settings
    yeoman: {
      // configurable paths
      app: require('./bower.json').appPath || '',
      dist: 'dist'
    },
    revision: {
      options: {
        property: 'meta.revision',
        ref: 'HEAD',
        short: true
      }
    },
    preprocess: {
      options: {
        context: {
          DEBUG : debug,
          revision : '<%= meta.revision %>'
        }
      },
      multifile : {
        files: {
          'dist/js/views/main.html' : 'js/views/main.html',
          'dist/index.html' : 'index.html',
          'dist/js/app.js' : 'js/app.js'
        }
      }
    },
    protractor: {
      options: {
        keepAlive: true,
        configFile: 'protractor.js',
        args: {}
      },
      run: {}
    },
    // Watches files for changes and runs tasks based on the changed files
    watch: {
      copy: {
        files: [//changing something here not working? You might be looking for the copy task
            'bower_components/angular/angular.js',
            'bower_components/angular-animate/angular-animate.js',
            'bower_components/angular-resource/angular-resource.js',
            'bower_components/angular-ui/build/angular-ui.js',
            'bower_components/angular-touch/angular-touch.js',
            'bower_components/angular-route/angular-route.js',
            'bower_components/jquery/jquery.js',
            'bower_components/normalize.css/normalize.css',
            'vendor/three.js/build/three.js',
            'vendor/three.js/examples/js/Detector.js',
            'vendor/threex.windowresize.js',
            'vendor/threex.domevent.js',
            'vendor/perlin.js',
            'vendor/require.js/require.js',
            '*.htm*',
            '*.js*',
            'favicon.ico',
            'images/**/*',
            'textures/**/*',
            'models/**/*',
            'fonts/**/*',
            'views/**/*',
            'js/**/*',
            'css/**/*.css',
            'assets/**/*',
            'data/**/*'
          ],
          tasks: ['copy:dist', 'revision', 'preprocess']
        
        },
        js: {
          files: ['<%= yeoman.app %>/js/{,*/}{,*/}*.js'],
          tasks: ['newer:jshint:all']
        },
        testable: {
          files: [
            '<%= yeoman.app %>/js/{,*/}{,*/}*.js',
            '<%= yeoman.app %>/protractor*.js',
            '<%= yeoman.app %>/test/e2e/{,*/}{,*/}*.js',
            '<%= yeoman.app %>/test/spec/{,*/}{,*/}*.js'
          ],
          tasks: ['karma:unit']// 'protractor'
        },
        compass: {
          files: ['<%= yeoman.app %>/{scss,sass}/{,*/}*.scss'],
          tasks: ['compass']
        },
        gruntfile: {
          files: ['Gruntfile.js']
        },
        livereload: {
          options: {
            livereload: '<%= connect.options.livereload %>'
          },
          files: [//comment these files during profiling to avoid accidentally resetting the profiler
            '!<%= yeoman.app %>/dist/*.html',
            '<%= yeoman.app %>/{,*/}*.html',
            '<%= yeoman.app %>/js/{,*/}*.js',
            '<%= yeoman.app %>/css/{,*/}*.scss',
            '<%= yeoman.app %>/assets/images/{,*/}*.{png,jpg,jpeg,gif,webp,svg}'
          ]
        }
      },

      // The actual grunt server settings
      connect: {
        options: {
          port: 9000,
          base: '<%= yeoman.dist %>',
          // Change this to '0.0.0.0' to access the server from outside.
          hostname: '0.0.0.0',
          livereload: 35729
        },
        livereload: {
          options: {
            open: true,
            base: [
              '<%= yeoman.dist %>'
            ]
          }
        },
        dist: {
          options: {
            base: '<%= yeoman.dist %>'
          }
        },
        test: {
          options: {
            port: 9001,
            base: [
              'test',
              '<%= yeoman.dist %>'
            ]
          }
        }
      },

      // Make sure code css are up to par and there are no obvious mistakes
      jshint: {
        options: {
          jshintrc: '.jshintrc',
          reporter: require('jshint-stylish')
        },
        all: [
          'Gruntfile.js',
          '<%= yeoman.app %>/js/{,*/}*.js'
        ]
      },
      karma: {
        unit: {
          configFile: 'karma.conf.js',
          singleRun: true
          // autoWatch: true
        }
      },
      compass: {
        options: {
          config: 'config.rb'
        },
        server: {
          options: {
            debugInfo: true
          }
        }
      },
      // Empties folders to start fresh
      clean: {
        server: {},
        dist: {
          files: [{
            dot: true,
            src: [
              '<%= yeoman.dist %>/*',
              '!<%= yeoman.dist %>/.git*'
            ]
          }]
        }
      },

      // Renames files for browser caching purposes
      rev: {
        dist: {
          files: {
            src: [
              '<%= yeoman.dist %>/js/{,*/}*.js',
              '<%= yeoman.dist %>/css/{,*/}*.css',
              '<%= yeoman.dist %>/images/{,*/}*.{png,jpg,jpeg,gif,webp,svg}',
              '<%= yeoman.dist %>/css/fonts/*'
            ]
          }
        }
      },

      // Copies remaining files to places other tasks can use
      copy: {
        dist: {
          files: [{
            expand: true,
            dot: true,
            cwd: '<%= yeoman.app %>',
            dest: '<%= yeoman.dist %>',
            src: [
              'bower_components/angular/angular.js',
              'bower_components/angular-animate/angular-animate.js',
              'bower_components/angular-resource/angular-resource.js',
              'bower_components/angular-ui/build/angular-ui.js',
              'bower_components/angular-touch/angular-touch.js',
              'bower_components/angular-route/angular-route.js',
              'bower_components/jquery/jquery.js',
              'bower_components/normalize.css/normalize.css',
              'vendor/three.js/build/three.js',
              'vendor/three.js/examples/js/Detector.js',
              'vendor/threex.windowresize.js',
              'vendor/threex.domevent.js',
              'vendor/perlin.js',
              'vendor/require.js/require.js',
              '*.htm*',
              '*.js*',
              'favicon.ico',
              'images/**/*',
              'textures/**/*',
              'models/**/*',
              'fonts/**/*',
              'views/**/*',
              'js/**/*',
              'css/**/*.css',
              'assets/**/*',
              'data/**/*'
            ]
          }]
        }
      },

      // Run some tasks in parallel to speed up the build process
      concurrent: {
        server: [
          'compass'
        ],
        test: [
          'compass'
        ],
        dist: [
          'compass'
        ]
      }
    });


  grunt.registerTask('serve', function (target) {
    if (target === 'dist') {
      return grunt.task.run(['build', 'connect:dist:keepalive']);
    }
    grunt.task.run([
      'revision',
      'copy',
      'preprocess',
      'clean:server',
      'concurrent:server',
      'connect:livereload',
      'karma',
      'watch'
    ]);
  });
  
  grunt.loadNpmTasks('grunt-git-revision');
  grunt.loadNpmTasks('grunt-preprocess');
  grunt.loadNpmTasks('grunt-karma');

  grunt.loadNpmTasks('grunt-protractor-runner');

  grunt.registerTask('server', function () {
    grunt.log.warn('The `server` task has been deprecated. Use `grunt serve` to start a server.');
    grunt.task.run(['serve']);
  });

  grunt.registerTask('test', [
    'clean:server',
    'concurrent:test',
    'connect:test',
    'karma'//,
    // 'protractor:run'
  ]);


  grunt.registerTask('default', [
    'newer:jshint',
    'test',
    'build'
  ]);
};
