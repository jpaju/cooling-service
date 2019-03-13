const mongoose = require('mongoose')
const Fan = require('./fan')
const { mongooseDocumentFormatter } = require('../utils/format')

mongoose.set('useCreateIndex', true)


const fanServerSchema = new mongoose.Schema({
    url: {
        type: String,
        required: true,
    },
    fans: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Fan',
        autopopulate: {
            select: ['pinNumber', 'speed', 'frequency'],
            maxDepth: 1
        }
    }],
    fanPins: [{
        type: Number,
        min: 0,
        max: 13
    }]
})
fanServerSchema.plugin(require('mongoose-autopopulate'))

// Cascade fan server deletion to also delete fans on server
fanServerSchema.pre('remove', async function() {
    await Fan.remove({
        '_id': {
            '$in': this.fans
        }
    })
})

fanServerSchema.statics.format = function(fanServer) {
    return mongooseDocumentFormatter(fanServer)
}

const FanServer = mongoose.model('FanServer', fanServerSchema)


module.exports = FanServer