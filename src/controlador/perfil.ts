// ================== INTERFACES ==================
interface UsuarioData {
  CvUser: string;
  CvPerson: string;
  Login: string;
  Password: string;
  FecIni: string;
  FecVen: string;
  EdoCta: string;
}

interface PersonaData {
  idPersona: string;
  Nombre: string;
  ApellidoPaterno: string;
  ApellidoMaterno: string;
  TipoPersona: string;
  Telefono: string;
  Correo: string;
  RFC: string;
  Calle: string;
  Numero: string;
  Colonia: string;
  CodigoPostal: string;
  Ciudad: string;
  Estado: string;
  Puesto: string;
  Salario: string;
  FechaIngreso: string;
  Login: string;
  Password: string;
  EdoCta: string;
  FuenteDeDatos: string;
  Imagen: string;
}

// ================== ELEMENTOS HTML ==================
const nombre = document.getElementById("nombre") as HTMLInputElement;
const apellidos = document.getElementById("apellidos") as HTMLInputElement;
const email = document.getElementById("email") as HTMLInputElement;
const telefono = document.getElementById("telefono") as HTMLInputElement;
const calle = document.getElementById("calle") as HTMLInputElement;
const numero = document.getElementById("numero") as HTMLInputElement;
const colonia = document.getElementById("colonia") as HTMLInputElement;
const codigoPostal = document.getElementById("codigoPostal") as HTMLInputElement;
const ciudad = document.getElementById("ciudad") as HTMLInputElement;
const estado = document.getElementById("estado") as HTMLInputElement;
const nombreUsuario = document.getElementById("nombreUsuario") as HTMLInputElement;
const contrasenaActual = document.getElementById("contrasenaActual") as HTMLInputElement;
const nuevaContrasena = document.getElementById("nuevaContrasena") as HTMLInputElement;
const confirmarContrasena = document.getElementById("confirmarContrasena") as HTMLInputElement;

// Elementos de visualización
const displayName = document.getElementById("displayName") as HTMLElement;
const photoInitial = document.querySelector(".photo-initial") as HTMLElement;
const roleDisplay = document.querySelector(".role-display") as HTMLElement;
const areaDisplay = document.querySelector(".area-display") as HTMLElement;

// Botones
const btnGuardado = document.querySelector(".btn-save") as HTMLButtonElement;
const btnCancelado = document.querySelector(".btn-cancel") as HTMLButtonElement;
const btnEditarFoto = document.querySelector(".edit-photo-btn") as HTMLButtonElement;

// ================== VARIABLES GLOBALES ==================
let usuarioActual: UsuarioData | null = null;
let personaActual: PersonaData | null = null;
let datosOriginales: PersonaData | null = null;

// ================== UTILIDADES ==================
function mostrarMensaje(texto: string, tipo: "exito" | "error" = "exito") {
  const icono = tipo === "exito" ? "✓" : "✗";
  alert(`${icono} ${texto}`);
  console.log(`[${tipo.toUpperCase()}] ${texto}`);
}

function obtenerIniciales(nombreCompleto: string): string {
  const palabras = nombreCompleto.trim().split(" ");
  if (palabras.length === 1) {
    return palabras[0].substring(0, 2).toUpperCase();
  }
  return (palabras[0].charAt(0) + palabras[palabras.length - 1].charAt(0)).toUpperCase();
}

