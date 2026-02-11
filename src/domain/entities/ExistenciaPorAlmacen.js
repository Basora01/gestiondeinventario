/**
 * Entidad de dominio: Existencia por Almacén
 * Representa la cantidad de un artículo específico en un almacén específico.
 */
class ExistenciaPorAlmacen {
    constructor({ almacen_id, articulo_id, cantidad = 0 }) {
        this.almacen_id = almacen_id;
        this.articulo_id = articulo_id;
        this.cantidad = parseFloat(cantidad);
    }

    validar() {
        const errores = [];
        if (!this.almacen_id || this.almacen_id <= 0) {
            errores.push('Debe seleccionar un almacén válido.');
        }
        if (!this.articulo_id || this.articulo_id <= 0) {
            errores.push('Debe seleccionar un artículo válido.');
        }
        if (this.cantidad < 0) {
            errores.push('La cantidad no puede ser negativa.');
        }
        return errores;
    }
}

module.exports = ExistenciaPorAlmacen;
