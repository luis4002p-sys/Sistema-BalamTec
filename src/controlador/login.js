// login.ts - Versión corregida para evitar duplicación y deformación
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
// =============================
// Estado / Guardas
// =============================
var globalMsgTimeout;
var usuariosCargados = false;
// =============================
// Elementos del formulario (aserciones TS)
// =============================
var loginForm = document.getElementById('loginForm');
var msgDisplay = document.querySelector('.msg');
var generalAlert = document.getElementById('generalAlert');
var alertMessage = document.getElementById('alertMessage');
var usernameField = document.getElementById('username');
var passwordField = document.getElementById('password');
var usernameErrorDiv = document.getElementById('usernameError');
var passwordErrorDiv = document.getElementById('passwordError');
var users = [];
// =============================
// Utilidades
// =============================
function parseDate(str) {
    if (!str)
        return null;
    var parts = str.split(/[\/\-]/).map(Number);
    if (parts.length < 3)
        return null;
    return parts[2] < 1000
        ? new Date(parts[2] + 2000, parts[1] - 1, parts[0])
        : new Date(parts[2], parts[1] - 1, parts[0]);
}
/**
 * Forzar estilos mínimos a la alerta general para que sea "flotante" y no empuje
 * Se ejecuta una sola vez al iniciar si existe generalAlert.
 */
function ensureGeneralAlertFloating() {
    if (!generalAlert)
        return;
    // No sobrescribimos estilos complejos; solo añadimos lo mínimo para que no empuje el layout.
    generalAlert.style.position = 'absolute';
    generalAlert.style.top = '1rem';
    generalAlert.style.left = '1rem';
    generalAlert.style.right = '1rem';
    generalAlert.style.zIndex = '1500';
    // Evitar que ocupe espacio cuando esté oculta (si tu CSS usa display)
    // Deja que la clase 'show' controle la visibilidad.
}
/**
 * Limpia SOLO mensajes generales (no borra errores de inputs)
 */
function clearGeneralMessages() {
    if (generalAlert)
        generalAlert.classList.remove('show');
    if (alertMessage)
        alertMessage.textContent = '';
    if (msgDisplay) {
        msgDisplay.classList.remove('show', 'error', 'success');
        msgDisplay.textContent = '';
    }
    if (globalMsgTimeout) {
        clearTimeout(globalMsgTimeout);
        globalMsgTimeout = undefined;
    }
}
/**
 * Limpia TODOS los errores (inputs + mensajes)
 */
function clearAllErrors() {
    clearGeneralMessages();
    usernameField === null || usernameField === void 0 ? void 0 : usernameField.classList.remove('error');
    passwordField === null || passwordField === void 0 ? void 0 : passwordField.classList.remove('error');
    usernameErrorDiv === null || usernameErrorDiv === void 0 ? void 0 : usernameErrorDiv.classList.remove('show');
    passwordErrorDiv === null || passwordErrorDiv === void 0 ? void 0 : passwordErrorDiv.classList.remove('show');
}
/**
 * Muestra un error: policy -> mostrar en ALERT superior (flotante) para no empujar
 */
function showError(message) {
    // Si ya se muestra exactamente el mismo mensaje en generalAlert, no re-ejecutar.
    if (generalAlert && alertMessage) {
        var current = alertMessage.textContent || '';
        if (current === message && generalAlert.classList.contains('show')) {
            // Ya está visible con el mismo texto -> reiniciar timeout solamente
            if (globalMsgTimeout)
                clearTimeout(globalMsgTimeout);
            globalMsgTimeout = window.setTimeout(function () {
                clearGeneralMessages();
            }, 5000);
            return;
        }
    }
    // ocultar toast si está visible (evitamos duplicación con success)
    if (msgDisplay) {
        msgDisplay.classList.remove('show', 'success', 'error');
        msgDisplay.textContent = '';
    }
    // Mostrar en la alerta superior
    if (alertMessage)
        alertMessage.textContent = message;
    if (generalAlert)
        generalAlert.classList.add('show');
    // programar auto-hide
    if (globalMsgTimeout)
        clearTimeout(globalMsgTimeout);
    globalMsgTimeout = window.setTimeout(function () {
        clearGeneralMessages();
    }, 5000);
}
/**
 * Muestra éxito: policy -> mostrar en TOAST (msgDisplay) y no tocar la alerta superior
 */
function showSuccess(message) {
    // Si el toast ya muestra lo mismo, no re-ejecutar animación redundante
    if (msgDisplay) {
        var current = msgDisplay.textContent || '';
        if (current === message && msgDisplay.classList.contains('show')) {
            return;
        }
    }
    // Ocultar alerta superior si existiera
    if (generalAlert)
        generalAlert.classList.remove('show');
    if (alertMessage)
        alertMessage.textContent = '';
    // Mostrar toast
    if (msgDisplay) {
        msgDisplay.textContent = message;
        msgDisplay.classList.remove('error', 'success');
        msgDisplay.classList.add('show', 'success');
        // auto-hide success after 3s
        if (globalMsgTimeout)
            clearTimeout(globalMsgTimeout);
        globalMsgTimeout = window.setTimeout(function () {
            if (msgDisplay) {
                msgDisplay.classList.remove('show', 'success');
                msgDisplay.textContent = '';
            }
            globalMsgTimeout = undefined;
        }, 3000);
    }
}
/**
 * Limpia los inputs
 */
