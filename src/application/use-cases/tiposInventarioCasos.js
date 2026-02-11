const TipoInventarioRepository = require('../../infrastructure/repositories/TipoInventarioRepository');
const TipoInventario = require('../../domain/entities/TipoInventario');

const repo = new TipoInventarioRepository();

/**
 * Casos de uso para Tipos de Inventario.
 */
module.exports = {
    async listar(filtro = '') {
        return repo.listar(filtro);
    },

    async obtenerPorId(id) {
        const tipo = await repo.obtenerPorId(id);
        if (!tipo) throw new Error('Tipo de inventario no encontrado.');
        return tipo;
    },

    async crear(datos) {
        const entidad = new TipoInventario(datos);
        const errores = entidad.validar();
        if (errores.length > 0) throw new Error(errores.join(' '));
        return repo.crear(datos);
    },

    async actualizar(id, datos) {
        const existente = await repo.obtenerPorId(id);
        if (!existente) throw new Error('Tipo de inventario no encontrado.');
        const entidad = new TipoInventario({ ...existente, ...datos });
        const errores = entidad.validar();
        if (errores.length > 0) throw new Error(errores.join(' '));
        return repo.actualizar(id, datos);
    },

    async listarActivos() {
        return repo.listarActivos();
    }
};
