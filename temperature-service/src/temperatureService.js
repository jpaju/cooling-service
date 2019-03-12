const axios = require('axios')

const path = 'temperatures'


const getTemperatures = (url) => {
    return axios
        .get(`${url}/${path}`)
        .then(r => r.data.data.tempsensors)
}

const updateTemps = (url) => {
    axios.put(`${url}/${path}/updatesensors`)
}

const updateSensors = (url) => {
    axios.put(`${url}/${path}/updatetemps`)
}


module.exports = {
    getTemperatures,
    updateTemps,
    updateSensors,
}