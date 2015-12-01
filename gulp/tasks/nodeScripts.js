'use strict';

var config         = require('../config');
var gulp        = require('gulp');
var preprocess = require('gulp-preprocess');

gulp.task('nodeScripts', function() {

  // copy server and start script to the build folder
  gulp.src(['server/server.js'])
    .pipe(gulp.dest(config.dist.root));

  gulp.src(['server/start.js'])
    .pipe(gulp.dest(config.dist.root));

  // copy all node scripts to the build folder
  return gulp.src(config.nodeScripts.src)
    .pipe(gulp.dest(config.nodeScripts.dest));

});
