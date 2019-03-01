const temperatureSensorsRouter = require('express').Router()
const TemperatureSensor = require('../models/temperatureSensor')


temperatureSensorsRouter.get('/', async(request, response) => {
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