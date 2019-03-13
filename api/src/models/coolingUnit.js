const mongoose = require('mongoose')
const { mongooseDocumentFormatter }  = require('../utils/format')

mongoose.set('useCreateIndex', true)


const coolingUnitSchema = new mongoose.Schema({
    name: {
        type: String,
        maxLenth: 50,
        required: true,
        unique: true
    },
    devices: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Device',
        autopopulate: {
            select: 'name',
            maxDepth: 1
        }
    }],
    fans: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Fan',
        autopopulate: {
            select: ['speed, frequency'],
            maxDepth: 1
        }
    }]
})

coolingUnitSchema.statics.format = function(coolingUnit) {
    return mongooseDocumentFormatter(coolingUnit)
}

const CoolingUnit = mongoose.model('CoolingUnit', coolingUnitSchema)


module.exports = CoolingUnit