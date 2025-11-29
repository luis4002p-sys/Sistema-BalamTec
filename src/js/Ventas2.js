// Estado de la aplicación
const state = {
    cart: [],
    clientes: [
        { id: 1, nombre: 'Juan Pérez García' },
        { id: 2, nombre: 'María López Sánchez' },
        { id: 3, nombre: 'Carlos Rodríguez Martínez' },
        { id: 4, nombre: 'Ana González Hernández' }
    ],
    productos: [
        { id: 1, nombre: 'Monitor LG 27" 4K', precio: 8999 },
        { id: 2, nombre: 'Laptop Dell Inspiron 15', precio: 15999 },
        { id: 3, nombre: 'Teclado Mecánico Logitech', precio: 2499 },
        { id: 4, nombre: 'Mouse Inalámbrico HP', precio: 599 },
        { id: 5, nombre: 'Webcam Logitech C920', precio: 1899 }
    ],
    clienteSeleccionado: null,
    metodoSeleccionado: null,
    requiereEnvio: false
};

// Referencias al DOM
const elements = {
    selectCliente: document.getElementById('selectCliente'),
    selectMetodo: document.getElementById('selectMetodo'),
    selectProducto: document.getElementById('selectProducto'),
    inputCantidad: document.getElementById('inputCantidad'),
    btnAgregar: document.getElementById('btnAgregar'),
    cartBody: document.getElementById('cartBody'),
    checkEnvio: document.getElementById('checkEnvio'),
    deliverySection: document.getElementById('deliverySection'),
    deliveryForm: document.getElementById('deliveryForm'),
    subtotal: document.getElementById('subtotal'),
    iva: document.getElementById('iva'),
    total: document.getElementById('total'),
    totalArticulos: document.getElementById('totalArticulos'),
    clienteSeleccionado: document.getElementById('clienteSeleccionado'),
    estadoEnvio: document.getElementById('estadoEnvio'),
    btnFinalizar: document.getElementById('btnFinalizar'),
    btnCancelar: document.getElementById('btnCancelar')
};

// Inicialización
function init() {
    cargarClientes();
    cargarProductos();
    attachEventListeners();
    updateSummary();
}

// Cargar clientes en el select
function cargarClientes() {
    state.clientes.forEach(cliente => {
        const option = document.createElement('option');
        option.value = cliente.id;
        option.textContent = cliente.nombre;
        elements.selectCliente.appendChild(option);
    });
}

// Cargar productos en el select
function cargarProductos() {
    state.productos.forEach(producto => {
        const option = document.createElement('option');
        option.value = producto.id;
        option.textContent = `${producto.nombre} - $${formatNumber(producto.precio)}`;
        elements.selectProducto.appendChild(option);
    });
}

// Event Listeners
function attachEventListeners() {
    elements.selectCliente.addEventListener('change', handleClienteChange);
    elements.selectMetodo.addEventListener('change', handleMetodoChange);
    elements.btnAgregar.addEventListener('click', handleAgregarProducto);
    elements.checkEnvio.addEventListener('change', handleEnvioChange);
    elements.btnFinalizar.addEventListener('click', handleFinalizarVenta);
    elements.btnCancelar.addEventListener('click', handleCancelarVenta);
}

// Manejadores de eventos
function handleClienteChange(e) {
    const clienteId = parseInt(e.target.value);
    state.clienteSeleccionado = state.clientes.find(c => c.id === clienteId);
    updateSummary();
}

function handleMetodoChange(e) {
    state.metodoSeleccionado = e.target.value;
}

function handleAgregarProducto() {
    const productoId = parseInt(elements.selectProducto.value);
    const cantidad = parseInt(elements.inputCantidad.value);

    if (!productoId || !cantidad || cantidad < 1) {
        alert('Por favor seleccione un producto y cantidad válida');
        return;
    }

    const producto = state.productos.find(p => p.id === productoId);
    
    // Verificar si el producto ya está en el carrito
    const itemExistente = state.cart.find(item => item.producto.id === productoId);
    
    if (itemExistente) {
        itemExistente.cantidad += cantidad;
    } else {
        state.cart.push({
            producto: producto,
            cantidad: cantidad
        });
    }

    // Resetear selección
    elements.selectProducto.value = '';
    elements.inputCantidad.value = 1;

    renderCart();
    updateSummary();
    checkIfShowDelivery();
}

function handleEnvioChange(e) {
    state.requiereEnvio = e.target.checked;

    // Mostrar/ocultar sección de envío SOLO si el checkbox está marcado
    elements.deliverySection.style.display = state.requiereEnvio ? 'block' : 'none';
    elements.deliveryForm.style.display = state.requiereEnvio ? 'block' : 'none';

    updateSummary();
}

function handleEliminarItem(index) {
    if (confirm('¿Desea eliminar este producto del carrito?')) {
        state.cart.splice(index, 1);
        renderCart();
        updateSummary();
        checkIfShowDelivery();
    }
}

