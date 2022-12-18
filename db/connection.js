const mysql = require('mysql2');

const connection = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "family1225", // !remove password later
    database: "employees_db"
});

// connection.connect(function(err) {
//     if (err) throw err;
// });

module.exports = connection;