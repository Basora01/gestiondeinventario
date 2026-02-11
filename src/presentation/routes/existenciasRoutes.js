const express = require('express');
const router = express.Router();
const existenciasCasos = require('../../application/use-cases/existenciasCasos');
const articulosCasos = require('../../application/use-cases/articulosCasos');
const almacenesCasos = require('../../application/use-cases/almacenesCasos');

// Listar existencias por almacén
router.get('/', async (req, res, next) => {
    try {
        const filtros = {
            almacen_id: req.query.almacen_id || '',
            articulo_id: req.query.articulo_id || '',
            busqueda: req.query.busqueda || ''
        };
        const existencias = await existenciasCasos.listar(filtros);
        const almacenes = await almacenesCasos.listarActivos();
        const articulos = await articulosCasos.listarActivos();
        res.render('existencias/listar', {
            titulo: 'Existencias por Almacén',
            paginaActual: 'existencias',
            existencias,
            almacenes,
            articulos,
            filtros,
            mensaje: req.query.mensaje || null,
            error: req.query.error || null
        });
    } catch (error) {
        next(error);
    }
});

// Formulario para ajustar manualmente (admin)
router.get('/editar', async (req, res, next) => {
    try {
        const almacenes = await almacenesCasos.listarActivos();
        const articulos = await articulosCasos.listarActivos();
        let existencia = {};
        if (req.query.almacen_id && req.query.articulo_id) {
            try {
                existencia = await existenciasCasos.obtener(req.query.almacen_id, req.query.articulo_id);
            } catch (_) {
                existencia = { almacen_id: req.query.almacen_id, articulo_id: req.query.articulo_id, cantidad: 0 };
            }
        }
        res.render('existencias/formulario', {
            titulo: 'Editar Existencia',
            paginaActual: 'existencias',
            existencia,
            almacenes,
            articulos,
            error: null
        });
    } catch (error) {
        next(error);
    }
});

// Guardar existencia (admin)
router.post('/editar', async (req, res, next) => {
    try {
        await existenciasCasos.crearOActualizar({
            almacen_id: parseInt(req.body.almacen_id),
            articulo_id: parseInt(req.body.articulo_id),
            cantidad: parseFloat(req.body.cantidad)
        });
        res.redirect('/existencias?mensaje=Existencia actualizada exitosamente.');
    } catch (error) {
        const almacenes = await almacenesCasos.listarActivos();
        const articulos = await articulosCasos.listarActivos();
        res.render('existencias/formulario', {
            titulo: 'Editar Existencia',
            paginaActual: 'existencias',
            existencia: req.body,
            almacenes,
            articulos,
            error: error.message
        });
    }
});

// Eliminar existencia
router.post('/eliminar', async (req, res) => {
    try {
        await existenciasCasos.eliminar(parseInt(req.body.almacen_id), parseInt(req.body.articulo_id));
        res.redirect('/existencias?mensaje=Existencia eliminada exitosamente.');
    } catch (error) {
        res.redirect('/existencias?error=' + encodeURIComponent(error.message));
    }
});

module.exports = router;