// ================== CARGAR DATOS DEL USUARIO LOGUEADO ==================
async function cargarDatosUsuario() {
  try {
    const loginUsuario = sessionStorage.getItem("loginUser");
    
    if (!loginUsuario) {
      mostrarMensaje("No hay sesión activa. Redirigiendo al login...", "error");
      setTimeout(() => window.location.href = "index.html", 2000);
      return;
    }

    console.log("Cargando datos para usuario:", loginUsuario);

    // Cargar datos de usuario desde index.txt
    const resUsuarios = await fetch("http://localhost:3000/usuarios");
    const textUsuarios = await resUsuarios.text();
    const lineasUsuarios = textUsuarios.split("\n").map(l => l.trim()).filter(l => l);

    if (lineasUsuarios.length <= 1) {
      mostrarMensaje("No se encontraron usuarios", "error");
      return;
    }

    const headersUsuarios = lineasUsuarios[0].split("\t");
    const usuarios = lineasUsuarios.slice(1).map(linea => {
      const cols = linea.split("\t");
      const u: any = {};
      headersUsuarios.forEach((h, i) => (u[h.trim()] = cols[i]?.trim() || ""));
      return u as UsuarioData;
    });

    usuarioActual = usuarios.find(u => u.Login === loginUsuario) || null;

    if (!usuarioActual) {
      mostrarMensaje("Usuario no encontrado", "error");
      return;
    }

    console.log("Usuario encontrado:", usuarioActual);

    // Cargar datos de persona desde Personas.txt
    const resPersonas = await fetch("http://localhost:3000/personas");
    const textPersonas = await resPersonas.text();
    const lineasPersonas = textPersonas.split("\n").map(l => l.trim()).filter(l => l);

    if (lineasPersonas.length <= 1) {
      mostrarMensaje("No se encontraron datos de personas", "error");
      return;
    }

    const headersPersonas = lineasPersonas[0].split("\t");
    const personas = lineasPersonas.slice(1).map(linea => {
      const cols = linea.split("\t");
      const p: any = {};
      headersPersonas.forEach((h, i) => (p[h.trim()] = cols[i]?.trim() || ""));
      return p as PersonaData;
    });

    personaActual = personas.find(p => p.idPersona === usuarioActual?.CvPerson) || null;

    if (!personaActual) {
      mostrarMensaje("Datos de persona no encontrados", "error");
      return;
    }

    console.log("Persona encontrada:", personaActual);

    // Guardar copia de los datos originales
    datosOriginales = { ...personaActual };

    // Llenar el formulario
    llenarFormulario();
    actualizarVisualizacion();

  } catch (error) {
    console.error("Error al cargar datos:", error);
    mostrarMensaje("Error al cargar los datos del perfil", "error");
  }
}

// ================== LLENAR FORMULARIO ==================
function llenarFormulario() {
  if (!personaActual || !usuarioActual) return;

  // Información Personal
  nombre.value = personaActual.Nombre;
  apellidos.value = `${personaActual.ApellidoPaterno} ${personaActual.ApellidoMaterno}`.trim();
  email.value = personaActual.Correo;
  telefono.value = personaActual.Telefono;

  // Dirección
  calle.value = personaActual.Calle;
  numero.value = personaActual.Numero;
  colonia.value = personaActual.Colonia;
  codigoPostal.value = personaActual.CodigoPostal;
  ciudad.value = personaActual.Ciudad;
  estado.value = personaActual.Estado;

  // Credenciales
  nombreUsuario.value = usuarioActual.Login;

  console.log("Formulario llenado con datos actuales");
}

// ================== ACTUALIZAR VISUALIZACIÓN ==================
function actualizarVisualizacion() {
  if (!personaActual) return;

  const nombreCompleto = `${personaActual.Nombre} ${personaActual.ApellidoPaterno} ${personaActual.ApellidoMaterno}`.trim();
  
  displayName.textContent = nombreCompleto;
  photoInitial.textContent = obtenerIniciales(nombreCompleto);
  roleDisplay.textContent = personaActual.TipoPersona;
  areaDisplay.textContent = personaActual.Puesto || "Sin área asignada";

  // Actualizar la foto si existe
  if (personaActual.Imagen && personaActual.Imagen !== "") {
    const photoContainer = document.querySelector(".profile-photo") as HTMLElement;
    if (photoContainer) {
      photoContainer.style.backgroundImage = `url('${personaActual.Imagen}')`;
      photoContainer.style.backgroundSize = "cover";
      photoContainer.style.backgroundPosition = "center";
      photoInitial.style.display = "none";
    }
  }
}

