// import { Pool, Chain, WorkerPool } from 'bcoin';
import ProxySocket from './ProxySocket';

// (async function() {
// const workers = new WorkerPool({
//   enabled: true
// });
// const chain = new Chain({
//   pruned: true,
//   checkpoints: true,
//   workers,
//   memory: false,
//   location: '~/.bcoin/browser'
// });
// await chain.open();
// chain.on('connect', console.log);
// const pool = new Pool({
//   chain,
//   bip157: true,
//   // listen: false,
//   createSocket: (port, host) => {
//     const proto = global.location.protocol === 'https:' ? 'wss' : 'ws';
//     // const hostname = global.location.host;
//     const hostname = 'localhost';
//     return ProxySocket.connect(`${proto}://${hostname}:8080`, port, host);
//   },
// });
// pool.on('connection', socket => console.log('new connection!', socket));
// pool.on('error', error => console.error);
// await pool.open();
// await pool.connect();
// await pool.startSync();
// })()
