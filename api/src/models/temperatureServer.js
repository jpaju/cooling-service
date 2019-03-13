const mongoose = require('mongoose')
const TemperatureSensor = require('./temperatureSensor')
const { mongooseDocumentFormatter } = require('../utils/format')

mongoose.set('useCreateIndex', true)


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
    await TemperatureSensor.remove({
        '_id': {
            '$in': this.sensors
        }
    })
})

temperatureServerSchema.statics.format = function(temperatureServer) {
    return mongooseDocumentFormatter(temperatureServer)
}

const TemperatureServer = mongoose.model('TemperatureServer', temperatureServerSchema)


module.exports = TemperatureServer