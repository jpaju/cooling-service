const mongoose = require('mongoose')
const TemperatureSensor = require('./temperatureSensor')
const { mongooseDocumentFormatter } = require('../utils/format')


const temperatureServerSchema = new mongoose.Schema({
    url: {
        type: String,
        required: true
    },
    sensors: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'TemperatureSensor',
        autopopulate: {
            select: ['sensorId', 'temperature', 'lastUpdate'],
            maxDepth: 1
        }
    }]
})
temperatureServerSchema.plugin(require('mongoose-autopopulate'))

// Cascade temperature server deletion to also delete temperature sensors
temperatureServerSchema.pre('remove', async function() {
    const sensorsToRemove = await TemperatureSensor.find({
        '_id': {
            '$in': this.sensors
        }
    })
    await Promise.all(sensorsToRemove.map(s => s.remove()))
})

temperatureServerSchema.statics.format = function(temperatureServer) {
    return mongooseDocumentFormatter(temperatureServer)
}

const TemperatureServer = mongoose.model('TemperatureServer', temperatureServerSchema)


module.exports = TemperatureServer