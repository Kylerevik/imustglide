/* ============================================
   CART.JS - Shopping Cart Logic
   ============================================ */

const Cart = {
    items: JSON.parse(localStorage.getItem('imustglide_cart') || '[]'),

    save() {
        localStorage.setItem('imustglide_cart', JSON.stringify(this.items));
    },

    add(item) {
        // Max 3 unique item types, max 10 qty per item
        const MAX_TYPES = 3;
        const MAX_QTY   = 10;

        const existing = this.items.find(i => i.name === item.name && i.server === item.server);

        if (!existing && this.items.length >= MAX_TYPES) {
            showCartLimitToast('max-types');
            return;
        }

        if (existing) {
            const newQty = existing.qty + item.qty;
            if (newQty > MAX_QTY) {
                showCartLimitToast('max-qty');
                existing.qty = MAX_QTY;
            } else {
                existing.qty = newQty;
            }
        } else {
            this.items.push({ ...item, qty: Math.min(item.qty, MAX_QTY) });
        }

        this.save();
        this.updateBadge();
        this.renderDropdown();
        showCartToast();
    },

    remove(index) {
        this.items.splice(index, 1);
        this.save();
        this.updateBadge();
        this.renderDropdown();
        if (this.items.length === 0) {
            const dropdown = document.getElementById('cartDropdown');
            if (dropdown) dropdown.classList.remove('open');
        }
    },

    total() {
        return this.items.reduce((sum, i) => {
            const p = parseFloat(i.price.replace('€','').replace(',','.'));
            return sum + p * i.qty;
        }, 0);
    },

    count() {
        return this.items.reduce((sum, i) => sum + i.qty, 0);
    },

    updateBadge() {
        const badge = document.getElementById('cartBadge');
        const cartBtn = document.querySelector('.cart-nav-btn');
        const cnt = this.count();
        if (badge) {
            badge.textContent = cnt;
            badge.style.display = cnt > 0 ? 'flex' : 'none';
        }
        if (cartBtn) {
            cartBtn.style.display = cnt > 0 ? 'flex' : 'none';
        }
    },

    renderDropdown() {
        const list = document.getElementById('cartItemsList');
        const totalEl = document.getElementById('cartTotal');
        if (!list) return;

        if (this.items.length === 0) {
            list.innerHTML = '<p class="cart-empty">Your cart is empty.</p>';
        } else {
            list.innerHTML = this.items.map((item, idx) => `
                <div class="cart-item">
                    <img src="pics/${item.icon}" alt="${item.name}" class="cart-item-icon">
                    <div class="cart-item-info">
                        <div class="cart-item-name">${item.qty}x ${item.name} LoL Smurf Account ${item.server}</div>
                        <div class="cart-item-price">${item.price}EUR</div>
                    </div>
                    <button class="cart-item-remove" onclick="event.stopPropagation(); Cart.remove(${idx})">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/></svg>
                    </button>
                </div>
            `).join('');
        }

        if (totalEl) totalEl.textContent = '€' + this.total().toFixed(2) + 'EUR';
    }
};

// Toast notification
function showCartLimitToast(type) {
    const toast = document.getElementById('cartToast');
    if (!toast) return;
    const text = toast.querySelector('.cart-toast-text');
    const msg = type === 'max-qty'
        ? 'Max 10 of the same item!'
        : 'Max 3 different items in cart!';
    if (text) text.textContent = msg;
    toast.classList.remove('show');
    void toast.offsetWidth;
    toast.classList.add('show');
    // Change color to indicate error
    toast.style.borderColor = 'rgba(239,68,68,0.6)';
    toast.style.borderBottomColor = '#ef4444';
    clearTimeout(toast._hideTimer);
    toast._hideTimer = setTimeout(() => {
        toast.classList.remove('show');
        toast.style.borderColor = '';
        toast.style.borderBottomColor = '';
        if (text) text.textContent = 'Added to Cart!';
    }, 3000);
}

function showCartToast() {
    const toast = document.getElementById('cartToast');
    if (!toast) return;
    // Restart animation by removing and re-adding class
    toast.classList.remove('show');
    void toast.offsetWidth; // force reflow
    toast.classList.add('show');
    clearTimeout(toast._hideTimer);
    toast._hideTimer = setTimeout(() => toast.classList.remove('show'), 3000);
}

// Toggle cart dropdown
function toggleCart(e) {
    e.stopPropagation();
    const dropdown = document.getElementById('cartDropdown');
    if (!dropdown) return;
    const isOpen = dropdown.classList.contains('open');
    dropdown.classList.toggle('open', !isOpen);
    if (!isOpen) Cart.renderDropdown();
}

// Close cart on outside click
document.addEventListener('click', function(e) {
    const wrapper = document.getElementById('cartWrapper');
    if (wrapper && !wrapper.contains(e.target)) {
        const dropdown = document.getElementById('cartDropdown');
        if (dropdown) dropdown.classList.remove('open');
    }
});

// Init on load
document.addEventListener('DOMContentLoaded', function() {
    Cart.updateBadge();
    Cart.renderDropdown();
});