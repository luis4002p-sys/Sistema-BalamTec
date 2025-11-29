import { Router } from "express";
import fs from "fs";
import path from "path";

const router = Router();
const dataDir = path.join(process.cwd(), "data");
const filePersonas = path.join(dataDir, "Personas.txt");

// ==================== FUNCIÓN AUXILIAR: Parsear línea ====================
function parsearPersona(linea, separador = "\t") {
  let cols = linea.split(separador).map(c => c.trim());
  if (cols.length === 1) cols = linea.split("|").map(c => c.trim());

  return {
    idPersona: cols[0] || "",
    Nombre: cols[1] || "",
    ApellidoPaterno: cols[2] || "",
    ApellidoMaterno: cols[3] || "",
    TipoPersona: cols[4] || "",
    Telefono: cols[5] || "",
    Correo: cols[6] || "",
    RFC: cols[7] || "",
    Calle: cols[8] || "",
    Numero: cols[9] || "",
    Colonia: cols[10] || "",
    CodigoPostal: cols[11] || "",
    Ciudad: cols[12] || "",
    Estado: cols[13] || "",
    Puesto: cols[14] || "",
    Salario: cols[15] || "",
    FechaIngreso: cols[16] || "",
    Login: cols[17] || "",
    Password: cols[18] || "",
    EdoCta: cols[19] || "",
    FuenteDeDatos: cols[20] || "",
    Imagen: cols[21] || "" // ⭐ AGREGAR COLUMNA IMAGEN
  };
}

// ==================== FUNCIÓN AUXILIAR: Leer archivo ====================
function leerArchivo() {
  if (!fs.existsSync(filePersonas)) {
    // ⭐ CORREGIR: "Telefono" en lugar de "Teléfono" e incluir "Imagen"
    const encabezado =
      "idPersona\tNombre\tApellidoPaterno\tApellidoMaterno\tTipoPersona\tTelefono\tCorreo\tRFC\tCalle\tNumero\tColonia\tCodigoPostal\tCiudad\tEstado\tPuesto\tSalario\tFechaIngreso\tLogin\tPassword\tEdoCta\tFuenteDeDatos\tImagen\n";
    fs.writeFileSync(filePersonas, encabezado, "utf8");
  }
  const contenido = fs.readFileSync(filePersonas, "utf8");
  return contenido.split("\n").map(l => l.trim()).filter(l => l);
}

// ==================== FUNCIÓN AUXILIAR: Guardar archivo ====================
function guardarArchivo(personas) {
  // ⭐ CORREGIR: "Telefono" en lugar de "Teléfono" e incluir "Imagen"
  const encabezado =
    "idPersona\tNombre\tApellidoPaterno\tApellidoMaterno\tTipoPersona\tTelefono\tCorreo\tRFC\tCalle\tNumero\tColonia\tCodigoPostal\tCiudad\tEstado\tPuesto\tSalario\tFechaIngreso\tLogin\tPassword\tEdoCta\tFuenteDeDatos\tImagen";

  const lineas = [encabezado];

  personas.forEach(p => {
    lineas.push(
      // ⭐ AGREGAR COLUMNA IMAGEN AL FINAL
      `${p.idPersona}\t${p.Nombre}\t${p.ApellidoPaterno}\t${p.ApellidoMaterno}\t${p.TipoPersona}\t${p.Telefono || ""}\t${p.Correo || ""}\t${p.RFC || ""}\t${p.Calle || ""}\t${p.Numero || ""}\t${p.Colonia || ""}\t${p.CodigoPostal || ""}\t${p.Ciudad || ""}\t${p.Estado || ""}\t${p.Puesto || ""}\t${p.Salario || ""}\t${p.FechaIngreso || ""}\t${p.Login || ""}\t${p.Password || ""}\t${p.EdoCta || ""}\t${p.FuenteDeDatos || ""}\t${p.Imagen || ""}`
    );
  });

  fs.writeFileSync(filePersonas, lineas.join("\n"), "utf8");
}

// ==================== GET: Todas las personas ====================
router.get("/", (req, res) => {
  try {
    const lineas = leerArchivo();
    res.type("text/plain").send(lineas.join("\n"));
  } catch (err) {
    res.status(500).json({ mensaje: "Error al leer archivo", error: err.message });
  }
});

// ==================== GET: Persona por ID ====================
router.get("/:id", (req, res) => {
  try {
    const { id } = req.params;
    const lineas = leerArchivo();
    const encabezado = lineas[0];
    const separador = encabezado.includes("\t") ? "\t" : "|";

    const persona = lineas
      .slice(1)
      .map(linea => parsearPersona(linea, separador))
      .find(p => p.idPersona === id);

    if (!persona) return res.status(404).json({ mensaje: "No encontrada" });

    res.json(persona);
  } catch (err) {
    res.status(500).json({ mensaje: "Error al buscar persona", error: err.message });
  }
});

