import { Router } from "express";
import fs from "fs";
import path from "path";

const router = Router();
const dataDir = path.join(process.cwd(), "data");
console.log("📂 Ruta de datos:", dataDir);
console.log("📂 ¿Existe el directorio?", fs.existsSync(dataDir));
const fileProductos = path.join(dataDir, "productos.txt");

// ==================== FUNCIÓN AUXILIAR: Parsear Producto ====================
function parsearProducto(linea, separador = '\t') {
  const cols = linea.split(separador).map(c => c.trim().replace(/^"|"$/g, ''));
  
  return {
    id: parseInt(cols[0]) || 0,
    nombre: cols[1] || '',
    categoria: cols[2] || '',
    precioCompra: parseFloat(cols[3]) || 0,
    precioVenta: parseFloat(cols[4]) || 0,
    stock: parseInt(cols[5]) || 0,
    stockMinimo: parseInt(cols[6]) || 0,
    proveedor: cols[7] || '',
    marca: cols[8] || '',
    descripcion: cols[9] || '',
    fechaRegistro: cols[10] || '',
    estado: cols[11] || 'Activo'
  };
}

// ==================== FUNCIÓN: Construir línea de producto ====================
function construirLineaProducto(producto) {
  return [
    producto.id,
    `"${producto.nombre}"`,
    `"${producto.categoria}"`,
    producto.precioCompra,
    producto.precioVenta,
    producto.stock,
    producto.stockMinimo || 0,
    `"${producto.proveedor || ''}"`,
    `"${producto.marca || ''}"`,
    `"${producto.descripcion || ''}"`,
    producto.fechaRegistro || new Date().toISOString().split('T')[0],
    producto.estado || 'Activo'
  ].join('\t');
}

// ==================== OBTENER TODOS LOS PRODUCTOS ====================
router.get("/", (req, res) => {
  try {
    let data = "";
    if (fs.existsSync(fileProductos)) {
      data = fs.readFileSync(fileProductos, "utf8");
      console.log("✅ Archivo productos.txt leído correctamente");
    } else {
      data = "ID_Producto\tNombre\tCategoria\tPrecioCompra\tPrecioVenta\tStock\tStockMinimo\tProveedor\tMarca\tDescripcion\tFechaRegistro\tEstado\n";
      fs.writeFileSync(fileProductos, data, "utf8");
      console.log("✅ Archivo productos.txt creado");
    }
    res.type("text/plain").send(data);
  } catch (err) {
    console.error("❌ Error al leer productos.txt:", err);
    res.status(500).json({ mensaje: "Error al leer productos.txt", error: err.message });
  }
});

// ==================== OBTENER PRODUCTO POR ID ====================
router.get("/:id", (req, res) => {
  try {
    const { id } = req.params;
    console.log(`🔍 Buscando producto con ID: ${id}`);

    if (!fs.existsSync(fileProductos)) {
      return res.status(404).json({ mensaje: "Archivo productos.txt no encontrado" });
    }

    const contenido = fs.readFileSync(fileProductos, "utf8");
    const lines = contenido.split("\n").map(l => l.trim()).filter(l => l);

    if (lines.length === 0) {
      return res.status(404).json({ mensaje: "Archivo vacío" });
    }

    const encabezado = lines[0];
    const productos = lines.slice(1);
    const separador = encabezado.includes('\t') ? '\t' : ',';

    const productoLinea = productos.find(l => {
      const cols = l.split(separador);
      return cols[0].trim() === id;
    });

    if (!productoLinea) {
      return res.status(404).json({ mensaje: `Producto con ID ${id} no encontrado` });
    }

    const producto = parsearProducto(productoLinea, separador);
    console.log(`✅ Producto encontrado:`, producto.nombre);
    res.json(producto);
  } catch (err) {
    console.error("❌ Error al buscar producto:", err);
    res.status(500).json({ mensaje: "Error al buscar producto", error: err.message });
  }
});

