document.addEventListener('DOMContentLoaded', () => {
  const nombreUsuario = sessionStorage.getItem('usuarioLogueado');
  
  if (!nombreUsuario) {
    alert('Debes iniciar sesión primero');
    window.location.href = 'index.html';
    return;
  }

  // Actualizar nombre en el encabezado principal
  const spanNombre = document.getElementById('nombreUsuario');
  if (spanNombre) {
    spanNombre.textContent = nombreUsuario;
  }

  // Obtener datos del usuario
  const cvUser = sessionStorage.getItem('cvUser');
  const cvPerson = sessionStorage.getItem('cvPerson');
  const loginUser = sessionStorage.getItem('loginUser');
  const tipoPersona = sessionStorage.getItem('tipoPersona');
  const puesto = sessionStorage.getItem('puesto');

  // Obtener objeto completo de la persona
  const personaCompleta = sessionStorage.getItem('personaCompleta');
  let datosPersona = null;
  if (personaCompleta) {
    datosPersona = JSON.parse(personaCompleta);
  }

  // ============ ACTUALIZAR PERFIL DE USUARIO EN SIDEBAR ============
  actualizarPerfilUsuario(nombreUsuario, loginUser, puesto, tipoPersona);
});

/**
 * Función para actualizar el perfil del usuario en el sidebar
 */
function actualizarPerfilUsuario(
  nombre: string, 
  email: string | null, 
  puesto: string | null, 
  tipoPersona: string | null
): void {
  // Actualizar nombre completo
  const userNameElement = document.querySelector('.user-info h3');
  if (userNameElement) {
    userNameElement.textContent = nombre;
  }

  // Actualizar email
  const emailElement = document.querySelector('.user-detail strong');
  if (emailElement && emailElement.parentElement) {
    emailElement.parentElement.innerHTML = `<strong>Email:</strong> ${email || 'No disponible'}`;
  }

  // Actualizar área/puesto
  const areaElements = document.querySelectorAll('.user-detail');
  if (areaElements.length >= 2) {
    areaElements[1].innerHTML = `<strong>Área:</strong> ${puesto || 'No asignada'}`;
  }

  // Actualizar rol
  const roleElement = document.querySelector('.user-role');
  if (roleElement) {
    roleElement.textContent = tipoPersona || 'Usuario';
  }

  // Actualizar iniciales en el avatar
  const avatarElement = document.querySelector('.user-avatar span');
  if (avatarElement && nombre) {
    const iniciales = obtenerIniciales(nombre);
    avatarElement.textContent = iniciales;
  }
}

/**
 * Función para obtener las iniciales del nombre
 */
function obtenerIniciales(nombreCompleto: string): string {
  const palabras = nombreCompleto.trim().split(' ');
  if (palabras.length === 1) {
    return palabras[0].substring(0, 2).toUpperCase();
  }
  return (palabras[0].charAt(0) + palabras[palabras.length - 1].charAt(0)).toUpperCase();
}

// ============ BOTONES DE NAVEGACIÓN ============
const btnEmpleados = document.getElementById("btnEmpleados") as HTMLButtonElement;
const btnProductos = document.getElementById("btnProductos") as HTMLButtonElement;
const btnReportes = document.getElementById("btnReportes") as HTMLButtonElement;
const btnVentas = document.getElementById("btnVentas") as HTMLButtonElement;
const btnSalir = document.getElementById("btnSalir") as HTMLButtonElement;

btnEmpleados?.addEventListener("click", () => {
  window.location.href = "DatosPersonales.html";
});

btnReportes?.addEventListener("click", () => {
  window.location.href = "clientes.html"; 
});

btnProductos?.addEventListener("click", () => {
  window.location.href = "clientes.html"; 
});

btnVentas?.addEventListener("click", () => {
  window.location.href = "ventas.html"; 
});

btnSalir?.addEventListener("click", () => {
  const confirmar = confirm("¿Deseas cerrar sesión?");
  if (confirmar) {
    sessionStorage.clear();
    window.location.href = "index.html";
  }
});

// ============ FUNCIONES AUXILIARES GLOBALES ============
function obtenerNombreUsuario(): string {
  return sessionStorage.getItem('usuarioLogueado') || 'Usuario';
}

function obtenerLoginUsuario(): string {
  return sessionStorage.getItem('loginUser') || '';
}

function obtenerDatosPersona(): any {
  const personaStr = sessionStorage.getItem('personaCompleta');
  return personaStr ? JSON.parse(personaStr) : null;
}

function verificarSesion(): boolean {
  return !!sessionStorage.getItem('usuarioLogueado');
}

// Exponer funciones globalmente
if (typeof window !== 'undefined') {
  (window as any).obtenerNombreUsuario = obtenerNombreUsuario;
  (window as any).obtenerLoginUsuario = obtenerLoginUsuario;
  (window as any).obtenerDatosPersona = obtenerDatosPersona;
  (window as any).verificarSesion = verificarSesion;
  (window as any).actualizarPerfilUsuario = actualizarPerfilUsuario;
}