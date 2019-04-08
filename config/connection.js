var mysql = require('mysql');
var dbconfig = require('./database');

var client = module.exports= mysql.createConnection(dbconfig.connection);
client.connect();