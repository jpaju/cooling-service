const mongoose = require('mongoose')
mongoose.set('useCreateIndex', true)


const coolingUnitSchema = {
    name: {
        type: String,
        required: true,
        unique: true
    },
    devices: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Device'
    }],
    fans: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Fan'
    }]
}

const CoolingUnit = mongoose.model('CoolingUnit', coolingUnitSchema)
module.exports = CoolingUnit