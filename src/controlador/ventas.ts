// ==================== INTERFACES ====================
interface Producto {
  id: number;
  nombre: string;
  categoria: string;
  precioCompra: number;
  precioVenta: number;
  stock: number;
  stockMinimo: number;
  proveedor: string;
  marca: string;
  descripcion: string;
  fechaRegistro: string;
  estado: string;
}

interface Cliente {
  id: number;
  nombre: string;
  correo: string;
  telefono: string;
  direccion: string;
  fechaRegistro: string;
  categoria: string;
}

interface ItemCarrito {
  productoId: number;
  cantidad: number;
  precioUnitario: number;
  precioCompra: number;
  subtotal: number;
}

interface DireccionEnvio {
  calle: string;
  numero: string;
  colonia: string;
  codigoPostal: string;
  ciudad: string;
  referencias: string;
}

interface Venta {
  id: number;
  clienteId: number;
  nombreCliente: string;
  items: ItemCarrito[];
  fecha: string;
  total: number;
  tipoPago: string;
  envio?: DireccionEnvio;
}

// ==================== VARIABLES GLOBALES ====================
const API_URL = "http://localhost:3000";
let productos: Producto[] = [];
let clientes: Cliente[] = [];
let carritoActual: ItemCarrito[] = [];
let clienteSeleccionado: number | null = null;
let requiereEnvio: boolean = false;

// ==================== VERIFICAR SESIÓN ====================
const usuarioLogueado = sessionStorage.getItem('usuarioLogueado');
if (!usuarioLogueado) {
  alert('Debes iniciar sesión primero');
  window.location.href = 'index.html';
}

