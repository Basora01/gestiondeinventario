require('dotenv').config();
const express = require('express');
const session = require('express-session');
const path = require('path');

const authMiddleware = require('./presentation/middleware/authMiddleware');
const auditMiddleware = require('./presentation/middleware/auditMiddleware');
const errorHandler = require('./presentation/middleware/errorHandler');

// Importar rutas
const authRoutes = require('./presentation/routes/authRoutes');
const tiposInventarioRoutes = require('./presentation/routes/tiposInventarioRoutes');
const articulosRoutes = require('./presentation/routes/articulosRoutes');
const almacenesRoutes = require('./presentation/routes/almacenesRoutes');
const existenciasRoutes = require('./presentation/routes/existenciasRoutes');
const transaccionesRoutes = require('./presentation/routes/transaccionesRoutes');
const validacionesRoutes = require('./presentation/routes/validacionesRoutes');
const reportesRoutes = require('./presentation/routes/reportesRoutes');

const app = express();
const PORT = process.env.PORT || 3000;

// ---- Configuración del motor de vistas ----
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'presentation', 'views'));

// ---- Middleware ----
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, '..', 'public')));

// Sesiones
app.use(session({
    secret: process.env.SESSION_SECRET || 'inventario-secret-2024',
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: 1000 * 60 * 60 * 4 // 4 horas
    }
}));

// Rutas de autenticación (antes del middleware de auth)
app.use(authRoutes);

// Middleware de autenticación (protege todas las rutas siguientes)
app.use(authMiddleware);

// Middleware de auditoría (registra acciones de usuario)
app.use(auditMiddleware);

// ---- Rutas ----
// Dashboard / Inicio
app.get('/', (req, res) => {
    res.render('dashboard', {
        titulo: 'Inicio',
        paginaActual: 'inicio'
    });
});

// Módulos CRUD
app.use('/tipos-inventario', tiposInventarioRoutes);
app.use('/articulos', articulosRoutes);
app.use('/almacenes', almacenesRoutes);
app.use('/existencias', existenciasRoutes);
app.use('/transacciones', transaccionesRoutes);
app.use('/validaciones', validacionesRoutes);
app.use('/reportes', reportesRoutes);

// ---- Manejo de errores ----
// 404
app.use((req, res) => {
    res.status(404).render('error', {
        titulo: 'Página no encontrada',
        mensaje: 'La página que busca no existe.',
        paginaActual: ''
    });
});

// Error general
app.use(errorHandler);

// ---- Iniciar servidor ----
app.listen(PORT, () => {
    console.log(`✅ Sistema de Gestión de Inventario corriendo en http://localhost:${PORT}`);
});

module.exports = app;
