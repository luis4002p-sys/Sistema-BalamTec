// ================== INTERFAZ ==================
interface PersonaInfo {
  idPersona: number;
  Nombre: string;
  Apellidos: string;
  TipoPersona: string;
  Telefono: string;
  Email: string;
  RFC: string;
  Calle: string;
  Numero: string;
  Colonia: string;
  CodigoPostal: string;
  Ciudad: string;
  Estado: string;
}

// ================== ELEMENTOS HTML ==================
const tipoPersonaSelect = document.getElementById("tipoPersona") as HTMLSelectElement;
const searchInput = document.querySelector(".search-input") as HTMLInputElement;
const tableBody = document.getElementById("tableBody") as HTMLTableSectionElement;
const btnCrearNuevo = document.getElementById("btnCrearNuevo") as HTMLButtonElement;

// Modales
const modalCrear = document.getElementById("modalCrear") as HTMLElement;
const modalModificar = document.getElementById("modalModificar") as HTMLElement;
const modalEliminar = document.getElementById("modalEliminar") as HTMLElement;

// Formulario Crear
const formCrear = document.getElementById("formCrear") as HTMLFormElement;
const btnCancelarCrear = document.getElementById("btnCancelarCrear") as HTMLButtonElement;

// Formulario Modificar
const formModificar = document.getElementById("formModificar") as HTMLFormElement;
const btnCancelarModificar = document.getElementById("btnCancelarModificar") as HTMLButtonElement;

// Modal Eliminar
const nombreEliminar = document.getElementById("nombreEliminar") as HTMLElement;
const btnCancelarEliminar = document.getElementById("btnCancelarEliminar") as HTMLButtonElement;
const btnConfirmarEliminar = document.getElementById("btnConfirmarEliminar") as HTMLButtonElement;

// Botones de cerrar modales
const closeBtns = document.querySelectorAll(".close-btn");

// ================== VARIABLES GLOBALES ==================
let personasData: PersonaInfo[] = [];
let personasFiltradas: PersonaInfo[] = [];
let personaSeleccionadaId: number | null = null;

// ================== UTILIDADES ==================
function mostrarMensajes(texto: string, tipo: "exito" | "error" = "exito") {
  alert(texto);
  console.log(`[${tipo.toUpperCase()}] ${texto}`);
}

function abrirModal(modal: HTMLElement) {
  modal.classList.add("active");
}

function cerrarModal(modal: HTMLElement) {
  modal.classList.remove("active");
}

// ================== CARGAR PERSONAS ==================
function cargarPersonas() {
  fetch("http://localhost:3000/personas")
    .then(res => res.text())
    .then(text => {
      const lineas = text.split("\n").map(l => l.trim()).filter(l => l);
      if (lineas.length <= 1) {
        console.log("No hay datos de personas");
        return;
      }

      const headers = lineas[0].split("\t");
      personasData = lineas.slice(1).map(linea => {
        const cols = linea.split("\t");
        const p: any = {};
        headers.forEach((h, i) => (p[h.trim()] = cols[i]?.trim() || ""));
        
        return {
          idPersona: Number(p["idPersona"]),
          Nombre: p["Nombre"] || "",
          Apellidos: `${p["ApellidoPaterno"] || ""} ${p["ApellidoMaterno"] || ""}`.trim(),
          TipoPersona: p["TipoPersona"] || "",
          Telefono: p["Teléfono"] || p["Telefono"] || "",
          Email: p["Correo"] || p["Email"] || "",
          RFC: p["RFC"] || "",
          Calle: p["Calle"] || "",
          Numero: p["Numero"] || "",
          Colonia: p["Colonia"] || "",
          CodigoPostal: p["CodigoPostal"] || p["CP"] || "",
          Ciudad: p["Ciudad"] || "",
          Estado: p["Estado"] || "",
        };
      });

      console.log("Personas cargadas:", personasData);
      aplicarFiltros();
    })
    .catch(err => {
      console.error("Error al cargar personas:", err);
      mostrarMensajes("Error al conectar con el servidor.", "error");
    });
}

// ================== FILTROS ==================
function aplicarFiltros() {
  const tipo = tipoPersonaSelect.value.toLowerCase();
  const busqueda = searchInput.value.toLowerCase().trim();

  console.log("Aplicando filtros - Tipo:", tipo, "Búsqueda:", busqueda);

  personasFiltradas = personasData.filter(p => {
    // Normalizar el tipo de persona para comparación
    const tipoPersonaNormalizado = p.TipoPersona.toLowerCase();
    
    // Mapeo de valores del select a tipos de persona
    const cumpleTipo = 
      tipo === "todos" ? true : 
      tipo === "empleados" ? tipoPersonaNormalizado === "empleado" :
      tipo === "clientes" ? tipoPersonaNormalizado === "cliente" :
      tipo === "proveedores" ? tipoPersonaNormalizado === "proveedor" :
      true;
    
    const cumpleBusqueda = busqueda === "" || 
      p.Nombre.toLowerCase().includes(busqueda) ||
      p.Apellidos.toLowerCase().includes(busqueda) ||
      p.Email.toLowerCase().includes(busqueda) ||
      p.Telefono.toLowerCase().includes(busqueda) ||
      p.RFC.toLowerCase().includes(busqueda);
    
    return cumpleTipo && cumpleBusqueda;
  });

  console.log("Personas filtradas:", personasFiltradas);
  llenarTabla();
}

