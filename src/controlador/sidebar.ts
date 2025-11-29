interface UserData {
  nombre: string;
  email: string;
  area: string;
  rol: string;
  imagen: string;
}

class SidebarComponent {
  private sidebar: HTMLElement | null;

  constructor() {
    this.sidebar = document.getElementById("sidebarComponent");
    this.init();
  }

  private async init(): Promise<void> {
    await this.cargarDatosUsuario();
    this.configurarEventos();
    this.marcarPaginaActiva();
  }

  private async cargarDatosUsuario(): Promise<void> {
    const ssImagen = sessionStorage.getItem("imagenPerfil") || "";
    const email = sessionStorage.getItem("loginUser") || "";
    let imagen = ssImagen;

    if (!imagen && email) {
      const persona = await this.buscarPersonaEnTxt(email);
      if (persona && persona.Imagen) {
        imagen = persona.Imagen;
        sessionStorage.setItem("imagenPerfil", imagen);
      }
    }

    const nombre = sessionStorage.getItem("usuarioLogueado") || "Usuario";
    const area = sessionStorage.getItem("puesto") || "No asignada";
    const rol = sessionStorage.getItem("tipoPersona") || "Empleado";

    this.actualizarPerfil(nombre, email, area, rol, imagen);
  }

private async buscarPersonaEnTxt(correo: string): Promise<any | null> {
  try {
    console.log("Leyendo TXT desde:", "../datos/Personas.txt");

    const response = await fetch("../datos/Personas.txt");
    const contenido = await response.text();

    console.log("Contenido TXT cargado (primeros 200 chars):", contenido.substring(0, 200));

    const lineas = contenido.split("\n");

    for (const linea of lineas) {
      console.log("Línea procesada:", linea);

      const partes = linea.split("|");

      if (partes[2]?.trim() === correo.trim()) {
        console.log("Coincidencia encontrada en TXT:", partes);

        return {
          Nombre: partes[0],
          Puesto: partes[1],
          Correo: partes[2],
          Rol: partes[3],
          Imagen: partes[4] || ""
        };
      }
    }

    console.warn("No se encontró la persona en el TXT:", correo);

  } catch (err) {
    console.error("Error leyendo Personas.txt:", err);
  }

  return null;
}


  public actualizarPerfil(nombre: string, email: string, area: string, rol: string, imagen = ""): void {
    const e1 = document.getElementById("userName");
    if (e1) e1.textContent = nombre;

    const e2 = document.getElementById("userEmail");
    if (e2) e2.textContent = email;

    const e3 = document.getElementById("userArea");
    if (e3) e3.textContent = area;

    const e4 = document.getElementById("userRole");
    if (e4) e4.textContent = rol;

    this.actualizarImagenPerfil(nombre, imagen);
  }

  private actualizarImagenPerfil(nombre: string, imagen: string): void {
    const initials = document.getElementById("userInitials");
    const avatar = document.getElementById("userAvatar") as HTMLElement;

    if (!avatar) return;

    if (imagen && imagen.trim() !== "") {
      avatar.style.backgroundImage = `url('${imagen}')`;
      avatar.style.backgroundSize = "cover";
      avatar.style.backgroundPosition = "center";
      avatar.style.backgroundRepeat = "no-repeat";

      if (initials) initials.style.display = "none";
    } else {
      avatar.style.backgroundImage = "";
      if (initials) {
        initials.style.display = "flex";
        initials.textContent = this.obtenerIniciales(nombre);
      }
    }
  }

  private obtenerIniciales(nombre: string): string {
    const p = nombre.trim().split(" ").filter(x => x.length > 0);
    if (p.length === 0) return "U";
    if (p.length === 1) return p[0].substring(0, 2).toUpperCase();
    return (p[0][0] + p[p.length - 1][0]).toUpperCase();
  }

  private configurarEventos(): void {
    const btnCerrarSesion = document.getElementById("btnCerrarSesion");
    if (btnCerrarSesion) {
      btnCerrarSesion.addEventListener("click", (e) => {
        e.preventDefault();
        this.cerrarSesion();
      });
    }

    const menu = document.querySelectorAll(".menu-item");
    menu.forEach(item => {
      item.addEventListener("click", () => {
        this.activarMenuItem(item as HTMLElement);
      });
    });
  }

  private activarMenuItem(item: HTMLElement): void {
    const items = document.querySelectorAll(".menu-item");
    items.forEach(i => i.classList.remove("active"));

    item.classList.add("active");

    const pagina = item.getAttribute("data-page");
    if (pagina) sessionStorage.setItem("paginaActiva", pagina);
  }

  private marcarPaginaActiva(): void {
    const paginaActual = window.location.pathname.split("/").pop()?.replace(".html", "").toLowerCase() || "";
    const paginaGuardada = sessionStorage.getItem("paginaActiva");

    const items = document.querySelectorAll(".menu-item");
    items.forEach(item => {
      const data = item.getAttribute("data-page");
      if (data === paginaActual || data === paginaGuardada) {
        item.classList.add("active");
      } else {
        item.classList.remove("active");
      }
    });

    if (["menu", "", "index"].includes(paginaActual)) {
      const inicio = document.querySelector('.menu-item[data-page="inicio"]');
      if (inicio) inicio.classList.add("active");
    }
  }

  private cerrarSesion(): void {
    if (confirm("¿Estás seguro de que deseas cerrar sesión?")) {
      sessionStorage.clear();
      window.location.href = "index.html";
    }
  }

  public actualizarDatos(nombre: string, email: string, area: string, rol: string, imagen = ""): void {
    this.actualizarPerfil(nombre, email, area, rol, imagen);

    sessionStorage.setItem("usuarioLogueado", nombre);
    sessionStorage.setItem("loginUser", email);
    sessionStorage.setItem("puesto", area);
    sessionStorage.setItem("tipoPersona", rol);

    if (imagen) sessionStorage.setItem("imagenPerfil", imagen);
    else sessionStorage.removeItem("imagenPerfil");
  }

  public toggle(): void {
    if (this.sidebar) this.sidebar.classList.toggle("active");
  }

  public obtenerDatosUsuario(): UserData {
    return {
      nombre: sessionStorage.getItem("usuarioLogueado") || "Usuario",
      email: sessionStorage.getItem("loginUser") || "email@ejemplo.com",
      area: sessionStorage.getItem("puesto") || "No asignada",
      rol: sessionStorage.getItem("tipoPersona") || "Empleado",
      imagen: sessionStorage.getItem("imagenPerfil") || ""
    };
  }

  public verificarSesion(): boolean {
    return !!sessionStorage.getItem("usuarioLogueado");
  }
}

let sidebarInstance: SidebarComponent | null = null;

document.addEventListener("DOMContentLoaded", () => {
  sidebarInstance = new SidebarComponent();
});

export {};

declare global {
  interface Window {
    SidebarComponent: typeof SidebarComponent;
    getSidebarInstance: () => SidebarComponent | null;
  }
}

if (typeof window !== "undefined") {
  (window as any).SidebarComponent = SidebarComponent;
  (window as any).getSidebarInstance = () => sidebarInstance;
}