// ==================== POST: Guardar o actualizar persona ====================
router.post("/guardar", (req, res) => {
  try {
    const datosRecibidos = req.body;
    
    console.log("=== DATOS RECIBIDOS ===");
    console.log(JSON.stringify(datosRecibidos, null, 2));

    const lineas = leerArchivo();
    const encabezado = lineas[0];
    const separador = encabezado.includes("\t") ? "\t" : "|";

    const personas = lineas
      .slice(1)
      .map(linea => parsearPersona(linea, separador))
      .filter(p => p.idPersona);

    const idx = personas.findIndex(p => p.idPersona === String(datosRecibidos.idPersona));

    if (idx >= 0) {
      // ⭐ ACTUALIZAR: Preservar todos los campos originales y actualizar solo los recibidos
      const personaExistente = personas[idx];
      
      personas[idx] = {
        ...personaExistente, // Mantener todos los campos originales
        // Actualizar solo los campos que vienen en el request
        Nombre: datosRecibidos.Nombre || personaExistente.Nombre,
        ApellidoPaterno: datosRecibidos.ApellidoPaterno || personaExistente.ApellidoPaterno,
        ApellidoMaterno: datosRecibidos.ApellidoMaterno || personaExistente.ApellidoMaterno,
        Telefono: datosRecibidos.Telefono || personaExistente.Telefono,
        Correo: datosRecibidos.Correo || personaExistente.Correo,
        Calle: datosRecibidos.Calle !== undefined ? datosRecibidos.Calle : personaExistente.Calle,
        Numero: datosRecibidos.Numero !== undefined ? datosRecibidos.Numero : personaExistente.Numero,
        Colonia: datosRecibidos.Colonia !== undefined ? datosRecibidos.Colonia : personaExistente.Colonia,
        CodigoPostal: datosRecibidos.CodigoPostal !== undefined ? datosRecibidos.CodigoPostal : personaExistente.CodigoPostal,
        Ciudad: datosRecibidos.Ciudad !== undefined ? datosRecibidos.Ciudad : personaExistente.Ciudad,
        Estado: datosRecibidos.Estado !== undefined ? datosRecibidos.Estado : personaExistente.Estado,
        // Si se envía una nueva imagen, actualizarla; si no, mantener la original
        Imagen: datosRecibidos.Imagen !== undefined ? datosRecibidos.Imagen : personaExistente.Imagen
      };
      
      console.log("=== ACTUALIZANDO PERSONA ===");
      console.log(JSON.stringify(personas[idx], null, 2));
    } else {
      // ⭐ CREAR NUEVA PERSONA
      const nuevoId =
        personas.length > 0
          ? Math.max(...personas.map(p => Number(p.idPersona) || 0)) + 1
          : 1;

      const nuevaPersona = {
        idPersona: String(nuevoId),
        Nombre: datosRecibidos.Nombre || "",
        ApellidoPaterno: datosRecibidos.ApellidoPaterno || "",
        ApellidoMaterno: datosRecibidos.ApellidoMaterno || "",
        TipoPersona: datosRecibidos.TipoPersona || "",
        Telefono: datosRecibidos.Telefono || "",
        Correo: datosRecibidos.Correo || "",
        RFC: datosRecibidos.RFC || "",
        Calle: datosRecibidos.Calle || "",
        Numero: datosRecibidos.Numero || "",
        Colonia: datosRecibidos.Colonia || "",
        CodigoPostal: datosRecibidos.CodigoPostal || "",
        Ciudad: datosRecibidos.Ciudad || "",
        Estado: datosRecibidos.Estado || "",
        Puesto: datosRecibidos.Puesto || "",
        Salario: datosRecibidos.Salario || "",
        FechaIngreso: datosRecibidos.FechaIngreso || "",
        Login: datosRecibidos.Login || "",
        Password: datosRecibidos.Password || "",
        EdoCta: datosRecibidos.EdoCta || "",
        FuenteDeDatos: datosRecibidos.FuenteDeDatos || "",
        Imagen: datosRecibidos.Imagen || ""
      };

      personas.push(nuevaPersona);
      console.log("=== CREANDO NUEVA PERSONA - ID:", nuevoId, "===");
      console.log(JSON.stringify(nuevaPersona, null, 2));
    }

    guardarArchivo(personas);
    res.json({ mensaje: "Persona guardada correctamente", persona: personas[idx] });
  } catch (err) {
    console.error("=== ERROR AL GUARDAR ===");
    console.error(err);
    res.status(500).json({ mensaje: "Error al guardar persona", error: err.message });
  }
});

// ==================== DELETE: Eliminar persona ====================
router.delete("/:id", (req, res) => {
  try {
    const { id } = req.params;

    const lineas = leerArchivo();
    const encabezado = lineas[0];
    const separador = encabezado.includes("\t") ? "\t" : "|";

    const personas = lineas
      .slice(1)
      .map(linea => parsearPersona(linea, separador))
      .filter(p => p.idPersona);

    const nuevaLista = personas.filter(p => p.idPersona !== id);

    if (nuevaLista.length === personas.length) {
      return res.status(404).json({ mensaje: `Persona con ID ${id} no encontrada` });
    }

    guardarArchivo(nuevaLista);
    res.json({ mensaje: "Persona eliminada correctamente" });
  } catch (err) {
    res.status(500).json({ mensaje: "Error al eliminar persona", error: err.message });
  }
});

export default router;