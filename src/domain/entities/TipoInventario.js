const Estado = require('../enums/Estado');

/**
 * Entidad de dominio: Tipo de Inventario
 */
class TipoInventario {
    constructor({ id = null, descripcion, cuenta_contable = '', estado = Estado.ACTIVO, creado_en = null, actualizado_en = null }) {
        this.id = id;
        this.descripcion = descripcion;
        this.cuenta_contable = cuenta_contable;
        this.estado = estado;
        this.creado_en = creado_en;
        this.actualizado_en = actualizado_en;
    }

    validar() {
        const errores = [];
        if (!this.descripcion || this.descripcion.trim().length === 0) {
            errores.push('La descripción del tipo de inventario es obligatoria.');
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

module.exports = TipoInventario;
