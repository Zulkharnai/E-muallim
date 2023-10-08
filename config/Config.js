const mysql = require('mysql');
require('dotenv').config();

var con = mysql.createPool({
    connectionLimit: 10,
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
});

// con.connect(function (err) {
//     if (err) throw err;
//     console.log('connected!', err)
// });


module.exports = con;