// ================== LLENAR TABLA ==================
function llenarTabla() {
  console.log("Llenando tabla con", personasFiltradas.length, "registros");
  tableBody.innerHTML = "";
  
  if (personasFiltradas.length === 0) {
    const fila = document.createElement("tr");
    fila.innerHTML = `<td colspan="7" style="text-align: center; padding: 20px;">No se encontraron resultados</td>`;
    tableBody.appendChild(fila);
    return;
  }
  
  personasFiltradas.forEach(p => {
    const fila = document.createElement("tr");
    fila.innerHTML = `
      <td>${p.Nombre}</td>
      <td>${p.Apellidos}</td>
      <td>${p.Telefono}</td>
      <td>${p.Email}</td>
      <td>${p.RFC}</td>
      <td>${p.Ciudad}</td>
      <td class="actions-cell">
        <button class="btn-icon btn-edit" data-id="${p.idPersona}">
          <img src="../Img/Lapiz.png" alt="Editar" width="30" height="30">
        </button>
        <button class="btn-icon btn-delete" data-id="${p.idPersona}">
          <img src="../Img/Basura.png" alt="Eliminar" width="30" height="30">
        </button>
      </td>
    `;
    
    tableBody.appendChild(fila);
  });

  // Agregar event listeners a los botones después de crearlos
  agregarEventListenersAcciones();
}

// ================== EVENT LISTENERS DE ACCIONES ==================
function agregarEventListenersAcciones() {
  const btnsEdit = document.querySelectorAll(".btn-edit");
  const btnsDelete = document.querySelectorAll(".btn-delete");

  btnsEdit.forEach(btn => {
    btn.addEventListener("click", (e) => {
      e.stopPropagation();
      const id = Number((btn as HTMLElement).getAttribute("data-id"));
      abrirModalModificar(id);
    });
  });

  btnsDelete.forEach(btn => {
    btn.addEventListener("click", (e) => {
      e.stopPropagation();
      const id = Number((btn as HTMLElement).getAttribute("data-id"));
      abrirModalEliminar(id);
    });
  });
}

// ================== MODAL CREAR ==================
function abrirModalCrear() {
  formCrear.reset();
  abrirModal(modalCrear);
}

formCrear.addEventListener("submit", (e) => {
  e.preventDefault();
  
  const formData = new FormData(formCrear);
  const datos: PersonaInfo = {
    idPersona: Date.now(),
    Nombre: (formData.get("nombre") || "") as string,
    Apellidos: (formData.get("apellidos") || "") as string,
    TipoPersona: mapearTipoPersona(tipoPersonaSelect.value),
    Telefono: (formData.get("telefono") || "") as string,
    Email: (formData.get("email") || "") as string,
    RFC: (formData.get("rfc") || "") as string,
    Calle: (formData.get("calle") || "") as string,
    Numero: (formData.get("numero") || "") as string,
    Colonia: (formData.get("colonia") || "") as string,
    CodigoPostal: (formData.get("codigoPostal") || "") as string,
    Ciudad: (formData.get("ciudad") || "") as string,
    Estado: (formData.get("estado") || "") as string,
  };

  guardarPersona(datos);
  cerrarModal(modalCrear);
});

// ================== MODAL MODIFICAR ==================
function abrirModalModificar(id: number) {
  const persona = personasData.find(p => p.idPersona === id);
  if (!persona) {
    console.error("Persona no encontrada:", id);
    return;
  }

  personaSeleccionadaId = id;
  
  // Llenar campos del formulario de modificar
  (document.getElementById("editNombre") as HTMLInputElement).value = persona.Nombre;
  (document.getElementById("editApellidos") as HTMLInputElement).value = persona.Apellidos;
  (document.getElementById("editTelefono") as HTMLInputElement).value = persona.Telefono;
  (document.getElementById("editEmail") as HTMLInputElement).value = persona.Email;
  (document.getElementById("editRFC") as HTMLInputElement).value = persona.RFC;
  (document.getElementById("editCalle") as HTMLInputElement).value = persona.Calle;
  (document.getElementById("editNumero") as HTMLInputElement).value = persona.Numero;
  (document.getElementById("editColonia") as HTMLInputElement).value = persona.Colonia;
  (document.getElementById("editCP") as HTMLInputElement).value = persona.CodigoPostal;
  (document.getElementById("editCiudad") as HTMLInputElement).value = persona.Ciudad;
  (document.getElementById("editEstado") as HTMLInputElement).value = persona.Estado;

  abrirModal(modalModificar);
}

