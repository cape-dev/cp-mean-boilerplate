'use strict';

var path = require('path');
var express = require('express');
var FS = require('q-io/fs');
var q = require('q');
var jsonfile = require('jsonfile');
var _ = require('lodash');

module.exports = Translations;

Translations.$inject = ['server', 'config', 'logFunc'];
function Translations(server, config, logFunc) {

  server.put('/addTranslation', function(req, res) {
    var translationId = req.body.translationId;
    
    var mainDir = path.dirname(require.main.filename);
    var pathToFiles = path.resolve(mainDir, config.translations.path);
    FS.list(pathToFiles).then(function(dir) {
      return updateTranslationFiles(dir);
    })
      .then(function() {
        logFunc('[x] missing translation added: ' + translationId);
        res.sendStatus(200)
      })
      .catch(function(err) {
        logFunc(err);
        res.sendStatus(500);
      });

    function updateTranslationFiles(dir) {
      var deferred = q.defer();
      try {
        dir.forEach(function(fileName) {
          var filePath = path.join(pathToFiles, fileName);
          var file = jsonfile.readFileSync(filePath);
          _.set(file, translationId, '@' + translationId);
          jsonfile.writeFileSync(filePath, file, {spaces: 2});
        });
        deferred.resolve();
        return deferred.promise;
      }
      catch(error) {
        deferred.reject(error);
        return deferred.promise;
      }
    }

  });
}
