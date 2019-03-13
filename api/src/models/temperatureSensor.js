const mongoose = require('mongoose')
const { mongooseDocumentFormatter } = require('../utils/format')

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
        required: true,
        autopopulate: {
            select: 'url',
            maxDepth: 1
        }
    }
})
temperatureSensorSchema.plugin(require('mongoose-autopopulate'))

temperatureSensorSchema.statics.format = function(temperatureSensor) {
    return mongooseDocumentFormatter(temperatureSensor)
}

const TemperatureSensor = mongoose.model('TemperatureSensor', temperatureSensorSchema)


module.exports = TemperatureSensor