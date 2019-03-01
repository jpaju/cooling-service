const mongoose = require('mongoose')
const { URLValidator } = require('../utils/validator')
const { mongooseDocumentFormatter } = require('../utils/format')

mongoose.set('useCreateIndex', true)


const fanServerSchema = new mongoose.Schema({
    url: {
        type: String,
        required: true,
        validate: {
            validator: value => URLValidator(value),
            message: 'Valid URL requires'
        }
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