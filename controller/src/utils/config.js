require('dotenv').config()

let port = process.env.PORT
let mongoUrl = process.env.MONGODB_URL

module.exports = {
    port,
    mongoUrl
}