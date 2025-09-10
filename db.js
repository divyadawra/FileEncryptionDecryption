    const mysql = require('mysql2');

    const connection = mysql.createConnection({
        host: 'localhost', // Your database host
        user: 'root', // Your database username
        password: 'admin1234', // Your database password
        database: 'FileEncryption' // The name of your database
    });

    connection.connect((err) => {
        if (err) {
            console.error('Error connecting to database: ' + err.stack);
            return;
        }
        console.log('Connected to database as id ' + connection.threadId);
    });

    module.exports = connection;