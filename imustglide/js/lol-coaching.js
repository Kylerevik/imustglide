/* ============================================
   LOL-COACHING.JS - DB-DRIVEN PRICES
   ============================================ */

let COACHING_PRICES = {
    copilot: 14.99,
    vod:     14.99,
    pro:     29.99,
};

let COACHING_UNITS = {
    copilot: 'game',
    vod:     'game',
    pro:     'hour',
};

let COACHING_ICONS = {
    copilot: 'copilot.png',
    vod:     'vodreview.png',
    pro:     'coachingpro.png',
};

let activeService = 'copilot';

async function loadCoachingPrices() {
    try {
        const res  = await fetch('api/get_services.php?type=coaching&game=league-of-legends');
        const data = await res.json();
        if (!data.success || !data.data.length) return;
        data.data.forEach(s => {
            const key = s.service_name;
            COACHING_PRICES[key] = parseFloat(s.hourly_rate);
            const spec = s.specializations || {};
            if (spec.unit)  COACHING_UNITS[key] = spec.unit;
            if (spec.icon)  COACHING_ICONS[key]  = spec.icon;
        });

        // Update service card prices in the DOM
        document.querySelectorAll('.coaching-service-item').forEach(item => {
            const key      = item.getAttribute('data-service');
            const price    = COACHING_PRICES[key];
            const unit     = COACHING_UNITS[key] || 'game';
            const priceEl  = item.querySelector('.coaching-service-price');
            if (priceEl && price) {
                priceEl.innerHTML = `€${price.toFixed(2)} <span class="per-unit">/ ${unit}</span>`;
            }
        });

        // Recalculate total
        if (typeof _coachingUpdateTotal === 'function') _coachingUpdateTotal();
    } catch(e) {
        //console.warn('Could not load coaching prices from DB:', e);
    }
}

