/* ============================================
   CHECKOUT.JS - Stripe Integration
   ============================================ */

const STRIPE_PK      = 'pk_test_51TOpkAFUWwbZNdt25iCXJXOPmrmS8xZWOIaRWYKImJI7son6MWIYPor9NzmNwLo3NOM15ZL5aYYBdNbaJWQbv9RY000lGLuDFf';
const PROCESSING_FEE = 0.029;
const LOOT_MULTIPLIER = 100;

let stripe         = null;
let cardElement    = null;
let selectedMethod = 'stripe';
let couponDiscount = 0;
let couponCode     = '';
let boostCheckoutMode = false;
let boostPrice     = 0;
let userLoggedIn   = false;
let userCredits    = 0;
let userEmail      = '';

const COUPONS = {
    'GLIDE20':   0.20,
    'WELCOME10': 0.10,
    'VIP15':     0.15,
};

function renderCheckout() {
    const urlParams = new URLSearchParams(window.location.search);
    const mode      = urlParams.get('mode'); // 'boost', 'coaching', vagy null (cart)
    const isService = mode === 'boost' || mode === 'coaching';
    const boostItem = isService
        ? JSON.parse(localStorage.getItem('imustglide_boost_checkout') || 'null')
        : null;
    const box = document.getElementById('checkoutItemsBox');
    if (!box) return;

    if (isService && boostItem) {
        const priceStr = boostItem.price || '€0.00';
        boostCheckoutMode = true;
        boostPrice = parseFloat(priceStr.replace(/[^0-9.,]/g, '').replace(',','.')) || 0;
        box.innerHTML = `
            <div class="checkout-item">
                <img src="pics/${boostItem.icon}" alt="${boostItem.name}" class="checkout-item-icon">
                <div class="checkout-item-info">
                    <div class="checkout-item-name">1x ${boostItem.name}</div>
                    <div class="checkout-item-meta">
                        <span class="checkout-item-price">${priceStr}</span>
                        <span class="checkout-item-status">· Available</span>
                    </div>
                    <div class="checkout-item-detail">${boostItem.detail || ''}</div>
                </div>
            </div>`;
    } else if (isService && !boostItem) {
        // Service mode de nincs localStorage adat — visszaküldés
        box.innerHTML = '<p style="color:#ef4444;text-align:center;padding:1.5rem;">Session expired. Please go back and try again.</p>';
        boostCheckoutMode = false;
        boostPrice = 0;
    } else {
        boostCheckoutMode = false;
        const items = Cart.items;
        if (items.length === 0) {
            box.innerHTML = '<p style="color:#6b7280;text-align:center;padding:1.5rem;">Your cart is empty. <a href="index.html" style="color:#a855f7;">Continue shopping</a></p>';
        } else {
            box.innerHTML = items.map((item, idx) => `
                <div class="checkout-item">
                    <img src="pics/${item.icon}" alt="${item.name}" class="checkout-item-icon">
                    <div class="checkout-item-info">
                        <div class="checkout-item-name">${item.qty}x ${item.name} LoL Smurf Account ${item.server}</div>
                        <div class="checkout-item-meta">
                            <span class="checkout-item-price">${item.price}</span>
                            <span class="checkout-item-status">· Available</span>
                        </div>
                    </div>
                    <button class="checkout-item-remove" onclick="removeCheckoutItem(${idx})">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/></svg>
                    </button>
                </div>
            `).join('');
        }
    }
    updateTotals();
}

function removeCheckoutItem(idx) {
    Cart.remove(idx);
    renderCheckout();
    if (Cart.items.length === 0) {
        document.getElementById('checkoutPayBtn').disabled = true;
        document.getElementById('checkoutPayBtn').style.opacity = '0.5';
    }
}

