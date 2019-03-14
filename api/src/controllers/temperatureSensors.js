const temperatureSensorsRouter = require('express').Router()
const boolParser = require('express-query-boolean')
const TemperatureSensor = require('../models/temperatureSensor')
const Device = require('../models/device')

temperatureSensorsRouter.use(boolParser())


temperatureSensorsRouter.get('/', async(request, response) => {
    const { unassigned } = request.query

    // Find temperature sensors that are not assigned to any device
    if (unassigned) {
        const devicesWithSensors = await Device
            .find({ temperatureSensor: { '$exists' : true, '$ne': null } })

        const assignedSensorIds = devicesWithSensors.map(device => device.temperatureSensor._id)
        const temperatureSensors = await TemperatureSensor
            .find({ _id: { '$nin': assignedSensorIds } })

        return response.json(temperatureSensors.map(TemperatureSensor.format))
    }

    const temperatureSensors = await TemperatureSensor.find({})
    response.json(temperatureSensors.map(TemperatureSensor.format))
})

temperatureSensorsRouter.get('/:id', async(request, response) => {
    const id = request.params.id

    try {
        const temperatureSensor = await TemperatureSensor.findById(id)
        response.json(TemperatureSensor.format(temperatureSensor))
    } catch (error) {
        response.status(404).send({ error: `No temperature sensor with id ${id}` })
    }
})

temperatureSensorsRouter.post('/', (request, response) => {
    response.status(405).send({ error: 'Temperature sensors are added automatically when new server is added' })
})

temperatureSensorsRouter.put('/:id', (request, response) => {
    response.status(405).send({ error: 'Temperature sensors are not modifiable' })
})

temperatureSensorsRouter.delete('/:id', (request, response) => {
    response.status(405).send({ error: 'Temperature sensors are deleted when temperature-server is deleted' })
})


module.exports = temperatureSensorsRouter