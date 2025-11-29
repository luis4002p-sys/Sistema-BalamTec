document.addEventListener('DOMContentLoaded', function () {
    var nombreUsuario = sessionStorage.getItem('usuarioLogueado');
    if (!nombreUsuario) {
        alert('Debes iniciar sesión primero');
        window.location.href = 'index.html';
        return;
    }
    // Actualizar nombre en el encabezado principal
    var spanNombre = document.getElementById('nombreUsuario');
    if (spanNombre) {
        spanNombre.textContent = nombreUsuario;
    }
    // Obtener datos del usuario
    var cvUser = sessionStorage.getItem('cvUser');
    var cvPerson = sessionStorage.getItem('cvPerson');
    var loginUser = sessionStorage.getItem('loginUser');
    var tipoPersona = sessionStorage.getItem('tipoPersona');
    var puesto = sessionStorage.getItem('puesto');
    // Obtener objeto completo de la persona
    var personaCompleta = sessionStorage.getItem('personaCompleta');
    var datosPersona = null;
    if (personaCompleta) {
        datosPersona = JSON.parse(personaCompleta);
    }
    // ============ ACTUALIZAR PERFIL DE USUARIO EN SIDEBAR ============
    actualizarPerfilUsuario(nombreUsuario, loginUser, puesto, tipoPersona);
});
/**
 * Función para actualizar el perfil del usuario en el sidebar
 */
function actualizarPerfilUsuario(nombre, email, puesto, tipoPersona) {
    // Actualizar nombre completo
    var userNameElement = document.querySelector('.user-info h3');
    if (userNameElement) {
        userNameElement.textContent = nombre;
    }
    // Actualizar email
    var emailElement = document.querySelector('.user-detail strong');
    if (emailElement && emailElement.parentElement) {
        emailElement.parentElement.innerHTML = "<strong>Email:</strong> ".concat(email || 'No disponible');
    }
    // Actualizar área/puesto
    var areaElements = document.querySelectorAll('.user-detail');
    if (areaElements.length >= 2) {
        areaElements[1].innerHTML = "<strong>\u00C1rea:</strong> ".concat(puesto || 'No asignada');
    }
    // Actualizar rol
    var roleElement = document.querySelector('.user-role');
    if (roleElement) {
        roleElement.textContent = tipoPersona || 'Usuario';
    }
    // Actualizar iniciales en el avatar
    var avatarElement = document.querySelector('.user-avatar span');
    if (avatarElement && nombre) {
        var iniciales = obtenerIniciales(nombre);
        avatarElement.textContent = iniciales;
    }
}
/**
 * Función para obtener las iniciales del nombre
 */
function obtenerIniciales(nombreCompleto) {
    var palabras = nombreCompleto.trim().split(' ');
    if (palabras.length === 1) {
        return palabras[0].substring(0, 2).toUpperCase();
    }
    return (palabras[0].charAt(0) + palabras[palabras.length - 1].charAt(0)).toUpperCase();
}
// ============ BOTONES DE NAVEGACIÓN ============
var btnEmpleados = document.getElementById("btnEmpleados");
var btnProductos = document.getElementById("btnProductos");
var btnReportes = document.getElementById("btnReportes");
var btnVentas = document.getElementById("btnVentas");
var btnSalir = document.getElementById("btnSalir");
btnEmpleados === null || btnEmpleados === void 0 ? void 0 : btnEmpleados.addEventListener("click", function () {
    window.location.href = "DatosPersonales.html";
});
btnReportes === null || btnReportes === void 0 ? void 0 : btnReportes.addEventListener("click", function () {
    window.location.href = "clientes.html";
});
btnProductos === null || btnProductos === void 0 ? void 0 : btnProductos.addEventListener("click", function () {
    window.location.href = "clientes.html";
});
btnVentas === null || btnVentas === void 0 ? void 0 : btnVentas.addEventListener("click", function () {
    window.location.href = "ventas.html";
});
btnSalir === null || btnSalir === void 0 ? void 0 : btnSalir.addEventListener("click", function () {
    var confirmar = confirm("¿Deseas cerrar sesión?");
    if (confirmar) {
        sessionStorage.clear();
        window.location.href = "index.html";
    }
});
// ============ FUNCIONES AUXILIARES GLOBALES ============
function obtenerNombreUsuario() {
    return sessionStorage.getItem('usuarioLogueado') || 'Usuario';
}
function obtenerLoginUsuario() {
    return sessionStorage.getItem('loginUser') || '';
}
function obtenerDatosPersona() {
    var personaStr = sessionStorage.getItem('personaCompleta');
    return personaStr ? JSON.parse(personaStr) : null;
}
function verificarSesion() {
    return !!sessionStorage.getItem('usuarioLogueado');
}
// Exponer funciones globalmente
if (typeof window !== 'undefined') {
    window.obtenerNombreUsuario = obtenerNombreUsuario;
    window.obtenerLoginUsuario = obtenerLoginUsuario;
    window.obtenerDatosPersona = obtenerDatosPersona;
    window.verificarSesion = verificarSesion;
    window.actualizarPerfilUsuario = actualizarPerfilUsuario;
}
