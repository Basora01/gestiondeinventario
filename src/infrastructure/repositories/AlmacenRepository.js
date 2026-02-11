const { ejecutarConsulta } = require('../config/database');

/**
 * Repositorio para la entidad Almacén (PostgreSQL).
 */
class AlmacenRepository {
    async listar(filtro = '') {
        let sql = 'SELECT * FROM almacenes';
        const params = [];
        if (filtro) {
            sql += ' WHERE descripcion ILIKE $1';
            params.push(`%${filtro}%`);
        }
        sql += ' ORDER BY id DESC';
        return ejecutarConsulta(sql, params);
    }

    async obtenerPorId(id) {
        const rows = await ejecutarConsulta('SELECT * FROM almacenes WHERE id = $1', [id]);
        return rows[0] || null;
    }

    async crear(datos) {
        const sql = 'INSERT INTO almacenes (descripcion, estado) VALUES ($1, $2) RETURNING id';
        const rows = await ejecutarConsulta(sql, [datos.descripcion, datos.estado]);
        return rows[0].id;
    }

    async actualizar(id, datos) {
        const sql = 'UPDATE almacenes SET descripcion = $1, estado = $2 WHERE id = $3 RETURNING id';
        const rows = await ejecutarConsulta(sql, [datos.descripcion, datos.estado, id]);
        return rows.length > 0;
    }

    async eliminar(id) {
        const sql = 'DELETE FROM almacenes WHERE id = $1 RETURNING id';
        const rows = await ejecutarConsulta(sql, [id]);
        return rows.length > 0;
    }

    // Método transaccional
    async obtenerPorIdConConexion(client, id) {
        const res = await client.query('SELECT * FROM almacenes WHERE id = $1', [id]);
        return res.rows[0] || null;
    }

    async listarActivos() {
        return ejecutarConsulta("SELECT * FROM almacenes WHERE estado = 'Activo' ORDER BY descripcion");
    }
}

module.exports = AlmacenRepository;
