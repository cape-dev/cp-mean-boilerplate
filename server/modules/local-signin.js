'use strict';

var express = require('express');
var mongoose = require('mongoose');

module.exports = LocalSignIn;

LocalSignIn.$inject = ['server', 'passport', 'userModel'];
function LocalSignIn(server, passport, User) {
  server.get('/signin', function(req, res, next) {
    passport.authenticate('local-signin', function(err, user, reason) {
      if (err) {
        return res.sendStatus(500);
      }

      // login was successful if we have a user
      if (user) {
        // handle login success
        return req.login(user, function(err) {
          if (err) return res.sendStatus(500);

          return res.send(user)
        });
      }

      // otherwise we can determine why we failed
      var reasons = User.failedLogin;

      switch (reason) {
        case reasons.NOT_FOUND:
          return res.sendStatus(401);
          break;
        case reasons.PASSWORD_INCORRECT:
          // note: these cases are usually treated the same - don't tell
          // the user *why* the login failed, only that it did
          return res.sendStatus(402);
          break;
        case reasons.MAX_ATTEMPTS:
          // send email or otherwise notify user that account is
          // temporarily locked
          return res.sendStatus(403);
          break;
        case reasons.ALREADY_LOGGED_IN:
          return res.sendStatus(404);
          break;
        default:
          return res.sendStatus(500)
      }

    })(req, res, next);
  });

}
