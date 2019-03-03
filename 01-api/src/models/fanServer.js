const mongoose = require('mongoose')
const { mongooseDocumentFormatter } = require('../utils/format')

mongoose.set('useCreateIndex', true)


const fanServerSchema = new mongoose.Schema({
    url: {
        type: String,
        required: true,
    },
    fans: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Fan'
    }],
    fanPins: [{
        type: Number,
        min: 0,
        max: 13
    }]
})

fanServerSchema.statics.format = function(fanServer) {
    return mongooseDocumentFormatter(fanServer)
}

const FanServer = mongoose.model('fanServer', fanServerSchema, 'fan_server')


module.exports = FanServer