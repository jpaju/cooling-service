const mongoose = require('mongoose')
const { mongooseDocumentFormatter } = require('../utils/format')

mongoose.set('useCreateIndex', true)


const fanSchema = new mongoose.Schema({
    pinNumber: {
        type: Number,
        required: true
    },
    speed: {
        type: Number,
        required: true
    },
    frequency: {
        type: Number,
        required: true
    },
    server: {
        type:mongoose.Schema.Types.ObjectId,
        ref: 'FanServer',
        required: true
    }
})

fanSchema.statics.format = function(fan) {
    return mongooseDocumentFormatter(fan)
}

const Fan = mongoose.model('Fan', fanSchema, 'fan')


module.exports = Fan