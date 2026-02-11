const mysql = require('mysql2/promise');
require('dotenv').config();

async function checkConnection() {
    const passwords = ['', 'password', 'admin', '123456'];

    for (const password of passwords) {
        try {
            console.log(`Trying password: '${password}'...`);
            const connection = await mysql.createConnection({
                host: process.env.DB_HOST || 'localhost',
                port: process.env.DB_PORT || 3306,
                user: 'root',
                password: password
            });
            console.log(`SUCCESS! Connected with password: '${password}'`);
            await connection.end();
            process.exit(0);
        } catch (error) {
            console.log(`Failed with password '${password}': ${error.message}`);
        }
    }

    console.log('All attempts failed.');
    process.exit(1);
}

checkConnection();
