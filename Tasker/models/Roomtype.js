
const mongoose = require('mongoose')
const roomtypeSchema = require('../schemas/roomtype')
module.exports = mongoose.model('Roomtype',roomtypeSchema)
