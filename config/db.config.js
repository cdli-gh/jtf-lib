var mysql = require('mysql');
// Initialize pool
var pool  = mysql.createPool({
    connectionLimit : 10,
    host     : 'mariadb',
    user     : 'root',
    port     :  3306,
    password : '',
    database : 'cdli_db',
    debug    :  false
});    

pool.query("SELECT * FROM roles",(err, data) => {
    if(err) {
        console.error(err);
        return;
    }
    // rows fetch
    console.log(data);
});

module.exports = pool;