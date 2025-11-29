// Utilidades de validación
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const phoneRegex = /^[0-9\-+\s()]{7,20}$/;
const postalRegex = /^\d{5}$/;

function setError(inputEl, message) {
  const field = inputEl.closest('.field');
  const err = field.querySelector('.error');
  err.textContent = message || '';
  inputEl.setAttribute('aria-invalid', message ? 'true' : 'false');
}

function validateRequired(inputEl) {
  if (!inputEl.value.trim()) {
    setError(inputEl, 'Campo obligatorio');
    return false;
  }
  setError(inputEl, '');
  return true;
}

function validateEmail(inputEl) {
  if (!validateRequired(inputEl)) return false;
  if (!emailRegex.test(inputEl.value.trim())) {
    setError(inputEl, 'Email inválido');
    return false;
  }
  setError(inputEl, '');
  return true;
}

function validatePhone(inputEl) {
  if (!validateRequired(inputEl)) return false;
  if (!phoneRegex.test(inputEl.value.trim())) {
    setError(inputEl, 'Teléfono inválido');
    return false;
  }
  setError(inputEl, '');
  return true;
}

function validatePostal(inputEl) {
  if (!validateRequired(inputEl)) return false;
  if (!postalRegex.test(inputEl.value.trim())) {
    setError(inputEl, 'Código postal debe tener 5 dígitos');
    return false;
  }
  setError(inputEl, '');
  return true;
}

// Fuerza de contraseña
function passwordScore(pw) {
  if (!pw) return 0;
  let score = 0;
  if (pw.length >= 8) score++;
  if (/[A-Z]/.test(pw)) score++;
  if (/[a-z]/.test(pw)) score++;
  if (/\d/.test(pw)) score++;
  if (/[^\w\s]/.test(pw)) score++; // símbolos
  return Math.min(score, 4); // 0-4
}

function renderStrength(score) {
  const bars = document.querySelectorAll('#pwStrength .bar');
  const text = document.getElementById('pwStrengthText');
  bars.forEach(b => b.className = 'bar'); // reset
  const labels = ['Muy débil', 'Débil', 'Media', 'Fuerte', 'Muy fuerte'];
  for (let i = 0; i < score; i++) {
    bars[i].classList.add('active', score < 2 ? 'low' : score < 4 ? 'mid' : 'high');
  }
  text.textContent = `Fuerza: ${labels[score] || '—'}`;
}

