const store = {
    shoppingCart: [],  
    productList: []    
};
async function startWebsite() {
    try {
        const response = await fetch('https://fakestoreapi.in/api/products');
        const data = await response.json();
        store.productList = data.products;

        showProducts();
    } catch (error) {
        console.error('Oops! Could not load products:', error);
        showErrorMessage();
    }
}
function showErrorMessage() {
    const productArea = document.getElementById('productGrid');
    productArea.innerHTML = `
        <div class="col-12 text-center">
            <div class="alert alert-danger">
                <i class="fas fa-exclamation-circle me-2"></i>
                Sorry! We couldn't load the products. Please try again later.
            </div>
        </div>
    `;
}
function showProducts() {
    const productArea = document.getElementById('productGrid');
    productArea.innerHTML = store.productList.map(product => {
        const safeTitle = product.title.replace(/['"]/g, '');
        
        return `
            <div class="col-lg-3 col-md-6">
                <div class="card product-card h-100">
                    <div class="card-badge">
                        <span class="badge bg-primary">New!</span>
                    </div>
                    <img src="${product.image}" class="card-img-top p-3" alt="${safeTitle}">
                    <div class="card-body d-flex flex-column">
                        <h5 class="card-title">${safeTitle}</h5>
                        <p class="card-text flex-grow-1">${product.description.slice(0, 100)}...</p>
                        <div class="d-flex justify-content-between align-items-center mt-3">
                            <span class="price-tag">$${product.price}</span>
                            <button class="btn btn-primary" 
                                onclick="addToCart(${product.id}, '${safeTitle}', ${product.price}, '${product.image}')">
                                <i class="fas fa-cart-plus me-2"></i>Add to Cart
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }).join('');
}

function addToCart(productId, title, price, image) {
    const existingItem = store.shoppingCart.find(item => item.id === productId);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        store.shoppingCart.push({
            id: productId,
            title,
            price,
            image,
            quantity: 1
        });
    }
    
    updateCartDisplay();
    showSuccessMessage();
}

function updateCartDisplay() {
    updateCartItems();        
    updateCartSummary();      
    updateCartBadge();        
}


function updateCartItems() {
    const cartArea = document.getElementById('cartItems');
    
    if (store.shoppingCart.length === 0) {
        cartArea.innerHTML = `
            <div class="text-center p-4">
                <i class="fas fa-shopping-cart fa-3x mb-3"></i>
                <p>Your cart is empty</p>
            </div>
        `;
        return;
    }
    
    cartArea.innerHTML = store.shoppingCart.map(item => `
        <div class="cart-item">
            <img src="${item.image}" alt="${item.title}">
            <div class="cart-item-details">
                <div class="cart-item-title">${item.title}</div>
                <div class="cart-item-price">$${(item.price * item.quantity).toFixed(2)}</div>
                <div class="cart-item-actions">
                    <button class="btn-quantity" onclick="changeQuantity(${item.id}, 'decrease')">
                        <i class="fas fa-minus"></i>
                    </button>
                    <span>${item.quantity}</span>
                    <button class="btn-quantity" onclick="changeQuantity(${item.id}, 'increase')">
                        <i class="fas fa-plus"></i>
                    </button>
                    <button class="btn-remove" onclick="removeFromCart(${item.id})">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>
        </div>
    `).join('');
}

function updateCartSummary() {
    const subtotal = store.shoppingCart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const tax = subtotal * 0.1;
    const total = subtotal + tax;
    const itemCount = store.shoppingCart.reduce((sum, item) => sum + item.quantity, 0);

    document.getElementById('subtotalPrice').textContent = subtotal.toFixed(2);
    document.getElementById('vat').textContent = tax.toFixed(2);
    document.getElementById('total').textContent = total.toFixed(2);
    document.getElementById('itemCount').textContent = itemCount;
}

function updateCartBadge() {
    const itemCount = store.shoppingCart.reduce((sum, item) => sum + item.quantity, 0);
    const badge = document.getElementById('cartBadge');
    badge.textContent = itemCount;
    badge.style.display = itemCount > 0 ? 'block' : 'none';
}

function changeQuantity(productId, action) {
    const item = store.shoppingCart.find(item => item.id === productId);
    if (!item) return;

    if (action === 'increase') {
        item.quantity += 1;
    } else if (action === 'decrease' && item.quantity > 1) {
        item.quantity -= 1;
    }

    updateCartDisplay();
}

function removeFromCart(productId) {
    store.shoppingCart = store.shoppingCart.filter(item => item.id !== productId);
    updateCartDisplay();
}

function toggleCart() {
    const sidebar = document.getElementById('cartSidebar');
    sidebar.classList.toggle('open');
}

function closeCart() {
    document.getElementById('cartSidebar').classList.remove('open');
}

function showSuccessMessage() {
    const toast = new bootstrap.Toast(document.getElementById('toast'));
    toast.show();
}

function checkout() {
    if (store.shoppingCart.length === 0) {
        alert('Please add items to your cart before checking out.');
        return;
    }
    
    const total = store.shoppingCart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const finalTotal = (total * 1.1).toFixed(2);
    alert(`Thank you for shopping! Your total is: $${finalTotal}`);
}

document.addEventListener('DOMContentLoaded', startWebsite);