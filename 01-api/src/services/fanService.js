const axios = require('axios')

const path = 'fans'


const create = (url, pin, optional = {}) => {
    const params = {
        pin,
        dutycycle: optional.speed || undefined,
        frequency: optional.frequency || undefined
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

const getConfig = async(url) => {
    const [defaults, fanPins] = await Promise.all([
        axios.get(`${url}/${path}/defaults`).then(r => r.data.data),
        axios.get(`${url}/${path}/fanpins`).then(r => r.data.data)
    ])

    return { ...defaults, ...fanPins }
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

const validFanServer = async(url) => {
    return await getConfig(url)
        .then(result => result)
        .catch(() => false)
}


module.exports = {
    create,
    remove,
    getAllFans,
    getFan,
    getConfig,
    setFanSpeed,
    setFanFrequency,
    validFanServer
}