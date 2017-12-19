/*
 * Created by zZ on 2017/5/27.
 */
const express = require('express')
const User = require('../models/User')
const Task = require('../models/Task')
const router = express.Router()

router.get('/', function (req, res) {
    res.redirect('/login')
})



module.exports = router
