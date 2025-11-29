// ================== ELEMENTOS HTML ==================
var tipoPersonaSelect = document.getElementById("tipoPersona");
var searchInput = document.querySelector(".search-input");
var tableBody = document.getElementById("tableBody");
var btnCrearNuevo = document.getElementById("btnCrearNuevo");
// Modales
var modalCrear = document.getElementById("modalCrear");
var modalModificar = document.getElementById("modalModificar");
var modalEliminar = document.getElementById("modalEliminar");
// Formulario Crear
var formCrear = document.getElementById("formCrear");
var btnCancelarCrear = document.getElementById("btnCancelarCrear");
// Formulario Modificar
var formModificar = document.getElementById("formModificar");
var btnCancelarModificar = document.getElementById("btnCancelarModificar");
// Modal Eliminar
var nombreEliminar = document.getElementById("nombreEliminar");
var btnCancelarEliminar = document.getElementById("btnCancelarEliminar");
var btnConfirmarEliminar = document.getElementById("btnConfirmarEliminar");
// Botones de cerrar modales
var closeBtns = document.querySelectorAll(".close-btn");
// ================== VARIABLES GLOBALES ==================
var personasData = [];
var personasFiltradas = [];
var personaSeleccionadaId = null;
// ================== UTILIDADES ==================
function mostrarMensajes(texto, tipo) {
    if (tipo === void 0) { tipo = "exito"; }
    alert(texto);
    console.log("[".concat(tipo.toUpperCase(), "] ").concat(texto));
}
function abrirModal(modal) {
    modal.classList.add("active");
}
function cerrarModal(modal) {
    modal.classList.remove("active");
}
// ================== CARGAR PERSONAS ==================
function cargarPersonas() {
    fetch("http://localhost:3000/personas")
        .then(function (res) { return res.text(); })
        .then(function (text) {
        var lineas = text.split("\n").map(function (l) { return l.trim(); }).filter(function (l) { return l; });
        if (lineas.length <= 1) {
            console.log("No hay datos de personas");
            return;
        }
        var headers = lineas[0].split("\t");
        personasData = lineas.slice(1).map(function (linea) {
            var cols = linea.split("\t");
            var p = {};
            headers.forEach(function (h, i) { var _a; return (p[h.trim()] = ((_a = cols[i]) === null || _a === void 0 ? void 0 : _a.trim()) || ""); });
            return {
                idPersona: Number(p["idPersona"]),
                Nombre: p["Nombre"] || "",
                Apellidos: "".concat(p["ApellidoPaterno"] || "", " ").concat(p["ApellidoMaterno"] || "").trim(),
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
        .catch(function (err) {
        console.error("Error al cargar personas:", err);
        mostrarMensajes("Error al conectar con el servidor.", "error");
    });
}
// ================== FILTROS ==================
function aplicarFiltros() {
    var tipo = tipoPersonaSelect.value.toLowerCase();
    var busqueda = searchInput.value.toLowerCase().trim();
    console.log("Aplicando filtros - Tipo:", tipo, "Búsqueda:", busqueda);
    personasFiltradas = personasData.filter(function (p) {
        // Normalizar el tipo de persona para comparación
        var tipoPersonaNormalizado = p.TipoPersona.toLowerCase();
        // Mapeo de valores del select a tipos de persona
        var cumpleTipo = tipo === "todos" ? true : // NUEVO: Mostrar todos sin filtro
            tipo === "empleados" ? tipoPersonaNormalizado === "empleado" :
                tipo === "clientes" ? tipoPersonaNormalizado === "cliente" :
                    tipo === "proveedores" ? tipoPersonaNormalizado === "proveedor" :
                        true;
        var cumpleBusqueda = busqueda === "" ||
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
        var fila = document.createElement("tr");
        fila.innerHTML = "<td colspan=\"7\" style=\"text-align: center; padding: 20px;\">No se encontraron resultados</td>";
        tableBody.appendChild(fila);
        return;
    }
    personasFiltradas.forEach(function (p) {
        var fila = document.createElement("tr");
        fila.innerHTML = "\n      <td>".concat(p.Nombre, "</td>\n      <td>").concat(p.Apellidos, "</td>\n      <td>").concat(p.Telefono, "</td>\n      <td>").concat(p.Email, "</td>\n      <td>").concat(p.RFC, "</td>\n      <td>").concat(p.Ciudad, "</td>\n      <td class=\"actions-cell\">\n        <button class=\"btn-icon btn-edit\" data-id=\"").concat(p.idPersona, "\">\n          <img src=\"../Img/Lapiz.png\" alt=\"Editar\" width=\"30\" height=\"30\">\n        </button>\n        <button class=\"btn-icon btn-delete\" data-id=\"").concat(p.idPersona, "\">\n          <img src=\"../Img/Basura.png\" alt=\"Eliminar\" width=\"30\" height=\"30\">\n        </button>\n      </td>\n    ");
        tableBody.appendChild(fila);
    });
    // Agregar event listeners a los botones después de crearlos
    agregarEventListenersAcciones();
}
// ================== EVENT LISTENERS DE ACCIONES ==================
function agregarEventListenersAcciones() {
    var btnsEdit = document.querySelectorAll(".btn-edit");
    var btnsDelete = document.querySelectorAll(".btn-delete");
    btnsEdit.forEach(function (btn) {
        btn.addEventListener("click", function (e) {
            e.stopPropagation();
            var id = Number(btn.getAttribute("data-id"));
            abrirModalModificar(id);
        });
    });
    btnsDelete.forEach(function (btn) {
        btn.addEventListener("click", function (e) {
            e.stopPropagation();
            var id = Number(btn.getAttribute("data-id"));
            abrirModalEliminar(id);
        });
    });
}
// ================== MODAL CREAR ==================
function abrirModalCrear() {
    formCrear.reset();
    abrirModal(modalCrear);
}
formCrear.addEventListener("submit", function (e) {
    e.preventDefault();
    var formData = new FormData(formCrear);
    var datos = {
        idPersona: Date.now(),
        Nombre: (formData.get("nombre") || ""),
        Apellidos: (formData.get("apellidos") || ""),
        TipoPersona: mapearTipoPersona(tipoPersonaSelect.value),
        Telefono: (formData.get("telefono") || ""),
        Email: (formData.get("email") || ""),
        RFC: (formData.get("rfc") || ""),
        Calle: (formData.get("calle") || ""),
        Numero: (formData.get("numero") || ""),
        Colonia: (formData.get("colonia") || ""),
        CodigoPostal: (formData.get("codigoPostal") || ""),
        Ciudad: (formData.get("ciudad") || ""),
        Estado: (formData.get("estado") || ""),
    };
    guardarPersona(datos);
    cerrarModal(modalCrear);
});
// ================== MODAL MODIFICAR ==================
function abrirModalModificar(id) {
    var persona = personasData.find(function (p) { return p.idPersona === id; });
    if (!persona) {
        console.error("Persona no encontrada:", id);
        return;
    }
    personaSeleccionadaId = id;
    // Llenar campos del formulario de modificar
    document.getElementById("editNombre").value = persona.Nombre;
    document.getElementById("editApellidos").value = persona.Apellidos;
    document.getElementById("editTelefono").value = persona.Telefono;
    document.getElementById("editEmail").value = persona.Email;
    document.getElementById("editRFC").value = persona.RFC;
    document.getElementById("editCalle").value = persona.Calle;
    document.getElementById("editNumero").value = persona.Numero;
    document.getElementById("editColonia").value = persona.Colonia;
    document.getElementById("editCP").value = persona.CodigoPostal;
    document.getElementById("editCiudad").value = persona.Ciudad;
    document.getElementById("editEstado").value = persona.Estado;
    abrirModal(modalModificar);
}
formModificar.addEventListener("submit", function (e) {
    e.preventDefault();
    if (personaSeleccionadaId === null)
        return;
    var datos = {
        idPersona: personaSeleccionadaId,
        Nombre: document.getElementById("editNombre").value,
        Apellidos: document.getElementById("editApellidos").value,
        TipoPersona: mapearTipoPersona(tipoPersonaSelect.value),
        Telefono: document.getElementById("editTelefono").value,
        Email: document.getElementById("editEmail").value,
        RFC: document.getElementById("editRFC").value,
        Calle: document.getElementById("editCalle").value,
        Numero: document.getElementById("editNumero").value,
        Colonia: document.getElementById("editColonia").value,
        CodigoPostal: document.getElementById("editCP").value,
        Ciudad: document.getElementById("editCiudad").value,
        Estado: document.getElementById("editEstado").value,
    };
    modificarPersona(datos);
    cerrarModal(modalModificar);
});
// ================== MODAL ELIMINAR ==================
function abrirModalEliminar(id) {
    var persona = personasData.find(function (p) { return p.idPersona === id; });
    if (!persona) {
        console.error("Persona no encontrada:", id);
        return;
    }
    personaSeleccionadaId = id;
    nombreEliminar.textContent = "".concat(persona.Nombre, " ").concat(persona.Apellidos);
    abrirModal(modalEliminar);
}
btnConfirmarEliminar.addEventListener("click", function () {
    if (personaSeleccionadaId === null)
        return;
    eliminarPersona(personaSeleccionadaId);
    cerrarModal(modalEliminar);
});
// ================== UTILIDAD PARA MAPEAR TIPOS ==================
function mapearTipoPersona(tipoSelect) {
    var mapa = {
        "todos": "Empleado", // Por defecto si es "todos", guardar como Empleado
        "empleados": "Empleado",
        "clientes": "Cliente",
        "proveedores": "Proveedor"
    };
    return mapa[tipoSelect.toLowerCase()] || tipoSelect;
}
// ================== CRUD OPERATIONS ==================
function guardarPersona(datos) {
    fetch("http://localhost:3000/personas/guardar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(datos),
    })
        .then(function (res) { return res.json(); })
        .then(function (resp) {
        mostrarMensajes(resp.mensaje || "Persona creada correctamente.");
        cargarPersonas();
    })
        .catch(function (err) {
        console.error("Error al guardar persona:", err);
        mostrarMensajes("Error al guardar persona.", "error");
    });
}
function modificarPersona(datos) {
    fetch("http://localhost:3000/personas/guardar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(datos),
    })
        .then(function (res) { return res.json(); })
        .then(function (resp) {
        mostrarMensajes(resp.mensaje || "Persona modificada correctamente.");
        cargarPersonas();
    })
        .catch(function (err) {
        console.error("Error al modificar persona:", err);
        mostrarMensajes("Error al modificar persona.", "error");
    });
}
function eliminarPersona(id) {
    fetch("http://localhost:3000/personas/".concat(id), {
        method: "DELETE",
    })
        .then(function (res) { return res.json(); })
        .then(function (resp) {
        mostrarMensajes(resp.mensaje || "Persona eliminada correctamente.");
        cargarPersonas();
    })
        .catch(function (err) {
        console.error("Error al eliminar persona:", err);
        mostrarMensajes("Error al eliminar persona.", "error");
    });
}
// ================== EVENT LISTENERS PRINCIPALES ==================
btnCrearNuevo.addEventListener("click", abrirModalCrear);
btnCancelarCrear.addEventListener("click", function () { return cerrarModal(modalCrear); });
btnCancelarModificar.addEventListener("click", function () { return cerrarModal(modalModificar); });
btnCancelarEliminar.addEventListener("click", function () { return cerrarModal(modalEliminar); });
// Cerrar modales con X
closeBtns.forEach(function (btn) {
    btn.addEventListener("click", function (e) {
        cerrarModal(modalCrear);
        cerrarModal(modalModificar);
        cerrarModal(modalEliminar);
    });
});
// Cerrar modal al hacer click fuera
window.addEventListener("click", function (e) {
    if (e.target === modalCrear)
        cerrarModal(modalCrear);
    if (e.target === modalModificar)
        cerrarModal(modalModificar);
    if (e.target === modalEliminar)
        cerrarModal(modalEliminar);
});
// Cerrar modales con ESC
document.addEventListener("keydown", function (e) {
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
document.addEventListener("DOMContentLoaded", function () {
    console.log("Gestor de Usuarios iniciado");
    cargarPersonas();
});
