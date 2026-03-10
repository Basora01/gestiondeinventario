const express = require('express');
const router = express.Router();

// Credenciales hardcoded
const USUARIO_VALIDO = 'Admin';
const CLAVE_VALIDA = '1234';
const ROLES = ['Administrador', 'Consultor'];

// Mostrar formulario de login
router.get('/login', (req, res) => {
    if (req.session && req.session.usuario) {
        return res.redirect('/');
    }
    res.render('login', {
        titulo: 'Iniciar Sesión',
        error: req.query.error || null,
        roles: ROLES
    });
});

// Procesar login
router.post('/login', (req, res) => {
    const { usuario, clave, rol } = req.body;

    if (usuario === USUARIO_VALIDO && clave === CLAVE_VALIDA && ROLES.includes(rol)) {
        req.session.usuario = {
            nombre: usuario,
            rol: rol
        };
        return res.redirect('/');
    }

    res.redirect('/login?error=' + encodeURIComponent('Credenciales inválidas. Intente de nuevo.'));
});

// Cerrar sesión
router.get('/logout', (req, res) => {
    req.session.destroy(() => {
        res.redirect('/login');
    });
});

module.exports = router;
