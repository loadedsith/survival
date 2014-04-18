// Generated on 2014-03-11 using generator-angular 0.6.0


// # Globbing
// for performance reasons we're only matching one level down:
// 'test/spec/{,*/}*.js'
// use this if you want to recursively match all subfolders:
// 'test/spec/**/*.js'

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
          revision: '<%= meta.revision %>'
        }
      },
      html : {
          src : 'index.html',
          dest : 'dist/index.html'
      },
    },
    protractor: {
      options: {
        keepAlive: true,
        configFile: 'protractor.js',
        args:{}
      },
      run: {}
    },
    // Watches files for changes and runs tasks based on the changed files
    watch: {
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
      json: {
        files: ['<%= yeoman.app %>/data/{,*/}*.json']
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
          // '<%= yeoman.app %>/{,*/}*.html',
          // '!<%= yeoman.app %>/dist/*.html',
          '<%= yeoman.app %>/js/{,*/}*.js',
          '<%= yeoman.app %>/css/{,*/}*.scss',
          '<%= yeoman.app %>/assets/images/{,*/}*.{png,jpg,jpeg,gif,webp,svg}'
        ]
      },
      preprocess: {
        files: [//comment these files during profiling to avoid accidentally resetting the profiler
          '<%= yeoman.app %>/{,*/}*.html',
          '<%= yeoman.app %>/js/views/{,*/}*.html',
          '<%= yeoman.app %>/js/{,*/}*.js',
          '<%= yeoman.app %>/css/{,*/}*.scss',
          '<%= yeoman.app %>/assets/images/{,*/}*.{png,jpg,jpeg,gif,webp,svg}'
        ],
        tasks: ['revision','preprocess']
      }
    },

    // The actual grunt server settings
    connect: {
      options: {
        port: 9000,
        base: 'site',
        // Change this to '0.0.0.0' to access the server from outside.
        hostname: '0.0.0.0',
        livereload: 35729
      },
      livereload: {
        options: {
          open: true,
          base: [
            '<%= yeoman.app %>'
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
            '<%= yeoman.app %>'
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
            '*.htm*',
            '*.js*',
            'favicon.ico',
            'images/**/*',
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
    },
    compress: {
      main: {
        options: {
          archive: function () {
            var dateFormat = require('dateformat'),
                now = new Date();
            return 'builds/build' + dateFormat(now, 'yy-mm-dd_HHMMtt') + '.zip';
          }
        },
        files: [
          {src: ['**'], cwd: 'dist/', dest: '/'}//, // includes files in path and its subdirs
          // {expand: true, cwd: 'path/', src: ['**'], dest: 'internal_folder3/'}, // makes all src relative to cwd
          // {flatten: true, src: ['path/**'], dest: 'internal_folder4/', filter: 'isFile'} // flattens results to a single level
        ]
      }
    }
  });


  grunt.registerTask('serve', function (target) {
    if (target === 'dist') {
      return grunt.task.run(['build', 'connect:dist:keepalive']);
    }
      grunt.task.run([
      'revision',
      'preprocess',
      'clean:server',
      'concurrent:server',
      'connect:livereload',
      // 'karma',
      'watch'
    ]);
  });
  
  grunt.loadNpmTasks('grunt-git-revision');
  grunt.loadNpmTasks('grunt-preprocess');
  grunt.loadNpmTasks('grunt-karma');
  grunt.loadNpmTasks('grunt-contrib-compress');
  grunt.loadNpmTasks('grunt-protractor-runner');

  grunt.registerTask('server', function () {
    grunt.log.warn('The `server` task has been deprecated. Use `grunt serve` to start a server.');
    grunt.task.run(['serve']);
  });

  grunt.registerTask('test', [
    'clean:server',
    'concurrent:test',
    'connect:test',
    'karma',
    // 'protractor:run'
  ]);

  grunt.registerTask('build', [
    'clean:dist',
    'concurrent:dist',
    // 'concat',
    'copy:dist',
    'rev',
    'compress'
  ]);

  grunt.registerTask('default', [
    'newer:jshint',
    'test',
    'build'
  ]);
};
