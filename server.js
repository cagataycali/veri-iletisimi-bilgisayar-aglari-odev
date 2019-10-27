const net = require('net')
const port = 8080
const uniqid = require('./uniq')

// Create a new TCP server.
const server = new net.Server()

// The server listens to a socket for a client to make a connection request.
server.listen(port, _ => {
  console.log(`Server listening for connection requests on socket localhost:${port}`)
})

let connections = []

// When a client requests a connection with the server, the server creates a new
// socket dedicated to that client.
server.on('connection', socket => {
  console.log('A new connection has been established.')
  socket.id = uniqid()

  // Now that a TCP connection has been established, the server can send data to
  // the client by writing to its socket.
  connections.push({ socket, id: socket.id })

  connections.map(({ socket }) => {
    socket.write(JSON.stringify({ peers: connections.map(conn => conn.id), you: socket.id, status: 'handshake' }))
  })

  // The server can also receive data from the client by reading from its socket.
  socket.on('data', chunk => {
    console.log(`Data received from client: ${chunk.toString()}`)
    // { status: 'message', type: 'private', id, message: `this is secret message for you ${id}` }
    const data = JSON.parse(('{' + chunk.toString().split('}{').pop()).replace('{{', '{'))
    const { status, type, id, message, sender } = data
    if (type === 'broadcast') {
      connections.map(({ socket: s, id }) => {
        if (sender !== id) {
          s.write(JSON.stringify(data))
        }
      })
    } else if (type === 'private') {
      // Message reciever.
      const s = connections.find(conn => conn.id === id)
      s.socket.write(JSON.stringify({ status, message, type }))
    }
    // console.log(socket.id, 'bunu yazdı', chunk.toString())
  })

  // When the client requests to end the TCP connection with the server, the server
  // ends the connection.
  socket.on('end', () => {
    console.log(socket.id)
    connections = connections.filter(conn => conn.id !== socket.id)
    connections.map(({ socket }) => {
      socket.write(JSON.stringify({ peers: connections.map(conn => conn.id), you: socket.id, status: 'handshake' }))
    })
    console.log('Closing connection with the client')
  })

  // Don't forget to catch error, for your own sake.
  socket.on('error', err => {
    console.log(`Error: ${err}`)
  })
})
