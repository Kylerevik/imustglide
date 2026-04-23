// ============================================
// ADMIN.JS - iMUSTGLIDE Admin Panel
// ============================================

let currentUserId  = null;
let currentOrderId = null;
let currentPage    = 'dashboard';
let sidebarLocked  = localStorage.getItem('sidebar-locked') === 'true';

// ── INIT ──────────────────────────────────────
document.addEventListener('DOMContentLoaded', async function () {
    await checkAdminSession();
    initSidebar();
    initRouting();
    loadDashboard();
});

// ── SESSION CHECK ─────────────────────────────
async function checkAdminSession() {
    try {
        const res  = await fetch('api/check_session.php');
        const data = await res.json();
        if (!data.logged_in || data.user.role !== 'admin') {
            window.location.href = 'index.html';
        }
    } catch (e) {
        window.location.href = 'index.html';
    }
}

// ── SIDEBAR ───────────────────────────────────
function initSidebar() {
    const sidebar  = document.getElementById('sidebar');
    const lockBtn  = document.getElementById('sidebarLockBtn');
    const lockIcon = document.getElementById('lockIcon');
    if (sidebarLocked) sidebar.classList.add('locked');
    lockBtn.addEventListener('click', () => {
        sidebarLocked = !sidebarLocked;
        sidebar.classList.toggle('locked', sidebarLocked);
        lockIcon.textContent = sidebarLocked ? '🔒' : '🔓';
        localStorage.setItem('sidebar-locked', sidebarLocked);
    });
}

// ── ROUTING ───────────────────────────────────
function initRouting() {
    document.querySelectorAll('.nav-link[data-page]').forEach(link => {
        link.addEventListener('click', e => {
            e.preventDefault();
            showPage(link.dataset.page);
        });
    });
}

function showPage(page) {
    currentPage = page;
    document.querySelectorAll('.page-content').forEach(p => p.classList.remove('active'));
    const el = document.getElementById(`page-${page}`);
    if (el) { el.classList.add('active'); el.style.display = ''; }

    document.querySelectorAll('.nav-link').forEach(l => {
        l.classList.toggle('active', l.dataset.page === page);
    });

    if (page === 'users')              loadUsers();
    if (page === 'orders')             loadOrders();
    if (page === 'discount-codes')     loadDiscountCodes();
    if (page === 'games')              loadAdminGames();
    if (page === 'accounts')           loadAdminAccounts();
    if (page === 'boosting-services')  loadAdminBoostingServices();
    if (page === 'coaching-services')  loadAdminCoachingServices();
    if (page === 'boosters')           setTimeout(() => loadWorkers('booster'), 100);
    if (page === 'coaches')            setTimeout(() => loadWorkers('coach'), 100);
}

// ── DASHBOARD ─────────────────────────────────
async function loadDashboard() {
    const data = await adminFetch('dashboard');
    if (!data.success) return;

    document.getElementById('statTotalUsers').textContent   = data.total_users;
    document.getElementById('statTotalOrders').textContent  = data.total_orders;
    document.getElementById('statTotalRevenue').textContent = '€' + parseFloat(data.total_revenue).toFixed(2);
    document.getElementById('statBannedUsers').textContent  = data.banned_users;

    // Recent orders
    const ob = document.getElementById('recentOrdersBody');
    ob.innerHTML = data.recent_orders.length ? data.recent_orders.map(o => `
        <tr>
            <td><code style="color:#a855f7">${o.order_number}</code></td>
            <td>${o.display_name || o.first_name || '<span style="color:#f59e0b">Guest</span>'} <small style="color:#6b7280">${o.display_email || o.customer_email || ''}</small></td>
            <td>${o.product_name || '-'}</td>
            <td>${o.currency_symbol}${parseFloat(o.total_amount).toFixed(2)}</td>
            <td><span class="status-badge status-${o.status}">${o.status}</span></td>
            <td>${formatDate(o.created_at)}</td>
        </tr>
    `).join('') : '<tr><td colspan="6" class="empty-table">No orders</td></tr>';

    // Recent users
    const ub = document.getElementById('recentUsersBody');
    ub.innerHTML = data.recent_users.length ? data.recent_users.map(u => `
        <tr>
            <td><span class="user-avatar-sm">${u.avatar_initial || '?'}</span>${u.first_name || '-'}</td>
            <td>${u.email}</td>
            <td><span class="role-badge role-${u.role}">${u.role}</span></td>
            <td>${formatDate(u.created_at)}</td>
            <td><span class="status-badge ${u.is_active == 1 ? 'status-active' : 'status-banned'}">${u.is_active == 1 ? 'Active' : 'Banned'}</span></td>
            <td><button class="admin-btn admin-btn-sm" onclick="openUserModal(${u.id})">View</button></td>
        </tr>
    `).join('') : '<tr><td colspan="6" class="empty-table">No users</td></tr>';
}

// ── USERS ─────────────────────────────────────
async function loadUsers(role = 'all', search = '') {
    const data = await adminFetch(`get_users&role=${role}&search=${encodeURIComponent(search)}`);
    const tbody = document.getElementById('usersTableBody');
    if (!data.success) { tbody.innerHTML = '<tr><td colspan="8" class="empty-table">Error loading users</td></tr>'; return; }

    tbody.innerHTML = data.users.length ? data.users.map(u => `
        <tr>
            <td><span class="user-avatar-sm">${u.avatar_initial || '?'}</span>${u.first_name || '-'} ${u.last_name || ''}</td>
            <td style="color:#9ca3af">${u.email}</td>
            <td><span class="role-badge role-${u.role}">${u.role}</span></td>
            <td>${u.total_orders || 0}</td>
            <td>€${parseFloat(u.total_spent || 0).toFixed(2)}</td>
            <td>${formatDate(u.created_at)}</td>
            <td><span class="status-badge ${u.is_active == 1 ? 'status-active' : 'status-banned'}">${u.is_active == 1 ? 'Active' : 'Banned'}</span></td>
            <td>
                <div class="table-actions">
                    <button class="admin-btn admin-btn-sm" onclick="openUserModal(${u.id})">Edit</button>
                    ${u.is_active == 1
                        ? `<button class="admin-btn admin-btn-sm danger" onclick="quickBan(${u.id})">Ban</button>`
                        : `<button class="admin-btn admin-btn-sm success" onclick="quickActivate(${u.id})">Unban</button>`
                    }
                </div>
            </td>
        </tr>
    `).join('') : '<tr><td colspan="8" class="empty-table">No users found</td></tr>';
}

