import { Router } from "express";
import fs from "fs";
import path from "path";

const router = Router();
const dataDir = path.join(process.cwd(), "data");
const fileVentas = path.join(dataDir, "ventas.txt");

// ==================== VENTAS ====================

// Obtener ventas
router.get("/", (req, res) => {
  try {
    let data = "";
    if (fs.existsSync(fileVentas)) {
      data = fs.readFileSync(fileVentas, "utf8");
    } else {
      data = "id,clienteId,nombreCliente,productos,fecha,total,tipoPago\n";
      fs.writeFileSync(fileVentas, data, "utf8");
    }
    res.type("text/plain").send(data);
  } catch (err) {
    res.status(500).json({ mensaje: "Error al leer ventas.txt" });
  }
});

// Obtener siguiente ID
function obtenerSiguienteId() {
  try {
    if (!fs.existsSync(fileVentas)) {
      return 1;
    }

    const contenido = fs.readFileSync(fileVentas, "utf8");
    const lineas = contenido.split("\n").filter(l => l.trim());
    const ventasExistentes = lineas.slice(1);

    if (ventasExistentes.length === 0) {
      return 1;
    }

    const ids = ventasExistentes.map(linea => {
      const partes = linea.split(',');
      return parseInt(partes[0]) || 0;
    });

    const maxId = Math.max(...ids);
    return maxId + 1;
  } catch (err) {
    return 1;
  }
}

// Guardar venta
router.post("/guardar", (req, res) => {
  try {
    const venta = req.body;

    if (!venta || !venta.clienteId || !venta.items || venta.items.length === 0) {
      return res.status(400).json({ mensaje: "Datos incompletos de la venta" });
    }

    const nuevoId = obtenerSiguienteId();
    venta.id = nuevoId;

    let lines = [];
    if (fs.existsSync(fileVentas)) {
      lines = fs.readFileSync(fileVentas, "utf8").split("\n").filter(l => l);
    } else {
      lines.push("id,clienteId,nombreCliente,productos,fecha,total,tipoPago");
    }

    const encabezado = lines[0];
    const ventas = lines.slice(1);

    const productosStr = venta.items.map(item =>
      `${item.productoId}:${item.cantidad}:${item.precioUnitario}:${item.subtotal}`
    ).join("|");

    const nombreClienteLimpio = venta.nombreCliente.replace(/"/g, '');
    const tipoPago = venta.tipoPago || "Efectivo";

    const nuevaLinea =
      `${venta.id},${venta.clienteId},"${nombreClienteLimpio}","${productosStr}",${venta.fecha},${venta.total},${tipoPago}`;

    ventas.push(nuevaLinea);

    fs.writeFileSync(
      fileVentas,
      [encabezado, ...ventas].join("\n") + "\n",
      "utf8"
    );

    res.json({
      success: true,
      mensaje: "Venta registrada correctamente",
      id: nuevoId
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      mensaje: "Error al guardar venta",
      error: err.message
    });
  }
});

// Eliminar venta
router.delete("/:id", (req, res) => {
  try {
    const idEliminar = parseInt(req.params.id);
    if (!idEliminar) {
      return res.status(400).json({ mensaje: "ID inválido" });
    }

    if (!fs.existsSync(fileVentas)) {
      return res.status(404).json({ mensaje: "Archivo de ventas no encontrado" });
    }

    let lines = fs.readFileSync(fileVentas, "utf8").split("\n").filter(l => l);
    const encabezado = lines[0];
    const ventas = lines.slice(1);

    const ventasFiltradas = ventas.filter(l => !l.startsWith(idEliminar + ","));

    if (ventasFiltradas.length === ventas.length) {
      return res.status(404).json({ mensaje: "Venta no encontrada" });
    }

    fs.writeFileSync(
      fileVentas,
      [encabezado, ...ventasFiltradas].join("\n") + "\n",
      "utf8"
    );

    res.json({ mensaje: "Venta eliminada correctamente" });
  } catch (err) {
    res.status(500).json({ mensaje: "Error al eliminar venta" });
  }
});

export default router;
