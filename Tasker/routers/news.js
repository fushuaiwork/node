
const express = require('express')
const Task= require('../models/Task')

const router = express.Router()

router.get('/', async function(req,res){
	var username = req.cookies.user
	
	res.render('new.html')

})

module.exports = router