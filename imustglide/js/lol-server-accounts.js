/* ============================================
   SERVER ACCOUNT CARDS DATA
   League of Legends account kártyák szerver alapján
   ============================================ */

// Server-specific account cards configuration
const serverAccountsData = {
    'EUW': [
        {
            name: 'Handleveled',
            icon: 'handleveled.png',
            be: '40.000+ BE',
            features: ['40.000+ BE', 'Fresh MMR', '{REGION}', 'Lifetime Warranty', 'Unverified'],
            price: '€37.49',
            oldPrice: null,
            buttonText: 'Buy Handleveled',
            stockWarning: null,
            isSkinAccount: false
        },
        {
            name: 'Handleveled Premium',
            icon: 'handleveledpremium.png',
            be: '40.000+ BE',
            features: ['40.000+ BE', '2.300 MMR Fresh', '{REGION}', 'Lifetime Warranty', 'Unverified'],
            price: '€46.99',
            oldPrice: null,
            buttonText: 'Buy Handleveled Premium',
            stockWarning: 'Only 3 left!',
            isSkinAccount: false
        },
        {
            name: 'Handleveled Pro',
            icon: 'handleveledpro.png',
            be: '40.000+ BE',
            features: ['40.000+ BE', '2.400 MMR Fresh', '{REGION}', 'Lifetime Warranty', 'Unverified'],
            price: '€65.99',
            oldPrice: '€89.99',
            buttonText: 'Buy Handleveled Pro',
            stockWarning: 'Only 2 left!',
            isSkinAccount: false
        },
        {
            name: 'Handleveled Ultra',
            icon: 'handleveledultra.png',
            be: '40.000+ BE',
            features: ['40.000+ BE', '2.600 MMR Fresh', '{REGION}', 'Lifetime Warranty', 'Unverified'],
            price: '€87.50',
            oldPrice: '€97.50',
            buttonText: 'Buy Handleveled Ultra',
            stockWarning: 'Only 3 left!',
            isSkinAccount: false
        },
        {
            name: 'Skin Account',
            icon: 'lolskinaccounts.png',
            be: '30-200k+ BE',
            features: ['30-200k+ BE', 'Fresh Unranked', '{REGION}', '14 Days Warranty'],
            price: '€7.99',
            oldPrice: null,
            buttonText: 'Select Skin',
            stockWarning: null,
            isSkinAccount: true,
            priceLabel: 'starting at'
        }
    ],
    'EUNE': [
        {
            name: 'Handleveled',
            icon: 'handleveled.png',
            be: '40.000+ BE',
            features: ['40.000+ BE', 'Fresh MMR', '{REGION}', 'Lifetime Warranty', 'Unverified'],
            price: '€37.49',
            oldPrice: null,
            buttonText: 'Buy Handleveled',
            stockWarning: null,
            isSkinAccount: false
        },
        {
            name: 'Handleveled Premium',
            icon: 'handleveledpremium.png',
            be: '40.000+ BE',
            features: ['40.000+ BE', '2.300 MMR Fresh', '{REGION}', 'Lifetime Warranty', 'Unverified'],
            price: '€46.99',
            oldPrice: null,
            buttonText: 'Buy Handleveled Premium',
            stockWarning: 'Only 3 left!',
            isSkinAccount: false
        },
        {
            name: 'Handleveled Ultra',
            icon: 'handleveledultra.png',
            be: '40.000+ BE',
            features: ['40.000+ BE', '2.600 MMR Fresh', '{REGION}', 'Lifetime Warranty', 'Unverified'],
            price: '€87.50',
            oldPrice: '€97.50',
            buttonText: 'Buy Handleveled Ultra',
            stockWarning: 'Only 3 left!',
            isSkinAccount: false
        },
        {
            name: 'Skin Account',
            icon: 'lolskinaccounts.png',
            be: '30-200k+ BE',
            features: ['30-200k+ BE', 'Fresh Unranked', '{REGION}', '14 Days Warranty'],
            price: '€7.99',
            oldPrice: null,
            buttonText: 'Select Skin',
            stockWarning: null,
            isSkinAccount: true,
            priceLabel: 'starting at'
        }
    ],
    'NA': [
        {
            name: 'Skin Account',
            icon: 'lolskinaccounts.png',
            be: '30-200k+ BE',
            features: ['30-200k+ BE', 'Fresh Unranked', '{REGION}', '14 Days Warranty'],
            price: '€7.99',
            oldPrice: null,
            buttonText: 'Select Skin',
            stockWarning: null,
            isSkinAccount: true,
            priceLabel: 'starting at'
        }
    ],
    'OCE': [
        {
            name: 'Standard',
            icon: 'standard.png',
            be: '50.000+ BE',
            features: ['50.000+ BE', 'Fresh Unranked', '{REGION}', '14 Days Warranty', 'Unverified'],
            price: '€9.99',
            oldPrice: null,
            buttonText: 'Buy Standard',
            stockWarning: null,
            isSkinAccount: false
        },
        {
            name: 'Advanced',
            icon: 'advanced.png',
            be: '60.000+ BE',
            features: ['60.000+ BE', 'Fresh Unranked', '{REGION}', '14 Days Warranty', 'Unverified'],
            price: '€11.45',
            oldPrice: null,
            buttonText: 'Buy Advanced',
            stockWarning: null,
            isSkinAccount: false
        },
        {
            name: 'Iron IV',
            icon: 'iron4.png',
            be: '40.000+ BE',
            features: ['40.000+ BE', 'Iron IV', '{REGION}', '14 Days Warranty', 'Unverified'],
            price: '€41.99',
            oldPrice: null,
            buttonText: 'Buy Iron IV',
            stockWarning: null,
            isSkinAccount: false
        },
        {
            name: 'Skin Account',
            icon: 'lolskinaccounts.png',
            be: '30-200k+ BE',
            features: ['30-200k+ BE', 'Fresh Unranked', '{REGION}', '14 Days Warranty'],
            price: '€7.99',
            oldPrice: null,
            buttonText: 'Select Skin',
            stockWarning: null,
            isSkinAccount: true,
            priceLabel: 'starting at'
        }
    ],
    'LAN': [
        {
            name: 'Standard',
            icon: 'standard.png',
            be: '50.000+ BE',
            features: ['50.000+ BE', 'Fresh Unranked', '{REGION}', '14 Days Warranty', 'Unverified'],
            price: '€7.95',
            oldPrice: '€8.95',
            buttonText: 'Buy Standard',
            stockWarning: null,
            isSkinAccount: false
        },
        {
            name: 'Advanced',
            icon: 'advanced.png',
            be: '60.000+ BE',
            features: ['60.000+ BE', 'Fresh Unranked', '{REGION}', '14 Days Warranty', 'Unverified'],
            price: '€9.45',
            oldPrice: '€11.45',
            buttonText: 'Buy Advanced',
            stockWarning: null,
            isSkinAccount: false
        },
        {
            name: 'Premium',
            icon: 'premium.png',
            be: '70.000+ BE',
            features: ['70.000+ BE', 'Fresh Unranked', '{REGION}', '14 Days Warranty', 'Unverified'],
            price: '€14.99',
            oldPrice: '€16.99',
            buttonText: 'Buy Premium',
            stockWarning: null,
            isSkinAccount: false
        },
        {
            name: 'Ultimate',
            icon: 'ultimate.png',
            be: '100.000+ BE',
            features: ['100.000+ BE', 'Fresh Unranked', '{REGION}', '14 Days Warranty', 'Unverified'],
            price: '€22.49',
            oldPrice: null,
            buttonText: 'Buy Ultimate',
            stockWarning: null,
            isSkinAccount: false
        },
        {
            name: 'Skin Account',
            icon: 'lolskinaccounts.png',
            be: '30-200k+ BE',
            features: ['30-200k+ BE', 'Fresh Unranked', '{REGION}', '14 Days Warranty'],
            price: '€7.99',
            oldPrice: null,
            buttonText: 'Select Skin',
            stockWarning: null,
            isSkinAccount: true,
            priceLabel: 'starting at'
        }
    ],
    'LAS': [
        {
            name: 'Standard',
            icon: 'standard.png',
            be: '50.000+ BE',
            features: ['50.000+ BE', 'Fresh Unranked', '{REGION}', '14 Days Warranty', 'Unverified'],
            price: '€7.95',
            oldPrice: '€8.95',
            buttonText: 'Buy Standard',
            stockWarning: null,
            isSkinAccount: false
        },
        {
            name: 'Advanced',
            icon: 'advanced.png',
            be: '60.000+ BE',
            features: ['60.000+ BE', 'Fresh Unranked', '{REGION}', '14 Days Warranty', 'Unverified'],
            price: '€9.45',
            oldPrice: '€11.45',
            buttonText: 'Buy Advanced',
            stockWarning: null,
            isSkinAccount: false
        },
        {
            name: 'Premium',
            icon: 'premium.png',
            be: '70.000+ BE',
            features: ['70.000+ BE', 'Fresh Unranked', '{REGION}', '14 Days Warranty', 'Unverified'],
            price: '€14.99',
            oldPrice: '€16.99',
            buttonText: 'Buy Premium',
            stockWarning: null,
            isSkinAccount: false
        },
        {
            name: 'Pro',
            icon: 'premium.png',
            be: '100.000+ BE',
            features: ['100.000+ BE', 'Fresh Unranked', '{REGION}', '14 Days Warranty', 'Unverified'],
            price: '€22.49',
            oldPrice: null,
            buttonText: 'Buy Pro',
            stockWarning: null,
            isSkinAccount: false
        },
        {
            name: 'Skin Account',
            icon: 'lolskinaccounts.png',
            be: '30-200k+ BE',
            features: ['30-200k+ BE', 'Fresh Unranked', '{REGION}', '14 Days Warranty'],
            price: '€7.99',
            oldPrice: null,
            buttonText: 'Select Skin',
            stockWarning: null,
            isSkinAccount: true,
            priceLabel: 'starting at'
        }
    ],
    'BR': [
        {
            name: 'Premium',
            icon: 'premium.png',
            be: '70.000+ BE',
            features: ['70.000+ BE', 'Fresh Unranked', '{REGION}', '14 Days Warranty', 'Unverified'],
            price: '€14.99',
            oldPrice: '€17.99',
            buttonText: 'Buy Premium',
            stockWarning: 'Only 1 left!',
            isSkinAccount: false
        },
        {
            name: 'Pro',
            icon: 'premium.png',
            be: '100.000+ BE',
            features: ['100.000+ BE', 'Fresh Unranked', '{REGION}', '14 Days Warranty', 'Unverified'],
            price: '€19.49',
            oldPrice: '€22.49',
            buttonText: 'Buy Pro',
            stockWarning: null,
            isSkinAccount: false
        },
        {
            name: 'VIP',
            icon: 'VIP.png',
            be: '150.000+ BE',
            features: ['150.000+ BE', 'Fresh Unranked', '{REGION}', '14 Days Warranty', 'Unverified'],
            price: '€27.49',
            oldPrice: '€31.49',
            buttonText: 'Buy VIP',
            stockWarning: null,
            isSkinAccount: false
        },
        {
            name: 'Skin Account',
            icon: 'lolskinaccounts.png',
            be: '30-200k+ BE',
            features: ['30-200k+ BE', 'Fresh Unranked', '{REGION}', '14 Days Warranty'],
            price: '€7.99',
            oldPrice: null,
            buttonText: 'Select Skin',
            stockWarning: null,
            isSkinAccount: true,
            priceLabel: 'starting at'
        }
    ],
    'TR': [
        {
            name: 'Ultimate',
            icon: 'ultimate.png',
            be: '100.000+ BE',
            features: ['100.000+ BE', 'Fresh Unranked', '{REGION}', '14 Days Warranty', 'Unverified'],
            price: '€19.45',
            oldPrice: '€22.45',
            buttonText: 'Buy Ultimate',
            stockWarning: 'Only 4 left!',
            isSkinAccount: false
        },
        {
            name: 'VIP',
            icon: 'VIP.png',
            be: '150.000+ BE',
            features: ['150.000+ BE', 'Fresh Unranked', '{REGION}', '14 Days Warranty', 'Unverified'],
            price: '€27.49',
            oldPrice: '€31.49',
            buttonText: 'Buy VIP',
            stockWarning: null,
            isSkinAccount: false
        },
        {
            name: 'Skin Account',
            icon: 'lolskinaccounts.png',
            be: '30-200k+ BE',
            features: ['30-200k+ BE', 'Fresh Unranked', '{REGION}', '14 Days Warranty'],
            price: '€7.99',
            oldPrice: null,
            buttonText: 'Select Skin',
            stockWarning: null,
            isSkinAccount: true,
            priceLabel: 'starting at'
        }
    ],
    'RU': [
        {
            name: 'Standard',
            icon: 'standard.png',
            be: '50.000+ BE',
            features: ['50.000+ BE', 'Fresh Unranked', '{REGION}', '14 Days Warranty', 'Unverified'],
            price: '€7.95',
            oldPrice: '€8.95',
            buttonText: 'Buy Standard',
            stockWarning: null,
            isSkinAccount: false
        },
        {
            name: 'Advanced',
            icon: 'advanced.png',
            be: '60.000+ BE',
            features: ['60.000+ BE', 'Fresh Unranked', '{REGION}', '14 Days Warranty', 'Unverified'],
            price: '€9.45',
            oldPrice: '€11.45',
            buttonText: 'Buy Advanced',
            stockWarning: null,
            isSkinAccount: false
        },
        {
            name: 'Premium',
            icon: 'premium.png',
            be: '70.000+ BE',
            features: ['70.000+ BE', 'Fresh Unranked', '{REGION}', '14 Days Warranty', 'Unverified'],
            price: '€14.99',
            oldPrice: '€16.99',
            buttonText: 'Buy Premium',
            stockWarning: null,
            isSkinAccount: false
        },
        {
            name: 'Ultimate',
            icon: 'ultimate.png',
            be: '100.000+ BE',
            features: ['100.000+ BE', 'Fresh Unranked', '{REGION}', '14 Days Warranty', 'Unverified'],
            price: '€22.49',
            oldPrice: null,
            buttonText: 'Buy Ultimate',
            stockWarning: null,
            isSkinAccount: false
        },
        {
            name: 'VIP',
            icon: 'VIP.png',
            be: '150.000+ BE',
            features: ['150.000+ BE', 'Fresh Unranked', '{REGION}', '14 Days Warranty', 'Unverified'],
            price: '€27.49',
            oldPrice: null,
            buttonText: 'Buy VIP',
            stockWarning: null,
            isSkinAccount: false
        },
        {
            name: 'Skin Account',
            icon: 'lolskinaccounts.png',
            be: '30-200k+ BE',
            features: ['30-200k+ BE', 'Fresh Unranked', '{REGION}', '14 Days Warranty'],
            price: '€7.99',
            oldPrice: null,
            buttonText: 'Select Skin',
            stockWarning: null,
            isSkinAccount: true,
            priceLabel: 'starting at'
        }
    ],
    'MENA': [
        {
            name: 'Skin Account',
            icon: 'lolskinaccounts.png',
            be: '30-200k+ BE',
            features: ['30-200k+ BE', 'Fresh Unranked', '{REGION}', '14 Days Warranty'],
            price: '€7.99',
            oldPrice: null,
            buttonText: 'Select Skin',
            stockWarning: null,
            isSkinAccount: true,
            priceLabel: 'starting at'
        }
    ]
};

