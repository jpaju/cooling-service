const validator = require('mongoose-validator')
const axios = require('axios')


const URLValidator = value => validator.isURL(
    value,
    {
        protocols: ['http', 'https'],
        require_tld: true,
        require_protocol: true
    }
)

const fanServerValidator = async (url) => {
    try {
        const result = await axios
            .get('http://fan-service:5000/validserver', { params: { url } })
            .then(r => r.data)

        return result
    } catch (err) {
        return { error: `URL: ${url} is not valid` }
    }
}

const temperatureServerValidator = async (url) => {
    try {
        const result = await axios
            .get('http://temperature-service:5000/validserver', { params: { url } })
            .then(r => r.data)

        return result
    } catch (err) {
        return { error: `URL: ${url} is not valid` }
    }
}


module.exports = {
    URLValidator,
    fanServerValidator,
    temperatureServerValidator
}