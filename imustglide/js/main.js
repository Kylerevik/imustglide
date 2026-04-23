// ============================================
// MAIN.JS - Alapfunkciók és Globális Beállítások
// ============================================

// ============================================
// SCROLL ANIMATIONS
// ============================================

const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver(function(entries) {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

document.addEventListener('DOMContentLoaded', function() {
    // Observe elements for animation
    const animatedElements = document.querySelectorAll('.game-card, .blog-card, .faq-item, .step-card');
    
    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
        observer.observe(el);
    });
});

// ============================================
// GAME CARDS INTERACTION
// ============================================

document.addEventListener('DOMContentLoaded', function() {
    const gameCards = document.querySelectorAll('.game-card');
    
    gameCards.forEach(card => {
        card.addEventListener('click', function() {
            const gameName = this.querySelector('img')?.alt;
            //console.log('Selected game:', gameName);
            // Add your game selection logic here
        });
        
        // Add hover effect enhancement
        card.addEventListener('mouseenter', function() {
            this.style.boxShadow = '0 20px 40px rgba(168, 85, 247, 0.3)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.boxShadow = '';
        });
    });
});

// ============================================
// BLOG CARDS INTERACTION
// ============================================

document.addEventListener('DOMContentLoaded', function() {
    const blogCards = document.querySelectorAll('.blog-card');
    
    blogCards.forEach(card => {
        card.addEventListener('click', function() {
            const title = this.querySelector('h3')?.textContent;
            //console.log('Opening blog post:', title);
            // Add navigation logic here
        });
    });
});

// ============================================
// FOOTER INTERACTIONS
// ============================================

document.addEventListener('DOMContentLoaded', function() {
    // Service badges
    const serviceBadges = document.querySelectorAll('.service-badge');
    
    serviceBadges.forEach(badge => {
        badge.addEventListener('click', function() {
            const service = this.textContent.trim();
            //console.log('Selected service:', service);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    });
    
    // Discord buttons
    const discordBtns = document.querySelectorAll('.discord-btn, .footer-btn.discord');
    discordBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            openComingSoon('Discord Server');
        });
    });
    
    // Help buttons
    const helpBtns = document.querySelectorAll('.help-btn');
    helpBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            openComingSoon('Help Center');
        });
    });
});

// ============================================
// PREVIEW BUTTONS (Steps Section)
// ============================================

document.addEventListener('DOMContentLoaded', function() {
    const previewBtns = document.querySelectorAll('.preview-btn, .payment-btn');
    
    previewBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const buttonText = this.textContent.trim();
            //('Button clicked:', buttonText);
            
            if (buttonText.includes('Buy Now')) {
                alert('Redirecting to checkout...');
            } else if (buttonText.includes('Complete Payment')) {
                alert('Processing payment...');
            }
        });
    });
});

// ============================================
// SEARCH DROPDOWN
// ============================================

document.addEventListener('DOMContentLoaded', function () {
    const input    = document.getElementById('gameSearchInput');
    const dropdown = document.getElementById('searchDropdown');
    if (!input || !dropdown) return;

    // Open on focus
    input.addEventListener('focus', () => dropdown.classList.add('open'));

    // Filter on type
    input.addEventListener('input', function () {
        const q = this.value.toLowerCase().trim();
        const rows = dropdown.querySelectorAll('.search-game-row');
        rows.forEach(row => {
            const name = row.querySelector('.search-game-name')?.textContent.toLowerCase() || '';
            row.style.display = name.includes(q) ? '' : 'none';
        });
        dropdown.classList.add('open');
    });

    // Close on outside click
    document.addEventListener('click', function (e) {
        if (!input.closest('.search-container').contains(e.target)) {
            dropdown.classList.remove('open');
        }
    });

    // Close on ESC
    input.addEventListener('keydown', function (e) {
        if (e.key === 'Escape') dropdown.classList.remove('open');
    });
});

function scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

let currentStep = 1;

// Show specific step
function showStep(stepNumber, shouldScroll = true) {
    // Hide all steps
    document.querySelectorAll('.step-card').forEach(card => {
        card.classList.add('hidden');
    });
    
    // Show selected step
    const selectedStep = document.getElementById(`step${stepNumber}`);
    if (selectedStep) {
        selectedStep.classList.remove('hidden');
        currentStep = stepNumber;

        // Sync dots
        document.querySelectorAll('.step-dot').forEach((dot, i) => {
            dot.classList.toggle('active', i + 1 === stepNumber);
        });
        
        // Smooth scroll to steps section - CSAK ha shouldScroll = true
        if (shouldScroll) {
            const stepsSection = document.querySelector('.steps-section');
            if (stepsSection) {
                stepsSection.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
        }
    }
}

// Navigate to previous step
function prevStep() {
    let prevStepNumber = currentStep - 1;
    if (prevStepNumber < 1) {
        prevStepNumber = 3; // Loop back to last step
    }
    showStep(prevStepNumber);
}

// Navigate to next step
function nextStep() {
    let nextStepNumber = currentStep + 1;
    if (nextStepNumber > 3) {
        nextStepNumber = 1; // Loop back to first step
    }
    showStep(nextStepNumber);
}

// Keyboard navigation for steps
document.addEventListener('keydown', function(e) {
    const stepsSection = document.querySelector('.steps-section');
    if (!stepsSection) return;
    
    // Check if steps section is visible
    const rect = stepsSection.getBoundingClientRect();
    const isVisible = rect.top < window.innerHeight && rect.bottom >= 0;
    
    if (isVisible) {
        if (e.key === 'ArrowLeft') {
            prevStep();
        } else if (e.key === 'ArrowRight') {
            nextStep();
        }
    }
});

// Initialize - show first step on page load (WITHOUT scroll)
document.addEventListener('DOMContentLoaded', function() {
    showStep(1, false);
});