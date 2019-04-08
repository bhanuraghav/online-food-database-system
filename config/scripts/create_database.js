
var mysql = require('mysql');
var dbconfig = require('../config/database');

var connection = mysql.createConnection(dbconfig.connection);
var user ="user";
connection.query('CREATE DATABASE ' + dbconfig.database);

connection.query("\
CREATE TABLE `" + dbconfig.database + "`.`" + dbconfig.users_table + "` ( \
    `id` INT UNSIGNED NOT NULL AUTO_INCREMENT, \
    `email` VARCHAR(50) NOT NULL, \
    `password` VARCHAR(60) NOT NULL, \
    `firstname` VARCHAR(20) NOT NULL, \
    `lastname` VARCHAR(20) NOT NULL, \
    `phone1` VARCHAR(10) NOT NULL, \
    `role` VARCHAR(5) NOT NULL DEFAULT 'user' , \
        PRIMARY KEY (`id`), \
    UNIQUE INDEX `id_UNIQUE` (`id` ASC), \
    UNIQUE INDEX `email_UNIQUE` (`email` ASC) \
)");

console.log('Success: Database Created!')

connection.end();
