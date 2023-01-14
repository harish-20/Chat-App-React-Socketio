// module imports
const express = require('express')
const http = require('http')
const cors = require('cors')

// function imports
const connectSocket = require('./socket')

// app creation
const app = express()
const server = http.createServer(app)

// cors
app.use(
  cors({
    origin: 'http://localhost:3000',
  }),
)

// connect socket
connectSocket(server)

// method definition
app.get('/', (req, res) => {
  res.send('server is on')
})

// running server
server.listen(8080, () => {
  console.log('api server starts at port 8080')
})
