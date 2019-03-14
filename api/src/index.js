const http = require('http')
const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const middleware = require('./utils/middleware')
const config = require('./utils/config')
const mongoose = require('mongoose')

const coolingUnitsRouter = require('./controllers/coolingUnits')
const devicesRouter = require('./controllers/devices')
const fansRouter = require('./controllers/fans')
const fanServersRouter = require('./controllers/fanServers')
const temperatureSensorsRouter = require('./controllers/temperatureSensors')
const temperatureServersRouter = require('./controllers/temperatureServers')


//Set up middleware
app.use(bodyParser.json())
app.use(middleware.logger())

//Set up routers
app.use('/coolingunit', coolingUnitsRouter)
app.use('/device', devicesRouter)
app.use('/fan', fansRouter)
app.use('/fanserver', fanServersRouter)
app.use('/temperature', temperatureSensorsRouter)
app.use('/temperatureserver', temperatureServersRouter)

//If no routes match, send error message
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

// Create and set up server
const server = http.createServer(app)

server.listen(config.port, () => {
    console.log(`Server running on port ${config.port}`)
})

server.on('close', () => mongoose.connection.close())


module.exports = {
    app,
    server
}