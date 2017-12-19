/**
 * Created by zZ on 2017/5/27.
 */
const mongose = require('mongoose')

const user = mongose.Schema({
    username: String,
    password: String,
    image: String,
    state: Boolean,
    gender: String,
    age: Number,
    email: String
})

module.exports = user
