/**
 * Created by zZ on 2017/5/27.
 */
const mongoose = require('mongoose')
const userSchema = require('../schemas/user')
module.exports = mongoose.model('User', userSchema)