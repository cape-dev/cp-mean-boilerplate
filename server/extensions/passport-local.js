var LocalStrategy = require('passport-local').Strategy;

module.exports = PassportLocal;

PassportLocal.$inject = ['passport', 'userModel'];
function PassportLocal(passport, User) {

  passport.use('local-signup', new LocalStrategy({
      // by default, local strategy uses username and password, we will override with email
      usernameField: 'email',
      passwordField: 'password',
      passReqToCallback: true // allows us to pass back the entire request to the callback
    },
    function (req, email, password, done) {

      // if the user is NOT logged in
      if (!req.user) {
        // find a user whose email is the same as the forms email
        // we are checking to see if the user trying to login already exists
        User.findOne({'email': email}, function (err, user) {

          // if there are any errors, return the error
          if (err) {
            return done(err);
          }

          // check to see if there is already a user with that email
          if (user) {
            return done(null, false, User.failedLogin.DUPLICATE_EMAIL);
          } else {
            // if there is no user with that email
            // create the user
            var newUser = new User({
              'email': email,
              'local.password': password
            });

            // save the user
            newUser.save(function (err) {
              if (err) {
                return done(err);
              }
              return done(null, newUser);
            });
          }

        });
        // if user is logged in add password for local login
      } else {
        User.findById(req.user.id, function(err, user) {
          if (err) return done(err);

          if (user) {
            user.local.password = password;

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

  passport.use('local-signin', new LocalStrategy({
      // by default, local strategy uses username and password, we will override with email
      usernameField: 'email',
      passwordField: 'password',
      passReqToCallback: true
    },
    function (req, email, password, done) { // callback with email and password from our form
      if (!req.user) {
        // attempt to authenticate user
        User.getAuthenticated(email, password, function (err, user, reason) {
          if (err) return done(err);

          // login was successful if we have a user
          if (user) {
            // handle login success
            return done(null, user);
          }

          // otherwise send back the reason why it failed
          return done(null, false, reason)
        });
      } else {
        return done(null, false, User.failedLogin.ALREADY_LOGGED_IN)
      }

    }));
}
