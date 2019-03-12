const http = require('http')
const app = require('express')()
const bodyParser = require('body-parser')
const middleware = require('./utils/middleware')
const config = require('./utils/config')

const validTemperatureServerRouter = require('./validTemperatureServerRouter')


// Set up middleware
app.use(bodyParser.json())
app.use(middleware.logger())

// Set up controllers
app.use('/validserver', validTemperatureServerRouter)
app.use(middleware.error())


const server = http.createServer(app)

server.listen(config.port, () => {
    console.log(`Server running on port ${config.port}`)
})

module.exports = {
    app,
    server
}