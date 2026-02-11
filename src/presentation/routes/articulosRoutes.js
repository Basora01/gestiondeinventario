const express = require('express');
const router = express.Router();
const articulosCasos = require('../../application/use-cases/articulosCasos');
const tiposInventarioCasos = require('../../application/use-cases/tiposInventarioCasos');

// Listar artículos
router.get('/', async (req, res, next) => {
    try {
        const filtro = req.query.busqueda || '';
        const articulos = await articulosCasos.listar(filtro);
        res.render('articulos/listar', {
            titulo: 'Artículos',
            paginaActual: 'articulos',
            articulos,
            filtro,
            mensaje: req.query.mensaje || null,
            error: req.query.error || null
        });
    } catch (error) {
        next(error);
    }
});

// Formulario de creación
router.get('/crear', async (req, res, next) => {
    try {
        const tiposInventario = await tiposInventarioCasos.listarActivos();
        res.render('articulos/formulario', {
            titulo: 'Nuevo Artículo',
            paginaActual: 'articulos',
            articulo: {},
            tiposInventario,
            esEdicion: false,
            error: null
        });
    } catch (error) {
        next(error);
    }
});

// Guardar nuevo artículo
router.post('/crear', async (req, res, next) => {
    try {
        await articulosCasos.crear(req.body);
        res.redirect('/articulos?mensaje=Artículo creado exitosamente.');
    } catch (error) {
        const tiposInventario = await tiposInventarioCasos.listarActivos();
        res.render('articulos/formulario', {
            titulo: 'Nuevo Artículo',
            paginaActual: 'articulos',
            articulo: req.body,
            tiposInventario,
            esEdicion: false,
            error: error.message
        });
    }
});

// Formulario de edición
router.get('/editar/:id', async (req, res, next) => {
    try {
        const articulo = await articulosCasos.obtenerPorId(req.params.id);
        const tiposInventario = await tiposInventarioCasos.listarActivos();
        res.render('articulos/formulario', {
            titulo: 'Editar Artículo',
            paginaActual: 'articulos',
            articulo,
            tiposInventario,
            esEdicion: true,
            error: null
        });
    } catch (error) {
        next(error);
    }
});

// Guardar edición
router.post('/editar/:id', async (req, res, next) => {
    try {
        await articulosCasos.actualizar(req.params.id, req.body);
        res.redirect('/articulos?mensaje=Artículo actualizado exitosamente.');
    } catch (error) {
        const tiposInventario = await tiposInventarioCasos.listarActivos();
        res.render('articulos/formulario', {
            titulo: 'Editar Artículo',
            paginaActual: 'articulos',
            articulo: { id: req.params.id, ...req.body },
            tiposInventario,
            esEdicion: true,
            error: error.message
        });
    }
});

module.exports = router;
