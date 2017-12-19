const mongoose = require('mongoose')
const eventSchema = require('../schemas/event')
module.exports = mongoose.model('Event',eventSchema)