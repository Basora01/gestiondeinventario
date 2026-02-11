/**
 * AuthService — Interfaz placeholder para Control de Acceso (futuro).
 *
 * Esta interfaz define los métodos que deberá implementar el servicio
 * de autenticación y autorización cuando se agregue el módulo de
 * Control de Acceso (roles/usuarios).
 *
 * NO IMPLEMENTADO AÚN — Solo estructura preparatoria.
 */
class AuthService {
    /**
     * Autentica a un usuario con sus credenciales.
     * @param {string} usuario
     * @param {string} contrasena
     * @returns {Promise<object>} Datos del usuario autenticado
     */
    async autenticar(usuario, contrasena) {
        throw new Error('AuthService.autenticar() no implementado.');
    }

    /**
     * Verifica si un usuario tiene un permiso específico.
     * @param {number} usuarioId
     * @param {string} permiso
     * @returns {Promise<boolean>}
     */
    async tienePermiso(usuarioId, permiso) {
        throw new Error('AuthService.tienePermiso() no implementado.');
    }

    /**
     * Obtiene los roles de un usuario.
     * @param {number} usuarioId
     * @returns {Promise<string[]>}
     */
    async obtenerRoles(usuarioId) {
        throw new Error('AuthService.obtenerRoles() no implementado.');
    }
}

module.exports = AuthService;
