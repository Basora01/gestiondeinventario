const express = require('express');
const router = express.Router();
const transaccionesCasos = require('../../application/use-cases/transaccionesCasos');
const articulosCasos = require('../../application/use-cases/articulosCasos');
const almacenesCasos = require('../../application/use-cases/almacenesCasos');
const TipoTransaccion = require('../../domain/enums/TipoTransaccion');

// Listar transacciones con filtros
router.get('/', async (req, res, next) => {
    try {
        const filtros = {
            tipo: req.query.tipo || '',
            articulo_id: req.query.articulo_id || '',
            almacen_id: req.query.almacen_id || '',
            fecha_desde: req.query.fecha_desde || '',
            fecha_hasta: req.query.fecha_hasta || ''
        };
        const transacciones = await transaccionesCasos.listar(filtros);
        const articulos = await articulosCasos.listarActivos();
        const almacenes = await almacenesCasos.listarActivos();

        res.render('transacciones/listar', {
            titulo: 'Transacciones',
            paginaActual: 'transacciones',
            transacciones,
            articulos,
            almacenes,
            tiposTransaccion: TipoTransaccion.valores(),
            filtros,
            mensaje: req.query.mensaje || null,
            error: req.query.error || null
        });
    } catch (error) {
        next(error);
    }
});

// Formulario para registrar transacción
router.get('/crear', async (req, res, next) => {
    try {
        const articulos = await articulosCasos.listarActivos();
        const almacenes = await almacenesCasos.listarActivos();
        const hoy = new Date().toISOString().split('T')[0];
        res.render('transacciones/formulario', {
            titulo: 'Registrar Transacción',
            paginaActual: 'transacciones',
            transaccion: { fecha: hoy },
            articulos,
            almacenes,
            tiposTransaccion: TipoTransaccion.valores(),
            error: null
        });
    } catch (error) {
        next(error);
    }
});

// Guardar transacción
router.post('/crear', async (req, res, next) => {
    try {
        await transaccionesCasos.registrar({
            tipo: req.body.tipo,
            articulo_id: parseInt(req.body.articulo_id),
            almacen_id: parseInt(req.body.almacen_id),
            fecha: req.body.fecha,
            cantidad: parseFloat(req.body.cantidad),
            monto: parseFloat(req.body.monto || 0)
        });
        res.redirect('/transacciones?mensaje=Transacción registrada exitosamente.');
    } catch (error) {
        const articulos = await articulosCasos.listarActivos();
        const almacenes = await almacenesCasos.listarActivos();
        res.render('transacciones/formulario', {
            titulo: 'Registrar Transacción',
            paginaActual: 'transacciones',
            transaccion: req.body,
            articulos,
            almacenes,
            tiposTransaccion: TipoTransaccion.valores(),
            error: error.message
        });
    }
});

// Ver detalle de transacción
router.get('/:id', async (req, res, next) => {
    try {
        const transaccion = await transaccionesCasos.obtenerPorId(req.params.id);
        res.render('transacciones/detalle', {
            titulo: 'Detalle de Transacción',
            paginaActual: 'transacciones',
            transaccion
        });
    } catch (error) {
        next(error);
    }
});

module.exports = router;