// User filter buttons
document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('#page-users .filter-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('#page-users .filter-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            loadUsers(btn.dataset.filter, document.getElementById('usersSearch')?.value || '');
        });
    });

    document.getElementById('usersSearch')?.addEventListener('input', function () {
        const activeFilter = document.querySelector('#page-users .filter-btn.active')?.dataset.filter || 'all';
        loadUsers(activeFilter, this.value);
    });

    document.querySelectorAll('#page-orders .filter-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('#page-orders .filter-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            loadOrders(btn.dataset.filter, document.getElementById('ordersSearch')?.value || '');
        });
    });

    document.getElementById('ordersSearch')?.addEventListener('input', function () {
        const activeFilter = document.querySelector('#page-orders .filter-btn.active')?.dataset.filter || 'all';
        loadOrders(activeFilter, this.value);
    });
});

// ── USER MODAL ────────────────────────────────
async function openUserModal(userId) {
    currentUserId = userId;
    const data = await adminFetch(`get_user&id=${userId}`);
    if (!data.success) return;

    const u = data.user;

    document.getElementById('modalUserAvatar').textContent = u.avatar_initial || '?';
    document.getElementById('modalUserName').textContent   = (u.first_name || '') + ' ' + (u.last_name || '');
    document.getElementById('modalUserEmail').textContent  = u.email;
    document.getElementById('editFirstName').value  = u.first_name || '';
    document.getElementById('editLastName').value   = u.last_name  || '';
    document.getElementById('editEmail').value      = u.email      || '';
    document.getElementById('editRole').value       = u.role       || 'customer';
    document.getElementById('editCredits').value    = parseFloat(u.store_credits_balance || 0).toFixed(2);
    document.getElementById('editLootPoints').value = u.loot_points || 0;
    document.getElementById('editDiscord').value    = u.discord_username || '';
    document.getElementById('editCountry').value    = u.country || '';

    // Orders in modal
    const ob = document.getElementById('modalOrdersBody');
    // Store for detail lookup
    data.orders.forEach(o => _adminOrders[o.id] = o);

    ob.innerHTML = data.orders.length ? data.orders.map(o => {
        const detail = o.detail ? `<div style="font-size:0.75rem;color:#a855f7;margin-top:2px;">${o.detail}</div>` : '';
        return `<tr>
            <td><code style="color:#a855f7">${o.order_number}</code></td>
            <td>
                <div>${o.product_name || '-'}</div>
                ${detail}
            </td>
            <td>${o.currency_symbol}${parseFloat(o.total_amount).toFixed(2)}</td>
            <td><span class="status-badge status-${o.status}">${o.status}</span></td>
            <td>${formatDate(o.created_at)}</td>
            <td>
                <div class="table-actions">
                    <button class="admin-btn admin-btn-sm" onclick="openAdminOrderDetail(${o.id})">
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z"/></svg>
                        Details
                    </button>
                    <button class="admin-btn admin-btn-sm danger" onclick="openOrderModal(${o.id}, '${o.order_number}', '${o.status}')">Manage</button>
                </div>
            </td>
        </tr>`;
    }).join('') : '<tr><td colspan="6" class="empty-table">No orders</td></tr>';

    // Reset modal tabs
    document.querySelectorAll('.admin-tab-btn').forEach(b => b.classList.remove('active'));
    document.querySelectorAll('.admin-tab-pane').forEach(p => p.classList.remove('active'));
    document.querySelector('.admin-tab-btn').classList.add('active');
    document.querySelector('.admin-tab-pane').classList.add('active');

    document.querySelectorAll('.admin-tab-btn').forEach(btn => {
        btn.onclick = () => {
            document.querySelectorAll('.admin-tab-btn').forEach(b => b.classList.remove('active'));
            document.querySelectorAll('.admin-tab-pane').forEach(p => p.classList.remove('active'));
            btn.classList.add('active');
            document.getElementById(`modal-tab-${btn.dataset.tab}`).classList.add('active');
        };
    });

    document.getElementById('editUserMsg').style.display = 'none';
    document.getElementById('actionsMsg').style.display  = 'none';
    document.getElementById('userModal').classList.add('open');
}

function closeUserModal() {
    document.getElementById('userModal').classList.remove('open');
    currentUserId = null;
}

async function saveUserEdit() {
    const res = await adminPost('update_user', {
        id:                    currentUserId,
        first_name:            document.getElementById('editFirstName').value,
        last_name:             document.getElementById('editLastName').value,
        email:                 document.getElementById('editEmail').value,
        role:                  document.getElementById('editRole').value,
        store_credits_balance: document.getElementById('editCredits').value,
        loot_points:           document.getElementById('editLootPoints').value,
        discord_username:      document.getElementById('editDiscord').value,
        country:               document.getElementById('editCountry').value,
    });
    showMsg('editUserMsg', res.message, res.success ? 'success' : 'error');
    if (res.success && currentPage === 'users') loadUsers();
}

async function banUser() {
    confirm2('Ban this user?', 'This will disable their account permanently until reactivated.', async () => {
        const res = await adminPost('ban_user', { id: currentUserId });
        showMsg('actionsMsg', res.message, res.success ? 'success' : 'error');
        if (res.success && currentPage === 'users') loadUsers();
    });
}

async function activateUser() {
    const res = await adminPost('activate_user', { id: currentUserId });
    showMsg('actionsMsg', res.message, res.success ? 'success' : 'error');
    if (res.success && currentPage === 'users') loadUsers();
}

async function suspendUser() {
    const days = document.getElementById('suspendDuration').value;
    confirm2(`Suspend for ${days} day(s)?`, 'The user will not be able to login during suspension.', async () => {
        const res = await adminPost('ban_user', { id: currentUserId });
        showMsg('actionsMsg', res.message, res.success ? 'success' : 'error');
        if (res.success && currentPage === 'users') loadUsers();
    });
}

async function addCredits() {
    const amount = parseFloat(document.getElementById('addCreditsAmount').value);
    if (!amount || amount <= 0) { showMsg('actionsMsg', 'Enter a valid amount', 'error'); return; }
    const res = await adminPost('add_credits', { id: currentUserId, amount });
    showMsg('actionsMsg', res.message, res.success ? 'success' : 'error');
    if (res.success) {
        document.getElementById('editCredits').value = (parseFloat(document.getElementById('editCredits').value) + amount).toFixed(2);
        document.getElementById('addCreditsAmount').value = '';
    }
}

async function resetUserPassword() {
    const password = document.getElementById('newUserPassword').value;
    if (!password || password.length < 6) { showMsg('actionsMsg', 'Password must be at least 6 characters', 'error'); return; }
    confirm2('Reset password?', 'This will immediately change the user\'s password.', async () => {
        const res = await adminPost('reset_password', { id: currentUserId, password });
        showMsg('actionsMsg', res.message, res.success ? 'success' : 'error');
        if (res.success) document.getElementById('newUserPassword').value = '';
    });
}

async function quickBan(userId) {
    confirm2('Ban this user?', 'Their account will be disabled.', async () => {
        await adminPost('ban_user', { id: userId });
        loadUsers();
    });
}

