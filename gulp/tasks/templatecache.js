'use strict';

var gulp = require('gulp');
var templateCache = require('gulp-angular-templatecache');
var config = require('../config');

gulp.task('templateCache', function() {
  gulp.src(config.templateCache.src)
    .pipe(templateCache('templatecache.js', {
      standalone: true,
      module: 'app.templateCache'
    }))
    .pipe(gulp.dest(config.templateCache.dest));
});