function updateTotals() {
    const subtotal   = boostCheckoutMode ? boostPrice : Cart.total();
    const discounted = subtotal * (1 - couponDiscount);
    const fee        = discounted * PROCESSING_FEE;
    const total      = discounted + fee;
    // Loot points always from FULL subtotal (before coupon), incl fee
    const fullTotal  = subtotal + subtotal * PROCESSING_FEE;
    const loot       = Math.floor(fullTotal * LOOT_MULTIPLIER);

    const origEl  = document.getElementById('checkoutOriginalTotal');
    const finalEl = document.getElementById('checkoutFinalTotal');
    const dueEl   = document.getElementById('checkoutAmountDue');
    const lootEl  = document.getElementById('checkoutLootPoints');

    if (couponDiscount > 0 && origEl) {
        origEl.textContent   = '€' + (fullTotal).toFixed(2) + 'EUR';
        origEl.style.display = 'inline';
    } else if (origEl) {
        origEl.style.display = 'none';
    }

    if (finalEl) finalEl.textContent = '€' + total.toFixed(2) + 'EUR';
    if (dueEl)   dueEl.textContent   = '€' + total.toFixed(2);
    if (lootEl)  lootEl.childNodes[0].textContent = loot + ' ';

    // Coupon row in order summary
    const couponRow = document.getElementById('couponDiscountRow');
    const couponLbl = document.getElementById('couponDiscountLabel');
    const couponVal = document.getElementById('couponDiscountValue');
    if (couponDiscount > 0) {
        if (couponRow) couponRow.style.display = 'flex';
        if (couponLbl) couponLbl.textContent = 'Coupon (' + (couponDiscount * 100).toFixed(0) + '% off)';
        if (couponVal) couponVal.textContent = '-€' + (subtotal * couponDiscount).toFixed(2);
    } else {
        if (couponRow) couponRow.style.display = 'none';
    }

    // Store credits fee badge
    const creditsFee = document.getElementById('creditsFee');
    if (creditsFee) creditsFee.textContent = '€' + userCredits.toFixed(2);

    // Loot guest warning
    const warn = document.getElementById('lootGuestWarning');
    if (warn) warn.style.display = userLoggedIn ? 'none' : 'flex';
}

function getTotal() {
    const subtotal   = boostCheckoutMode ? boostPrice : Cart.total();
    const discounted = subtotal * (1 - couponDiscount);
    return discounted + discounted * PROCESSING_FEE;
}

function getSubtotal() {
    return boostCheckoutMode ? boostPrice : Cart.total();
}

function applyCheckoutCoupon() {
    const code = document.getElementById('checkoutCoupon')?.value.trim().toUpperCase();
    const btn  = document.getElementById('checkoutApplyBtn');
    if (COUPONS[code]) {
        couponDiscount = COUPONS[code];
        couponCode     = code;
        if (btn) { btn.textContent = '✓ Applied'; btn.style.background = '#22c55e'; }
    } else {
        couponDiscount = 0;
        couponCode     = '';
        if (btn) { btn.textContent = 'Invalid'; btn.style.background = '#ef4444'; }
        setTimeout(() => { if (btn) { btn.textContent = 'Apply Code'; btn.style.background = ''; } }, 2000);
    }
    updateTotals();
}

function initStripe() {
    stripe = Stripe(STRIPE_PK);
    const elements = stripe.elements({
        appearance: {
            theme: 'night',
            variables: {
                colorPrimary:    '#a855f7',
                colorBackground: '#1e143c',
                colorText:       '#ffffff',
                colorDanger:     '#ef4444',
                fontFamily:      'system-ui, sans-serif',
                borderRadius:    '8px',
            }
        }
    });
    cardElement = elements.create('card', {
        hidePostalCode: true,
        style: {
            base: { color: '#fff', fontSize: '16px', '::placeholder': { color: '#6b7280' } },
            invalid: { color: '#ef4444' }
        }
    });
    cardElement.mount('#stripe-card-element');
    cardElement.on('change', e => {
        document.getElementById('stripe-card-errors').textContent = e.error ? e.error.message : '';
    });
}

