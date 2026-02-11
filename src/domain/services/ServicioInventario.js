const TipoTransaccion = require('../enums/TipoTransaccion');

/**
 * ServicioInventario — Servicio de dominio para lógica de inventario.
 *
 * Responsabilidades:
 * - Aplicar entradas (incrementar stock)
 * - Aplicar salidas (decrementar stock, validar stock no negativo)
 * - Aplicar ajustes (establecer nueva cantidad, calcular delta)
 *
 * Enfoque de Ajuste:
 *   Se recibe la "cantidad_nueva" deseada para el almacén.
 *   El sistema calcula el delta = cantidad_nueva - cantidad_actual.
 *   Si el delta es negativo, se disminuye. Si es positivo, se aumenta.
 *   La cantidad_nueva nunca puede ser < 0.
 */
class ServicioInventario {
    /**
     * Aplica una entrada de inventario.
     * @param {number} cantidadActualAlmacen - Cantidad actual en el almacén
     * @param {number} existenciaTotalArticulo - Existencia total del artículo
     * @param {number} cantidadEntrada - Cantidad a ingresar (debe ser > 0)
     * @returns {{ nuevaCantidadAlmacen: number, nuevaExistenciaTotal: number }}
     */
    aplicarEntrada(cantidadActualAlmacen, existenciaTotalArticulo, cantidadEntrada) {
        if (cantidadEntrada <= 0) {
            throw new Error('La cantidad de entrada debe ser mayor que 0.');
        }

        const nuevaCantidadAlmacen = cantidadActualAlmacen + cantidadEntrada;
        const nuevaExistenciaTotal = existenciaTotalArticulo + cantidadEntrada;

        return { nuevaCantidadAlmacen, nuevaExistenciaTotal };
    }

    /**
     * Aplica una salida de inventario.
     * @param {number} cantidadActualAlmacen - Cantidad actual en el almacén
     * @param {number} existenciaTotalArticulo - Existencia total del artículo
     * @param {number} cantidadSalida - Cantidad a retirar (debe ser > 0)
     * @returns {{ nuevaCantidadAlmacen: number, nuevaExistenciaTotal: number }}
     */
    aplicarSalida(cantidadActualAlmacen, existenciaTotalArticulo, cantidadSalida) {
        if (cantidadSalida <= 0) {
            throw new Error('La cantidad de salida debe ser mayor que 0.');
        }

        const nuevaCantidadAlmacen = cantidadActualAlmacen - cantidadSalida;
        if (nuevaCantidadAlmacen < 0) {
            throw new Error(
                `Stock insuficiente en el almacén. Disponible: ${cantidadActualAlmacen}, solicitado: ${cantidadSalida}.`
            );
        }

        const nuevaExistenciaTotal = existenciaTotalArticulo - cantidadSalida;

        return { nuevaCantidadAlmacen, nuevaExistenciaTotal };
    }

    /**
     * Aplica un ajuste de inventario.
     * El ajuste establece una nueva cantidad deseada. El sistema calcula el delta.
     * @param {number} cantidadActualAlmacen - Cantidad actual en el almacén
     * @param {number} existenciaTotalArticulo - Existencia total del artículo
     * @param {number} cantidadNueva - Nueva cantidad deseada en este almacén (>= 0)
     * @returns {{ nuevaCantidadAlmacen: number, nuevaExistenciaTotal: number, delta: number }}
     */
    aplicarAjuste(cantidadActualAlmacen, existenciaTotalArticulo, cantidadNueva) {
        if (cantidadNueva < 0) {
            throw new Error('La cantidad nueva para ajuste no puede ser negativa.');
        }

        const delta = cantidadNueva - cantidadActualAlmacen;
        const nuevaCantidadAlmacen = cantidadNueva;
        const nuevaExistenciaTotal = existenciaTotalArticulo + delta;

        if (nuevaExistenciaTotal < 0) {
            throw new Error(
                `El ajuste resultaría en una existencia total negativa. Existencia actual: ${existenciaTotalArticulo}, delta: ${delta}.`
            );
        }

        return { nuevaCantidadAlmacen, nuevaExistenciaTotal, delta };
    }

    /**
     * Procesa una transacción según su tipo.
     * Método unificado que delega al método correspondiente.
     * @param {string} tipo - 'Entrada', 'Salida' o 'Ajuste'
     * @param {number} cantidadActualAlmacen
     * @param {number} existenciaTotalArticulo
     * @param {number} cantidad
     * @returns {{ nuevaCantidadAlmacen: number, nuevaExistenciaTotal: number, delta?: number }}
     */
    procesarTransaccion(tipo, cantidadActualAlmacen, existenciaTotalArticulo, cantidad) {
        switch (tipo) {
            case TipoTransaccion.ENTRADA:
                return this.aplicarEntrada(cantidadActualAlmacen, existenciaTotalArticulo, cantidad);
            case TipoTransaccion.SALIDA:
                return this.aplicarSalida(cantidadActualAlmacen, existenciaTotalArticulo, cantidad);
            case TipoTransaccion.AJUSTE:
                return this.aplicarAjuste(cantidadActualAlmacen, existenciaTotalArticulo, cantidad);
            default:
                throw new Error(`Tipo de transacción no válido: ${tipo}`);
        }
    }
}

module.exports = ServicioInventario;
