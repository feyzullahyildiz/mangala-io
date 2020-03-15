const Game = require('./game')
const server = require('http').createServer();

const io = require('socket.io')(server, {
  path: '/',
  serveClient: false,
  // below are engine.IO options
  pingInterval: 10000,
  pingTimeout: 5000,
  cookie: false,
  origins: '*:*'
});

server.listen(80);
new Game('111', '123', '1121', () => {})
io.on('connect', (socket) => {
    console.log('CONNECTED');
    socket.join('room1')

})