document.addEventListener('DOMContentLoaded', function () {

    // ============================================
    // SERVICE ITEM SELECTION
    // ============================================
    const serviceItems = document.querySelectorAll('.coaching-service-item');
    const gameInput    = document.getElementById('gameCount');
    const totalPrice   = document.getElementById('totalPrice');

    function updateTotal() {
        const qty   = Math.max(1, parseInt(gameInput?.value) || 1);
        const price = COACHING_PRICES[activeService] || 14.99;
        const unit  = COACHING_UNITS[activeService] || 'game';
        if (totalPrice) totalPrice.textContent = '€' + (price * qty).toFixed(2);
        // Update unit label
        const label = document.querySelector('.coaching-find-panel label');
        if (label) label.textContent = 'Number of ' + unit + 's';
    }
    window._coachingUpdateTotal = updateTotal;

    serviceItems.forEach(item => {
        item.addEventListener('click', function () {
            serviceItems.forEach(i => i.classList.remove('active'));
            this.classList.add('active');
            activeService = this.getAttribute('data-service');
            updateTotal();
        });
    });

    if (gameInput) {
        gameInput.addEventListener('input', updateTotal);
        gameInput.addEventListener('change', function () {
            if (parseInt(this.value) < 1 || isNaN(parseInt(this.value))) this.value = 1;
            if (parseInt(this.value) > 30) this.value = 30;
            updateTotal();
        });
    }

    updateTotal();
    loadCoachingPrices();
    // ============================================
    const modal         = document.getElementById('coachingModal');
    const overlay       = document.getElementById('coachingModalOverlay');
    const closeBtn      = document.getElementById('coachingModalClose');
    const buyBtn        = document.querySelector('.coaching-buy-btn');
    const modalBuyBtn   = document.getElementById('coachingModalBuyBtn');
    const textarea      = document.getElementById('coachingNotes');
    const charCount     = document.getElementById('coachingCharCount');

    function openCoachingModal()  { if (modal) { modal.classList.add('active');    document.body.style.overflow = 'hidden'; } }
    function closeCoachingModal() { if (modal) { modal.classList.remove('active'); document.body.style.overflow = ''; } }

    if (buyBtn)   buyBtn.addEventListener('click', openCoachingModal);
    if (closeBtn) closeBtn.addEventListener('click', closeCoachingModal);
    if (overlay)  overlay.addEventListener('click', closeCoachingModal);
    document.addEventListener('keydown', e => { if (e.key === 'Escape') closeCoachingModal(); });

    // Role multi-select
    document.querySelectorAll('.coaching-role-btn').forEach(btn => {
        btn.addEventListener('click', () => btn.classList.toggle('active'));
    });

    // Char counter
    if (textarea && charCount) {
        textarea.addEventListener('input', () => { charCount.textContent = textarea.value.length; });
    }

    // Modal Buy Now → checkout
    if (modalBuyBtn) {
        modalBuyBtn.addEventListener('click', function () {
            const riotIdInput = document.getElementById('coachingRiotId');
            const riotId      = riotIdInput?.value.trim() || '';
            const roles       = document.querySelectorAll('.coaching-role-btn.active');

            // Validate Riot ID: must have "#" with at least 1 char before it
            const hashIdx = riotId.indexOf('#');
            if (!riotId || hashIdx < 1) {
                riotIdInput.style.borderColor = '#ef4444';
                riotIdInput.placeholder = 'Required! e.g. GameName#EUW';
                setTimeout(() => {
                    riotIdInput.style.borderColor = '';
                    riotIdInput.placeholder = 'Game Name + #EUW';
                }, 3000);
                return;
            } else {
                riotIdInput.style.borderColor = '';
            }

            // Validate at least 1 role selected
            if (roles.length === 0) {
                document.querySelector('.coaching-modal-roles').style.outline = '2px solid #ef4444';
                document.querySelector('.coaching-modal-roles').style.borderRadius = '0.5rem';
                setTimeout(() => {
                    document.querySelector('.coaching-modal-roles').style.outline = '';
                }, 3000);
                return;
            } else {
                document.querySelector('.coaching-modal-roles').style.outline = '';
            }

            const totalEl  = document.getElementById('totalPrice');
            const price    = totalEl ? totalEl.textContent : '€0.00';
            const qty      = parseInt(document.getElementById('gameCount')?.value) || 1;
            const unit     = COACHING_UNITS[activeService] || 'game';
            const nameMap  = { copilot: 'Copilot Coaching', vod: 'VOD Review', pro: 'Pro Coaching' };
            const selectedRoles = [...document.querySelectorAll('.coaching-role-btn.active')]
                .map(b => b.getAttribute('data-role')).join(', ');
            const region = document.getElementById('coachingRegion')?.value || '';
            const detail = `${riotId} · ${region} · ${qty} ${unit}${qty > 1 ? 's' : ''} · Roles: ${selectedRoles}`;

            const boostItem = {
                type:   'coaching',
                name:   nameMap[activeService] || 'Coaching',
                detail: detail,
                price:  price,
                icon:   COACHING_ICONS[activeService] || 'coachingpro.png',
                qty:    1
            };
            localStorage.setItem('imustglide_boost_checkout', JSON.stringify(boostItem));
            window.location.href = 'checkout.html?mode=coaching';
        });
    }

    // ============================================
    // FAQ SHOW ALL / SHOW LESS
    // ============================================
    const faqToggleBtn  = document.getElementById('faqToggleBtn');
    const hiddenFaqs    = document.querySelectorAll('.faq-hidden');
    let faqExpanded     = false;

    if (faqToggleBtn) {
        faqToggleBtn.addEventListener('click', function () {
            faqExpanded = !faqExpanded;

            hiddenFaqs.forEach(faq => {
                faq.style.display = faqExpanded ? 'block' : 'none';
            });

            this.classList.toggle('open', faqExpanded);
            this.innerHTML = faqExpanded
                ? 'Show Less <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M7 10l5 5 5-5z"/></svg>'
                : 'Show All FAQs <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M7 10l5 5 5-5z"/></svg>';
        });
    }

    //console.log('✅ LoL Coaching JS initialized!');
});