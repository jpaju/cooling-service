const mongoose = require('mongoose')
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


const Fan = mongoose.model('Fan', fanSchema)
module.exports = Fan