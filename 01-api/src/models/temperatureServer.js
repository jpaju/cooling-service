const mongoose = require('mongoose')
const { URLValidator } = require('../utils/validator')
const { mongooseDocumentFormatter } = require('../utils/format')

mongoose.set('useCreateIndex', true)


const temperatureServerSchema = new mongoose.Schema({
    url: {
        type: String,
        required: true,
        validate: {
            validator: value => URLValidator(value),
            message: 'Valid URL requires'
        }
    },
    sensors: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'TemperatureSensor'
    }]
})

temperatureServerSchema.statics.format = function(temperatureServer) {
    return mongooseDocumentFormatter(temperatureServer)
}

const TemperatureServer = mongoose.model('TemperatureServer', temperatureServerSchema, 'temperature_server')


module.exports = TemperatureServer