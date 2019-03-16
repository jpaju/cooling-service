const mongoose = require('mongoose')


const temperatureServerSchema = new mongoose.Schema({
    url: {
        type: String,
        required: true
    },
    sensors: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'TemperatureSensor',
    }]
})

const TemperatureServer = mongoose.model('TemperatureServer', temperatureServerSchema)


module.exports = TemperatureServer