async function quickActivate(userId) {
    await adminPost('activate_user', { id: userId });
    loadUsers();
}

// ── ORDERS ────────────────────────────────────
const _adminOrders = {};

async function loadOrders(status = 'all', search = '') {
    const data = await adminFetch(`get_orders&status=${status}&search=${encodeURIComponent(search)}`);
    const tbody = document.getElementById('ordersTableBody');
    if (!data.success) { tbody.innerHTML = '<tr><td colspan="7" class="empty-table">Error loading orders</td></tr>'; return; }

    // Store orders for detail lookup
    data.orders.forEach(o => _adminOrders[o.id] = o);

    tbody.innerHTML = data.orders.length ? data.orders.map(o => `
        <tr>
            <td><code style="color:#a855f7">${o.order_number}</code></td>
            <td>${o.display_name || o.first_name || '<span style="color:#f59e0b">Guest</span>'} <small style="color:#6b7280">${o.display_email || o.customer_email || ''}</small></td>
            <td style="max-width:200px; overflow:hidden; text-overflow:ellipsis; white-space:nowrap;" title="${(o.product_name||'').replace(/"/g,'')}">${o.product_name || '-'}</td>
            <td>${o.currency_symbol}${parseFloat(o.total_amount).toFixed(2)}</td>
            <td><span class="status-badge status-${o.status}">${o.status}</span></td>
            <td>${formatDate(o.created_at)}</td>
            <td>
                <div class="table-actions">
                    <button class="admin-btn admin-btn-sm" onclick="openAdminOrderDetail(${o.id})">
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z"/></svg>
                        Details
                    </button>
                    <button class="admin-btn admin-btn-sm danger" onclick="openOrderModal(${o.id}, '${o.order_number}', '${o.status}')">Manage</button>
                </div>
            </td>
        </tr>
    `).join('') : '<tr><td colspan="7" class="empty-table">No orders found</td></tr>';
}

function openAdminOrderDetail(orderId) {
    const o = _adminOrders[orderId];
    if (!o) return;

    const methodIcons = { stripe: '💳', store_credits: '💰', paypal: '🅿️' };
    const methodNames = { stripe: 'Stripe (Card)', store_credits: 'Store Credits', paypal: 'PayPal' };
    const method = methodNames[o.payment_method] || o.payment_method || 'Stripe';
    const icon   = methodIcons[o.payment_method] || '💳';

    // Parse detail from items_detail
    let detailHtml = '';
    if (o.items_detail) {
        const parts = o.items_detail.split('||');
        const details = parts.map(p => {
            try { const j = JSON.parse(p); return j.detail || null; } catch(e) { return null; }
        }).filter(Boolean);
        if (details.length > 0) {
            detailHtml = `<div class="order-detail-item">
                <div class="order-detail-label">Details</div>
                <div class="order-detail-value" style="color:#a855f7;font-weight:600;">${details.join('<br>')}</div>
            </div>`;
        }
    }

    document.getElementById('adminOrderDetailContent').innerHTML = `
        <div class="order-detail-header">
            <div class="order-detail-number">${o.order_number}</div>
            <span class="status-badge status-${o.status}">${o.status}</span>
        </div>
        <div class="order-detail-grid">
            <div class="order-detail-item"><div class="order-detail-label">Customer</div><div class="order-detail-value">${o.notes === 'GUEST ORDER' ? '<span style="color:#f59e0b">👤 Guest</span>' : (o.first_name ? o.first_name + ' ' + (o.last_name || '') : o.email)}</div></div>
            <div class="order-detail-item"><div class="order-detail-label">Email</div><div class="order-detail-value">${o.email || '-'}</div></div>
            <div class="order-detail-item"><div class="order-detail-label">Product</div><div class="order-detail-value">${o.product_name || '-'}</div></div>
            ${detailHtml}
            <div class="order-detail-item"><div class="order-detail-label">Amount</div><div class="order-detail-value" style="color:#a855f7;font-weight:700;">${o.currency_symbol}${parseFloat(o.total_amount).toFixed(2)}</div></div>
            <div class="order-detail-item"><div class="order-detail-label">Payment Method</div><div class="order-detail-value">${icon} ${method}</div></div>
            <div class="order-detail-item"><div class="order-detail-label">Loot Points</div><div class="order-detail-value">+${o.loot_points_earned || 0} LP 🔷</div></div>
            <div class="order-detail-item"><div class="order-detail-label">Payment ID</div><div class="order-detail-value" style="font-family:monospace;font-size:0.75rem;color:#6b7280;">${o.payment_intent_id || '-'}</div></div>
            <div class="order-detail-item"><div class="order-detail-label">Date</div><div class="order-detail-value">${formatDate(o.created_at)}</div></div>
        </div>`;
    document.getElementById('adminOrderDetailModal').classList.add('open');
}

function openOrderModal(orderId, orderNumber, status) {
    currentOrderId = orderId;
    document.getElementById('orderModalTitle').textContent = 'Order #' + orderNumber;
    document.getElementById('orderStatusSelect').value    = status;
    document.getElementById('orderModalMsg').style.display = 'none';
    document.getElementById('orderModal').classList.add('open');
}

function closeOrderModal() {
    document.getElementById('orderModal').classList.remove('open');
    currentOrderId = null;
}

async function saveOrderStatus() {
    const status = document.getElementById('orderStatusSelect').value;
    const res    = await adminPost('update_order', { id: currentOrderId, status });
    showMsg('orderModalMsg', res.message, res.success ? 'success' : 'error');
    if (res.success) { loadOrders(); if (currentUserId) openUserModal(currentUserId); }
}

async function deleteOrder() {
    confirm2('Delete this order?', 'This cannot be undone.', async () => {
        const res = await adminPost('delete_order', { id: currentOrderId });
        if (res.success) { closeOrderModal(); loadOrders(); }
    });
}

// ── DISCOUNT CODES ────────────────────────────
async function loadDiscountCodes() {
    const data  = await adminFetch('get_discount_codes');
    const tbody = document.getElementById('codesTableBody');
    if (!data.success) { tbody.innerHTML = '<tr><td colspan="8" class="empty-table">Error</td></tr>'; return; }

    tbody.innerHTML = data.codes.length ? data.codes.map(c => `
        <tr>
            <td><code style="color:#a855f7; font-weight:700;">${c.code}</code></td>
            <td>${c.type}</td>
            <td>${c.type === 'percentage' ? c.value + '%' : '€' + parseFloat(c.value).toFixed(2)}</td>
            <td>${c.times_used}</td>
            <td>${c.max_uses == 0 ? '∞' : c.max_uses}</td>
            <td>${c.valid_until ? formatDate(c.valid_until) : 'Never'}</td>
            <td><span class="status-badge ${c.is_active == 1 ? 'status-active' : 'status-banned'}">${c.is_active == 1 ? 'Active' : 'Disabled'}</span></td>
            <td>
                <div class="table-actions">
                    <button class="admin-btn admin-btn-sm ${c.is_active == 1 ? 'warning' : 'success'}" onclick="toggleCode(${c.id}, ${c.is_active == 1 ? 0 : 1})">
                        ${c.is_active == 1 ? 'Disable' : 'Enable'}
                    </button>
                    <button class="admin-btn admin-btn-sm danger" onclick="deleteCode(${c.id})">Delete</button>
                </div>
            </td>
        </tr>
    `).join('') : '<tr><td colspan="8" class="empty-table">No discount codes</td></tr>';
}

