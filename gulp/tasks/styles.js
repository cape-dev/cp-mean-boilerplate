'use strict';

var config       = require('../config');
var gulp         = require('gulp');
var less         = require('gulp-less');
var gulpif       = require('gulp-if');
var handleErrors = require('../util/handleErrors');
var livereload  = require('gulp-livereload');
var autoprefixer = require('gulp-autoprefixer');
var sourcemaps = require('gulp-sourcemaps');

gulp.task('styles', function() {
  return gulp.src(config.styles.src)
    .pipe(sourcemaps.init())
    .pipe(less({
      compress: global.isProd ? true : false
    }))
    .pipe(autoprefixer(
      'ie >= 10',
      'ff >= 35',
      'Chrome >= 40',
      'ios_saf >= 7'
    ))
    .pipe(sourcemaps.write())
    .on('error', handleErrors)
    .pipe(gulp.dest(config.styles.dest))
    .pipe(gulpif(!global.isProd, livereload()));
});
