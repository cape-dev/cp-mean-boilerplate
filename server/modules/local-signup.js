'use strict';

var express = require('express');
var mongoose = require('mongoose');

module.exports = LocalSignUp;

LocalSignUp.$inject = ['server', 'passport', 'userModel'];
function LocalSignUp(server, passport, User) {
  server.post('/signup', function(req, res, next) {
    passport.authenticate('local-signup', function(err, user, reason) {
      if (err) {
        // internal error
        return res.sendStatus(500);
      }

      if (user) {
        // handle success
        return req.login(user, function(err) {
          if (err) return res.sendStatus(500);

          return res.sendStatus(200)
        });
      } else {
        // otherwise we can determine why we failed
        var reasons = User.failedLogin;

        switch (reason) {
          case reasons.NOT_FOUND:
            return res.sendStatus(500);
            break;
          case reasons.DUPLICATE_EMAIL:
            return res.sendStatus(402);
            break;
          default:
            return res.sendStatus(500)
        }
      }

    })(req, res, next);
  });
}