// ============================================
// DB-DRIVEN ACCOUNTS LOADER
// ============================================
async function loadAccountsFromDB(server) {
    try {
        const res  = await fetch(`api/get_services.php?type=accounts&game=league-of-legends&region=${server}`);
        const data = await res.json();
        if (!data.success || !data.data.length) return null;

        return data.data.map(a => {
            const features = a.features || JSON.parse(a.features_json || '[]');
            const isSkin   = a.leveling_type === 'botted' || a.title === 'Skin Account' || a.title === 'Botted';
            const price    = a.discounted_price ? parseFloat(a.discounted_price) : parseFloat(a.base_price);
            const oldPrice = a.discounted_price ? parseFloat(a.base_price) : null;

            return {
                id:         a.id,
                name:       a.title,
                icon:       a.rank_image_path ? a.rank_image_path.replace('pics/', '') : 'handleveled.png',
                be:         a.blue_essence ? (a.blue_essence >= 40000 ? '40.000+ BE' : a.blue_essence + ' BE') : '30-200k+ BE',
                features:   features,
                price:      '€' + price.toFixed(2),
                oldPrice:   oldPrice ? '€' + oldPrice.toFixed(2) : null,
                buttonText: isSkin ? 'Select Skin' : 'Buy ' + a.title,
                stockWarning: null,
                isSkinAccount: isSkin,
                priceLabel: isSkin ? 'starting at' : null,
                server:     server,
            };
        });
    } catch(e) {
        //console.warn('Could not load accounts from DB, using defaults:', e);
        return null;
    }
}

