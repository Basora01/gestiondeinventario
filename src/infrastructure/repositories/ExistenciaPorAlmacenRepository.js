const { ejecutarConsulta } = require('../config/database');

/**
 * Repositorio para Existencias por Almacén (PostgreSQL).
 */
class ExistenciaPorAlmacenRepository {
    async listar(filtros = {}) {
        let sql = `SELECT epa.*, 
                      a.descripcion AS articulo_descripcion,
                      alm.descripcion AS almacen_descripcion
               FROM existencias_por_almacen epa
               JOIN articulos a ON epa.articulo_id = a.id
               JOIN almacenes alm ON epa.almacen_id = alm.id`;
        const condiciones = [];
        const params = [];
        let paramIndex = 1;

        if (filtros.almacen_id) {
            condiciones.push(`epa.almacen_id = $${paramIndex++}`);
            params.push(filtros.almacen_id);
        }
        if (filtros.articulo_id) {
            condiciones.push(`epa.articulo_id = $${paramIndex++}`);
            params.push(filtros.articulo_id);
        }
        if (filtros.busqueda) {
            condiciones.push(`(a.descripcion ILIKE $${paramIndex} OR alm.descripcion ILIKE $${paramIndex++})`);
            params.push(`%${filtros.busqueda}%`);
        }

        if (condiciones.length > 0) {
            sql += ' WHERE ' + condiciones.join(' AND ');
        }
        sql += ' ORDER BY alm.descripcion, a.descripcion';
        return ejecutarConsulta(sql, params);
    }

    async obtener(almacenId, articuloId) {
        const sql = `SELECT epa.*, 
                        a.descripcion AS articulo_descripcion,
                        alm.descripcion AS almacen_descripcion
                 FROM existencias_por_almacen epa
                 JOIN articulos a ON epa.articulo_id = a.id
                 JOIN almacenes alm ON epa.almacen_id = alm.id
                 WHERE epa.almacen_id = $1 AND epa.articulo_id = $2`;
        const rows = await ejecutarConsulta(sql, [almacenId, articuloId]);
        return rows[0] || null;
    }

    async crearOActualizar(datos) {
        // Upsert en Postgres: ON CONFLICT ... DO UPDATE
        const sql = `INSERT INTO existencias_por_almacen (almacen_id, articulo_id, cantidad)
                 VALUES ($1, $2, $3)
                 ON CONFLICT (almacen_id, articulo_id) 
                 DO UPDATE SET cantidad = $3`;
        await ejecutarConsulta(sql, [datos.almacen_id, datos.articulo_id, datos.cantidad]);
    }

    async eliminar(almacenId, articuloId) {
        const sql = 'DELETE FROM existencias_por_almacen WHERE almacen_id = $1 AND articulo_id = $2 RETURNING almacen_id';
        const rows = await ejecutarConsulta(sql, [almacenId, articuloId]);
        return rows.length > 0;
    }

    /** Métodos con conexión transaccional */
    async obtenerConConexion(client, almacenId, articuloId) {
        const res = await client.query(
            'SELECT * FROM existencias_por_almacen WHERE almacen_id = $1 AND articulo_id = $2',
            [almacenId, articuloId]
        );
        return res.rows[0] || null;
    }

    async crearOActualizarConConexion(client, almacenId, articuloId, cantidad) {
        const sql = `INSERT INTO existencias_por_almacen (almacen_id, articulo_id, cantidad)
                 VALUES ($1, $2, $3)
                 ON CONFLICT (almacen_id, articulo_id) 
                 DO UPDATE SET cantidad = $3`;
        await client.query(sql, [almacenId, articuloId, cantidad]);
    }
}

module.exports = ExistenciaPorAlmacenRepository;
