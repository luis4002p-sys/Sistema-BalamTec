// ==================== VARIABLES GLOBALES ====================
var API_URL = "http://localhost:3000";
var productos = [];
var clientes = [];
var carritoActual = [];
var clienteSeleccionado = null;
var requiereEnvio = false;
// ==================== VERIFICAR SESIÓN ====================
var usuarioLogueado = sessionStorage.getItem('usuarioLogueado');
if (!usuarioLogueado) {
    alert('Debes iniciar sesión primero');
    window.location.href = 'index.html';
}
// ==================== AL CARGAR EL DOM ====================
document.addEventListener("DOMContentLoaded", function () {
    var elementos = {
        selectCliente: document.getElementById("selectCliente"),
        selectProducto: document.getElementById("selectProducto"),
        inputCantidad: document.getElementById("inputCantidad"),
        selectMetodo: document.getElementById("selectMetodo"),
        cartBody: document.getElementById("cartBody"),
        subtotal: document.getElementById("subtotal"),
        iva: document.getElementById("iva"),
        total: document.getElementById("total"),
        totalArticulos: document.getElementById("totalArticulos"),
        clienteSeleccionado: document.getElementById("clienteSeleccionado"),
        estadoEnvio: document.getElementById("estadoEnvio"),
        btnAgregar: document.getElementById("btnAgregar"),
        btnFinalizar: document.getElementById("btnFinalizar"),
        btnCancelar: document.getElementById("btnCancelar"),
        checkEnvio: document.getElementById("checkEnvio"),
        deliverySection: document.getElementById("deliverySection"),
        deliveryForm: document.getElementById("deliveryForm"),
        btnSalir: document.getElementById("btnSalir")
    };
    // ==================== CARGAR DATOS ====================
    cargarProductos();
    cargarClientes();
    function cargarProductos() {
        fetch("".concat(API_URL, "/productos"))
            .then(function (res) { return res.ok ? res.text() : Promise.reject("Error de conexión"); })
            .then(function (text) {
            var lineas = text.split("\n").map(function (l) { return l.trim(); }).filter(function (l) { return l; });
            lineas.shift(); // Quitar encabezado
            productos = lineas.map(function (l) {
                var cols = l.split(/\t/).map(function (c) { return c.trim().replace(/^"|"$/g, ''); });
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
            });
            console.log('Productos cargados:', productos.length, productos);
            llenarSelectProductos();
        })
            .catch(function (err) { return console.error("Error al cargar productos:", err); });
    }
    function cargarClientes() {
        fetch("".concat(API_URL, "/clientes"))
            .then(function (res) { return res.ok ? res.text() : Promise.reject("Error de conexión"); })
            .then(function (text) {
            var lineas = text.split("\n").map(function (l) { return l.trim(); }).filter(function (l) { return l; });
            lineas.shift(); // Quitar encabezado
            clientes = lineas.map(function (l) {
                var cols = l.split(/\t|,/).map(function (c) { return c.trim().replace(/^"|"$/g, ''); });
                return {
                    id: parseInt(cols[0]) || 0,
                    nombre: cols[1] || '',
                    correo: cols[2] || '',
                    telefono: cols[3] || '',
                    direccion: cols[4] || '',
                    fechaRegistro: cols[5] || '',
                    categoria: cols[6] || ''
                };
            });
            llenarSelectClientes();
        })
            .catch(function (err) { return console.error("Error al cargar clientes:", err); });
    }
    function llenarSelectProductos() {
        elementos.selectProducto.innerHTML = '<option value="">Seleccione un producto</option>';
        productos.forEach(function (p) {
            if (p.stock > 0) {
                var option = document.createElement("option");
                option.value = p.id.toString();
                option.textContent = "".concat(p.nombre, " - $").concat(p.precioVenta.toFixed(2), " (Stock: ").concat(p.stock, ")");
                elementos.selectProducto.appendChild(option);
            }
        });
    }
    function llenarSelectClientes() {
        elementos.selectCliente.innerHTML = '<option value="">Seleccione un cliente</option>';
        clientes.forEach(function (c) {
            var option = document.createElement("option");
            option.value = c.id.toString();
            option.textContent = c.nombre;
            elementos.selectCliente.appendChild(option);
        });
    }
    // ==================== EVENTOS ====================
    elementos.selectCliente.addEventListener("change", function () {
        var clienteId = parseInt(elementos.selectCliente.value);
        if (clienteId) {
            clienteSeleccionado = clienteId;
            var cliente = clientes.find(function (c) { return c.id === clienteId; });
            elementos.clienteSeleccionado.textContent = (cliente === null || cliente === void 0 ? void 0 : cliente.nombre) || "No seleccionado";
            actualizarResumen();
        }
    });
    elementos.btnAgregar.addEventListener("click", function () {
        var productoId = parseInt(elementos.selectProducto.value);
        var cantidad = parseInt(elementos.inputCantidad.value);
        if (!productoId) {
            alert("Seleccione un producto");
            return;
        }
        if (!cantidad || cantidad < 1) {
            alert("Ingrese una cantidad válida");
            return;
        }
        var producto = productos.find(function (p) { return p.id === productoId; });
        if (!producto) {
            alert("Producto no encontrado");
            return;
        }
        if (cantidad > producto.stock) {
            alert("Stock insuficiente. Disponible: ".concat(producto.stock));
            return;
        }
        var itemExistente = carritoActual.find(function (item) { return item.productoId === productoId; });
        if (itemExistente) {
            var nuevaCantidad = itemExistente.cantidad + cantidad;
            if (nuevaCantidad > producto.stock) {
                alert("Stock insuficiente. Disponible: ".concat(producto.stock));
                return;
            }
            itemExistente.cantidad = nuevaCantidad;
            itemExistente.subtotal = itemExistente.cantidad * itemExistente.precioUnitario;
        }
        else {
            carritoActual.push({
                productoId: productoId,
                cantidad: cantidad,
                precioUnitario: producto.precioVenta,
                precioCompra: producto.precioCompra,
                subtotal: producto.precioVenta * cantidad
            });
        }
        elementos.selectProducto.value = "";
        elementos.inputCantidad.value = "1";
        mostrarCarrito();
        actualizarResumen();
    });
    elementos.checkEnvio.addEventListener("change", function (e) {
        requiereEnvio = e.target.checked;
        elementos.deliveryForm.style.display = requiereEnvio ? "block" : "none";
        elementos.estadoEnvio.textContent = requiereEnvio ? "Sí" : "No";
    });
    elementos.btnFinalizar.addEventListener("click", function () {
        if (!clienteSeleccionado) {
            alert("Seleccione un cliente");
            return;
        }
        if (carritoActual.length === 0) {
            alert("El carrito está vacío");
            return;
        }
        if (!elementos.selectMetodo.value) {
            alert("Seleccione un método de pago");
            return;
        }
        if (requiereEnvio) {
            var calle = document.getElementById("inputCalle").value;
            var numero = document.getElementById("inputNumero").value;
            var colonia = document.getElementById("inputColonia").value;
            var cp = document.getElementById("inputCP").value;
            var ciudad = document.getElementById("inputCiudad").value;
            if (!calle || !numero || !colonia || !cp || !ciudad) {
                alert("Complete todos los campos de dirección de envío");
                return;
            }
        }
        finalizarVenta();
    });
    elementos.btnCancelar.addEventListener("click", function () {
        if (confirm("¿Desea cancelar la venta actual?")) {
            cancelarVenta();
        }
    });
    elementos.btnSalir.addEventListener("click", function (e) {
        e.preventDefault();
        if (confirm("¿Desea cerrar sesión?")) {
            sessionStorage.removeItem('usuarioLogueado');
            window.location.href = 'index.html';
        }
    });
    // ==================== BOTÓN CONSULTAR VENTAS ====================
    var btnConsultar = document.createElement("button");
    btnConsultar.id = "btnConsultarVentas";
    btnConsultar.innerHTML = '<span>📊</span> Consultar Ventas';
    btnConsultar.style.cssText = "\n    position: fixed;\n    bottom: 30px;\n    right: 30px;\n    padding: 15px 25px;\n    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);\n    color: white;\n    border: none;\n    border-radius: 50px;\n    cursor: pointer;\n    font-size: 16px;\n    font-weight: bold;\n    box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4);\n    transition: all 0.3s ease;\n    z-index: 1000;\n  ";
    btnConsultar.addEventListener("mouseenter", function () {
        btnConsultar.style.transform = "translateY(-3px)";
        btnConsultar.style.boxShadow = "0 6px 20px rgba(102, 126, 234, 0.6)";
    });
    btnConsultar.addEventListener("mouseleave", function () {
        btnConsultar.style.transform = "translateY(0)";
        btnConsultar.style.boxShadow = "0 4px 15px rgba(102, 126, 234, 0.4)";
    });
    btnConsultar.addEventListener("click", toggleConsultaVentas);
    document.body.appendChild(btnConsultar);
    // ==================== FUNCIONES ====================
    function toggleConsultaVentas() {
        var modalConsulta = document.getElementById("modalConsultaVentas");
        if (modalConsulta) {
            // Si existe, alternar visibilidad
            if (modalConsulta.style.display === "none" || !modalConsulta.style.display) {
                modalConsulta.style.display = "flex";
                cargarHistorialVentas();
            }
            else {
                modalConsulta.style.display = "none";
            }
        }
        else {
            // Crear el modal por primera vez
            crearModalConsulta();
            cargarHistorialVentas();
        }
    }
    function crearModalConsulta() {
        var _a, _b, _c;
        var modalHTML = "\n      <div id=\"modalConsultaVentas\" style=\"\n        display: flex;\n        position: fixed;\n        top: 0;\n        left: 0;\n        width: 100%;\n        height: 100%;\n        background: rgba(0, 0, 0, 0.7);\n        z-index: 9999;\n        justify-content: center;\n        align-items: center;\n        backdrop-filter: blur(5px);\n      \">\n        <div style=\"\n          background: white;\n          padding: 0;\n          border-radius: 15px;\n          max-width: 95%;\n          width: 1200px;\n          max-height: 90vh;\n          box-shadow: 0 10px 40px rgba(0, 0, 0, 0.3);\n          display: flex;\n          flex-direction: column;\n        \">\n          <!-- Header -->\n          <div style=\"\n            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);\n            padding: 20px 30px;\n            border-radius: 15px 15px 0 0;\n            display: flex;\n            justify-content: space-between;\n            align-items: center;\n          \">\n            <h2 style=\"margin: 0; color: white; font-size: 24px;\">\n              \uD83D\uDCCA Historial de Ventas\n            </h2>\n            <button id=\"btnCerrarConsulta\" style=\"\n              background: rgba(255, 255, 255, 0.2);\n              color: white;\n              border: none;\n              padding: 8px 15px;\n              border-radius: 8px;\n              cursor: pointer;\n              font-size: 18px;\n              font-weight: bold;\n              transition: all 0.3s ease;\n            \">\u2716 Cerrar</button>\n          </div>\n\n          <!-- Filtros -->\n          <div style=\"padding: 20px 30px; background: #f8f9fa; border-bottom: 1px solid #e0e0e0;\">\n            <div style=\"display: flex; gap: 15px; flex-wrap: wrap; align-items: center;\">\n              <div style=\"flex: 1; min-width: 200px;\">\n                <label style=\"display: block; font-weight: bold; margin-bottom: 5px; color: #333;\">\n                  Buscar por cliente:\n                </label>\n                <input type=\"text\" id=\"filtroCliente\" placeholder=\"Nombre del cliente...\" style=\"\n                  width: 100%;\n                  padding: 10px;\n                  border: 2px solid #ddd;\n                  border-radius: 8px;\n                  font-size: 14px;\n                \">\n              </div>\n              <div style=\"flex: 1; min-width: 150px;\">\n                <label style=\"display: block; font-weight: bold; margin-bottom: 5px; color: #333;\">\n                  Fecha desde:\n                </label>\n                <input type=\"date\" id=\"filtroFechaDesde\" style=\"\n                  width: 100%;\n                  padding: 10px;\n                  border: 2px solid #ddd;\n                  border-radius: 8px;\n                  font-size: 14px;\n                \">\n              </div>\n              <div style=\"flex: 1; min-width: 150px;\">\n                <label style=\"display: block; font-weight: bold; margin-bottom: 5px; color: #333;\">\n                  Fecha hasta:\n                </label>\n                <input type=\"date\" id=\"filtroFechaHasta\" style=\"\n                  width: 100%;\n                  padding: 10px;\n                  border: 2px solid #ddd;\n                  border-radius: 8px;\n                  font-size: 14px;\n                \">\n              </div>\n              <div style=\"align-self: flex-end;\">\n                <button id=\"btnFiltrar\" style=\"\n                  padding: 10px 20px;\n                  background: #667eea;\n                  color: white;\n                  border: none;\n                  border-radius: 8px;\n                  cursor: pointer;\n                  font-weight: bold;\n                  transition: all 0.3s ease;\n                \">\uD83D\uDD0D Filtrar</button>\n              </div>\n              <div style=\"align-self: flex-end;\">\n                <button id=\"btnLimpiarFiltros\" style=\"\n                  padding: 10px 20px;\n                  background: #6c757d;\n                  color: white;\n                  border: none;\n                  border-radius: 8px;\n                  cursor: pointer;\n                  font-weight: bold;\n                  transition: all 0.3s ease;\n                \">\uD83D\uDD04 Limpiar</button>\n              </div>\n            </div>\n          </div>\n\n          <!-- Estad\u00EDsticas -->\n          <div id=\"estadisticasVentas\" style=\"\n            padding: 15px 30px;\n            background: linear-gradient(to right, #e3f2fd, #f3e5f5);\n            display: flex;\n            justify-content: space-around;\n            gap: 20px;\n            flex-wrap: wrap;\n          \"></div>\n\n          <!-- Tabla -->\n          <div style=\"\n            flex: 1;\n            overflow-y: auto;\n            padding: 20px 30px;\n          \">\n            <table id=\"tablaHistorialVentas\" style=\"\n              width: 100%;\n              border-collapse: collapse;\n              font-size: 14px;\n            \">\n              <thead>\n                <tr style=\"background: #667eea; color: white;\">\n                  <th style=\"padding: 12px; text-align: left; border: 1px solid #ddd;\">Folio</th>\n                  <th style=\"padding: 12px; text-align: left; border: 1px solid #ddd;\">Cliente</th>\n                  <th style=\"padding: 12px; text-align: left; border: 1px solid #ddd;\">Productos</th>\n                  <th style=\"padding: 12px; text-align: center; border: 1px solid #ddd;\">Fecha</th>\n                  <th style=\"padding: 12px; text-align: right; border: 1px solid #ddd;\">Total</th>\n                  <th style=\"padding: 12px; text-align: center; border: 1px solid #ddd;\">Tipo Pago</th>\n                  <th style=\"padding: 12px; text-align: center; border: 1px solid #ddd;\">Env\u00EDo</th>\n                  <th style=\"padding: 12px; text-align: center; border: 1px solid #ddd;\">Acciones</th>\n                </tr>\n              </thead>\n              <tbody id=\"bodyHistorialVentas\">\n                <tr>\n                  <td colspan=\"8\" style=\"text-align: center; padding: 40px; color: #999;\">\n                    Cargando ventas...\n                  </td>\n                </tr>\n              </tbody>\n            </table>\n          </div>\n        </div>\n      </div>\n    ";
        document.body.insertAdjacentHTML('beforeend', modalHTML);
        // Event listeners del modal
        (_a = document.getElementById("btnCerrarConsulta")) === null || _a === void 0 ? void 0 : _a.addEventListener("click", function () {
            var modal = document.getElementById("modalConsultaVentas");
            if (modal)
                modal.style.display = "none";
        });
        (_b = document.getElementById("btnFiltrar")) === null || _b === void 0 ? void 0 : _b.addEventListener("click", function () {
            cargarHistorialVentas();
        });
        (_c = document.getElementById("btnLimpiarFiltros")) === null || _c === void 0 ? void 0 : _c.addEventListener("click", function () {
            document.getElementById("filtroCliente").value = "";
            document.getElementById("filtroFechaDesde").value = "";
            document.getElementById("filtroFechaHasta").value = "";
            cargarHistorialVentas();
        });
        // Hover effects
        var btnCerrar = document.getElementById("btnCerrarConsulta");
        btnCerrar === null || btnCerrar === void 0 ? void 0 : btnCerrar.addEventListener("mouseenter", function () {
            btnCerrar.style.background = "rgba(255, 255, 255, 0.3)";
        });
        btnCerrar === null || btnCerrar === void 0 ? void 0 : btnCerrar.addEventListener("mouseleave", function () {
            btnCerrar.style.background = "rgba(255, 255, 255, 0.2)";
        });
    }
    function cargarHistorialVentas() {
        var bodyTabla = document.getElementById("bodyHistorialVentas");
        if (!bodyTabla)
            return;
        bodyTabla.innerHTML = '<tr><td colspan="8" style="text-align: center; padding: 40px; color: #999;">Cargando ventas...</td></tr>';
        fetch("".concat(API_URL, "/ventas"))
            .then(function (res) { return res.ok ? res.text() : Promise.reject("Error de conexión"); })
            .then(function (text) {
            var _a, _b, _c;
            var lineas = text.split("\n").map(function (l) { return l.trim(); }).filter(function (l) { return l; });
            lineas.shift(); // Quitar encabezado
            if (lineas.length === 0) {
                bodyTabla.innerHTML = '<tr><td colspan="8" style="text-align: center; padding: 40px; color: #999;">No hay ventas registradas</td></tr>';
                return;
            }
            var ventasParsed = lineas.map(function (linea) {
                var _a, _b, _c, _d;
                var partes = linea.match(/(?:[^,"]+|"[^"]*")+/g) || [];
                return {
                    id: parseInt(partes[0]) || 0,
                    clienteId: parseInt(partes[1]) || 0,
                    nombreCliente: ((_a = partes[2]) === null || _a === void 0 ? void 0 : _a.replace(/"/g, '')) || 'Desconocido',
                    productosStr: ((_b = partes[3]) === null || _b === void 0 ? void 0 : _b.replace(/"/g, '')) || '',
                    fecha: partes[4] || '',
                    total: parseFloat(partes[5]) || 0,
                    tipoPago: ((_c = partes[6]) === null || _c === void 0 ? void 0 : _c.replace(/"/g, '')) || 'Efectivo',
                    envio: ((_d = partes[7]) === null || _d === void 0 ? void 0 : _d.replace(/"/g, '')) || '-'
                };
            });
            // Aplicar filtros
            var filtroCliente = ((_a = document.getElementById("filtroCliente")) === null || _a === void 0 ? void 0 : _a.value.toLowerCase()) || "";
            var filtroFechaDesde = ((_b = document.getElementById("filtroFechaDesde")) === null || _b === void 0 ? void 0 : _b.value) || "";
            var filtroFechaHasta = ((_c = document.getElementById("filtroFechaHasta")) === null || _c === void 0 ? void 0 : _c.value) || "";
            var ventasFiltradas = ventasParsed.filter(function (venta) {
                var cumpleCliente = !filtroCliente || venta.nombreCliente.toLowerCase().includes(filtroCliente);
                var cumpleFechaDesde = !filtroFechaDesde || venta.fecha >= filtroFechaDesde;
                var cumpleFechaHasta = !filtroFechaHasta || venta.fecha <= filtroFechaHasta;
                return cumpleCliente && cumpleFechaDesde && cumpleFechaHasta;
            });
            // Mostrar estadísticas
            mostrarEstadisticas(ventasFiltradas);
            if (ventasFiltradas.length === 0) {
                bodyTabla.innerHTML = '<tr><td colspan="8" style="text-align: center; padding: 40px; color: #999;">No se encontraron ventas con los filtros aplicados</td></tr>';
                return;
            }
            bodyTabla.innerHTML = ventasFiltradas.map(function (venta) {
                var productosVenta = 'Sin productos';
                try {
                    if (venta.productosStr && venta.productosStr.trim()) {
                        var items = venta.productosStr.split('|');
                        var productosHTML = items.map(function (prod) {
                            var partes = prod.split(':');
                            if (partes.length >= 2) {
                                var idProd_1 = parseInt(partes[0]);
                                var cantidad = partes[1];
                                var precioUnit = partes[2] ? parseFloat(partes[2]) : 0;
                                // Buscar el producto en el array global
                                var productoEncontrado = productos.find(function (p) { return p.id === idProd_1; });
                                if (productoEncontrado) {
                                    return "<div style=\"margin: 2px 0; padding: 3px 0; border-bottom: 1px dashed #e0e0e0;\">\n                      <strong>".concat(productoEncontrado.nombre, "</strong> \n                      <span style=\"color: #666; font-size: 12px;\">(").concat(cantidad, " \u00D7 ").concat(precioUnit.toFixed(2), ")</span>\n                    </div>");
                                }
                                else {
                                    return "<div style=\"margin: 2px 0; color: #999;\">\n                      Producto #".concat(idProd_1, " (").concat(cantidad, " unid.)\n                    </div>");
                                }
                            }
                            return '';
                        }).filter(function (x) { return x; }).join('');
                        productosVenta = productosHTML || 'Error al cargar productos';
                    }
                }
                catch (e) {
                    console.error('Error parseando productos:', e, venta.productosStr);
                    productosVenta = "<span style=\"color: #f44336;\">Error al parsear</span>";
                }
                var tieneEnvio = venta.envio && venta.envio !== '-';
                return "\n            <tr style=\"border-bottom: 1px solid #e0e0e0; transition: background 0.2s;\" \n                onmouseenter=\"this.style.background='#f5f5f5'\" \n                onmouseleave=\"this.style.background='white'\">\n              <td style=\"padding: 12px; border: 1px solid #ddd;\"><strong>#".concat(venta.id, "</strong></td>\n              <td style=\"padding: 12px; border: 1px solid #ddd;\">").concat(venta.nombreCliente, "</td>\n              <td style=\"padding: 12px; border: 1px solid #ddd; font-size: 12px;\">").concat(productos, "</td>\n              <td style=\"padding: 12px; border: 1px solid #ddd; text-align: center;\">").concat(formatearFechaLegible(venta.fecha), "</td>\n              <td style=\"padding: 12px; border: 1px solid #ddd; text-align: right; font-weight: bold; color: #4caf50;\">").concat(venta.total.toFixed(2), "</td>\n              <td style=\"padding: 12px; border: 1px solid #ddd; text-align: center;\">\n                <span style=\"background: ").concat(venta.tipoPago === 'Efectivo' ? '#4caf50' : venta.tipoPago === 'Tarjeta' ? '#2196f3' : '#ff9800', "; \n                             color: white; padding: 4px 10px; border-radius: 12px; font-size: 12px;\">\n                  ").concat(venta.tipoPago, "\n                </span>\n              </td>\n              <td style=\"padding: 12px; border: 1px solid #ddd; text-align: center;\">\n                ").concat(tieneEnvio ? '📦 Sí' : '❌ No', "\n              </td>\n              <td style=\"padding: 12px; border: 1px solid #ddd; text-align: center;\">\n                <button onclick=\"verDetalleVenta(").concat(venta.id, ")\" style=\"\n                  background: #667eea;\n                  color: white;\n                  border: none;\n                  padding: 6px 12px;\n                  border-radius: 6px;\n                  cursor: pointer;\n                  font-size: 12px;\n                  transition: all 0.3s ease;\n                \">\uD83D\uDC41\uFE0F Ver</button>\n              </td>\n            </tr>\n          ");
            }).join("");
        })
            .catch(function (err) {
            bodyTabla.innerHTML = "<tr><td colspan=\"8\" style=\"text-align: center; padding: 40px; color: #f44336;\">Error al cargar ventas: ".concat(err, "</td></tr>");
        });
    }
    function mostrarEstadisticas(ventas) {
        var estadisticas = document.getElementById("estadisticasVentas");
        if (!estadisticas)
            return;
        var totalVentas = ventas.length;
        var montoTotal = ventas.reduce(function (sum, v) { return sum + v.total; }, 0);
        var ventasEfectivo = ventas.filter(function (v) { return v.tipoPago === 'Efectivo'; }).length;
        var ventasConEnvio = ventas.filter(function (v) { return v.envio && v.envio !== '-'; }).length;
        estadisticas.innerHTML = "\n      <div style=\"text-align: center; flex: 1; min-width: 150px;\">\n        <div style=\"font-size: 28px; font-weight: bold; color: #667eea;\">".concat(totalVentas, "</div>\n        <div style=\"font-size: 14px; color: #666; margin-top: 5px;\">Total Ventas</div>\n      </div>\n      <div style=\"text-align: center; flex: 1; min-width: 150px;\">\n        <div style=\"font-size: 28px; font-weight: bold; color: #4caf50;\">").concat(montoTotal.toFixed(2), "</div>\n        <div style=\"font-size: 14px; color: #666; margin-top: 5px;\">Monto Total</div>\n      </div>\n      <div style=\"text-align: center; flex: 1; min-width: 150px;\">\n        <div style=\"font-size: 28px; font-weight: bold; color: #ff9800;\">").concat(ventasEfectivo, "</div>\n        <div style=\"font-size: 14px; color: #666; margin-top: 5px;\">Efectivo</div>\n      </div>\n      <div style=\"text-align: center; flex: 1; min-width: 150px;\">\n        <div style=\"font-size: 28px; font-weight: bold; color: #2196f3;\">").concat(ventasConEnvio, "</div>\n        <div style=\"font-size: 14px; color: #666; margin-top: 5px;\">Con Env\u00EDo</div>\n      </div>\n    ");
    }
    window.verDetalleVenta = function (idVenta) {
        alert("Funci\u00F3n en desarrollo: Ver detalle de venta #".concat(idVenta));
        // Aquí puedes implementar un modal con el detalle completo de la venta
    };
    function formatearFechaLegible(fecha) {
        if (!fecha)
            return "N/A";
        try {
            var _a = fecha.split("-"), year = _a[0], month = _a[1], day = _a[2];
            return "".concat(day, "/").concat(month, "/").concat(year);
        }
        catch (_b) {
            return fecha;
        }
    }
    function mostrarCarrito() {
        if (carritoActual.length === 0) {
            elementos.cartBody.innerHTML = '<tr><td colspan="6" class="empty-cart">No hay productos agregados</td></tr>';
            elementos.deliverySection.style.display = "none";
            return;
        }
        elementos.deliverySection.style.display = "block";
        elementos.cartBody.innerHTML = carritoActual.map(function (item, index) {
            var producto = productos.find(function (p) { return p.id === item.productoId; });
            return "\n        <tr>\n          <td>".concat(index + 1, "</td>\n          <td>\n            <strong>").concat((producto === null || producto === void 0 ? void 0 : producto.nombre) || "Desconocido", "</strong><br>\n            <small style=\"color:#666;\">").concat((producto === null || producto === void 0 ? void 0 : producto.marca) || "", "</small>\n          </td>\n          <td>").concat(item.cantidad, "</td>\n          <td>$").concat(item.precioUnitario.toFixed(2), "</td>\n          <td><strong>$").concat(item.subtotal.toFixed(2), "</strong></td>\n          <td>\n            <button onclick=\"eliminarItem(").concat(index, ")\" class=\"btn-remove\" style=\"background:#f44336; color:white; border:none; padding:4px 8px; border-radius:4px; cursor:pointer;\">\n              \u2716 Quitar\n            </button>\n          </td>\n        </tr>\n      ");
        }).join("");
    }
    window.eliminarItem = function (index) {
        if (confirm("¿Desea quitar este producto del carrito?")) {
            carritoActual.splice(index, 1);
            mostrarCarrito();
            actualizarResumen();
        }
    };
    function actualizarResumen() {
        var subtotal = carritoActual.reduce(function (sum, item) { return sum + item.subtotal; }, 0);
        var iva = subtotal * 0.16;
        var total = subtotal + iva;
        var totalArticulos = carritoActual.reduce(function (sum, item) { return sum + item.cantidad; }, 0);
        elementos.subtotal.textContent = "$".concat(subtotal.toFixed(2));
        elementos.iva.textContent = "$".concat(iva.toFixed(2));
        elementos.total.textContent = "$".concat(total.toFixed(2));
        elementos.totalArticulos.textContent = totalArticulos.toString();
        elementos.btnFinalizar.disabled = carritoActual.length === 0 || !clienteSeleccionado;
    }
    function finalizarVenta() {
        var cliente = clientes.find(function (c) { return c.id === clienteSeleccionado; });
        var subtotal = carritoActual.reduce(function (sum, item) { return sum + item.subtotal; }, 0);
        var iva = subtotal * 0.16;
        var total = subtotal + iva;
        var envio;
        if (requiereEnvio) {
            envio = {
                calle: document.getElementById("inputCalle").value,
                numero: document.getElementById("inputNumero").value,
                colonia: document.getElementById("inputColonia").value,
                codigoPostal: document.getElementById("inputCP").value,
                ciudad: document.getElementById("inputCiudad").value,
                referencias: document.getElementById("inputReferencias").value
            };
        }
        var datosVenta = {
            clienteId: clienteSeleccionado,
            nombreCliente: (cliente === null || cliente === void 0 ? void 0 : cliente.nombre) || "Desconocido",
            items: carritoActual.map(function (item) { return ({
                productoId: item.productoId,
                cantidad: item.cantidad,
                precioUnitario: item.precioUnitario,
                subtotal: item.subtotal
            }); }),
            fecha: new Date().toISOString().split('T')[0],
            total: parseFloat(total.toFixed(2)),
            tipoPago: elementos.selectMetodo.value,
            envio: envio
        };
        fetch("".concat(API_URL, "/ventas/guardar"), {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(datosVenta)
        })
            .then(function (res) {
            if (!res.ok)
                throw new Error("Error del servidor: ".concat(res.status));
            return res.json();
        })
            .then(function (data) {
            alert("Venta registrada exitosamente\nFolio: ".concat(data.id, "\nTotal: $").concat(total.toFixed(2), "\nM\u00E9todo: ").concat(datosVenta.tipoPago));
            cancelarVenta();
        })
            .catch(function (err) {
            alert("Error al guardar venta: " + err.message);
        });
    }
    function cancelarVenta() {
        carritoActual = [];
        clienteSeleccionado = null;
        requiereEnvio = false;
        elementos.selectCliente.value = "";
        elementos.selectProducto.value = "";
        elementos.inputCantidad.value = "1";
        elementos.selectMetodo.value = "";
        elementos.checkEnvio.checked = false;
        elementos.deliveryForm.style.display = "none";
        elementos.clienteSeleccionado.textContent = "No seleccionado";
        elementos.estadoEnvio.textContent = "No";
        // Limpiar campos de dirección
        document.getElementById("inputCalle").value = "";
        document.getElementById("inputNumero").value = "";
        document.getElementById("inputColonia").value = "";
        document.getElementById("inputCP").value = "";
        document.getElementById("inputCiudad").value = "";
        document.getElementById("inputReferencias").value = "";
        mostrarCarrito();
        actualizarResumen();
    }
    // Inicializar resumen
    actualizarResumen();
});
