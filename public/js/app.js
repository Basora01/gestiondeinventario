/**
 * app.js — Funciones del lado del cliente
 */

// Confirmar eliminación antes de enviar el formulario
function confirmarEliminar(form) {
    return confirm('¿Está seguro de que desea eliminar este elemento?\n\nEsta acción no se puede deshacer.');
}

document.addEventListener('DOMContentLoaded', () => {
    // Auto-dismiss de alertas después de 5 segundos
    const alertas = document.querySelectorAll('.alerta');
    alertas.forEach(alerta => {
        setTimeout(() => {
            alerta.style.opacity = '0';
            alerta.style.transform = 'translateY(-8px)';
            setTimeout(() => alerta.remove(), 300);
        }, 5000);
    });
});
