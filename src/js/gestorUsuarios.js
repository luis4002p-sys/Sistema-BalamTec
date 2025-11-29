// =====================================================
// GESTIÓN DE USUARIOS - EFECTOS VISUALES
// Solo maneja animaciones y comportamiento visual
// La lógica de datos está en el TypeScript
// =====================================================

// =====================================================
// ANIMACIONES DE MODAL
// =====================================================

// Agregar animación al abrir modales
const observarModales = () => {
  const modales = document.querySelectorAll('.modal');
  
  modales.forEach(modal => {
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.attributeName === 'class') {
          const modalContent = modal.querySelector('.modal-content');
          if (modal.classList.contains('active')) {
            // Animación de entrada
            modalContent.style.animation = 'modalSlideIn 0.3s ease-out';
          }
        }
      });
    });
    
    observer.observe(modal, { attributes: true });
  });
};

// =====================================================
// EFECTOS HOVER EN FILAS DE TABLA
// =====================================================

const agregarEfectosTabla = () => {
  const tabla = document.querySelector('.data-table tbody');
  
  if (tabla) {
    tabla.addEventListener('mouseenter', (e) => {
      if (e.target.tagName === 'TR' || e.target.closest('tr')) {
        const fila = e.target.tagName === 'TR' ? e.target : e.target.closest('tr');
        fila.style.transform = 'translateX(4px)';
        fila.style.transition = 'transform 0.2s ease';
      }
    }, true);
    
    tabla.addEventListener('mouseleave', (e) => {
      if (e.target.tagName === 'TR' || e.target.closest('tr')) {
        const fila = e.target.tagName === 'TR' ? e.target : e.target.closest('tr');
        fila.style.transform = 'translateX(0)';
      }
    }, true);
  }
};

// =====================================================
// ANIMACIÓN DE BOTONES
// =====================================================

const agregarEfectosBotones = () => {
  const botones = document.querySelectorAll('.btn-icon');
  
  botones.forEach(btn => {
    btn.addEventListener('mouseenter', function() {
      this.style.transform = 'scale(1.1)';
      this.style.transition = 'transform 0.2s ease';
    });
    
    btn.addEventListener('mouseleave', function() {
      this.style.transform = 'scale(1)';
    });
    
    btn.addEventListener('mousedown', function() {
      this.style.transform = 'scale(0.95)';
    });
    
    btn.addEventListener('mouseup', function() {
      this.style.transform = 'scale(1.1)';
    });
  });
};

// =====================================================
// ANIMACIÓN DE INPUTS AL FOCUS
// =====================================================

const agregarEfectosInputs = () => {
  const inputs = document.querySelectorAll('input[type="text"], input[type="email"], input[type="tel"]');
  
  inputs.forEach(input => {
    input.addEventListener('focus', function() {
      this.style.transform = 'scale(1.02)';
      this.style.transition = 'transform 0.2s ease';
    });
    
    input.addEventListener('blur', function() {
      this.style.transform = 'scale(1)';
    });
  });
};

// =====================================================
// EFECTO RIPPLE EN BOTONES
// =====================================================

const agregarRippleEffect = () => {
  const botones = document.querySelectorAll('.btn-primary, .btn-secondary, .btn-danger, .btn-create');
  
  botones.forEach(boton => {
    boton.addEventListener('click', function(e) {
      const ripple = document.createElement('span');
      ripple.classList.add('ripple');
      
      const rect = this.getBoundingClientRect();
      const size = Math.max(rect.width, rect.height);
      const x = e.clientX - rect.left - size / 2;
      const y = e.clientY - rect.top - size / 2;
      
      ripple.style.width = ripple.style.height = size + 'px';
      ripple.style.left = x + 'px';
      ripple.style.top = y + 'px';
      
      this.appendChild(ripple);
      
      setTimeout(() => ripple.remove(), 600);
    });
  });
};

// =====================================================
// INDICADOR DE CARGA
// =====================================================

const mostrarIndicadorCarga = () => {
  const loader = document.createElement('div');
  loader.id = 'loader';
  loader.innerHTML = `
    <div style="
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0,0,0,0.5);
      display: flex;
      justify-content: center;
      align-items: center;
      z-index: 9999;
    ">
      <div style="
        background: white;
        padding: 30px;
        border-radius: 10px;
        text-align: center;
      ">
        <div class="spinner"></div>
        <p style="margin-top: 15px; color: #333;">Cargando...</p>
      </div>
    </div>
  `;
  document.body.appendChild(loader);
  
  return {
    ocultar: () => {
      const loader = document.getElementById('loader');
      if (loader) loader.remove();
    }
  };
};

