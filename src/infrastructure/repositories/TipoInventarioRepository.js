const { ejecutarConsulta } = require('../config/database');

/**
 * Repositorio para la entidad TipoInventario (PostgreSQL).
 */
class TipoInventarioRepository {
    async listar(filtro = '') {
        let sql = 'SELECT * FROM tipos_inventario';
        const params = [];
        if (filtro) {
            // ILIKE es case-insensitive en Postgres
            sql += ' WHERE descripcion ILIKE $1 OR cuenta_contable ILIKE $2';
            params.push(`%${filtro}%`, `%${filtro}%`);
        }
        sql += ' ORDER BY id DESC';
        return ejecutarConsulta(sql, params);
    }

    async obtenerPorId(id) {
        const rows = await ejecutarConsulta('SELECT * FROM tipos_inventario WHERE id = $1', [id]);
        return rows[0] || null;
    }

    async crear(datos) {
        // RETURNING id es necesario en Postgres para obtener el ID generado
        const sql = 'INSERT INTO tipos_inventario (descripcion, cuenta_contable, estado) VALUES ($1, $2, $3) RETURNING id';
        const rows = await ejecutarConsulta(sql, [datos.descripcion, datos.cuenta_contable, datos.estado]);
        return rows[0].id;
    }

    async actualizar(id, datos) {
        const sql = 'UPDATE tipos_inventario SET descripcion = $1, cuenta_contable = $2, estado = $3 WHERE id = $4';
        // pg devuelve rowCount en el resultado base, pero ejecutarConsulta devuelve rows.
        // Para saber si se actualizó, podemos usar RETURNING id o verificar después.
        // Aquí implementamos una consulta directa para obtener rowCount si fuera necesario, 
        // pero para mantener compatibilidad con la interfaz anterior, devolvemos true/false simulado o hacemos SELECT.

        // Una mejor forma con pg helper es obtener el resultado completo. 
        // Dado que ejecutarConsulta devuelve rows, usaremos 'RETURNING id' para saber si hubo match.
        const rows = await ejecutarConsulta(sql + ' RETURNING id', [datos.descripcion, datos.cuenta_contable, datos.estado, id]);
        return rows.length > 0;
    }

    async listarActivos() {
        return ejecutarConsulta("SELECT * FROM tipos_inventario WHERE estado = 'Activo' ORDER BY descripcion");
    }
}

module.exports = TipoInventarioRepository;