// ==================== AL CARGAR EL DOM ====================
document.addEventListener("DOMContentLoaded", () => {
  const elementos = {
    selectCliente: document.getElementById("selectCliente") as HTMLSelectElement,
    selectProducto: document.getElementById("selectProducto") as HTMLSelectElement,
    inputCantidad: document.getElementById("inputCantidad") as HTMLInputElement,
    selectMetodo: document.getElementById("selectMetodo") as HTMLSelectElement,
    cartBody: document.getElementById("cartBody") as HTMLTableSectionElement,
    subtotal: document.getElementById("subtotal") as HTMLElement,
    iva: document.getElementById("iva") as HTMLElement,
    total: document.getElementById("total") as HTMLElement,
    totalArticulos: document.getElementById("totalArticulos") as HTMLElement,
    clienteSeleccionado: document.getElementById("clienteSeleccionado") as HTMLElement,
    estadoEnvio: document.getElementById("estadoEnvio") as HTMLElement,
    btnAgregar: document.getElementById("btnAgregar") as HTMLButtonElement,
    btnFinalizar: document.getElementById("btnFinalizar") as HTMLButtonElement,
    btnCancelar: document.getElementById("btnCancelar") as HTMLButtonElement,
    checkEnvio: document.getElementById("checkEnvio") as HTMLInputElement,
    deliverySection: document.getElementById("deliverySection") as HTMLElement,
    deliveryForm: document.getElementById("deliveryForm") as HTMLElement,
    btnSalir: document.getElementById("btnSalir") as HTMLAnchorElement
  };

  // ==================== CARGAR DATOS ====================
  cargarProductos();
  cargarClientes();

  function cargarProductos() {
    fetch(`${API_URL}/productos`)
      .then(res => res.ok ? res.text() : Promise.reject("Error de conexión"))
      .then(text => {
        const lineas = text.split("\n").map(l => l.trim()).filter(l => l);
        lineas.shift(); // Quitar encabezado

        productos = lineas.map(l => {
          const cols = l.split(/\t/).map(c => c.trim().replace(/^"|"$/g, ''));
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
      .catch(err => console.error("Error al cargar productos:", err));
  }

  function cargarClientes() {
    fetch(`${API_URL}/clientes`)
      .then(res => res.ok ? res.text() : Promise.reject("Error de conexión"))
      .then(text => {
        const lineas = text.split("\n").map(l => l.trim()).filter(l => l);
        lineas.shift(); // Quitar encabezado

        clientes = lineas.map(l => {
          const cols = l.split(/\t|,/).map(c => c.trim().replace(/^"|"$/g, ''));
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
      .catch(err => console.error("Error al cargar clientes:", err));
  }

  function llenarSelectProductos() {
    elementos.selectProducto.innerHTML = '<option value="">Seleccione un producto</option>';
    productos.forEach(p => {
      if (p.stock > 0) {
        const option = document.createElement("option");
        option.value = p.id.toString();
        option.textContent = `${p.nombre} - $${p.precioVenta.toFixed(2)} (Stock: ${p.stock})`;
        elementos.selectProducto.appendChild(option);
      }
    });
  }

  function llenarSelectClientes() {
    elementos.selectCliente.innerHTML = '<option value="">Seleccione un cliente</option>';
    clientes.forEach(c => {
      const option = document.createElement("option");
      option.value = c.id.toString();
      option.textContent = c.nombre;
      elementos.selectCliente.appendChild(option);
    });
  }

  // ==================== EVENTOS ====================
  elementos.selectCliente.addEventListener("change", () => {
    const clienteId = parseInt(elementos.selectCliente.value);
    if (clienteId) {
      clienteSeleccionado = clienteId;
      const cliente = clientes.find(c => c.id === clienteId);
      elementos.clienteSeleccionado.textContent = cliente?.nombre || "No seleccionado";
      actualizarResumen();
    }
  });

  elementos.btnAgregar.addEventListener("click", () => {
    const productoId = parseInt(elementos.selectProducto.value);
    const cantidad = parseInt(elementos.inputCantidad.value);

    if (!productoId) {
      alert("Seleccione un producto");
      return;
    }

    if (!cantidad || cantidad < 1) {
      alert("Ingrese una cantidad válida");
      return;
    }

    const producto = productos.find(p => p.id === productoId);
    if (!producto) {
      alert("Producto no encontrado");
      return;
    }

    if (cantidad > producto.stock) {
      alert(`Stock insuficiente. Disponible: ${producto.stock}`);
      return;
    }

    const itemExistente = carritoActual.find(item => item.productoId === productoId);
    if (itemExistente) {
      const nuevaCantidad = itemExistente.cantidad + cantidad;
      if (nuevaCantidad > producto.stock) {
        alert(`Stock insuficiente. Disponible: ${producto.stock}`);
        return;
      }
      itemExistente.cantidad = nuevaCantidad;
      itemExistente.subtotal = itemExistente.cantidad * itemExistente.precioUnitario;
    } else {
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

  elementos.checkEnvio.addEventListener("change", (e) => {
    requiereEnvio = (e.target as HTMLInputElement).checked;
    elementos.deliveryForm.style.display = requiereEnvio ? "block" : "none";
    elementos.estadoEnvio.textContent = requiereEnvio ? "Sí" : "No";
  });

  elementos.btnFinalizar.addEventListener("click", () => {
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
      const calle = (document.getElementById("inputCalle") as HTMLInputElement).value;
      const numero = (document.getElementById("inputNumero") as HTMLInputElement).value;
      const colonia = (document.getElementById("inputColonia") as HTMLInputElement).value;
      const cp = (document.getElementById("inputCP") as HTMLInputElement).value;
      const ciudad = (document.getElementById("inputCiudad") as HTMLInputElement).value;

      if (!calle || !numero || !colonia || !cp || !ciudad) {
        alert("Complete todos los campos de dirección de envío");
        return;
      }
    }

    finalizarVenta();
  });

  elementos.btnCancelar.addEventListener("click", () => {
    if (confirm("¿Desea cancelar la venta actual?")) {
      cancelarVenta();
    }
  });

  elementos.btnSalir.addEventListener("click", (e) => {
    e.preventDefault();
    if (confirm("¿Desea cerrar sesión?")) {
      sessionStorage.removeItem('usuarioLogueado');
      window.location.href = 'index.html';
    }
  });

  // ==================== BOTÓN CONSULTAR VENTAS ====================
  const btnConsultar = document.createElement("button");
  btnConsultar.id = "btnConsultarVentas";
  btnConsultar.innerHTML = '<span>📊</span> Consultar Ventas';
  btnConsultar.style.cssText = `
    position: fixed;
    bottom: 30px;
    right: 30px;
    padding: 15px 25px;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    border: none;
    border-radius: 50px;
    cursor: pointer;
    font-size: 16px;
    font-weight: bold;
    box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4);
    transition: all 0.3s ease;
    z-index: 1000;
  `;
  
  btnConsultar.addEventListener("mouseenter", () => {
    btnConsultar.style.transform = "translateY(-3px)";
    btnConsultar.style.boxShadow = "0 6px 20px rgba(102, 126, 234, 0.6)";
  });
  
  btnConsultar.addEventListener("mouseleave", () => {
    btnConsultar.style.transform = "translateY(0)";
    btnConsultar.style.boxShadow = "0 4px 15px rgba(102, 126, 234, 0.4)";
  });
  
  btnConsultar.addEventListener("click", toggleConsultaVentas);
  document.body.appendChild(btnConsultar);

  // ==================== FUNCIONES ====================
  function toggleConsultaVentas() {
    const modalConsulta = document.getElementById("modalConsultaVentas");
    
    if (modalConsulta) {
      // Si existe, alternar visibilidad
      if (modalConsulta.style.display === "none" || !modalConsulta.style.display) {
        modalConsulta.style.display = "flex";
        cargarHistorialVentas();
      } else {
        modalConsulta.style.display = "none";
      }
    } else {
      // Crear el modal por primera vez
      crearModalConsulta();
      cargarHistorialVentas();
    }
  }

  function crearModalConsulta() {
    const modalHTML = `
      <div id="modalConsultaVentas" style="
        display: flex;
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.7);
        z-index: 9999;
        justify-content: center;
        align-items: center;
        backdrop-filter: blur(5px);
      ">
        <div style="
          background: white;
          padding: 0;
          border-radius: 15px;
          max-width: 95%;
          width: 1200px;
          max-height: 90vh;
          box-shadow: 0 10px 40px rgba(0, 0, 0, 0.3);
          display: flex;
          flex-direction: column;
        ">
          <!-- Header -->
          <div style="
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            padding: 20px 30px;
            border-radius: 15px 15px 0 0;
            display: flex;
            justify-content: space-between;
            align-items: center;
          ">
            <h2 style="margin: 0; color: white; font-size: 24px;">
              📊 Historial de Ventas
            </h2>
            <button id="btnCerrarConsulta" style="
              background: rgba(255, 255, 255, 0.2);
              color: white;
              border: none;
              padding: 8px 15px;
              border-radius: 8px;
              cursor: pointer;
              font-size: 18px;
              font-weight: bold;
              transition: all 0.3s ease;
            ">✖ Cerrar</button>
          </div>

          <!-- Filtros -->
          <div style="padding: 20px 30px; background: #f8f9fa; border-bottom: 1px solid #e0e0e0;">
            <div style="display: flex; gap: 15px; flex-wrap: wrap; align-items: center;">
              <div style="flex: 1; min-width: 200px;">
                <label style="display: block; font-weight: bold; margin-bottom: 5px; color: #333;">
                  Buscar por cliente:
                </label>
                <input type="text" id="filtroCliente" placeholder="Nombre del cliente..." style="
                  width: 100%;
                  padding: 10px;
                  border: 2px solid #ddd;
                  border-radius: 8px;
                  font-size: 14px;
                ">
              </div>
              <div style="flex: 1; min-width: 150px;">
                <label style="display: block; font-weight: bold; margin-bottom: 5px; color: #333;">
                  Fecha desde:
                </label>
                <input type="date" id="filtroFechaDesde" style="
                  width: 100%;
                  padding: 10px;
                  border: 2px solid #ddd;
                  border-radius: 8px;
                  font-size: 14px;
                ">
              </div>
              <div style="flex: 1; min-width: 150px;">
                <label style="display: block; font-weight: bold; margin-bottom: 5px; color: #333;">
                  Fecha hasta:
                </label>
                <input type="date" id="filtroFechaHasta" style="
                  width: 100%;
                  padding: 10px;
                  border: 2px solid #ddd;
                  border-radius: 8px;
                  font-size: 14px;
                ">
              </div>
              <div style="align-self: flex-end;">
                <button id="btnFiltrar" style="
                  padding: 10px 20px;
                  background: #667eea;
                  color: white;
                  border: none;
                  border-radius: 8px;
                  cursor: pointer;
                  font-weight: bold;
                  transition: all 0.3s ease;
                ">🔍 Filtrar</button>
              </div>
              <div style="align-self: flex-end;">
                <button id="btnLimpiarFiltros" style="
                  padding: 10px 20px;
                  background: #6c757d;
                  color: white;
                  border: none;
                  border-radius: 8px;
                  cursor: pointer;
                  font-weight: bold;
                  transition: all 0.3s ease;
                ">🔄 Limpiar</button>
              </div>
            </div>
          </div>

          <!-- Estadísticas -->
          <div id="estadisticasVentas" style="
            padding: 15px 30px;
            background: linear-gradient(to right, #e3f2fd, #f3e5f5);
            display: flex;
            justify-content: space-around;
            gap: 20px;
            flex-wrap: wrap;
          "></div>

          <!-- Tabla -->
          <div style="
            flex: 1;
            overflow-y: auto;
            padding: 20px 30px;
          ">
            <table id="tablaHistorialVentas" style="
              width: 100%;
              border-collapse: collapse;
              font-size: 14px;
            ">
              <thead>
                <tr style="background: #667eea; color: white;">
                  <th style="padding: 12px; text-align: left; border: 1px solid #ddd;">Folio</th>
                  <th style="padding: 12px; text-align: left; border: 1px solid #ddd;">Cliente</th>
                  <th style="padding: 12px; text-align: left; border: 1px solid #ddd;">Productos</th>
                  <th style="padding: 12px; text-align: center; border: 1px solid #ddd;">Fecha</th>
                  <th style="padding: 12px; text-align: right; border: 1px solid #ddd;">Total</th>
                  <th style="padding: 12px; text-align: center; border: 1px solid #ddd;">Tipo Pago</th>
                  <th style="padding: 12px; text-align: center; border: 1px solid #ddd;">Envío</th>
                  <th style="padding: 12px; text-align: center; border: 1px solid #ddd;">Acciones</th>
                </tr>
              </thead>
              <tbody id="bodyHistorialVentas">
                <tr>
                  <td colspan="8" style="text-align: center; padding: 40px; color: #999;">
                    Cargando ventas...
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    `;

    document.body.insertAdjacentHTML('beforeend', modalHTML);

    // Event listeners del modal
    document.getElementById("btnCerrarConsulta")?.addEventListener("click", () => {
      const modal = document.getElementById("modalConsultaVentas");
      if (modal) modal.style.display = "none";
    });

    document.getElementById("btnFiltrar")?.addEventListener("click", () => {
      cargarHistorialVentas();
    });

    document.getElementById("btnLimpiarFiltros")?.addEventListener("click", () => {
      (document.getElementById("filtroCliente") as HTMLInputElement).value = "";
      (document.getElementById("filtroFechaDesde") as HTMLInputElement).value = "";
      (document.getElementById("filtroFechaHasta") as HTMLInputElement).value = "";
      cargarHistorialVentas();
    });

    // Hover effects
    const btnCerrar = document.getElementById("btnCerrarConsulta");
    btnCerrar?.addEventListener("mouseenter", () => {
      (btnCerrar as HTMLElement).style.background = "rgba(255, 255, 255, 0.3)";
    });
    btnCerrar?.addEventListener("mouseleave", () => {
      (btnCerrar as HTMLElement).style.background = "rgba(255, 255, 255, 0.2)";
    });
  }

  function cargarHistorialVentas() {
    const bodyTabla = document.getElementById("bodyHistorialVentas");
    if (!bodyTabla) return;

    bodyTabla.innerHTML = '<tr><td colspan="8" style="text-align: center; padding: 40px; color: #999;">Cargando ventas...</td></tr>';

    fetch(`${API_URL}/ventas`)
      .then(res => res.ok ? res.text() : Promise.reject("Error de conexión"))
      .then(text => {
        const lineas = text.split("\n").map(l => l.trim()).filter(l => l);
        lineas.shift(); // Quitar encabezado

        if (lineas.length === 0) {
          bodyTabla.innerHTML = '<tr><td colspan="8" style="text-align: center; padding: 40px; color: #999;">No hay ventas registradas</td></tr>';
          return;
        }

        const ventasParsed = lineas.map(linea => {
          const partes = linea.match(/(?:[^,"]+|"[^"]*")+/g) || [];
          
          return {
            id: parseInt(partes[0]) || 0,
            clienteId: parseInt(partes[1]) || 0,
            nombreCliente: partes[2]?.replace(/"/g, '') || 'Desconocido',
            productosStr: partes[3]?.replace(/"/g, '') || '',
            fecha: partes[4] || '',
            total: parseFloat(partes[5]) || 0,
            tipoPago: partes[6]?.replace(/"/g, '') || 'Efectivo',
            envio: partes[7]?.replace(/"/g, '') || '-'
          };
        });

        // Aplicar filtros
        const filtroCliente = (document.getElementById("filtroCliente") as HTMLInputElement)?.value.toLowerCase() || "";
        const filtroFechaDesde = (document.getElementById("filtroFechaDesde") as HTMLInputElement)?.value || "";
        const filtroFechaHasta = (document.getElementById("filtroFechaHasta") as HTMLInputElement)?.value || "";

        let ventasFiltradas = ventasParsed.filter(venta => {
          const cumpleCliente = !filtroCliente || venta.nombreCliente.toLowerCase().includes(filtroCliente);
          const cumpleFechaDesde = !filtroFechaDesde || venta.fecha >= filtroFechaDesde;
          const cumpleFechaHasta = !filtroFechaHasta || venta.fecha <= filtroFechaHasta;
          return cumpleCliente && cumpleFechaDesde && cumpleFechaHasta;
        });

        // Mostrar estadísticas
        mostrarEstadisticas(ventasFiltradas);

        if (ventasFiltradas.length === 0) {
          bodyTabla.innerHTML = '<tr><td colspan="8" style="text-align: center; padding: 40px; color: #999;">No se encontraron ventas con los filtros aplicados</td></tr>';
          return;
        }

        bodyTabla.innerHTML = ventasFiltradas.map(venta => {
          let productosVenta = 'Sin productos';
          
          try {
            if (venta.productosStr && venta.productosStr.trim()) {
              const items = venta.productosStr.split('|');
              const productosHTML = items.map(prod => {
                const partes = prod.split(':');
                if (partes.length >= 2) {
                  const idProd = parseInt(partes[0]);
                  const cantidad = partes[1];
                  const precioUnit = partes[2] ? parseFloat(partes[2]) : 0;
                  
                  // Buscar el producto en el array global
                  const productoEncontrado = productos.find(p => p.id === idProd);
                  
                  if (productoEncontrado) {
                    return `<div style="margin: 2px 0; padding: 3px 0; border-bottom: 1px dashed #e0e0e0;">
                      <strong>${productoEncontrado.nombre}</strong> 
                      <span style="color: #666; font-size: 12px;">(${cantidad} × ${precioUnit.toFixed(2)})</span>
                    </div>`;
                  } else {
                    return `<div style="margin: 2px 0; color: #999;">
                      Producto #${idProd} (${cantidad} unid.)
                    </div>`;
                  }
                }
                return '';
              }).filter(x => x).join('');
              
              productosVenta = productosHTML || 'Error al cargar productos';
            }
          } catch (e) {
            console.error('Error parseando productos:', e, venta.productosStr);
            productosVenta = `<span style="color: #f44336;">Error al parsear</span>`;
          }

          const tieneEnvio = venta.envio && venta.envio !== '-';

          return `
            <tr style="border-bottom: 1px solid #e0e0e0; transition: background 0.2s;" 
                onmouseenter="this.style.background='#f5f5f5'" 
                onmouseleave="this.style.background='white'">
              <td style="padding: 12px; border: 1px solid #ddd;"><strong>#${venta.id}</strong></td>
              <td style="padding: 12px; border: 1px solid #ddd;">${venta.nombreCliente}</td>
              <td style="padding: 12px; border: 1px solid #ddd; font-size: 12px;">${productos}</td>
              <td style="padding: 12px; border: 1px solid #ddd; text-align: center;">${formatearFechaLegible(venta.fecha)}</td>
              <td style="padding: 12px; border: 1px solid #ddd; text-align: right; font-weight: bold; color: #4caf50;">${venta.total.toFixed(2)}</td>
              <td style="padding: 12px; border: 1px solid #ddd; text-align: center;">
                <span style="background: ${venta.tipoPago === 'Efectivo' ? '#4caf50' : venta.tipoPago === 'Tarjeta' ? '#2196f3' : '#ff9800'}; 
                             color: white; padding: 4px 10px; border-radius: 12px; font-size: 12px;">
                  ${venta.tipoPago}
                </span>
              </td>
              <td style="padding: 12px; border: 1px solid #ddd; text-align: center;">
                ${tieneEnvio ? '📦 Sí' : '❌ No'}
              </td>
              <td style="padding: 12px; border: 1px solid #ddd; text-align: center;">
                <button onclick="verDetalleVenta(${venta.id})" style="
                  background: #667eea;
                  color: white;
                  border: none;
                  padding: 6px 12px;
                  border-radius: 6px;
                  cursor: pointer;
                  font-size: 12px;
                  transition: all 0.3s ease;
                ">👁️ Ver</button>
              </td>
            </tr>
          `;
        }).join("");
      })
      .catch(err => {
        bodyTabla.innerHTML = `<tr><td colspan="8" style="text-align: center; padding: 40px; color: #f44336;">Error al cargar ventas: ${err}</td></tr>`;
      });
  }

  function mostrarEstadisticas(ventas: any[]) {
    const estadisticas = document.getElementById("estadisticasVentas");
    if (!estadisticas) return;

    const totalVentas = ventas.length;
    const montoTotal = ventas.reduce((sum, v) => sum + v.total, 0);
    const ventasEfectivo = ventas.filter(v => v.tipoPago === 'Efectivo').length;
    const ventasConEnvio = ventas.filter(v => v.envio && v.envio !== '-').length;

    estadisticas.innerHTML = `
      <div style="text-align: center; flex: 1; min-width: 150px;">
        <div style="font-size: 28px; font-weight: bold; color: #667eea;">${totalVentas}</div>
        <div style="font-size: 14px; color: #666; margin-top: 5px;">Total Ventas</div>
      </div>
      <div style="text-align: center; flex: 1; min-width: 150px;">
        <div style="font-size: 28px; font-weight: bold; color: #4caf50;">${montoTotal.toFixed(2)}</div>
        <div style="font-size: 14px; color: #666; margin-top: 5px;">Monto Total</div>
      </div>
      <div style="text-align: center; flex: 1; min-width: 150px;">
        <div style="font-size: 28px; font-weight: bold; color: #ff9800;">${ventasEfectivo}</div>
        <div style="font-size: 14px; color: #666; margin-top: 5px;">Efectivo</div>
      </div>
      <div style="text-align: center; flex: 1; min-width: 150px;">
        <div style="font-size: 28px; font-weight: bold; color: #2196f3;">${ventasConEnvio}</div>
        <div style="font-size: 14px; color: #666; margin-top: 5px;">Con Envío</div>
      </div>
    `;
  }

  (window as any).verDetalleVenta = (idVenta: number) => {
    alert(`Función en desarrollo: Ver detalle de venta #${idVenta}`);
    // Aquí puedes implementar un modal con el detalle completo de la venta
  };

  function formatearFechaLegible(fecha: string): string {
    if (!fecha) return "N/A";
    try {
      const [year, month, day] = fecha.split("-");
      return `${day}/${month}/${year}`;
    } catch {
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

    elementos.cartBody.innerHTML = carritoActual.map((item, index) => {
      const producto = productos.find(p => p.id === item.productoId);
      return `
        <tr>
          <td>${index + 1}</td>
          <td>
            <strong>${producto?.nombre || "Desconocido"}</strong><br>
            <small style="color:#666;">${producto?.marca || ""}</small>
          </td>
          <td>${item.cantidad}</td>
          <td>$${item.precioUnitario.toFixed(2)}</td>
          <td><strong>$${item.subtotal.toFixed(2)}</strong></td>
          <td>
            <button onclick="eliminarItem(${index})" class="btn-remove" style="background:#f44336; color:white; border:none; padding:4px 8px; border-radius:4px; cursor:pointer;">
              ✖ Quitar
            </button>
          </td>
        </tr>
      `;
    }).join("");
  }

  (window as any).eliminarItem = (index: number) => {
    if (confirm("¿Desea quitar este producto del carrito?")) {
      carritoActual.splice(index, 1);
      mostrarCarrito();
      actualizarResumen();
    }
  };

  function actualizarResumen() {
    const subtotal = carritoActual.reduce((sum, item) => sum + item.subtotal, 0);
    const iva = subtotal * 0.16;
    const total = subtotal + iva;
    const totalArticulos = carritoActual.reduce((sum, item) => sum + item.cantidad, 0);

    elementos.subtotal.textContent = `$${subtotal.toFixed(2)}`;
    elementos.iva.textContent = `$${iva.toFixed(2)}`;
    elementos.total.textContent = `$${total.toFixed(2)}`;
    elementos.totalArticulos.textContent = totalArticulos.toString();

    elementos.btnFinalizar.disabled = carritoActual.length === 0 || !clienteSeleccionado;
  }

  function finalizarVenta() {
    const cliente = clientes.find(c => c.id === clienteSeleccionado);
    const subtotal = carritoActual.reduce((sum, item) => sum + item.subtotal, 0);
    const iva = subtotal * 0.16;
    const total = subtotal + iva;

    let envio: DireccionEnvio | undefined;
    if (requiereEnvio) {
      envio = {
        calle: (document.getElementById("inputCalle") as HTMLInputElement).value,
        numero: (document.getElementById("inputNumero") as HTMLInputElement).value,
        colonia: (document.getElementById("inputColonia") as HTMLInputElement).value,
        codigoPostal: (document.getElementById("inputCP") as HTMLInputElement).value,
        ciudad: (document.getElementById("inputCiudad") as HTMLInputElement).value,
        referencias: (document.getElementById("inputReferencias") as HTMLTextAreaElement).value
      };
    }

    const datosVenta = {
      clienteId: clienteSeleccionado!,
      nombreCliente: cliente?.nombre || "Desconocido",
      items: carritoActual.map(item => ({
        productoId: item.productoId,
        cantidad: item.cantidad,
        precioUnitario: item.precioUnitario,
        subtotal: item.subtotal
      })),
      fecha: new Date().toISOString().split('T')[0],
      total: parseFloat(total.toFixed(2)),
      tipoPago: elementos.selectMetodo.value,
      envio: envio
    };

    fetch(`${API_URL}/ventas/guardar`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(datosVenta)
    })
      .then(res => {
        if (!res.ok) throw new Error(`Error del servidor: ${res.status}`);
        return res.json();
      })
      .then(data => {
        alert(`Venta registrada exitosamente\nFolio: ${data.id}\nTotal: $${total.toFixed(2)}\nMétodo: ${datosVenta.tipoPago}`);
        cancelarVenta();
      })
      .catch(err => {
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
    (document.getElementById("inputCalle") as HTMLInputElement).value = "";
    (document.getElementById("inputNumero") as HTMLInputElement).value = "";
    (document.getElementById("inputColonia") as HTMLInputElement).value = "";
    (document.getElementById("inputCP") as HTMLInputElement).value = "";
    (document.getElementById("inputCiudad") as HTMLInputElement).value = "";
    (document.getElementById("inputReferencias") as HTMLTextAreaElement).value = "";
    
    mostrarCarrito();
    actualizarResumen();
  }

  // Inicializar resumen
  actualizarResumen();
});