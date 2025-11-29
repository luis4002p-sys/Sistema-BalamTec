var cliInputs = {
    nombre: document.getElementById("cliNombre"),
    correo: document.getElementById("cliCorreo"),
    telefono: document.getElementById("cliTelefono"),
    direccion: document.getElementById("cliDireccion"),
    fechaRegistro: document.getElementById("cliFechaRegistro"),
    categoria: document.getElementById("cliCategoria"),
};
var cliTabla = document.getElementById("clienteTable");
var btnCliNuevo = document.getElementById("btnCliNuevo");
var btnCliModificar = document.getElementById("btnCliModificar");
var btnCliEliminar = document.getElementById("btnCliEliminar");
var btnCliGuardar = document.getElementById("btnCliGuardar");
var btnCliCancelar = document.getElementById("btnCliCancelar");
var clientesData = [];
var cliContador = 1;
var cliSeleccionado = null;
var cliModoEdicion = null;
function mostrarMensaje(texto, tipo) {
    if (tipo === void 0) { tipo = "exito"; }
    console.log("[".concat(tipo.toUpperCase(), "] ").concat(texto));
    alert(texto);
}
function cargarClientes() {
    fetch("http://localhost:3000/clientes")
        .then(function (res) { return res.text(); })
        .then(function (text) {
        var lines = text.split("\n").map(function (l) { return l.trim(); }).filter(function (l) { return l; });
        if (lines.length === 0) {
            console.log("No hay datos en el archivo");
            return;
        }
        lines.shift(); // Quitar encabezado
        clientesData = lines.map(function (line) {
            // FUNCIÓN DE PARSEO MEJORADA para CSV con comillas
            var cols = [];
            var currentCol = '';
            var insideQuotes = false;
            for (var i = 0; i < line.length; i++) {
                var char = line[i];
                if (char === '"') {
                    insideQuotes = !insideQuotes;
                }
                else if (char === ',' && !insideQuotes) {
                    cols.push(currentCol.trim());
                    currentCol = '';
                }
                else {
                    currentCol += char;
                }
            }
            // Agregar la última columna
            cols.push(currentCol.trim());
            console.log(" Parseando línea:", cols);
            return {
                id: Number(cols[0]),
                nombre: cols[1] || "",
                correo: cols[2] || "",
                telefono: cols[3] || "",
                direccion: cols[4] || "",
                fechaRegistro: cols[5] || "",
                categoria: cols[6] || "",
            };
        });
        // Calcular el próximo ID
        cliContador = clientesData.length > 0
            ? Math.max.apply(Math, clientesData.map(function (c) { return c.id; })) + 1
            : 1;
        cliMostrarClientes();
        cliActivarCampos(false);
        console.log(" Clientes cargados desde el servidor:", clientesData);
        console.log(" Próximo ID será:", cliContador);
    })
        .catch(function (err) {
        console.error(" Error al cargar clientes:", err);
        mostrarMensaje("Error al conectar con el servidor. Verifica que esté corriendo en http://localhost:3000", "error");
    });
}
function cliMostrarClientes() {
    cliTabla.innerHTML = "";
    clientesData.forEach(function (cli) {
        var fila = document.createElement("tr");
        fila.innerHTML = "\n      <td>".concat(cli.id, "</td>\n      <td>").concat(cli.nombre, "</td>\n      <td>").concat(cli.correo, "</td>\n      <td>").concat(cli.telefono, "</td>\n      <td>").concat(cli.direccion, "</td>\n      <td>").concat(cli.fechaRegistro, "</td>\n      <td>").concat(cli.categoria, "</td>\n    ");
        fila.style.cursor = "pointer";
        fila.addEventListener("click", function () { return cliSeleccionarCliente(cli.id); });
        cliTabla.appendChild(fila);
    });
}
function cliSeleccionarCliente(id) {
    cliSeleccionado = id;
    var cli = clientesData.find(function (c) { return c.id === id; });
    if (!cli)
        return;
    cliInputs.nombre.value = cli.nombre;
    cliInputs.correo.value = cli.correo;
    cliInputs.telefono.value = cli.telefono;
    cliInputs.direccion.value = cli.direccion;
    cliInputs.fechaRegistro.value = cli.fechaRegistro;
    cliInputs.categoria.value = cli.categoria;
    btnCliModificar.disabled = false;
    btnCliEliminar.disabled = false;
    btnCliCancelar.disabled = false;
}
function cliLimpiarCampos() {
    Object.values(cliInputs).forEach(function (i) { return i.value = ""; });
}
function cliActivarCampos(estado) {
    Object.values(cliInputs).forEach(function (i) { return i.disabled = !estado; });
}
function cliNuevoCliente() {
    cliLimpiarCampos();
    cliActivarCampos(true);
    cliModoEdicion = "nuevo";
    cliSeleccionado = null;
    btnCliGuardar.disabled = false;
    btnCliCancelar.disabled = false;
    btnCliNuevo.disabled = true;
    btnCliModificar.disabled = true;
    btnCliEliminar.disabled = true;
    // Auto-establecer fecha actual
    var hoy = new Date().toISOString().split('T')[0];
    cliInputs.fechaRegistro.value = hoy;
    console.log(" Modo NUEVO activado. ID asignado será:", cliContador);
}
function cliModificarCliente() {
    if (cliSeleccionado === null) {
        mostrarMensaje(" Selecciona un cliente para modificar.", "error");
        return;
    }
    cliActivarCampos(true);
    cliModoEdicion = "editar";
    btnCliGuardar.disabled = false;
    btnCliCancelar.disabled = false;
    btnCliNuevo.disabled = true;
    btnCliModificar.disabled = true;
    btnCliEliminar.disabled = true;
    console.log(" Modo EDITAR activado para ID:", cliSeleccionado);
}
function cliGuardarCambios() {
    var datos = {
        id: cliModoEdicion === "nuevo" ? cliContador : cliSeleccionado,
        nombre: cliInputs.nombre.value.trim(),
        correo: cliInputs.correo.value.trim(),
        telefono: cliInputs.telefono.value.trim(),
        direccion: cliInputs.direccion.value.trim(),
        fechaRegistro: cliInputs.fechaRegistro.value.trim(),
        categoria: cliInputs.categoria.value.trim(),
    };
    // Validación
    if (!datos.nombre || !datos.correo || !datos.telefono || !datos.direccion || !datos.fechaRegistro || !datos.categoria) {
        mostrarMensaje(" Completa todos los campos.", "error");
        return;
    }
    console.log(" Guardando cliente:", datos);
    fetch("http://localhost:3000/clientes/guardar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(datos)
    })
        .then(function (res) {
        if (!res.ok) {
            throw new Error("Error del servidor: ".concat(res.status));
        }
        return res.json();
    })
        .then(function (data) {
        console.log(" Respuesta del servidor:", data);
        mostrarMensaje(data.mensaje || "Cliente guardado exitosamente.");
        // Recargar clientes desde el servidor para asegurar sincronización
        cargarClientes();
        // Resetear formulario
        cliModoEdicion = null;
        cliSeleccionado = null;
        cliActivarCampos(false);
        cliLimpiarCampos();
        btnCliGuardar.disabled = true;
        btnCliCancelar.disabled = true;
        btnCliNuevo.disabled = false;
        btnCliModificar.disabled = true;
        btnCliEliminar.disabled = true;
    })
        .catch(function (err) {
        console.error(" Error al guardar cliente:", err);
        mostrarMensaje("Error al guardar cliente: " + err.message, "error");
    });
}
function cliEliminarCliente() {
    if (cliSeleccionado === null) {
        mostrarMensaje(" Selecciona un cliente para eliminar.", "error");
        return;
    }
    if (!confirm("¿Seguro que deseas eliminar este cliente?"))
        return;
    console.log(" Eliminando cliente ID:", cliSeleccionado);
    // Eliminar del servidor
    fetch("http://localhost:3000/clientes/".concat(cliSeleccionado), {
        method: "DELETE"
    })
        .then(function (res) {
        if (!res.ok) {
            throw new Error("Error del servidor: ".concat(res.status));
        }
        return res.json();
    })
        .then(function (data) {
        console.log(" Respuesta del servidor:", data);
        mostrarMensaje(data.mensaje || "Cliente eliminado correctamente.");
        // Recargar clientes desde el servidor
        cargarClientes();
        cliSeleccionado = null;
        cliLimpiarCampos();
        btnCliModificar.disabled = true;
        btnCliEliminar.disabled = true;
        btnCliCancelar.disabled = true;
    })
        .catch(function (err) {
        console.error(" Error al eliminar cliente:", err);
        mostrarMensaje("Error al eliminar cliente: " + err.message, "error");
    });
}
function cliCancelarAccion() {
    cliLimpiarCampos();
    cliActivarCampos(false);
    cliModoEdicion = null;
    cliSeleccionado = null;
    btnCliGuardar.disabled = true;
    btnCliCancelar.disabled = true;
    btnCliNuevo.disabled = false;
    btnCliModificar.disabled = true;
    btnCliEliminar.disabled = true;
    console.log(" Acción cancelada");
}
// Event Listeners
btnCliNuevo.addEventListener("click", cliNuevoCliente);
btnCliModificar.addEventListener("click", cliModificarCliente);
btnCliGuardar.addEventListener("click", cliGuardarCambios);
btnCliEliminar.addEventListener("click", cliEliminarCliente);
btnCliCancelar.addEventListener("click", cliCancelarAccion);
// Inicialización
document.addEventListener("DOMContentLoaded", function () {
    console.log(" Módulo de clientes iniciado");
    cargarClientes();
});
