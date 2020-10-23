const temperatureService = require('./temperatureService')
const TemperatureSensor = require('./models/temperatureSensor')
const TemperatureServer = require('./models/temperatureServer')
const Settings = require('./models/setting')


let updateIntervalSeconds = 10
let updaterRunning = true
let updaterIntervalId = undefined

const watchPipeline = [
    { '$match': {
        'operationType': 'update',
        'updateDescription.updatedFields.temperature.updater': {
            '$exists': true
        }
    } },
    { '$addFields': { updaterState: '$fullDocument.temperature.updater' } }
]

const temperatureUpdater = async () => {

    // Get all temperature sensors and servers
    const servers = await TemperatureServer.find({})
    const sensors = await TemperatureSensor.find({})

    // Parse url's and retrieve temperatures
    const urls = servers.map(s => s.url)
    const temperatures = await Promise
        .all(urls.map(url => temperatureService.getTemperatures(url)))
        .then(temps => [].concat(...temps))

    // Create hashMap from temperatures with sensorId as key and temperature as value
    const temperatureMap = temperatures
        .reduce((map, temp) => {
            map[temp.id] = temp.temperature
            return map
        }, {})

    // Store updated temperatures with date
    const now = new Date()
    sensors.forEach(sensor => {
        sensor.lastUpdate = now,
        sensor.temperature = temperatureMap[sensor.sensorId]
        sensor.save()
    })

    console.log('Updater finished!')
}

const initUpdater = async () => {
    // Set values defined in settings
    const { temperature: { updater } } = await Settings.findOne({})

    setUpdaterRunningState(updater.running)
    setUpdateInterval(updater.updateInterval)

    // Subscribe to changes in settings
    Settings.watch(watchPipeline, { fullDocument: 'updateLookup' }).on('change', handleChange)
}

const handleChange = ({ updaterState }) => {

    const {
        updateInterval: newInterval = updateIntervalSeconds,
        running: newRunningState = updaterRunning
    } = updaterState

    // Set new update interval if it differs from current value
    if (newInterval !== updateIntervalSeconds)
        setUpdateInterval(newInterval)

    // Set updater running state if it differs from current state
    if (newRunningState !== updaterRunning)
        setUpdaterRunningState(newRunningState)
}

const setUpdateInterval = (newInterval) => {
    updateIntervalSeconds = newInterval

    // If currently running, restart updater to use new interval
    if (updaterRunning) {
        stopUpdater()
        startUpdater()
    }
}

const setUpdaterRunningState = (running) => running ? startUpdater() : stopUpdater()

const startUpdater = () => {
    updaterIntervalId = setInterval(temperatureUpdater, updateIntervalSeconds*1000)
    updaterRunning = true
}

const stopUpdater = () => {
    clearInterval(updaterIntervalId)
    updaterIntervalId = undefined
    updaterRunning = false
}


module.exports = {
    initUpdater
}