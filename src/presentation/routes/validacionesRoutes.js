const express = require('express');
const router = express.Router();
const validacionesCasos = require('../../application/use-cases/validacionesCasos');

// Página de validaciones
router.get('/', async (req, res, next) => {
    try {
        const resultados = await validacionesCasos.validarTodos();
        res.render('validaciones/index', {
            titulo: 'Validaciones',
            paginaActual: 'validaciones',
            resultados
        });
    } catch (error) {
        next(error);
    }
});

module.exports = router;
