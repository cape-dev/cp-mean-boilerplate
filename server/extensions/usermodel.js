var bcrypt = require('bcrypt');
var SALT_WORK_FACTOR;
var MAX_LOGIN_ATTEMPTS;
var LOCK_TIME;

module.exports = UserModel;

UserModel.$inject = ['config', 'mongoose'];
function UserModel(config, mongoose) {
  SALT_WORK_FACTOR = config.userModel.salt_work_factor;
  MAX_LOGIN_ATTEMPTS = config.userModel.max_login_attempts;
  LOCK_TIME = config.userModel.lock_time_10_min;

  var Schema = mongoose.Schema;

  var UserSchema = new Schema({

      email: {type: String, required: true, index: {unique: true}},
      name: String,
      surname: String,

      local: {
        password: String
      },
      facebook: {
        id: {type: String, index: {unique: false}},
        token: String,
        email: String,
        name: String,
        surname: String
      },
      loginAttempts: {type: Number, required: true, default: 0},
      lockUntil: {type: Number}
    },
    {collection: 'user'});

  UserSchema.virtual('isLocked').get(function () {
    // check for a future lockUntil timestamp
    return !!(this.lockUntil && this.lockUntil > Date.now());
  });

  UserSchema.pre('save', function (next) {
    var user = this;
    // only hash the password if it has been modified (or is new)
    if (!user.isModified('local.password')) return next();

    // generate a salt
    bcrypt.genSalt(SALT_WORK_FACTOR, function (err, salt) {
      if (err) return next(err);

      // hash the password using our new salt
      bcrypt.hash(user.local.password, salt, function (err, hash) {
        if (err) return next(err);

        // set the hashed password back on our user document
        user.local.password = hash;
        return next();
      });
    });
  });

  UserSchema.methods.comparePassword = function (candidatePassword, cb) {
    bcrypt.compare(candidatePassword, this.local.password, function (err, isMatch) {
      if (err) return cb(err);
      cb(null, isMatch);
    });
  };

  UserSchema.methods.incLoginAttempts = function (cb) {
    // if we have a previous lock that has expired, restart at 1
    if (this.lockUntil && this.lockUntil < Date.now()) {
      return this.update({
        $set: {loginAttempts: 1},
        $unset: {lockUntil: 1}
      }, cb);
    }
    // otherwise we're incrementing
    var updates = {$inc: {loginAttempts: 1}};
    // lock the account if we've reached max attempts and it's not locked already
    if (this.loginAttempts + 1 >= MAX_LOGIN_ATTEMPTS && !this.isLocked) {
      updates.$set = {lockUntil: Date.now() + LOCK_TIME};
    }
    return this.update(updates, cb);
  };

// expose enum on the model, and provide an internal convenience reference 
  var reasons = UserSchema.statics.failedLogin = {
    NOT_FOUND: 'NOT_FOUND',
    PASSWORD_INCORRECT: 'PASSWORD_INCORRECT',
    MAX_ATTEMPTS: 'MAX_ATTEMPTS',
    DUPLICATE_EMAIL: 'DUPLICATE_EMAIL',
    ALREADY_LOGGED_IN: 'ALREADY_LOGGED_IN'
  };

  UserSchema.statics.getAuthenticated = function (email, password, cb) {
    this.findOne({'email': email}, function (err, user) {
      if (err) return cb(err);

      // make sure the user exists
      if (!user) {
        return cb(null, false, reasons.NOT_FOUND);
      }

      // check if the account is currently locked
      if (user.isLocked) {
        // just increment login attempts if account is already locked
        return user.incLoginAttempts(function (err) {
          if (err) return cb(err);
          return cb(null, false, reasons.MAX_ATTEMPTS);
        });
      }

      // test for a matching password
      user.comparePassword(password, function (err, isMatch) {
        if (err) return cb(err);

        // check if the password was a match
        if (isMatch) {
          // if there's no lock or failed attempts and the password does not
          // need to be re-hashed, just return the user
          if (!user.loginAttempts && !user.lockUntil && bcrypt.getRounds(user.local.password) === SALT_WORK_FACTOR) {
            return cb(null, user);
          }
          // reset attempts and lock info
          var updates = {
            $set: {loginAttempts: 0},
            $unset: {lockUntil: 1}
          };

          /* TODO ASYNC PROBLEM
           // check if re-hashing the password is necessary and if so, do it
           if (bcrypt.getRounds(user.password) !== SALT_WORK_FACTOR) {
           // generate a salt
           bcrypt.genSalt(SALT_WORK_FACTOR, function(err, salt) {
           if (err) return next(err);

           // hash the password using our new salt
           bcrypt.hash(password, salt, function (err, hash) {
           if (err) return next(err);

           // set the hashed password to our updates object
           updates.$set.password = hash;
           return user.update(updates, function(err) {
           if (err) return cb(err);
           return cb(null, user);
           });
           });
           });
           } else {
           return user.update(updates, function(err) {
           if (err) return cb(err);
           return cb(null, user);
           });
           }
           */

          // Sync solution, not prefered!
          // check if re-hashing the password is necessary and if so, do it
          if (bcrypt.getRounds(user.local.password) !== SALT_WORK_FACTOR) {
            // hash the password using our new salt
            // set the hashed password to our updates object
            updates.$set['local.password'] = bcrypt.hashSync(password, SALT_WORK_FACTOR);
          }

          return user.update(updates, function (err) {
            if (err) return cb(err);
            return cb(null, user);
          });

        }

        // password is incorrect, so increment login attempts before responding
        user.incLoginAttempts(function (err) {
          if (err) return cb(err);
          return cb(null, false, reasons.PASSWORD_INCORRECT);
        });
      });
    });
  };

  return mongoose.model('User', UserSchema);
}
