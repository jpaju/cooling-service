const http = require('http')
const app = require('express')()
const bodyParser = require('body-parser')
const middleware = require('./utils/middleware')
const config = require('./utils/config')
const validFanServerRouter = require('./routers/validFanServerRouter')
const deleteFanRouter = require('./routers/deleteFanRouter')

const mongoose = require('mongoose')
const { handleChange } = require('./change_handlers/fanHandler')
const Fan = require('./models/fan')


// Set up middleware
app.use(bodyParser.json())
app.use(middleware.logger())

// Set up controllers
app.use('/validserver', validFanServerRouter)
app.use('/deletefan', deleteFanRouter)
app.use(middleware.error())

mongoose
    .set('useFindAndModify', false)
    .set('useCreateIndex', true)
    .set('useNewUrlParser', true)
    .connect(config.mongoUrl)
    .then(console.log(`Mongoose connection status ${mongoose.connection.readyState}`))
    .catch(err => console.log(err))


// Set up change listeners
Fan.watch().on('change', handleChange)

// Create and start server
const server = http.createServer(app)

server.listen(config.port, () => {
    console.log(`Server running on port ${config.port}`)
})

module.exports = {
    app,
    server
}