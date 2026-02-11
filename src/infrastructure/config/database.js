const { Pool } = require('pg');
require('dotenv').config();

/**
 * Configuración y pool de conexiones PostgreSQL (Supabase).
 * Usa variables de entorno definidas en .env
 */
let pool = null;

function obtenerPool() {
    if (!pool) {
        const connectionString = process.env.DATABASE_URL;

        // Configuración para Supabase (requiere SSL)
        const config = {
            connectionString,
            ssl: {
                rejectUnauthorized: false
            },
            max: 10,
            idleTimeoutMillis: 30000,
            connectionTimeoutMillis: 5000,
        };

        pool = new Pool(config);

        pool.on('error', (err, client) => {
            console.error('Error inesperado en cliente idle de PostgreSQL', err);
            // No salir del proceso, dejar que el pool maneje la reconexión
        });
    }
    return pool;
}

/**
 * Obtiene un cliente del pool (para transacciones manuales).
 * IMPORTANTE: El que llama debe invocar `client.release()` al terminar.
 * @returns {Promise<import('pg').PoolClient>}
 */
async function obtenerConexion() {
    return obtenerPool().connect();
}

/**
 * Ejecuta una consulta simple contra el pool.
 * @param {string} sql
 * @param {any[]} params
 * @returns {Promise<any[]>} Retorna las filas (rows)
 */
async function ejecutarConsulta(sql, params = []) {
    const result = await obtenerPool().query(sql, params);
    return result.rows;
}

/**
 * Cierra el pool de conexiones (para shutdown limpio).
 */
async function cerrarPool() {
    if (pool) {
        await pool.end();
        pool = null;
    }
}

module.exports = { obtenerPool, obtenerConexion, ejecutarConsulta, cerrarPool };
