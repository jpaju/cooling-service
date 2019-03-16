const temperatureServersRouter = require('express').Router()
const TemperatureServer = require('../models/temperatureServer')
const TemperatureSensor = require('../models/temperatureSensor')
const { temperatureServerValidator } = require('../utils/validator')
const { URLFormatter } = require('../utils/format')


temperatureServersRouter.get('/', async (request, response) => {
    const temperatureServers = await TemperatureServer.find({})
    response.json(temperatureServers.map(TemperatureServer.format))
})

temperatureServersRouter.get('/:id', async (request, response) => {
    const id = request.params.id

    try {
        const temperatureServer = await TemperatureServer.findById(id)
        response.json(TemperatureServer.format(temperatureServer))
    } catch (error) {
        response.status(404).send({ error: `No temperature server with id ${id}` })
    }
})

temperatureServersRouter.post('/', async (request, response) => {
    const { url } = request.body

    if (!url) {
        return response.status(400).send({ error: 'URL required' })
    }

    // Format URL and validate it
    const formattedURL = URLFormatter(url)
    const { error, validURL, temperatures } = await temperatureServerValidator(formattedURL)

    // If validation fails, return
    if (error) {
        return response.status(400).send({ error })
    }

    // Create new temperature server
    const newTemperatureServer = new TemperatureServer({
        url: validURL
    })

    // Create temperature sensors from server to database
    const now = new Date()
    const newTemperatureSensors = temperatures
        .map(sensor =>
            new TemperatureSensor({
                sensorId: sensor.id,
                temperature: sensor.temperature,
                lastUpdate: now,
                server: newTemperatureServer
            })
        )

    // Add temperature sensors to server
    newTemperatureServer.sensors = newTemperatureServer.sensors.concat(newTemperatureSensors.map(s => s._id))

    // Save all documents
    await Promise.all([
        newTemperatureServer.save(),
        ...newTemperatureSensors
            .map(s => s.save())
    ])

    // Populate server-document, format and return
    TemperatureServer.populate(
        newTemperatureServer,
        {
            path: 'sensors',
            select: ['sensorId', 'temperature', 'lastUpdate']
        },
        function(err, srv) {
            response.status(201).json(TemperatureServer.format(srv))
        }
    )
})

temperatureServersRouter.put('/:id', async (request, response) => {
    const data = { ...request.body }
    delete data.url

    try {
        const updatedTemperatureServer = await TemperatureServer
            .findOneAndUpdate({ _id: request.params.id }, data, { new: true })
        response.json(TemperatureServer.format(updatedTemperatureServer))
    } catch (error) {
        response.status(400).send({ error: 'Invalid request' })
    }
})

temperatureServersRouter.delete('/:id', async (request, response) => {
    const id = request.params.id

    try {
        const temperatureServerToDelete = await TemperatureServer.findById(id)
        temperatureServerToDelete.remove()
        response.status(204).end()
    } catch (error) {
        response.status(404).send({ error: `No temperature server with id ${id}` })
    }
})


module.exports = temperatureServersRouter