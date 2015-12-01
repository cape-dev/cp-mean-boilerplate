'use strict';

var babel = require('babelify');
var cover = require('browserify-istanbul');

var coverOptions = {
  ignore: [
    '**/*.spec.js',
    '**/*.spec.mock.js',
    '**/*.spec.es6',
    '**/*.spec.mock.es6',
    '**/*.html'
  ],
  defaultIgnore: true
};

var karma_browsers = ['Chrome'];
if(process.env.BUILDSERVER === 'headless')
  karma_browsers = ['PhantomJS'];

module.exports = function(config) {

  config.set({

    basePath: './',
    frameworks: ['browserify', 'source-map-support', 'jasmine', 'phantomjs-shim'],
    browserNoActivityTimeout: 60000,

    browsers: karma_browsers,
    reporters: ['progress', 'junit', 'coverage'],

    autoWatch: true,
    autoWatchBatchDelay: 500,

    plugins: [
      'karma-jasmine',
      'karma-browserify',
      'karma-chrome-launcher',
      'karma-phantomjs-launcher',
      'karma-firefox-launcher',
      'karma-safari-launcher',
      'karma-ie-launcher',
      'karma-phantomjs-shim',
      'karma-junit-reporter',
      'karma-coverage',
      'karma-ng-html2js-preprocessor',
      'karma-source-map-support'
    ],

    files: [
      // app-specific code
      'app/js/main.js',

      // 3rd-party resources
      'node_modules/angular-mocks/angular-mocks.js',

      // test files
      'app/**/*.spec.js',
      'app/**/*.spec.es6',

      // angular templates
      'app/js/**/*.html'
    ],

    preprocessors: {
      'app/js/**/*.js': ['browserify'],
      'app/js/**/*.es6': ['browserify'],
      'app/js/**/*.html': ['ng-html2js']
    },

    browserify: {
      debug: true,
      config: {
        watchify: {
          poll: true
        }
      },
      bundleDelay: 2500,
      extensions: [".js",".es6"],
      configure: function(bundle) {
        bundle.on('prebundle', function() {
          bundle
            .transform(babel.configure({ extensions: ['.es6'], auxiliaryComment: 'istanbul ignore next' }))
            .transform(cover(coverOptions))
            .plugin('proxyquire-universal');
        });
      }
    },

    ngHtml2JsPreprocessor: {
      moduleName: 'karma.templates'
    },

    junitReporter: {
      outputFile: 'logs/unit.test.xml',
      suite: ''
    },

    coverageReporter: {
      type: 'cobertura',
      dir: 'logs/coverage',
      subdir: '.',
      file: 'cobertura-coverage.xml'
    }
  });

};
