module.exports = Mongo;

Mongo.$inject = ['config', 'mongoose'];
// initial mongo setup
function Mongo(config, mongoose) {
  // connect to userDatabase
  mongoose.connect(config.databases.user, function (err) {
    if (err) log(err);
  });
}