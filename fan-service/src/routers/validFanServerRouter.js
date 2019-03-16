const validServerRouter = require('express').Router()
const { getConfig, getAllFans } = require('../fanService')
const { getFQDNUrl } = require('../utils/dnsUtils')
const FanServer = require('../models/fanServer')


validServerRouter.get('/', async(request, response) => {

    const { url } = request.query

    if (!url) {
        return response.status(400).send({ error: 'URL is required' })
    }

    const FQDNUrl = await getFQDNUrl(url)
    const existingServer = await FanServer.findOne({ url: FQDNUrl })

    if (existingServer) {
        return response.json({ error: `Fan server with URL: ${FQDNUrl} already exists in database` })
    }

    try {
        const [{ limits, defaults, fanPins }, fans] = await Promise.all([
            getConfig(FQDNUrl),
            getAllFans(FQDNUrl)
        ])

        response.json({
            validURL: FQDNUrl,
            fans,
            fanPins,
            limits,
            defaults,
        })
    } catch (error) {
        response.json({
            error: `URL: ${url} is not valid fan server`,
            invalidURL: url
        })
    }
})


module.exports = validServerRouter