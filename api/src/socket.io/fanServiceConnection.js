const server = require('http').createServer()
const io = require('socket.io')
const socket = io(server)

socket.on('connection', client => {
    console.log('Client connected!', new Date().toLocaleTimeString())
    client.on('disconnect', () => console.log('Client disconnected!', new Date().toLocaleTimeString()))
    setTimeout(() => {
        console.log('Sending message to clients')
        socket.sockets.emit('test', 'Laitas viestiä vähän clienteille')
    }, 2000)

    setTimeout(() => {
        console.log('Sending message to clients')
        socket.sockets.emit('event', { pillu: 'vittu' }, { paska: 'rippe' })
    }, 4000)
})

server.listen(8080, () => console.log('Server starting...'))