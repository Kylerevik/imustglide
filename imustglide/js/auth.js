/**
 * AUTH.JS - COMPLETE WORKING VERSION
 * iMUSTGLIDE Gaming Platform
 */

// ============================================
// SESSION CHECK (all pages)
// ============================================

function renderUserNav(navRight, data) {
    const loginBtn = navRight.querySelector('.login-btn');
    if (!loginBtn) return; // dropdown már renderelve van

    const username = data.user.first_name || data.user.email.split('@')[0];
    const userRole = (data.user.role || 'customer').toLowerCase();

    let roleBasedMenuItems = '';

    if (userRole === 'admin') {
        roleBasedMenuItems += `
            <a href="admin-panel.html" class="user-dropdown-item">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" style="margin-right:8px"><path d="M19.43 12.98c.04-.32.07-.64.07-.98s-.03-.66-.07-.98l2.11-1.65c.19-.15.24-.42.12-.64l-2-3.46c-.12-.22-.39-.3-.61-.22l-2.49 1c-.52-.4-1.08-.73-1.69-.98l-.38-2.65C14.46 2.18 14.25 2 14 2h-4c-.25 0-.46.18-.49.42l-.38 2.65c-.61.25-1.17.59-1.69.98l-2.49-1c-.23-.09-.49 0-.61.22l-2 3.46c-.13.22-.07.49.12.64l2.11 1.65c-.04.32-.07.65-.07.98s.03.66.07.98l-2.11 1.65c-.19.15-.24.42-.12.64l2 3.46c.12.22.39.3.61.22l2.49-1c.52.4 1.08.73 1.69.98l.38 2.65c.03.24.24.42.49.42h4c.25 0 .46-.18.49-.42l.38-2.65c.61-.25 1.17-.59 1.69-.98l2.49 1c.23.09.49 0 .61-.22l2-3.46c.12-.22.07-.49-.12-.64l-2.11-1.65zM12 15.5c-1.93 0-3.5-1.57-3.5-3.5s1.57-3.5 3.5-3.5 3.5 1.57 3.5 3.5-1.57 3.5-3.5 3.5z"/></svg>
                Admin Panel
            </a>`;
    }

    if (userRole === 'booster') {
        roleBasedMenuItems += `
            <a href="booster-panel.html" class="user-dropdown-item">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" style="margin-right:8px"><path d="M12 2c-4 0-8 .5-8 4v9.5C4 17.43 5.57 19 7.5 19L6 20.5v.5h2.23l2-2H14l2 2h2v-.5L16.5 19c1.93 0 3.5-1.57 3.5-3.5V6c0-3.5-4-4-8-4zM7.5 17c-.83 0-1.5-.67-1.5-1.5S6.67 14 7.5 14s1.5.67 1.5 1.5S8.33 17 7.5 17zm3.5-7H6V6h5v4zm5.5 7c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zm1.5-7h-5V6h5v4z"/></svg>
                Booster Panel
            </a>`;
    }

    if (userRole === 'coach') {
        roleBasedMenuItems += `
            <a href="coach-panel.html" class="user-dropdown-item">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" style="margin-right:8px"><path d="M5 13.18v4L12 21l7-3.82v-4L12 17l-7-3.82zM12 3L1 9l11 6 9-4.91V17h2V9L12 3z"/></svg>
                Coach Panel
            </a>`;
    }

    const divider = roleBasedMenuItems ? '<div class="user-dropdown-divider"></div>' : '';

    loginBtn.outerHTML = `
        <div class="user-dropdown" id="userDropdown">
            <button class="user-btn">
                <span>${username}</span>
                <span>▼</span>
            </button>
            <div class="user-dropdown-menu">
                <a href="profile.html" class="user-dropdown-item">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" style="margin-right:8px"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/></svg>
                    Profile
                </a>
                ${roleBasedMenuItems}
                ${divider}
                <div class="user-dropdown-item" onclick="handleLogout()">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" style="margin-right:8px"><path d="M17 7l-1.41 1.41L18.17 11H8v2h10.17l-2.58 2.58L17 17l5-5zM4 5h8V3H4c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h8v-2H4V5z"/></svg>
                    Log out
                </div>
            </div>
        </div>`;

    const userDropdown = document.getElementById('userDropdown');
    if (!userDropdown) return;
    const userBtn = userDropdown.querySelector('.user-btn');
    userBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        userDropdown.classList.toggle('open');
    });
    document.addEventListener('click', (e) => {
        if (!userDropdown.contains(e.target)) userDropdown.classList.remove('open');
    });
}

