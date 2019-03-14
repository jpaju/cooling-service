const axios = require('axios')

const path = 'fans'


const create = (url, pin, speed = undefined, frequency = undefined) => {
    const params = {
        pin,
        dutycycle: speed,
        frequency: frequency
    }

    return axios
        .post(`${url}/${path}`, null, { params })
        .then(r => r.data)
}

const remove = (url, pin) => {
    return axios
        .delete(`${url}/${path}`, { params: { pin } })
}

const getAllFans = (url) => {
    return axios
        .get(`${url}/${path}`)
        .then(r => r.data.data.fans)
}

const getFan = (url, pin) => {
    return axios
        .get(`${url}/${path}`, { params: { pin } })
        .then(r => r.data.data.fan)
}

const getAllConfig = async(url) => {
    const [defaultsData, fanPins] = await Promise.all([
        getDefaults(url),
        getFanPins(url)
    ])

    const config = {
        minSpeed: defaultsData['min dutycycle'],
        minFrequency: defaultsData['min frequency'],
        maxFrequency: defaultsData['max frequency'],
    }

    const defaults = {
        speed: defaultsData.dutycycle,
        frequency: defaultsData.frecuency
    }

    return { config, defaults, fanPins }
}

const getDefaults = (url) => {
    return axios
        .get(`${url}/${path}/defaults`)
        .then(r => r.data.data.defaults)
}

const getFanPins = (url) => {
    return axios
        .get(`${url}/${path}/fanpins`)
        .then(r => r.data.data.pins)
}

const setFanSpeed = (url, pin, speed) => {
    const params = {
        pin,
        dutycycle: speed
    }

    return axios
        .put(`${url}/${path}`, null, { params })
}

const setFanFrequency = (url, pin, frequency) => {
    const params = {
        pin,
        frequency
    }

    return axios
        .put(`${url}/${path}`, null, { params })
}


module.exports = {
    create,
    remove,
    getAllFans,
    getFan,
    getAllConfig,
    getDefaults,
    getFanPins,
    setFanSpeed,
    setFanFrequency,
}