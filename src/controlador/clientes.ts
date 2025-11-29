interface ClienteInfo {
  id: number;
  nombre: string;
  correo: string;
  telefono: string;
  direccion: string;
  fechaRegistro: string;
  categoria: string;
}

const cliInputs = {
  nombre: document.getElementById("cliNombre") as HTMLInputElement,
  correo: document.getElementById("cliCorreo") as HTMLInputElement,
  telefono: document.getElementById("cliTelefono") as HTMLInputElement,
  direccion: document.getElementById("cliDireccion") as HTMLInputElement,
  fechaRegistro: document.getElementById("cliFechaRegistro") as HTMLInputElement,
  categoria: document.getElementById("cliCategoria") as HTMLInputElement,
};

const cliTabla = document.getElementById("clienteTable") as HTMLTableSectionElement;

const btnCliNuevo = document.getElementById("btnCliNuevo") as HTMLButtonElement;
const btnCliModificar = document.getElementById("btnCliModificar") as HTMLButtonElement;
const btnCliEliminar = document.getElementById("btnCliEliminar") as HTMLButtonElement;
const btnCliGuardar = document.getElementById("btnCliGuardar") as HTMLButtonElement;
const btnCliCancelar = document.getElementById("btnCliCancelar") as HTMLButtonElement;

let clientesData: ClienteInfo[] = [];
let cliContador = 1;
let cliSeleccionado: number | null = null;
let cliModoEdicion: "nuevo" | "editar" | null = null;

function mostrarMensaje(texto: string, tipo: "exito" | "error" = "exito") {
  console.log(`[${tipo.toUpperCase()}] ${texto}`);
  alert(texto);
}

function cargarClientes() {
  fetch("http://localhost:3000/clientes")
    .then(res => res.text())
    .then(text => {
      const lines = text.split("\n").map(l => l.trim()).filter(l => l);
      
      if (lines.length === 0) {
        console.log("No hay datos en el archivo");
        return;
      }

      lines.shift(); // Quitar encabezado
      
      clientesData = lines.map(line => {
        // FUNCIÓN DE PARSEO MEJORADA para CSV con comillas
        const cols: string[] = [];
        let currentCol = '';
        let insideQuotes = false;
        
        for (let i = 0; i < line.length; i++) {
          const char = line[i];
          
          if (char === '"') {
            insideQuotes = !insideQuotes;
          } else if (char === ',' && !insideQuotes) {
            cols.push(currentCol.trim());
            currentCol = '';
          } else {
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
        ? Math.max(...clientesData.map(c => c.id)) + 1 
        : 1;

      cliMostrarClientes();
      cliActivarCampos(false);
      
      console.log(" Clientes cargados desde el servidor:", clientesData);
      console.log(" Próximo ID será:", cliContador);
    })
    .catch(err => {
      console.error(" Error al cargar clientes:", err);
      mostrarMensaje("Error al conectar con el servidor. Verifica que esté corriendo en http://localhost:3000", "error");
    });
}

function cliMostrarClientes() {
  cliTabla.innerHTML = "";
  clientesData.forEach(cli => {
    const fila = document.createElement("tr");
    fila.innerHTML = `
      <td>${cli.id}</td>
      <td>${cli.nombre}</td>
      <td>${cli.correo}</td>
      <td>${cli.telefono}</td>
      <td>${cli.direccion}</td>
      <td>${cli.fechaRegistro}</td>
      <td>${cli.categoria}</td>
    `;
    fila.style.cursor = "pointer";
    fila.addEventListener("click", () => cliSeleccionarCliente(cli.id));
    cliTabla.appendChild(fila);
  });
}

function cliSeleccionarCliente(id: number) {
  cliSeleccionado = id;
  const cli = clientesData.find(c => c.id === id);
  if (!cli) return;
  
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
  Object.values(cliInputs).forEach(i => i.value = "");
}

function cliActivarCampos(estado: boolean) {
  Object.values(cliInputs).forEach(i => i.disabled = !estado);
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
  const hoy = new Date().toISOString().split('T')[0];
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
  const datos = {
    id: cliModoEdicion === "nuevo" ? cliContador : cliSeleccionado!,
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
    .then(res => {
      if (!res.ok) {
        throw new Error(`Error del servidor: ${res.status}`);
      }
      return res.json();
    })
    .then(data => {
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
    .catch(err => {
      console.error(" Error al guardar cliente:", err);
      mostrarMensaje("Error al guardar cliente: " + err.message, "error");
    });
}

function cliEliminarCliente() {
  if (cliSeleccionado === null) {
    mostrarMensaje(" Selecciona un cliente para eliminar.", "error");
    return;
  }
  
  if (!confirm("¿Seguro que deseas eliminar este cliente?")) return;
  
  console.log(" Eliminando cliente ID:", cliSeleccionado);

  // Eliminar del servidor
  fetch(`http://localhost:3000/clientes/${cliSeleccionado}`, {
    method: "DELETE"
  })
    .then(res => {
      if (!res.ok) {
        throw new Error(`Error del servidor: ${res.status}`);
      }
      return res.json();
    })
    .then(data => {
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
    .catch(err => {
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
document.addEventListener("DOMContentLoaded", () => {
  console.log(" Módulo de clientes iniciado");
  cargarClientes();
});