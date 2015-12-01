'use strict';

var path = require('path');
var express = require('express');

module.exports = Static;

Static.$inject = ['server', 'config'];
function Static(server, config) {
  var distDir = path.join(config.dist.root, 'dist');
  server.use('/dist', express.static(distDir));
}