function openCreateCouponModal() {
    document.getElementById('couponModalMsg').style.display = 'none';
    document.getElementById('couponModal').classList.add('open');
}

function closeCouponModal() {
    document.getElementById('couponModal').classList.remove('open');
}

async function createCoupon() {
    const res = await adminPost('create_discount_code', {
        code:        document.getElementById('newCouponCode').value,
        type:        document.getElementById('newCouponType').value,
        value:       document.getElementById('newCouponValue').value,
        max_uses:    document.getElementById('newCouponMaxUses').value,
        valid_until: document.getElementById('newCouponExpiry').value,
        description: document.getElementById('newCouponDesc').value,
    });
    showMsg('couponModalMsg', res.message, res.success ? 'success' : 'error');
    if (res.success) {
        setTimeout(() => { closeCouponModal(); loadDiscountCodes(); }, 1000);
    }
}

async function toggleCode(id, isActive) {
    await adminPost('toggle_discount_code', { id, is_active: isActive });
    loadDiscountCodes();
}

async function deleteCode(id) {
    confirm2('Delete this code?', 'This cannot be undone.', async () => {
        await adminPost('delete_discount_code', { id });
        loadDiscountCodes();
    });
}

// ── CONFIRM MODAL ─────────────────────────────
function confirm2(title, message, onConfirm) {
    document.getElementById('confirmTitle').textContent   = title;
    document.getElementById('confirmMessage').textContent = message;
    document.getElementById('confirmModal').classList.add('open');
    document.getElementById('confirmYesBtn').onclick = async () => {
        closeConfirmModal();
        await onConfirm();
    };
}

function closeConfirmModal() {
    document.getElementById('confirmModal').classList.remove('open');
}

// ── HELPERS ───────────────────────────────────
async function adminFetch(action) {
    try {
        const res = await fetch(`api/admin_api.php?action=${action}`);
        return await res.json();
    } catch (e) {
        return { success: false, message: 'Connection error' };
    }
}

