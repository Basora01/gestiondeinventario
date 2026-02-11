/**
 * ReportService — Interfaz placeholder para Reportes (futuro).
 *
 * Esta interfaz define los métodos que deberá implementar el servicio
 * de reportes cuando se agreguen:
 * - Consultas por criterios (existencias por almacén, artículo, fecha)
 * - Reporte de artículos debajo del punto de reorden
 *
 * NO IMPLEMENTADO AÚN — Solo estructura preparatoria.
 */
class ReportService {
    /**
     * Genera reporte de existencias por almacén.
     * @param {object} filtros - { almacen_id, articulo_id, fecha_desde, fecha_hasta }
     * @returns {Promise<object[]>}
     */
    async reporteExistenciasPorAlmacen(filtros) {
        throw new Error('ReportService.reporteExistenciasPorAlmacen() no implementado.');
    }

    /**
     * Genera reporte de artículos debajo del punto de reorden.
     * @param {number} puntoReorden - Cantidad mínima permitida
     * @returns {Promise<object[]>}
     */
    async reporteArticulosBajoReorden(puntoReorden) {
        throw new Error('ReportService.reporteArticulosBajoReorden() no implementado.');
    }

    /**
     * Genera reporte de movimientos por período.
     * @param {object} filtros - { fecha_desde, fecha_hasta, tipo, articulo_id, almacen_id }
     * @returns {Promise<object[]>}
     */
    async reporteMovimientos(filtros) {
        throw new Error('ReportService.reporteMovimientos() no implementado.');
    }
}

module.exports = ReportService;
