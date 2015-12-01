'use strict';

var server = require('./server');
var serverconf;
try {
  serverconf = require(__dirname + '/config.json');
} catch (e1) {
  try {
    serverconf = require(__dirname + '/server/config.json');
  } catch (e2) {
    console.error('Config not found');
    console.error('Exiting...');
    process.exit(1);
  }
}

serverconf.dist = {
  'root': process.argv[2] || './'
};

server(console.log, serverconf);
