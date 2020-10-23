const mongoose = require('mongoose')
const { mongooseDocumentFormatter } = require('../utils/format')
const CoolingUnit = require('./coolingUnit')


const deviceSchema = new mongoose.Schema({
    name: {
        type: String,
        unique: true,
        required: true
    },
    temperatureSensor : {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'TemperatureSensor',
        autopopulate: {
            select: ['temperature', 'lastUpdate'],
            maxDepth: 1
        },
    }
})
deviceSchema.plugin(require('mongoose-autopopulate'))

deviceSchema.pre('remove', function() {
    CoolingUnit.update({}, { '$pull': { 'devices': { id: this._id } } })
})

deviceSchema.statics.format = function(device) {
    return mongooseDocumentFormatter(device)
}

const Device = mongoose.model('Device', deviceSchema)


module.exports = Device