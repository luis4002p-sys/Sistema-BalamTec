// ============================================================
// SIDEBARLOADER.JS - Carga dinámica del HTML del sidebar
// ============================================================

(async function() {
  try {
    const sidebarContainer = document.getElementById('sidebarContainer');
    
    if (!sidebarContainer) {
      console.warn('⚠️ No se encontró #sidebarContainer en esta página');
      return;
    }

    // Cargar el HTML del sidebar
    const response = await fetch('../components/sidebar.html');
    
    if (!response.ok) {
      throw new Error(`Error al cargar sidebar: ${response.status}`);
    }
    
    const sidebarHTML = await response.text();
    sidebarContainer.innerHTML = sidebarHTML;
    
    console.log('✅ Sidebar HTML cargado correctamente');

    // ⭐ CRÍTICO: Esperar un momento para que el DOM se actualice
    // antes de inicializar el componente JavaScript
    await new Promise(resolve => setTimeout(resolve, 50));

    // ⭐ NUEVO: Inicializar el componente DESPUÉS de cargar el HTML
    if (typeof SidebarComponent !== 'undefined') {
      window.sidebarInstance = new SidebarComponent();
      console.log('✅ Sidebar Component inicializado desde loader');
    } else {
      console.warn('⚠️ SidebarComponent no está definido aún, se inicializará automáticamente');
    }

  } catch (error) {
    console.error('❌ Error al cargar el sidebar:', error);
  }
})();