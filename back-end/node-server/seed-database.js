require('dotenv').config();

const mysql = require('mysql2');
const connection = mysql.createConnection({
    host: 'localhost',
    user: process.env.DB_USER,
    password: process.env.DB_PASS
});

// connect to mysql, assumes above works eg. mysql is running/credentials exist
connection.connect((err) => {
    if (err) {
        console.error('error connecting: ' + err.stack);
        return;
    }
});

// check if database exists, if not create it
connection.query('CREATE DATABASE IF NOT EXISTS `tagging_tracker`', (error, results, fields) => {
    if (error) {
        console.log('error checking if tagging_tracker database exists:', error.sqlMessage);
        return;
    }
});

// use the database
connection.query('USE tagging_tracker', (error, results, fields) => {
    if (error) {
        console.log('an error occurred trying to use the tagging_tracker database', error);
        return;
    }
});

// build the various tables and their schemas, stole these straight out of phpmyadmin ha
// users
connection.query(
    'CREATE TABLE `users` (' +
        '`id` int(11) NOT NULL AUTO_INCREMENT,' +
        ' `username` varchar(255) COLLATE utf8_unicode_ci NOT NULL,' +
        ' `password_hash` varchar(255) COLLATE utf8_unicode_ci NOT NULL,' +
        ' `active` tinyint(4) NOT NULL,' +
        ' PRIMARY KEY (`id`)' +
       ') ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci',
    (error, results, fields) => {
        if (error) {
            console.log('error creating table users:', error.sqlMessage);
            return;
        }
    }
)

// addresses -- will get modified to include user_id so know which account made what entries

connection.end();