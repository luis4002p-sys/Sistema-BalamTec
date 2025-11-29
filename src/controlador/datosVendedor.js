document.addEventListener("DOMContentLoaded", function () {
    var nombreSpan = document.getElementById("nombreUsuario");
    if (!nombreSpan)
        return;
    var usuarioLogueado = sessionStorage.getItem("usuarioLogueado") || "";
    cargarDatosVendedor(usuarioLogueado, nombreSpan);
});
function cargarDatosVendedor(nombreCompleto, nombreSpan) {
    var API_URL = "http://localhost:3000";
    fetch("".concat(API_URL, "/personas"))
        .then(function (res) {
        if (!res.ok)
            throw new Error("Error al cargar personas");
        return res.text();
    })
        .then(function (text) {
        var lineas = text.split("\n").map(function (l) { return l.trim(); }).filter(function (l) { return l; });
        if (lineas.length === 0) {
            console.error("Archivo de personas vacío");
            return;
        }
        lineas.shift(); // quitar encabezado
        var personaEncontrada = null;
        for (var _i = 0, lineas_1 = lineas; _i < lineas_1.length; _i++) {
            var linea = lineas_1[_i];
            var cols = linea.split(/\t/).map(function (c) { return c.trim().replace(/^"|"$/g, ''); });
            var nombreCompletoArchivo = "".concat(cols[1], " ").concat(cols[2], " ").concat(cols[3]).trim();
            if (nombreCompletoArchivo === nombreCompleto) {
                personaEncontrada = {
                    idPersona: cols[0] || '',
                    Nombre: cols[1] || '',
                    ApellidoPaterno: cols[2] || '',
                    ApellidoMaterno: cols[3] || '',
                    NombreCompleto: nombreCompletoArchivo,
                    TipoPersona: cols[4] || '',
                    Telefono: cols[5] || '',
                    Direccion: cols[6] || '',
                    Correo: cols[7] || '',
                    Puesto: cols[8] || '',
                    Salario: cols[9] || '',
                    FechaIngreso: cols[10] || '',
                    Login: cols[11] || '',
                    Password: cols[12] || '',
                    EdoCta: cols[13] || '',
                    FuenteDeDatos: cols[14] || ''
                };
                break;
            }
        }
        if (!personaEncontrada) {
            mostrarTooltip(obtenerInfoPorDefecto(nombreCompleto), nombreSpan);
            return;
        }
        var infoVendedor = {
            nombre: personaEncontrada.NombreCompleto,
            puesto: personaEncontrada.Puesto || "Sin puesto asignado",
            area: personaEncontrada.TipoPersona === "Empleado"
                ? "Tecnologías de la Información y Comunicación"
                : personaEncontrada.TipoPersona,
            descripcion: obtenerDescripcionPorPuesto(personaEncontrada.Puesto),
            imagen: obtenerImagenPorNombre(personaEncontrada.Nombre),
            correo: personaEncontrada.Correo || "sin-correo@empresa.com",
            telefono: personaEncontrada.Telefono || "Sin teléfono",
            direccion: personaEncontrada.Direccion || "Sin dirección",
            fechaIngreso: formatearFecha(personaEncontrada.FechaIngreso)
        };
        mostrarTooltip(infoVendedor, nombreSpan);
    })
        .catch(function () {
        mostrarTooltip(obtenerInfoPorDefecto(nombreCompleto), nombreSpan);
    });
}
function mostrarTooltip(infoVendedor, nombreSpan) {
    var tooltip = document.createElement("div");
    tooltip.className = "vendedora-tooltip oculto";
    tooltip.innerHTML = "\n    <div class=\"ficha-vendedor\">\n      <div class=\"ficha-header\">\n        <img src=\"".concat(infoVendedor.imagen, "\" alt=\"").concat(infoVendedor.nombre, "\" class=\"ficha-img\">\n        <div class=\"ficha-nombre\">\n          <h3>").concat(infoVendedor.nombre, "</h3>\n          <p>").concat(infoVendedor.puesto, "</p>\n        </div>\n      </div>\n      <div class=\"ficha-body\">\n        <p><strong>\u00C1rea:</strong> ").concat(infoVendedor.area, "</p>\n        <p><strong>Correo:</strong> \n          <a href=\"mailto:").concat(infoVendedor.correo, "\">\n            ").concat(infoVendedor.correo, "\n          </a>\n        </p>\n        <p><strong>Tel\u00E9fono:</strong> ").concat(infoVendedor.telefono, "</p>\n        <p><strong>Direcci\u00F3n:</strong> ").concat(infoVendedor.direccion, "</p>\n        <p><strong>Fecha de Ingreso:</strong> ").concat(infoVendedor.fechaIngreso, "</p>\n        <p class=\"descripcion\">").concat(infoVendedor.descripcion, "</p>\n      </div>\n    </div>\n  ");
    document.body.appendChild(tooltip);
    nombreSpan.addEventListener("mouseenter", function (event) {
        var target = event.target;
        var rect = target.getBoundingClientRect();
        tooltip.style.top = "".concat(rect.bottom + 10, "px");
        tooltip.style.left = "".concat(rect.left, "px");
        tooltip.classList.remove("oculto");
        tooltip.classList.add("visible");
    });
    nombreSpan.addEventListener("mouseleave", function () {
        tooltip.classList.remove("visible");
        tooltip.classList.add("oculto");
    });
}
// ==================== FUNCIONES AUXILIARES ====================
function obtenerDescripcionPorPuesto(puesto) {
    var descripciones = {
        "Administradora": "Encargada de la gestión de ventas, atención al cliente y supervisión de inventario.",
        "Desarrolladora": "Responsable del desarrollo y mantenimiento de aplicaciones y sistemas.",
        "Desarrollador": "Responsable del desarrollo y mantenimiento de aplicaciones y sistemas.",
        "Contadora": "Encargada de la gestión contable, fiscal y financiera de la empresa.",
        "Soporte Técnico": "Brinda asistencia técnica a usuarios y mantiene la infraestructura tecnológica.",
        "Recursos Humanos": "Gestiona el personal, reclutamiento y bienestar de los empleados."
    };
    return descripciones[puesto] || "Colaborador de la empresa con funciones asignadas.";
}
function obtenerImagenPorNombre(nombre) {
    var imagenes = {
        "Rosalía": "../Img/Mandy_abojada.webp",
        "Rosario": "../Img/usuario_mujer.png",
        "Guadalupe": "../Img/usuario_mujer.png",
        "Ana": "../Img/usuario_mujer.png",
        "María": "../Img/usuario_mujer.png",
        "Laura": "../Img/usuario_mujer.png",
        "Carlos": "../Img/usuario_hombre.png",
        "José": "../Img/usuario_hombre.png"
    };
    return imagenes[nombre] || "../Img/usuario_default.png";
}
function formatearFecha(fecha) {
    if (!fecha || fecha === "-")
        return "No disponible";
    try {
        var _a = fecha.split("-"), year = _a[0], month = _a[1], day = _a[2];
        var meses = [
            "enero", "febrero", "marzo", "abril", "mayo", "junio",
            "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre"
        ];
        return "".concat(parseInt(day), " de ").concat(meses[parseInt(month) - 1], " de ").concat(year);
    }
    catch (_b) {
        return fecha;
    }
}
function obtenerInfoPorDefecto(nombre) {
    return {
        nombre: nombre,
        puesto: "Empleado",
        area: "General",
        descripcion: "Colaborador de la empresa.",
        imagen: "../Img/usuario_default.png",
        correo: "sin-correo@empresa.com",
        telefono: "Sin teléfono",
        direccion: "Sin dirección",
        fechaIngreso: "No disponible"
    };
}