document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('profileForm');

  // Foto de perfil: preview + validaciones
  const photoInput = document.getElementById('profilePhoto');
  const photoPreview = document.getElementById('profilePreview');
  const photoError = document.getElementById('photoError');
  photoInput.addEventListener('change', () => {
    photoError.textContent = '';
    const file = photoInput.files[0];
    if (!file) return;
    const validTypes = ['image/jpeg', 'image/png', 'image/gif'];
    if (!validTypes.includes(file.type)) {
      photoError.textContent = 'Formato no permitido. Usa JPG, PNG o GIF.';
      photoInput.value = '';
      return;
    }
    if (file.size > 2 * 1024 * 1024) {
      photoError.textContent = 'El archivo supera 2MB.';
      photoInput.value = '';
      return;
    }
    const reader = new FileReader();
    reader.onload = e => { photoPreview.src = e.target.result; };
    reader.readAsDataURL(file);
  });

  // Validaciones de campos
  const firstName = document.getElementById('firstName');
  const lastName = document.getElementById('lastName');
  const email = document.getElementById('email');
  const phone = document.getElementById('phone');
  const street = document.getElementById('street');
  const streetNum = document.getElementById('streetNum');
  const postalCode = document.getElementById('postalCode');
  const city = document.getElementById('city');
  const state = document.getElementById('state');
  const username = document.getElementById('username');

  [firstName, lastName].forEach(el => el.addEventListener('blur', () => validateRequired(el)));
  email.addEventListener('blur', () => validateEmail(email));
  phone.addEventListener('blur', () => validatePhone(phone));
  street.addEventListener('blur', () => validateRequired(street));
  streetNum.addEventListener('blur', () => validateRequired(streetNum));
  postalCode.addEventListener('blur', () => validatePostal(postalCode));
  city.addEventListener('blur', () => validateRequired(city));
  state.addEventListener('blur', () => validateRequired(state));
  username.addEventListener('blur', () => validateRequired(username));

  // Toggle mostrar/ocultar contraseñas
  document.querySelectorAll('.pw-toggle').forEach(btn => {
    btn.addEventListener('click', () => {
      const targetId = btn.getAttribute('data-target');
      const input = document.getElementById(targetId);
      const isPw = input.type === 'password';
      input.type = isPw ? 'text' : 'password';
      btn.textContent = isPw ? 'Ocultar' : 'Mostrar';
    });
  });

  // Fuerza de nueva contraseña
  const newPassword = document.getElementById('newPassword');
  newPassword.addEventListener('input', () => {
    renderStrength(passwordScore(newPassword.value));
  });

  // Confirmar nueva contraseña
  const confirmPassword = document.getElementById('confirmPassword');
  function validatePasswordPair() {
    const newPw = newPassword.value.trim();
    const confirmPw = confirmPassword.value.trim();
    // Si ambos vacíos, no hay cambio
    if (!newPw && !confirmPw) {
      setError(newPassword, '');
      setError(confirmPassword, '');
      renderStrength(0);
      return true;
    }
    if (newPw.length < 8) {
      setError(newPassword, 'Mínimo 8 caracteres');
      return false;
    }
    if (newPw !== confirmPw) {
      setError(confirmPassword, 'Las contraseñas no coinciden');
      return false;
    }
    setError(newPassword, '');
    setError(confirmPassword, '');
    return true;
  }
  newPassword.addEventListener('blur', validatePasswordPair);
  confirmPassword.addEventListener('blur', validatePasswordPair);

  // Envío del formulario
  const currentPassword = document.getElementById('currentPassword');
  const formMessage = document.getElementById('formMessage');
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    formMessage.textContent = '';
    let ok = true;

    ok &= validateRequired(firstName);
    ok &= validateRequired(lastName);
    ok &= validateEmail(email);
    ok &= validatePhone(phone);
    ok &= validateRequired(street);
    ok &= validateRequired(streetNum);
    ok &= validatePostal(postalCode);
    ok &= validateRequired(city);
    ok &= validateRequired(state);
    ok &= validateRequired(username);

    // Validación de credenciales: contraseña actual obligatoria si hay cambios de username o password
    const wantsPasswordChange = !!newPassword.value.trim() || !!confirmPassword.value.trim();
    const usernameChanged = username.value.trim() !== 'admin'; // ejemplo comparando valor inicial
    if (wantsPasswordChange || usernameChanged) {
      if (!currentPassword.value.trim()) {
        setError(currentPassword, 'Requerida para confirmar cambios de acceso');
        ok = false;
      } else {
        setError(currentPassword, '');
      }
    }

    if (wantsPasswordChange) {
      ok &= validatePasswordPair();
    }

    // Validación final de foto (si hay archivo ya se validó tipo/tamaño arriba)
    const photoInputHasError = document.getElementById('photoError').textContent.length > 0;
    if (photoInputHasError) ok = false;

    if (!ok) {
      formMessage.textContent = 'Revisa los campos marcados en rojo.';
      return;
    }

    // Construir payload
    const payload = {
      profile: {
        firstName: firstName.value.trim(),
        lastName: lastName.value.trim(),
        email: email.value.trim(),
        phone: phone.value.trim(),
        address: {
          street: street.value.trim(),
          number: streetNum.value.trim(),
          neighborhood: document.getElementById('neighborhood').value.trim(),
          postalCode: postalCode.value.trim(),
          city: city.value.trim(),
          state: state.value.trim(),
        },
      },
      access: {
        username: username.value.trim(),
        currentPassword: currentPassword.value.trim(),
        newPassword: newPassword.value.trim() || null,
      },
    };

    // Adjuntar imagen (si se seleccionó)
    const formData = new FormData();
    formData.append('data', JSON.stringify(payload));
    if (photoInput.files[0]) {
      formData.append('profilePhoto', photoInput.files[0]);
    }

    // TODO: reemplaza con tu endpoint real
    try {
      // Ejemplo de envío:
      // const res = await fetch('/api/users/me', { method: 'PUT', body: formData });
      // if (!res.ok) throw new Error('Error al guardar');
      // const json = await res.json();

      // Demostración sin backend:
      await new Promise(r => setTimeout(r, 500));
      formMessage.textContent = 'Cambios guardados correctamente.';
      formMessage.style.color = 'var(--accent)';
      // Limpieza mínima
      currentPassword.value = '';
      newPassword.value = '';
      confirmPassword.value = '';
      renderStrength(0);
    } catch (err) {
      formMessage.textContent = 'Hubo un error al guardar. Intenta nuevamente.';
      formMessage.style.color = 'var(--danger)';
    }
  });

  // Cancelar: reset visual (no recarga)
  document.getElementById('cancelBtn').addEventListener('click', () => {
    form.reset();
    renderStrength(0);
    document.querySelectorAll('.error').forEach(e => e.textContent = '');
    formMessage.textContent = 'Cambios descartados.';
    formMessage.style.color = 'var(--muted)';
  });
});
