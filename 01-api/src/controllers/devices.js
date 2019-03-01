const devicesRouter = require('express').Router()
const Device = require('../models/device')


devicesRouter.get('/', async(request, response) => {
    const devices = await Device.find({})
    response.json(devices.map(Device.format))
})

devicesRouter.get('/:id', async(request, response) => {
    const id = request.params.id

    try {
        const device = await Device.findById(id)
        response.json(Device.format(device))
    } catch (error) {
        response.status(404).send({ error: `No device with id ${id}` })
    }
})

devicesRouter.post('/', async(request, response) => {
    const { body } = request

    if (!body.name) {
        return response.status(400).send({ error: 'Name required' })
    }

    const newDevice = new Device({
        name: body.name,
        temperatureSensor: body.temperatureSensor
    })
    await newDevice.save()

    response.status(201).json(Device.format(newDevice))
})

devicesRouter.put('/:id', async(request, response) => {
    try {
        const updatedDevice = await Device
            .findOneAndUpdate({ _id: request.params.id }, request.body, { new: true } )
        response.json(Device.format(updatedDevice))
    } catch (error) {
        response.status(400).send({ error: 'Invalid request' })
    }
})

devicesRouter.delete('/:id', async(request, response) => {
    const id = request.params.id

    try {
        const deviceToDelete = await Device.findById(id)
        deviceToDelete.remove()
        response.status(204).end()
    } catch (error) {
        response.status(404).send({ error: `No device with id ${id}` })
    }
})


module.exports = devicesRouter