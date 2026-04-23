/* ============================================
   LOL-PAGE.JS
   League of Legends dedikált oldal funkciók
   ============================================ */

document.addEventListener('DOMContentLoaded', function() {

    // ============================================
    // 1. TAB SWITCHING (Boosting, Accounts, Coaching)
    // ============================================
    
    const tabs = document.querySelectorAll('.lol-tab');
    const tabContents = document.querySelectorAll('.lol-tab-content');
    
    tabs.forEach(tab => {
        tab.addEventListener('click', function() {
            const targetTab = this.getAttribute('data-tab');
            
            // Remove active class from all tabs
            tabs.forEach(t => t.classList.remove('active'));
            tabContents.forEach(content => content.classList.remove('active'));
            
            // Add active class to clicked tab
            this.classList.add('active');
            document.getElementById(targetTab).classList.add('active');
        });
    });

    // ============================================
    // 2. SERVICE CAROUSEL NAVIGATION
    // ============================================
    
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    
    if (prevBtn && nextBtn) {
        prevBtn.addEventListener('click', function() {
            const activeContent = document.querySelector('.lol-tab-content.active');
            const serviceGrid = activeContent.querySelector('.service-grid');
            
            if (serviceGrid) {
                serviceGrid.scrollBy({
                    left: -320, // Scroll left by card width + gap
                    behavior: 'smooth'
                });
            }
        });
        
        nextBtn.addEventListener('click', function() {
            const activeContent = document.querySelector('.lol-tab-content.active');
            const serviceGrid = activeContent.querySelector('.service-grid');
            
            if (serviceGrid) {
                serviceGrid.scrollBy({
                    left: 320, // Scroll right by card width + gap
                    behavior: 'smooth'
                });
            }
        });
    }

    // ============================================
    // 3. SERVER SELECTOR
    // ============================================
    
    // Server selector is now handled by lol-server-accounts.js
    // (Dynamic card rendering based on selected server)


    // ============================================
    // 4. ACCOUNT CAROUSEL
    // ============================================
    
    const accountPrevBtn = document.getElementById('accountPrevBtn');
    const accountNextBtn = document.getElementById('accountNextBtn');
    
    if (accountPrevBtn && accountNextBtn) {
        accountPrevBtn.addEventListener('click', function() {
            const accountGrid = document.querySelector('.account-grid');
            
            if (accountGrid) {
                accountGrid.scrollBy({
                    left: -340, // Scroll left by card width + gap
                    behavior: 'smooth'
                });
            }
        });
        
        accountNextBtn.addEventListener('click', function() {
            const accountGrid = document.querySelector('.account-grid');
            
            if (accountGrid) {
                accountGrid.scrollBy({
                    left: 340, // Scroll right by card width + gap
                    behavior: 'smooth'
                });
            }
        });
    }

    // ============================================
    // 5. SKIN CAROUSEL
    // ============================================
    
    const skinPrevBtn = document.getElementById('skinPrevBtn');
    const skinNextBtn = document.getElementById('skinNextBtn');
    
    if (skinPrevBtn && skinNextBtn) {
        skinPrevBtn.addEventListener('click', function() {
            const skinCarousel = document.querySelector('.skin-carousel');
            
            if (skinCarousel) {
                skinCarousel.scrollBy({
                    left: -300, // Scroll left by card width + gap
                    behavior: 'smooth'
                });
            }
        });
        
        skinNextBtn.addEventListener('click', function() {
            const skinCarousel = document.querySelector('.skin-carousel');
            
            if (skinCarousel) {
                skinCarousel.scrollBy({
                    left: 300, // Scroll right by card width + gap
                    behavior: 'smooth'
                });
            }
        });
    }

    // ============================================
    // 6. FAQ ACCORDION
    // ============================================
    
    const faqQuestions = document.querySelectorAll('.faq-question');
    
    faqQuestions.forEach(question => {
        question.addEventListener('click', function() {
            const faqItem = this.parentElement;
            const isActive = faqItem.classList.contains('active');
            
            // Close all other FAQ items
            document.querySelectorAll('.faq-item').forEach(item => {
                item.classList.remove('active');
            });
            
            // Toggle current FAQ item
            if (!isActive) {
                faqItem.classList.add('active');
            }
        });
    });

    // ============================================
    // 7. SMOOTH SCROLL FOR ANCHOR LINKS
    // ============================================
    
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            
            // Skip if it's just "#"
            if (href === '#') return;
            
            e.preventDefault();
            
            const target = document.querySelector(href);
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // ============================================
    // 8. ACCOUNT CARD HOVER EFFECTS
    // ============================================
    
    const accountCards = document.querySelectorAll('.account-card');
    
    accountCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-8px) scale(1.02)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });

    // ============================================
    // 9. SERVICE CARD CLICK HANDLER
    // ============================================
    
    const serviceCards = document.querySelectorAll('.service-card');
    
    serviceCards.forEach(card => {
        card.addEventListener('click', function() {
            const serviceName = this.querySelector('.service-title').textContent;
            //console.log('Service clicked:', serviceName);
            
            // Note: In production, this would navigate to the service page
            // For now, we just log it
        });
    });

    // ============================================
    // 10. BUY BUTTON HANDLERS
    // ============================================
    
    const buyButtons = document.querySelectorAll('.account-buy-btn');
    
    buyButtons.forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.stopPropagation(); // Prevent card click event
            
            const accountName = this.closest('.account-card').querySelector('.account-name').textContent;
            //console.log('Buy clicked:', accountName);
            
            // Add ripple effect
            const ripple = document.createElement('span');
            ripple.style.position = 'absolute';
            ripple.style.borderRadius = '50%';
            ripple.style.background = 'rgba(255, 255, 255, 0.5)';
            ripple.style.width = '20px';
            ripple.style.height = '20px';
            ripple.style.animation = 'ripple 0.6s ease-out';
            
            this.appendChild(ripple);
            
            setTimeout(() => {
                ripple.remove();
            }, 600);
            
            // Note: In production, this would add to cart or navigate to checkout
        });
    });

    // ============================================
    // 11. SKIN CARD CLICK HANDLER
    // ============================================
    
    const skinCards = document.querySelectorAll('.skin-card');
    
    skinCards.forEach(card => {
        card.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
        });
    });

    // ============================================
    // 12. SUPPORT CHAT SEND BUTTON
    // ============================================
    
    const sendBtn = document.querySelector('.send-btn');
    const chatInput = document.querySelector('.chat-input input');
    
    if (sendBtn && chatInput) {
        sendBtn.addEventListener('click', function() {
            const message = chatInput.value.trim();
            
            if (message) {
                //console.log('Message sent:', message);
                chatInput.value = '';
                
                // Note: In production, this would send the message to support
                // For now, we just clear the input
            }
        });
        
        // Send on Enter key
        chatInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                sendBtn.click();
            }
        });
    }

    // ============================================
    // 13. ANIMATION ON SCROLL (Optional)
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
    
    // Observe all major sections
    const sections = document.querySelectorAll('.lol-services, .lol-smurf-accounts, .lol-skins, .faq-section, .support-section, .blog-section');
    
    sections.forEach(section => {
        section.style.opacity = '0';
        section.style.transform = 'translateY(30px)';
        section.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(section);
    });

    // ============================================
    // 14. LOADING STATE HANDLERS
    // ============================================
    
    // Add loading animation to buttons
    function addLoadingState(button) {
        const originalText = button.innerHTML;
        button.innerHTML = '<span style="display: inline-block; animation: spin 1s linear infinite;">⟳</span>';
        button.disabled = true;
        
        setTimeout(() => {
            button.innerHTML = originalText;
            button.disabled = false;
        }, 1000);
    }
    
    // CSS for spin animation (add to inline style if needed)
    const style = document.createElement('style');
    style.textContent = `
        @keyframes spin {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
        }
        
        @keyframes ripple {
            from {
                transform: scale(0);
                opacity: 1;
            }
            to {
                transform: scale(4);
                opacity: 0;
            }
        }
    `;
    document.head.appendChild(style);

    // ============================================
    // 15. CONSOLE LOG FOR DEBUGGING
    // ============================================
    
    //console.log('✅ LoL Page JavaScript initialized successfully!');
    //console.log('📊 Service tabs:', tabs.length);
    //console.log('🎮 Account cards:', accountCards.length);
    //console.log('🎨 Skin cards:', skinCards.length);
    //console.log('❓ FAQ items:', faqQuestions.length);
});