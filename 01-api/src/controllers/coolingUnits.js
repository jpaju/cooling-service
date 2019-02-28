const coolingUnitsRouter = require('express').Router()
const CoolingUnit = require('../models/coolingUnit')

coolingUnitsRouter.get('/', async (request, response) => {
    const coolingUnits = await CoolingUnit.find({})
    response.json(coolingUnits)
})

coolingUnitsRouter.get('/:id', async(request, response) => {
    const coolingUnit = await CoolingUnit.findById(request.params.id)

    coolingUnit ?
        response.json(coolingUnit) :
        response.status(404).send({ error: `No cooling unit with id: ${request.params.id}` })
})

module.exports = coolingUnitsRouter