'use strict';

var config         = require('../config');
var gulp           = require('gulp');
var gulpif         = require('gulp-if');
var preprocess     = require('gulp-preprocess');
var rename         = require('gulp-rename');

gulp.task('preprocess', function() {
  return gulp.src(config.preprocess.src)
    .pipe(gulpif(!global.isProd, preprocess({
      context: {
        isProd: false
      }
    })))
    .pipe(gulpif(global.isProd, preprocess({
      context: {
        isProd: true
      }
    })))
    .pipe(rename({
      basename: config.preprocess.rename
    }))
    .pipe(gulp.dest(config.preprocess.dest));
});
