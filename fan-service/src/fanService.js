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
        .then(r => r.data)
}

const getFan = (url, pin) => {
    return axios
        .get(`${url}/${path}`, { params: { pin } })
        .then(r => r.data)
}

const getConfig = (url) => {
    return axios
        .get(`${url}/${path}/config`)
        .then(r => r.data)
        .then(data => {

            const { fanpins: fanPins } = data
            const limits = {
                minSpeed: data.limits['min dutycycle'],
                minFrequency: data.limits['min frequency'],
                maxFrequency: data.limits['max frequency'],
            }
            const defaults = {
                speed: data.defaults.dutycycle,
                frequency: data.defaults.frequency
            }

            return { defaults, limits, fanPins }
        })


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
    getConfig,
    setFanSpeed,
    setFanFrequency,
}