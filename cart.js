// --- Lógica de Carrito de Compras (DannCam K-Beauty) ---

let cart = []; // Array global que guarda el carrito

// Función para inicializar el carrito leyendo Local Storage
function loadCart() {
    const storedCart = localStorage.getItem('dan_cart');
    if (storedCart) {
        cart = JSON.parse(storedCart);
    }
}

// Función para guardar el carrito en Local Storage
function saveCart() {
    localStorage.setItem('dan_cart', JSON.stringify(cart));
}

// ----------------------------------------------------
// 1. FUNCIONALIDAD DEL CATÁLOGO (AÑADIR)
// ----------------------------------------------------

function addToCart(event) {
    event.preventDefault(); 
    
    // Obtenemos los datos del producto desde los atributos data-
    const productItem = event.target.closest('.product-item');
    
    // Si no encontramos el contenedor del producto, salimos
    if (!productItem) return;

    const productId = productItem.dataset.id;
    const productName = productItem.dataset.name;
    const productPrice = parseFloat(productItem.dataset.price);

    // Buscar si el producto ya existe
    const existingItem = cart.find(item => item.id === productId);

    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            id: productId,
            name: productName,
            price: productPrice,
            quantity: 1
        });
    }

    saveCart();
    alert(`${productName} añadido al carrito.`);
    
    // Opcional: Actualizar un contador visual del carrito si lo tuviéramos en el header
    // updateCartCounter(); 
}

// ----------------------------------------------------
// 2. FUNCIONALIDAD DEL CHECKOUT (RENDERIZAR, CALCULAR Y ELIMINAR)
// ----------------------------------------------------

// Función para eliminar un producto del carrito
function removeItem(productId) {
    // Filtramos el array, manteniendo solo los productos que NO coincidan con el ID
    const initialLength = cart.length;
    cart = cart.filter(item => item.id !== productId);
    
    if (cart.length < initialLength) {
        saveCart();
        renderCheckoutSummary(); // Volvemos a dibujar la lista
    }
}

// Función principal para dibujar la lista de productos y los totales en el checkout
function renderCheckoutSummary() {
    const listElement = document.querySelector('.order-summary-list');
    
    // Si no estamos en la página de checkout o falta el elemento, salimos
    if (!listElement) return;

    listElement.innerHTML = ''; // Limpiamos el contenido anterior

    let subtotal = 0;
    const shippingCost = 9.99;
    const discountRate = 0.15; // 15%

    // 2.1. Generar elementos del carrito
    cart.forEach(item => {
        const itemTotal = item.price * item.quantity;
        subtotal += itemTotal;

        // Crear el HTML para cada producto
        const listItem = document.createElement('li');
        listItem.classList.add('list-group-item', 'd-flex', 'justify-content-between', 'align-items-center', 'lh-sm');
        listItem.innerHTML = `
            <div class="d-flex align-items-center w-75">
                <div class="me-2">
                    <h6 class="my-0">${item.name} (x${item.quantity})</h6>
                    <small class="text-muted">ID: ${item.id}</small>
                </div>
                <button type="button" class="btn-close btn-sm delete-item-btn" 
                        data-product-id="${item.id}" aria-label="Eliminar producto"></button>
            </div>
            <span class="text-muted">$${itemTotal.toFixed(2)}</span>
        `;
        listElement.appendChild(listItem);
    });

    // 2.2. Cálculo de descuentos y totales
    let discount = subtotal * discountRate;
    let totalBeforeShipping = subtotal - discount;
    let finalTotal = totalBeforeShipping + shippingCost;
    
    // Nota: Los descuentos en el HTML estático eran de $18.50, pero aquí usamos 15% de descuento sobre el subtotal dinámico

    // 2.3. Añadir el descuento (estático, si no hay un cupón dinámico)
    const discountItem = document.createElement('li');
    discountItem.classList.add('list-group-item', 'd-flex', 'justify-content-between', 'bg-light');
    discountItem.innerHTML = `
        <div class="text-success">
            <h6 class="my-0">Código de Descuento (15%)</h6>
            <small>CUPON15</small>
        </div>
        <span class="text-success">−$${discount.toFixed(2)}</span>
    `;
    listElement.appendChild(discountItem);

    // 2.4. Añadir costo de envío
    const shippingItem = document.createElement('li');
    shippingItem.classList.add('list-group-item', 'd-flex', 'justify-content-between');
    shippingItem.innerHTML = `
        <span>Costo de Envío</span>
        <strong>$${shippingCost.toFixed(2)}</strong>
    `;
    listElement.appendChild(shippingItem);
    
    // 2.5. Añadir total final
    const totalItem = document.createElement('li');
    totalItem.classList.add('list-group-item', 'd-flex', 'justify-content-between', 'checkout-total-line');
    totalItem.innerHTML = `
        <span>TOTAL (USD)</span>
        <strong>$${finalTotal.toFixed(2)}</strong>
    `;
    listElement.appendChild(totalItem);

    // 2.6. Asignar eventos de eliminación a los nuevos botones
    document.querySelectorAll('.delete-item-btn').forEach(button => {
        button.addEventListener('click', (e) => {
            const deleteId = e.target.dataset.productId;
            removeItem(deleteId);
        });
    });

    // 2.7. Actualizar el botón de pago con el total (si existe)
    const payButton = document.querySelector('.checkout-form .primary-btn');
    if (payButton) {
         payButton.textContent = `Pagar Ahora ($${finalTotal.toFixed(2)})`;
    }
}

// ----------------------------------------------------
// 3. INICIALIZACIÓN DE EVENTOS
// ----------------------------------------------------

document.addEventListener('DOMContentLoaded', () => {
    loadCart();

    // Asignar el evento 'click' a los botones "Añadir al Carrito" en Catálogo/Index
    document.querySelectorAll('.add-to-cart-btn').forEach(button => {
        button.addEventListener('click', addToCart);
    });

    // Si estamos en la página de checkout, renderizamos el resumen
    const checkoutList = document.querySelector('.order-summary-list');
    if (checkoutList) {
        renderCheckoutSummary();
    }
    
    // Lógica para el botón "Vaciar Carrito y Volver al Catálogo" (Vacía Local Storage)
    const emptyCartButton = document.querySelector('.btn-outline-danger');
    if (emptyCartButton) {
        emptyCartButton.addEventListener('click', () => {
            if (confirm('¿Estás seguro de que quieres vaciar el carrito?')) {
                cart = []; // Limpia el array JS
                saveCart(); // Guarda el carrito vacío
                // El enlace ya nos lleva a catalogo.html, por lo que no hace falta más acción aquí.
            }
        });
    }

});