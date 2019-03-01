const fansRouter = require('express').Router()
const Fan = require('../models/fan')


fansRouter.get('/', async(request, response) => {
    const fans = await Fan.find({})
    response.json(fans.map(Fan.format))
})

fansRouter.get('/:id', async(request, response) => {
    const id = request.params.id

    try {
        const fan = await Fan.findById(id)
        response.json(Fan.format(fan))
    } catch (error) {
        response.status(404).send({ error: `No fan with id ${id}` })
    }
})

fansRouter.post('/', async(request, response) => {
    const { body } = request

    if (!body.server) {
        return response.status(400).send({ error: 'Fan-server required required' })
    }

    const newFan = new Fan({
        name: body.name,
        devices: body.devices,
        fans: body.fans
    })
    await newFan.save()

    response.status(201).json(Fan.format(newFan))
})

fansRouter.put('/:id', async(request, response) => {
    try {
        const updatedFan = await Fan
            .findOneAndUpdate({ _id: request.params.id }, request.body, { new: true })
        response.json(Fan.format(updatedFan))
    } catch (error) {
        response.status(400).send({ error: 'Invalid request' })
    }
})

fansRouter.delete('/:id', async(request, response) => {
    const id = request.params.id

    try {
        const fanToDelete = await Fan.findById(id)
        fanToDelete.remove()
        response.status(204).end()
    } catch(error) {
        response.status(404).send({ error: `No fan with id ${id}` })
    }
})


module.exports = fansRouter