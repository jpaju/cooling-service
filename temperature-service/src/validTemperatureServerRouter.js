const validTemperatureServerRouter = require('express').Router()
const { getTemperatures } = require('./temperatureService')
const { getFQDNUrl } = require('./utils/dnsUtils')
const TemperatureServer = require('./models/temperatureServer')


validTemperatureServerRouter.get('/', async(request, response) => {
    const { url } = request.query

    if (!url) {
        return response.status(400).send({ error: 'URL is required' })
    }

    const FQDNUrl = await getFQDNUrl(url)
    const existingServer = await TemperatureServer.findOne({ url: FQDNUrl })

    if (existingServer) {
        return response.json({
            error: `Temperature server with URL: ${FQDNUrl} already exists in database`
        })
    }

    try {
        const temperatures = await getTemperatures(url)

        response.json({
            validURL: FQDNUrl,
            temperatures
        })
    } catch (error) {
        response.json({
            error: `URL: ${url} is not valid temperature server`,
            invalidURL: url
        })
    }
})


module.exports = validTemperatureServerRouter