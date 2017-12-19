
const express = require('express')
const User = require('../models/User')
const Task = require('../models/Task')

const router = express.Router()


router.get('/', function (req, res) {
	console.log('enter home')
    if (!req.cookies.user) {
    	console.log('back to login')
        res.redirect('/login')
    } else {
        if(!req.cookies.flag){
        	console.log('find user: '+req.cookies.user)
			User.findOne({
				username: req.cookies.user
			}).then(function(userInfo){
				console.log('user: '+userInfo.username+' found, render home')
				res.render('home.html',{
					username: userInfo.username
				})
			})
		}else{
			console.log('exit')
			res.redirect('/exit')
		}
    }
})

router.post('/mytasks', async function(req, res, next){

	console.log('check user')
	if (!req.cookies.user) {
        res.redirect('/login')
    } else {

    	console.log('find tasks by user: '+req.cookies.user)
		Task.find({
			username: req.cookies.user
		}).then(function(userInfo){
			const resData = userInfo
			res.cookie("user", userInfo.username, {maxAge: 1000 * 60 * 60})
			//res.redirect('/task')
			res.json(resData)
			
		})
		
    }
})



module.exports = router
