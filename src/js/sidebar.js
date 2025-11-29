// ============================================================
// SIDEBAR.JS - Componente Modular del Sidebar
// ============================================================

class SidebarComponent {
  constructor() {
    this.sidebar = document.getElementById('sidebarComponent');
    this.init();
  }

  /**
   * Inicializa el componente del sidebar
   */
  init() {
    console.log('🚀 Inicializando Sidebar Component...');
    this.cargarDatosUsuario();
    this.configurarEventos();
    this.marcarPaginaActiva();
  }

  /**
   * Carga los datos del usuario desde sessionStorage
   */
cargarDatosUsuario() {
    const nombreUsuario = sessionStorage.getItem('usuarioLogueado') || 'Usuario';
    const loginUser = sessionStorage.getItem('loginUser') || 'email@ejemplo.com';
    const puesto = sessionStorage.getItem('puesto') || 'No asignada';
    const tipoPersona = sessionStorage.getItem('tipoPersona') || 'Empleado';
    const imagenPerfil = sessionStorage.getItem('imagenPerfil') || '';

    // ⭐ Nuevo Log solicitado
    const rutaTxt = sessionStorage.getItem('rutaArchivoTxt') || null;
    console.log('📄 Ruta del TXT encontrada:', rutaTxt ? rutaTxt : '❌ No se encontró ninguna ruta');

    console.log('📊 Datos cargados desde sessionStorage:', {
      nombreUsuario,
      loginUser,
      puesto,
      tipoPersona,
      imagenPerfil: imagenPerfil ? imagenPerfil.substring(0, 50) + '...' : 'Sin imagen'
    });

    this.actualizarPerfil(nombreUsuario, loginUser, puesto, tipoPersona, imagenPerfil);
}


  /**
   * Actualiza los elementos del perfil en el sidebar
   */
  actualizarPerfil(nombre, email, area, rol, imagenUrl = '') {
    console.log('🔄 Actualizando perfil del sidebar...');

    // Actualizar nombre
    const userNameElement = document.getElementById('userName');
    if (userNameElement) {
      userNameElement.textContent = nombre;
      console.log('✓ Nombre actualizado:', nombre);
    }

    // Actualizar email
    const userEmailElement = document.getElementById('userEmail');
    if (userEmailElement) {
      userEmailElement.textContent = email;
      console.log('✓ Email actualizado:', email);
    }

    // Actualizar área
    const userAreaElement = document.getElementById('userArea');
    if (userAreaElement) {
      userAreaElement.textContent = area;
      console.log('✓ Área actualizada:', area);
    }

    // Actualizar rol
    const userRoleElement = document.getElementById('userRole');
    if (userRoleElement) {
      userRoleElement.textContent = rol;
      console.log('✓ Rol actualizado:', rol);
    }

    // ⭐ CRÍTICO: Manejar imagen de perfil
    this.actualizarImagenPerfil(nombre, imagenUrl);
  }

  /**
   * Actualiza la imagen de perfil o muestra iniciales
   */
  actualizarImagenPerfil(nombre, imagenUrl) {
    const userInitialsElement = document.getElementById('userInitials');
    const userAvatarContainer = document.getElementById('userAvatar');
    
    console.log('🖼️ Actualizando imagen de perfil:', {
      tieneImagen: !!imagenUrl,
      elementosEncontrados: {
        userInitials: !!userInitialsElement,
        userAvatar: !!userAvatarContainer
      }
    });

    // Verificar que los elementos existan
    if (!userAvatarContainer) {
      console.error('❌ No se encontró el elemento #userAvatar en el DOM');
      return;
    }

    if (imagenUrl && imagenUrl.trim() !== '') {

      userAvatarContainer.style.backgroundImage = `url('${imagenUrl}')`;
      userAvatarContainer.style.backgroundSize = 'cover';
      userAvatarContainer.style.backgroundPosition = 'center';
      userAvatarContainer.style.backgroundRepeat = 'no-repeat';
      
      if (userInitialsElement) {
        userInitialsElement.style.display = 'none';
      }
      
      console.log('✅ Imagen de perfil aplicada correctamente');
      console.log('📸 Preview:', imagenUrl.substring(0, 80) + '...');
      
    } else {

      userAvatarContainer.style.backgroundImage = '';
      
      // Mostrar iniciales
      if (userInitialsElement) {
        userInitialsElement.style.display = 'flex';
        userInitialsElement.textContent = this.obtenerIniciales(nombre);
        console.log('✅ Mostrando iniciales:', this.obtenerIniciales(nombre));
      } else {
        console.warn('⚠️ No se encontró el elemento #userInitials');
      }
    }
  }

  /**
   * Obtiene las iniciales del nombre completo
   */
  obtenerIniciales(nombreCompleto) {
    const palabras = nombreCompleto.trim().split(' ').filter(p => p.length > 0);
    
    if (palabras.length === 0) return 'U'; // Usuario por defecto
    if (palabras.length === 1) {
      return palabras[0].substring(0, 2).toUpperCase();
    }
    
    // Primera letra del primer nombre + primera letra del último apellido
    return (palabras[0].charAt(0) + palabras[palabras.length - 1].charAt(0)).toUpperCase();
  }