// ================== VALIDACIONES ==================
function validarCambioContrasena(): boolean {
  const actual = contrasenaActual.value.trim();
  const nueva = nuevaContrasena.value.trim();
  const confirmar = confirmarContrasena.value.trim();

  // Si algún campo de contraseña tiene valor, validar todos
  if (actual || nueva || confirmar) {
    if (!actual) {
      mostrarMensaje("Debes ingresar tu contraseña actual", "error");
      return false;
    }

    if (actual !== usuarioActual?.Password) {
      mostrarMensaje("La contraseña actual es incorrecta", "error");
      return false;
    }

    if (!nueva) {
      mostrarMensaje("Debes ingresar una nueva contraseña", "error");
      return false;
    }

    if (nueva.length < 8) {
      mostrarMensaje("La nueva contraseña debe tener al menos 8 caracteres", "error");
      return false;
    }

    if (nueva !== confirmar) {
      mostrarMensaje("Las contraseñas no coinciden", "error");
      return false;
    }
  }

  return true;
}

function validarFormulario(): boolean {
  if (!nombre.value.trim()) {
    mostrarMensaje("El nombre es obligatorio", "error");
    return false;
  }

  if (!email.value.trim()) {
    mostrarMensaje("El email es obligatorio", "error");
    return false;
  }

  // Validar formato de email
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email.value)) {
    mostrarMensaje("El formato del email no es válido", "error");
    return false;
  }

  if (!telefono.value.trim()) {
    mostrarMensaje("El teléfono es obligatorio", "error");
    return false;
  }

  if (!nombreUsuario.value.trim()) {
    mostrarMensaje("El nombre de usuario es obligatorio", "error");
    return false;
  }

  return validarCambioContrasena();
}

// ================== GUARDAR CAMBIOS ==================
async function guardarCambios() {
  if (!validarFormulario()) return;
  if (!personaActual || !usuarioActual) return;

  try {
    // Separar apellidos
    const apellidosCompletos = apellidos.value.trim();
    const partesApellidos = apellidosCompletos.split(/\s+/);
    const apellidoPaterno = partesApellidos[0] || "";
    const apellidoMaterno = partesApellidos.slice(1).join(" ") || "";

    // CRÍTICO: Preparar datos de persona preservando TODOS los campos originales
    // Solo actualizamos los campos que están en el formulario
    const datosPersona: PersonaData = {
      // Preservar todos los campos originales
      ...personaActual,
      // Actualizar solo los campos del formulario
      Nombre: nombre.value.trim(),
      ApellidoPaterno: apellidoPaterno,
      ApellidoMaterno: apellidoMaterno,
      Correo: email.value.trim(),
      Telefono: telefono.value.trim(),
      Calle: calle.value.trim(),
      Numero: numero.value.trim(),
      Colonia: colonia.value.trim(),
      CodigoPostal: codigoPostal.value.trim(),
      Ciudad: ciudad.value.trim(),
      Estado: estado.value.trim(),
    };

    console.log("Enviando datos completos de persona:", datosPersona);

    // Guardar persona
    const resPersona = await fetch("http://localhost:3000/personas/guardar", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(datosPersona),
    });

    if (!resPersona.ok) {
      const errorText = await resPersona.text();
      console.error("Error del servidor:", errorText);
      throw new Error("Error al actualizar datos de persona");
    }

    // Si hay cambio de contraseña o usuario, actualizar usuario
    const cambioUsuario = nombreUsuario.value.trim() !== usuarioActual.Login;
    const cambioContrasena = nuevaContrasena.value.trim() !== "";

    if (cambioUsuario || cambioContrasena) {
      const datosUsuario = {
        CvUser: usuarioActual.CvUser,
        CvPerson: usuarioActual.CvPerson,
        Login: nombreUsuario.value.trim(),
        Password: cambioContrasena ? nuevaContrasena.value.trim() : usuarioActual.Password,
        FecIni: usuarioActual.FecIni,
        FecVen: usuarioActual.FecVen,
        EdoCta: usuarioActual.EdoCta
      };

      const resUsuario = await fetch("http://localhost:3000/usuarios/actualizar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(datosUsuario),
      });

      if (!resUsuario.ok) {
        throw new Error("Error al actualizar credenciales");
      }

      // Actualizar sessionStorage si cambió el login
      if (cambioUsuario) {
        sessionStorage.setItem("loginUser", nombreUsuario.value.trim());
      }
    }

    mostrarMensaje("Perfil actualizado correctamente", "exito");

    // Actualizar sessionStorage con nuevos datos
    const nombreCompleto = `${datosPersona.Nombre} ${datosPersona.ApellidoPaterno} ${datosPersona.ApellidoMaterno}`.trim();
    sessionStorage.setItem("usuarioLogueado", nombreCompleto);
    sessionStorage.setItem("puesto", datosPersona.Puesto);
    
    // ⭐ NUEVO: Guardar imagen en sessionStorage
    if (datosPersona.Imagen) {
      sessionStorage.setItem("imagenPerfil", datosPersona.Imagen);
    }

    // Recargar datos
    await cargarDatosUsuario();

    // Limpiar campos de contraseña
    contrasenaActual.value = "";
    nuevaContrasena.value = "";
    confirmarContrasena.value = "";

    // Actualizar sidebar si existe la instancia
    if (typeof window !== 'undefined' && (window as any).getSidebarInstance) {
      const sidebar = (window as any).getSidebarInstance();
      if (sidebar) {
        sidebar.actualizarDatos(
          nombreCompleto,
          datosPersona.Correo,
          datosPersona.Puesto,
          datosPersona.TipoPersona,
          datosPersona.Imagen // ⭐ NUEVO: Pasar la URL de la imagen
        );
      }
    }

  } catch (error) {
    console.error("Error al guardar cambios:", error);
    mostrarMensaje("Error al actualizar el perfil", "error");
  }
}

