'use strict';

var config     = require('../config');
var gulp       = require('gulp');
var gulpif     = require('gulp-if');
var tap     = require('gulp-tap');
var livereload = require('gulp-livereload');
var jsonfile = require('jsonfile');
var q = require('q');
var mongoose = require('mongoose');
var _ = require('lodash');

jsonfile.spaces = 2;

gulp.task('translations', function() {

  /*
  get mongodb X
  get trans files X
  trans files mit db abgleichen -> über merge gelöst
  neue keys einfügen und vorhandene keys updaten
  mongodb stand ziehen und die trans files ersetzen
  reload

  -> watch auf die trans files -> start translations
  */

  var src = config.translations.src;

  /*
  try {
    mongoose.connect('mongodb://localhost:27017/translations');
  } catch (error) {
    console.log(error);
  }
  */

  return gulp.src(src)
      /*
    .pipe(tap(function(file) {
      var translation = JSON.parse(file.contents);

      var language = file.path.substring(file.path.length - 7, file.path.length - 5);
      var schema = new mongoose.Schema({
        key: String
      }, {collection: language});

      var model = mongoose.model(language, schema);
      getSpecificTranslation(model)
        .then(function(documents) {
          var merged = {};
          documents.forEach(function(doc) {
            _.merge(merged, doc);
          });
          //
          merged = merged._doc ? merged._doc : merged;
          delete merged._id;
          // merged json is now comparable to the local translation file

        })
        .catch(console.error);

      jsonfile.writeFileSync(file.path, translation);

      file.contents = new Buffer(JSON.stringify(translation));
      return file;
    }))
    */
    .pipe(gulp.dest(config.translations.dest))
    /*
    .pipe(tap(function() {
        mongoose.disconnect();
    }))
    */
    .pipe(gulpif(!global.isProd, livereload()));

  /*
  function getSpecificTranslation(model) {
    var deferred = q.defer();

    model.find(function(err, documents) {
      if (err) {
        deferred.reject(err);
      } else {
        deferred.resolve(documents);
      }
    });

    return deferred.promise;

  }
  */
});