function handleFinalizarVenta() {
    if (!state.clienteSeleccionado) {
        alert('Por favor seleccione un cliente');
        return;
    }

    if (!state.metodoSeleccionado) {
        alert('Por favor seleccione un método de pago');
        return;
    }

    if (state.cart.length === 0) {
        alert('El carrito está vacío');
        return;
    }

    if (state.requiereEnvio) {
        const calle = document.getElementById('inputCalle').value;
        const numero = document.getElementById('inputNumero').value;
        const colonia = document.getElementById('inputColonia').value;
        const cp = document.getElementById('inputCP').value;
        const ciudad = document.getElementById('inputCiudad').value;

        if (!calle || !numero || !colonia || !cp || !ciudad) {
            alert('Por favor complete todos los campos de dirección');
            return;
        }
    }

    // Calcular totales
    const subtotal = calcularSubtotal();
    const iva = calcularIVA(subtotal);
    const total = subtotal + iva;

    const venta = {
        cliente: state.clienteSeleccionado,
        metodo: state.metodoSeleccionado,
        items: state.cart,
        subtotal: subtotal,
        iva: iva,
        total: total,
        requiereEnvio: state.requiereEnvio,
        fecha: new Date().toLocaleString('es-MX')
    };

    console.log('Venta finalizada:', venta);
    alert(`¡Venta finalizada con éxito!\n\nTotal: $${formatNumber(total)}\nCliente: ${state.clienteSeleccionado.nombre}`);
    
    // Resetear todo
    resetearVenta();
}

function handleCancelarVenta() {
    if (state.cart.length > 0 || state.clienteSeleccionado || state.metodoSeleccionado) {
        if (confirm('¿Está seguro de cancelar la venta? Se perderá toda la información.')) {
            resetearVenta();
        }
    }
}

// Renderizado del carrito
function renderCart() {
    if (state.cart.length === 0) {
        elements.cartBody.innerHTML = '<tr><td colspan="6" class="empty-cart">No hay productos agregados</td></tr>';
        return;
    }

    elements.cartBody.innerHTML = state.cart.map((item, index) => {
        const subtotal = item.producto.precio * item.cantidad;
        return `
            <tr>
                <td>${index + 1}</td>
                <td>${item.producto.nombre}</td>
                <td>${item.cantidad}</td>
                <td>$${formatNumber(item.producto.precio)}</td>
                <td>$${formatNumber(subtotal)}</td>
                <td>
                    <button class="btn-delete" onclick="handleEliminarItem(${index})">
                        🗑️ Eliminar
                    </button>
                </td>
            </tr>
        `;
    }).join('');
}

// Cálculos
function calcularSubtotal() {
    return state.cart.reduce((sum, item) => {
        return sum + (item.producto.precio * item.cantidad);
    }, 0);
}

function calcularIVA(subtotal) {
    return subtotal * 0.16;
}

// Actualizar resumen
function updateSummary() {
    const subtotal = calcularSubtotal();
    const iva = calcularIVA(subtotal);
    const total = subtotal + iva;
    const totalArticulos = state.cart.reduce((sum, item) => sum + item.cantidad, 0);

    elements.subtotal.textContent = `$${formatNumber(subtotal)}`;
    elements.iva.textContent = `$${formatNumber(iva)}`;
    elements.total.textContent = `$${formatNumber(total)}`;
    elements.totalArticulos.textContent = totalArticulos;
    elements.clienteSeleccionado.textContent = state.clienteSeleccionado 
        ? state.clienteSeleccionado.nombre 
        : 'No seleccionado';
    elements.estadoEnvio.textContent = state.requiereEnvio ? 'Sí' : 'No';

    // Habilitar/deshabilitar botón finalizar
    elements.btnFinalizar.disabled = !(
        state.clienteSeleccionado &&
        state.metodoSeleccionado &&
        state.cart.length > 0
    );
}

// Resetear venta
function resetearVenta() {
    state.cart = [];
    state.clienteSeleccionado = null;
    state.metodoSeleccionado = null;
    state.requiereEnvio = false;

    elements.selectCliente.value = '';
    elements.selectMetodo.value = '';
    elements.selectProducto.value = '';
    elements.inputCantidad.value = 1;
    elements.checkEnvio.checked = false;

    elements.deliveryForm.style.display = 'none';
    elements.deliverySection.style.display = 'none';

    // Limpiar campos de dirección
    document.getElementById('inputCalle').value = '';
    document.getElementById('inputNumero').value = '';
    document.getElementById('inputColonia').value = '';
    document.getElementById('inputCP').value = '';
    document.getElementById('inputCiudad').value = '';
    document.getElementById('inputReferencias').value = '';

    renderCart();
    updateSummary();
}

function checkIfShowDelivery() {
    // Mostrar solo la sección (checkbox) si hay productos
    elements.deliverySection.style.display = state.cart.length > 0 ? 'block' : 'none';

    // El formulario solo aparece si el checkbox está marcado
    elements.deliveryForm.style.display = state.requiereEnvio ? 'block' : 'none';
}

// Utilidades
function formatNumber(num) {
    return num.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

// Hacer disponible globalmente para onclick
window.handleEliminarItem = handleEliminarItem;

// Iniciar aplicación
init();
