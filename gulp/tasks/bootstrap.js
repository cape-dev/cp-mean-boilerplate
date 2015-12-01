'use strict';

var gulp =    require('gulp');
var config =  require('../config');

gulp.task('bootstrap', function() {
  return gulp.src(config.bootstrap.src)
    .pipe(gulp.dest(config.bootstrap.dest));
});