formModificar.addEventListener("submit", (e) => {
  e.preventDefault();
  
  if (personaSeleccionadaId === null) return;

  const datos: PersonaInfo = {
    idPersona: personaSeleccionadaId,
    Nombre: (document.getElementById("editNombre") as HTMLInputElement).value,
    Apellidos: (document.getElementById("editApellidos") as HTMLInputElement).value,
    TipoPersona: mapearTipoPersona(tipoPersonaSelect.value),
    Telefono: (document.getElementById("editTelefono") as HTMLInputElement).value,
    Email: (document.getElementById("editEmail") as HTMLInputElement).value,
    RFC: (document.getElementById("editRFC") as HTMLInputElement).value,
    Calle: (document.getElementById("editCalle") as HTMLInputElement).value,
    Numero: (document.getElementById("editNumero") as HTMLInputElement).value,
    Colonia: (document.getElementById("editColonia") as HTMLInputElement).value,
    CodigoPostal: (document.getElementById("editCP") as HTMLInputElement).value,
    Ciudad: (document.getElementById("editCiudad") as HTMLInputElement).value,
    Estado: (document.getElementById("editEstado") as HTMLInputElement).value,
  };

  modificarPersona(datos);
  cerrarModal(modalModificar);
});

// ================== MODAL ELIMINAR ==================
function abrirModalEliminar(id: number) {
  const persona = personasData.find(p => p.idPersona === id);
  if (!persona) {
    console.error("Persona no encontrada:", id);
    return;
  }

  personaSeleccionadaId = id;
  nombreEliminar.textContent = `${persona.Nombre} ${persona.Apellidos}`;
  abrirModal(modalEliminar);
}

btnConfirmarEliminar.addEventListener("click", () => {
  if (personaSeleccionadaId === null) return;
  
  eliminarPersona(personaSeleccionadaId);
  cerrarModal(modalEliminar);
});

// ================== UTILIDAD PARA MAPEAR TIPOS ==================
function mapearTipoPersona(tipoSelect: string): string {
  const mapa: { [key: string]: string } = {
    "todos": "Empleado", // Por defecto si es "todos", guardar como Empleado
    "empleados": "Empleado",
    "clientes": "Cliente",
    "proveedores": "Proveedor"
  };
  return mapa[tipoSelect.toLowerCase()] || tipoSelect;
}

// ================== CRUD OPERATIONS ==================
function guardarPersona(datos: PersonaInfo) {
  fetch("http://localhost:3000/personas/guardar", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(datos),
  })
    .then(res => res.json())
    .then(resp => {
      mostrarMensajes(resp.mensaje || "Persona creada correctamente.");
      cargarPersonas();
    })
    .catch(err => {
      console.error("Error al guardar persona:", err);
      mostrarMensajes("Error al guardar persona.", "error");
    });
}

function modificarPersona(datos: PersonaInfo) {
  fetch("http://localhost:3000/personas/guardar", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(datos),
  })
    .then(res => res.json())
    .then(resp => {
      mostrarMensajes(resp.mensaje || "Persona modificada correctamente.");
      cargarPersonas();
    })
    .catch(err => {
      console.error("Error al modificar persona:", err);
      mostrarMensajes("Error al modificar persona.", "error");
    });
}

function eliminarPersona(id: number) {
  fetch(`http://localhost:3000/personas/${id}`, {
    method: "DELETE",
  })
    .then(res => res.json())
    .then(resp => {
      mostrarMensajes(resp.mensaje || "Persona eliminada correctamente.");
      cargarPersonas();
    })
    .catch(err => {
      console.error("Error al eliminar persona:", err);
      mostrarMensajes("Error al eliminar persona.", "error");
    });
}

// ================== EVENT LISTENERS PRINCIPALES ==================
btnCrearNuevo.addEventListener("click", abrirModalCrear);
btnCancelarCrear.addEventListener("click", () => cerrarModal(modalCrear));
btnCancelarModificar.addEventListener("click", () => cerrarModal(modalModificar));
btnCancelarEliminar.addEventListener("click", () => cerrarModal(modalEliminar));

// Cerrar modales con X
closeBtns.forEach(btn => {
  btn.addEventListener("click", (e) => {
    cerrarModal(modalCrear);
    cerrarModal(modalModificar);
    cerrarModal(modalEliminar);
  });
});

// Cerrar modal al hacer click fuera
window.addEventListener("click", (e) => {
  if (e.target === modalCrear) cerrarModal(modalCrear);
  if (e.target === modalModificar) cerrarModal(modalModificar);
  if (e.target === modalEliminar) cerrarModal(modalEliminar);
});

// Cerrar modales con ESC
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") {
    cerrarModal(modalCrear);
    cerrarModal(modalModificar);
    cerrarModal(modalEliminar);
  }
});

// Filtros
tipoPersonaSelect.addEventListener("change", aplicarFiltros);
searchInput.addEventListener("input", aplicarFiltros);

// ================== INICIALIZACIÓN ==================
document.addEventListener("DOMContentLoaded", () => {
  console.log("Gestor de Usuarios iniciado");
  cargarPersonas();
});