// Function to render account cards
async function renderAccountCards(server) {
    const container = document.getElementById('accountCardsContainer');
    if (!container) return;
    container.innerHTML = '<div style="text-align:center;padding:2rem;color:#6b7280;">Loading...</div>';

    // Try DB first, fall back to hardcoded
    const dbCards = await loadAccountsFromDB(server);
    const cards   = dbCards || (serverAccountsData[server] || []);

    container.innerHTML = '';
    cards.forEach(card => {
        container.innerHTML += createAccountCard(card, server);
    });
}

// Function to create account card HTML
function createAccountCard(card, server) {
    const features = card.features.map(feature => {
        const featureText = feature.replace('{REGION}', server);
        return `
            <div class="feature">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                </svg>
                <span ${featureText === server ? 'class="server-region"' : ''}>${featureText}</span>
            </div>
        `;
    }).join('');
    
    const priceHTML = card.isSkinAccount ? `
        <div class="skin-account-price">
            <span class="price-label">${card.priceLabel || 'starting at'}</span>
            <span class="price">${card.price}</span>
            <span class="currency">EUR</span>
        </div>
    ` : `
        <div class="account-price">
            ${card.oldPrice ? `<span class="price-old">${card.oldPrice}</span>` : ''}
            <span class="price">${card.price}</span>
            <span class="currency">EUR</span>
        </div>
    `;
    
    const buttonClass = card.isSkinAccount ? 'skin-select-btn' : 'account-buy-btn';
    const buttonIcon = card.isSkinAccount ? `
        <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z"/>
        </svg>
    ` : `
        <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 4l-1.41 1.41L16.17 11H4v2h12.17l-5.58 5.59L12 20l8-8z"/>
        </svg>
    `;
    
    const cardClass = card.isSkinAccount ? 'account-card skin-account-card' : 'account-card';
    
    return `
        <div class="${cardClass}">
            <div class="account-icon">
                <img src="pics/${card.icon}" alt="${card.name}">
            </div>
            <h3 class="account-name">${card.name}</h3>
            <p class="account-be">${card.be}</p>
            
            <div class="account-features">
                ${features}
            </div>

            ${priceHTML}

            <button class="${buttonClass}"${card.isSkinAccount ? ' style="position:relative;opacity:0.7;cursor:default;" onclick="openComingSoon(\'Select Skin\')"' : ` onclick="openAccountModal(${JSON.stringify({
                name: card.name,
                icon: card.icon,
                be: card.be,
                price: card.price,
                warranty: card.features.find(f => f.includes('Warranty')) || 'Lifetime Warranty',
                server: server,
                isSkinAccount: card.isSkinAccount
            }).replace(/"/g, '&quot;')})"` }>
                ${buttonIcon}
                ${card.buttonText}
                ${card.isSkinAccount ? `<span style="position:absolute;top:-8px;right:-6px;background:linear-gradient(135deg,#a855f7,#ec4899);color:#fff;font-size:0.55rem;font-weight:700;padding:0.15rem 0.45rem;border-radius:2rem;letter-spacing:0.4px;text-transform:uppercase;white-space:nowrap;">Soon</span>` : ''}
            </button>

            ${card.stockWarning ? `<div class="stock-warning">${card.stockWarning}</div>` : ''}
        </div>
    `;
}

