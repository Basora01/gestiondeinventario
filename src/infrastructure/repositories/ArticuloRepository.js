const { ejecutarConsulta } = require('../config/database');

/**
 * Repositorio para la entidad Artículo (PostgreSQL).
 */
class ArticuloRepository {
    async listar(filtroOrObj = '') {
        let sql = `SELECT a.*, ti.descripcion AS tipo_inventario_descripcion
               FROM articulos a
               LEFT JOIN tipos_inventario ti ON a.tipo_inventario_id = ti.id`;
        const conditions = [];
        const params = [];
        let idx = 1;

        // Support both old string format and new object format
        const filtros = typeof filtroOrObj === 'string' ? { busqueda: filtroOrObj } : filtroOrObj;

        if (filtros.busqueda) {
            conditions.push(`a.descripcion ILIKE $${idx}`);
            params.push(`%${filtros.busqueda}%`);
            idx++;
        }
        if (filtros.estado) {
            conditions.push(`a.estado = $${idx}`);
            params.push(filtros.estado);
            idx++;
        }
        if (filtros.tipo_inventario_id) {
            conditions.push(`a.tipo_inventario_id = $${idx}`);
            params.push(filtros.tipo_inventario_id);
            idx++;
        }

        if (conditions.length > 0) {
            sql += ' WHERE ' + conditions.join(' AND ');
        }
        sql += ' ORDER BY a.id DESC';
        return ejecutarConsulta(sql, params);
    }

    async obtenerPorId(id) {
        const sql = `SELECT a.*, ti.descripcion AS tipo_inventario_descripcion
                 FROM articulos a
                 LEFT JOIN tipos_inventario ti ON a.tipo_inventario_id = ti.id
                 WHERE a.id = $1`;
        const rows = await ejecutarConsulta(sql, [id]);
        return rows[0] || null;
    }

    async crear(datos) {
        const sql = `INSERT INTO articulos (descripcion, tipo_inventario_id, costo_unitario, estado, existencia_total)
                 VALUES ($1, $2, $3, $4, $5) RETURNING id`;
        const rows = await ejecutarConsulta(sql, [
            datos.descripcion,
            datos.tipo_inventario_id,
            datos.costo_unitario,
            datos.estado,
            datos.existencia_total || 0
        ]);
        return rows[0].id;
    }

    async actualizar(id, datos) {
        const sql = `UPDATE articulos SET descripcion = $1, tipo_inventario_id = $2, costo_unitario = $3, estado = $4 WHERE id = $5 RETURNING id`;
        const rows = await ejecutarConsulta(sql, [
            datos.descripcion,
            datos.tipo_inventario_id,
            datos.costo_unitario,
            datos.estado,
            id
        ]);
        return rows.length > 0;
    }

    // Método transaccional (recibe cliente 'conexion')
    async actualizarExistenciaTotal(client, articuloId, nuevaExistencia) {
        const sql = 'UPDATE articulos SET existencia_total = $1 WHERE id = $2';
        await client.query(sql, [nuevaExistencia, articuloId]);
    }

    // Método transaccional
    async obtenerPorIdConConexion(client, id) {
        const res = await client.query('SELECT * FROM articulos WHERE id = $1', [id]);
        return res.rows[0] || null;
    }

    async eliminar(id) {
        const sql = 'DELETE FROM articulos WHERE id = $1 RETURNING id';
        const rows = await ejecutarConsulta(sql, [id]);
        return rows.length > 0;
    }

    async listarActivos() {
        return ejecutarConsulta("SELECT * FROM articulos WHERE estado = 'Activo' ORDER BY descripcion");
    }
}

module.exports = ArticuloRepository;
