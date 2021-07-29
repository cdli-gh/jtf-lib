var mysql = require('mysql');

// Initialize pool
var pool  = mysql.createPool({
    connectionLimit : 10,
    host     : '127.0.01',
    user     : 'root',
    port     :  23306,
    password :  '',
    database : 'cdli_db',
    debug    :  false
});    

module.exports = pool;