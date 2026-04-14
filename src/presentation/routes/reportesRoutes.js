const express = require('express');
const router = express.Router();
const auditLog = require('../../infrastructure/auditLog');

// Página de reportes y procesos
router.get('/', (req, res) => {
    const filtros = {
        usuario: req.query.usuario || '',
        accion: req.query.accion || '',
        metodo: req.query.metodo || ''
    };

    const registros = auditLog.listar(filtros);
    const stats = auditLog.estadisticas();

    res.render('reportes/index', {
        titulo: 'Procesos y Reportes',
        paginaActual: 'reportes',
        registros,
        stats,
        filtros
    });
});

module.exports = router;
