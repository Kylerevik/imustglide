// ============================================
// PROFILE - NEW SIDEBAR LAYOUT
// ============================================

let currentUser = null;
let sidebarLocked = localStorage.getItem('sidebar-locked') === 'true';
let _profileOrders = [];

// PAGE INIT
document.addEventListener('DOMContentLoaded', async function() {
    // Check session
    await checkSession();
    
    // Initialize sidebar
    initSidebar();
    
    // Initialize routing
    initRouting();
    
    // Initialize tabs
    initTabs();
    
    // Load user data
    await loadUserData();
    
    // Load loyalty data
    await loadLoyaltyData();
});

// SESSION CHECK
async function checkSession() {
    try {
        const response = await fetch('api/check_session.php');
        const data = await response.json();
        
        if (!data.logged_in) {
            window.location.href = 'login.html';
            return;
        }
        
        currentUser = data.user;
        
        // Update user name
        document.getElementById('userName').textContent = data.user.first_name || data.user.email.split('@')[0];

        // Role alapú panel linkek megjelenítése
        const role = data.user.role;
        if (role === 'admin') {
            const adminLink = document.getElementById('adminPanelLink');
            if (adminLink) adminLink.style.display = 'block';
        }
        if (role === 'booster') {
            const boosterLink = document.getElementById('boosterPanelLink');
            if (boosterLink) boosterLink.style.display = 'block';
        }
        if (role === 'coach') {
            const coachLink = document.getElementById('coachPanelLink');
            if (coachLink) coachLink.style.display = 'block';
        }
        
    } catch (error) {
        console.error('Session check error:', error);
        window.location.href = 'login.html';
    }
}

// SIDEBAR
function initSidebar() {
    const sidebar = document.getElementById('sidebar');
    const lockBtn = document.getElementById('sidebarLockBtn');
    const lockIcon = document.getElementById('lockIcon');
    
    // Apply locked state from localStorage
    if (sidebarLocked) {
        sidebar.classList.add('locked');
        lockIcon.textContent = '🔒';
    }
    
    // Lock button click
    lockBtn.addEventListener('click', () => {
        sidebarLocked = !sidebarLocked;
        
        if (sidebarLocked) {
            sidebar.classList.add('locked');
            lockIcon.textContent = '🔒';
            localStorage.setItem('sidebar-locked', 'true');
        } else {
            sidebar.classList.remove('locked');
            lockIcon.textContent = '🔓';
            localStorage.setItem('sidebar-locked', 'false');
        }
    });
}

// ROUTING
function initRouting() {
    const urlParams = new URLSearchParams(window.location.search);
    const page = urlParams.get('page') || 'dashboard';
    
    // Show requested page
    showPage(page);
    
    // Handle navigation clicks
    document.querySelectorAll('.nav-link').forEach(link => {
        if (link.classList.contains('coming-soon-nav')) return;
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const page = link.dataset.page;
            
            // Update URL
            const newUrl = `profile.html?page=${page}`;
            window.history.pushState({ page }, '', newUrl);
            
            showPage(page);
        });
    });
    
    // Handle browser back/forward
    window.addEventListener('popstate', (e) => {
        const page = e.state?.page || 'dashboard';
        showPage(page);
    });
}

function showPage(page) {
    // Hide all pages
    document.querySelectorAll('.page-content').forEach(p => {
        p.classList.remove('active');
    });
    
    // Show requested page
    const pageElement = document.getElementById(`page-${page}`);
    if (pageElement) {
        pageElement.classList.add('active');
    }
    
    // Update active nav link
    document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.remove('active');
        if (link.dataset.page === page) {
            link.classList.add('active');
        }
    });
}

// TABS
function initTabs() {
    const tabBtns = document.querySelectorAll('.tab-btn');
    
    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const tabName = btn.dataset.tab;
            
            // Remove active from all
            tabBtns.forEach(b => b.classList.remove('active'));
            document.querySelectorAll('.tab-pane').forEach(p => p.classList.remove('active'));
            
            // Add active to clicked
            btn.classList.add('active');
            document.getElementById(`tab-${tabName}`).classList.add('active');
        });
    });
}

