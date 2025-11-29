import { Router } from "express";
import fs from "fs";
import path from "path";

const router = Router();
const dataDir = path.join(process.cwd(), "data");
const fileClientes = path.join(dataDir, "clientes.txt");

// ==================== CLIENTES ====================

// Obtener clientes
router.get("/", (req, res) => {
  try {
    let data = "";
    if (fs.existsSync(fileClientes)) {
      data = fs.readFileSync(fileClientes, "utf8");
    } else {
      data = "ID_Cliente,Nombre,Correo,Telefono,Direccion,FechaRegistro,Categoria\n";
      fs.writeFileSync(fileClientes, data, "utf8");
    }
    res.type("text/plain").send(data);
  } catch (err) {
    res.status(500).json({ mensaje: "Error al leer clientes.txt" });
  }
});

// Guardar cliente
router.post("/guardar", (req, res) => {
  try {
    const cliente = req.body;

    if (!cliente || !cliente.id || !cliente.nombre) {
      return res.status(400).json({ mensaje: "Datos incompletos del cliente" });
    }

    let lines = [];
    if (fs.existsSync(fileClientes)) {
      lines = fs.readFileSync(fileClientes, "utf8").split("\n").filter(l => l);
    } else {
      lines.push("ID_Cliente,Nombre,Correo,Telefono,Direccion,FechaRegistro,Categoria");
    }

    const encabezado = lines[0];
    const clientes = lines.slice(1);

    const index = clientes.findIndex(l => l.startsWith(cliente.id + ","));

    const nuevaLinea = `${cliente.id},"${cliente.nombre}","${cliente.correo}","${cliente.telefono}","${cliente.direccion}","${cliente.fechaRegistro}","${cliente.categoria}"`;

    if (index !== -1) {
      clientes[index] = nuevaLinea;
    } else {
      clientes.push(nuevaLinea);
    }

    fs.writeFileSync(fileClientes, [encabezado, ...clientes].join("\n"), "utf8");

    res.json({ mensaje: "Cliente guardado correctamente", id: cliente.id });
  } catch (err) {
    res.status(500).json({ mensaje: "Error al guardar cliente" });
  }
});

// Eliminar cliente
router.delete("/:id", (req, res) => {
  try {
    const idEliminar = parseInt(req.params.id);
    if (!idEliminar) {
      return res.status(400).json({ mensaje: "ID inválido" });
    }

    if (!fs.existsSync(fileClientes)) {
      return res.status(404).json({ mensaje: "Archivo de clientes no encontrado" });
    }

    let lines = fs.readFileSync(fileClientes, "utf8").split("\n").filter(l => l);
    const encabezado = lines[0];
    const clientes = lines.slice(1);

    const clientesFiltrados = clientes.filter(l => !l.startsWith(idEliminar + ","));

    if (clientesFiltrados.length === clientes.length) {
      return res.status(404).json({ mensaje: "Cliente no encontrado" });
    }

    fs.writeFileSync(fileClientes, [encabezado, ...clientesFiltrados].join("\n"), "utf8");

    res.json({ mensaje: "Cliente eliminado correctamente" });
  } catch (err) {
    res.status(500).json({ mensaje: "Error al eliminar cliente" });
  }
});

export default router;
