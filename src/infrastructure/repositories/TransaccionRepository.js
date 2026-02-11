const { ejecutarConsulta } = require('../config/database');

/**
 * Repositorio para Transacciones de Inventario (PostgreSQL).
 */
class TransaccionRepository {
    async listar(filtros = {}) {
        let sql = `SELECT t.*,
                      a.descripcion AS articulo_descripcion,
                      alm.descripcion AS almacen_descripcion
               FROM transacciones t
               JOIN articulos a ON t.articulo_id = a.id
               JOIN almacenes alm ON t.almacen_id = alm.id`;
        const condiciones = [];
        const params = [];
        let paramIndex = 1;

        if (filtros.tipo) {
            condiciones.push(`t.tipo = $${paramIndex++}`);
            params.push(filtros.tipo);
        }
        if (filtros.articulo_id) {
            condiciones.push(`t.articulo_id = $${paramIndex++}`);
            params.push(filtros.articulo_id);
        }
        if (filtros.almacen_id) {
            condiciones.push(`t.almacen_id = $${paramIndex++}`);
            params.push(filtros.almacen_id);
        }
        if (filtros.fecha_desde) {
            condiciones.push(`t.fecha >= $${paramIndex++}`);
            params.push(filtros.fecha_desde);
        }
        if (filtros.fecha_hasta) {
            condiciones.push(`t.fecha <= $${paramIndex++}`);
            params.push(filtros.fecha_hasta);
        }

        if (condiciones.length > 0) {
            sql += ' WHERE ' + condiciones.join(' AND ');
        }
        sql += ' ORDER BY t.creado_en DESC, t.id DESC';
        return ejecutarConsulta(sql, params);
    }

    async obtenerPorId(id) {
        const sql = `SELECT t.*,
                        a.descripcion AS articulo_descripcion,
                        alm.descripcion AS almacen_descripcion
                 FROM transacciones t
                 JOIN articulos a ON t.articulo_id = a.id
                 JOIN almacenes alm ON t.almacen_id = alm.id
                 WHERE t.id = $1`;
        const rows = await ejecutarConsulta(sql, [id]);
        return rows[0] || null;
    }

    async eliminar(id) {
        const sql = 'DELETE FROM transacciones WHERE id = $1 RETURNING id';
        const rows = await ejecutarConsulta(sql, [id]);
        return rows.length > 0;
    }

    async crearConConexion(client, datos) {
        const sql = `INSERT INTO transacciones (tipo, articulo_id, almacen_id, fecha, cantidad, monto)
                 VALUES ($1, $2, $3, $4, $5, $6) RETURNING id`;
        const res = await client.query(sql, [
            datos.tipo,
            datos.articulo_id,
            datos.almacen_id,
            datos.fecha,
            datos.cantidad,
            datos.monto
        ]);
        return res.rows[0].id;
    }
}

module.exports = TransaccionRepository;
