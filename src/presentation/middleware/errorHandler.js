/**
 * Middleware de manejo de errores.
 * Captura errores y muestra una página de error amigable en español.
 */
function errorHandler(err, req, res, next) {
    console.error('[Error]', err.message);
    console.error(err.stack);

    const statusCode = err.statusCode || 500;
    const mensaje = err.message || 'Ha ocurrido un error interno del servidor.';

    // Si es una petición AJAX, responder con JSON
    if (req.xhr || req.headers.accept?.includes('application/json')) {
        return res.status(statusCode).json({ exito: false, mensaje });
    }

    // Renderizar página de error
    res.status(statusCode).render('error', {
        titulo: 'Error',
        mensaje,
        paginaActual: ''
    });
}

module.exports = errorHandler;
