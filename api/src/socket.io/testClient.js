const io = require('socket.io-client')
const socket = io('http://localhost:8080')

socket.on('connect', () => {
    console.log('Connected to server!')
    // setTimeout(() => {
    //     console.log('Trying to disconnect')
    //     socket.disconnect()
    // }, 5000)
})

socket.on('event', (data1, data2) => {
    console.log('Received data:', data1.pillu, data2.paska)
})

socket.on('disconnect', () => {
    console.log('Disconnected from server')
})

socket.on('test', message => console.log(message))

socket.on('connect_timeout', () => console.log('Timeout'))
socket.on('connect_error', err => console.log('Error:', err))

// socket.connect()