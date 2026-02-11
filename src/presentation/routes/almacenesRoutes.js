const express = require('express');
const router = express.Router();
const almacenesCasos = require('../../application/use-cases/almacenesCasos');

// Listar almacenes
router.get('/', async (req, res, next) => {
    try {
        const filtro = req.query.busqueda || '';
        const almacenes = await almacenesCasos.listar(filtro);
        res.render('almacenes/listar', {
            titulo: 'Almacenes',
            paginaActual: 'almacenes',
            almacenes,
            filtro,
            mensaje: req.query.mensaje || null,
            error: req.query.error || null
        });
    } catch (error) {
        next(error);
    }
});

// Formulario de creación
router.get('/crear', (req, res) => {
    res.render('almacenes/formulario', {
        titulo: 'Nuevo Almacén',
        paginaActual: 'almacenes',
        almacen: {},
        esEdicion: false,
        error: null
    });
});

// Guardar nuevo almacén
router.post('/crear', async (req, res, next) => {
    try {
        await almacenesCasos.crear(req.body);
        res.redirect('/almacenes?mensaje=Almacén creado exitosamente.');
    } catch (error) {
        res.render('almacenes/formulario', {
            titulo: 'Nuevo Almacén',
            paginaActual: 'almacenes',
            almacen: req.body,
            esEdicion: false,
            error: error.message
        });
    }
});

// Formulario de edición
router.get('/editar/:id', async (req, res, next) => {
    try {
        const almacen = await almacenesCasos.obtenerPorId(req.params.id);
        res.render('almacenes/formulario', {
            titulo: 'Editar Almacén',
            paginaActual: 'almacenes',
            almacen,
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
        await almacenesCasos.actualizar(req.params.id, req.body);
        res.redirect('/almacenes?mensaje=Almacén actualizado exitosamente.');
    } catch (error) {
        res.render('almacenes/formulario', {
            titulo: 'Editar Almacén',
            paginaActual: 'almacenes',
            almacen: { id: req.params.id, ...req.body },
            esEdicion: true,
            error: error.message
        });
    }
});

module.exports = router;
