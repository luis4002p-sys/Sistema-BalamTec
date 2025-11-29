// loginVista.js 

const togglePasswordBtn = document.getElementById('togglePassword');
const passwordInput = document.getElementById('password');
let showPassword = false;

// Toggle password visibility con pantalla interactiva
if (togglePasswordBtn && passwordInput) {
    togglePasswordBtn.addEventListener('click', () => {
        showPassword = !showPassword;
        passwordInput.type = showPassword ? 'text' : 'password';
        
        // Cambiar el SVG del monitor
        const monitorIcon = document.getElementById('monitorIcon');
        const useElement = monitorIcon?.querySelector('use');
        
        if (useElement) {
            useElement.setAttribute('href', showPassword ? '#monitor-on' : '#monitor-off');
        }
        
        togglePasswordBtn.title = showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña';
    });
}

// Efecto de enfoque en inputs
const inputs = document.querySelectorAll('.form-input');
inputs.forEach(input => {
    input.addEventListener('focus', function() {
        this.parentElement?.classList.add('focused');
    });
    
    input.addEventListener('blur', function() {
        this.parentElement?.classList.remove('focused');
    });
});

// Animación del botón de submit al hacer hover
const submitBtn = document.getElementById('submitBtn');
if (submitBtn) {
    submitBtn.addEventListener('mouseenter', function() {
        this.style.transform = 'translateY(-2px)';
    });
    
    submitBtn.addEventListener('mouseleave', function() {
        this.style.transform = 'translateY(0)';
    });
}

// Animación de entrada de la card al cargar la página
document.addEventListener('DOMContentLoaded', () => {
    const loginCard = document.querySelector('.login-card');
    if (loginCard) {
        loginCard.style.opacity = '0';
        loginCard.style.transform = 'translateY(20px)';
        
        setTimeout(() => {
            loginCard.style.transition = 'all 0.5s ease';
            loginCard.style.opacity = '1';
            loginCard.style.transform = 'translateY(0)';
        }, 100);
    }
});


// Enter key en username mueve focus a password
const usernameInput = document.getElementById('username');
if (usernameInput && passwordInput) {
    usernameInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            passwordInput.focus();
        }
    });
}