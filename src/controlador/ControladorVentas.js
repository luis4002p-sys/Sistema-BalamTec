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
exports.ControladorVentas = void 0;
// ==================== IMPORTS ====================
var ModeloVentas_js_1 = require("./ModeloVentas.js");
// ==================== CLASE CONTROLADOR DE VENTAS ====================
var ControladorVentas = /** @class */ (function () {
    function ControladorVentas(modelo) {
        this.itemSeleccionado = null;
        this.consultaVisible = false;
        this.modelo = modelo;
        this.elementos = this.obtenerElementosDOM();
        this.configurarBotones();
    }
    // ==================== OBTENER ELEMENTOS DEL DOM ====================
    ControladorVentas.prototype.obtenerElementosDOM = function () {
        return {
            inputs: {
                cliente: document.getElementById("cliente"),
                producto: document.getElementById("producto"),
                cantidad: document.getElementById("cantidad"),
                total: document.getElementById("total"),
            },
            tablas: {
                ventas: document.getElementById("tablaVentas"),
                consultas: document.getElementById("tablaConsultas"),
            },
            secciones: {
                ventas: document.getElementById("seccionVentas"),
                consultas: document.getElementById("seccionConsultas"),
            },
            botones: {
                nueva: document.getElementById("btnNuevaVenta"),
                modificar: document.getElementById("btnModificarVenta"),
                eliminar: document.getElementById("btnEliminarVenta"),
                guardar: document.getElementById("btnGuardarVenta"),
                cancelar: document.getElementById("btnCancelarVenta"),
                consultar: document.getElementById("btnConsultarVentas"),
            }
        };
    };
    // ==================== CONFIGURAR BOTONES ====================
    ControladorVentas.prototype.configurarBotones = function () {
        var _this = this;
        var botones = this.elementos.botones;
        // Configurar textos de botones
        botones.nueva.textContent = "Nueva Venta";
        botones.guardar.textContent = "Agregar al Carrito";
        botones.modificar.textContent = "Finalizar Venta";
        botones.eliminar.textContent = "Quitar del Carrito";
        botones.consultar.textContent = "Consultar Ventas";
        // Asignar eventos
        botones.nueva.addEventListener("click", function () { return _this.iniciarNuevaVenta(); });
        botones.guardar.addEventListener("click", function () { return _this.agregarAlCarrito(); });
        botones.modificar.addEventListener("click", function () { return _this.finalizarVenta(); });
        botones.eliminar.addEventListener("click", function () { return _this.quitarDelCarrito(); });
        botones.cancelar.addEventListener("click", function () { return _this.cancelarVenta(); });
        botones.consultar.addEventListener("click", function () { return _this.toggleConsultaVentas(); });
    };
    // ==================== INICIALIZAR ====================
    ControladorVentas.prototype.inicializar = function () {
        return __awaiter(this, void 0, void 0, function () {
            var err_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 3, , 4]);
                        console.log("🚀 Inicializando controlador de ventas...");
                        return [4 /*yield*/, this.modelo.cargarProductos()];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, this.modelo.cargarClientes()];
                    case 2:
                        _a.sent();
                        this.llenarSelectClientes();
                        this.llenarSelectProductos();
                        this.mostrarCarrito();
                        console.log("✅ Controlador inicializado correctamente");
                        return [3 /*break*/, 4];
                    case 3:
                        err_1 = _a.sent();
                        console.error("❌ Error al inicializar el controlador:", err_1);
                        alert("Error al cargar los datos iniciales. Por favor recarga la página.");
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    // ==================== LLENAR SELECTS ====================
    ControladorVentas.prototype.llenarSelectClientes = function () {
        var cliente = this.elementos.inputs.cliente;
        cliente.innerHTML = "<option value=\"\">-- Seleccione un cliente --</option>";
        this.modelo.getClientes().forEach(function (c) {
            var option = document.createElement("option");
            option.value = c.id.toString();
            option.textContent = c.nombre;
            cliente.appendChild(option);
        });
        console.log("\u2705 ".concat(this.modelo.getClientes().length, " clientes cargados en el select"));
    };
    ControladorVentas.prototype.llenarSelectProductos = function () {
        var producto = this.elementos.inputs.producto;
        producto.innerHTML = "<option value=\"\">-- Seleccione un producto --</option>";
        this.modelo.getProductos().forEach(function (p) {
            var option = document.createElement("option");
            option.value = p.id.toString();
            option.textContent = "".concat(p.nombre, " - $").concat(p.precioVenta.toFixed(2), " (Stock: ").concat(p.stock, ") - ").concat(p.marca);
            producto.appendChild(option);
        });
        console.log("\u2705 ".concat(this.modelo.getProductos().length, " productos cargados en el select"));
    };
    // ==================== MOSTRAR CARRITO ====================
    ControladorVentas.prototype.mostrarCarrito = function () {
        var _this = this;
        var ventas = this.elementos.tablas.ventas;
        var total = this.elementos.inputs.total;
        var carrito = this.modelo.getCarritoActual();
        if (carrito.length === 0) {
            ventas.innerHTML = "<tr><td colspan=\"7\" style=\"text-align:center; color:gray; padding: 30px;\">\n        <i class=\"fas fa-shopping-cart\" style=\"font-size: 3em; opacity: 0.3;\"></i>\n        <br><br>El carrito est\u00E1 vac\u00EDo. Agrega productos para comenzar.\n      </td></tr>";
            total.value = "";
            return;
        }
        var totalGeneral = this.modelo.getTotalCarrito();
        var utilidadTotal = this.modelo.getUtilidadTotal();
        ventas.innerHTML = carrito.map(function (item, index) {
            var _a, _b;
            var producto = _this.modelo.buscarProductoPorId(item.productoId);
            var utilidadItem = _this.modelo.calcularUtilidadItem(item);
            return "<tr onclick=\"window.controladorVentas.seleccionarItemCarrito(".concat(index, ")\" style=\"cursor: pointer; transition: background 0.2s;\">\n        <td>").concat(index + 1, "</td>\n        <td>\n          <strong>").concat((_a = producto === null || producto === void 0 ? void 0 : producto.nombre) !== null && _a !== void 0 ? _a : "Desconocido", "</strong>\n          <br><small style=\"color:#666;\">").concat((_b = producto === null || producto === void 0 ? void 0 : producto.marca) !== null && _b !== void 0 ? _b : '', "</small>\n        </td>\n        <td>").concat(item.cantidad, "</td>\n        <td>$").concat(item.precioUnitario.toFixed(2), "</td>\n        <td><strong>$").concat(item.subtotal.toFixed(2), "</strong></td>\n        <td style=\"color: ").concat(utilidadItem >= 0 ? '#2e7d32' : '#c62828', "; font-weight: 600;\">\n          $").concat(utilidadItem.toFixed(2), "\n        </td>\n        <td><span style=\"background:#ffd54f;padding:4px 10px;border-radius:4px;font-size:0.85em;font-weight:500;\">En carrito</span></td>\n      </tr>");
        }).join("") + "<tr style=\"background-color: #e8f5e9; font-weight: bold; font-size: 1.05em;\">\n      <td colspan=\"4\" style=\"text-align: right; padding-right: 20px;\">TOTALES:</td>\n      <td style=\"color: #1976d2;\">$".concat(totalGeneral.toFixed(2), "</td>\n      <td style=\"color: #2e7d32;\">$").concat(utilidadTotal.toFixed(2), "</td>\n      <td></td>\n    </tr>");
        total.value = totalGeneral.toFixed(2);
    };
    // ==================== SELECCIONAR ITEM DEL CARRITO (PUBLIC) ====================
    ControladorVentas.prototype.seleccionarItemCarrito = function (index) {
        this.itemSeleccionado = index;
        var carrito = this.modelo.getCarritoActual();
        var item = carrito[index];
        var producto = this.modelo.buscarProductoPorId(item.productoId);
        if (producto)
            this.elementos.inputs.producto.value = producto.id.toString();
        this.elementos.inputs.cantidad.value = item.cantidad.toString();
        this.actualizarBotones({ eliminar: false });
        console.log("\uD83D\uDCCC Item seleccionado: ".concat(producto === null || producto === void 0 ? void 0 : producto.nombre, " (cantidad: ").concat(item.cantidad, ")"));
    };
    // ==================== EVENTOS DE BOTONES ====================
    ControladorVentas.prototype.iniciarNuevaVenta = function () {
        var clienteId = +this.elementos.inputs.cliente.value;
        if (!clienteId) {
            alert("⚠️ Primero selecciona un cliente para iniciar la venta.");
            return;
        }
        var cliente = this.modelo.buscarClientePorId(clienteId);
        console.log("\uD83C\uDD95 Iniciando nueva venta para: ".concat(cliente === null || cliente === void 0 ? void 0 : cliente.nombre));
        this.modelo.iniciarNuevaVenta(clienteId);
        this.limpiarCampos();
        this.activarCampos(true);
        this.elementos.inputs.cliente.disabled = true;
        this.mostrarCarrito();
        this.actualizarBotones({
            nueva: true,
            guardar: false,
            modificar: true,
            eliminar: true,
            cancelar: false
        });
    };
    ControladorVentas.prototype.agregarAlCarrito = function () {
        var idProd = +this.elementos.inputs.producto.value;
        var cantidad = +this.elementos.inputs.cantidad.value;
        if (!idProd || !cantidad) {
            alert("⚠️ Selecciona un producto y cantidad.");
            return;
        }
        var producto = this.modelo.buscarProductoPorId(idProd);
        console.log("\u2795 Intentando agregar: ".concat(cantidad, "x ").concat(producto === null || producto === void 0 ? void 0 : producto.nombre));
        var resultado = this.modelo.agregarAlCarrito(idProd, cantidad);
        if (!resultado.exito) {
            alert("❌ " + resultado.mensaje);
            return;
        }
        console.log("\u2705 ".concat(resultado.mensaje));
        this.limpiarCampos();
        this.mostrarCarrito();
        this.actualizarBotones({ modificar: false });
    };
    ControladorVentas.prototype.finalizarVenta = function () {
        return __awaiter(this, void 0, void 0, function () {
            var resultado;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (this.modelo.getCarritoActual().length === 0) {
                            alert("⚠️ El carrito está vacío.");
                            return [2 /*return*/];
                        }
                        if (!confirm("💰 ¿Deseas finalizar esta venta?"))
                            return [2 /*return*/];
                        console.log("💾 Procesando venta...");
                        return [4 /*yield*/, this.modelo.finalizarVenta()];
                    case 1:
                        resultado = _a.sent();
                        if (!resultado.exito) {
                            alert("❌ " + resultado.mensaje);
                            return [2 /*return*/];
                        }
                        this.limpiarCampos();
                        this.elementos.inputs.cliente.value = "";
                        this.elementos.inputs.cliente.disabled = false;
                        this.elementos.inputs.total.value = "";
                        this.activarCampos(false);
                        this.itemSeleccionado = null;
                        this.mostrarCarrito();
                        this.actualizarBotones({
                            nueva: false,
                            guardar: true,
                            modificar: true,
                            eliminar: true,
                            cancelar: true
                        });
                        alert("✅ " + resultado.mensaje);
                        console.log("✅ Venta finalizada exitosamente:", resultado.venta);
                        return [2 /*return*/];
                }
            });
        });
    };
    ControladorVentas.prototype.quitarDelCarrito = function () {
        if (this.itemSeleccionado === null) {
            alert("⚠️ Selecciona un producto del carrito para eliminar.");
            return;
        }
        if (!confirm("🗑️ ¿Quitar este producto del carrito?"))
            return;
        var resultado = this.modelo.quitarDelCarrito(this.itemSeleccionado);
        if (resultado.exito) {
            console.log("\u2705 ".concat(resultado.mensaje));
            this.itemSeleccionado = null;
            this.limpiarCampos();
            this.mostrarCarrito();
            this.actualizarBotones({
                eliminar: true,
                modificar: this.modelo.getCarritoActual().length === 0
            });
        }
    };
    ControladorVentas.prototype.cancelarVenta = function () {
        if (this.modelo.getCarritoActual().length > 0 &&
            !confirm("⚠️ ¿Cancelar la venta? Se perderán los productos del carrito.")) {
            return;
        }
        console.log("❌ Venta cancelada");
        this.modelo.limpiarCarrito();
        this.limpiarCampos();
        this.elementos.inputs.cliente.value = "";
        this.elementos.inputs.cliente.disabled = false;
        this.elementos.inputs.total.value = "";
        this.activarCampos(false);
        this.itemSeleccionado = null;
        this.mostrarCarrito();
        this.actualizarBotones({
            nueva: false,
            guardar: true,
            modificar: true,
            eliminar: true,
            cancelar: true
        });
    };
    ControladorVentas.prototype.toggleConsultaVentas = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!!this.consultaVisible) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.mostrarHistorialVentas()];
                    case 1:
                        _a.sent();
                        return [3 /*break*/, 3];
                    case 2:
                        this.volverAVentas();
                        _a.label = 3;
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    // ==================== MOSTRAR HISTORIAL ====================
    ControladorVentas.prototype.mostrarHistorialVentas = function () {
        return __awaiter(this, void 0, void 0, function () {
            var ventas, err_2;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        console.log("📋 Consultando ventas del servidor...");
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, this.modelo.cargarVentas()];
                    case 2:
                        ventas = _a.sent();
                        if (ventas.length === 0) {
                            this.elementos.tablas.consultas.innerHTML = "<tr><td colspan=\"8\" style=\"text-align:center; color:gray; padding: 30px;\">\n          <i class=\"fas fa-inbox\" style=\"font-size: 3em; opacity: 0.3;\"></i>\n          <br><br>No hay ventas registradas en el servidor.\n        </td></tr>";
                        }
                        else {
                            this.elementos.tablas.consultas.innerHTML = ventas.flatMap(function (venta) {
                                return venta.items.map(function (item, idx) {
                                    var _a;
                                    var producto = _this.modelo.buscarProductoPorId(item.productoId);
                                    var nombreProducto = (_a = producto === null || producto === void 0 ? void 0 : producto.nombre) !== null && _a !== void 0 ? _a : "Producto #".concat(item.productoId);
                                    return "<tr style=\"border-bottom: 1px solid #e0e0e0;\">\n              ".concat(idx === 0 ? "<td rowspan=\"".concat(venta.items.length, "\" style=\"font-weight: 600; background: #f5f5f5;\">").concat(venta.id, "</td>") : '', "\n              ").concat(idx === 0 ? "<td rowspan=\"".concat(venta.items.length, "\" style=\"background: #f5f5f5;\">").concat(venta.nombreCliente, "</td>") : '', "\n              <td>").concat(nombreProducto, "</td>\n              <td>").concat(item.cantidad, "</td>\n              <td>$").concat(item.precioUnitario.toFixed(2), "</td>\n              <td><strong>$").concat(item.subtotal.toFixed(2), "</strong></td>\n              ").concat(idx === 0 ? "<td rowspan=\"".concat(venta.items.length, "\" style=\"background: #f5f5f5;\">").concat(venta.fecha, "</td>") : '', "\n              ").concat(idx === 0 ? "<td rowspan=\"".concat(venta.items.length, "\" style=\"font-weight:bold;color:#2e7d32; font-size: 1.1em; background: #e8f5e9;\">$").concat(venta.total.toFixed(2), "</td>") : '', "\n            </tr>");
                                }).join("");
                            }).join("");
                        }
                        this.elementos.secciones.ventas.style.display = "none";
                        this.elementos.secciones.consultas.style.display = "block";
                        this.elementos.botones.consultar.textContent = "⬅️ Volver a Ventas";
                        this.consultaVisible = true;
                        console.log("\u2705 ".concat(ventas.length, " ventas mostradas en la tabla de consultas"));
                        return [3 /*break*/, 4];
                    case 3:
                        err_2 = _a.sent();
                        console.error("❌ Error al cargar ventas:", err_2);
                        alert("❌ Error al cargar ventas del servidor");
                        this.elementos.tablas.consultas.innerHTML = "<tr><td colspan=\"8\" style=\"text-align:center; color:red; padding: 30px;\">\n        <i class=\"fas fa-exclamation-triangle\" style=\"font-size: 3em;\"></i>\n        <br><br>Error al cargar ventas del servidor.\n      </td></tr>";
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    ControladorVentas.prototype.volverAVentas = function () {
        this.elementos.secciones.consultas.style.display = "none";
        this.elementos.secciones.ventas.style.display = "block";
        this.elementos.botones.consultar.textContent = "📋 Consultar Ventas";
        this.consultaVisible = false;
        console.log("👁️ Volviendo a la vista de ventas");
    };
    // ==================== UTILIDADES ====================
    ControladorVentas.prototype.limpiarCampos = function () {
        this.elementos.inputs.producto.value = "";
        this.elementos.inputs.cantidad.value = "";
    };
    ControladorVentas.prototype.activarCampos = function (estado) {
        this.elementos.inputs.producto.disabled = !estado;
        this.elementos.inputs.cantidad.disabled = !estado;
    };
    ControladorVentas.prototype.actualizarBotones = function (estados) {
        var _this = this;
        Object.entries(estados).forEach(function (_a) {
            var key = _a[0], valor = _a[1];
            _this.elementos.botones[key].disabled = valor;
        });
    };
    return ControladorVentas;
}());
exports.ControladorVentas = ControladorVentas;
// ==================== INICIALIZACIÓN ====================
document.addEventListener("DOMContentLoaded", function () { return __awaiter(void 0, void 0, void 0, function () {
    var usuarioLogueado, spanUsuario, modelo, controlador, error_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                usuarioLogueado = sessionStorage.getItem('usuarioLogueado');
                if (!usuarioLogueado) {
                    alert('⚠️ Debes iniciar sesión primero');
                    window.location.href = 'index.html';
                    return [2 /*return*/];
                }
                spanUsuario = document.getElementById('nombreUsuario');
                if (spanUsuario && usuarioLogueado) {
                    spanUsuario.textContent = usuarioLogueado;
                }
                console.log("🎬 Inicializando módulo de ventas...");
                _a.label = 1;
            case 1:
                _a.trys.push([1, 3, , 4]);
                modelo = new ModeloVentas_js_1.ModeloVentas("http://localhost:3000");
                controlador = new ControladorVentas(modelo);
                // Exponer controlador globalmente para acceso desde HTML (onclick)
                window.controladorVentas = controlador;
                // Inicializar
                return [4 /*yield*/, controlador.inicializar()];
            case 2:
                // Inicializar
                _a.sent();
                console.log("🎉 Sistema de ventas listo para usar");
                return [3 /*break*/, 4];
            case 3:
                error_1 = _a.sent();
                console.error("❌ Error fatal al inicializar:", error_1);
                alert("❌ Error al inicializar el sistema. Por favor recarga la página.");
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); });
