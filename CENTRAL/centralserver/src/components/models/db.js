const mysql = require('mysql2');

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'mightyfight',
    password: 'estrella9juju',
    database: 'loginbase'
});

module.exports = connection;