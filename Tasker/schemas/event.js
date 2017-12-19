const mongoose = require('mongoose')

const events = mongoose.Schema({
  e_name: String,
  e_Type: String,
  e_descript: String,
  username: String,
  state: Boolean,
  start: Number,
  end:Number
})

module.exports = events
