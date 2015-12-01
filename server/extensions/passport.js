module.exports = Passport;

Passport.$inject = ['passport'];
function Passport(passport) {
  // required for persistent login sessions
  // passport needs ability to serialize and unserialize users out of session

  // used to serialize the user for the session
  // save required information in the backend directly in the session
  passport.serializeUser(function(user, done) {
    var sessionUser = {
      id: user._id,
      email: user.email
    };
    done(null, sessionUser)
  });

  // used to deserialize the user
  // we do not have to deserialize the session to the whole user
  // since we do not need the whole information in the backend
  passport.deserializeUser(function(sessionUser, done) {
    done(null, sessionUser);
  });
}
