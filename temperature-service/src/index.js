const http = require('http')
const app = require('express')()
const bodyParser = require('body-parser')
const middleware = require('./utils/middleware')
const config = require('./utils/config')
const mongoose = require('mongoose')
const { startUpdater,
    setUpdateInterval
} = require('./temperatureUpdater')

const validTemperatureServerRouter = require('./validTemperatureServerRouter')


// Set up middleware
app.use(bodyParser.json())
app.use(middleware.logger())

// Set up controllers
app.use('/validserver', validTemperatureServerRouter)
app.use(middleware.error())

// Set up database connection
mongoose
    .set('useFindAndModify', false)
    .set('useCreateIndex', true)
    .set('useNewUrlParser', true)
    .connect(config.mongoUrl)
    .then(console.log(`Mongoose version ${mongoose.version}`))
    .then(console.log(`Mongoose connection status ${mongoose.connection.readyState}`))
    .catch(err => console.log(err))

// Set up temperature updater to update temperatures every 20 seconds
setUpdateInterval(20)
startUpdater()

const server = http.createServer(app)

server.listen(config.port, () => {
    console.log(`Server running on port ${config.port}`)
})

module.exports = {
    app,
    server
}