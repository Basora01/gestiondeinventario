/**
 * Middleware placeholder para autenticación/autorización (futuro).
 *
 * Actualmente permite todo el acceso. Cuando se implemente AuthService,
 * este middleware verificará tokens/sesiones y permisos.
 */
function authPlaceholder(req, res, next) {
    // TODO: Implementar verificación de sesión/token cuando se agregue AuthService
    // Ejemplo futuro:
    // const token = req.headers.authorization;
    // if (!authService.verificarToken(token)) {
    //   return res.status(401).json({ mensaje: 'No autorizado.' });
    // }
    req.usuario = { id: 1, nombre: 'Administrador', rol: 'admin' }; // Usuario simulado
    next();
}

module.exports = authPlaceholder;
