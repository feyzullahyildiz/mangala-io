const Game = require('./game')
const express = require('express');
const app = express();
const server = require('http').Server(app);
const path = require('path')
const buildPath = path.resolve(__dirname, '..', 'frontend', 'build')
console.log('buildPath', buildPath)
app.use(express.static(buildPath));

const io = require('socket.io')(server, {
  path: '/socketApi',
  serveClient: false,
  // below are engine.IO options
  pingInterval: 10000,
  pingTimeout: 5000,
  cookie: false,
  origins: '*:*'
});
const games = new Map();
const attachPlayerToTheGame = (roomName, socketId) => {
  let theGame = games.get(roomName);
  if (!theGame) {
    game = new Game(roomName);
    games.set(roomName, game)
  }
  try {
    game.setPlayer(socketId);
  } catch (error) {
  }
  return game;
}
server.listen(8000);
io.on('connect', (socket) => {
  socket.on('join', (roomName) => {
    logger('JOIN', roomName)

    socket.mangalaRoomName = roomName;
    socket.join(roomName);
    const game = attachPlayerToTheGame(roomName, socket.id);
    logger('EMITTING TO ROOM')
    io.in(roomName).emit('room', game.getState());
    // roomsChanged(roomName);

  });
  socket.on('leave', () => {
    logger('socket leaved')
  })
  socket.on('disconnect', () => {
    if (socket.mangalaRoomName) {
      const game = games.get(socket.mangalaRoomName)
      if (game) {
        game.playerLeaved(socket.id);
        if(game.getState().state === 'empty') {
          games.delete(socket.mangalaRoomName);
        }
      }
    }
    logger('disconnect', socket.id);
    logger('socket leaved the room');
  });
  socket.on('play', (wellNumber) => {
    if (!socket.mangalaRoomName) {
      logger('socket.mangalaRoomName not found')
      return;
    }
    
    logger(wellNumber, socket.id)
    const game = games.get(socket.mangalaRoomName)
    try {
      const res = game.play(socket.id, wellNumber)
      io.in(socket.mangalaRoomName).emit('room', game.getState())
    } catch (error) {
    }
  });
  socket.on('rooms', () => {
    socket.emit('rooms', [...games])
  })

})

function logger() {

}