const http = require('http')
const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const middleware = require('./utils/middleware')
const config = require('./utils/config')
const mongoose = require('mongoose')

const coolingUnitsRouter = require('./controllers/coolingUnits')


//Set up middleware
app.use(bodyParser.json())
app.use(middleware.logger())

//Set up routers
app.use('/api/coolingunit', coolingUnitsRouter)

//If no routes match, send error message
app.use(middleware.error())


mongoose
    .set('useFindAndModiyf', false)
    .connect(config.mongoUrl, { useNewUrlParser: true })
    .then(x => console.log('Connected to database', x))
    .catch(err => console.log(err))

const server = http.createServer(app)

server.listen(config.port, () => {
    console.log(`Server running on port ${config.port}`)
})

server.on('close', () => mongoose.connection.close())


module.exports = {
    app,
    server
}