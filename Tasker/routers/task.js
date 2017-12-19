
const express = require('express')
const User = require('../models/User')
const Task = require('../models/Task')

const router = express.Router()

router.get('/',function(req,res){
	var username = req.cookies.user
	Task.find({
		username : username
	}).then(function(userInfo){

		
		res.render('task.html')
	})

})


module.exports = router