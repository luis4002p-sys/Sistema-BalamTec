import { Router } from "express";
import fs from "fs";
import path from "path";

const router = Router();
const dataDir = path.join(process.cwd(), "data");
const fileUsuarios = path.join(dataDir, "index.txt");

// ==================== USUARIOS ====================

// Obtener usuarios
router.get("/", (req, res) => {
  try {
    let data = "";
    if (fs.existsSync(fileUsuarios)) {
      data = fs.readFileSync(fileUsuarios, "utf8");
    } else {
      data = "CvUser\tCvPerson\tLogin\tPassword\tFecIni\tFecVen\tEdoCta\n";
      fs.writeFileSync(fileUsuarios, data, "utf8");
    }
    res.type("text/plain").send(data);
  } catch (err) {
    res.status(500).json({ mensaje: "Error al leer index.txt" });
  }
});

// Actualizar estado del usuario
router.post("/actualizarEstado", (req, res) => {
  try {
    const { CvUser, EdoCta } = req.body;
    if (!CvUser) {
      return res.status(400).json({ mensaje: "Falta CvUser en la solicitud" });
    }

    if (!fs.existsSync(fileUsuarios)) {
      return res.status(404).json({ mensaje: "Archivo index.txt no encontrado" });
    }

    let lines = fs.readFileSync(fileUsuarios, "utf8")
      .split("\n")
      .filter(l => l);

    const encabezado = lines[0];
    const usuarios = lines.slice(1);

    const index = usuarios.findIndex(l => l.startsWith(CvUser + "\t"));
    if (index === -1) {
      return res.status(404).json({ mensaje: "Usuario no encontrado" });
    }

    const cols = usuarios[index].split(/\t|,/);
    cols[6] = EdoCta ? "TRUE" : "FALSE";
    usuarios[index] = cols.join("\t");

    fs.writeFileSync(fileUsuarios, [encabezado, ...usuarios].join("\n"), "utf8");

    res.json({ mensaje: `Estado actualizado para usuario ${CvUser}` });
  } catch (err) {
    res.status(500).json({ mensaje: "Error al actualizar usuario" });
  }
});

// ==================== ACTUALIZAR USUARIO COMPLETO ====================
router.post("/actualizar", (req, res) => {
  try {
    const { CvUser, CvPerson, Login, Password, FecIni, FecVen, EdoCta } = req.body;
    
    console.log("=== ACTUALIZANDO USUARIO ===");
    console.log(JSON.stringify(req.body, null, 2));
    
    if (!CvUser) {
      return res.status(400).json({ mensaje: "Falta CvUser en la solicitud" });
    }

    if (!fs.existsSync(fileUsuarios)) {
      return res.status(404).json({ mensaje: "Archivo index.txt no encontrado" });
    }

    let lines = fs.readFileSync(fileUsuarios, "utf8")
      .split("\n")
      .map(l => l.trim())
      .filter(l => l);

    const encabezado = lines[0];
    const usuarios = lines.slice(1);

    const index = usuarios.findIndex(l => {
      const cols = l.split("\t");
      return cols[0] === CvUser;
    });

    if (index === -1) {
      return res.status(404).json({ mensaje: "Usuario no encontrado" });
    }

    // ⭐ ACTUALIZAR: Construir la línea del usuario correctamente
    const nuevoUsuario = `${CvUser}\t${CvPerson}\t${Login}\t${Password}\t${FecIni}\t${FecVen}\t${EdoCta}`;
    usuarios[index] = nuevoUsuario;

    console.log("=== USUARIO ACTUALIZADO ===");
    console.log(nuevoUsuario);

    // Guardar archivo con salto de línea al final
    const contenidoFinal = [encabezado, ...usuarios].join("\n") + "\n";
    fs.writeFileSync(fileUsuarios, contenidoFinal, "utf8");

    res.json({ 
      mensaje: "Usuario actualizado correctamente",
      usuario: {
        CvUser,
        CvPerson,
        Login,
        FecIni,
        FecVen,
        EdoCta
      }
    });
  } catch (err) {
    console.error("=== ERROR AL ACTUALIZAR USUARIO ===");
    console.error(err);
    res.status(500).json({ mensaje: "Error al actualizar usuario", error: err.message });
  }
});

export default router;