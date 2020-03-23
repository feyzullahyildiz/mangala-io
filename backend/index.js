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
// new Game('111', '123', '1121', () => {})
io.on('connect', (socket) => {
  socket.on('join', (roomName) => {
    console.log('JOIN', roomName)

    socket.mangalaRoomName = roomName;
    socket.join(roomName);
    const game = attachPlayerToTheGame(roomName, socket.id);
    console.log('EMITTING TO ROOM')
    io.in(roomName).emit('room', game.getState());
    // roomsChanged(roomName);

  });
  socket.on('leave', () => {
    console.log('socket leaved')
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
    console.log('disconnect', socket.id);
    console.log('socket leaved the room')
  });
  socket.on('play', (wellNumber) => {
    if (!socket.mangalaRoomName) {
      console.log('socket.mangalaRoomName not found')
      return;
    }
    
    console.log(wellNumber, socket.id)
    const game = games.get(socket.mangalaRoomName)
    try {
      const res = game.play(socket.id, wellNumber)
      io.in(socket.mangalaRoomName).emit('room', game.getState())
    } catch (error) {
      console.log('HOOPLA')
      // console.log('error', error)
    }
  });
  socket.on('rooms', () => {
    socket.emit('rooms', [...games])
  })
  // socket.on('create_room', (roomName) => {
  //   const room = rooms.get(roomName);
  //   if(room === undefined) {
  //     getRoom(roomName)
  //   }
  // })

})