function openPayModal() {
    const email = document.getElementById('checkoutEmail')?.value.trim();
    if (!email) {
        const emailEl = document.getElementById('checkoutEmail');
        emailEl.style.borderColor = '#ef4444';
        emailEl.placeholder = 'Please enter your email first!';
        emailEl.focus();
        setTimeout(() => { emailEl.style.borderColor = ''; emailEl.placeholder = 'Enter your email'; }, 3000);
        return;
    }
    const total = getTotal();
    if (total <= 0) { alert('Cart is empty.'); return; }

    // Store Credits flow
    if (selectedMethod === 'credits') {
        if (!userLoggedIn) { window.location.href = 'login.html'; return; }
        if (userCredits < total) {
            const payBtn = document.getElementById('checkoutPayBtn');
            const existing = document.getElementById('creditsErrorMsg');
            if (existing) existing.remove();
            const err = document.createElement('div');
            err.id = 'creditsErrorMsg';
            err.className = 'credits-error-msg';
            err.innerHTML = `
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/></svg>
                <div>
                    <div style="font-weight:700;">Insufficient Store Credits</div>
                    <div style="font-size:0.78rem;opacity:0.85;">Your balance: <strong>€${userCredits.toFixed(2)}</strong> · Required: <strong>€${total.toFixed(2)}</strong></div>
                </div>`;
            payBtn.parentNode.insertBefore(err, payBtn);
            setTimeout(() => err.remove(), 5000);
            return;
        }
        openCreditsConfirmModal(total, email);
        return;
    }

    // Stripe flow - lazy init
    const amountEl = document.getElementById('payModalAmount');
    if (amountEl) amountEl.textContent = '\u20ac' + total.toFixed(2);
    document.getElementById('payModal').classList.add('active');
    document.body.style.overflow = 'hidden';

    // Stripe card mountolása csak most - amikor a modal látható
    if (!cardElement) {
        initStripe();
    }
}

function openCreditsConfirmModal(total, email) {
    const modal = document.getElementById('creditsConfirmModal');
    if (!modal) return;
    document.getElementById('creditsConfirmAmount').textContent = '€' + total.toFixed(2);
    document.getElementById('creditsConfirmBalance').textContent = '€' + userCredits.toFixed(2);
    document.getElementById('creditsConfirmAfter').textContent  = '€' + (userCredits - total).toFixed(2);
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeCreditsModal() {
    document.getElementById('creditsConfirmModal')?.classList.remove('active');
    document.body.style.overflow = '';
}

async function handleCreditsPayment() {
    const email = document.getElementById('checkoutEmail')?.value.trim();
    const total = getTotal();
    const btn   = document.getElementById('creditsConfirmBtn');
    btn.disabled  = true;
    btn.textContent = '⏳ Processing...';

    try {
        const urlParams = new URLSearchParams(window.location.search);
        const mode      = urlParams.get('mode'); // 'boost', 'coaching', vagy null
        const isService = mode === 'boost' || mode === 'coaching';
        const boostItem = isService ? JSON.parse(localStorage.getItem('imustglide_boost_checkout') || 'null') : null;

        const itemType = mode === 'coaching' ? 'coaching' : (mode === 'boost' ? 'boosting' : 'account');
        const items = isService && boostItem
            ? [{ type: itemType, id: 0, name: boostItem.name, detail: boostItem.detail || '', price: parseFloat(boostItem.price.replace('\u20ac','')) || 0, qty: 1 }]
            : Cart.items.map(i => ({ type: 'account', id: 0, name: i.name + ' LoL Smurf Account ' + i.server, price: parseFloat(i.price.replace('\u20ac','')) || 0, qty: i.qty }));

        const subtotal   = getSubtotal();
        const discounted = subtotal * (1 - couponDiscount);
        const fee        = discounted * PROCESSING_FEE;

        const res  = await fetch('api/confirm_payment.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                payment_intent_id: 'credits_' + Date.now(),
                payment_method: 'store_credits',
                email, items, subtotal,
                discount_amount: subtotal * couponDiscount,
                processing_fee: fee,
                total_amount: total,
                coupon_code: couponCode,
                currency: 'EUR', currency_symbol: '\u20ac',
                mode: mode || 'cart'
            })
        });
        const text = await res.text();
        const data = JSON.parse(text);

        if (data.success) {
            if (!isService) { Cart.items = []; Cart.save(); }
            localStorage.removeItem('imustglide_boost_checkout');
            closeCreditsModal();
            showPaymentSuccess(data.order_number, total, data.loot_points_earned);
        } else {
            throw new Error(data.message || 'Payment failed');
        }
    } catch(e) {
        alert('Error: ' + e.message);
        btn.disabled = false;
        btn.textContent = 'Confirm Payment';
    }
}

