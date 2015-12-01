'use strict';

var gulp = require('gulp');
var runSequence = require('run-sequence');

gulp.task('transform', function(cb) {

  cb = cb || function() {};

  runSequence('templateCache', 'preprocess', 'browserify', cb);

});
