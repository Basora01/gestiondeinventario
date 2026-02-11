/**
 * Enumeración de tipos de transacción.
 */
const TipoTransaccion = Object.freeze({
    ENTRADA: 'Entrada',
    SALIDA: 'Salida',
    AJUSTE: 'Ajuste',

    /** Valida si un valor es un tipo de transacción válido */
    esValido(valor) {
        return [this.ENTRADA, this.SALIDA, this.AJUSTE].includes(valor);
    },

    /** Retorna todos los valores posibles */
    valores() {
        return [this.ENTRADA, this.SALIDA, this.AJUSTE];
    }
});

module.exports = TipoTransaccion;
