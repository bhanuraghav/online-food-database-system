var express = require('express');
var router = express.Router();
var connection = require('./../config/connection');
var dbconfig = require('./../config/database'); 
connection.query('USE ' + dbconfig.database);

// Get Homepage
router.get('/', function(req, res){
        res.render('home');
});
router.post('/', function(req, res){
	res.render('home');
});


module.exports = router;