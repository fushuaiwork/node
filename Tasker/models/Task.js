const mongoose = require('mongoose')
const taskSchema = require('../schemas/task')
module.exports = mongoose.model('Task',taskSchema)