// LOAD USER DATA
async function loadUserData() {
    try {
        const response = await fetch('api/get_profile.php');
        const data = await response.json();
        
        if (data.success) {
            // Update dashboard values
            document.getElementById('storeCreditsValue').textContent = (data.stats.store_credits_balance || 0).toFixed(2);
            document.getElementById('lootPointsValue').textContent = formatNumber(data.user.loyalty_points || 0);
            
            // Load orders
            loadOrders(data.orders || []);
            
            // Load points history
            loadPointsHistory(data.points_history || []);

            // Load store credits history
            loadCreditsHistory(data.credits_history || []);
        }
    } catch (error) {
        console.error('Error loading user data:', error);
    }
}

// LOAD LOYALTY DATA
async function loadLoyaltyData() {
    try {
        const response = await fetch('api/get_loyalty_info.php');
        const data = await response.json();
        
        if (data.success) {
            // ✅ Rank progression mapping (from loyalty-program.html)
            const rankData = {
                'Starter': { emoji: '⭐', next: 'Recruit', nextXP: 200 },
                'Recruit': { emoji: '🛡️', next: 'Guardian', nextXP: 1000 },
                'Guardian': { emoji: '🛡️', next: 'Noble', nextXP: 2500 },
                'Noble': { emoji: '👑', next: 'Star Member', nextXP: 5000 },
                'Star Member': { emoji: '⭐', next: 'Diamond', nextXP: 10000 },
                'Diamond': { emoji: '💎', next: 'Champion', nextXP: 20000 },
                'Champion': { emoji: '🏆', next: 'Legend', nextXP: 50000 },
                'Legend': { emoji: '🏆', next: 'Eternal', nextXP: 100000 },
                'Eternal': { emoji: '♾️', next: null, nextXP: null }
            };
            
            const currentRankName = data.rank;
            const currentXP = data.xp;
            const rankInfo = rankData[currentRankName] || rankData['Starter'];
            
            // Update rank display
            document.getElementById('rankEmoji').textContent = rankInfo.emoji;
            document.getElementById('currentRank').textContent = currentRankName;
            document.getElementById('totalXP').textContent = currentXP;
            
            // Update progress bar
            if (rankInfo.next) {
                // Calculate progress to next rank
                const previousRankXP = getPreviousRankXP(currentRankName);
                const currentProgress = currentXP - previousRankXP;
                const totalNeeded = rankInfo.nextXP - previousRankXP;
                const progressPercent = Math.min(100, Math.max(0, (currentProgress / totalNeeded) * 100));
                
                document.getElementById('loyaltyProgressBar').style.width = progressPercent.toFixed(1) + '%';
                
                // ✅ JOBB FELSŐ SAROK - Next Rank megjelenítése
                document.getElementById('currentRankLabel').textContent = `${currentRankName} (${currentXP} XP)`;
                document.getElementById('nextRankLabel').textContent = `${rankInfo.next} (${rankInfo.nextXP} XP)`;
                
                const xpNeeded = Math.max(0, rankInfo.nextXP - currentXP);
                document.getElementById('progressInfo').textContent = `${currentXP} / ${rankInfo.nextXP} XP (${xpNeeded} XP needed)`;
            } else {
                // Max rank (Eternal)
                document.getElementById('loyaltyProgressBar').style.width = '100%';
                document.getElementById('currentRankLabel').textContent = `${currentRankName} (${currentXP} XP)`;
                document.getElementById('nextRankLabel').textContent = 'Max Rank';
                document.getElementById('progressInfo').textContent = 'Max rank achieved! 🎉';
            }
            
            // Update benefits
            const benefitsList = document.getElementById('benefitsList');
            let benefits = [];
            
            if (data.cashback_percent > 0) {
                benefits.push(`<span class="benefit-badge">${data.cashback_percent}% Cashback</span>`);
            }
            if (data.discount_percent > 0) {
                benefits.push(`<span class="benefit-badge">${data.discount_percent}% Discount</span>`);
            }
            if (data.perks) {
                const perksArray = data.perks.split(',').map(p => p.trim());
                perksArray.forEach(perk => {
                    benefits.push(`<span class="benefit-badge">${perk}</span>`);
                });
            }
            
            if (benefits.length > 0) {
                benefitsList.innerHTML = benefits.join('');
            } else {
                benefitsList.innerHTML = '<span class="benefit-badge">No perks yet</span>';
            }
            
            // Load achievements
            loadAchievements(data.achievements || []);
        }
    } catch (error) {
        console.error('Error loading loyalty data:', error);
    }
}

