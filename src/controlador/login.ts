// login.ts - Versión corregida para evitar duplicación y deformación

// =============================
// Estado / Guardas
// =============================
let globalMsgTimeout: number | undefined;
let usuariosCargados = false;

// =============================
// Elementos del formulario (aserciones TS)
// =============================
const loginForm = document.getElementById('loginForm') as HTMLFormElement | null;
const msgDisplay = document.querySelector('.msg') as HTMLElement | null;
const generalAlert = document.getElementById('generalAlert') as HTMLElement | null;
const alertMessage = document.getElementById('alertMessage') as HTMLElement | null;
const usernameField = document.getElementById('username') as HTMLInputElement | null;
const passwordField = document.getElementById('password') as HTMLInputElement | null;
const usernameErrorDiv = document.getElementById('usernameError') as HTMLElement | null;
const passwordErrorDiv = document.getElementById('passwordError') as HTMLElement | null;

// =============================
// Tipos
// =============================
interface User {
  CvUser: string;
  CvPerson: string;
  Login: string;
  Password: string;
  FecIni: Date | null;
  FecVen: Date | null;
  EdoCta: boolean;
}

interface Persona {
  idPersona: string;
  Nombre: string;
  ApellidoPaterno: string;
  ApellidoMaterno: string;
  NombreCompleto: string;
  TipoPersona: string;
  Telefono: string;
  Direccion: string;
  Correo: string;
  Puesto: string;
  Login: string;
}

let users: User[] = [];

// =============================
// Utilidades
// =============================
function parseDate(str: string | undefined): Date | null {
  if (!str) return null;
  const parts = str.split(/[\/\-]/).map(Number);
  if (parts.length < 3) return null;
  return parts[2] < 1000
    ? new Date(parts[2] + 2000, parts[1] - 1, parts[0])
    : new Date(parts[2], parts[1] - 1, parts[0]);
}

/**
 * Forzar estilos mínimos a la alerta general para que sea "flotante" y no empuje
 * Se ejecuta una sola vez al iniciar si existe generalAlert.
 */
function ensureGeneralAlertFloating() {
  if (!generalAlert) return;
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
  if (generalAlert) generalAlert.classList.remove('show');
  if (alertMessage) alertMessage.textContent = '';
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
  usernameField?.classList.remove('error');
  passwordField?.classList.remove('error');
  usernameErrorDiv?.classList.remove('show');
  passwordErrorDiv?.classList.remove('show');
}

/**
 * Muestra un error: policy -> mostrar en ALERT superior (flotante) para no empujar
 */
