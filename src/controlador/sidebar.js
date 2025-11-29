"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var SidebarComponent = /** @class */ (function () {
    function SidebarComponent() {
        this.sidebar = document.getElementById("sidebarComponent");
        this.init();
    }
    SidebarComponent.prototype.init = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.cargarDatosUsuario()];
                    case 1:
                        _a.sent();
                        this.configurarEventos();
                        this.marcarPaginaActiva();
                        return [2 /*return*/];
                }
            });
        });
    };
    SidebarComponent.prototype.cargarDatosUsuario = function () {
        return __awaiter(this, void 0, void 0, function () {
            var ssImagen, email, imagen, persona, nombre, area, rol;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        ssImagen = sessionStorage.getItem("imagenPerfil") || "";
                        email = sessionStorage.getItem("loginUser") || "";
                        imagen = ssImagen;
                        if (!(!imagen && email)) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.buscarPersonaEnTxt(email)];
                    case 1:
                        persona = _a.sent();
                        if (persona && persona.Imagen) {
                            imagen = persona.Imagen;
                            sessionStorage.setItem("imagenPerfil", imagen);
                        }
                        _a.label = 2;
                    case 2:
                        nombre = sessionStorage.getItem("usuarioLogueado") || "Usuario";
                        area = sessionStorage.getItem("puesto") || "No asignada";
                        rol = sessionStorage.getItem("tipoPersona") || "Empleado";
                        this.actualizarPerfil(nombre, email, area, rol, imagen);
                        return [2 /*return*/];
                }
            });
        });
    };
    SidebarComponent.prototype.buscarPersonaEnTxt = function (correo) {
        return __awaiter(this, void 0, void 0, function () {
            var response, contenido, lineas, _i, lineas_1, linea, partes, err_1;
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 3, , 4]);
                        console.log("Leyendo TXT desde:", "../datos/Personas.txt");
                        return [4 /*yield*/, fetch("../datos/Personas.txt")];
                    case 1:
                        response = _b.sent();
                        return [4 /*yield*/, response.text()];
                    case 2:
                        contenido = _b.sent();
                        console.log("Contenido TXT cargado (primeros 200 chars):", contenido.substring(0, 200));
                        lineas = contenido.split("\n");
                        for (_i = 0, lineas_1 = lineas; _i < lineas_1.length; _i++) {
                            linea = lineas_1[_i];
                            console.log("Línea procesada:", linea);
                            partes = linea.split("|");
                            if (((_a = partes[2]) === null || _a === void 0 ? void 0 : _a.trim()) === correo.trim()) {
                                console.log("Coincidencia encontrada en TXT:", partes);
                                return [2 /*return*/, {
                                        Nombre: partes[0],
                                        Puesto: partes[1],
                                        Correo: partes[2],
                                        Rol: partes[3],
                                        Imagen: partes[4] || ""
                                    }];
                            }
                        }
                        console.warn("No se encontró la persona en el TXT:", correo);
                        return [3 /*break*/, 4];
                    case 3:
                        err_1 = _b.sent();
                        console.error("Error leyendo Personas.txt:", err_1);
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/, null];
                }
            });
        });
    };
    SidebarComponent.prototype.actualizarPerfil = function (nombre, email, area, rol, imagen) {
        if (imagen === void 0) { imagen = ""; }
        var e1 = document.getElementById("userName");
        if (e1)
            e1.textContent = nombre;
        var e2 = document.getElementById("userEmail");
        if (e2)
            e2.textContent = email;
        var e3 = document.getElementById("userArea");
        if (e3)
            e3.textContent = area;
        var e4 = document.getElementById("userRole");
        if (e4)
            e4.textContent = rol;
        this.actualizarImagenPerfil(nombre, imagen);
    };
    SidebarComponent.prototype.actualizarImagenPerfil = function (nombre, imagen) {
        var initials = document.getElementById("userInitials");
        var avatar = document.getElementById("userAvatar");
        if (!avatar)
            return;
        if (imagen && imagen.trim() !== "") {
            avatar.style.backgroundImage = "url('".concat(imagen, "')");
            avatar.style.backgroundSize = "cover";
            avatar.style.backgroundPosition = "center";
            avatar.style.backgroundRepeat = "no-repeat";
            if (initials)
                initials.style.display = "none";
        }
        else {
            avatar.style.backgroundImage = "";
            if (initials) {
                initials.style.display = "flex";
                initials.textContent = this.obtenerIniciales(nombre);
            }
        }
    };
    SidebarComponent.prototype.obtenerIniciales = function (nombre) {
        var p = nombre.trim().split(" ").filter(function (x) { return x.length > 0; });
        if (p.length === 0)
            return "U";
        if (p.length === 1)
            return p[0].substring(0, 2).toUpperCase();
        return (p[0][0] + p[p.length - 1][0]).toUpperCase();
    };
    SidebarComponent.prototype.configurarEventos = function () {
        var _this = this;
        var btnCerrarSesion = document.getElementById("btnCerrarSesion");
        if (btnCerrarSesion) {
            btnCerrarSesion.addEventListener("click", function (e) {
                e.preventDefault();
                _this.cerrarSesion();
            });
        }
        var menu = document.querySelectorAll(".menu-item");
        menu.forEach(function (item) {
            item.addEventListener("click", function () {
                _this.activarMenuItem(item);
            });
        });
    };
    SidebarComponent.prototype.activarMenuItem = function (item) {
        var items = document.querySelectorAll(".menu-item");
        items.forEach(function (i) { return i.classList.remove("active"); });
        item.classList.add("active");
        var pagina = item.getAttribute("data-page");
        if (pagina)
            sessionStorage.setItem("paginaActiva", pagina);
    };
    SidebarComponent.prototype.marcarPaginaActiva = function () {
        var _a;
        var paginaActual = ((_a = window.location.pathname.split("/").pop()) === null || _a === void 0 ? void 0 : _a.replace(".html", "").toLowerCase()) || "";
        var paginaGuardada = sessionStorage.getItem("paginaActiva");
        var items = document.querySelectorAll(".menu-item");
        items.forEach(function (item) {
            var data = item.getAttribute("data-page");
            if (data === paginaActual || data === paginaGuardada) {
                item.classList.add("active");
            }
            else {
                item.classList.remove("active");
            }
        });
        if (["menu", "", "index"].includes(paginaActual)) {
            var inicio = document.querySelector('.menu-item[data-page="inicio"]');
            if (inicio)
                inicio.classList.add("active");
        }
    };
    SidebarComponent.prototype.cerrarSesion = function () {
        if (confirm("¿Estás seguro de que deseas cerrar sesión?")) {
            sessionStorage.clear();
            window.location.href = "index.html";
        }
    };
    SidebarComponent.prototype.actualizarDatos = function (nombre, email, area, rol, imagen) {
        if (imagen === void 0) { imagen = ""; }
        this.actualizarPerfil(nombre, email, area, rol, imagen);
        sessionStorage.setItem("usuarioLogueado", nombre);
        sessionStorage.setItem("loginUser", email);
        sessionStorage.setItem("puesto", area);
        sessionStorage.setItem("tipoPersona", rol);
        if (imagen)
            sessionStorage.setItem("imagenPerfil", imagen);
        else
            sessionStorage.removeItem("imagenPerfil");
    };
    SidebarComponent.prototype.toggle = function () {
        if (this.sidebar)
            this.sidebar.classList.toggle("active");
    };
    SidebarComponent.prototype.obtenerDatosUsuario = function () {
        return {
            nombre: sessionStorage.getItem("usuarioLogueado") || "Usuario",
            email: sessionStorage.getItem("loginUser") || "email@ejemplo.com",
            area: sessionStorage.getItem("puesto") || "No asignada",
            rol: sessionStorage.getItem("tipoPersona") || "Empleado",
            imagen: sessionStorage.getItem("imagenPerfil") || ""
        };
    };
    SidebarComponent.prototype.verificarSesion = function () {
        return !!sessionStorage.getItem("usuarioLogueado");
    };
    return SidebarComponent;
}());
var sidebarInstance = null;
document.addEventListener("DOMContentLoaded", function () {
    sidebarInstance = new SidebarComponent();
});
if (typeof window !== "undefined") {
    window.SidebarComponent = SidebarComponent;
    window.getSidebarInstance = function () { return sidebarInstance; };
}
