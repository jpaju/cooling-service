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
        required: true,
        autopopulate: {
            select: 'url',
            maxDepth: 1
        }
    }
})
fanSchema.plugin(require('mongoose-autopopulate'))

fanSchema.statics.format = function(fan) {
    return mongooseDocumentFormatter(fan)
}

const Fan = mongoose.model('Fan', fanSchema)


module.exports = Fan