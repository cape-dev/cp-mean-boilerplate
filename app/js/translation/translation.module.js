'use strict';

require('angular-translate');
require('angular-sanitize');
require('angular-translate-loader-static-files');
require('angular-translate-storage-cookie');
require('angular-translate-storage-local');
require('angular-cookies');

var requires = [
  'pascalprecht.translate',
  'ngSanitize',
  'ngCookies'
];

module.exports = angular.module('app.translation', requires)
  .config(function($translateProvider) {
    $translateProvider
      .storageKey('WEB.LCID')
      .useLocalStorage()
      .useSanitizeValueStrategy('sanitize')
      .useMissingTranslationHandler('MissingTranslationHandlerFactory')
      .useStaticFilesLoader({
        prefix: 'dist/i18n/lang-',
        suffix: '.json'
      })
      .preferredLanguage('en');
  });

// controllers

// directives

// services
require('./missingtranslationhandler');

// routes
