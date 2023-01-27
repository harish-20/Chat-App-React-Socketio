const socket = require('socket.io')
const { addUser, onDisconnect } = require('./entity')

const connectSocket = (server) => {
  const io = socket(server, { cors: { origin: 'http://localhost:3000' } })

  // socket fuctions
  io.on('connect', (socket, cb) => {
    socket.on('join', ({ name, room }, callback) => {
      console.log('User joined', name)
      const { error, users } = addUser({ id: socket.id, name, room })
      if (error) {
        callback(error)
        return
      }
      socket.to(room).emit('messagein', { text: 'user connected ' + name })
      socket.emit('messagein', { text: 'user connected ' + name })
      socket.join(room)

      socket.to(room).emit('setactiveusers', { activeUsers: users })
      socket.emit('setactiveusers', { activeUsers: users })
    })

    socket.on('sendmessage', ({ name, room, message }, cb) => {
      socket.to(room).emit('messagein', { user: name, text: message })
      cb()
    })

    socket.on('disconnect', (obj) => {
      const disconnectInfo = onDisconnect(socket.id)

      if (!disconnectInfo?.disconnectedUser) {
        return
      }

      const { disconnectedUser, users } = disconnectInfo
      socket
        .to(disconnectedUser.room)
        .emit('setactiveusers', { activeUsers: users })

      socket.to(disconnectedUser.room).emit('messagein', {
        text: disconnectedUser.name + ' has disconnected',
      })
      console.log('socket is disconnected', disconnectedUser, users)
    })
  })
}

module.exports = connectSocket
