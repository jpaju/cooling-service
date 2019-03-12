const validTemperatureServerRouter = require('express').Router()
const { getTemperatures } = require('./temperatureService')


validTemperatureServerRouter.get('/', async(request, response) => {
    const { url } = request.query

    if (!url) {
        return response.status(400).send({ error: 'URL is required' })
    }

    try {
        const temperatures = await getTemperatures(url)

        response.json({
            valid: true,
            validURL: url,
            temperatures
        })
    } catch (error) {
        response.json({
            valid: false,
            invalidURL: url
        })
    }
})


module.exports = validTemperatureServerRouter