async function adminPost(action, body) {
    try {
        const res = await fetch(`api/admin_api.php?action=${action}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body),
        });
        return await res.json();
    } catch (e) {
        return { success: false, message: 'Connection error' };
    }
}

function showMsg(elId, message, type) {
    const el = document.getElementById(elId);
    if (!el) return;
    el.textContent  = message;
    el.className    = 'settings-msg ' + type;
    el.style.display = 'block';
    setTimeout(() => { el.style.display = 'none'; }, 4000);
}

function formatDate(dateString) {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
}

// ============================================
// GAMES MANAGEMENT
// ============================================
async function loadAdminGames() {
    const data = await adminFetch('get_games');
    const tbody = document.getElementById('gamesTableBody');
    if (!data.success) return;
    tbody.innerHTML = data.games.length ? data.games.map(g => `
        <tr>
            <td><strong>${g.game_name}</strong></td>
            <td><code style="color:#a855f7">${g.slug}</code></td>
            <td><span class="status-badge ${g.is_active ? 'status-active' : 'status-cancelled'}">${g.is_active ? 'Active' : 'Inactive'}</span></td>
            <td>${g.display_order}</td>
            <td>${g.has_discount ? g.discount_percentage + '%' : '-'}</td>
            <td>
                <div class="table-actions">
                    <button class="admin-btn admin-btn-sm" onclick="openEditGameModal(${JSON.stringify(g).replace(/"/g,'&quot;')})">Edit</button>
                    <button class="admin-btn admin-btn-sm danger" onclick="deleteGame(${g.id}, '${g.game_name}')">Delete</button>
                </div>
            </td>
        </tr>`).join('') : '<tr><td colspan="6" class="empty-table">No games</td></tr>';
}

function openEditGameModal(g) {
    document.getElementById('serviceModalTitle').textContent = 'Edit Game: ' + g.game_name;
    document.getElementById('serviceModalBody').innerHTML = `
        <div class="admin-form-group"><label>Game Name</label><input class="admin-input" id="eg_name" value="${g.game_name}"></div>
        <div class="admin-form-group"><label>Slug</label><input class="admin-input" id="eg_slug" value="${g.slug}"></div>
        <div class="admin-form-group"><label>Display Order</label><input class="admin-input" type="number" id="eg_order" value="${g.display_order}"></div>
        <div class="admin-form-group"><label>Active</label>
            <select class="admin-input" id="eg_active">
                <option value="1" ${g.is_active == 1 ? 'selected' : ''}>Yes</option>
                <option value="0" ${g.is_active == 0 ? 'selected' : ''}>No</option>
            </select>
        </div>
        <div class="admin-form-group"><label>Has Discount</label>
            <select class="admin-input" id="eg_disc">
                <option value="0" ${!g.has_discount ? 'selected' : ''}>No</option>
                <option value="1" ${g.has_discount ? 'selected' : ''}>Yes</option>
            </select>
        </div>
        <div class="admin-form-group"><label>Discount %</label><input class="admin-input" type="number" id="eg_discpct" value="${g.discount_percentage || 0}"></div>
        <div style="margin-top:1rem;">
            <button class="admin-btn" onclick="saveGame(${g.id})">Save Changes</button>
        </div>`;
    // Hide the status select that belongs to order modal
    const statusSel = document.getElementById('orderStatusSelect');
    if (statusSel) statusSel.closest('.admin-form-group') && (statusSel.closest('.admin-form-group').style.display = 'none');
    document.getElementById('serviceModal').classList.add('open');
}

function openAddGameModal() {
    document.getElementById('serviceModalTitle').textContent = 'Add New Game';
    document.getElementById('serviceModalBody').innerHTML = `
        <div class="admin-form-group"><label>Game Name</label><input class="admin-input" id="ng_name" placeholder="e.g. Valorant"></div>
        <div class="admin-form-group"><label>Slug</label><input class="admin-input" id="ng_slug" placeholder="e.g. valorant"></div>
        <div class="admin-form-group"><label>Icon path</label><input class="admin-input" id="ng_icon" placeholder="pics/valorant.png"></div>
        <div class="admin-form-group"><label>Display Order</label><input class="admin-input" type="number" id="ng_order" value="99"></div>
        <div style="margin-top:1rem;"><button class="admin-btn" onclick="addGame()">Add Game</button></div>`;
    document.getElementById('serviceModal').classList.add('open');
}

async function saveGame(id) {
    await adminPost('update_game', { id, game_name: document.getElementById('eg_name').value, slug: document.getElementById('eg_slug').value, is_active: document.getElementById('eg_active').value, display_order: document.getElementById('eg_order').value, has_discount: document.getElementById('eg_disc').value, discount_percentage: document.getElementById('eg_discpct').value });
    closeServiceModal(); loadAdminGames();
}

async function addGame() {
    await adminPost('add_game', { game_name: document.getElementById('ng_name').value, slug: document.getElementById('ng_slug').value, icon_path: document.getElementById('ng_icon').value, display_order: document.getElementById('ng_order').value });
    closeServiceModal(); loadAdminGames();
}

async function deleteGame(id, name) {
    if (!confirm(`Delete game "${name}"?`)) return;
    await adminPost('delete_game', { id });
    loadAdminGames();
}

function closeServiceModal() {
    document.getElementById('serviceModal')?.classList.remove('open');
}

function closeDeleteConfirm() {
    document.getElementById('deleteConfirmModal')?.classList.remove('open');
}

function switchServer(btn, server) {
    document.querySelectorAll('.server-tab').forEach(t => t.classList.remove('active'));
    btn.classList.add('active');
    _currentServer = server;
    loadAdminAccounts();
}

// ============================================
// ACCOUNTS MANAGEMENT (Types + Inventory)
// ============================================
const SERVERS = ['EUW','EUNE','NA','TR','RU','BR','LAN','LAS','OCE','MENA'];
let _currentServer = 'EUW';
let _accountTypes  = {};

async function loadAdminAccounts() {
    const grid = document.getElementById('accountTypesGrid');
    if (grid) grid.innerHTML = '<div style="color:#6b7280;padding:2rem;text-align:center;">Loading...</div>';
    const data = await adminFetch('get_account_types&server=' + _currentServer);
    if (!data.success || !grid) return;
    _accountTypes = {};
    (data.types || []).forEach(t => { _accountTypes[t.id] = t; });
    if (!(data.types || []).length) {
        grid.innerHTML = '<div style="color:#6b7280;padding:2rem;text-align:center;">No account types for ' + _currentServer + '.</div>';
        return;
    }
    grid.innerHTML = data.types.map(t => {
        const stock = t.stock || 0;
        const priceHtml = t.discounted_price
            ? '<div class="price-original">\u20ac' + parseFloat(t.price).toFixed(2) + '</div><div class="price-main" style="color:#22c55e;">\u20ac' + parseFloat(t.discounted_price).toFixed(2) + '</div>'
            : '<div class="price-main">\u20ac' + parseFloat(t.price).toFixed(2) + '</div>';
        return '<div class="account-type-card">' +
            '<div class="account-type-card-header">' +
                '<div class="account-type-icon"><img src="' + (t.icon_path || 'pics/handleveled.png') + '" alt="' + t.title + '" onerror="this.src=&quot;pics/handleveled.png&quot;"></div>' +
                '<div style="flex:1;">' +
                    '<div class="account-type-title">' + t.title + '</div>' +
                    '<div class="account-type-server">' + t.server + ' \u00b7 ' + (t.is_skin_account ? 'Skin Account' : 'Handleveled') + '</div>' +
                '</div>' +
                '<div class="account-type-price">' + priceHtml + '</div>' +
            '</div>' +
            '<div class="account-type-stock ' + (stock > 0 ? 'stock-ok' : 'stock-empty') + '">' +
                '\u25cf ' + stock + ' account' + (stock !== 1 ? 's' : '') + ' in stock' +
            '</div>' +
            '<div class="account-type-actions">' +
                '<button class="admin-btn admin-btn-sm" onclick="openInventoryModal(' + t.id + ')">\ud83d\udce6 Stock</button>' +
                '<button class="admin-btn admin-btn-sm" onclick="openEditTypeModal(' + t.id + ')">Edit</button>' +
                '<button class="admin-btn admin-btn-sm danger" onclick="deleteAccountType(' + t.id + ', \'' + t.title.replace(/'/g, '') + '\')">Delete</button>' +
            '</div>' +
        '</div>';
    }).join('');
}

function openAddAccountModal() {
    document.getElementById('serviceModalTitle').textContent = 'Add Account Type';
    document.getElementById('serviceModalBody').innerHTML = `
        <div class="admin-form-group"><label>Server</label>
            <select class="admin-input" id="na_server">${SERVERS.map(r=>`<option ${r===_currentServer?'selected':''} value="${r}">${r}</option>`).join('')}</select>
        </div>
        <div class="admin-form-group"><label>Title</label><input class="admin-input" id="na_title" placeholder="e.g. Handleveled Premium"></div>
        <div class="admin-form-group"><label>Description</label><input class="admin-input" id="na_desc" placeholder="Short description"></div>
        <div class="admin-form-group"><label>Price (\u20ac)</label><input class="admin-input" type="number" step="0.01" id="na_price" placeholder="37.49"></div>
        <div class="admin-form-group"><label>Sale Price (\u20ac, empty = none)</label><input class="admin-input" type="number" step="0.01" id="na_sale"></div>
        <div class="admin-form-group"><label>Blue Essence</label><input class="admin-input" type="number" id="na_be" value="40000"></div>
        <div class="admin-form-group"><label>Icon path</label><input class="admin-input" id="na_icon" value="pics/handleveled.png"></div>
        <div class="admin-form-group"><label>Skin Account?</label>
            <select class="admin-input" id="na_skin"><option value="0">No</option><option value="1">Yes</option></select>
        </div>
        <div class="admin-form-group"><label>Display Order</label><input class="admin-input" type="number" id="na_order" value="99"></div>
        <div style="margin-top:1rem;"><button class="admin-btn" onclick="addAccountType()">Add Type</button></div>`;
    document.getElementById('serviceModal').classList.add('open');
}

function openEditTypeModal(id) {
    const t = _accountTypes[id];
    if (!t) return;
    document.getElementById('serviceModalTitle').textContent = `Edit: ${t.title} (${t.server})`;
    document.getElementById('serviceModalBody').innerHTML = `
        <div class="admin-form-group"><label>Title</label><input class="admin-input" id="et_title" value="${t.title}"></div>
        <div class="admin-form-group"><label>Description</label><input class="admin-input" id="et_desc" value="${t.description||''}" ></div>
        <div class="admin-form-group"><label>Price (\u20ac)</label><input class="admin-input" type="number" step="0.01" id="et_price" value="${t.price}"></div>
        <div class="admin-form-group"><label>Sale Price (\u20ac, empty = none)</label><input class="admin-input" type="number" step="0.01" id="et_sale" value="${t.discounted_price||''}" ></div>
        <div class="admin-form-group"><label>Blue Essence</label><input class="admin-input" type="number" id="et_be" value="${t.blue_essence||40000}"></div>
        <div class="admin-form-group"><label>Icon path</label><input class="admin-input" id="et_icon" value="${t.icon_path||''}" ></div>
        <div class="admin-form-group"><label>Active</label>
            <select class="admin-input" id="et_active"><option value="1" ${t.is_active?'selected':''}>Yes</option><option value="0" ${!t.is_active?'selected':''}>No</option></select>
        </div>
        <div class="admin-form-group"><label>Display Order</label><input class="admin-input" type="number" id="et_order" value="${t.display_order}"></div>
        <div style="margin-top:1rem;"><button class="admin-btn" onclick="saveAccountType(${t.id})">Save Changes</button></div>`;
    document.getElementById('serviceModal').classList.add('open');
}

async function addAccountType() {
    const sale = document.getElementById('na_sale').value;
    await adminPost('add_account_type', { server: document.getElementById('na_server').value, title: document.getElementById('na_title').value, description: document.getElementById('na_desc').value, price: document.getElementById('na_price').value, discounted_price: sale||null, blue_essence: document.getElementById('na_be').value, icon_path: document.getElementById('na_icon').value, is_skin_account: document.getElementById('na_skin').value, display_order: document.getElementById('na_order').value });
    closeServiceModal(); loadAdminAccounts();
}

async function saveAccountType(id) {
    const sale = document.getElementById('et_sale').value;
    await adminPost('update_account_type', { id, title: document.getElementById('et_title').value, description: document.getElementById('et_desc').value, price: document.getElementById('et_price').value, discounted_price: sale||null, blue_essence: document.getElementById('et_be').value, icon_path: document.getElementById('et_icon').value, is_active: document.getElementById('et_active').value, display_order: document.getElementById('et_order').value });
    closeServiceModal(); loadAdminAccounts();
}

async function deleteAccountType(id, title) {
    document.getElementById('deleteConfirmMsg').textContent = `Delete account type "${title}"? All associated stock will also be deleted.`;
    document.getElementById('deleteConfirmBtn').onclick = async () => { await adminPost('delete_account_type', { id }); closeDeleteConfirm(); loadAdminAccounts(); };
    document.getElementById('deleteConfirmModal').classList.add('open');
}

async function openInventoryModal(typeId) {
    const t = _accountTypes[typeId];
    if (!t) return;
    document.getElementById('serviceModalTitle').textContent = `Stock: ${t.title} (${t.server})`;
    document.getElementById('serviceModalBody').innerHTML = `
        <div style="margin-bottom:1rem;">
            <h4 style="color:#9ca3af;font-size:0.82rem;margin-bottom:0.75rem;">ADD NEW ACCOUNT</h4>
            <div style="display:grid;grid-template-columns:1fr 1fr;gap:0.5rem;margin-bottom:0.5rem;">
                <input class="admin-input" id="inv_user" placeholder="Username / Riot ID">
                <input class="admin-input" id="inv_pass" placeholder="Password">
            </div>
            <div style="display:grid;grid-template-columns:1fr 1fr;gap:0.5rem;margin-bottom:0.5rem;">
                <input class="admin-input" id="inv_email" placeholder="Email (optional)">
                <input class="admin-input" id="inv_epass" placeholder="Email Password (optional)">
            </div>
            <input class="admin-input" id="inv_notes" placeholder="Notes (optional)" style="width:100%;margin-bottom:0.5rem;">
            <button class="admin-btn" onclick="addInventoryItem(${typeId})">+ Add Account</button>
        </div>
        <div id="inventoryList"><div style="color:#6b7280;text-align:center;padding:1rem;">Loading...</div></div>`;
    document.getElementById('serviceModal').classList.add('open');
    loadInventoryList(typeId);
}

async function loadInventoryList(typeId) {
    const data = await adminFetch(`get_account_inventory&type_id=${typeId}`);
    const list = document.getElementById('inventoryList');
    if (!list) return;
    if (!data.success || !(data.inventory||[]).length) {
        list.innerHTML = '<div style="color:#6b7280;text-align:center;padding:1rem;">No accounts in stock.</div>';
        return;
    }
    list.innerHTML = `
        <h4 style="color:#9ca3af;font-size:0.82rem;margin-bottom:0.5rem;">STOCK (${data.inventory.length})</h4>
        <table class="admin-table" style="font-size:0.78rem;">
            <thead><tr><th>Username</th><th>Password</th><th>Status</th><th>Actions</th></tr></thead>
            <tbody>${data.inventory.map(inv => `
                <tr>
                    <td style="font-family:monospace;">${inv.username}</td>
                    <td style="font-family:monospace;">${inv.password}</td>
                    <td><span class="status-badge status-${inv.status}">${inv.status}</span></td>
                    <td><div class="table-actions">
                        ${inv.status !== 'available' ? `<button class="admin-btn admin-btn-sm" onclick="setInventoryStatus(${inv.id},'available',${typeId})">Restore</button>` : ''}
                        <button class="admin-btn admin-btn-sm danger" onclick="removeInventoryItem(${inv.id},${typeId})">Delete</button>
                    </div></td>
                </tr>`).join('')}
            </tbody>
        </table>`;
}

async function addInventoryItem(typeId) {
    const username = document.getElementById('inv_user')?.value.trim();
    const password = document.getElementById('inv_pass')?.value.trim();
    if (!username || !password) { alert('Username and password are required!'); return; }
    await adminPost('add_account_inventory', { type_id: typeId, username, password, email: document.getElementById('inv_email')?.value||'', email_password: document.getElementById('inv_epass')?.value||'', notes: document.getElementById('inv_notes')?.value||''  });
    ['inv_user','inv_pass','inv_email','inv_epass','inv_notes'].forEach(id => { const el=document.getElementById(id); if(el) el.value=''; });
    loadInventoryList(typeId);
    loadAdminAccounts();
}

async function removeInventoryItem(id, typeId) {
    await adminPost('delete_account_inventory', { id });
    loadInventoryList(typeId);
    loadAdminAccounts();
}

async function setInventoryStatus(id, status, typeId) {
    await adminPost('update_inventory_status', { id, status });
    loadInventoryList(typeId);
    loadAdminAccounts();
}

// legacy stubs
async function saveAccount() {} async function addAccount() {} async function deleteAccount() {}

// ============================================
// BOOSTING PRICES MANAGEMENT
// ============================================
// BOOSTING PRICES MANAGEMENT
// ============================================
async function loadAdminBoostingServices() {
    const data = await adminFetch('get_boosting_services');
    const cont = document.getElementById('boostingPricesContent');
    if (!data.success) return;

    const typeLabels = {
        division_prices: 'Rank Boost (Division)',
        win_boost: 'Win Boost',
        placement: 'Placement',
        arena: 'Arena',
        mastery: 'Champion Mastery',
        option: 'Extra Option %',
        lp_gain: 'LP Gain %',
        restriction_removal: 'Restriction Removal',
        battle_pass: 'Battle Pass',
    };

    const grouped = {};
    data.services.forEach(s => {
        const opts = JSON.parse(s.options_json || '{}');
        const t = opts.type || 'other';
        if (!grouped[t]) grouped[t] = [];
        grouped[t].push({ ...s, opts });
    });

    cont.innerHTML = Object.entries(grouped).map(([type, items]) => `
        <div style="margin-bottom:2rem;">
            <h3 style="color:#a855f7;margin-bottom:0.75rem;font-size:0.95rem;font-weight:700;text-transform:uppercase;letter-spacing:0.05em;">${typeLabels[type] || type}</h3>
            <table class="admin-table" style="table-layout:fixed;width:100%;">
                <colgroup>
                    <col style="width:55%">
                    <col style="width:18%">
                    <col style="width:12%">
                    <col style="width:15%">
                </colgroup>
                <thead><tr><th>Service</th><th>Price (€)</th><th>Active</th><th>Save</th></tr></thead>
                <tbody>
                ${items.map(s => `
                    <tr>
                        <td style="font-size:0.82rem;word-break:break-word;">${s.service_name}</td>
                        <td><input class="admin-input" type="number" step="0.01" style="width:90px;" id="bp_${s.id}" value="${parseFloat(s.base_price).toFixed(2)}"></td>
                        <td><span class="status-badge ${s.is_active ? 'status-active':'status-cancelled'}">${s.is_active?'Yes':'No'}</span></td>
                        <td><button class="admin-btn admin-btn-sm" onclick="saveBoostPrice(${s.id}, ${s.is_active})">Save</button></td>
                    </tr>`).join('')}
                </tbody>
            </table>
        </div>`).join('');
}

async function saveBoostPrice(id, isActive) {
    const val = document.getElementById('bp_' + id)?.value;
    await adminPost('update_boosting_service', { id, base_price: val, is_active: isActive });
    showAdminToast('Price updated!');
}

// ============================================
// COACHING PRICES MANAGEMENT
// ============================================
async function loadAdminCoachingServices() {
    const data  = await adminFetch('get_coaching_services');
    const tbody = document.getElementById('coachingTableBody');
    if (!data.success) return;

    const nameMap = { copilot: 'Copilot Coaching', vod: 'VOD Review', pro: 'Pro Coaching' };

    tbody.innerHTML = data.services.map(s => {
        const spec = JSON.parse(s.specializations_json || '{}');
        return `<tr>
            <td><strong>${nameMap[s.service_name] || s.service_name}</strong></td>
            <td style="max-width:200px;font-size:0.82rem;color:#9ca3af;">${s.description}</td>
            <td><input class="admin-input" type="number" step="0.01" style="width:100px;" id="cs_${s.id}" value="${parseFloat(s.hourly_rate).toFixed(2)}"></td>
            <td>${spec.unit || 'game'}</td>
            <td><span class="status-badge ${s.is_active ? 'status-active':'status-cancelled'}">${s.is_active?'Active':'Inactive'}</span></td>
            <td><button class="admin-btn admin-btn-sm" onclick="saveCoachingPrice(${s.id}, ${s.is_active})">Save</button></td>
        </tr>`;
    }).join('');
}

async function saveCoachingPrice(id, isActive) {
    const val = document.getElementById('cs_' + id)?.value;
    await adminPost('update_coaching_service', { id, hourly_rate: val, is_active: isActive });
    showAdminToast('Price updated!');
}

// ============================================
// SHARED ADMIN MODAL HELPER
// ============================================
function showAdminModal(title, bodyHtml) {
    const modal = document.getElementById('orderModal'); // reuse existing modal
    document.getElementById('serviceModalTitle').textContent = title;
    const body = document.getElementById('orderModalBody');
    if (body) body.innerHTML = bodyHtml;
    modal.classList.add('open');
}

function closeModal() {
    document.getElementById('orderModal')?.classList.remove('open');
}

function showAdminToast(msg) {
    const t = document.createElement('div');
    t.style.cssText = 'position:fixed;bottom:2rem;right:2rem;background:#a855f7;color:#fff;padding:0.75rem 1.5rem;border-radius:0.75rem;font-weight:700;z-index:99999;animation:payModalIn 0.2s ease;';
    t.textContent = msg;
    document.body.appendChild(t);
    setTimeout(() => t.remove(), 2500);
}

// Helper for POST admin actions (used by service management)
async function adminPostData(data) {
    return adminPost(data.action, data);
}
// ============================================
// WORKERS (Boosters & Coaches)
// ============================================

let _currentWorkerRole = 'booster';
let _currentWorkerId   = null;
let _workersList       = [];

async function loadWorkers(role) {
    _currentWorkerRole = role;
    const prefix   = role === 'coach' ? 'coach' : 'booster';
    const orderType = role === 'coach' ? 'coaching' : 'boosting';

    // Load workers
    const wData = await adminFetch(`get_workers&worker_role=${role}`);
    //console.log('loadWorkers response:', role, wData);
    const workers = wData.workers || [];
    _workersList = workers;

    // Stats
    const available = wData.available_count || 0;
    const total     = workers.length;
    const active    = workers.filter(w => w.in_progress > 0).length;

    if (role === 'booster') {
        document.getElementById('boosterAvailableCount').textContent = available;
        document.getElementById('boosterWorkerCount').textContent    = total;
        document.getElementById('boosterActiveCount').textContent    = active;
        const badge = document.getElementById('boostersBadge');
        if (available > 0) { badge.textContent = available; badge.style.display = 'inline'; }
        else badge.style.display = 'none';
    } else {
        document.getElementById('coachAvailableCount').textContent = available;
        document.getElementById('coachWorkerCount').textContent    = total;
        document.getElementById('coachActiveCount').textContent    = active;
        const badge = document.getElementById('coachesBadge');
        if (available > 0) { badge.textContent = available; badge.style.display = 'inline'; }
        else badge.style.display = 'none';
    }

    // Workers table
    const tbodyId = role === 'coach' ? 'coachesTableBody' : 'boostersTableBody';
    const tbody = document.getElementById(tbodyId);
    //console.log('tbody lookup:', tbodyId, '->', tbody ? 'FOUND' : 'NULL');
    if (!tbody) {
        console.error('Workers tbody not found:', tbodyId, '- all IDs:', [...document.querySelectorAll('[id*="Table"]')].map(e=>e.id));
    } else {
        tbody.innerHTML = workers.length ? workers.map(w => `
            <tr>
                <td>
                    <span class="user-avatar-sm">${w.avatar_initial || '?'}</span>
                    ${w.first_name || '-'} ${w.last_name || ''}
                    <div style="font-size:0.75rem;color:#6b7280;">${w.email}</div>
                </td>
                <td>
                    ${w.in_progress > 0
                        ? `<span class="status-badge status-processing">${w.in_progress} active</span>`
                        : '<span style="color:#6b7280;font-size:0.82rem;">None</span>'
                    }
                </td>
                <td><strong style="color:#22c55e;">${w.total_completed}</strong></td>
                <td style="color:#a855f7;font-weight:700;">€${parseFloat(w.total_earnings).toFixed(2)}</td>
                <td><span class="status-badge ${w.is_active == 1 ? 'status-active' : 'status-banned'}">${w.is_active == 1 ? 'Active' : 'Banned'}</span></td>
                <td>
                    <button class="admin-btn admin-btn-sm" onclick="openWorkerModal(${w.id}, '${(w.first_name||'').replace(/'/g,'')}', '${w.email}', '${w.avatar_initial||'?'}')">
                        View Orders
                    </button>
                </td>
            </tr>
        `).join('') : '<tr><td colspan="6" class="empty-table">No ' + prefix + 's found</td></tr>';
    }

    // Available orders to assign
    const aData = await adminFetch(`get_available_orders&order_type=${orderType}`);
    const aOrders = aData.orders || [];
    const aTbody  = document.getElementById(prefix + 'AvailableOrders');
    if (aTbody) {
        aTbody.innerHTML = aOrders.length ? aOrders.map(o => `
            <tr>
                <td><code style="color:#a855f7">${o.order_number}</code></td>
                <td>${o.product_name || '-'}</td>
                <td>${o.customer_name} <span style="color:#6b7280;font-size:0.75rem;">${o.customer_email_display||''}</span></td>
                <td>${o.currency_symbol}${parseFloat(o.total_amount).toFixed(2)}</td>
                <td>${formatDate(o.created_at)}</td>
                <td>
                    <select class="settings-input" style="padding:0.3rem 0.6rem;font-size:0.8rem;width:auto;" id="assign-select-${o.id}">
                        <option value="">— Select ${prefix} —</option>
                        ${workers.map(w => `<option value="${w.id}">${w.first_name || w.email}</option>`).join('')}
                    </select>
                    <button class="admin-btn admin-btn-sm primary" style="margin-left:0.4rem;" onclick="assignOrder(${o.id}, '${prefix}')">
                        Assign
                    </button>
                </td>
            </tr>
        `).join('') : `<tr><td colspan="6" class="empty-table">No unassigned ${prefix} orders 🎉</td></tr>`;
    }
}

async function assignOrder(orderId, prefix) {
    const select   = document.getElementById(`assign-select-${orderId}`);
    const workerId = select?.value;
    if (!workerId) { showMsg('', 'Select a ' + prefix + ' first', 'error'); return; }

    const res = await adminPost('admin_assign_order', { order_id: orderId, worker_id: workerId });
    if (res.success) {
        showAdminToast('✅ Order assigned!');
        loadWorkers(_currentWorkerRole);
    } else {
        showAdminToast('❌ ' + res.message);
    }
}

async function openWorkerModal(workerId, name, email, avatar) {
    _currentWorkerId = workerId;
    document.getElementById('workerModalAvatar').textContent = avatar;
    document.getElementById('workerModalName').textContent   = name;
    document.getElementById('workerModalEmail').textContent  = email;

    // Tab setup
    document.querySelectorAll('.admin-tab-btn[data-wtab]').forEach(btn => {
        btn.onclick = () => {
            document.querySelectorAll('.admin-tab-btn[data-wtab]').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            document.getElementById('worker-tab-processing').classList.toggle('active', btn.dataset.wtab === 'processing');
            document.getElementById('worker-tab-completed').classList.toggle('active',  btn.dataset.wtab === 'completed');
            if (btn.dataset.wtab === 'completed') loadWorkerOrders(workerId, 'completed');
        };
    });

    // Reset tabs
    document.querySelectorAll('.admin-tab-btn[data-wtab]').forEach(b => b.classList.remove('active'));
    document.querySelector('.admin-tab-btn[data-wtab="processing"]').classList.add('active');
    document.getElementById('worker-tab-processing').classList.add('active');
    document.getElementById('worker-tab-completed').classList.remove('active');

    await loadWorkerOrders(workerId, 'processing');
    document.getElementById('workerModal').classList.add('open');
}

function closeWorkerModal() {
    document.getElementById('workerModal').classList.remove('open');
    _currentWorkerId = null;
}

async function loadWorkerOrders(workerId, filter) {
    const data   = await adminFetch(`get_worker_orders&worker_id=${workerId}&filter=${filter}`);
    const orders = data.orders || [];

    if (filter === 'processing') {
        const tbody = document.getElementById('workerProcessingBody');
        tbody.innerHTML = orders.length ? orders.map(o => `
            <tr>
                <td><code style="color:#a855f7">${o.order_number}</code></td>
                <td>${o.product_name || '-'}</td>
                <td>${o.customer_name}</td>
                <td>${o.currency_symbol}${parseFloat(o.total_amount).toFixed(2)}</td>
                <td>${formatDate(o.claimed_at)}</td>
                <td>
                    <button class="admin-btn admin-btn-sm danger" onclick="unassignOrder(${o.id})">
                        Unassign
                    </button>
                </td>
            </tr>
        `).join('') : '<tr><td colspan="6" class="empty-table">No active orders</td></tr>';
    } else {
        const tbody = document.getElementById('workerCompletedBody');
        tbody.innerHTML = orders.length ? orders.map(o => `
            <tr>
                <td><code style="color:#a855f7">${o.order_number}</code></td>
                <td>${o.product_name || '-'}</td>
                <td>${o.customer_name}</td>
                <td style="color:#22c55e;font-weight:700;">${o.currency_symbol}${parseFloat(o.total_amount).toFixed(2)}</td>
                <td>${formatDate(o.created_at)}</td>
            </tr>
        `).join('') : '<tr><td colspan="5" class="empty-table">No completed orders yet</td></tr>';
    }
}

async function unassignOrder(orderId) {
    const res = await adminPost('admin_unassign_order', { order_id: orderId });
    if (res.success) {
        showAdminToast('↩ Order returned to pool');
        await loadWorkerOrders(_currentWorkerId, 'processing');
        loadWorkers(_currentWorkerRole);
    } else {
        showAdminToast('❌ ' + res.message);
    }
}