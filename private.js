// Include Nodejs' net module.
const net = require('net')
// The port number and hostname of the server.
const port = 8080
const host = 'localhost'

// Create a new TCP client.
const client = new net.Socket()

let state = {}
let peers = []
let you = ''

const random = arr => arr[Math.floor(Math.random() * arr.length)]

const sendMessage = callback => setTimeout(callback, random([3, 5, 10, 20]) * 1000)

// Send a connection request to the server.
client.connect(({ port, host }), _ => {
  // If there is no error, the server has accepted the request and created a new
  // socket dedicated to us.
  console.log('TCP connection established with the server.')
})

// The client can also receive data from the server by reading from its socket.
client.on('data', chunk => {
  state = JSON.parse(('{' + chunk.toString().split('}{').pop()).replace('{{', '{'))
  const { status } = state

  // If any client connected or leave from network.
  // One package will arrive from server.
  if (status === 'handshake') {
    peers = state.peers
    you = state.you
    peers = peers.filter(peer => peer !== you)
    console.log(peers, you)
  } else if (status === 'message') { // If any peers send message from us, server send package.
    console.log(state)
  }

  if (status !== 'message') {
    if (peers.length >= 2) {
      sendMessage(_ => {
        const id = random(peers)
        client.write(JSON.stringify({ status: 'message', type: 'private', id, message: `this is secret message for you ${id}` }))
      })
    }
  }
  // Request an end to the connection after the data has been received.
  // client.end()
})

client.on('end', _ => {
  console.log('Requested an end to the TCP connection')
})
