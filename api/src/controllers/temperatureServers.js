const temperatureServersRouter = require('express').Router()
const TemperatureServer = require('../models/temperatureServer')


temperatureServersRouter.get('/', async(request, response) => {
    const temperatureServers = await TemperatureServer.find({})
    response.json(temperatureServers.map(TemperatureServer.format))
})

temperatureServersRouter.get('/:id', async(request, response) => {
    const id = request.params.id

    try {
        const temperatureServer = await TemperatureServer.findById(id)
        response.json(TemperatureServer.format(temperatureServer))
    } catch (error) {
        response.status(404).send({ error: `No temperature server with id ${id}` })
    }
})

temperatureServersRouter.post('/', async(request, response) => {
    const { body } = request

    if (!body.url) {
        return response.status(400).send({ error: 'URL required' })
    }

    const newTemperatureServer = new TemperatureServer({
        name: body.url
    })
    await newTemperatureServer.save()

    response.status(201).json(TemperatureServer.format(newTemperatureServer))
})

temperatureServersRouter.put('/:id', async(request, response) => {
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


module.exports = temperatureServersRouter