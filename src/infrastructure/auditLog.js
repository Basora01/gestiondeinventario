/**
 * Registro de auditoría en memoria.
 * Almacena todas las acciones de usuario durante la sesión del servidor.
 */

const MAX_REGISTROS = 500;
const registros = [];

// Mapeo de rutas/métodos a descripciones legibles
const ACCIONES = {
    'GET /': 'Visitó el Panel de Control',
    'GET /articulos': 'Consultó listado de Artículos',
    'GET /articulos/crear': 'Abrió formulario de nuevo Artículo',
    'POST /articulos/crear': 'Creó un nuevo Artículo',
    'POST /articulos/eliminar': 'Eliminó un Artículo',
    'GET /articulos/editar': 'Abrió edición de Artículo',
    'POST /articulos/editar': 'Actualizó un Artículo',
    'GET /tipos-inventario': 'Consultó Tipos de Inventario',
    'GET /tipos-inventario/crear': 'Abrió formulario de nuevo Tipo',
    'POST /tipos-inventario/crear': 'Creó un nuevo Tipo de Inventario',
    'POST /tipos-inventario/eliminar': 'Eliminó un Tipo de Inventario',
    'GET /tipos-inventario/editar': 'Abrió edición de Tipo de Inventario',
    'POST /tipos-inventario/editar': 'Actualizó un Tipo de Inventario',
    'GET /almacenes': 'Consultó listado de Almacenes',
    'GET /almacenes/crear': 'Abrió formulario de nuevo Almacén',
    'POST /almacenes/crear': 'Creó un nuevo Almacén',
    'POST /almacenes/eliminar': 'Eliminó un Almacén',
    'GET /almacenes/editar': 'Abrió edición de Almacén',
    'POST /almacenes/editar': 'Actualizó un Almacén',
    'GET /existencias': 'Consultó Existencias por Almacén',
    'GET /existencias/editar': 'Abrió ajuste de Existencia',
    'POST /existencias/editar': 'Ajustó una Existencia',
    'POST /existencias/eliminar': 'Eliminó una Existencia',
    'GET /transacciones': 'Consultó listado de Transacciones',
    'GET /transacciones/crear': 'Abrió formulario de nueva Transacción',
    'POST /transacciones/crear': 'Registró una nueva Transacción',
    'POST /transacciones/eliminar': 'Eliminó una Transacción',
    'GET /validaciones': 'Ejecutó Validaciones de Datos',
    'GET /reportes': 'Consultó Procesos y Reportes',
    'POST /login': 'Inició sesión',
    'GET /logout': 'Cerró sesión'
};

/**
 * Obtener descripción legible de una acción.
 */
function obtenerDescripcion(method, path) {
    // Coincidencia exacta
    const key = method + ' ' + path;
    if (ACCIONES[key]) return ACCIONES[key];

    // Coincidencia por prefijo (para rutas con :id)
    for (const [patron, desc] of Object.entries(ACCIONES)) {
        const [m, p] = patron.split(' ');
        if (m === method && path.startsWith(p) && path !== p) {
            // Extraer ID si existe
            const partes = path.replace(p + '/', '').split('/');
            const id = partes[partes.length - 1];
            return desc + (id ? ' (ID: ' + id + ')' : '');
        }
    }

    // Detalle de transacción
    if (method === 'GET' && /^\/transacciones\/\d+$/.test(path)) {
        return 'Vio detalle de Transacción #' + path.split('/').pop();
    }

    return method + ' ' + path;
}

/**
 * Registrar una acción de usuario.
 */
function registrar(usuario, method, path, ip) {
    const registro = {
        id: registros.length + 1,
        fecha: new Date(),
        usuario: usuario ? usuario.nombre : 'Anónimo',
        rol: usuario ? usuario.rol : '—',
        metodo: method,
        ruta: path,
        accion: obtenerDescripcion(method, path),
        ip: ip || '—'
    };

    registros.unshift(registro); // Más recientes primero

    // Limitar tamaño
    if (registros.length > MAX_REGISTROS) {
        registros.pop();
    }

    return registro;
}

/**
 * Obtener todos los registros con filtros opcionales.
 */
function listar(filtros = {}) {
    let resultado = [...registros];

    if (filtros.usuario) {
        resultado = resultado.filter(r => r.usuario.toLowerCase().includes(filtros.usuario.toLowerCase()));
    }
    if (filtros.accion) {
        resultado = resultado.filter(r => r.accion.toLowerCase().includes(filtros.accion.toLowerCase()));
    }
    if (filtros.metodo) {
        resultado = resultado.filter(r => r.metodo === filtros.metodo);
    }

    return resultado;
}

/**
 * Obtener estadísticas resumidas.
 */
function estadisticas() {
    const porUsuario = {};
    const porAccion = {};
    const porMetodo = { GET: 0, POST: 0 };

    for (const r of registros) {
        porUsuario[r.usuario] = (porUsuario[r.usuario] || 0) + 1;
        porAccion[r.accion] = (porAccion[r.accion] || 0) + 1;
        if (porMetodo[r.metodo] !== undefined) porMetodo[r.metodo]++;
    }

    return {
        total: registros.length,
        porUsuario,
        porAccion: Object.entries(porAccion)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 10),
        porMetodo
    };
}

module.exports = { registrar, listar, estadisticas };
