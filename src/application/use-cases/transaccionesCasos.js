const { obtenerPool } = require('../../infrastructure/config/database');
const TransaccionRepository = require('../../infrastructure/repositories/TransaccionRepository');
const ArticuloRepository = require('../../infrastructure/repositories/ArticuloRepository');
const AlmacenRepository = require('../../infrastructure/repositories/AlmacenRepository');
const ExistenciaPorAlmacenRepository = require('../../infrastructure/repositories/ExistenciaPorAlmacenRepository');
const ServicioInventario = require('../../domain/services/ServicioInventario');
const Transaccion = require('../../domain/entities/Transaccion');

const transaccionRepo = new TransaccionRepository();
const articuloRepo = new ArticuloRepository();
const almacenRepo = new AlmacenRepository();
const existenciaRepo = new ExistenciaPorAlmacenRepository();
const servicioInventario = new ServicioInventario();

/**
 * Casos de uso para Transacciones (Versión PostgreSQL).
 */
module.exports = {
    async listar(filtros = {}) {
        return transaccionRepo.listar(filtros);
    },

    async obtenerPorId(id) {
        const transaccion = await transaccionRepo.obtenerPorId(id);
        if (!transaccion) throw new Error('Transacción no encontrada.');
        return transaccion;
    },

    /**
     * Registrar una nueva transacción de inventario.
     * Ejecuta en una transacción de BD (Postgres) para garantizar atomicidad.
     */
    async registrar(datos) {
        // 1. Validar datos de la transacción
        const transaccion = new Transaccion(datos);
        const errores = transaccion.validar();
        if (errores.length > 0) {
            throw new Error(errores.join(' '));
        }

        // 2. Obtener cliente del pool y comenzar transacción SQL
        const pool = obtenerPool();
        const client = await pool.connect();

        try {
            await client.query('BEGIN');

            // 3. Verificar que el artículo exista y esté activo
            const articulo = await articuloRepo.obtenerPorIdConConexion(client, transaccion.articulo_id);
            if (!articulo) {
                throw new Error('El artículo seleccionado no existe.');
            }
            if (articulo.estado !== 'Activo') {
                throw new Error('El artículo seleccionado no está activo.');
            }

            // 4. Verificar que el almacén exista y esté activo
            const almacen = await almacenRepo.obtenerPorIdConConexion(client, transaccion.almacen_id);
            if (!almacen) {
                throw new Error('El almacén seleccionado no existe.');
            }
            if (almacen.estado !== 'Activo') {
                throw new Error('El almacén seleccionado no está activo.');
            }

            // 5. Obtener existencia actual en el almacén
            const existencia = await existenciaRepo.obtenerConConexion(
                client, transaccion.almacen_id, transaccion.articulo_id
            );
            const cantidadActualAlmacen = existencia ? parseFloat(existencia.cantidad) : 0;
            const existenciaTotalArticulo = parseFloat(articulo.existencia_total);

            // 6. Aplicar lógica de dominio
            const resultado = servicioInventario.procesarTransaccion(
                transaccion.tipo,
                cantidadActualAlmacen,
                existenciaTotalArticulo,
                transaccion.cantidad
            );

            // 7. Actualizar existencia por almacén
            await existenciaRepo.crearOActualizarConConexion(
                client,
                transaccion.almacen_id,
                transaccion.articulo_id,
                resultado.nuevaCantidadAlmacen
            );

            // 8. Actualizar existencia total del artículo
            await articuloRepo.actualizarExistenciaTotal(
                client,
                transaccion.articulo_id,
                resultado.nuevaExistenciaTotal
            );

            // 9. Registrar la transacción
            const transaccionId = await transaccionRepo.crearConConexion(client, {
                tipo: transaccion.tipo,
                articulo_id: transaccion.articulo_id,
                almacen_id: transaccion.almacen_id,
                fecha: transaccion.fecha,
                cantidad: transaccion.cantidad,
                monto: transaccion.monto
            });

            // 10. Confirmar transacción SQL
            await client.query('COMMIT');

            return transaccionId;
        } catch (error) {
            await client.query('ROLLBACK');
            throw error;
        } finally {
            client.release();
        }
    }
};
