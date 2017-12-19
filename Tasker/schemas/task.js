const mongoose = require('mongoose')

const ourtask = mongoose.Schema({
  t_name: String,
  t_descript: String,
  username: String,
  state: Boolean,
  t_duration: Number
})

module.exports = ourtask
