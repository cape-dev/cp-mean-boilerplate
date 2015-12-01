var FacebookStrategy = require('passport-facebook').Strategy;

module.exports = FacebookAuth;

FacebookAuth.$inject = ['passport', 'config', 'userModel'];
function FacebookAuth(passport, config, User) {

  var clientID = config.facebookAuth.clientID;
  var clientSecret = config.facebookAuth.clientSecret;
  var callbackURLPathname = config.facebookAuth.callbackURLPathname;
  var callbackURLBase = config.facebookAuth.callbackURLBase;

  passport.use(new FacebookStrategy({
      clientID: clientID,
      clientSecret: clientSecret,
      callbackURL: 'http://' + callbackURLBase + callbackURLPathname,
      profileFields: ['id', 'email', 'name'],
      passReqToCallback: true
    },
    function (req, token, refreshToken, profile, done) {
      // if the user is NOT logged in
      if (!req.user) {
        // find a user whose fb id is the same with the one in the retrieved profile
        User.findOne({'facebook.id': profile.id}, function (err, user) {

          // if there are any errors, return the error
          if (err) {
            return done(err);
          }

          // check to see if there is already a user with that fb id
          if (user) {
            return done(null, user);
          } else {
            // if there is no user with that id
            // create the user and set email to the one retrieved from the profile
            // but only if the email is not taken yet
            User.findOne({email: profile.emails[0].value}, function(err, user) {
              if (err) return done(err);

              if (user) {
                return done(null, false, User.failedLogin.DUPLICATE_EMAIL);
              } else {

                var newUser = new User({
                  'email': profile.emails[0].value
                });

                newUser.facebook.id = profile.id;
                newUser.facebook.token = token;
                newUser.facebook.email = profile.emails[0].value;
                newUser.facebook.name = profile.name.givenName;
                newUser.facebook.surname = profile.name.familyName;
                newUser.name = profile.name.givenName;
                newUser.surname = profile.name.familyName;

                // save the user
                newUser.save(function (err) {
                  if (err) {
                    return done(err);
                  }
                  return done(null, newUser);
                });
              }
            });

          }

        });
        // if the user is logged in just link the user with the fb acc
      } else {
        User.findById(req.user.id, function(err, user) {
          if (err) return done(err);

          if (user) {
            user.facebook.id = profile.id;
            user.facebook.token = token;
            user.facebook.email = profile.emails[0].value;
            user.facebook.name = profile.name.givenName;
            user.facebook.surname = profile.name.familyName;

            if (!user.name) {
              user.name = profile.name.givenName;
            }
            if (!user.surname) {
              user.surname = profile.name.familyName;
            }

            user.save(function(err) {
              if (err) return done(err);

              return done(null, user);
            });
          } else {
            return done(null, false, User.failedLogin.NOT_FOUND);
          }
        });
      }

    }));

}