// Helper: Get previous rank XP threshold
function getPreviousRankXP(currentRank) {
    const thresholds = {
        'Starter': 0,
        'Recruit': 0,
        'Guardian': 200,
        'Noble': 1000,
        'Star Member': 2500,
        'Diamond': 5000,
        'Champion': 10000,
        'Legend': 20000,
        'Eternal': 50000
    };
    return thresholds[currentRank] || 0;
}

// LOAD ORDERS
function loadOrders(orders) {
    const tbody = document.getElementById('ordersTableBody');
    _profileOrders = orders;
    
    if (orders.length === 0) {
        tbody.innerHTML = '<tr><td colspan="5" class="empty-table">No orders yet</td></tr>';
        return;
    }
    
    tbody.innerHTML = orders.map((order, idx) => `
        <tr>
            <td>
                <div style="font-weight:600;color:#fff;">${order.product_name}</div>
                <div style="font-size:0.78rem;color:#6b7280;margin-top:2px;">${order.order_number}</div>
            </td>
            <td><span class="status-badge status-${order.status}">${order.status}</span></td>
            <td>€${order.price.toFixed(2)}</td>
            <td>${formatDate(order.created_at)}</td>
            <td>
                <button class="order-info-btn" onclick="showOrderDetail(_profileOrders[${idx}])">
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z"/></svg>
                    Details
                </button>
            </td>
        </tr>
    `).join('');
}

function showOrderDetail(order) {
    const methodIcons = { stripe: '💳', store_credits: '💰', paypal: '🅿️' };
    const methodNames = { stripe: 'Stripe (Card)', store_credits: 'Store Credits', paypal: 'PayPal' };
    const icon   = methodIcons[order.payment_method] || '💳';
    const method = methodNames[order.payment_method] || order.payment_method;

    const detailRow = order.detail ? `
        <div class="order-detail-item">
            <div class="order-detail-label">Details</div>
            <div class="order-detail-value" style="color:#a855f7;font-weight:600;">${order.detail}</div>
        </div>` : '';

    document.getElementById('orderDetailContent').innerHTML = `
        <div class="order-detail-header">
            <div class="order-detail-number">${order.order_number}</div>
            <span class="status-badge status-${order.status}">${order.status}</span>
        </div>
        <div class="order-detail-grid">
            <div class="order-detail-item">
                <div class="order-detail-label">Product</div>
                <div class="order-detail-value">${order.product_name}</div>
            </div>
            ${detailRow}
            <div class="order-detail-item">
                <div class="order-detail-label">Amount Paid</div>
                <div class="order-detail-value" style="color:#a855f7;font-weight:700;">€${order.price.toFixed(2)}</div>
            </div>
            <div class="order-detail-item">
                <div class="order-detail-label">Payment Method</div>
                <div class="order-detail-value">${icon} ${method}</div>
            </div>
            <div class="order-detail-item">
                <div class="order-detail-label">Loot Points Earned</div>
                <div class="order-detail-value" style="color:#a855f7;">+${order.loot_points_earned} LP 🔷</div>
            </div>
            <div class="order-detail-item">
                <div class="order-detail-label">Date</div>
                <div class="order-detail-value">${formatDate(order.created_at)}</div>
            </div>
        </div>`;
    document.getElementById('orderDetailModal').classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeOrderDetail() {
    document.getElementById('orderDetailModal')?.classList.remove('active');
    document.body.style.overflow = '';
}

// LOAD POINTS HISTORY
function loadPointsHistory(history) {
    const tbody = document.getElementById('pointsTableBody');
    
    if (history.length === 0) {
        tbody.innerHTML = '<tr><td colspan="2" class="empty-table">No points history</td></tr>';
        return;
    }
    
    tbody.innerHTML = history.map(item => `
        <tr>
            <td>
                <span class="${item.points_change > 0 ? 'points-positive' : 'points-negative'}">
                    ${item.points_change > 0 ? '+' : ''}${item.points_change}
                </span>
            </td>
            <td>${formatDate(item.created_at)}</td>
        </tr>
    `).join('');
}

// LOAD STORE CREDITS HISTORY
function loadCreditsHistory(history) {
    const tbody = document.getElementById('creditsTableBody');
    
    if (history.length === 0) {
        tbody.innerHTML = '<tr><td colspan="5" class="empty-table">No store credits history</td></tr>';
        return;
    }
    
    tbody.innerHTML = history.map(item => {
        const amount    = parseFloat(item.amount);
        const isUsed    = item.transaction_type === 'credit_use';
        const sign      = isUsed ? '-' : '+';
        const color     = isUsed ? '#f87171' : '#86efac';
        const statusCls = isUsed ? 'status-used' : 'status-received';
        const statusTxt = isUsed ? 'Used' : 'Received';
        const typeLabel = isUsed ? 'Credit Used' : 'Credit Added';
        const description = item.description || typeLabel;
        return `
            <tr>
                <td style="color:${color};font-weight:600;">${sign}€${Math.abs(amount).toFixed(2)}</td>
                <td>-</td>
                <td>${description}</td>
                <td><span class="status-badge ${statusCls}">${statusTxt}</span></td>
                <td>${formatDate(item.created_at)}</td>
            </tr>
        `;
    }).join('');
}

// LOAD ACHIEVEMENTS
function loadAchievements(achievements) {
    const recentContainer = document.getElementById('recentAchievements');
    const progressContainer = document.getElementById('progressAchievements');
    
    // This is just placeholder - real data will come from backend
    // Keep the hardcoded achievements for now
}

// HELPER: Show Points Tab
function showPointsTab() {
    const pointsTab = document.querySelector('[data-tab="points"]');
    if (pointsTab) pointsTab.click();
}

function showCreditsTab() {
    const creditsTab = document.querySelector('[data-tab="credits"]');
    if (creditsTab) {
        creditsTab.click();
        creditsTab.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
}

// HELPER FUNCTIONS
function formatNumber(num) {
    return new Intl.NumberFormat().format(num);
}

function formatDate(dateString) {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric' 
    });
}

