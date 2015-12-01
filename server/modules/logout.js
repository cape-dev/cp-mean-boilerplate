'use strict';

module.exports = Logout;

Logout.$inject = ['server'];

function Logout(server) {
  server.post('/logout', function(req, res) {
    if (req.user) {
      req.logout();
      res.sendStatus(200);
    } else {
      req.sendStatus(401);
    }
  });
}
