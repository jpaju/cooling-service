const mongoose = require('mongoose')
const { mongooseDocumentFormatter } = require('../utils/format')
const axios = require('axios')


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

fanSchema.pre('remove', function() {
    //Remove fan from coolingunit
    require('./coolingUnit')
        .update({}, { '$pull': { 'fans': { id: this._id } } })

    // Remove fan from Arduino using fan-service
    require('./fanServer')
        .findById(this.server)
        .then(fanServer => {
            const { url } = fanServer
            const { pinNumber } = this
            const params = {
                url,
                ['pin-number']: pinNumber
            }

            axios
                .get('http://fan-service:5000/deletefan', { params })
                .catch(err => console.log('Error while deleting fan from Arduino:', err))
        })
})

fanSchema.statics.format = function(fan) {
    return mongooseDocumentFormatter(fan)
}

const Fan = mongoose.model('Fan', fanSchema)


module.exports = Fan