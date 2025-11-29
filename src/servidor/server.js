import express from "express";
import cors from "cors";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

// Obtener __dirname en ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Importar rutas
import clientesRoutes from "./routes/clientes.js";
import ventasRoutes from "./routes/ventas.js";
import usuariosRoutes from "./routes/usuarios.js";
import productosRoutes from "./routes/productos.js";
import personasRoutes from "./routes/Personas.js";

const app = express();
const PORT = 3000;

// Middlewares
app.use(cors());
app.use(express.json());

// Rutas principales
app.use("/clientes", clientesRoutes);
app.use("/ventas", ventasRoutes);
app.use("/usuarios", usuariosRoutes);
app.use("/productos", productosRoutes);
app.use("/personas", personasRoutes);

// Ruta de prueba
app.get("/", (req, res) => {
  res.send("Servidor funcionando correctamente con PERSONAS incluida");
});

// Iniciar servidor
app.listen(PORT, () => {
  // Sin logs
});
