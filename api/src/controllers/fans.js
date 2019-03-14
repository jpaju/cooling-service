const fansRouter = require('express').Router()
const Fan = require('../models/fan')
const FanServer = require('../models/fanServer')


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
    const { server, pinNumber, ...optionalData } = request.body

    if (!server || !pinNumber) {
        return response.status(400).send({ error: 'Fan-server and pin number required' })
    }

    const fanServer = await FanServer
        .findById(server)
        .catch(() => null /* Prevent raising error */)

    if (!fanServer) {
        return response.status(400).send({ error: 'Fan-server not found' })
    }

    // Check that fan server is able to create fan on specified pin
    if (!fanServer.fanPins.includes(pinNumber)) {
        return response.status(400).send({ error: `Pin number ${pinNumber} is not valid` })
    }

    // If fan already exists, update speed & frequency and return updated fan
    const existingFanData = fanServer.fans.find(fan => fan.pinNumber === pinNumber)
    if (existingFanData) {
        const existingFan = await Fan
            .findOneAndUpdate(
                { pinNumber: existingFanData.pinNumber, server: fanServer },
                optionalData,
                { new: true }
            )

        return response.json(Fan.format(existingFan))
    }

    // Use values provided in the request, or use defaults values
    // from the server if no values are specified
    const speed = optionalData.speed || fanServer.defaults.speed
    const frequency = optionalData.frequency || fanServer.defaults.frequency

    const newFan = new Fan({
        pinNumber,
        speed,
        frequency,
        server: fanServer
    })

    // Add new fan to fan server and store both to database
    fanServer.fans = fanServer.fans.concat(newFan)
    await Promise.all([
        newFan.save(),
        fanServer.save()
    ])

    Fan.populate(
        newFan,
        {
            path: 'server',
            select: 'url -fans'
        },
        function(err, fan) {
            response.status(201).json(Fan.format(fan))
        }
    )

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