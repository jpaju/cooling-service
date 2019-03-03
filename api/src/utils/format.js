const URLFormatter = require('normalize-url')


const mongooseDocumentFormatter = (object) => {
    const formatted = { ...object._doc, id: object._id }
    delete formatted._id
    delete formatted.__v
    return formatted
}


module.exports = {
    mongooseDocumentFormatter,
    URLFormatter
}