const express = require('express');
const router = express.Router();
const tiposInventarioCasos = require('../../application/use-cases/tiposInventarioCasos');

// Listar tipos de inventario
router.get('/', async (req, res, next) => {
    try {
        const filtro = req.query.busqueda || '';
        const tipos = await tiposInventarioCasos.listar(filtro);
        res.render('tipos-inventario/listar', {
            titulo: 'Tipos de Inventario',
            paginaActual: 'tipos-inventario',
            tipos,
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
    res.render('tipos-inventario/formulario', {
        titulo: 'Nuevo Tipo de Inventario',
        paginaActual: 'tipos-inventario',
        tipo: {},
        esEdicion: false,
        error: null
    });
});

// Guardar nuevo tipo
router.post('/crear', async (req, res, next) => {
    try {
        await tiposInventarioCasos.crear(req.body);
        res.redirect('/tipos-inventario?mensaje=Tipo de inventario creado exitosamente.');
    } catch (error) {
        res.render('tipos-inventario/formulario', {
            titulo: 'Nuevo Tipo de Inventario',
            paginaActual: 'tipos-inventario',
            tipo: req.body,
            esEdicion: false,
            error: error.message
        });
    }
});

// Formulario de edición
router.get('/editar/:id', async (req, res, next) => {
    try {
        const tipo = await tiposInventarioCasos.obtenerPorId(req.params.id);
        res.render('tipos-inventario/formulario', {
            titulo: 'Editar Tipo de Inventario',
            paginaActual: 'tipos-inventario',
            tipo,
            esEdicion: true,
            error: null
        });
    } catch (error) {
        next(error);
    }
});

// Actualizar tipo
router.post('/editar/:id', async (req, res, next) => {
    try {
        await tiposInventarioCasos.actualizar(req.params.id, req.body);
        res.redirect('/tipos-inventario?mensaje=Tipo de inventario actualizado exitosamente.');
    } catch (error) {
        res.render('tipos-inventario/formulario', {
            titulo: 'Editar Tipo de Inventario',
            paginaActual: 'tipos-inventario',
            tipo: { id: req.params.id, ...req.body },
            esEdicion: true,
            error: error.message
        });
    }
});

// Eliminar tipo de inventario
router.post('/eliminar/:id', async (req, res) => {
    try {
        await tiposInventarioCasos.eliminar(req.params.id);
        res.redirect('/tipos-inventario?mensaje=Tipo de inventario eliminado exitosamente.');
    } catch (error) {
        const msg = error.message.includes('violates foreign key') || error.message.includes('RESTRICT')
            ? 'No se puede eliminar este tipo porque tiene artículos asociados.'
            : error.message;
        res.redirect('/tipos-inventario?error=' + encodeURIComponent(msg));
    }
});

module.exports = router;
