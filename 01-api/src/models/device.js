const mongoose = require('mongoose')
mongoose.set('useCreateIndex', true)


const deviceSchema = new mongoose.Schema({
    name: {
        type: String,
        unique: true
    },
    temperatureSensor : {
        type: mongoose.Types.ObjectId,
        ref: 'TemperatureSensor'
    }
})


const Device = mongoose.model('Device', deviceSchema)
module.exports = Device