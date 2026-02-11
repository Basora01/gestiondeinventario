const TipoTransaccion = require('../enums/TipoTransaccion');

/**
 * Entidad de dominio: Transacción de Inventario
 */
class Transaccion {
    constructor({ id = null, tipo, articulo_id, almacen_id, fecha = null, cantidad, monto = 0, creado_en = null }) {
        this.id = id;
        this.tipo = tipo;
        this.articulo_id = articulo_id;
        this.almacen_id = almacen_id;
        this.fecha = fecha || new Date().toISOString().split('T')[0];
        this.cantidad = parseFloat(cantidad);
        this.monto = parseFloat(monto);
        this.creado_en = creado_en;
    }

    validar() {
        const errores = [];
        if (!TipoTransaccion.esValido(this.tipo)) {
            errores.push(`El tipo de transacción debe ser uno de: ${TipoTransaccion.valores().join(', ')}.`);
        }
        if (!this.articulo_id || this.articulo_id <= 0) {
            errores.push('Debe seleccionar un artículo válido.');
        }
        if (!this.almacen_id || this.almacen_id <= 0) {
            errores.push('Debe seleccionar un almacén válido.');
        }
        if (!this.fecha) {
            errores.push('La fecha es obligatoria.');
        }
        // Para Entrada y Salida la cantidad debe ser > 0
        if (this.tipo === TipoTransaccion.ENTRADA || this.tipo === TipoTransaccion.SALIDA) {
            if (this.cantidad <= 0) {
                errores.push('La cantidad debe ser mayor que 0 para Entrada/Salida.');
            }
        }
        // Para Ajuste, la cantidad representa la nueva cantidad deseada (>= 0)
        if (this.tipo === TipoTransaccion.AJUSTE) {
            if (this.cantidad < 0) {
                errores.push('La cantidad nueva para ajuste no puede ser negativa.');
            }
        }
        if (isNaN(this.monto)) {
            errores.push('El monto debe ser un número válido.');
        }
        return errores;
    }
}

module.exports = Transaccion;
