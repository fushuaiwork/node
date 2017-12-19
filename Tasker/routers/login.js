/**
 * Created by zZ on 2017/5/27.
 */

var express = require('express')
var User = require('../models/User')

var router = express.Router()

router.get('/', function (req, res) {
    res.render('login.html')
})

router.post('/signIn', function (req, res) {
    var username = req.body.username
    var password = req.body.password
    var resData = {}
    console.log(username)
    console.log(password)
    console.log('varifying user')
    User.findOne({
        username: username,
        password: password
    }).then(function (userInfo) {
        if (!userInfo) {
            resData.success = 0
            resData.err = "用户名或者密码错误!"
            res.json(resData)
            return false
        } else {
            if(userInfo.state){
                resData.success = 0
                resData.err = "该用户已登录!"
                console.log('already login, redirect to home')
                res.redirect('/home')
                //res.json(resData)
                return false
            }else{
                User.update({
                    _id: userInfo._id
                }, {
                    state: true
                }).then(function () {
                    resData.success = 1
                    resData.err = "登录成功!"
                    res.cookie("user", userInfo.username, {maxAge: 1000 * 60 * 60})
                    console.log('redirect to home')
                    res.redirect('/home')
                    //res.json(resData)
                    /*res.render('home.html',{
                        username : userInfo.username,
                        age: userInfo.age,
                        sex: userInfo.gender,
                        email: userInfo.email
                    })*/
                })
            }
        }
    })
})

module.exports = router
