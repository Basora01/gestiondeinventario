const express = require('express');
const router = express.Router();
const auditLog = require('../../infrastructure/auditLog');

// Página de logs de usuario
router.get('/', (req, res) => {
    const filtros = {
        usuario: req.query.usuario || '',
        accion: req.query.accion || '',
        metodo: req.query.metodo || ''
    };

    const registros = auditLog.listar(filtros);
    const stats = auditLog.estadisticas();

    res.render('reportes/index', {
        titulo: 'Logs de Usuario',
        paginaActual: 'logs',
        registros,
        stats,
        filtros
    });
});

module.exports = router;