  /**
   * Configura los eventos del sidebar
   */
  configurarEventos() {
    // Evento para cerrar sesión
    const btnCerrarSesion = document.getElementById('btnCerrarSesion');
    if (btnCerrarSesion) {
      btnCerrarSesion.addEventListener('click', (e) => {
        e.preventDefault();
        this.cerrarSesion();
      });
    }

    // Eventos para los items del menú
    const menuItems = document.querySelectorAll('.menu-item');
    menuItems.forEach(item => {
      item.addEventListener('click', () => {
        this.activarMenuItem(item);
      });
    });

    console.log('✓ Eventos del sidebar configurados');
  }

  /**
   * Activa un item del menú
   */
  activarMenuItem(item) {
    // Remover clase active de todos los items
    const allItems = document.querySelectorAll('.menu-item');
    allItems.forEach(i => i.classList.remove('active'));

    // Agregar clase active al item clickeado
    item.classList.add('active');

    // Guardar página activa en sessionStorage
    const pagina = item.getAttribute('data-page');
    if (pagina) {
      sessionStorage.setItem('paginaActiva', pagina);
    }
  }

  /**
   * Marca la página activa según la URL actual
   */
  marcarPaginaActiva() {
    const paginaActual = window.location.pathname
      .split('/')
      .pop()
      .replace('.html', '')
      .toLowerCase();
    
    const paginaGuardada = sessionStorage.getItem('paginaActiva');
    
    const menuItems = document.querySelectorAll('.menu-item');
    menuItems.forEach(item => {
      const dataPagina = item.getAttribute('data-page');
      
      // Marcar como activo si coincide con la página actual o guardada
      if (dataPagina === paginaActual || dataPagina === paginaGuardada) {
        item.classList.add('active');
      } else {
        item.classList.remove('active');
      }
    });

    // Si estamos en menu.html o la página principal, activar "menu"
    if (paginaActual === 'menu' || paginaActual === '' || paginaActual === 'index') {
      const menuItem = document.querySelector('.menu-item[data-page="menu"]');
      if (menuItem) {
        menuItem.classList.add('active');
      }
    }
  }

  /**
   * Cierra la sesión del usuario
   */
  cerrarSesion() {
    const confirmar = confirm('¿Estás seguro de que deseas cerrar sesión?');
    
    if (confirmar) {
      console.log('🚪 Cerrando sesión...');
      sessionStorage.clear();
      window.location.href = '../vista/index.html';
    }
  }

  /**
   * ⭐ MÉTODO PÚBLICO: Actualiza los datos del usuario
   * Este método es llamado desde perfil.js cuando se guardan cambios
   */
  actualizarDatos(nombre, email, area, rol, imagenUrl = '') {
    console.log('🔄 actualizarDatos() llamado desde externo:', {
      nombre,
      email,
      area,
      rol,
      tieneImagen: !!imagenUrl
    });

    // Actualizar UI
    this.actualizarPerfil(nombre, email, area, rol, imagenUrl);
    
    // Actualizar sessionStorage para persistencia
    sessionStorage.setItem('usuarioLogueado', nombre);
    sessionStorage.setItem('loginUser', email);
    sessionStorage.setItem('puesto', area);
    sessionStorage.setItem('tipoPersona', rol);
    
    // Guardar o eliminar imagen
    if (imagenUrl && imagenUrl.trim() !== '') {
      sessionStorage.setItem('imagenPerfil', imagenUrl);
      console.log('💾 Imagen guardada en sessionStorage');
    } else {
      sessionStorage.removeItem('imagenPerfil');
      console.log('🗑️ Imagen removida de sessionStorage');
    }
    
    console.log('✅ Datos del sidebar actualizados completamente');
  }

  /**
   * Alterna la visibilidad del sidebar (para móviles)
   */
  toggle() {
    if (this.sidebar) {
      this.sidebar.classList.toggle('active');
    }
  }

  /**
   * Obtiene los datos actuales del usuario
   */
  obtenerDatosUsuario() {
    return {
      nombre: sessionStorage.getItem('usuarioLogueado') || 'Usuario',
      email: sessionStorage.getItem('loginUser') || 'email@ejemplo.com',
      area: sessionStorage.getItem('puesto') || 'No asignada',
      rol: sessionStorage.getItem('tipoPersona') || 'Empleado',
      imagen: sessionStorage.getItem('imagenPerfil') || ''
    };
  }

  /**
   * Verifica si hay una sesión activa
   */
  verificarSesion() {
    const sesionActiva = !!sessionStorage.getItem('usuarioLogueado');
    console.log('🔐 Sesión activa:', sesionActiva);
    return sesionActiva;
  }

  /**
   * ⭐ MÉTODO DE DEBUG: Muestra información del estado actual
   */
  debug() {
    console.log('🐛 DEBUG - Estado del Sidebar:');
    console.log('SessionStorage:', {
      usuarioLogueado: sessionStorage.getItem('usuarioLogueado'),
      loginUser: sessionStorage.getItem('loginUser'),
      puesto: sessionStorage.getItem('puesto'),
      tipoPersona: sessionStorage.getItem('tipoPersona'),
      imagenPerfil: sessionStorage.getItem('imagenPerfil') ? 'SÍ' : 'NO'
    });
    console.log('Elementos DOM:', {
      userName: !!document.getElementById('userName'),
      userEmail: !!document.getElementById('userEmail'),
      userArea: !!document.getElementById('userArea'),
      userRole: !!document.getElementById('userRole'),
      userAvatar: !!document.getElementById('userAvatar'),
      userInitials: !!document.getElementById('userInitials')
    });
  }
}

window.SidebarComponent = SidebarComponent;
window.getSidebarInstance = () => window.sidebarInstance || sidebarInstance;