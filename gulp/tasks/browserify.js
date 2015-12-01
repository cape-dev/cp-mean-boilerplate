'use strict';
var config = require('../config');
var gulp = require('gulp');
var gulpif = require('gulp-if');
var gutil = require('gulp-util');
var source = require('vinyl-source-stream');
var sourcemaps = require('gulp-sourcemaps');
var buffer = require('vinyl-buffer');
var streamify = require('gulp-streamify');
var watchify = require('watchify');
var browserify = require('browserify');
var uglify = require('gulp-uglify');
var handleErrors = require('../util/handleErrors');
var livereload = require('gulp-livereload');
var ngAnnotate = require('browserify-ngannotate');
var partialify = require('partialify');
var babelify = require('babelify');

var customOpts = {
  entries: config.browserify.entries,
  debug: true,
  cache: {},
  packageCache: {},
  fullPaths: true
};

function buildScript(file) {
  var bundler = browserify(customOpts);
  if (!global.isProd) {
    bundler = watchify(bundler);
    bundler.on('update', rebundle);
  }
  bundler.transform(babelify.configure({
    extensions: ['.es6']
  }));
  bundler.transform(ngAnnotate);
  bundler.transform(partialify);
  bundler.transform('brfs');

  function rebundle() {
    var stream = bundler.bundle();
    var sourcemapsRequired = global.isProd && config.browserify.sourcemap;
    gutil.log('Rebundle...');
    return stream.on('error', handleErrors)
      .pipe(source(file))
      .pipe(gulpif(sourcemapsRequired, buffer()))
      .pipe(gulpif(sourcemapsRequired, sourcemaps.init({loadMaps: true})))
      .pipe(gulpif(global.isProd, streamify(uglify({
        compress: {drop_console: false},
        beautify : false,
        mangle   : true
      }))))
      .pipe(gulpif(sourcemapsRequired, sourcemaps.write()))
      .pipe(gulp.dest(config.scripts.dest))
      .pipe(gulpif(!global.isProd, livereload()));
  }

  return rebundle();
}

gulp.task('browserify', function() {
  return buildScript('main.js');
});
