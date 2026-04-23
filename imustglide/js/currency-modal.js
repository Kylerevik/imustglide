/**
 * CURRENCY-MODAL.JS - FIXED VERSION
 * iMUSTGLIDE Gaming Platform
 * 
 * Handles:
 * - Currency modal open/close
 * - Currency selection with UI update
 * - Language selection with UI update
 * - Local storage for preferences
 */

// ============================================
// MODAL OPEN/CLOSE
// ============================================

document.addEventListener('DOMContentLoaded', function() {
    const modal = document.getElementById('currencyModal');
    const openModalBtn = document.getElementById('openCurrencyModal');
    const openModalFooterBtn = document.getElementById('openCurrencyModalFooter');
    const closeModalBtn = document.getElementById('closeModal');
    const modalOverlay = document.querySelector('.modal-overlay');
    
    // Open modal
    function openModal() {
        if (modal) {
            modal.classList.add('active');
            document.body.style.overflow = 'hidden'; // Prevent scrolling
        }
    }
    
    // Close modal
    function closeModal() {
        if (modal) {
            modal.classList.remove('active');
            document.body.style.overflow = ''; // Restore scrolling
        }
    }
    
    // Event listeners
    if (openModalBtn) {
        openModalBtn.addEventListener('click', openModal);
    }
    
    if (openModalFooterBtn) {
        openModalFooterBtn.addEventListener('click', openModal);
    }
    
    if (closeModalBtn) {
        closeModalBtn.addEventListener('click', closeModal);
    }
    
    if (modalOverlay) {
        modalOverlay.addEventListener('click', closeModal);
    }
    
    // Close on ESC key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && modal && modal.classList.contains('active')) {
            closeModal();
        }
    });
});

// ============================================
// CURRENCY SELECTION - FIXED
// ============================================

document.addEventListener('DOMContentLoaded', function() {
    const currencyOptions = document.querySelectorAll('.modal-option[data-currency]');
    
    currencyOptions.forEach(option => {
        option.addEventListener('click', function() {
            const currency = this.getAttribute('data-currency');
            const symbol = this.getAttribute('data-symbol');
            
            // Save to localStorage
            localStorage.setItem('selectedCurrency', currency);
            localStorage.setItem('currencySymbol', symbol);
            
            // Update all currency buttons
            updateCurrencyDisplay(currency, symbol);
            
            // ✅ FIX: Update active state in modal immediately
            currencyOptions.forEach(opt => opt.classList.remove('active'));
            this.classList.add('active');
            
            //console.log('✅ Currency changed to:', currency, symbol);
        });
    });
    
    // Load saved currency on page load
    const savedCurrency = localStorage.getItem('selectedCurrency') || 'EUR';
    const savedSymbol = localStorage.getItem('currencySymbol') || '€';
    updateCurrencyDisplay(savedCurrency, savedSymbol);
    
    // Set initial active state
    setActiveCurrency(savedCurrency);
});

// ============================================
// LANGUAGE SELECTION - FIXED
// ============================================

document.addEventListener('DOMContentLoaded', function() {
    const languageOptions = document.querySelectorAll('.modal-option[data-lang]');
    
    languageOptions.forEach(option => {
        option.addEventListener('click', function() {
            const language = this.getAttribute('data-lang');
            
            // Save to localStorage
            localStorage.setItem('selectedLanguage', language);
            
            // Update all language displays
            updateLanguageDisplay(language);
            
            // ✅ FIX: Update active state in modal immediately
            languageOptions.forEach(opt => opt.classList.remove('active'));
            this.classList.add('active');
            
            //console.log('✅ Language changed to:', language);
        });
    });
    
    // Load saved language on page load
    const savedLanguage = localStorage.getItem('selectedLanguage') || 'EN';
    updateLanguageDisplay(savedLanguage);
    
    // Set initial active state
    setActiveLanguage(savedLanguage);
});

// ============================================
// UPDATE DISPLAY FUNCTIONS
// ============================================

function updateCurrencyDisplay(currency, symbol) {
    const currencyButtons = document.querySelectorAll('.currency-btn');
    const savedLanguage = localStorage.getItem('selectedLanguage') || 'EN';
    
    currencyButtons.forEach(btn => {
        btn.textContent = `${currency} | ${savedLanguage} (${symbol})`;
    });
}

