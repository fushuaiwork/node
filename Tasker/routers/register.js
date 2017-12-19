/**
 * Created by zZ on 2017/5/27.
 */

const express = require('express')
const User = require('../models/User')

const router = express.Router()

router.get('/', function (req, res) {
    res.render('register.html')
})

router.post('/signUp', function (req, res) {
    var username = req.body.username
    var password = req.body.password
    var email = req.body.email
    var gender = req.body.gender
    var age = 0
    var resData = {}

    console.log(email)
    console.log(gender)

    User.findOne({
        username: username
    }).then(function (userInfo) {
        if (userInfo) {
            resData.success = 0
            resData.err = "该用户名已被注册！"
            res.json(resData)
            return false
        } else {
            var user = new User({
                username: username,
                password: password,
                image: '../public/img/people.png',
                state: false,
                email: email,
                gender: gender,
                age: age
            })
            return user.save()
        }
    }).then(function () {
        resData.success = 1
        resData.message = "注册成功！"
        res.json(resData)
    })
})

module.exports = router;