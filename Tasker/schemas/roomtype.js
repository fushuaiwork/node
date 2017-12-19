const mongoose = require('mongoose')

const roomtype = mongoose.Schema({
  room_title: String,
  room_userlist: String,
  room_eventlist: String,
})

module.exports = roomtype
