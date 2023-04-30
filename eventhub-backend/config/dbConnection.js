const mysql = require("mysql");


var mysqlConnection = mysql.createConnection({
    host: process.env.MYSQL_HOST,
    user: "admin",
    password: process.env.dbPassword,
    database: "eventhub",
    multipleStatements: true
});

mysqlConnection.connect((err) => {
    if (!err) {
        console.log("Connected to MySQL Database");
    } else {
        console.log("Error while connecting to database", err);
    }
});

module.exports = mysqlConnection;