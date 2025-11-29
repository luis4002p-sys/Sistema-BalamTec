// ============================================================
// MAIN.JS - Efectos y Animaciones Generales del Dashboard
// ============================================================
// Este archivo maneja solo las animaciones visuales de las cards
// y elementos principales del dashboard

document.addEventListener('DOMContentLoaded', function() {
    console.log('🎨 Inicializando animaciones del dashboard...');
    
    // ============ EFECTO ZOOM EN CARDS PRINCIPALES ============
    const cards = document.querySelectorAll('.card');
    
    cards.forEach(card => {
        // Efecto zoom al pasar el cursor
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-5px) scale(1.05)';
            this.style.transition = 'all 0.3s ease';
            this.style.zIndex = '10';
        });
        
        // Volver al tamaño normal al salir
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
            this.style.zIndex = '1';
        });
        
        // Efecto al hacer click
        card.addEventListener('mousedown', function() {
            this.style.transform = 'translateY(-5px) scale(1.02)';
        });
        
        card.addEventListener('mouseup', function() {
            this.style.transform = 'translateY(-5px) scale(1.05)';
        });
    });

    console.log(`✓ Animaciones aplicadas a ${cards.length} cards principales`);
    
    // ============ EFECTO ZOOM EN STAT CARDS ============
    const statCards = document.querySelectorAll('.stat-card');
    
    statCards.forEach(statCard => {
        statCard.addEventListener('mouseenter', function() {
            this.style.transform = 'scale(1.03)';
            this.style.transition = 'all 0.3s ease';
        });
        
        statCard.addEventListener('mouseleave', function() {
            this.style.transform = 'scale(1)';
        });
    });
    
    console.log(`✓ Animaciones aplicadas a ${statCards.length} stat cards`);
    
    // ============ EFECTO HOVER EN BOTÓN DE AYUDA ============
    const helpButton = document.querySelector('.help-button');
    
    if (helpButton) {
        helpButton.addEventListener('mouseenter', function() {
            this.style.transform = 'scale(1.1) rotate(5deg)';
            this.style.transition = 'all 0.3s ease';
        });
        
        helpButton.addEventListener('mouseleave', function() {
            this.style.transform = 'scale(1) rotate(0deg)';
        });
        
        console.log('✓ Animación del botón de ayuda configurada');
    }
    
    console.log('✅ Todas las animaciones del dashboard inicializadas');
});

// ============================================================
// FUNCIONES UTILITARIAS PARA EL DASHBOARD
// ============================================================

/**
 * Actualiza las estadísticas mostradas en las stat-cards
 * @param {number} empleados - Número de empleados registrados
 * @param {number} proveedores - Número de proveedores disponibles
 * @param {number} clientes - Número de clientes registrados
 */
function updateStats(empleados, proveedores, clientes) {
    const statValues = document.querySelectorAll('.stat-value');
    
    if (statValues.length >= 3) {
        statValues[0].innerHTML = `${empleados} <span class="stat-label">registrados</span>`;
        statValues[1].innerHTML = `${proveedores} <span class="stat-label">disponibles</span>`;
        statValues[2].innerHTML = `${clientes} <span class="stat-label">registrados</span>`;
        
        console.log(`📊 Stats actualizadas: ${empleados} empleados, ${proveedores} proveedores, ${clientes} clientes`);
    } else {
        console.warn('⚠️ No se encontraron suficientes stat-values para actualizar');
    }
}

/**
 * Muestra una notificación temporal en la pantalla
 * @param {string} message - Mensaje a mostrar
 * @param {string} type - Tipo de notificación: 'info', 'success', 'error', 'warning'
 */
function showNotification(message, type = 'info') {
    const colors = {
        success: '#10b981',
        error: '#ef4444',
        warning: '#f59e0b',
        info: '#3b82f6'
    };
    
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 15px 25px;
        background-color: ${colors[type] || colors.info};
        color: white;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.2);
        z-index: 1000;
        animation: slideIn 0.3s ease;
        font-size: 14px;
        font-weight: 500;
    `;
    
    document.body.appendChild(notification);
    
    // Remover después de 3 segundos
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
    
    console.log(`📢 Notificación [${type}]: ${message}`);
}

// ============================================================
// INYECCIÓN DE ESTILOS DE ANIMACIÓN
// ============================================================

const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
    
    /* Transiciones suaves para todas las cards */
    .card, .stat-card {
        transition: transform 0.3s ease, box-shadow 0.3s ease;
    }
    
    /* Efecto de elevación en hover */
    .card:hover, .stat-card:hover {
        box-shadow: 0 8px 20px rgba(0, 0, 0, 0.12);
    }
`;
document.head.appendChild(style);

// ============================================================
// EXPORTAR FUNCIONES GLOBALES
// ============================================================

window.updateStats = updateStats;
window.showNotification = showNotification;

console.log('✅ Main.js cargado correctamente');