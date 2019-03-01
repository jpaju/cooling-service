const mongoose = require('mongoose')
const { mongooseDocumentFormatter } = require('../utils/format')

mongoose.set('useCreateIndex', true)


const deviceSchema = new mongoose.Schema({
    name: {
        type: String,
        unique: true
    },
    temperatureSensor : {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'TemperatureSensor'
    }
})

deviceSchema.statics.format = function(device) {
    return mongooseDocumentFormatter(device)
}

const Device = mongoose.model('Device', deviceSchema, 'device')


module.exports = Device