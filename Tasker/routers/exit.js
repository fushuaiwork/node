/**
 * Created by zZ on 2017/5/27.
 */
var express = require('express')
var User = require('../models/User')

const app = new express()
const server = require('http').createServer(app)
const io = require('socket.io').listen(server)

var router = express.Router()


router.get('/', async function (req, res) {
	console.log('exit')
    User.update({
        username: req.cookies.user
    }, {
        state: false
    }).then(function () {
        res.clearCookie('user')
        res.clearCookie('flag')
        res.redirect('/login')
    })
})

module.exports = router