function clearInputs() {
    if (usernameField)
        usernameField.value = '';
    if (passwordField)
        passwordField.value = '';
}
/**
 * Validación básica
 */
function validateInputs() {
    var isValid = true;
    // Solo limpiamos errores de inputs aquí — no tocamos mensajes globales
    usernameField === null || usernameField === void 0 ? void 0 : usernameField.classList.remove('error');
    passwordField === null || passwordField === void 0 ? void 0 : passwordField.classList.remove('error');
    usernameErrorDiv === null || usernameErrorDiv === void 0 ? void 0 : usernameErrorDiv.classList.remove('show');
    passwordErrorDiv === null || passwordErrorDiv === void 0 ? void 0 : passwordErrorDiv.classList.remove('show');
    if (!usernameField || usernameField.value.trim() === '') {
        usernameField === null || usernameField === void 0 ? void 0 : usernameField.classList.add('error');
        usernameErrorDiv === null || usernameErrorDiv === void 0 ? void 0 : usernameErrorDiv.classList.add('show');
        var sp = usernameErrorDiv === null || usernameErrorDiv === void 0 ? void 0 : usernameErrorDiv.querySelector('span');
        if (sp)
            sp.textContent = 'El nombre de usuario es requerido';
        isValid = false;
    }
    if (!passwordField || passwordField.value.trim() === '') {
        passwordField === null || passwordField === void 0 ? void 0 : passwordField.classList.add('error');
        passwordErrorDiv === null || passwordErrorDiv === void 0 ? void 0 : passwordErrorDiv.classList.add('show');
        var sp = passwordErrorDiv === null || passwordErrorDiv === void 0 ? void 0 : passwordErrorDiv.querySelector('span');
        if (sp)
            sp.textContent = 'La contraseña es requerida';
        isValid = false;
    }
    return isValid;
}
// =============================
// Eventos de input (no limpian mensajes globales)
// =============================
usernameField === null || usernameField === void 0 ? void 0 : usernameField.addEventListener('input', function () {
    usernameField.classList.remove('error');
    usernameErrorDiv === null || usernameErrorDiv === void 0 ? void 0 : usernameErrorDiv.classList.remove('show');
});
passwordField === null || passwordField === void 0 ? void 0 : passwordField.addEventListener('input', function () {
    passwordField.classList.remove('error');
    passwordErrorDiv === null || passwordErrorDiv === void 0 ? void 0 : passwordErrorDiv.classList.remove('show');
});
// =============================
// Cargar usuarios (evitar duplicados)
// =============================
function cargarUsuarios() {
    return __awaiter(this, void 0, void 0, function () {
        var response, text, lines, err_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    // Evitar recarga si ya se cargó (por seguridad)
                    if (usuariosCargados)
                        return [2 /*return*/];
                    usuariosCargados = true;
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 4, , 5]);
                    return [4 /*yield*/, fetch('http://localhost:3000/usuarios')];
                case 2:
                    response = _a.sent();
                    if (!response.ok)
                        throw new Error("Error HTTP ".concat(response.status));
                    return [4 /*yield*/, response.text()];
                case 3:
                    text = _a.sent();
                    lines = text.split('\n').map(function (l) { return l.trim(); }).filter(function (l) { return l; });
                    if (lines.length <= 1) {
                        users = [];
                        return [2 /*return*/];
                    }
                    // descartamos cabecera
                    lines.shift();
                    users = lines.map(function (line) {
                        var cols = line.split(/\t|,/);
                        return {
                            CvUser: cols[0] || '',
                            CvPerson: cols[1] || '',
                            Login: cols[2] || '',
                            Password: cols[3] || '',
                            FecIni: parseDate(cols[4]),
                            FecVen: parseDate(cols[5]),
                            EdoCta: (cols[6] || '').toUpperCase() === 'TRUE'
                        };
                    });
                    return [3 /*break*/, 5];
                case 4:
                    err_1 = _a.sent();
                    console.error('Error al cargar usuarios:', err_1);
                    // Mostrar un mensaje de error no intrusivo
                    showError('No se pudieron cargar usuarios. Intente nuevamente.');
                    return [3 /*break*/, 5];
                case 5: return [2 /*return*/];
            }
        });
    });
}
// =============================
// Obtener persona por CV
// =============================
function obtenerPersonaPorId(cvPerson) {
    return __awaiter(this, void 0, void 0, function () {
        var res, err_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 3, , 4]);
                    return [4 /*yield*/, fetch("http://localhost:3000/personas/".concat(cvPerson))];
                case 1:
                    res = _a.sent();
                    if (!res.ok)
                        return [2 /*return*/, null];
                    return [4 /*yield*/, res.json()];
                case 2: return [2 /*return*/, _a.sent()];
                case 3:
                    err_2 = _a.sent();
                    console.warn('Error al obtener persona:', err_2);
                    return [2 /*return*/, null];
                case 4: return [2 /*return*/];
            }
        });
    });
}
// =============================
// Listener submit (asegurar single attachment)
// =============================
function attachSubmitOnce() {
    var _this = this;
    if (!loginForm)
        return;
    if (loginForm.dataset.listener === 'true')
        return;
    loginForm.addEventListener('submit', function (ev) { return __awaiter(_this, void 0, void 0, function () {
        var username, password, now, user, hoy, vence, persona, nombreCompleto, partes;
        var _this = this;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    ev.preventDefault();
                    // Validación
                    if (!validateInputs()) {
                        // Si la validación falla, mostramos error en la alerta superior
                        showError('Verifica los campos requeridos');
                        return [2 /*return*/];
                    }
                    username = (usernameField === null || usernameField === void 0 ? void 0 : usernameField.value.trim()) || '';
                    password = (passwordField === null || passwordField === void 0 ? void 0 : passwordField.value.trim()) || '';
                    now = new Date();
                    user = users.find(function (u) { return u.Login === username && u.Password === password; });
                    if (!user) {
                        showError('Usuario o contraseña incorrectos');
                        clearInputs();
                        return [2 /*return*/];
                    }
                    // Estado de cuenta
                    if (!user.EdoCta) {
                        showError('Cuenta inactiva o caducada');
                        clearInputs();
                        return [2 /*return*/];
                    }
                    // Fecha inicio
                    if (user.FecIni && now < user.FecIni) {
                        showError('La cuenta aún no está activa');
                        clearInputs();
                        return [2 /*return*/];
                    }
                    // Vencimiento
                    if (user.FecVen) {
                        hoy = new Date(now.getFullYear(), now.getMonth(), now.getDate());
                        vence = new Date(user.FecVen.getFullYear(), user.FecVen.getMonth(), user.FecVen.getDate());
                        if (hoy.getTime() > vence.getTime()) {
                            showError('La cuenta ha expirado. Se desactivará.');
                            // Desactivar en backend (no bloqueante)
                            setTimeout(function () { return __awaiter(_this, void 0, void 0, function () {
                                var err_3;
                                return __generator(this, function (_a) {
                                    switch (_a.label) {
                                        case 0:
                                            _a.trys.push([0, 2, , 3]);
                                            return [4 /*yield*/, fetch('http://localhost:3000/usuarios/actualizarEstado', {
                                                    method: 'POST',
                                                    headers: { 'Content-Type': 'application/json' },
                                                    body: JSON.stringify({ CvUser: user.CvUser, EdoCta: false })
                                                })];
                                        case 1:
                                            _a.sent();
                                            return [3 /*break*/, 3];
                                        case 2:
                                            err_3 = _a.sent();
                                            console.error('Error actualizando estado:', err_3);
                                            return [3 /*break*/, 3];
                                        case 3: return [2 /*return*/];
                                    }
                                });
                            }); }, 2000);
                            return [2 /*return*/];
                        }
                    }
                    return [4 /*yield*/, obtenerPersonaPorId(user.CvPerson)];
                case 1:
                    persona = _a.sent();
                    nombreCompleto = user.Login;
                    if (persona) {
                        partes = [persona.Nombre, persona.ApellidoPaterno, persona.ApellidoMaterno]
                            .filter(function (x) { return x && x.trim() !== '' && x !== '-'; });
                        nombreCompleto = partes.join(' ');
                    }
                    // Guardar session
                    sessionStorage.setItem('usuarioLogueado', nombreCompleto);
                    sessionStorage.setItem('cvUser', user.CvUser);
                    sessionStorage.setItem('cvPerson', user.CvPerson);
                    sessionStorage.setItem('loginUser', user.Login);
                    if (persona) {
                        sessionStorage.setItem('personaCompleta', JSON.stringify(persona));
                        sessionStorage.setItem('tipoPersona', persona.TipoPersona || '');
                        sessionStorage.setItem('correo', persona.Correo || '');
                        sessionStorage.setItem('puesto', persona.Puesto || '');
                        sessionStorage.setItem('telefono', persona.Telefono || '');
                        sessionStorage.setItem('direccion', persona.Direccion || '');
                    }
                    // Mostrar éxito (TOAST) y redirigir
                    // showSuccess(`Bienvenido ${nombreCompleto}`);
                    clearInputs();
                    setTimeout(function () {
                        window.location.href = 'Menu.html';
                    }, 1000);
                    return [2 /*return*/];
            }
        });
    }); });
    // Marcar que ya fue adjuntado para evitar duplicados
    loginForm.dataset.listener = 'true';
}
// =============================
// Inicialización
// =============================
document.addEventListener('DOMContentLoaded', function () {
    ensureGeneralAlertFloating();
    cargarUsuarios();
    attachSubmitOnce();
});
