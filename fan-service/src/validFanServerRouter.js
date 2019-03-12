const validServerRouter = require('express').Router()
const { getConfig, getAllFans } = require('./fanService')


validServerRouter.get('/', async(request, response) => {

    const { url } = request.query

    if (!url) {
        return response.status(400).send({ error: 'URL is required' })
    }

    try {
        const [config, fans] = await Promise.all([
            getConfig(url),
            getAllFans(url)
        ])

        response.json({
            valid: true,
            validURL: url,
            config,
            fans
        })
    } catch (error) {
        response.json({
            valid: false,
            invalidURL: url
        })
    }
})


module.exports = validServerRouter