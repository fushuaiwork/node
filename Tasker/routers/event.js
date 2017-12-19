
const express = require('express')
const Event= require('../models/Event')


const router = express.Router()

router.get('/', async function(req,res){
	var username = req.cookies.user
	Event.find({
		username : username
	}).then(function(userInfo){
		res.render('event.html')
	})

})

module.exports = router