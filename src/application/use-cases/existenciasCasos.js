const ExistenciaPorAlmacenRepository = require('../../infrastructure/repositories/ExistenciaPorAlmacenRepository');
const ExistenciaPorAlmacen = require('../../domain/entities/ExistenciaPorAlmacen');

const repo = new ExistenciaPorAlmacenRepository();

/**
 * Casos de uso para Existencias por Almacén.
 */
module.exports = {
    async listar(filtros = {}) {
        return repo.listar(filtros);
    },

    async obtener(almacenId, articuloId) {
        const existencia = await repo.obtener(almacenId, articuloId);
        if (!existencia) throw new Error('Existencia no encontrada para ese almacén y artículo.');
        return existencia;
    },

    async crearOActualizar(datos) {
        const entidad = new ExistenciaPorAlmacen(datos);
        const errores = entidad.validar();
        if (errores.length > 0) throw new Error(errores.join(' '));
        return repo.crearOActualizar(datos);
    },

    async eliminar(almacenId, articuloId) {
        return repo.eliminar(almacenId, articuloId);
    }
};
