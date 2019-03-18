const settingsRouter = require('express').Router()
const Settings = require('../models/setting')


settingsRouter.get('/', async (request, response) => {
    const settings = await Settings.findOne({})
    response.json(Settings.format(settings))
})

settingsRouter.put('/', async (request, response) => {
    const data = { ...request.body }
    try {
        const newSettings = await Settings
            .findOneAndUpdate(
                {}, data,
                {
                    new: true,
                    runValidators: true
                }
            )
        response.json(Settings.format(newSettings))
    } catch (error) {
        response.status(400).send({ error: error.message })
    }
})

settingsRouter.post('/', (request, response) => {
    response.status(405).send({ error: 'POST /settings not allowed, use PUT /settings' })
})

settingsRouter.delete('/', (request, response) => {
    response.status(405).send({ error: 'DELETE /settings not allowed' })
})

module.exports = settingsRouter