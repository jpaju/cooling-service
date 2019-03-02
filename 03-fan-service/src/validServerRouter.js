const validServerRouter = require('express').Router()
const { getConfig, getAllFans } = require('./fanService')


validServerRouter.get('/', async(request, response) => {

    const { url } = request.body

    if (!url) {
        return response.status(400).send({ error: 'URL is required' })
    }

    let responseData
    try {
        const [config, fans] = await Promise.all([
            getConfig(url),
            getAllFans(url)
        ])

        responseData = {
            valid: true,
            config,
            fans
        }
    } catch (error) {
        responseData = { valid: false }
    }

    response.json(responseData)
})


module.exports = validServerRouter