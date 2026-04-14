const express = require('express');
const router = express.Router();
const { ejecutarConsulta } = require('../../infrastructure/config/database');

// Página de Procesos y Reportes (movimientos de inventario)
router.get('/', async (req, res, next) => {
    try {
        const filtros = {
            tipo: req.query.tipo || '',
            articulo_id: req.query.articulo_id || '',
            fecha_desde: req.query.fecha_desde || '',
            fecha_hasta: req.query.fecha_hasta || ''
        };

        // 1. Resumen general de inventario
        const resumenTotal = await ejecutarConsulta(`
            SELECT 
                COUNT(*) AS total_articulos,
                COALESCE(SUM(existencia_total), 0) AS existencia_total,
                COALESCE(SUM(CASE WHEN estado = 'Activo' THEN 1 ELSE 0 END), 0) AS activos,
                COALESCE(SUM(CASE WHEN estado = 'Inactivo' THEN 1 ELSE 0 END), 0) AS inactivos
            FROM articulos
        `);

        // 2. Resumen de movimientos (entradas vs salidas)
        const resumenMovimientos = await ejecutarConsulta(`
            SELECT 
                COALESCE(SUM(CASE WHEN tipo = 'Entrada' THEN cantidad ELSE 0 END), 0) AS total_entradas_cant,
                COALESCE(SUM(CASE WHEN tipo = 'Salida' THEN cantidad ELSE 0 END), 0) AS total_salidas_cant,
                COALESCE(SUM(CASE WHEN tipo = 'Entrada' THEN monto ELSE 0 END), 0) AS total_compras_monto,
                COALESCE(SUM(CASE WHEN tipo = 'Salida' THEN monto ELSE 0 END), 0) AS total_ventas_monto,
                COALESCE(SUM(CASE WHEN tipo = 'Ajuste' THEN 1 ELSE 0 END), 0) AS total_ajustes,
                COUNT(*) AS total_transacciones
            FROM transacciones
        `);

        // 3. Movimientos recientes (con filtros)
        let sqlMov = `SELECT t.id, t.tipo, t.fecha, t.cantidad, t.monto, t.creado_en,
                        a.descripcion AS articulo, 
                        alm.descripcion AS almacen
                   FROM transacciones t
                   JOIN articulos a ON t.articulo_id = a.id
                   JOIN almacenes alm ON t.almacen_id = alm.id`;
        const condiciones = [];
        const params = [];
        let idx = 1;

        if (filtros.tipo) {
            condiciones.push(`t.tipo = $${idx++}`);
            params.push(filtros.tipo);
        }
        if (filtros.articulo_id) {
            condiciones.push(`t.articulo_id = $${idx++}`);
            params.push(filtros.articulo_id);
        }
        if (filtros.fecha_desde) {
            condiciones.push(`t.fecha >= $${idx++}`);
            params.push(filtros.fecha_desde);
        }
        if (filtros.fecha_hasta) {
            condiciones.push(`t.fecha <= $${idx++}`);
            params.push(filtros.fecha_hasta);
        }

        if (condiciones.length > 0) {
            sqlMov += ' WHERE ' + condiciones.join(' AND ');
        }
        sqlMov += ' ORDER BY t.fecha DESC, t.id DESC LIMIT 100';

        const movimientos = await ejecutarConsulta(sqlMov, params);

        // 4. Top artículos por movimiento
        const topArticulos = await ejecutarConsulta(`
            SELECT a.descripcion,
                   a.existencia_total,
                   COALESCE(SUM(CASE WHEN t.tipo = 'Entrada' THEN t.cantidad ELSE 0 END), 0) AS entradas,
                   COALESCE(SUM(CASE WHEN t.tipo = 'Salida' THEN t.cantidad ELSE 0 END), 0) AS salidas,
                   COALESCE(SUM(t.monto), 0) AS monto_total
            FROM articulos a
            LEFT JOIN transacciones t ON t.articulo_id = a.id
            GROUP BY a.id, a.descripcion, a.existencia_total
            ORDER BY COALESCE(SUM(t.cantidad), 0) DESC
            LIMIT 10
        `);

        // 5. Lista de artículos para filtro
        const articulos = await ejecutarConsulta("SELECT id, descripcion FROM articulos WHERE estado = 'Activo' ORDER BY descripcion");

        res.render('procesos/index', {
            titulo: 'Procesos y Reportes',
            paginaActual: 'procesos',
            resumen: resumenTotal[0],
            movResumen: resumenMovimientos[0],
            movimientos,
            topArticulos,
            articulos,
            filtros
        });
    } catch (error) {
        next(error);
    }
});

module.exports = router;
