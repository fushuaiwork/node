
const express = require('express')

const router = express.Router()

router.get('/', async function(req,res){
	res.render('about.html')
})

module.exports = router