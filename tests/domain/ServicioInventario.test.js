const ServicioInventario = require('../../src/domain/services/ServicioInventario');

/**
 * Pruebas unitarias para ServicioInventario.
 *
 * Cubre:
 * - Entrada incrementa stock
 * - Salida decrementa stock
 * - Prevención de stock negativo
 * - Lógica de ajuste (delta)
 */
describe('ServicioInventario', () => {
    let servicio;

    beforeEach(() => {
        servicio = new ServicioInventario();
    });

    // =====================================================
    // ENTRADA
    // =====================================================
    describe('aplicarEntrada', () => {
        test('debe incrementar la cantidad en el almacén y la existencia total', () => {
            const resultado = servicio.aplicarEntrada(100, 500, 50);
            expect(resultado.nuevaCantidadAlmacen).toBe(150);
            expect(resultado.nuevaExistenciaTotal).toBe(550);
        });

        test('debe funcionar cuando el almacén tiene 0 existencia', () => {
            const resultado = servicio.aplicarEntrada(0, 200, 30);
            expect(resultado.nuevaCantidadAlmacen).toBe(30);
            expect(resultado.nuevaExistenciaTotal).toBe(230);
        });

        test('debe lanzar error si la cantidad de entrada es 0', () => {
            expect(() => servicio.aplicarEntrada(100, 500, 0)).toThrow(
                'La cantidad de entrada debe ser mayor que 0.'
            );
        });

        test('debe lanzar error si la cantidad de entrada es negativa', () => {
            expect(() => servicio.aplicarEntrada(100, 500, -10)).toThrow(
                'La cantidad de entrada debe ser mayor que 0.'
            );
        });
    });

    // =====================================================
    // SALIDA
    // =====================================================
    describe('aplicarSalida', () => {
        test('debe decrementar la cantidad en el almacén y la existencia total', () => {
            const resultado = servicio.aplicarSalida(100, 500, 30);
            expect(resultado.nuevaCantidadAlmacen).toBe(70);
            expect(resultado.nuevaExistenciaTotal).toBe(470);
        });

        test('debe permitir retirar toda la existencia del almacén', () => {
            const resultado = servicio.aplicarSalida(50, 200, 50);
            expect(resultado.nuevaCantidadAlmacen).toBe(0);
            expect(resultado.nuevaExistenciaTotal).toBe(150);
        });

        test('debe lanzar error si la salida excede el stock del almacén (stock negativo)', () => {
            expect(() => servicio.aplicarSalida(20, 500, 50)).toThrow(
                'Stock insuficiente en el almacén. Disponible: 20, solicitado: 50.'
            );
        });

        test('debe lanzar error si la cantidad de salida es 0', () => {
            expect(() => servicio.aplicarSalida(100, 500, 0)).toThrow(
                'La cantidad de salida debe ser mayor que 0.'
            );
        });

        test('debe lanzar error si la cantidad de salida es negativa', () => {
            expect(() => servicio.aplicarSalida(100, 500, -5)).toThrow(
                'La cantidad de salida debe ser mayor que 0.'
            );
        });
    });

    // =====================================================
    // AJUSTE
    // =====================================================
    describe('aplicarAjuste', () => {
        test('debe ajustar incrementando cuando cantidad_nueva > actual', () => {
            const resultado = servicio.aplicarAjuste(30, 100, 50);
            expect(resultado.nuevaCantidadAlmacen).toBe(50);
            expect(resultado.nuevaExistenciaTotal).toBe(120);
            expect(resultado.delta).toBe(20);
        });

        test('debe ajustar decrementando cuando cantidad_nueva < actual', () => {
            const resultado = servicio.aplicarAjuste(80, 200, 60);
            expect(resultado.nuevaCantidadAlmacen).toBe(60);
            expect(resultado.nuevaExistenciaTotal).toBe(180);
            expect(resultado.delta).toBe(-20);
        });

        test('debe no cambiar nada si cantidad_nueva === actual', () => {
            const resultado = servicio.aplicarAjuste(50, 200, 50);
            expect(resultado.nuevaCantidadAlmacen).toBe(50);
            expect(resultado.nuevaExistenciaTotal).toBe(200);
            expect(resultado.delta).toBe(0);
        });

        test('debe ajustar a 0 correctamente', () => {
            const resultado = servicio.aplicarAjuste(100, 300, 0);
            expect(resultado.nuevaCantidadAlmacen).toBe(0);
            expect(resultado.nuevaExistenciaTotal).toBe(200);
            expect(resultado.delta).toBe(-100);
        });

        test('debe lanzar error si la cantidad_nueva es negativa', () => {
            expect(() => servicio.aplicarAjuste(50, 200, -10)).toThrow(
                'La cantidad nueva para ajuste no puede ser negativa.'
            );
        });

        test('debe lanzar error si el ajuste causa existencia total negativa', () => {
            // cantidadActual = 80, existenciaTotal = 50, cantidadNueva = 0
            // delta = 0 - 80 = -80 → nuevaExistenciaTotal = 50 + (-80) = -30 → ERROR
            expect(() => servicio.aplicarAjuste(80, 50, 0)).toThrow(
                'El ajuste resultaría en una existencia total negativa.'
            );
        });
    });

    // =====================================================
    // procesarTransaccion (dispatch)
    // =====================================================
    describe('procesarTransaccion', () => {
        test('debe delegar Entrada correctamente', () => {
            const resultado = servicio.procesarTransaccion('Entrada', 10, 100, 20);
            expect(resultado.nuevaCantidadAlmacen).toBe(30);
            expect(resultado.nuevaExistenciaTotal).toBe(120);
        });

        test('debe delegar Salida correctamente', () => {
            const resultado = servicio.procesarTransaccion('Salida', 50, 200, 10);
            expect(resultado.nuevaCantidadAlmacen).toBe(40);
            expect(resultado.nuevaExistenciaTotal).toBe(190);
        });

        test('debe delegar Ajuste correctamente', () => {
            const resultado = servicio.procesarTransaccion('Ajuste', 30, 100, 60);
            expect(resultado.nuevaCantidadAlmacen).toBe(60);
            expect(resultado.delta).toBe(30);
        });

        test('debe lanzar error para tipo no válido', () => {
            expect(() => servicio.procesarTransaccion('Invalido', 10, 100, 5)).toThrow(
                'Tipo de transacción no válido: Invalido'
            );
        });
    });
});
