'use strict';

var express = require('express');
var mongoose = require('mongoose');

module.exports = Facebook;

Facebook.$inject = ['server', 'passport', 'userModel'];
function Facebook(server, passport, User) {

  // send to facebook to do the authentication
  server.get('/auth/facebook', passport.authenticate('facebook', {scope : ['email']}));

  // handle the callback after facebook has authenticated the user
  server.get('/auth/facebook/callback', function(req, res, next) {
    passport.authenticate('facebook', function(err, user, reason) {
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
          return res.sendStatus(500);
          break;
        case reasons.DUPLICATE_EMAIL:
          return res.sendStatus(402);
          break;
        default:
          return res.sendStatus(500)
      }

    })(req, res, next);
  });

}
