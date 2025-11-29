var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
// ================== ELEMENTOS HTML ==================
var nombre = document.getElementById("nombre");
var apellidos = document.getElementById("apellidos");
var email = document.getElementById("email");
var telefono = document.getElementById("telefono");
var calle = document.getElementById("calle");
var numero = document.getElementById("numero");
var colonia = document.getElementById("colonia");
var codigoPostal = document.getElementById("codigoPostal");
var ciudad = document.getElementById("ciudad");
var estado = document.getElementById("estado");
var nombreUsuario = document.getElementById("nombreUsuario");
var contrasenaActual = document.getElementById("contrasenaActual");
var nuevaContrasena = document.getElementById("nuevaContrasena");
var confirmarContrasena = document.getElementById("confirmarContrasena");
// Elementos de visualización
var displayName = document.getElementById("displayName");
var photoInitial = document.querySelector(".photo-initial");
var roleDisplay = document.querySelector(".role-display");
var areaDisplay = document.querySelector(".area-display");
// Botones
var btnGuardado = document.querySelector(".btn-save");
var btnCancelado = document.querySelector(".btn-cancel");
var btnEditarFoto = document.querySelector(".edit-photo-btn");
// ================== VARIABLES GLOBALES ==================
var usuarioActual = null;
var personaActual = null;
var datosOriginales = null;
// ================== UTILIDADES ==================
function mostrarMensaje(texto, tipo) {
    if (tipo === void 0) { tipo = "exito"; }
    var icono = tipo === "exito" ? "✓" : "✗";
    alert("".concat(icono, " ").concat(texto));
    console.log("[".concat(tipo.toUpperCase(), "] ").concat(texto));
}
function obtenerIniciales(nombreCompleto) {
    var palabras = nombreCompleto.trim().split(" ");
    if (palabras.length === 1) {
        return palabras[0].substring(0, 2).toUpperCase();
    }
    return (palabras[0].charAt(0) + palabras[palabras.length - 1].charAt(0)).toUpperCase();
}
// ================== CARGAR DATOS DEL USUARIO LOGUEADO ==================
function cargarDatosUsuario() {
    return __awaiter(this, void 0, void 0, function () {
        var loginUsuario_1, resUsuarios, textUsuarios, lineasUsuarios, headersUsuarios_1, usuarios, resPersonas, textPersonas, lineasPersonas, headersPersonas_1, personas, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 5, , 6]);
                    loginUsuario_1 = sessionStorage.getItem("loginUser");
                    if (!loginUsuario_1) {
                        mostrarMensaje("No hay sesión activa. Redirigiendo al login...", "error");
                        setTimeout(function () { return window.location.href = "index.html"; }, 2000);
                        return [2 /*return*/];
                    }
                    console.log("Cargando datos para usuario:", loginUsuario_1);
                    return [4 /*yield*/, fetch("http://localhost:3000/usuarios")];
                case 1:
                    resUsuarios = _a.sent();
                    return [4 /*yield*/, resUsuarios.text()];
                case 2:
                    textUsuarios = _a.sent();
                    lineasUsuarios = textUsuarios.split("\n").map(function (l) { return l.trim(); }).filter(function (l) { return l; });
                    if (lineasUsuarios.length <= 1) {
                        mostrarMensaje("No se encontraron usuarios", "error");
                        return [2 /*return*/];
                    }
                    headersUsuarios_1 = lineasUsuarios[0].split("\t");
                    usuarios = lineasUsuarios.slice(1).map(function (linea) {
                        var cols = linea.split("\t");
                        var u = {};
                        headersUsuarios_1.forEach(function (h, i) { var _a; return (u[h.trim()] = ((_a = cols[i]) === null || _a === void 0 ? void 0 : _a.trim()) || ""); });
                        return u;
                    });
                    usuarioActual = usuarios.find(function (u) { return u.Login === loginUsuario_1; }) || null;
                    if (!usuarioActual) {
                        mostrarMensaje("Usuario no encontrado", "error");
                        return [2 /*return*/];
                    }
                    console.log("Usuario encontrado:", usuarioActual);
                    return [4 /*yield*/, fetch("http://localhost:3000/personas")];
                case 3:
                    resPersonas = _a.sent();
                    return [4 /*yield*/, resPersonas.text()];
                case 4:
                    textPersonas = _a.sent();
                    lineasPersonas = textPersonas.split("\n").map(function (l) { return l.trim(); }).filter(function (l) { return l; });
                    if (lineasPersonas.length <= 1) {
                        mostrarMensaje("No se encontraron datos de personas", "error");
                        return [2 /*return*/];
                    }
                    headersPersonas_1 = lineasPersonas[0].split("\t");
                    personas = lineasPersonas.slice(1).map(function (linea) {
                        var cols = linea.split("\t");
                        var p = {};
                        headersPersonas_1.forEach(function (h, i) { var _a; return (p[h.trim()] = ((_a = cols[i]) === null || _a === void 0 ? void 0 : _a.trim()) || ""); });
                        return p;
                    });
                    personaActual = personas.find(function (p) { return p.idPersona === (usuarioActual === null || usuarioActual === void 0 ? void 0 : usuarioActual.CvPerson); }) || null;
                    if (!personaActual) {
                        mostrarMensaje("Datos de persona no encontrados", "error");
                        return [2 /*return*/];
                    }
                    console.log("Persona encontrada:", personaActual);
                    // Guardar copia de los datos originales
                    datosOriginales = __assign({}, personaActual);
                    // Llenar el formulario
                    llenarFormulario();
                    actualizarVisualizacion();
                    return [3 /*break*/, 6];
                case 5:
                    error_1 = _a.sent();
                    console.error("Error al cargar datos:", error_1);
                    mostrarMensaje("Error al cargar los datos del perfil", "error");
                    return [3 /*break*/, 6];
                case 6: return [2 /*return*/];
            }
        });
    });
}
// ================== LLENAR FORMULARIO ==================
function llenarFormulario() {
    if (!personaActual || !usuarioActual)
        return;
    // Información Personal
    nombre.value = personaActual.Nombre;
    apellidos.value = "".concat(personaActual.ApellidoPaterno, " ").concat(personaActual.ApellidoMaterno).trim();
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
    if (!personaActual)
        return;
    var nombreCompleto = "".concat(personaActual.Nombre, " ").concat(personaActual.ApellidoPaterno, " ").concat(personaActual.ApellidoMaterno).trim();
    displayName.textContent = nombreCompleto;
    photoInitial.textContent = obtenerIniciales(nombreCompleto);
    roleDisplay.textContent = personaActual.TipoPersona;
    areaDisplay.textContent = personaActual.Puesto || "Sin área asignada";
    // Actualizar la foto si existe
    if (personaActual.Imagen && personaActual.Imagen !== "") {
        var photoContainer = document.querySelector(".profile-photo");
        if (photoContainer) {
            photoContainer.style.backgroundImage = "url('".concat(personaActual.Imagen, "')");
            photoContainer.style.backgroundSize = "cover";
            photoContainer.style.backgroundPosition = "center";
            photoInitial.style.display = "none";
        }
    }
}
// ================== VALIDACIONES ==================
function validarCambioContrasena() {
    var actual = contrasenaActual.value.trim();
    var nueva = nuevaContrasena.value.trim();
    var confirmar = confirmarContrasena.value.trim();
    // Si algún campo de contraseña tiene valor, validar todos
    if (actual || nueva || confirmar) {
        if (!actual) {
            mostrarMensaje("Debes ingresar tu contraseña actual", "error");
            return false;
        }
        if (actual !== (usuarioActual === null || usuarioActual === void 0 ? void 0 : usuarioActual.Password)) {
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
function validarFormulario() {
    if (!nombre.value.trim()) {
        mostrarMensaje("El nombre es obligatorio", "error");
        return false;
    }
    if (!email.value.trim()) {
        mostrarMensaje("El email es obligatorio", "error");
        return false;
    }
    // Validar formato de email
    var emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
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
function guardarCambios() {
    return __awaiter(this, void 0, void 0, function () {
        var apellidosCompletos, partesApellidos, apellidoPaterno, apellidoMaterno, datosPersona, resPersona, errorText, cambioUsuario, cambioContrasena, datosUsuario, resUsuario, nombreCompleto, sidebar, error_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!validarFormulario())
                        return [2 /*return*/];
                    if (!personaActual || !usuarioActual)
                        return [2 /*return*/];
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 8, , 9]);
                    apellidosCompletos = apellidos.value.trim();
                    partesApellidos = apellidosCompletos.split(/\s+/);
                    apellidoPaterno = partesApellidos[0] || "";
                    apellidoMaterno = partesApellidos.slice(1).join(" ") || "";
                    datosPersona = __assign(__assign({}, personaActual), { 
                        // Actualizar solo los campos del formulario
                        Nombre: nombre.value.trim(), ApellidoPaterno: apellidoPaterno, ApellidoMaterno: apellidoMaterno, Correo: email.value.trim(), Telefono: telefono.value.trim(), Calle: calle.value.trim(), Numero: numero.value.trim(), Colonia: colonia.value.trim(), CodigoPostal: codigoPostal.value.trim(), Ciudad: ciudad.value.trim(), Estado: estado.value.trim() });
                    console.log("Enviando datos completos de persona:", datosPersona);
                    return [4 /*yield*/, fetch("http://localhost:3000/personas/guardar", {
                            method: "POST",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify(datosPersona),
                        })];
                case 2:
                    resPersona = _a.sent();
                    if (!!resPersona.ok) return [3 /*break*/, 4];
                    return [4 /*yield*/, resPersona.text()];
                case 3:
                    errorText = _a.sent();
                    console.error("Error del servidor:", errorText);
                    throw new Error("Error al actualizar datos de persona");
                case 4:
                    cambioUsuario = nombreUsuario.value.trim() !== usuarioActual.Login;
                    cambioContrasena = nuevaContrasena.value.trim() !== "";
                    if (!(cambioUsuario || cambioContrasena)) return [3 /*break*/, 6];
                    datosUsuario = {
                        CvUser: usuarioActual.CvUser,
                        CvPerson: usuarioActual.CvPerson,
                        Login: nombreUsuario.value.trim(),
                        Password: cambioContrasena ? nuevaContrasena.value.trim() : usuarioActual.Password,
                        FecIni: usuarioActual.FecIni,
                        FecVen: usuarioActual.FecVen,
                        EdoCta: usuarioActual.EdoCta
                    };
                    return [4 /*yield*/, fetch("http://localhost:3000/usuarios/actualizar", {
                            method: "POST",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify(datosUsuario),
                        })];
                case 5:
                    resUsuario = _a.sent();
                    if (!resUsuario.ok) {
                        throw new Error("Error al actualizar credenciales");
                    }
                    // Actualizar sessionStorage si cambió el login
                    if (cambioUsuario) {
                        sessionStorage.setItem("loginUser", nombreUsuario.value.trim());
                    }
                    _a.label = 6;
                case 6:
                    mostrarMensaje("Perfil actualizado correctamente", "exito");
                    nombreCompleto = "".concat(datosPersona.Nombre, " ").concat(datosPersona.ApellidoPaterno, " ").concat(datosPersona.ApellidoMaterno).trim();
                    sessionStorage.setItem("usuarioLogueado", nombreCompleto);
                    sessionStorage.setItem("puesto", datosPersona.Puesto);
                    // ⭐ NUEVO: Guardar imagen en sessionStorage
                    if (datosPersona.Imagen) {
                        sessionStorage.setItem("imagenPerfil", datosPersona.Imagen);
                    }
                    // Recargar datos
                    return [4 /*yield*/, cargarDatosUsuario()];
                case 7:
                    // Recargar datos
                    _a.sent();
                    // Limpiar campos de contraseña
                    contrasenaActual.value = "";
                    nuevaContrasena.value = "";
                    confirmarContrasena.value = "";
                    // Actualizar sidebar si existe la instancia
                    if (typeof window !== 'undefined' && window.getSidebarInstance) {
                        sidebar = window.getSidebarInstance();
                        if (sidebar) {
                            sidebar.actualizarDatos(nombreCompleto, datosPersona.Correo, datosPersona.Puesto, datosPersona.TipoPersona, datosPersona.Imagen // ⭐ NUEVO: Pasar la URL de la imagen
                            );
                        }
                    }
                    return [3 /*break*/, 9];
                case 8:
                    error_2 = _a.sent();
                    console.error("Error al guardar cambios:", error_2);
                    mostrarMensaje("Error al actualizar el perfil", "error");
                    return [3 /*break*/, 9];
                case 9: return [2 /*return*/];
            }
        });
    });
}
// ================== CANCELAR CAMBIOS ==================
function cancelarCambios() {
    var confirmar = confirm("¿Estás seguro de que deseas descartar los cambios?");
    if (confirmar) {
        if (datosOriginales) {
            personaActual = __assign({}, datosOriginales);
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
    var _this = this;
    var input = document.createElement("input");
    input.type = "file";
    input.accept = "image/jpeg,image/png,image/gif";
    input.onchange = function (e) { return __awaiter(_this, void 0, void 0, function () {
        var file, reader;
        var _a;
        return __generator(this, function (_b) {
            file = (_a = e.target.files) === null || _a === void 0 ? void 0 : _a[0];
            if (!file)
                return [2 /*return*/];
            if (file.size > 2 * 1024 * 1024) {
                mostrarMensaje("La imagen no debe superar los 2MB", "error");
                return [2 /*return*/];
            }
            if (!["image/jpeg", "image/png", "image/gif"].includes(file.type)) {
                mostrarMensaje("Solo se permiten imágenes JPG, PNG o GIF", "error");
                return [2 /*return*/];
            }
            reader = new FileReader();
            reader.onload = function (e) {
                var _a;
                var base64 = (_a = e.target) === null || _a === void 0 ? void 0 : _a.result;
                sessionStorage.setItem("imagenPerfil", base64);
                if (personaActual) {
                    personaActual.Imagen = base64;
                }
                var photoContainer = document.querySelector(".profile-photo");
                if (photoContainer) {
                    photoContainer.style.backgroundImage = "url('".concat(base64, "')");
                    photoContainer.style.backgroundSize = "cover";
                    photoContainer.style.backgroundPosition = "center";
                    photoInitial.style.display = "none";
                }
                mostrarMensaje("Foto actualizada. No olvides guardar los cambios.", "exito");
            };
            reader.readAsDataURL(file);
            return [2 /*return*/];
        });
    }); };
    input.click();
}
// ================== EVENT LISTENERS ==================
btnGuardado.addEventListener("click", guardarCambios);
btnCancelado.addEventListener("click", cancelarCambios);
btnEditarFoto.addEventListener("click", cambiarFoto);
// ================== INICIALIZACIÓN ==================
document.addEventListener("DOMContentLoaded", function () {
    console.log("Módulo de perfil iniciado");
    cargarDatosUsuario();
});
"../Img/Login usuario.png";
