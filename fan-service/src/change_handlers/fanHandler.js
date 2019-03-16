const Fan = require('../models/fan')
const FanServer = require('../models/fanServer')
const fanService = require('../fanService')


const handleChange = (change) => {
    const { operationType } = change

    switch(operationType) {
        case 'insert': {
            handleInsert(change)
            break
        }
        case 'update': {
            handleUpdate(change)
            break
        }
    }
}

const handleInsert = async ({ fullDocument }) => {
    const { pinNumber, speed, frequency, server } = fullDocument
    const fanServer = await FanServer.findById(server)

    fanService
        .create(fanServer.url, pinNumber, speed, frequency)
        .catch(err => console.log(err))
}

const handleUpdate = async ({ documentKey, updateDescription }) => {
    const { _id: fanId } = documentKey
    const { updatedFields } = updateDescription

    const { pinNumber, server } = await Fan.findById(fanId)
    const { url } = await FanServer.findById(server)

    if ('speed' in updatedFields)
        fanService
            .setFanSpeed(url, pinNumber, updatedFields.speed)
            .catch(err => console.log('Error while setting speed:', err))

    if ('frequency' in updatedFields)
        fanService
            .setFanFrequency(url, pinNumber, updatedFields.frequency)
            .catch(err => console.log('Error while setting frequency:', err))
}

module.exports = {
    handleChange
}