// ==================== GUARDAR/ACTUALIZAR PRODUCTO ====================
router.post("/guardar", (req, res) => {
  try {
    const producto = req.body;
    
    // Validaciones
    if (!producto || !producto.nombre) {
      return res.status(400).json({ mensaje: "El nombre del producto es obligatorio" });
    }

    console.log("📦 Guardando producto:", producto);

    let lines = [];
    if (fs.existsSync(fileProductos)) {
      lines = fs.readFileSync(fileProductos, "utf8").split("\n").filter(l => l);
    } else {
      lines.push("ID_Producto\tNombre\tCategoria\tPrecioCompra\tPrecioVenta\tStock\tStockMinimo\tProveedor\tMarca\tDescripcion\tFechaRegistro\tEstado");
    }

    const encabezado = lines[0];
    const productos = lines.slice(1);

    // Si no tiene ID, generar uno nuevo
    if (!producto.id) {
      const ids = productos
        .map(l => parseInt(l.split(/\t|,/)[0]))
        .filter(id => !isNaN(id));
      producto.id = ids.length > 0 ? Math.max(...ids) + 1 : 1;
    }

    // Buscar si existe
    const index = productos.findIndex(l => {
      const id = l.split(/\t|,/)[0].trim();
      return id === producto.id.toString();
    });

    const nuevaLinea = construirLineaProducto(producto);

    if (index !== -1) {
      productos[index] = nuevaLinea;
      console.log(`✅ Producto ${producto.id} actualizado`);
    } else {
      productos.push(nuevaLinea);
      console.log(`✅ Producto ${producto.id} agregado`);
    }

    fs.writeFileSync(fileProductos, [encabezado, ...productos].join("\n"), "utf8");

    res.json({ 
      mensaje: "Producto guardado correctamente", 
      id: producto.id,
      producto: parsearProducto(nuevaLinea)
    });
  } catch (err) {
    console.error("❌ Error al guardar producto:", err);
    res.status(500).json({ mensaje: "Error al guardar producto", error: err.message });
  }
});

// ==================== ELIMINAR PRODUCTO ====================
router.delete("/:id", (req, res) => {
  try {
    const idEliminar = req.params.id;
    
    if (!idEliminar) {
      return res.status(400).json({ mensaje: "ID inválido" });
    }

    if (!fs.existsSync(fileProductos)) {
      return res.status(404).json({ mensaje: "Archivo de productos no encontrado" });
    }

    let lines = fs.readFileSync(fileProductos, "utf8").split("\n").filter(l => l);
    const encabezado = lines[0];
    const productos = lines.slice(1);

    const productosFiltrados = productos.filter(l => {
      const id = l.split(/\t|,/)[0].trim();
      return id !== idEliminar;
    });

    if (productosFiltrados.length === productos.length) {
      return res.status(404).json({ mensaje: "Producto no encontrado" });
    }

    fs.writeFileSync(fileProductos, [encabezado, ...productosFiltrados].join("\n"), "utf8");
    console.log(`✅ Producto ${idEliminar} eliminado correctamente`);

    res.json({ mensaje: "Producto eliminado correctamente", id: idEliminar });
  } catch (err) {
    console.error("❌ Error al eliminar producto:", err);
    res.status(500).json({ mensaje: "Error al eliminar producto", error: err.message });
  }
});

// ==================== ACTUALIZAR STOCK ====================
router.patch("/:id/stock", (req, res) => {
  try {
    const { id } = req.params;
    const { cantidad, operacion } = req.body; // operacion: 'sumar' o 'restar'

    if (!fs.existsSync(fileProductos)) {
      return res.status(404).json({ mensaje: "Archivo no encontrado" });
    }

    let lines = fs.readFileSync(fileProductos, "utf8").split("\n").filter(l => l);
    const encabezado = lines[0];
    const productos = lines.slice(1);
    const separador = encabezado.includes('\t') ? '\t' : ',';

    const index = productos.findIndex(l => {
      const cols = l.split(separador);
      return cols[0].trim() === id;
    });

    if (index === -1) {
      return res.status(404).json({ mensaje: "Producto no encontrado" });
    }

    const producto = parsearProducto(productos[index], separador);
    
    if (operacion === 'sumar') {
      producto.stock += parseInt(cantidad) || 0;
    } else if (operacion === 'restar') {
      producto.stock -= parseInt(cantidad) || 0;
      if (producto.stock < 0) producto.stock = 0;
    }

    productos[index] = construirLineaProducto(producto);
    fs.writeFileSync(fileProductos, [encabezado, ...productos].join("\n"), "utf8");

    console.log(`✅ Stock actualizado para producto ${id}: ${producto.stock}`);
    res.json({ mensaje: "Stock actualizado", producto });
  } catch (err) {
    console.error("❌ Error al actualizar stock:", err);
    res.status(500).json({ mensaje: "Error al actualizar stock", error: err.message });
  }
});

// ==================== OBTENER PRODUCTOS CON STOCK BAJO ====================
router.get("/alertas/stock-bajo", (req, res) => {
  try {
    if (!fs.existsSync(fileProductos)) {
      return res.status(404).json({ mensaje: "Archivo no encontrado" });
    }

    const contenido = fs.readFileSync(fileProductos, "utf8");
    const lines = contenido.split("\n").map(l => l.trim()).filter(l => l);
    
    const encabezado = lines[0];
    const productos = lines.slice(1);
    const separador = encabezado.includes('\t') ? '\t' : ',';

    const productosStockBajo = productos
      .map(l => parsearProducto(l, separador))
      .filter(p => p.stock <= p.stockMinimo);

    console.log(`⚠️ Productos con stock bajo: ${productosStockBajo.length}`);
    res.json(productosStockBajo);
  } catch (err) {
    console.error("❌ Error al verificar stock:", err);
    res.status(500).json({ mensaje: "Error al verificar stock", error: err.message });
  }
});

export default router;