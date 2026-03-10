/**
 * Middleware de autenticación y autorización.
 * Verifica que el usuario tenga sesión activa y controla permisos por rol.
 */
function authMiddleware(req, res, next) {
    // Rutas públicas (no requieren sesión)
    if (req.path === '/login' || req.path === '/logout') {
        return next();
    }

    // Archivos estáticos ya son servidos antes de este middleware
    // Verificar sesión
    if (!req.session || !req.session.usuario) {
        return res.redirect('/login');
    }

    // Inyectar usuario en res.locals para que esté disponible en todas las vistas
    res.locals.usuarioActual = req.session.usuario;

    // Rol "Consultor" = solo lectura (bloquear POST excepto login)
    if (req.session.usuario.rol === 'Consultor' && req.method === 'POST') {
        const msg = 'No tiene permisos para realizar esta acción. Su rol es de solo consulta.';
        // Redirigir al referer o al inicio
        const referer = req.headers.referer || '/';
        return res.redirect(referer + (referer.includes('?') ? '&' : '?') + 'error=' + encodeURIComponent(msg));
    }

    next();
}

module.exports = authMiddleware;
