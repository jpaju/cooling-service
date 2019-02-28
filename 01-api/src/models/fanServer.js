const mongoose = require('mongoose')
const { URLValidator } = require('./validator')

mongoose.set('useCreateIndex', true)


const fanServerSchema = {
    url: {
        type: String,
        required: true,
        validate: {
            validator: value => URLValidator(value),
            message: 'Valid URL requires'
        }
    }
}


const FanServer = mongoose.model('fanServer', fanServerSchema)
module.exports = FanServer