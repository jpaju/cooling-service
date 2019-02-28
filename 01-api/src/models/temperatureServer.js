const mongoose = require('mongoose')
const { URLValidator } = require('./validator')

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




const TemperatureServer = mongoose.model('TemperatureServer', temperatureServerSchema)
module.exports = TemperatureServer