function closePayModal() {
    document.getElementById('payModal').classList.remove('active');
    document.body.style.overflow = '';
}

async function handlePayment() {
    const confirmBtn = document.getElementById('payModalConfirmBtn');
    const email      = document.getElementById('checkoutEmail')?.value.trim();
    const total      = getTotal();

    confirmBtn.disabled  = true;
    confirmBtn.innerHTML = '\u23f3 Processing...';

    try {
        const intentRes  = await fetch('api/create_payment_intent.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ amount: total, currency: 'eur', email })
        });
        const intentText = await intentRes.text();
        //console.log('Payment Intent response:', intentText);
        let intentData;
        try { intentData = JSON.parse(intentText); }
        catch(e) { throw new Error('Server error: ' + intentText.substring(0, 200)); }
        if (!intentData.success) throw new Error(intentData.message);

        const { error, paymentIntent } = await stripe.confirmCardPayment(intentData.client_secret, {
            payment_method: { card: cardElement, billing_details: { email } }
        });

        if (error) {
            document.getElementById('stripe-card-errors').textContent = error.message;
            confirmBtn.disabled  = false;
            confirmBtn.innerHTML = 'Pay Now \u2192';
            return;
        }

        if (paymentIntent.status === 'succeeded') {
            const urlParams = new URLSearchParams(window.location.search);
            const mode      = urlParams.get('mode');
            const isService = mode === 'boost' || mode === 'coaching';
            const boostItem = isService ? JSON.parse(localStorage.getItem('imustglide_boost_checkout') || 'null') : null;

            const itemType = mode === 'coaching' ? 'coaching' : (mode === 'boost' ? 'boosting' : 'account');
            const items = isService && boostItem
                ? [{ type: itemType, id: 0, name: boostItem.name, detail: boostItem.detail || '', price: parseFloat(boostItem.price.replace('\u20ac','')) || 0, qty: 1 }]
                : Cart.items.map(i => ({ type: 'account', id: 0, name: i.name + ' LoL Smurf Account ' + i.server, price: parseFloat(i.price.replace('\u20ac','')) || 0, qty: i.qty }));

            const subtotal      = getSubtotal();
            const discounted    = subtotal * (1 - couponDiscount);
            const processingFee = discounted * PROCESSING_FEE;

            const confirmRes  = await fetch('api/confirm_payment.php', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ payment_intent_id: paymentIntent.id, email, items, subtotal, discount_amount: subtotal * couponDiscount, processing_fee: processingFee, total_amount: total, coupon_code: couponCode, currency: 'EUR', currency_symbol: '\u20ac', mode: mode || 'cart' })
            });
            const confirmText = await confirmRes.text();
            //console.log('Confirm response:', confirmText);
            let confirmData;
            try { confirmData = JSON.parse(confirmText); }
            catch(e) { throw new Error('Confirm server error: ' + confirmText.substring(0, 300)); }

            if (confirmData.success) {
                if (!isService) { Cart.items = []; Cart.save(); }
                localStorage.removeItem('imustglide_boost_checkout');
                closePayModal();
                showPaymentSuccess(confirmData.order_number, total, confirmData.loot_points_earned);
            } else {
                throw new Error(confirmData.message || 'Order save failed');
            }
        }
    } catch (err) {
        const errMsg = err.message || 'Payment failed.';
        document.getElementById('stripe-card-errors').textContent = errMsg;
        console.error('Payment error:', errMsg);
        confirmBtn.disabled  = false;
        confirmBtn.innerHTML = 'Pay Now \u2192';
    }
}

