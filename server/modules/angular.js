'use strict';

module.exports = Angular;

Angular.$inject = ['server', 'config'];
function Angular(server, config) {

  // Serve index.html for all routes to leave routing up to Angular
  server.get('/*', function(req, res) {
    res.sendFile('index.html', {root: config.dist.root});
  });

}
