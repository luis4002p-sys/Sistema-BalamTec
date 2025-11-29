interface Empleado {
  id: number;
  nombre: string;
  puesto: string;
  salario: number;
  correo: string;
  telefono: string;
  fechaIngreso: string;
}

const inputs = {
  nombre: document.getElementById("nombre") as HTMLInputElement,
  puesto: document.getElementById("puesto") as HTMLInputElement,
  salario: document.getElementById("salario") as HTMLInputElement,
  correo: document.getElementById("correo") as HTMLInputElement,
  telefono: document.getElementById("telefono") as HTMLInputElement,
  fechaIngreso: document.getElementById("fechaIngreso") as HTMLInputElement,
};

const tabla = document.getElementById("employeeTable") as HTMLTableSectionElement;

// Botones
const btnNuevo = document.getElementById("btnNuevo") as HTMLButtonElement;
const btnModificar = document.getElementById("btnModificar") as HTMLButtonElement;
const btnEliminar = document.getElementById("btnEliminar") as HTMLButtonElement;
const btnGuardar = document.getElementById("btnGuardar") as HTMLButtonElement;
const btnCancelar = document.getElementById("btnCancelar") as HTMLButtonElement;

let empleados: Empleado[] = [];
let contador = 1;
let seleccionado: number | null = null;
let modoEdicion: "nuevo" | "editar" | null = null;

// ================= FUNCIONES =================

// Cargar empleados desde archivo TXT
fetch("empleados.txt")
  .then((res) => res.text())
  .then((text) => {
    const lines = text.split("\n").map((line) => line.trim()).filter((line) => line);
    lines.shift(); // eliminar encabezado si existe

    empleados = lines.map((line) => {
      const cols = line.split(/\t|,/); // separador por tab o coma
      return {
        id: Number(cols[0]),
        nombre: cols[1],
        puesto: cols[2],
        salario: Number(cols[3]),
        correo: cols[4],
        telefono: cols[5],
        fechaIngreso: cols[6],
      };
    });

    contador = empleados.length > 0 ? Math.max(...empleados.map((e) => e.id)) + 1 : 1;
    mostrarEmpleados();
    activarCampos(false);
    console.log("Empleados cargados desde TXT:", empleados);
  })
  .catch((err) => console.error("Error al cargar empleados.txt:", err));

function mostrarEmpleados(): void {
  tabla.innerHTML = "";

  empleados.forEach((emp) => {
    const fila = document.createElement("tr");
    fila.innerHTML = `
      <td>${emp.id}</td>
      <td>${emp.nombre}</td>
      <td>${emp.puesto}</td>
      <td>$${emp.salario.toFixed(2)}</td>
      <td>${emp.correo}</td>
      <td>${emp.telefono}</td>
      <td>${emp.fechaIngreso}</td>
    `;
    fila.addEventListener("click", () => seleccionarEmpleado(emp.id));
    tabla.appendChild(fila);
  });
}

function seleccionarEmpleado(id: number): void {
  seleccionado = id;
  const emp = empleados.find((e) => e.id === id);
  if (!emp) return;

  inputs.nombre.value = emp.nombre;
  inputs.puesto.value = emp.puesto;
  inputs.salario.value = emp.salario.toString();
  inputs.correo.value = emp.correo;
  inputs.telefono.value = emp.telefono;
  inputs.fechaIngreso.value = emp.fechaIngreso;

  btnModificar.disabled = false;
  btnEliminar.disabled = false;
  btnCancelar.disabled = false;
}

function limpiarCampos(): void {
  Object.values(inputs).forEach((i) => (i.value = ""));
}

function activarCampos(estado: boolean): void {
  Object.values(inputs).forEach((i) => (i.disabled = !estado));
}

function nuevoEmpleado(): void {
  limpiarCampos();
  activarCampos(true);
  modoEdicion = "nuevo";
  seleccionado = null;
  btnGuardar.disabled = false;
  btnCancelar.disabled = false;
  btnNuevo.disabled = true;
  btnModificar.disabled = true;
  btnEliminar.disabled = true;
}

function modificarEmpleado(): void {
  if (seleccionado === null) return alert("Selecciona un empleado para modificar.");
  activarCampos(true);
  modoEdicion = "editar";
  btnGuardar.disabled = false;
  btnCancelar.disabled = false;
  btnNuevo.disabled = true;
  btnModificar.disabled = true;
  btnEliminar.disabled = true;
}

function guardarCambios(): void {
  const datos = {
    nombre: inputs.nombre.value.trim(),
    puesto: inputs.puesto.value.trim(),
    salario: parseFloat(inputs.salario.value),
    correo: inputs.correo.value.trim(),
    telefono: inputs.telefono.value.trim(),
    fechaIngreso: inputs.fechaIngreso.value,
  };

  if (!datos.nombre || !datos.puesto || isNaN(datos.salario) || !datos.correo || !datos.telefono || !datos.fechaIngreso) {
    alert("Por favor completa todos los campos.");
    return;
  }

  if (modoEdicion === "nuevo") {
    const nuevo: Empleado = { id: contador++, ...datos };
    empleados.push(nuevo);
  } else if (modoEdicion === "editar" && seleccionado !== null) {
    const emp = empleados.find((e) => e.id === seleccionado);
    if (emp) Object.assign(emp, datos);
  }

  modoEdicion = null;
  seleccionado = null;
  activarCampos(false);
  limpiarCampos();
  mostrarEmpleados();

  btnGuardar.disabled = true;
  btnCancelar.disabled = true;
  btnNuevo.disabled = false;
  btnModificar.disabled = true;
  btnEliminar.disabled = true;
}

function eliminarEmpleado(): void {
  if (seleccionado === null) return alert("Selecciona un empleado para eliminar.");
  if (confirm("¿Seguro que deseas eliminar este empleado?")) {
    empleados = empleados.filter((e) => e.id !== seleccionado);
    seleccionado = null;
    limpiarCampos();
    mostrarEmpleados();
    btnModificar.disabled = true;
    btnEliminar.disabled = true;
    btnCancelar.disabled = true;
  }
}

function cancelar(): void {
  limpiarCampos();
  activarCampos(false);
  modoEdicion = null;
  seleccionado = null;
  btnGuardar.disabled = true;
  btnCancelar.disabled = true;
  btnNuevo.disabled = false;
  btnModificar.disabled = true;
  btnEliminar.disabled = true;
}

// ================= EVENTOS =================
btnNuevo.addEventListener("click", nuevoEmpleado);
btnModificar.addEventListener("click", modificarEmpleado);
btnGuardar.addEventListener("click", guardarCambios);
btnEliminar.addEventListener("click", eliminarEmpleado);
btnCancelar.addEventListener("click", cancelar);
