'use strict';

var config         = require('../config');
var gulp           = require('gulp');
var livereload     = require('gulp-livereload');

gulp.task('views', function() {

  // Put our index.html in the dist folder
  return gulp.src('app/index.html')
    .pipe(gulp.dest(config.dist.root))
    .pipe(livereload());

});