// =====================================================
// TOOLTIP PERSONALIZADO
// =====================================================

const agregarTooltips = () => {
  const elementosConTooltip = document.querySelectorAll('[data-tooltip]');
  
  elementosConTooltip.forEach(elemento => {
    elemento.addEventListener('mouseenter', function(e) {
      const texto = this.getAttribute('data-tooltip');
      const tooltip = document.createElement('div');
      tooltip.className = 'custom-tooltip';
      tooltip.textContent = texto;
      tooltip.style.cssText = `
        position: absolute;
        background: #333;
        color: white;
        padding: 5px 10px;
        border-radius: 4px;
        font-size: 12px;
        z-index: 10000;
        pointer-events: none;
        white-space: nowrap;
      `;
      
      document.body.appendChild(tooltip);
      
      const rect = this.getBoundingClientRect();
      tooltip.style.left = rect.left + (rect.width / 2) - (tooltip.offsetWidth / 2) + 'px';
      tooltip.style.top = rect.top - tooltip.offsetHeight - 5 + 'px';
      
      this._tooltip = tooltip;
    });
    
    elemento.addEventListener('mouseleave', function() {
      if (this._tooltip) {
        this._tooltip.remove();
        delete this._tooltip;
      }
    });
  });
};

// =====================================================
// SMOOTH SCROLL
// =====================================================

const habilitarSmoothScroll = () => {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        target.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    });
  });
};

// =====================================================
// VALIDACIÓN VISUAL DE FORMULARIOS
// =====================================================

const agregarValidacionVisual = () => {
  const forms = document.querySelectorAll('form');
  
  forms.forEach(form => {
    const inputs = form.querySelectorAll('input[required]');
    
    inputs.forEach(input => {
      input.addEventListener('blur', function() {
        if (!this.value.trim()) {
          this.style.borderColor = '#ef4444';
          this.style.animation = 'shake 0.3s';
        } else {
          this.style.borderColor = '#10b981';
        }
      });
      
      input.addEventListener('input', function() {
        if (this.value.trim()) {
          this.style.borderColor = '#d0d0d0';
        }
      });
    });
  });
};

// =====================================================
// CSS ANIMATIONS (inyectar estilos dinámicamente)
// =====================================================

const inyectarEstilosAnimaciones = () => {
  const style = document.createElement('style');
  style.textContent = `
    @keyframes modalSlideIn {
      from {
        opacity: 0;
        transform: translateY(-20px) scale(0.95);
      }
      to {
        opacity: 1;
        transform: translateY(0) scale(1);
      }
    }
    
    @keyframes shake {
      0%, 100% { transform: translateX(0); }
      25% { transform: translateX(-5px); }
      75% { transform: translateX(5px); }
    }
    
    .ripple {
      position: absolute;
      border-radius: 50%;
      background: rgba(255, 255, 255, 0.6);
      transform: scale(0);
      animation: ripple-animation 0.6s ease-out;
      pointer-events: none;
    }
    
    @keyframes ripple-animation {
      to {
        transform: scale(4);
        opacity: 0;
      }
    }
    
    .spinner {
      width: 40px;
      height: 40px;
      margin: 0 auto;
      border: 4px solid #f3f3f3;
      border-top: 4px solid #4f46e5;
      border-radius: 50%;
      animation: spin 1s linear infinite;
    }
    
    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }
  `;
  document.head.appendChild(style);
};

// =====================================================
// INICIALIZACIÓN
// =====================================================

document.addEventListener('DOMContentLoaded', () => {
  console.log('Efectos visuales iniciados');
  
  // Inicializar todos los efectos visuales
  inyectarEstilosAnimaciones();
  observarModales();
  agregarEfectosTabla();
  agregarEfectosBotones();
  agregarEfectosInputs();
  agregarRippleEffect();
  agregarTooltips();
  habilitarSmoothScroll();
  agregarValidacionVisual();
  
  // Observar cambios en la tabla para agregar efectos a nuevas filas
  const tabla = document.getElementById('tableBody');
  if (tabla) {
    const observer = new MutationObserver(() => {
      agregarEfectosBotones();
    });
    
    observer.observe(tabla, { childList: true, subtree: true });
  }
});