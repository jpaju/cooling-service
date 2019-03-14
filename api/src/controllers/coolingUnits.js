const coolingUnitsRouter = require('express').Router()
const CoolingUnit = require('../models/coolingUnit')


coolingUnitsRouter.get('/', async (request, response) => {
    const coolingUnits = await CoolingUnit.find({})
    response.json(coolingUnits.map(CoolingUnit.format))
})

coolingUnitsRouter.get('/:id', async(request, response) => {
    const id = request.params.id
    try {
        const coolingUnit = await CoolingUnit.findById(id)
        response.json(CoolingUnit.format(coolingUnit))
    } catch (error) {
        response.status(404).send({ error: `No cooling unit with id ${id}` })
    }
})

coolingUnitsRouter.post('/', async (request, response) => {
    const { body } = request

    if (!body.name) {
        return response.status(400).send({ error: 'Name required' })
    }

    const newCoolingUnit = new CoolingUnit({
        name: body.name,
        devices: body.devices,
        fans: body.fans
    })
    try {
        await newCoolingUnit
            .save()

    } catch (error) {
        if (error.code === 11000) {
            return response.status(400).send({ error: 'Name must be unique' })
        }
        response.status(400).send({ error: 'Creation failed' })
    }

    response.status(201).json(CoolingUnit.format(newCoolingUnit))
})

coolingUnitsRouter.put('/:id', async(request, response) => {
    try {
        const updatedCoolingUnit = await CoolingUnit
            .findOneAndUpdate({ _id: request.params.id }, request.body, { new: true })

        response.json(CoolingUnit.format(updatedCoolingUnit))
    } catch (error) {
        response.status(400).send({ error: 'Invalid request' })
    }
})

coolingUnitsRouter.delete('/:id', async(request,response) => {
    const id = request.params.id

    try {
        const coolingUnitToDelete = await CoolingUnit.findById(id)
        coolingUnitToDelete.remove()
        response.status(204).end()
    } catch(error) {
        response.status(404).send({ error: `No cooling unit with id ${id}` })
    }
})


module.exports = coolingUnitsRouter