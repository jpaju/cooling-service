const fanServersRouter = require('express').Router()
const FanServer = require('../models/fanServer')
const Fan = require('../models/fan')
const { fanServerValidator } = require('../utils/validator')
const { URLFormatter } = require('../utils/format')


fanServersRouter.get('/', async (request, response) => {
    const fanServers = await FanServer.find({})
    response.json(fanServers.map(FanServer.format))
})

fanServersRouter.get('/:id', async (request, response) => {
    const id = request.params.id

    try {
        const fanServer = await FanServer.findById(id)
        response.json(FanServer.format(fanServer))
    } catch (error) {
        response.status(404).send({ error: `No fan server with id ${id}` })
    }
})

fanServersRouter.post('/', async (request, response) => {
    const { url, devices } = request.body

    // Check that url is specified
    if (!url) {
        return response.status(400).send({ error: 'URL required' })
    }

    const formattedURL = URLFormatter(url)
    const { valid, config, fans } = await fanServerValidator(formattedURL)

    // If validation fails, return
    if (!valid) {
        return response.status(400).send({ error: `URL ${url} is not valid` })
    }

    // Create new fan server
    const newFanServer = new FanServer({
        url: formattedURL,
        devices: devices,
        fanPins: config.pins
    })
    await newFanServer.save()

    // Store fans from server to database
    await Promise.all(
        fans.map(fan => {
            new Fan({
                pinNumber: fan.pin,
                speed: fan.dutycycle,
                frequency: fan.frequency,
                server: newFanServer
            }).save()
        })
    )

    response.status(201).json(FanServer.format(newFanServer))
})

fanServersRouter.put('/:id', async (request, response) => {
    const data = { ...request.body }
    delete data.url

    try {
        const updatedFanServer = await FanServer
            .findOneAndUpdate({ _id: request.params.id }, data, { new: true })
        response.json(FanServer.format(updatedFanServer))
    } catch (error) {
        response.status(400).send({ error: 'Invalid request' })
    }
})

fanServersRouter.delete('/:id', async (request, response) => {
    const id = request.params.id

    try {
        const fanServerToDelete = await FanServer.findById(id)
        fanServerToDelete.remove()
        response.status(204).end()
    } catch (error) {
        response.status(404).send({ error: `No fan server with id ${id}` })
    }
})


module.exports = fanServersRouter