function showError(message: string) {
  // Si ya se muestra exactamente el mismo mensaje en generalAlert, no re-ejecutar.
  if (generalAlert && alertMessage) {
    const current = alertMessage.textContent || '';
    if (current === message && generalAlert.classList.contains('show')) {
      // Ya está visible con el mismo texto -> reiniciar timeout solamente
      if (globalMsgTimeout) clearTimeout(globalMsgTimeout);
      globalMsgTimeout = window.setTimeout(() => {
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
  if (alertMessage) alertMessage.textContent = message;
  if (generalAlert) generalAlert.classList.add('show');

  // programar auto-hide
  if (globalMsgTimeout) clearTimeout(globalMsgTimeout);
  globalMsgTimeout = window.setTimeout(() => {
    clearGeneralMessages();
  }, 5000);
}

/**
 * Muestra éxito: policy -> mostrar en TOAST (msgDisplay) y no tocar la alerta superior
 */
function showSuccess(message: string) {
  // Si el toast ya muestra lo mismo, no re-ejecutar animación redundante
  if (msgDisplay) {
    const current = msgDisplay.textContent || '';
    if (current === message && msgDisplay.classList.contains('show')) {
      return;
    }
  }

  // Ocultar alerta superior si existiera
  if (generalAlert) generalAlert.classList.remove('show');
  if (alertMessage) alertMessage.textContent = '';

  // Mostrar toast
  if (msgDisplay) {
    msgDisplay.textContent = message;
    msgDisplay.classList.remove('error', 'success');
    msgDisplay.classList.add('show', 'success');

    // auto-hide success after 3s
    if (globalMsgTimeout) clearTimeout(globalMsgTimeout);
    globalMsgTimeout = window.setTimeout(() => {
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
  if (usernameField) usernameField.value = '';
  if (passwordField) passwordField.value = '';
}

/**
 * Validación básica
 */
function validateInputs(): boolean {
  let isValid = true;
  // Solo limpiamos errores de inputs aquí — no tocamos mensajes globales
  usernameField?.classList.remove('error');
  passwordField?.classList.remove('error');
  usernameErrorDiv?.classList.remove('show');
  passwordErrorDiv?.classList.remove('show');

  if (!usernameField || usernameField.value.trim() === '') {
    usernameField?.classList.add('error');
    usernameErrorDiv?.classList.add('show');
    const sp = usernameErrorDiv?.querySelector('span');
    if (sp) sp.textContent = 'El nombre de usuario es requerido';
    isValid = false;
  }

  if (!passwordField || passwordField.value.trim() === '') {
    passwordField?.classList.add('error');
    passwordErrorDiv?.classList.add('show');
    const sp = passwordErrorDiv?.querySelector('span');
    if (sp) sp.textContent = 'La contraseña es requerida';
    isValid = false;
  }

  return isValid;
}

// =============================
// Eventos de input (no limpian mensajes globales)
// =============================
usernameField?.addEventListener('input', () => {
  usernameField.classList.remove('error');
  usernameErrorDiv?.classList.remove('show');
});

passwordField?.addEventListener('input', () => {
  passwordField.classList.remove('error');
  passwordErrorDiv?.classList.remove('show');
});

// =============================
// Cargar usuarios (evitar duplicados)
// =============================
async function cargarUsuarios() {
  // Evitar recarga si ya se cargó (por seguridad)
  if (usuariosCargados) return;
  usuariosCargados = true;

  try {
    const response = await fetch('http://localhost:3000/usuarios');
    if (!response.ok) throw new Error(`Error HTTP ${response.status}`);
    const text = await response.text();

    const lines = text.split('\n').map(l => l.trim()).filter(l => l);
    if (lines.length <= 1) {
      users = [];
      return;
    }
    // descartamos cabecera
    lines.shift();

    users = lines.map(line => {
      const cols = line.split(/\t|,/);
      return {
        CvUser: cols[0] || '',
        CvPerson: cols[1] || '',
        Login: cols[2] || '',
        Password: cols[3] || '',
        FecIni: parseDate(cols[4]),
        FecVen: parseDate(cols[5]),
        EdoCta: (cols[6] || '').toUpperCase() === 'TRUE'
      } as User;
    });
  } catch (err) {
    console.error('Error al cargar usuarios:', err);
    // Mostrar un mensaje de error no intrusivo
    showError('No se pudieron cargar usuarios. Intente nuevamente.');
  }
}

// =============================
// Obtener persona por CV
// =============================
async function obtenerPersonaPorId(cvPerson: string): Promise<Persona | null> {
  try {
    const res = await fetch(`http://localhost:3000/personas/${cvPerson}`);
    if (!res.ok) return null;
    return await res.json();
  } catch (err) {
    console.warn('Error al obtener persona:', err);
    return null;
  }
}

// =============================
// Listener submit (asegurar single attachment)
// =============================
function attachSubmitOnce() {
  if (!loginForm) return;
  if ((loginForm as HTMLElement).dataset.listener === 'true') return;

  loginForm.addEventListener('submit', async (ev: Event) => {
    ev.preventDefault();

    // Validación
    if (!validateInputs()) {
      // Si la validación falla, mostramos error en la alerta superior
      showError('Verifica los campos requeridos');
      return;
    }

    const username = usernameField?.value.trim() || '';
    const password = passwordField?.value.trim() || '';
    const now = new Date();

    // Buscar usuario
    const user = users.find(u => u.Login === username && u.Password === password);

    if (!user) {
      showError('Usuario o contraseña incorrectos');
      clearInputs();
      return;
    }

    // Estado de cuenta
    if (!user.EdoCta) {
      showError('Cuenta inactiva o caducada');
      clearInputs();
      return;
    }

    // Fecha inicio
    if (user.FecIni && now < user.FecIni) {
      showError('La cuenta aún no está activa');
      clearInputs();
      return;
    }

    // Vencimiento
    if (user.FecVen) {
      const hoy = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      const vence = new Date(user.FecVen.getFullYear(), user.FecVen.getMonth(), user.FecVen.getDate());
      if (hoy.getTime() > vence.getTime()) {
        showError('La cuenta ha expirado. Se desactivará.');
        // Desactivar en backend (no bloqueante)
        setTimeout(async () => {
          try {
            await fetch('http://localhost:3000/usuarios/actualizarEstado', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ CvUser: user.CvUser, EdoCta: false })
            });
          } catch (err) {
            console.error('Error actualizando estado:', err);
          }
        }, 2000);
        return;
      }
    }

    // Obtener datos persona
    const persona = await obtenerPersonaPorId(user.CvPerson);
    let nombreCompleto = user.Login;
    if (persona) {
      const partes = [persona.Nombre, persona.ApellidoPaterno, persona.ApellidoMaterno]
        .filter(x => x && x.trim() !== '' && x !== '-');
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

    setTimeout(() => {
      window.location.href = 'Menu.html';
    }, 1000);
  });

  // Marcar que ya fue adjuntado para evitar duplicados
  (loginForm as HTMLElement).dataset.listener = 'true';
}

// =============================
// Inicialización
// =============================
document.addEventListener('DOMContentLoaded', () => {
  ensureGeneralAlertFloating();
  cargarUsuarios();
  attachSubmitOnce();
});
