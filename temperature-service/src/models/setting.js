const mongoose = require('mongoose')


const settingsSchema = new mongoose.Schema({
    temperature: {
        updater: {
            updateInterval: {
                type: Number,
                required: true,
                default: 10,
                min: 3,
                max: 120
            },
            running: {
                type: Boolean,
                required: true,
                default: true
            }
        }
    }
})

const Settings = mongoose.model('Settings', settingsSchema)


module.exports = Settings