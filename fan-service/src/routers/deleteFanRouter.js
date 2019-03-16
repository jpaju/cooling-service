const deleteFanRouter = require('express').Router()
const fanService = require('../fanService')


deleteFanRouter.get('/', async (request, response) => {
    const { url } = request.query
    const pinNumber = request.query['pin-number']

    if (!url || !pinNumber) {
        return response.status(400).send({
            error: 'URL and pin-number required'
        })
    }

    try {
        await fanService.remove(url, pinNumber)
        response.status(204).end()
    } catch (error) {
        response.status(400).send({
            error: `Deleting fan from ${url}, pin: ${pinNumber} failed`
        })
    }
})

module.exports = deleteFanRouter