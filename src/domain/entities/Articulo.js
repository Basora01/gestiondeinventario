const Estado = require('../enums/Estado');

/**
 * Entidad de dominio: Artículo
 */
class Articulo {
    constructor({ id = null, descripcion, tipo_inventario_id, costo_unitario = 0, estado = Estado.ACTIVO, existencia_total = 0, creado_en = null, actualizado_en = null }) {
        this.id = id;
        this.descripcion = descripcion;
        this.tipo_inventario_id = tipo_inventario_id;
        this.costo_unitario = parseFloat(costo_unitario);
        this.estado = estado;
        this.existencia_total = parseFloat(existencia_total);
        this.creado_en = creado_en;
        this.actualizado_en = actualizado_en;
    }

    /** Valida los datos del artículo. Retorna array de errores (vacío si es válido). */
    validar() {
        const errores = [];
        if (!this.descripcion || this.descripcion.trim().length === 0) {
            errores.push('La descripción del artículo es obligatoria.');
        }
        if (!this.tipo_inventario_id || this.tipo_inventario_id <= 0) {
            errores.push('Debe seleccionar un tipo de inventario válido.');
        }
        if (this.costo_unitario < 0) {
            errores.push('El costo unitario debe ser mayor o igual a 0.');
        }
        if (!Estado.esValido(this.estado)) {
            errores.push(`El estado debe ser uno de: ${Estado.valores().join(', ')}.`);
        }
        return errores;
    }

    estaActivo() {
        return this.estado === Estado.ACTIVO;
    }
}

module.exports = Articulo;