function showPaymentSuccess(orderNumber, total, lootPoints) {
    document.querySelector('.checkout-main').innerHTML = `
        <div class="payment-success">
            <div class="payment-success-icon">
                <svg width="64" height="64" viewBox="0 0 24 24" fill="#22c55e"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/></svg>
            </div>
            <h1 class="payment-success-title">Payment Successful! 🎉</h1>
            <p class="payment-success-sub">Thank you for your purchase on iMUSTGLIDE.</p>
            <div class="payment-success-details">
                <div class="payment-success-row">
                    <span>Order Number</span>
                    <strong style="color:#a855f7;">${orderNumber}</strong>
                </div>
                <div class="payment-success-row">
                    <span>Amount Paid</span>
                    <strong>€${total.toFixed(2)}</strong>
                </div>
                <div class="payment-success-row">
                    <span>Loot Points Earned</span>
                    <strong style="color:#a855f7;">+${lootPoints} LP 🔷</strong>
                </div>
            </div>
            <p style="color:#6b7280;font-size:0.9rem;margin-bottom:2rem;">
                A confirmation has been sent to your email. Your order will be processed shortly.
            </p>
            <div style="display:flex;gap:1rem;justify-content:center;">
                <a href="profile.html" style="background:#a855f7;color:#fff;padding:0.75rem 2rem;border-radius:0.75rem;text-decoration:none;font-weight:700;">View Orders</a>
                <a href="index.html" style="background:rgba(168,85,247,0.15);color:#d8b4fe;padding:0.75rem 2rem;border-radius:0.75rem;text-decoration:none;font-weight:700;border:1px solid rgba(168,85,247,0.3);">Back to Home</a>
            </div>
        </div>
    `;
}

document.addEventListener('DOMContentLoaded', async function () {
    renderCheckout();

    // Session check: auto-fill email, load credits
    try {
        const res  = await fetch('api/check_session.php');
        const data = await res.json();
        if (data.logged_in) {
            userLoggedIn = true;
            userEmail    = data.user.email || '';
            const emailEl = document.getElementById('checkoutEmail');
            if (emailEl && !emailEl.value) emailEl.value = userEmail;

            // Load store credits
            try {
                const profileRes  = await fetch('api/get_profile.php');
                const profileData = await profileRes.json();
                if (profileData.success) {
                    userCredits = parseFloat(profileData.stats?.store_credits_balance || 0);
                    const sub = document.getElementById('creditsBalance');
                    if (sub) sub.textContent = 'Balance: €' + userCredits.toFixed(2);
                    const fee = document.getElementById('creditsFee');
                    if (fee) fee.textContent = '€' + userCredits.toFixed(2);
                }
            } catch(e) {}

            // Hide login overlay on credits
            const overlay = document.getElementById('creditsLoginOverlay');
            if (overlay) overlay.style.display = 'none';
        } else {
            userLoggedIn = false;
            const sub = document.getElementById('creditsBalance');
            if (sub) sub.textContent = 'Login required';
            const overlay = document.getElementById('creditsLoginOverlay');
            if (overlay) overlay.style.display = 'flex';
            // Guest warning megjelenítése
            const guestWarn = document.getElementById('guestWarning');
            if (guestWarn) guestWarn.style.display = 'flex';
        }
    } catch(e) {}

    updateTotals();

    document.getElementById('checkoutApplyBtn')?.addEventListener('click', applyCheckoutCoupon);
    document.getElementById('checkoutCoupon')?.addEventListener('keydown', e => { if (e.key === 'Enter') applyCheckoutCoupon(); });

    // Pay Now → open modal
    document.getElementById('checkoutPayBtn')?.addEventListener('click', openPayModal);

    // Modal close
    document.getElementById('payModalClose')?.addEventListener('click', closePayModal);
    document.getElementById('payModalOverlay')?.addEventListener('click', closePayModal);
    document.addEventListener('keydown', e => { if (e.key === 'Escape') closePayModal(); });

    // Modal confirm
    document.getElementById('payModalConfirmBtn')?.addEventListener('click', handlePayment);
    document.getElementById('creditsConfirmBtn')?.addEventListener('click', handleCreditsPayment);

    // Payment method selection
    document.querySelectorAll('.checkout-payment-option').forEach(opt => {
        opt.addEventListener('click', function () {
            if (this.classList.contains('crypto-option')) return;
            // Credits option: check if logged in
            if (this.classList.contains('credits-option') && !userLoggedIn) {
                window.location.href = 'login.html';
                return;
            }
            document.querySelectorAll('.checkout-payment-option').forEach(o => o.classList.remove('active'));
            this.classList.add('active');
            selectedMethod = this.getAttribute('data-method');
        });
    });
});