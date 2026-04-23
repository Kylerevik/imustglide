/**
 * NAVIGATION.JS
 * iMUSTGLIDE Gaming Platform
 * 
 * Handles:
 * - Game dropdown toggle
 * - Mobile menu toggle (if needed)
 * - Navbar interactions
 */

// ============================================
// GAME DROPDOWN
// ============================================

document.addEventListener('DOMContentLoaded', function() {
    const gameDropdown = document.getElementById('gameDropdown');
    
    if (gameDropdown) {
        const dropdownToggle = gameDropdown.querySelector('.dropdown-toggle');
        const dropdownMenu = gameDropdown.querySelector('.dropdown-menu');
        
        if (dropdownToggle && dropdownMenu) {
            // Toggle dropdown on click
            dropdownToggle.addEventListener('click', function(e) {
                e.stopPropagation();
                gameDropdown.classList.toggle('open');
            });
            
            // Close dropdown when clicking outside
            document.addEventListener('click', function(e) {
                if (!gameDropdown.contains(e.target)) {
                    gameDropdown.classList.remove('open');
                }
            });
            
            // Close dropdown when clicking on a game
            const dropdownGames = dropdownMenu.querySelectorAll('.dropdown-game');
            dropdownGames.forEach(game => {
                game.addEventListener('click', function() {
                    gameDropdown.classList.remove('open');
                });
            });
        }
    }
});

// ============================================
// MOBILE MENU (Optional - for future use)
// ============================================

document.addEventListener('DOMContentLoaded', function() {
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const navMenu = document.querySelector('.nav-menu');
    
    if (mobileMenuBtn && navMenu) {
        mobileMenuBtn.addEventListener('click', function() {
            navMenu.classList.toggle('active');
            mobileMenuBtn.classList.toggle('active');
        });
    }
});

// ============================================
// SMOOTH SCROLL (Optional)
// ============================================

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        if (href !== '#' && href.length > 1) {
            e.preventDefault();
            const target = document.querySelector(href);
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        }
    });
});

//console.log('✅ Navigation.js loaded');