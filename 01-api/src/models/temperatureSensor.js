const mongoose = require('mongoose')
mongoose.set('useCreateIndex', true)


const temperatureSensorSchema = new mongoose.Schema({
    sensorId: {
        type: String,
        required: true,
        unique: true
    },
    temperature: {
        type: Number,
    },
    lastUpdate: {
        type: Date
    },
    server: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'TemperatureServer',
        required: true
    }
})


const TemperatureSensor = mongoose.model('TemperatureSensor', temperatureSensorSchema)
module.exports = TemperatureSensor