// ============================================
// ACHIEVEMENTS FUNCTIONS
// ============================================

async function loadAchievementsPage() {
    try {
        const response = await fetch('api/get_achievements.php');
        const data = await response.json();
        
        if (data.success) {
            // Update stats
            document.getElementById('completedCount').textContent = data.stats.completed_count;
            document.getElementById('totalXPEarned').textContent = data.stats.total_xp_earned;
            document.getElementById('completionPercent').textContent = data.stats.completion_percent + '%';
            
            // Load completed achievements
            const completedContainer = document.getElementById('completedAchievements');
            if (data.completed.length > 0) {
                completedContainer.innerHTML = data.completed.map(ach => `
                    <div class="achievement-card">
                        <div class="achievement-card-icon">${ach.icon}</div>
                        <div class="achievement-card-content">
                            <div class="achievement-card-title">${ach.name}</div>
                            <div class="achievement-card-desc">${ach.description}</div>
                            <div class="achievement-card-xp">+${ach.xp_reward} XP</div>
                            <div class="achievement-card-date">Completed ${formatDate(ach.unlocked_at)}</div>
                        </div>
                    </div>
                `).join('');
            } else {
                completedContainer.innerHTML = '<div class="empty-state">No achievements yet. Start completing tasks!</div>';
            }
            
            // Load in-progress achievements
            const progressContainer = document.getElementById('progressAchievements');
            if (data.in_progress.length > 0) {
                progressContainer.innerHTML = data.in_progress.map(ach => `
                    <div class="progress-achievement">
                        <div class="progress-achievement-header">
                            <div class="progress-achievement-icon">${ach.icon}</div>
                            <div class="progress-achievement-info">
                                <div class="progress-achievement-title">${ach.name}</div>
                                <div class="progress-achievement-desc">${ach.description}</div>
                            </div>
                        </div>
                        <div class="progress-achievement-stats">
                            <span class="progress-text">${ach.progress} / ${ach.goal}</span>
                            <span class="progress-percent">${Math.round(ach.percent)}%</span>
                        </div>
                        <div class="achievement-progress-bar">
                            <div class="achievement-progress-fill" style="width: ${ach.percent}%"></div>
                        </div>
                    </div>
                `).join('');
            } else {
                progressContainer.innerHTML = '<div class="empty-state">No achievements in progress</div>';
            }
            
            // Load all achievements
            const allContainer = document.getElementById('allAchievements');
            const completedIds = data.completed.map(a => a.id);
            
            allContainer.innerHTML = data.all_achievements.map(ach => {
                const isCompleted = completedIds.includes(ach.id);
                return `
                    <div class="achievement-card ${isCompleted ? '' : 'locked'}">
                        <div class="achievement-card-icon">${ach.icon}</div>
                        <div class="achievement-card-content">
                            <div class="achievement-card-title">${ach.name}</div>
                            <div class="achievement-card-desc">${ach.description}</div>
                            <div class="achievement-card-xp">+${ach.xp_reward} XP</div>
                        </div>
                    </div>
                `;
            }).join('');
        }
    } catch (error) {
        console.error('Error loading achievements:', error);
    }
}

