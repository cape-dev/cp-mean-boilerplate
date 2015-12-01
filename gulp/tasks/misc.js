'use strict';

var config     = require('../config');
var changed    = require('gulp-changed');
var gulp       = require('gulp');
var gulpif     = require('gulp-if');
var imagemin   = require('gulp-imagemin');
var livereload = require('gulp-livereload');

gulp.task('misc', function() {

  var dest = config.misc.dest;

  return gulp.src(config.misc.src)
    .pipe(changed(dest)) // Ignore unchanged files
    .pipe(gulpif(global.isProd, imagemin()))    // Optimize
    .pipe(gulp.dest(dest))
    .pipe(gulpif(!global.isProd, livereload()));

});