function updateLanguageDisplay(language) {
    const currencyButtons = document.querySelectorAll('.currency-btn');
    const savedCurrency = localStorage.getItem('selectedCurrency') || 'EUR';
    const savedSymbol = localStorage.getItem('currencySymbol') || '€';
    
    currencyButtons.forEach(btn => {
        btn.textContent = `${savedCurrency} | ${language} (${savedSymbol})`;
    });
}

// ============================================
// SET ACTIVE STATE FUNCTIONS - NEW
// ============================================

function setActiveCurrency(currency) {
    const currencyOptions = document.querySelectorAll('.modal-option[data-currency]');
    
    currencyOptions.forEach(option => {
        if (option.getAttribute('data-currency') === currency) {
            option.classList.add('active');
        } else {
            option.classList.remove('active');
        }
    });
}

function setActiveLanguage(language) {
    const languageOptions = document.querySelectorAll('.modal-option[data-lang]');
    
    languageOptions.forEach(option => {
        if (option.getAttribute('data-lang') === language) {
            option.classList.add('active');
        } else {
            option.classList.remove('active');
        }
    });
}

//console.log('✅ Currency-modal.js loaded (FIXED VERSION)');

// ============================================
// COMING SOON MODAL
// ============================================

const COMING_SOON_DATA = {
    'Top Up': {
        features: ['All currencies', 'Instant top-up', 'Best rates']
    },
    'Pro Teammate': {
        features: ['High-elo players', 'Rank up faster', 'Flexible schedule']
    },
    'Lootboxes': {
        features: ['Exclusive rewards', 'Instant opening', 'Guaranteed value']
    },
    'Affiliate Program': {
        features: ['Earn commissions', 'Real-time tracking', 'Monthly payouts']
    },
    'Discord Server': {
        features: ['Live community', 'Exclusive giveaways', 'Direct support']
    },
    'Help Center': {
        features: ['24/7 support', 'Step-by-step guides', 'Fast responses']
    },
    'Contact Us': {
        features: ['Live chat', 'Email support', 'Quick replies']
    },
    'Work With Us': {
        features: ['Flexible work', 'Great pay', 'Growing team']
    },
    'Become Affiliate': {
        features: ['Earn commissions', 'Real-time tracking', 'Monthly payouts']
    },
    'Definitions': {
        features: ['Gaming glossary', 'Clear explanations', 'Always updated']
    },
    'Loyalty Program': {
        features: ['Earn LP points', 'Exclusive rewards', 'VIP perks']
    },
    'Privacy Policy': {
        features: ['Data protection', 'GDPR compliant', 'Transparent practices']
    },
    'Terms and Conditions': {
        features: ['Clear rules', 'Fair policies', 'User protection']
    },
    'Cookie Policy': {
        features: ['Cookie control', 'Privacy first', 'Easy opt-out']
    },
    'DMCA': {
        features: ['IP protection', 'Legal compliance', 'Fast takedowns']
    },
};

const DEFAULT_FEATURES = ['Coming very soon', 'Stay tuned', 'Worth the wait'];

function openComingSoon(featureName) {
    const modal        = document.getElementById('comingSoonModal');
    const titleEl      = document.getElementById('comingSoonTitle');
    const featuresEl   = document.getElementById('comingSoonFeatures');
    if (!modal) return;

    if (titleEl) titleEl.textContent = featureName;

    // Update features dynamically
    if (featuresEl) {
        const data     = COMING_SOON_DATA[featureName];
        const features = data ? data.features : DEFAULT_FEATURES;
        featuresEl.innerHTML = features.map(f => `
            <div class="cs-feature">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/></svg>
                ${f}
            </div>`).join('');
    }

    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeComingSoon() {
    const modal = document.getElementById('comingSoonModal');
    if (!modal) return;
    modal.classList.remove('active');
    document.body.style.overflow = '';
}

document.addEventListener('DOMContentLoaded', function () {
    const closeBtn   = document.getElementById('closeComingSoonModal');
    const dismissBtn = document.getElementById('dismissComingSoon');
    const overlay    = document.getElementById('comingSoonOverlay');

    if (closeBtn)   closeBtn.addEventListener('click', closeComingSoon);
    if (dismissBtn) dismissBtn.addEventListener('click', closeComingSoon);
    if (overlay)    overlay.addEventListener('click', closeComingSoon);

    document.addEventListener('keydown', function (e) {
        const modal = document.getElementById('comingSoonModal');
        if (e.key === 'Escape' && modal && modal.classList.contains('active')) {
            closeComingSoon();
        }
    });
});