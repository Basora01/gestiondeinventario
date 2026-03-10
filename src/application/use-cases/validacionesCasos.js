const ArticuloRepository = require('../../infrastructure/repositories/ArticuloRepository');
const TipoInventarioRepository = require('../../infrastructure/repositories/TipoInventarioRepository');
const AlmacenRepository = require('../../infrastructure/repositories/AlmacenRepository');
const ExistenciaPorAlmacenRepository = require('../../infrastructure/repositories/ExistenciaPorAlmacenRepository');
const TransaccionRepository = require('../../infrastructure/repositories/TransaccionRepository');

const Articulo = require('../../domain/entities/Articulo');
const TipoInventario = require('../../domain/entities/TipoInventario');
const Almacen = require('../../domain/entities/Almacen');
const ExistenciaPorAlmacen = require('../../domain/entities/ExistenciaPorAlmacen');
const Transaccion = require('../../domain/entities/Transaccion');

const articuloRepo = new ArticuloRepository();
const tipoRepo = new TipoInventarioRepository();
const almacenRepo = new AlmacenRepository();
const existenciaRepo = new ExistenciaPorAlmacenRepository();
const transaccionRepo = new TransaccionRepository();

/**
 * Ejecuta validaciones sobre todos los registros de la BD.
 */
module.exports = {
    async validarTodos() {
        const resultados = [];

        // ---- Tipos de Inventario ----
        const tipos = await tipoRepo.listar('');
        const tiposValidos = [];
        const tiposErrores = [];
        const tipoIds = new Set(tipos.map(t => t.id));
        for (const t of tipos) {
            const entidad = new TipoInventario(t);
            const errores = entidad.validar();
            if (errores.length > 0) {
                tiposErrores.push({ id: t.id, descripcion: t.descripcion, errores });
            } else {
                tiposValidos.push(t.id);
            }
        }
        resultados.push({
            modulo: 'Tipos de Inventario',
            icono: '🏷️',
            total: tipos.length,
            validos: tiposValidos.length,
            invalidos: tiposErrores.length,
            errores: tiposErrores,
            campos: ['descripcion', 'estado']
        });

        // ---- Artículos ----
        const articulos = await articuloRepo.listar('');
        const artValidos = [];
        const artErrores = [];
        for (const a of articulos) {
            const entidad = new Articulo(a);
            const errores = entidad.validar();
            // Verificar FK
            if (a.tipo_inventario_id && !tipoIds.has(a.tipo_inventario_id)) {
                errores.push('Tipo de inventario referenciado no existe (ID: ' + a.tipo_inventario_id + ').');
            }
            if (errores.length > 0) {
                artErrores.push({ id: a.id, descripcion: a.descripcion, errores });
            } else {
                artValidos.push(a.id);
            }
        }
        resultados.push({
            modulo: 'Artículos',
            icono: '📋',
            total: articulos.length,
            validos: artValidos.length,
            invalidos: artErrores.length,
            errores: artErrores,
            campos: ['descripcion', 'tipo_inventario_id', 'costo_unitario', 'estado']
        });

        // ---- Almacenes ----
        const almacenes = await almacenRepo.listar('');
        const almValidos = [];
        const almErrores = [];
        const almacenIds = new Set(almacenes.map(a => a.id));
        for (const a of almacenes) {
            const entidad = new Almacen(a);
            const errores = entidad.validar();
            if (errores.length > 0) {
                almErrores.push({ id: a.id, descripcion: a.descripcion, errores });
            } else {
                almValidos.push(a.id);
            }
        }
        resultados.push({
            modulo: 'Almacenes',
            icono: '🏭',
            total: almacenes.length,
            validos: almValidos.length,
            invalidos: almErrores.length,
            errores: almErrores,
            campos: ['descripcion', 'estado']
        });

        // ---- Existencias ----
        const existencias = await existenciaRepo.listar({});
        const exValidos = [];
        const exErrores = [];
        const articuloIds = new Set(articulos.map(a => a.id));
        for (const e of existencias) {
            const entidad = new ExistenciaPorAlmacen(e);
            const errores = entidad.validar();
            if (e.almacen_id && !almacenIds.has(e.almacen_id)) {
                errores.push('Almacén referenciado no existe (ID: ' + e.almacen_id + ').');
            }
            if (e.articulo_id && !articuloIds.has(e.articulo_id)) {
                errores.push('Artículo referenciado no existe (ID: ' + e.articulo_id + ').');
            }
            if (errores.length > 0) {
                exErrores.push({ id: e.almacen_id + '-' + e.articulo_id, descripcion: (e.almacen_descripcion || 'Alm ' + e.almacen_id) + ' / ' + (e.articulo_descripcion || 'Art ' + e.articulo_id), errores });
            } else {
                exValidos.push(true);
            }
        }
        resultados.push({
            modulo: 'Existencias',
            icono: '📊',
            total: existencias.length,
            validos: exValidos.length,
            invalidos: exErrores.length,
            errores: exErrores,
            campos: ['almacen_id', 'articulo_id', 'cantidad']
        });

        // ---- Transacciones ----
        const transacciones = await transaccionRepo.listar({});
        const trValidos = [];
        const trErrores = [];
        for (const t of transacciones) {
            const entidad = new Transaccion(t);
            const errores = entidad.validar();
            if (t.articulo_id && !articuloIds.has(t.articulo_id)) {
                errores.push('Artículo referenciado no existe (ID: ' + t.articulo_id + ').');
            }
            if (t.almacen_id && !almacenIds.has(t.almacen_id)) {
                errores.push('Almacén referenciado no existe (ID: ' + t.almacen_id + ').');
            }
            if (errores.length > 0) {
                trErrores.push({ id: t.id, descripcion: t.tipo + ' #' + t.id, errores });
            } else {
                trValidos.push(t.id);
            }
        }
        resultados.push({
            modulo: 'Transacciones',
            icono: '🔄',
            total: transacciones.length,
            validos: trValidos.length,
            invalidos: trErrores.length,
            errores: trErrores,
            campos: ['tipo', 'articulo_id', 'almacen_id', 'fecha', 'cantidad', 'monto']
        });

        return resultados;
    }
};
