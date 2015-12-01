'use strict';

var http = require('http');
var express = require('express');
var morgan = require('morgan');
var bodyParser = require('body-parser');
var path = require('path');
var tiny = require('tiny-di');
var fs = require('q-io/fs');
var mongoose = require('mongoose');
var session = require('express-session');
var passport = require('passport');
var MongoStore = require('connect-mongo')(session);

var sessionSecret = require('./sessionsecret');

module.exports = Daemon;

function Daemon(logFunc, config) {
  var sessionStore = new MongoStore({ url: config.databases.user});

  // Passport does not directly manage your session, it only uses the session.
  // So you configure session attributes (e.g. life of your session) via express
  var sessionOpts = {
    saveUninitialized: true, // saved new sessions
    resave: false, // do not automatically write to the session store
    store: sessionStore,
    secret: sessionSecret,
    cookie : { httpOnly: true, maxAge: config.session.maxAge } // configure when sessions expires
  };

  // Prepare dependency injection
  var $injector = new tiny();
  $injector.bind('$injector').to($injector);
  $injector.setResolver(dependencyResolver);

  var server = express();

  // log all requests to the console
  server.use(morgan('dev'));
  server.use(bodyParser.json());
  server.use(bodyParser.urlencoded({
    extended: true
  }));
  server.use(session(sessionOpts));
  server.use(passport.initialize());
  server.use(passport.session());

/* maybe useful for later tasks
  // Setup APIv1 router
  var apiv1router = express.Router({'caseSensitive': true});
  apiv1router.use(bodyParser.json());
  apiv1router.use(bodyParser.urlencoded({
    extended: true
  }));
  server.use('/api/v1', apiv1router);
*/

  // link injected variables
  $injector
    .bind('config').to(config)
    .bind('server').to(server)
    .bind('filesystem').to(fs)
    .bind('logFunc').to(logFunc)
    .bind('passport').to(passport)
    .bind('mongoose').to(mongoose);

  // Load all modules, specified in gulp/config.js (server.modules)
  loadExtensions();
  loadModules();

  runServer();

  function runServer() {
    var s = http.createServer(server);
    s.on('error', function(err) {
      if (err.code === 'EADDRINUSE') {
        logFunc('Development server is already started at port ' + config.server.port);
      } else {
        throw err;
      }
    });

    s.listen(config.server.port);
  }

  function loadModules() {
    config.server.modules.forEach(function(module) {
      var file = module.file || module.module;
      $injector.bind(module.module).load(file);
    });
  }

  function loadExtensions() {
    config.server.extensions.forEach(function(extension) {
      var file = extension.file || extension.extension;
      $injector.bind(extension.extension).load(file);
    });
  }

  function dependencyResolver(moduleId) {
    var modulePath = path.resolve(path.join(config.dist.root, config.server.path, moduleId));
    try {
      return require(modulePath);
    } catch (e) {
      try {
        return require(moduleId);
      } catch (e2) {
        console.log('Extension ' + moduleId + ' failed to load');
        console.log(modulePath);
        console.log('errors', e, e2);
        console.log(new Error().stack);
        return false;
      }
    }
  }
}
