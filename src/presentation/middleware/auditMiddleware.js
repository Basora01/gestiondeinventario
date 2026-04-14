const auditLog = require('../../infrastructure/auditLog');

/**
 * Middleware de auditoría.
 * Registra cada acción de usuario (GET y POST a rutas de la app).
 * Ignora archivos estáticos y assets.
 */
function auditMiddleware(req, res, next) {
    // Ignorar archivos estáticos
    if (req.path.startsWith('/css/') || req.path.startsWith('/js/') ||
        req.path.startsWith('/images/') || req.path.includes('.')) {
        return next();
    }

    // Solo registrar si hay sesión activa (usuario autenticado)
    const usuario = req.session ? req.session.usuario : null;

    // Registrar la acción
    if (req.method === 'GET' || req.method === 'POST') {
        auditLog.registrar(
            usuario,
            req.method,
            req.path,
            req.ip || req.connection.remoteAddress
        );
    }

    next();
}

module.exports = auditMiddleware;
