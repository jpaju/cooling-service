const temperatureService = require('./temperatureService')
const TemperatureSensor = require('./models/temperatureSensor')
const TemperatureServer = require('./models/temperatureServer')


let updateInterval = 10000
let updaterIntervalId = undefined

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
}

const setUpdateInterval = (newValue) => updateInterval = newValue * 1000

const startUpdater = () => updaterIntervalId = setInterval(temperatureUpdater, updateInterval)

const stopUpdater = () => clearInterval(updaterIntervalId)


module.exports = {
    startUpdater,
    stopUpdater,
    setUpdateInterval,
}