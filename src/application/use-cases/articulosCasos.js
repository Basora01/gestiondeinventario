const ArticuloRepository = require('../../infrastructure/repositories/ArticuloRepository');
const Articulo = require('../../domain/entities/Articulo');

const repo = new ArticuloRepository();

/**
 * Casos de uso para Artículos.
 */
module.exports = {
    async listar(filtro = '') {
        return repo.listar(filtro);
    },

    async obtenerPorId(id) {
        const articulo = await repo.obtenerPorId(id);
        if (!articulo) throw new Error('Artículo no encontrado.');
        return articulo;
    },

    async crear(datos) {
        const entidad = new Articulo(datos);
        const errores = entidad.validar();
        if (errores.length > 0) throw new Error(errores.join(' '));
        return repo.crear(datos);
    },

    async actualizar(id, datos) {
        const existente = await repo.obtenerPorId(id);
        if (!existente) throw new Error('Artículo no encontrado.');
        const entidad = new Articulo({ ...existente, ...datos });
        const errores = entidad.validar();
        if (errores.length > 0) throw new Error(errores.join(' '));
        return repo.actualizar(id, datos);
    },

    async listarActivos() {
        return repo.listarActivos();
    }
};
