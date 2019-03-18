const mongoose = require('mongoose')
const { mongooseDocumentFormatter } = require('../utils/format')

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

settingsSchema.statics.format = function(settings) {
    let formatted = mongooseDocumentFormatter(settings)
    delete formatted.id
    return formatted
}

settingsSchema.statics.initialize = async function() {
    const existingSettings = await Settings.findOne({})
    if (!existingSettings) {
        // Create new settings with default values
        const newSettings = new Settings()
        newSettings.save()
    }
}

const Settings = mongoose.model('Settings', settingsSchema)


module.exports = Settings