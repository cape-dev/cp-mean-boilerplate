'use strict';

var config = require('../config');
var gulp   = require('gulp');
var eslint = require('gulp-eslint');
var fs = require('fs');

gulp.task('lint', function () {
  return gulp.src(config.lint.src)
    .pipe(eslint())
    .pipe(eslint.format('junit', function(data) {
      fs.writeFile(config.lint.logFile, data, function (err) {
        if (err) throw err;
      });
    }))
    .pipe(eslint.format());
});
