// datosVendedor.ts
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
  Salario: string;
  FechaIngreso: string;
  Login: string;
  Password: string;
  EdoCta: string;
  FuenteDeDatos: string;
}

interface VendedorInfo {
  nombre: string;
  puesto: string;
  area: string;
  descripcion: string;
  imagen: string;
  correo: string;
  telefono: string;
  direccion: string;
  fechaIngreso: string;
}

document.addEventListener("DOMContentLoaded", () => {
  const nombreSpan = document.getElementById("nombreUsuario") as HTMLElement | null;
  if (!nombreSpan) return;

  const usuarioLogueado = sessionStorage.getItem("usuarioLogueado") || "";
  cargarDatosVendedor(usuarioLogueado, nombreSpan);
});

function cargarDatosVendedor(nombreCompleto: string, nombreSpan: HTMLElement) {
  const API_URL = "http://localhost:3000";

  fetch(`${API_URL}/personas`)
    .then(res => {
      if (!res.ok) throw new Error("Error al cargar personas");
      return res.text();
    })
    .then(text => {
      const lineas = text.split("\n").map(l => l.trim()).filter(l => l);
      if (lineas.length === 0) {
        console.error("Archivo de personas vacío");
        return;
      }

      lineas.shift(); // quitar encabezado
      let personaEncontrada: Persona | null = null;

      for (const linea of lineas) {
        const cols = linea.split(/\t/).map(c => c.trim().replace(/^"|"$/g, ''));
        const nombreCompletoArchivo = `${cols[1]} ${cols[2]} ${cols[3]}`.trim();

        if (nombreCompletoArchivo === nombreCompleto) {
          personaEncontrada = {
            idPersona: cols[0] || '',
            Nombre: cols[1] || '',
            ApellidoPaterno: cols[2] || '',
            ApellidoMaterno: cols[3] || '',
            NombreCompleto: nombreCompletoArchivo,
            TipoPersona: cols[4] || '',
            Telefono: cols[5] || '',
            Direccion: cols[6] || '',
            Correo: cols[7] || '',
            Puesto: cols[8] || '',
            Salario: cols[9] || '',
            FechaIngreso: cols[10] || '',
            Login: cols[11] || '',
            Password: cols[12] || '',
            EdoCta: cols[13] || '',
            FuenteDeDatos: cols[14] || ''
          };
          break;
        }
      }

      if (!personaEncontrada) {
        mostrarTooltip(obtenerInfoPorDefecto(nombreCompleto), nombreSpan);
        return;
      }

      const infoVendedor: VendedorInfo = {
        nombre: personaEncontrada.NombreCompleto,
        puesto: personaEncontrada.Puesto || "Sin puesto asignado",
        area: personaEncontrada.TipoPersona === "Empleado"
          ? "Tecnologías de la Información y Comunicación"
          : personaEncontrada.TipoPersona,
        descripcion: obtenerDescripcionPorPuesto(personaEncontrada.Puesto),
        imagen: obtenerImagenPorNombre(personaEncontrada.Nombre),
        correo: personaEncontrada.Correo || "sin-correo@empresa.com",
        telefono: personaEncontrada.Telefono || "Sin teléfono",
        direccion: personaEncontrada.Direccion || "Sin dirección",
        fechaIngreso: formatearFecha(personaEncontrada.FechaIngreso)
      };

      mostrarTooltip(infoVendedor, nombreSpan);
    })
    .catch(() => {
      mostrarTooltip(obtenerInfoPorDefecto(nombreCompleto), nombreSpan);
    });
}

function mostrarTooltip(infoVendedor: VendedorInfo, nombreSpan: HTMLElement) {
  const tooltip = document.createElement("div");
  tooltip.className = "vendedora-tooltip oculto";
  tooltip.innerHTML = `
    <div class="ficha-vendedor">
      <div class="ficha-header">
        <img src="${infoVendedor.imagen}" alt="${infoVendedor.nombre}" class="ficha-img">
        <div class="ficha-nombre">
          <h3>${infoVendedor.nombre}</h3>
          <p>${infoVendedor.puesto}</p>
        </div>
      </div>
      <div class="ficha-body">
        <p><strong>Área:</strong> ${infoVendedor.area}</p>
        <p><strong>Correo:</strong> 
          <a href="mailto:${infoVendedor.correo}">
            ${infoVendedor.correo}
          </a>
        </p>
        <p><strong>Teléfono:</strong> ${infoVendedor.telefono}</p>
        <p><strong>Dirección:</strong> ${infoVendedor.direccion}</p>
        <p><strong>Fecha de Ingreso:</strong> ${infoVendedor.fechaIngreso}</p>
        <p class="descripcion">${infoVendedor.descripcion}</p>
      </div>
    </div>
  `;

  document.body.appendChild(tooltip);

  nombreSpan.addEventListener("mouseenter", (event: MouseEvent) => {
    const target = event.target as HTMLElement;
    const rect = target.getBoundingClientRect();
    tooltip.style.top = `${rect.bottom + 10}px`;
    tooltip.style.left = `${rect.left}px`;

    tooltip.classList.remove("oculto");
    tooltip.classList.add("visible");
  });

  nombreSpan.addEventListener("mouseleave", () => {
    tooltip.classList.remove("visible");
    tooltip.classList.add("oculto");
  });
}

// ==================== FUNCIONES AUXILIARES ====================

function obtenerDescripcionPorPuesto(puesto: string): string {
  const descripciones: { [key: string]: string } = {
    "Administradora": "Encargada de la gestión de ventas, atención al cliente y supervisión de inventario.",
    "Desarrolladora": "Responsable del desarrollo y mantenimiento de aplicaciones y sistemas.",
    "Desarrollador": "Responsable del desarrollo y mantenimiento de aplicaciones y sistemas.",
    "Contadora": "Encargada de la gestión contable, fiscal y financiera de la empresa.",
    "Soporte Técnico": "Brinda asistencia técnica a usuarios y mantiene la infraestructura tecnológica.",
    "Recursos Humanos": "Gestiona el personal, reclutamiento y bienestar de los empleados."
  };

  return descripciones[puesto] || "Colaborador de la empresa con funciones asignadas.";
}

function obtenerImagenPorNombre(nombre: string): string {
  const imagenes: { [key: string]: string } = {
    "Rosalía": "../Img/Mandy_abojada.webp",
    "Rosario": "../Img/usuario_mujer.png",
    "Guadalupe": "../Img/usuario_mujer.png",
    "Ana": "../Img/usuario_mujer.png",
    "María": "../Img/usuario_mujer.png",
    "Laura": "../Img/usuario_mujer.png",
    "Carlos": "../Img/usuario_hombre.png",
    "José": "../Img/usuario_hombre.png"
  };

  return imagenes[nombre] || "../Img/usuario_default.png";
}

function formatearFecha(fecha: string): string {
  if (!fecha || fecha === "-") return "No disponible";

  try {
    const [year, month, day] = fecha.split("-");
    const meses = [
      "enero", "febrero", "marzo", "abril", "mayo", "junio",
      "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre"
    ];
    return `${parseInt(day)} de ${meses[parseInt(month) - 1]} de ${year}`;
  } catch {
    return fecha;
  }
}

function obtenerInfoPorDefecto(nombre: string): VendedorInfo {
  return {
    nombre: nombre,
    puesto: "Empleado",
    area: "General",
    descripcion: "Colaborador de la empresa.",
    imagen: "../Img/usuario_default.png",
    correo: "sin-correo@empresa.com",
    telefono: "Sin teléfono",
    direccion: "Sin dirección",
    fechaIngreso: "No disponible"
  };
}