// ================== CANCELAR CAMBIOS ==================
function cancelarCambios() {
  const confirmar = confirm("¿Estás seguro de que deseas descartar los cambios?");
  
  if (confirmar) {
    if (datosOriginales) {
      personaActual = { ...datosOriginales };
      llenarFormulario();
      contrasenaActual.value = "";
      nuevaContrasena.value = "";
      confirmarContrasena.value = "";
      mostrarMensaje("Cambios descartados", "exito");
    }
  }
}

// ================== CAMBIAR FOTO DE PERFIL ==================
function cambiarFoto() {
  const input = document.createElement("input");
  input.type = "file";
  input.accept = "image/jpeg,image/png,image/gif";
  
  input.onchange = async (e: Event) => {
    const file = (e.target as HTMLInputElement).files?.[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      mostrarMensaje("La imagen no debe superar los 2MB", "error");
      return;
    }

    if (!["image/jpeg", "image/png", "image/gif"].includes(file.type)) {
      mostrarMensaje("Solo se permiten imágenes JPG, PNG o GIF", "error");
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const base64 = e.target?.result as string;

      sessionStorage.setItem("imagenPerfil", base64);

      if (personaActual) {
        personaActual.Imagen = base64;
      }

      const photoContainer = document.querySelector(".profile-photo") as HTMLElement;
      if (photoContainer) {
        photoContainer.style.backgroundImage = `url('${base64}')`;
        photoContainer.style.backgroundSize = "cover";
        photoContainer.style.backgroundPosition = "center";
        photoInitial.style.display = "none";
      }

      mostrarMensaje("Foto actualizada. No olvides guardar los cambios.", "exito");
    };
    reader.readAsDataURL(file);
  };

  input.click();
}


// ================== EVENT LISTENERS ==================
btnGuardado.addEventListener("click", guardarCambios);
btnCancelado.addEventListener("click", cancelarCambios);
btnEditarFoto.addEventListener("click", cambiarFoto);

// ================== INICIALIZACIÓN ==================
document.addEventListener("DOMContentLoaded", () => {
  console.log("Módulo de perfil iniciado");
  cargarDatosUsuario();
});"../Img/Login usuario.png"