document.addEventListener('DOMContentLoaded', async function() {
    const navRight = document.querySelector('.nav-right');
    if (!navRight) return;

    // ── 1. Azonnali render sessionStorage cache-ből ──
    try {
        const cached = sessionStorage.getItem('imustglide_session');
        if (cached) {
            const cachedData = JSON.parse(cached);
            if (cachedData.logged_in && !document.getElementById('userDropdown')) {
                renderUserNav(navRight, cachedData);
            }
        }
    } catch(e) {}

    // ── 2. Friss fetch a háttérben ──
    try {
        const response = await fetch('api/check_session.php');
        const data = await response.json();

        // Cache frissítése
        sessionStorage.setItem('imustglide_session', JSON.stringify(data));

        if (data.logged_in) {
            // Ha még nincs dropdown (cache hiányzott), rendereljük most
            if (!document.getElementById('userDropdown')) {
                renderUserNav(navRight, data);
            }
        } else {
            // Session lejárt — cache törlése
            sessionStorage.removeItem('imustglide_session');
            // Ha volt cache-ből renderelt dropdown, visszaállítjuk
            const dropdown = document.getElementById('userDropdown');
            if (dropdown) {
                dropdown.outerHTML = '<button class="login-btn">Login →</button>';
            }
            const freshBtn = navRight.querySelector('.login-btn');
            if (freshBtn) {
                freshBtn.addEventListener('click', (e) => {
                    e.preventDefault();
                    window.location.href = 'login.html';
                });
            }
        }
    } catch (error) {
        console.error('Session check error:', error);
        const loginBtn = document.querySelector('.login-btn');
        if (loginBtn) {
            loginBtn.addEventListener('click', (e) => {
                e.preventDefault();
                window.location.href = 'login.html';
            });
        }
    }
});

// ============================================
// LOGOUT HANDLER
// ============================================

async function handleLogout() {
    try {
        const response = await fetch('api/logout.php', {
            method: 'POST',
            headers: {
                'X-Requested-With': 'XMLHttpRequest'
            }
        });
        
        const data = await response.json();
        
        if (data.success) {
            // Cart teljes törlése kijelentkezéskor
            localStorage.removeItem('imustglide_cart');
            sessionStorage.removeItem('imustglide_session');
            if (typeof Cart !== 'undefined') {
                Cart.items = [];
                Cart.save();
            }
            // Redirect to homepage after logout
            window.location.href = 'index.html';
        }
    } catch (error) {
        console.error('Logout error:', error);
        // Reload page anyway
        window.location.reload();
    }
}

// ============================================
// LOGIN FORM HANDLER (login.html)
// ============================================

document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.getElementById('loginForm');
    if (!loginForm) return;
    
    loginForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        const errorDiv = document.getElementById('error-message');
        const successDiv = document.getElementById('success-message');
        
        // Hide previous messages
        errorDiv.style.display = 'none';
        successDiv.style.display = 'none';
        
        try {
            const response = await fetch('api/login.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password })
            });
            
            const data = await response.json();
            
            if (data.success) {
                successDiv.textContent = 'Login successful! Redirecting...';
                successDiv.style.display = 'block';
                
                setTimeout(() => {
                    window.location.href = 'index.html';
                }, 1000);
            } else {
                errorDiv.textContent = data.message || 'Invalid email or password';
                errorDiv.style.display = 'block';
            }
        } catch (error) {
            console.error('Login error:', error);
            errorDiv.textContent = 'Connection error. Please try again.';
            errorDiv.style.display = 'block';
        }
    });
});

// ============================================
// REGISTER FORM HANDLER (register.html)
// ============================================

document.addEventListener('DOMContentLoaded', function() {
    const registerForm = document.getElementById('registerForm');
    if (!registerForm) return;
    
    //('✅ Register form handler loaded');
    
    registerForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        //console.log('📝 Register form submitted');
        
        const email = document.getElementById('email').value;
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;
        const passwordConfirm = document.getElementById('password_confirm').value;
        const errorDiv = document.getElementById('error-message');
        const successDiv = document.getElementById('success-message');
        
        // Hide previous messages
        errorDiv.style.display = 'none';
        successDiv.style.display = 'none';
        
        // Check if passwords match
        if (password !== passwordConfirm) {
            //console.log('❌ Passwords do not match');
            errorDiv.textContent = 'Passwords do not match!';
            errorDiv.style.display = 'block';
            return;
        }
        
        //console.log('📤 Sending registration request...');
        
        try {
            const response = await fetch('api/register.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, username, password })
            });
            
            //console.log('📥 Response status:', response.status);
            
            // Get raw text first to check for multiple JSONs
            const rawText = await response.text();
            //console.log('📄 Raw response:', rawText);
            
            // Parse JSON
            let data;
            try {
                data = JSON.parse(rawText);
            } catch (parseError) {
                console.error('❌ JSON parse error:', parseError);
                errorDiv.textContent = 'Server error: Invalid response';
                errorDiv.style.display = 'block';
                return;
            }
            
            //console.log('✅ Parsed data:', data);
            
            if (data.success) {
                //console.log('✅ Registration successful!');
                successDiv.textContent = 'Registration successful! Redirecting to login...';
                successDiv.style.display = 'block';
                
                setTimeout(() => {
                    //console.log('↪️ Redirecting to login.html');
                    window.location.href = 'login.html';
                }, 3000);
            } else {
                //console.log('❌ Registration failed:', data.message);
                errorDiv.textContent = data.message || 'Registration failed';
                errorDiv.style.display = 'block';
            }
        } catch (error) {
            console.error('💥 Registration error:', error);
            errorDiv.textContent = 'Connection error. Please try again.';
            errorDiv.style.display = 'block';
        }
    });
});