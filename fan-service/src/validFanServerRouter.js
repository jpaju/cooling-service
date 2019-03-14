const validServerRouter = require('express').Router()
const { getAllConfig, getAllFans } = require('./fanService')


validServerRouter.get('/', async(request, response) => {

    const { url } = request.query

    if (!url) {
        return response.status(400).send({ error: 'URL is required' })
    }

    try {
        const [{ config, defaults, fanPins }, fans] = await Promise.all([
            getAllConfig(url),
            getAllFans(url)
        ])

        response.json({
            valid: true,
            validURL: url,
            fans,
            fanPins,
            config,
            defaults,
        })
    } catch (error) {
        response.json({
            valid: false,
            invalidURL: url
        })
    }
})


module.exports = validServerRouter