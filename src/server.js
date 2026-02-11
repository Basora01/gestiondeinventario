require('dotenv').config();
const express = require('express');
const path = require('path');

const authPlaceholder = require('./presentation/middleware/authPlaceholder');
const errorHandler = require('./presentation/middleware/errorHandler');

// Importar rutas
const tiposInventarioRoutes = require('./presentation/routes/tiposInventarioRoutes');
const articulosRoutes = require('./presentation/routes/articulosRoutes');
const almacenesRoutes = require('./presentation/routes/almacenesRoutes');
const existenciasRoutes = require('./presentation/routes/existenciasRoutes');
const transaccionesRoutes = require('./presentation/routes/transaccionesRoutes');

const app = express();
const PORT = process.env.PORT || 3000;

// ---- Configuración del motor de vistas ----
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'presentation', 'views'));

// ---- Middleware ----
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, '..', 'public')));
app.use(authPlaceholder);

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
