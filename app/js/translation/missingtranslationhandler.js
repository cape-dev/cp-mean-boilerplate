'use strict';

var component = require('./translation.module');

component.factory('MissingTranslationHandlerFactory', MissingTranslationHandlerFactory);

var _ = require('lodash');

MissingTranslationHandlerFactory.$inject= ['$http'];
var missingCache = [];

function MissingTranslationHandlerFactory($http) {
  return postUnknownTranslationIdToServer;

  function postUnknownTranslationIdToServer(translationId) {
    if (_.indexOf(missingCache, translationId) === -1) {
      missingCache.push(translationId);
      $http.put('/addTranslation', {translationId: translationId});
    }
    return '@' + translationId;
  }
}



