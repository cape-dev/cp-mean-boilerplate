'use strict';

var gulp = require('gulp');
var karma = require('gulp-karma');
var gutil = require('gulp-util');
var config = require('../config');

gulp.task('unit', function() {

  var browsers;

  switch(gutil.env.type) {
    case 'phantom':
      browsers = ['PhantomJS'];
      break;
    case 'firefox':
      browsers = ['Firefox'];
      break;
    case 'chrome':
      browsers = ['Chrome'];
      break;
    case 'ie':
      browsers = ['IE'];
      break;
    case 'safari':
      browsers = ['Safari'];
      break;
    case 'all':
      browsers = ['IE', 'Chrome', 'Firefox', 'Safari'];
      break;
    default:
      browsers = ['Chrome']
  }

  // Nonsensical source to fall back to files listed in karma.conf.js,
  // see https://github.com/lazd/gulp-karma/issues/9
  return gulp.src('./thisdoesntexist')
    .pipe(karma({
      configFile: config.test.karma.file,
      browsers: browsers,
      hostname: config.test.karma.host,
      port: config.test.karma.port,
      action: 'run'
    })
  )
    .on('error', function(err) {
      // Make sure failed tests cause gulp to exit non-zero
      console.log(err.message);
      console.log(err.showStack);
      throw err;
    });

});
