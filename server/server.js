'use strict';

const bweb = require('bweb');
const fs = require('bfile');
const WSProxy = require('./wsproxy');

const proxy = new WSProxy({
  ports: [8333, 18333, 18444, 28333, 28901],
});

const server = bweb.server({
  port: Number(process.argv[2]) || 8080,
  sockets: false,
});

server.use(server.router());

proxy.on('error', err => {
  console.error(err.stack);
});

server.on('error', err => {
  console.error(err.stack);
});

proxy.attach(server.http);
server.on('listening', ({ port }) =>
  console.log('Server listening on port', port)
);
server.open();