// Account Purchase Modal
function openAccountModal(card) {
    const modal = document.getElementById('accountPurchaseModal');
    if (!modal) return;

    const priceNum = parseFloat(card.price.replace('€','').replace(',','.'));
    const placementPrice = 2.49;
    const placementGames = 5;

    // Set modal content
    modal.querySelector('#apm-title').textContent = card.name + ' LoL Smurf Account ' + card.server;
    modal.querySelector('#apm-icon').src = 'pics/' + card.icon;
    modal.querySelector('#apm-be').textContent = card.be;
    modal.querySelector('#apm-price-per').textContent = card.price + 'EUR';
    modal.querySelector('#apm-region').textContent = card.server;
    modal.querySelector('#apm-warranty').textContent = card.warranty;

    // Quantity + placement toggle state
    let qty = 1;
    let placementEnabled = false;

    const qtyInput = modal.querySelector('#apm-qty');
    const qtyPlus  = modal.querySelector('#apm-qty-plus');
    const qtyMinus = modal.querySelector('#apm-qty-minus');
    const totalEl  = modal.querySelector('#apm-total');
    const placementToggle = modal.querySelector('#apm-placement-toggle');

    function updateTotal() {
        const addon = placementEnabled ? placementPrice * placementGames : 0;
        const total = (priceNum * qty) + addon;
        totalEl.textContent = '€' + total.toFixed(2);
    }

    qtyInput.value = qty;

    // Clone to remove old listeners
    const newPlus  = qtyPlus.cloneNode(true);
    const newMinus = qtyMinus.cloneNode(true);
    const newToggle = placementToggle.cloneNode(true);
    qtyPlus.replaceWith(newPlus);
    qtyMinus.replaceWith(newMinus);
    placementToggle.replaceWith(newToggle);

    modal.querySelector('#apm-qty-plus').addEventListener('click', () => {
        qty = Math.min(qty + 1, 10);
        modal.querySelector('#apm-qty').value = qty;
        updateTotal();
    });
    modal.querySelector('#apm-qty-minus').addEventListener('click', () => {
        qty = Math.max(qty - 1, 1);
        modal.querySelector('#apm-qty').value = qty;
        updateTotal();
    });
    modal.querySelector('#apm-placement-toggle').addEventListener('change', function() {
        placementEnabled = this.checked;
        updateTotal();
    });

    updateTotal();

    // Cart buttons
    const cartBtn = modal.querySelector('.apm-cart-btn');
    const buyBtn  = modal.querySelector('.apm-buy-btn');
    if (cartBtn) cartBtn.onclick = () => {
        Cart.add({ name: card.name, icon: card.icon, price: card.price, server: card.server, qty });
        closeAccountModal();
    };
    if (buyBtn) buyBtn.onclick = () => {
        Cart.add({ name: card.name, icon: card.icon, price: card.price, server: card.server, qty });
        window.location.href = 'checkout.html';
    };

    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', function() {
    // Render EUW cards by default
    renderAccountCards('EUW');
    
    // Account modal close
    const apmClose   = document.getElementById('apmClose');
    const apmOverlay = document.getElementById('apmOverlay');
    function closeAccountModal() {
        const m = document.getElementById('accountPurchaseModal');
        if (m) { m.classList.remove('active'); document.body.style.overflow = ''; }
    }
    if (apmClose)   apmClose.addEventListener('click', closeAccountModal);
    if (apmOverlay) apmOverlay.addEventListener('click', closeAccountModal);
    document.addEventListener('keydown', e => { if (e.key === 'Escape') closeAccountModal(); });
    const serverBtns = document.querySelectorAll('.server-btn');
    
    serverBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            // Remove active class from all server buttons
            serverBtns.forEach(b => b.classList.remove('active'));
            
            // Add active class to clicked button
            this.classList.add('active');
            
            // Get selected server
            const selectedServer = this.getAttribute('data-server');
            //console.log('Selected server:', selectedServer);
            
            // Render cards for selected server
            renderAccountCards(selectedServer);
        });
    });
});