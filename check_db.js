const mysql = require('mysql2/promise');
require('dotenv').config();

async function checkConnection() {
    try {
        const connection = await mysql.createConnection({
            host: process.env.DB_HOST,
            port: process.env.DB_PORT,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
        });
        console.log('Successfully connected to MySQL!');
        await connection.end();
        process.exit(0);
    } catch (error) {
        console.error('Error connecting to MySQL:', error.message);
        process.exit(1);
    }
}

checkConnection();
