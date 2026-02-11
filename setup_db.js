const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

async function setupDatabase() {
    console.log('🔌 Conectando a Supabase...');

    const pool = new Pool({
        connectionString: process.env.DATABASE_URL,
        ssl: { rejectUnauthorized: false }
    });

    try {
        const client = await pool.connect();
        console.log('✅ Conexión exitosa.');

        console.log('📖 Leyendo script de esquema...');
        const schemaPath = path.join(__dirname, 'sql', '003_schema_postgres.sql');
        const sql = fs.readFileSync(schemaPath, 'utf8');

        console.log('🚀 Ejecutando script SQL...');
        await client.query(sql);

        console.log('✅ Esquema y datos semilla creados correctamente.');
        client.release();
    } catch (err) {
        console.error('❌ Error:', err.message);
    } finally {
        await pool.end();
    }
}

setupDatabase();
