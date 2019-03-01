const fanServersRouter = require('express').Router()
const FanServer = require('../models/fanServer')


fanServersRouter.get('/', async(request, response) => {
    const fanServers = await FanServer.find({})
    response.json(fanServers.map(FanServer.format))
})

fanServersRouter.get('/:id', async(request, response) => {
    const id = request.params.id

    try {
        const fanServer = await FanServer.findById(id)
        response.json(FanServer.format(fanServer))
    } catch (error) {
        response.status(404).send({ error: `No fan server with id ${id}` })
    }
})

fanServersRouter.post('/', async(request, response) => {
    const { body } = request

    if (!body.url) {
        return response.status(400).send({ error: 'URL required' })
    }

    const newFanServer = new FanServer({
        url: body.url,
        devices: body.devices,
    })
    await newFanServer.save()

    response.status(201).json(FanServer.format(newFanServer))
})

fanServersRouter.put('/:id', async(request, response) => {
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


module.exports = fanServersRouter