// Load achievements when page loads
document.addEventListener('DOMContentLoaded', function() {
    // Check if achievements page is active
    const urlParams = new URLSearchParams(window.location.search);
    const page = urlParams.get('page');
    
    if (page === 'achievements') {
        loadAchievementsPage();
    }
});

// Override showPage to load achievements
const originalShowPage = showPage;
showPage = function(page) {
    originalShowPage(page);
    
    if (page === 'achievements') {
        loadAchievementsPage();
    }
};

// ============================================
// SETTINGS FUNCTIONS
// ============================================

// Profil betöltése a settings mezőkbe
async function loadSettingsData() {
    try {
        const response = await fetch('api/get_profile.php');
        const data = await response.json();

        if (data.success) {
            const u = data.user;
            document.getElementById('settingsFirstName').value = u.first_name || '';
            document.getElementById('settingsLastName').value  = u.last_name  || '';
            document.getElementById('settingsEmail').value     = u.email      || '';
            document.getElementById('settingsPhone').value     = u.phone      || '';
            document.getElementById('settingsCountry').value   = u.country    || '';
            document.getElementById('settingsDiscord').value   = u.discord_username || '';
            document.getElementById('settingsLanguage').value  = u.preferred_language || 'EN';
            document.getElementById('settingsCurrency').value  = u.preferred_currency || 'EUR';
        }
    } catch (error) {
        console.error('Error loading settings:', error);
    }
}

// Profil mentése
async function saveProfile() {
    const msgEl = document.getElementById('profileUpdateMsg');

    const payload = {
        type:               'profile',
        first_name:         document.getElementById('settingsFirstName').value.trim(),
        last_name:          document.getElementById('settingsLastName').value.trim(),
        phone:              document.getElementById('settingsPhone').value.trim(),
        country:            document.getElementById('settingsCountry').value.trim(),
        discord_username:   document.getElementById('settingsDiscord').value.trim(),
        preferred_language: document.getElementById('settingsLanguage').value,
        preferred_currency: document.getElementById('settingsCurrency').value,
    };

    try {
        const response = await fetch('api/update_profile.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });
        const data = await response.json();

        showSettingsMsg(msgEl, data.message, data.success ? 'success' : 'error');

        if (data.success) {
            // Frissítjük a sidebar nevet és avatar initialt
            document.getElementById('userName').textContent = payload.first_name;
        }
    } catch (error) {
        showSettingsMsg(msgEl, 'Connection error. Please try again.', 'error');
    }
}

// Jelszó mentése
async function savePassword() {
    const msgEl = document.getElementById('passwordUpdateMsg');

    const payload = {
        type:             'password',
        current_password: document.getElementById('currentPassword').value,
        new_password:     document.getElementById('newPassword').value,
        confirm_password: document.getElementById('confirmPassword').value,
    };

    try {
        const response = await fetch('api/update_profile.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });
        const data = await response.json();

        showSettingsMsg(msgEl, data.message, data.success ? 'success' : 'error');

        if (data.success) {
            document.getElementById('currentPassword').value = '';
            document.getElementById('newPassword').value     = '';
            document.getElementById('confirmPassword').value = '';
        }
    } catch (error) {
        showSettingsMsg(msgEl, 'Connection error. Please try again.', 'error');
    }
}

// Helper: üzenet megjelenítése
function showSettingsMsg(el, message, type) {
    el.textContent  = message;
    el.className    = 'settings-msg ' + type;
    el.style.display = 'block';
    setTimeout(() => { el.style.display = 'none'; }, 4000);
}

// Settings betöltése amikor oda navigálnak
const _originalShowPage = showPage;
showPage = function(page) {
    _originalShowPage(page);
    if (page === 'settings') {
        loadSettingsData();
    }
};