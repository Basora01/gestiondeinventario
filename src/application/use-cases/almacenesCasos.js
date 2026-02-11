const AlmacenRepository = require('../../infrastructure/repositories/AlmacenRepository');
const Almacen = require('../../domain/entities/Almacen');

const repo = new AlmacenRepository();

/**
 * Casos de uso para Almacenes.
 */
module.exports = {
    async listar(filtro = '') {
        return repo.listar(filtro);
    },

    async obtenerPorId(id) {
        const almacen = await repo.obtenerPorId(id);
        if (!almacen) throw new Error('Almacén no encontrado.');
        return almacen;
    },

    async crear(datos) {
        const entidad = new Almacen(datos);
        const errores = entidad.validar();
        if (errores.length > 0) throw new Error(errores.join(' '));
        return repo.crear(datos);
    },

    async actualizar(id, datos) {
        const existente = await repo.obtenerPorId(id);
        if (!existente) throw new Error('Almacén no encontrado.');
        const entidad = new Almacen({ ...existente, ...datos });
        const errores = entidad.validar();
        if (errores.length > 0) throw new Error(errores.join(' '));
        return repo.actualizar(id, datos);
    },

    async listarActivos() {
        return repo.listarActivos();
    }
};
