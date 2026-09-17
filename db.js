const mysql = require('mysql2');

const pool = mysql.createPool({
    host: '127.0.0.1',
    port: 3306,
    user: 'root',
    password: 'meet123',
    database: 'meeting_room',
    connectionLimit: 10,
})

module.exports = pool.promise();