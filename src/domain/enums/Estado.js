/**
 * Enumeración de estados para entidades del sistema.
 * Se usa en Artículos, Tipos de Inventario y Almacenes.
 */
const Estado = Object.freeze({
    ACTIVO: 'Activo',
    INACTIVO: 'Inactivo',

    /** Valida si un valor es un estado válido */
    esValido(valor) {
        return [this.ACTIVO, this.INACTIVO].includes(valor);
    },

    /** Retorna todos los valores posibles */
    valores() {
        return [this.ACTIVO, this.INACTIVO];
    }
});

module.exports = Estado;
