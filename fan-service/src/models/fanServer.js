const mongoose = require('mongoose')


const fanServerSchema = new mongoose.Schema({
    url: {
        type: String,
        required: true,
        unique: true
    },
    fans: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Fan',
    }],
    fanPins: [{
        type: Number,
        min: 0,
        max: 13
    }],
    limits: {
        minSpeed: Number,
        minFrequency: Number,
        maxFrequency: Number
    },
    defaults: {
        speed: Number,
        frequency: Number,
    }
})

const FanServer = mongoose.model('FanServer', fanServerSchema)


module.exports = FanServer