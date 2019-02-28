const validator  = require('mongoose-validator')

const URLValidator = value => validator.isURL(
    value,
    {
        protocols: ['http', 'https'],
        require_tld: true,
        require_protocol: true
    }
)

module.exports = {
    URLValidator
}