const socket = require('socket.io')
const addUser = require('./entity')

const connectSocket = (server) => {
  const io = socket(server, { cors: { origin: 'http://localhost:3000' } })

  // socket fuctions
  io.on('connect', (socket, cb) => {
    console.log('socket is connected')

    socket.on('join', ({ name, room }, callback) => {
      console.log('User joined')
      const { error } = addUser({ id: socket.id, name, room })
      if (error) {
        callback(error)
        return
      }
      socket.to(room).emit('messagein', { text: 'user connected ' + name })
      socket.emit('messagein', { text: 'user connected ' + name })
      socket.join(room)
    })

    socket.on('sendmessage', ({ name, room, message }, cb) => {
      socket.broadcast.to(room).emit('messagein', { user: name, text: message })
      cb()
    })

    socket.on('disconnect', () => {
      console.log('socket is disconnected')
    })
  })
}

module.exports = connectSocket
