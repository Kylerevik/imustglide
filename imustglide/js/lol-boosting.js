/* ============================================
   LOL-BOOSTING.JS - DB-DRIVEN PRICES
   ============================================ */

// Fallback prices (used until DB loads)
let DIVISION_PRICES = {
    iron:     [5.95,  5.95,  5.95,  7.46],
    bronze:   [7.46,  7.46,  7.46,  7.72],
    silver:   [7.72,  7.72,  7.72,  12.96],
    gold:     [12.96, 9.83,  16.18, 22.64],
    platinum: [17.78, 17.78, 17.78, 35.00],
    emerald:  [35.00, 35.00, 35.00, 78.06],
    diamond:  [78.06, 78.06, 78.06, 0],
};

let WIN_BOOST_PRICES = {
    iron: 2.36, bronze: 2.50, silver: 2.63, gold: 3.68,
    platinum: 6.46, emerald: 7.91, diamond: 8.96,
    master: 38.87, grandmaster: 48.23, challenger: 58.16,
};

let PLACEMENT_PRICES = {
    iron: 1.91, bronze: 2.10, silver: 2.39, gold: 3.54,
    platinum: 4.79, emerald: 5.27, diamond: 7.67,
    master: 9.59, grandmaster: 9.59, challenger: 12.47,
};

let ARENA_PRICES = {
    wood: 2.99, bronze: 3.99, silver: 5.99, gold: 9.99, gladiator: 15.99,
};

let ARENA_LP_CONFIG = {
    wood:      { min: 0,    max: 1399, default: 0    },
    bronze:    { min: 1400, max: 2599, default: 1400  },
    silver:    { min: 2600, max: 3199, default: 2600  },
    gold:      { min: 3200, max: 3799, default: 3200  },
    gladiator: { min: 3800, max: 4400, default: 3800  },
};

let MASTERY_PRICES = [0, 8.22, 13.08, 15.09, 15.73, 18.04, 20.52, 22.85, 25.21, 26.43];
let RESTRICTION_PER_GAME = 1.99;
let BATTLE_PASS_PER_LEVEL = 1.50;

let OPTION_MULT = { priority: 0.20, soloQueue: 0.10, stream: 0.15, booster: 0.20 };
let LP_GAIN_MULT = { high: 0.90, normal: 1.00, low: 1.15 };

// Load prices from DB
async function loadBoostingPrices() {
    try {
        const res  = await fetch('api/get_services.php?type=boosting&game=league-of-legends');
        const data = await res.json();
        if (!data.success) return;
        const d = data.data;

        if (d.division_prices && Object.keys(d.division_prices).length) DIVISION_PRICES = d.division_prices;
        if (d.win_boost      && Object.keys(d.win_boost).length)       WIN_BOOST_PRICES = d.win_boost;
        if (d.placement      && Object.keys(d.placement).length)       PLACEMENT_PRICES = d.placement;
        if (d.arena          && Object.keys(d.arena).length)           ARENA_PRICES     = d.arena;
        if (d.arena_lp_config && Object.keys(d.arena_lp_config).length) ARENA_LP_CONFIG = d.arena_lp_config;
        if (d.mastery        && Object.keys(d.mastery).length) {
            const m = d.mastery;
            MASTERY_PRICES = [0, m[1]||8.22, m[2]||13.08, m[3]||15.09, m[4]||15.73, m[5]||18.04, m[6]||20.52, m[7]||22.85, m[8]||25.21, m[9]||26.43];
        }
        if (d.options        && Object.keys(d.options).length)         OPTION_MULT = { ...OPTION_MULT, ...d.options };
        if (d.lp_gain        && Object.keys(d.lp_gain).length) {
            if (d.lp_gain.high   !== undefined) LP_GAIN_MULT.high   = 1 - d.lp_gain.high;
            if (d.lp_gain.low    !== undefined) LP_GAIN_MULT.low    = 1 + d.lp_gain.low;
        }
        if (d.restriction_per_game)  RESTRICTION_PER_GAME  = d.restriction_per_game;
        if (d.battle_pass_per_level) BATTLE_PASS_PER_LEVEL = d.battle_pass_per_level;

        // Recalculate price after DB load
        updatePrice();
        updateCheckoutSummary();
    } catch(e) {
        //console.warn('Could not load boosting prices from DB, using defaults:', e);
    }
}

const RANK_ORDER  = ['iron', 'bronze', 'silver', 'gold', 'platinum', 'emerald', 'diamond'];
const DIV_ORDER   = ['IV', 'III', 'II', 'I'];
const LP_DISCOUNT = { '0-20': 0.00, '21-40': 0.10, '41-60': 0.18, '61-80': 0.27, '81-99': 0.36 };
const MASTER_PLUS = ['master', 'grandmaster', 'challenger'];
const MASTER_LP_CONFIG = {
    master:      { min: 0,   max: 699,  default: 0   },
    grandmaster: { min: 700, max: 814,  default: 700  },
    challenger:  { min: 815, max: 1300, default: 815  },
};
const DIAMOND_TO_MASTER = 174.64;
const ARENA_ICON = {
    wood: 'pics/arenawood.png', bronze: 'pics/arenabronze.png',
    silver: 'pics/arenasilver.png', gold: 'pics/arenagold.png',
    gladiator: 'pics/arenagladiator.png',
};

function calcMasteryPrice(from, to) {
    if (to <= from) return 0;
    let total = 0;
    for (let i = from; i < to; i++) total += MASTERY_PRICES[i] || 0;
    return total;
}

// Champion name → Data Dragon key mapping
const CHAMP_DD_KEY = {
    'Aurelion Sol': 'AurelionSol', 'Bel\'Veth': 'Belveth', 'Cho\'Gath': 'Chogath',
    'Dr. Mundo': 'DrMundo', 'Jarvan IV': 'JarvanIV', 'Kai\'Sa': 'Kaisa',
    'Kha\'Zix': 'Khazix', 'K\'Sante': 'KSante', 'Kog\'Maw': 'KogMaw',
    'LeBlanc': 'Leblanc', 'Lee Sin': 'LeeSin', 'Master Yi': 'MasterYi',
    'Miss Fortune': 'MissFortune', 'Nunu & Willump': 'Nunu', 'Rek\'Sai': 'RekSai',
    'Renata Glasc': 'Renata', 'Tahm Kench': 'TahmKench', 'Twisted Fate': 'TwistedFate',
    'Vel\'Koz': 'Velkoz', 'Wukong': 'MonkeyKing', 'Xin Zhao': 'XinZhao',
};

const ALL_CHAMPIONS = [
    'Aatrox','Ahri','Akali','Akshan','Alistar','Ambessa','Amumu','Anivia','Annie',
    'Aphelios','Ashe','Aurelion Sol','Aurora','Azir','Bard','Bel\'Veth','Blitzcrank',
    'Brand','Braum','Briar','Caitlyn','Camille','Cassiopeia','Cho\'Gath','Corki',
    'Darius','Diana','Dr. Mundo','Draven','Ekko','Elise','Evelynn','Ezreal',
    'Fiddlesticks','Fiora','Fizz','Galio','Gangplank','Garen','Gnar','Gragas',
    'Graves','Gwen','Hecarim','Heimerdinger','Hwei','Illaoi','Irelia','Ivern',
    'Janna','Jarvan IV','Jax','Jayce','Jhin','Jinx','K\'Sante','Kai\'Sa','Kalista',
    'Karma','Karthus','Kassadin','Katarina','Kayle','Kayn','Kennen','Kha\'Zix',
    'Kindred','Kled','Kog\'Maw','LeBlanc','Lee Sin','Leona','Lillia','Lissandra',
    'Lucian','Lulu','Lux','Malphite','Malzahar','Maokai','Master Yi','Mel','Milio',
    'Miss Fortune','Mordekaiser','Morgana','Naafiri','Nami','Nasus','Nautilus',
    'Neeko','Nidalee','Nilah','Nocturne','Nunu & Willump','Olaf','Orianna','Ornn',
    'Pantheon','Poppy','Pyke','Qiyana','Quinn','Rakan','Rammus','Rek\'Sai','Rell',
    'Renata Glasc','Renekton','Rengar','Riven','Rumble','Ryze','Samira','Sejuani',
    'Senna','Seraphine','Sett','Shaco','Shen','Shyvana','Singed','Sion','Sivir',
    'Skarner','Smolder','Sona','Soraka','Swain','Sylas','Syndra','Tahm Kench',
    'Taliyah','Talon','Taric','Teemo','Thresh','Tristana','Trundle','Tryndamere',
    'Twisted Fate','Twitch','Udyr','Urgot','Varus','Vayne','Veigar','Vel\'Koz',
    'Vex','Vi','Viego','Viktor','Vladimir','Volibear','Warwick','Wukong','Xayah',
    'Xerath','Xin Zhao','Yasuo','Yone','Yorick','Yunara','Yuumi','Zaahen','Zac',
    'Zed','Zeri','Ziggs','Zilean','Zoe','Zyra'
];

function getChampImgUrl(name) {
    const key = CHAMP_DD_KEY[name] || name.replace(/[^a-zA-Z0-9]/g, '');
    return `https://ddragon.leagueoflegends.com/cdn/img/champion/tiles/${key}_0.jpg`;
}


const RANK_TO_ICON = {
    iron: 'pics/miniiron.png', bronze: 'pics/minibronze.png',
    silver: 'pics/minisilver.png', gold: 'pics/minigold.png',
    platinum: 'pics/miniplat.png', emerald: 'pics/miniemerald.png',
    diamond: 'pics/minidiamond.png', master: 'pics/minimaster.png',
    grandmaster: 'pics/minigrandmaster.png', challenger: 'pics/minichallanger.png',
};

const state = {
    boostType: 'rank-boost',
    currentRank: 'gold', currentDiv: 'IV', currentLp: 0,
    desiredRank: 'gold', desiredDiv: 'III', desiredLp: 0,
    lpRange: '0-20', lpGain: 'normal',
    priority: false, soloQueue: false, stream: false, booster: true,
    discountPct: 0,
    wins: 1,
    champRole: false,
    placements: 1,
    placementRank: 'iron',
    restrictionGames: 1,
    bpCurrent: 1,
    bpDesired: 55,
    arenaRank: 'wood',
    arenaLp:   0,
    arenaWins: 1,
    masteryFrom: 1,
    masteryTo:   2,
    masteryChamp: 'Aatrox',
};

function isMasterPlus(rank) { return MASTER_PLUS.includes(rank); }

function calcRankBoostPrice(fromRank, fromDiv, toRank, toDiv, lpRange, lpGain) {
    const fromRankIdx = RANK_ORDER.indexOf(fromRank);
    const toRankIdx   = RANK_ORDER.indexOf(toRank);
    const fromDivIdx  = DIV_ORDER.indexOf(fromDiv);
    const toDivIdx    = DIV_ORDER.indexOf(toDiv);
    if (fromRankIdx === -1 || toRankIdx === -1) return 0;
    if (toRankIdx < fromRankIdx) return 0;
    if (toRankIdx === fromRankIdx && toDivIdx <= fromDivIdx) return 0;
    let total = 0, curRankIdx = fromRankIdx, curDivIdx = fromDivIdx;
    while (true) {
        if (curRankIdx === toRankIdx && curDivIdx === toDivIdx) break;
        const prices = DIVISION_PRICES[RANK_ORDER[curRankIdx]];
        if (curDivIdx === 3) { total += prices[3]; curRankIdx++; curDivIdx = 0; }
        else { total += prices[curDivIdx]; curDivIdx++; }
        if (curRankIdx >= RANK_ORDER.length) break;
    }
    total -= DIVISION_PRICES[fromRank][Math.min(fromDivIdx, 2)] * (LP_DISCOUNT[lpRange] || 0);
    total *= (LP_GAIN_MULT[lpGain] || 1.00);
    return Math.max(0, total);
}

function calcLpRangeCost(fromLp, toLp) {
    const segs = [
        { from: 0,   to: 100,  price: 4.1724 },
        { from: 100, to: 700,  price: 4.7175 },
        { from: 700, to: 815,  price: 4.6336 },
        { from: 815, to: 1300, price: 9.8257 },
    ];
    let cost = 0;
    for (const s of segs) {
        const sf = Math.max(fromLp, s.from), st = Math.min(toLp, s.to);
        if (st > sf) cost += (st - sf) * s.price;
    }
    return cost;
}

function calcMasterPlusPrice(fromRank, fromLp, toRank, toLp) {
    let total = 0;
    if (fromRank === 'diamond') {
        total += DIAMOND_TO_MASTER;
        if (toRank === 'master') return total;
        fromLp = 0;
    }
    if (toLp > fromLp) total += calcLpRangeCost(fromLp, toLp);
    return total;
}

function isValidSelection() {
    const fromIdx = RANK_ORDER.indexOf(state.currentRank);
    const toIdx   = RANK_ORDER.indexOf(state.desiredRank);
    if (isMasterPlus(state.currentRank) && !isMasterPlus(state.desiredRank)) return false;
    if (!isMasterPlus(state.currentRank) && !isMasterPlus(state.desiredRank)) {
        if (toIdx < fromIdx) return false;
        if (toIdx === fromIdx) return DIV_ORDER.indexOf(state.desiredDiv) > DIV_ORDER.indexOf(state.currentDiv);
        return true;
    }
    if (isMasterPlus(state.currentRank) && isMasterPlus(state.desiredRank)) {
        return (state.desiredLp || 0) > (state.currentLp || 0);
    }
    return true;
}

function updatePrice() {
    const buyBtn  = document.querySelector('.checkout-buy-btn');
    const origEl  = document.querySelector('.checkout-original');
    const finalEl = document.querySelector('.checkout-final');

    if (state.boostType !== 'rank-boost' && state.boostType !== 'win-boost' && state.boostType !== 'placement-boost' && state.boostType !== 'restriction-removal' && state.boostType !== 'battle-pass' && state.boostType !== 'arena-boost' && state.boostType !== 'champion-mastery') {
        if (buyBtn) { buyBtn.disabled = false; buyBtn.style.opacity = '1'; }
        return;
    }

    if (state.boostType === 'rank-boost' && !isValidSelection()) {
        if (origEl)  origEl.style.display = 'none';
        if (finalEl) finalEl.textContent  = '€0.00EUR';
        if (buyBtn)  { buyBtn.disabled = true; buyBtn.style.opacity = '0.4'; }
        return;
    }

    if (buyBtn) { buyBtn.disabled = false; buyBtn.style.opacity = '1'; }

    let base = 0;
    const fromM  = isMasterPlus(state.currentRank);
    const toM    = isMasterPlus(state.desiredRank);
    const fromD1 = state.currentRank === 'diamond' && state.currentDiv === 'I';

    if (state.boostType === 'champion-mastery') {
        base = calcMasteryPrice(state.masteryFrom, state.masteryTo);
    } else if (state.boostType === 'arena-boost') {
        base = (ARENA_PRICES[state.arenaRank] || 0) * state.arenaWins;
    } else if (state.boostType === 'battle-pass') {
        const levels = Math.max(0, state.bpDesired - state.bpCurrent);
        base = levels * BATTLE_PASS_PER_LEVEL;
    } else if (state.boostType === 'restriction-removal') {
        base = RESTRICTION_PER_GAME * state.restrictionGames;
    } else if (state.boostType === 'placement-boost') {
        const pricePerGame = PLACEMENT_PRICES[state.placementRank] || 0;
        base = pricePerGame * state.placements;
    } else if (state.boostType === 'win-boost') {
        const pricePerWin = WIN_BOOST_PRICES[state.currentRank] || 0;
        const noMultRanks = ['iron', 'bronze', 'silver'];
        let divMultiplier = 1.00;
        if (!noMultRanks.includes(state.currentRank) && !isMasterPlus(state.currentRank)) {
            const divIdx = DIV_ORDER.indexOf(state.currentDiv); // IV=0, III=1, II=2, I=3
            divMultiplier = 1 + (divIdx * 0.05); // IV:1.00, III:1.05, II:1.10, I:1.15
        }
        base = pricePerWin * divMultiplier * state.wins;
    } else if (fromD1 && toM) {
        base = calcMasterPlusPrice('diamond', 0, state.desiredRank, state.desiredLp || 0);
    } else if (fromM && toM) {
        base = calcMasterPlusPrice(state.currentRank, state.currentLp || 0, state.desiredRank, state.desiredLp || 0);
    } else if (!fromM && toM) {
        base = calcRankBoostPrice(state.currentRank, state.currentDiv, 'diamond', 'I', state.lpRange, state.lpGain);
        base += calcMasterPlusPrice('diamond', 0, state.desiredRank, state.desiredLp || 0);
    } else {
        base = calcRankBoostPrice(state.currentRank, state.currentDiv, state.desiredRank, state.desiredDiv, state.lpRange, state.lpGain);
    }

    let mult = 1.00;
    if (state.champRole)  mult += 0.15;
    if (state.priority)   mult += OPTION_MULT.priority;
    if (state.soloQueue) mult += OPTION_MULT.soloQueue;
    if (state.stream)    mult += OPTION_MULT.stream;
    if (state.booster)   mult += OPTION_MULT.booster;

    let final = base * mult;
    if (state.discountPct > 0) final *= (1 - state.discountPct / 100);

    if (origEl) {
        if (mult > 1 || state.discountPct > 0) { origEl.textContent = '€' + base.toFixed(2) + 'EUR'; origEl.style.display = 'inline'; }
        else origEl.style.display = 'none';
    }
    if (finalEl) finalEl.textContent = '€' + final.toFixed(2) + 'EUR';
}

function updateCheckoutSummary() {
    const fromIcon = document.getElementById('checkoutFromIcon');
    const toIcon   = document.getElementById('checkoutToIcon');
    const fromEl   = document.getElementById('checkoutFrom');
    const toEl     = document.getElementById('checkoutTo');
    const cap = s => s.charAt(0).toUpperCase() + s.slice(1);

    if (state.boostType === 'champion-mastery') {
        if (fromIcon) { fromIcon.src = `pics/mastery${state.masteryFrom}.PNG`; fromIcon.style.display = 'inline'; }
        if (toIcon)   { toIcon.src   = `pics/mastery${state.masteryTo}.PNG`;   toIcon.style.display   = 'inline'; }
        if (fromEl)   fromEl.textContent = 'Mastery ' + state.masteryFrom;
        if (toEl)     toEl.textContent   = 'Mastery ' + state.masteryTo;
        return;
    }

    if (state.boostType === 'arena-boost') {
        const cap = s => s.charAt(0).toUpperCase() + s.slice(1);
        if (fromIcon) { fromIcon.src = ARENA_ICON[state.arenaRank] || ''; fromIcon.style.display = 'inline'; }
        if (toIcon)   toIcon.style.display = 'none';
        if (fromEl)   fromEl.textContent = cap(state.arenaRank) + ' ' + state.arenaLp + ' LP';
        if (toEl)     toEl.textContent   = state.arenaWins + (state.arenaWins === 1 ? ' Win' : ' Wins');
        return;
    }

    if (state.boostType === 'battle-pass') {
        if (fromIcon) { fromIcon.src = 'pics/battlepassboost.png'; fromIcon.style.display = 'inline'; }
        if (toIcon)   { toIcon.src   = 'pics/battlepassboost.png'; toIcon.style.display   = 'inline'; }
        if (fromEl)   fromEl.textContent = 'Milestone ' + state.bpCurrent;
        if (toEl)     toEl.textContent   = 'Milestone ' + state.bpDesired;
        return;
    }

    if (state.boostType === 'restriction-removal') {
        if (fromIcon) fromIcon.style.display = 'none';
        if (toIcon)   toIcon.style.display   = 'none';
        if (fromEl)   fromEl.textContent = state.restrictionGames + (state.restrictionGames === 1 ? ' Normal Game' : ' Normal Games');
        if (toEl)     toEl.textContent   = '';
        return;
    }

    if (state.boostType === 'placement-boost') {
        const cap = s => s.charAt(0).toUpperCase() + s.slice(1);
        if (fromIcon) { fromIcon.src = RANK_TO_ICON[state.placementRank] || ''; fromIcon.style.display = 'inline'; }
        if (toIcon)   toIcon.style.display = 'none';
        if (fromEl)   fromEl.textContent = cap(state.placementRank);
        if (toEl)     toEl.textContent = state.placements + (state.placements === 1 ? ' Placement' : ' Placements');
        return;
    }

    if (state.boostType === 'win-boost') {
        if (fromIcon) { fromIcon.src = RANK_TO_ICON[state.currentRank] || ''; fromIcon.style.display = 'inline'; }
        if (toIcon)   toIcon.style.display = 'none';
        if (fromEl)   fromEl.textContent = isMasterPlus(state.currentRank)
            ? cap(state.currentRank) + ' ' + (state.currentLp || 0) + ' LP'
            : cap(state.currentRank) + ' ' + state.currentDiv;
        if (toEl)     toEl.textContent = state.wins + (state.wins === 1 ? ' Win' : ' Wins');
        return;
    }

    if (fromIcon) { fromIcon.src = RANK_TO_ICON[state.currentRank] || ''; fromIcon.style.display = 'inline'; }
    if (toIcon)   { toIcon.src   = RANK_TO_ICON[state.desiredRank] || ''; toIcon.style.display   = 'inline'; }
    if (fromEl)   fromEl.textContent = isMasterPlus(state.currentRank) ? cap(state.currentRank) + ' ' + (state.currentLp||0) + ' LP' : cap(state.currentRank) + ' ' + state.currentDiv;
    if (toEl)     toEl.textContent   = isMasterPlus(state.desiredRank) ? cap(state.desiredRank)  + ' ' + (state.desiredLp||0)  + ' LP' : cap(state.desiredRank)  + ' ' + state.desiredDiv;
}

function switchToLpCounter(which, rank) {
    const divSel    = document.getElementById(which + 'DivisionSelector');
    const lpCounter = document.getElementById(which + 'LpCounter');
    const lpInput   = document.getElementById(which + 'LpValue');
    if (isMasterPlus(rank)) {
        if (divSel)    divSel.style.display    = 'none';
        if (lpCounter) lpCounter.style.display = 'flex';
        const cfg = MASTER_LP_CONFIG[rank];
        if (lpInput) { lpInput.value = cfg.default; lpInput.min = cfg.min; lpInput.max = cfg.max; }
        if (which === 'current') { state.currentDiv = 'I'; state.currentLp = cfg.default; }
        else                     { state.desiredDiv  = 'I'; state.desiredLp  = cfg.default; }
    } else {
        if (divSel)    divSel.style.display    = 'flex';
        if (lpCounter) lpCounter.style.display = 'none';
        // Olvassuk vissza az aktív division gombot a state-be
        if (divSel) {
            const activeBtn = divSel.querySelector('.division-btn.active');
            if (activeBtn) {
                const div = activeBtn.getAttribute('data-div');
                if (which === 'current') state.currentDiv = div;
                else state.desiredDiv = div;
            }
        }
    }
}

function syncStateFromDOM() {
    const panel = document.getElementById('panel-' + state.boostType);
    if (!panel) return;

    if (state.boostType === 'rank-boost') {
        const grids = panel.querySelectorAll('.rank-grid');

        // Current rank
        const activeCurrentRank = grids[0]?.querySelector('.rank-icon-btn.active');
        if (activeCurrentRank) state.currentRank = activeCurrentRank.getAttribute('data-rank');

        // Current division (or LP counter)
        const currentDivSel = document.getElementById('currentDivisionSelector');
        const currentLpCounter = document.getElementById('currentLpCounter');
        if (currentLpCounter && currentLpCounter.style.display !== 'none') {
            state.currentLp = parseInt(document.getElementById('currentLpValue')?.value) || 0;
        } else {
            const activeCurrentDiv = currentDivSel?.querySelector('.division-btn.active');
            if (activeCurrentDiv) state.currentDiv = activeCurrentDiv.getAttribute('data-div');
        }

        // Desired rank
        const activeDesiredRank = grids[1]?.querySelector('.rank-icon-btn.active');
        if (activeDesiredRank) state.desiredRank = activeDesiredRank.getAttribute('data-rank');

        // Desired division (or LP counter)
        const desiredDivSel = document.getElementById('desiredDivisionSelector');
        const desiredLpCounter = document.getElementById('desiredLpCounter');
        if (desiredLpCounter && desiredLpCounter.style.display !== 'none') {
            state.desiredLp = parseInt(document.getElementById('desiredLpValue')?.value) || 0;
        } else {
            const activeDesiredDiv = desiredDivSel?.querySelector('.division-btn.active');
            if (activeDesiredDiv) state.desiredDiv = activeDesiredDiv.getAttribute('data-div');
        }

    } else if (state.boostType === 'win-boost') {
        const grid = panel.querySelector('.rank-grid');
        const activeRank = grid?.querySelector('.rank-icon-btn.active');
        if (activeRank) state.currentRank = activeRank.getAttribute('data-rank');
        const activeDiv = panel.querySelector('.division-selector .division-btn.active');
        if (activeDiv) state.currentDiv = activeDiv.getAttribute('data-div');
        const winsSlider = document.getElementById('winsSlider');
        if (winsSlider) state.wins = parseInt(winsSlider.value);

    } else if (state.boostType === 'placement-boost') {
        const grid = panel.querySelector('.rank-grid');
        const activeRank = grid?.querySelector('.rank-icon-btn.active');
        if (activeRank) state.placementRank = activeRank.getAttribute('data-rank');
        const placementSlider = document.getElementById('placementSlider');
        if (placementSlider) state.placements = parseInt(placementSlider.value);

    } else if (state.boostType === 'restriction-removal') {
        const slider = document.getElementById('restrictionSlider');
        if (slider) state.restrictionGames = parseInt(slider.value);

    } else if (state.boostType === 'battle-pass') {
        const bpC = document.getElementById('bpCurrentSlider');
        const bpD = document.getElementById('bpDesiredSlider');
        if (bpC) state.bpCurrent = parseInt(bpC.value);
        if (bpD) state.bpDesired = parseInt(bpD.value);

    } else if (state.boostType === 'arena-boost') {
        const grid = panel.querySelector('.rank-grid');
        const activeRank = grid?.querySelector('.rank-icon-btn.active');
        if (activeRank) state.arenaRank = activeRank.getAttribute('data-rank');
        const arenaInput = document.getElementById('arenaLpValue');
        if (arenaInput) state.arenaLp = parseInt(arenaInput.value) || 0;
        const arenaWinsSlider = document.getElementById('arenaWinsSlider');
        if (arenaWinsSlider) state.arenaWins = parseInt(arenaWinsSlider.value);

    } else if (state.boostType === 'champion-mastery') {
        const cm = document.getElementById('currentMastery');
        const dm = document.getElementById('desiredMastery');
        if (cm) state.masteryFrom = parseInt(cm.value) || 1;
        if (dm) state.masteryTo   = parseInt(dm.value) || 2;
    }
}



document.addEventListener('DOMContentLoaded', function () {

    const initialBoost = new URLSearchParams(window.location.search).get('boost') || 'rank-boost';

    // TABS
    const boostTabs   = document.querySelectorAll('.boost-tab');
    const boostPanels = document.querySelectorAll('.boost-panel');
    boostTabs.forEach(tab => {
        tab.addEventListener('click', function () {
            state.boostType = this.getAttribute('data-boost');
            boostTabs.forEach(t => t.classList.remove('active'));
            this.classList.add('active');
            boostPanels.forEach(p => p.classList.remove('active'));
            const panel = document.getElementById('panel-' + state.boostType);
            if (panel) panel.classList.add('active');
            document.getElementById('boostHeroTitle').textContent    = this.getAttribute('data-title');
            document.getElementById('boostHeroSubtitle').textContent = this.getAttribute('data-subtitle');
            document.getElementById('boostHeroIcon').src = 'pics/' + this.getAttribute('data-icon');
            syncStateFromDOM();
            updateCheckoutSummary();
            updatePrice();
        });
    });
    const initialTab = document.querySelector(`.boost-tab[data-boost="${initialBoost}"]`);
    if (initialTab) initialTab.click();

    // RANK ICONS
    document.querySelectorAll('.rank-grid').forEach(grid => {
        grid.querySelectorAll('.rank-icon-btn').forEach(btn => {
            btn.addEventListener('click', function () {
                grid.querySelectorAll('.rank-icon-btn').forEach(b => b.classList.remove('active'));
                this.classList.add('active');
                const rank  = this.getAttribute('data-rank');
                const panel = this.closest('.boost-panel');
                const which = Array.from(panel ? panel.querySelectorAll('.rank-grid') : []).indexOf(grid) === 0 ? 'current' : 'desired';

                // Placement boost: külön state
                if (panel && panel.id === 'panel-placement-boost') {
                    state.placementRank = rank;
                    const icon = panel.querySelector('.config-rank-icon-sm');
                    if (icon) icon.src = RANK_TO_ICON[rank] || '';
                    updateCheckoutSummary();
                    updatePrice();
                    return;
                }
                if (which === 'current') {
                    state.currentRank = rank;
                    const icon = document.getElementById('currentRankIcon');
                    if (icon) icon.src = RANK_TO_ICON[rank] || '';
                    // Win boost panel icon frissítése
                    const winIcon = document.getElementById('winBoostRankIcon');
                    if (winIcon) winIcon.src = RANK_TO_ICON[rank] || '';
                } else {
                    state.desiredRank = rank;
                    const icon = document.getElementById('desiredRankIcon');
                    if (icon) icon.src = RANK_TO_ICON[rank] || '';
                }
                switchToLpCounter(which, rank);
                updateCheckoutSummary();
                updatePrice();
            });
        });
    });

    // DIVISIONS
    document.querySelectorAll('.division-selector').forEach(selector => {
        selector.querySelectorAll('.division-btn').forEach(btn => {
            btn.addEventListener('click', function () {
                selector.querySelectorAll('.division-btn').forEach(b => b.classList.remove('active'));
                this.classList.add('active');
                const div   = this.getAttribute('data-div');
                const panel = this.closest('.boost-panel');
                const which = Array.from(panel ? panel.querySelectorAll('.division-selector') : []).indexOf(selector) === 0 ? 'current' : 'desired';
                if (which === 'current') state.currentDiv = div;
                else state.desiredDiv = div;
                updateCheckoutSummary();
                updatePrice();
            });
        });
    });

    // MASTER+ LP COUNTER
    ['current', 'desired'].forEach(which => {
        const minus = document.getElementById(which + 'LpMinus');
        const plus  = document.getElementById(which + 'LpPlus');
        const input = document.getElementById(which + 'LpValue');
        if (!minus || !plus || !input) return;
        const getCfg = () => MASTER_LP_CONFIG[which === 'current' ? state.currentRank : state.desiredRank] || { min: 0, max: 699 };
        const clamp = val => {
            const cfg = getCfg();
            val = Math.max(cfg.min, Math.min(cfg.max, isNaN(val) ? cfg.min : val));
            input.value = val;
            if (which === 'current') state.currentLp = val; else state.desiredLp = val;
            updateCheckoutSummary(); updatePrice();
        };
        minus.addEventListener('click', () => clamp(parseInt(input.value) - 1));
        plus.addEventListener('click',  () => clamp(parseInt(input.value) + 1));
        input.addEventListener('blur',  () => clamp(parseInt(input.value)));
        input.addEventListener('keydown', e => { if (e.key === 'Enter') input.blur(); });
        input.addEventListener('input', () => {
            const cfg = getCfg(), val = parseInt(input.value);
            if (!isNaN(val) && val >= cfg.min && val <= cfg.max) {
                if (which === 'current') state.currentLp = val; else state.desiredLp = val;
                updateCheckoutSummary(); updatePrice();
            }
        });
    });

    // DROPDOWNS
    document.querySelectorAll('.boost-select').forEach(select => {
        select.addEventListener('change', function () {
            const label = this.closest('.config-dropdown-group')?.querySelector('label')?.textContent;
            if (label === 'LP Gain') { state.lpGain = this.value; updatePrice(); }
            if (label === 'Current LP') {
                const m = this.options[this.selectedIndex].text.match(/\d+-\d+/);
                if (m) { state.lpRange = m[0]; updatePrice(); }
            }
        });
    });

    // TOGGLES
    document.querySelectorAll('.toggle-input').forEach(toggle => {
        toggle.addEventListener('change', function () {
            const label = this.closest('.checkout-option')?.querySelector('.checkout-option-name')?.textContent || '';
            if (label.includes('Priority'))  state.priority  = this.checked;
            if (label.includes('Solo'))      state.soloQueue = this.checked;
            if (label.includes('Stream'))    state.stream    = this.checked;
            if (label.includes('booster'))   state.booster   = this.checked;
            updatePrice();
        });
    });

    // CHAMPION & ROLE MODAL
    const crModal       = document.getElementById('champRoleModal');
    const crOverlay     = document.getElementById('crModalOverlay');
    const crClose       = document.getElementById('crModalClose');
    const crConfirm     = document.getElementById('crConfirmBtn');
    const crChampSearch = document.getElementById('crChampSearch');
    const crChampGrid   = document.getElementById('crChampGrid');
    const crToggle      = document.getElementById('champRoleToggle');
    const crEditBtn     = document.getElementById('champRoleEditBtn');
    const crBadge       = document.getElementById('champRoleBadge');

    let crState = { roles: [], champions: [] };
    let crTemp  = { roles: [], champions: [] };

    function openCrModal() {
        crTemp = { roles: [...crState.roles], champions: [...crState.champions] };
        // Sync role buttons
        document.querySelectorAll('.cr-role-btn').forEach(btn => {
            btn.classList.toggle('active', crTemp.roles.includes(btn.getAttribute('data-role')));
        });
        buildCrChampGrid('');
        if (crChampSearch) crChampSearch.value = '';
        crModal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    function closeCrModal() {
        crModal.classList.remove('active');
        document.body.style.overflow = '';
    }

    function buildCrChampGrid(filter) {
        if (!crChampGrid) return;
        crChampGrid.innerHTML = '';
        const list = ALL_CHAMPIONS.filter(c => c.toLowerCase().includes(filter.toLowerCase()));
        list.forEach(name => {
            const div = document.createElement('div');
            div.className = 'cr-champ-item' + (crTemp.champions?.includes(name) ? ' active' : '');
            const img = document.createElement('img');
            img.src = getChampImgUrl(name);
            img.alt = name;
            img.onerror = () => img.style.display = 'none';
            const span = document.createElement('span');
            span.textContent = name;
            div.appendChild(img);
            div.appendChild(span);
            div.addEventListener('click', () => {
                const idx = crTemp.champions ? crTemp.champions.indexOf(name) : -1;
                if (!crTemp.champions) crTemp.champions = [];
                if (idx >= 0) {
                    crTemp.champions.splice(idx, 1);
                    div.classList.remove('active');
                } else {
                    crTemp.champions.push(name);
                    div.classList.add('active');
                }
                updateCrBadge();
            });
            crChampGrid.appendChild(div);
        });
    }

    function updateCrBadge() {
        const hasChamp = crTemp.champions && crTemp.champions.length > 0;
        if (crBadge) {
            if (hasChamp) {
                crBadge.textContent = '15 %';
                crBadge.className = 'checkout-badge percent';
            } else {
                crBadge.textContent = 'Free';
                crBadge.className = 'checkout-badge free';
            }
        }
    }

    // Role buttons
    document.querySelectorAll('.cr-role-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const role = btn.getAttribute('data-role');
            const idx = crTemp.roles.indexOf(role);
            if (idx >= 0) crTemp.roles.splice(idx, 1);
            else crTemp.roles.push(role);
            btn.classList.toggle('active', crTemp.roles.includes(role));
        });
    });

    // Search
    if (crChampSearch) {
        crChampSearch.addEventListener('input', () => buildCrChampGrid(crChampSearch.value));
    }

    // Toggle opens modal
    if (crToggle) {
        crToggle.addEventListener('change', function () {
            if (this.checked) {
                openCrModal();
            } else {
                crState = { roles: [], champions: [] };
                if (crEditBtn) crEditBtn.style.display = 'none';
                if (crBadge) { crBadge.textContent = 'Free'; crBadge.className = 'checkout-badge free'; }
                state.champRole = false;
                updatePrice();
            }
        });
    }

    // Edit button also opens modal
    if (crEditBtn) crEditBtn.addEventListener('click', openCrModal);

    // Confirm
    if (crConfirm) {
        crConfirm.addEventListener('click', () => {
            crState = { roles: [...crTemp.roles], champions: [...(crTemp.champions||[])] };
            const hasChamp = crState.champions.length > 0;
            // Badge
            if (crBadge) {
                if (hasChamp) { crBadge.textContent = '15 %'; crBadge.className = 'checkout-badge percent'; }
                else { crBadge.textContent = 'Free'; crBadge.className = 'checkout-badge free'; }
            }
            // Show edit button if anything selected
            const hasAnything = crState.roles.length > 0 || crState.champions.length > 0;
            if (crEditBtn) crEditBtn.style.display = hasAnything ? 'flex' : 'none';
            // Update price state
            state.champRole = crState.champions.length > 0;
            if (crToggle && !crToggle.checked) crToggle.checked = hasAnything;
            closeCrModal();
            updatePrice();
        });
    }

    if (crClose)   crClose.addEventListener('click', closeCrModal);
    if (crOverlay) crOverlay.addEventListener('click', closeCrModal);

    document.addEventListener('keydown', e => {
        if (e.key === 'Escape' && crModal?.classList.contains('active')) closeCrModal();
    });
    const couponInput = document.querySelector('.coupon-input');
    const couponBtn   = document.querySelector('.coupon-btn');
    if (couponBtn) {
        couponBtn.addEventListener('click', () => {
            const code = couponInput?.value?.trim().toUpperCase();
            const coupons = { 'GLIDE20': 20, 'WELCOME10': 10, 'VIP15': 15 };
            if (coupons[code]) {
                state.discountPct = coupons[code];
                const banner = document.querySelector('.checkout-discount');
                if (banner) { banner.style.display = 'flex'; banner.querySelector('span').textContent = `Applied -${coupons[code]}% Successfully ✏`; }
                updatePrice();
            } else if (couponInput) {
                couponInput.style.borderColor = '#ef4444';
                setTimeout(() => couponInput.style.borderColor = '', 1500);
            }
        });
    }
    const discountRemove = document.querySelector('.discount-remove');
    if (discountRemove) {
        discountRemove.addEventListener('click', () => {
            state.discountPct = 0;
            const banner = document.querySelector('.checkout-discount');
            if (banner) banner.style.display = 'none';
            updatePrice();
        });
    }

    // ARENA RANK + LP COUNTER
    const arenaGrid = document.querySelector('#panel-arena-boost .rank-grid');
    if (arenaGrid) {
        arenaGrid.querySelectorAll('.rank-icon-btn').forEach(btn => {
            btn.addEventListener('click', function () {
                arenaGrid.querySelectorAll('.rank-icon-btn').forEach(b => b.classList.remove('active'));
                this.classList.add('active');
                const rank = this.getAttribute('data-rank');
                const cfg  = ARENA_LP_CONFIG[rank];
                state.arenaRank = rank;
                state.arenaLp   = cfg.default;
                const icon = document.getElementById('arenaRankIcon');
                if (icon) icon.src = ARENA_ICON[rank] || '';
                const input = document.getElementById('arenaLpValue');
                if (input) { input.value = cfg.default; input.min = cfg.min; input.max = cfg.max; }
                updateCheckoutSummary();
                updatePrice();
            });
        });
    }

    const arenaInput = document.getElementById('arenaLpValue');
    const arenaM     = document.getElementById('arenaLpMinus');
    const arenaP     = document.getElementById('arenaLpPlus');
    if (arenaInput) {
        const getArenaCfg = () => ARENA_LP_CONFIG[state.arenaRank] || { min: 0, max: 1399 };
        const arenaClamp = val => {
            const cfg = getArenaCfg();
            val = Math.max(cfg.min, Math.min(cfg.max, isNaN(val) ? cfg.min : val));
            arenaInput.value = val;
            state.arenaLp = val;
            updateCheckoutSummary(); updatePrice();
        };
        if (arenaM) arenaM.addEventListener('click', () => arenaClamp(parseInt(arenaInput.value) - 1));
        if (arenaP) arenaP.addEventListener('click', () => arenaClamp(parseInt(arenaInput.value) + 1));
        arenaInput.addEventListener('blur',    () => arenaClamp(parseInt(arenaInput.value)));
        arenaInput.addEventListener('keydown', e => { if (e.key === 'Enter') arenaInput.blur(); });
        arenaInput.addEventListener('input', () => {
            const cfg = getArenaCfg(), val = parseInt(arenaInput.value);
            if (!isNaN(val) && val >= cfg.min && val <= cfg.max) { state.arenaLp = val; updateCheckoutSummary(); updatePrice(); }
        });
    }

    // ARENA WINS SLIDER
    const arenaWinsSlider = document.getElementById('arenaWinsSlider');
    if (arenaWinsSlider) {
        arenaWinsSlider.addEventListener('input', function () {
            state.arenaWins = parseInt(this.value);
            const badge = this.closest('.config-section')?.querySelector('.config-number-badge');
            if (badge) badge.textContent = this.value;
            updateCheckoutSummary(); updatePrice();
        });
    }

    // CHAMPION MASTERY COUNTERS
    function updateMasteryIcons() {
        const ci = document.getElementById('currentMasteryIcon');
        const di = document.getElementById('desiredMasteryIcon');
        if (ci) ci.src = `pics/mastery${state.masteryFrom}.PNG`;
        if (di) di.src = `pics/mastery${state.masteryTo}.PNG`;
    }

    function setupMasteryBtn(btnId, inputId, isFrom) {
        const btn   = document.getElementById(btnId);
        const input = document.getElementById(inputId);
        if (!btn || !input) return;
        btn.addEventListener('click', () => {
            const dir  = btnId.includes('Plus') ? 1 : -1;
            const min  = isFrom ? 1 : state.masteryFrom + 1;
            const max  = isFrom ? state.masteryTo - 1 : 10;
            let val = Math.max(min, Math.min(max, parseInt(input.value) + dir));
            input.value = val;
            if (isFrom) state.masteryFrom = val;
            else        state.masteryTo   = val;
            updateMasteryIcons();
            updateCheckoutSummary();
            updatePrice();
        });
        input.addEventListener('change', () => {
            const min  = isFrom ? 1 : state.masteryFrom + 1;
            const max  = isFrom ? state.masteryTo - 1 : 10;
            let val = Math.max(min, Math.min(max, parseInt(input.value) || min));
            input.value = val;
            if (isFrom) state.masteryFrom = val;
            else        state.masteryTo   = val;
            updateMasteryIcons();
            updateCheckoutSummary();
            updatePrice();
        });
    }

    setupMasteryBtn('currentMasteryMinus', 'currentMastery', true);
    setupMasteryBtn('currentMasteryPlus',  'currentMastery', true);
    setupMasteryBtn('desiredMasteryMinus', 'desiredMastery', false);
    setupMasteryBtn('desiredMasteryPlus',  'desiredMastery', false);

    // CHAMPION SEARCHABLE DROPDOWN
    const champInput   = document.getElementById('champSelectInput');
    const champMenu    = document.getElementById('champDropdownMenu');
    const champSearch  = document.getElementById('champSearch');
    const champList    = document.getElementById('champOptionsList');

    function buildChampList(filter) {
        if (!champList) return;
        champList.innerHTML = '';
        const filtered = ALL_CHAMPIONS.filter(c => c.toLowerCase().includes((filter||'').toLowerCase()));
        filtered.forEach(name => {
            const div = document.createElement('div');
            div.className = 'champ-option' + (name === state.masteryChamp ? ' selected' : '');
            const img = document.createElement('img');
            img.src = getChampImgUrl(name);
            img.className = 'champ-option-icon';
            img.alt = name;
            img.onerror = () => img.style.display = 'none';
            const span = document.createElement('span');
            span.textContent = name;
            div.appendChild(img);
            div.appendChild(span);
            div.addEventListener('click', () => {
                state.masteryChamp = name;
                if (champInput) champInput.value = name;
                const headerIcon = document.getElementById('masteryChampIcon');
                if (headerIcon) headerIcon.src = getChampImgUrl(name);
                champMenu.classList.remove('open');
                if (champSearch) champSearch.value = '';
                buildChampList('');
            });
            champList.appendChild(div);
        });
    }

    if (champInput) {
        champInput.addEventListener('click', e => {
            e.stopPropagation();
            champMenu.classList.toggle('open');
            if (champMenu.classList.contains('open') && champSearch) {
                champSearch.focus();
            }
        });
    }
    if (champSearch) {
        champSearch.addEventListener('input', () => buildChampList(champSearch.value));
        champSearch.addEventListener('click', e => e.stopPropagation());
    }
    document.addEventListener('click', e => {
        if (champMenu && !e.target.closest('.champ-select-wrapper')) {
            champMenu.classList.remove('open');
        }
    });
    buildChampList('');

    // BATTLE PASS
    const bpC = document.getElementById('bpCurrentSlider');
    const bpD = document.getElementById('bpDesiredSlider');
    const updateBP = (changed) => {
        if (!bpC || !bpD) return;
        let c = parseInt(bpC.value);
        let d = parseInt(bpD.value);
        // Prevent crossing
        if (changed === 'current' && c >= d) { c = d - 1; bpC.value = c; }
        if (changed === 'desired' && d <= c) { d = c + 1; bpD.value = d; }
        state.bpCurrent = c;
        state.bpDesired = d;
        document.getElementById('bpCurrentName').textContent  = 'Milestone ' + c;
        document.getElementById('bpCurrentLabel').textContent = 'Level ' + c;
        document.getElementById('bpDesiredName').textContent  = 'Milestone ' + d;
        document.getElementById('bpDesiredLabel').textContent = 'Level ' + d;
        document.getElementById('bpRangeText').textContent = c + ' to Level ' + d + ' (' + Math.max(0, d - c) + ' levels)';
        const bubC = document.getElementById('bpCurrentBubble');
        const bubD = document.getElementById('bpDesiredBubble');
        if (bubC) bubC.textContent = c;
        if (bubD) bubD.textContent = d;
        updateCheckoutSummary();
        updatePrice();
    };
    if (bpC) {
        bpC.addEventListener('input', () => updateBP('current'));
        bpD.addEventListener('input', () => updateBP('desired'));
    }

    // SLIDERS
    document.querySelectorAll('.boost-slider').forEach(slider => {
        const badge = slider.closest('.config-section')?.querySelector('.config-number-badge');
        if (badge) slider.addEventListener('input', function () { badge.textContent = this.value; });
        // Wins slider specifikus kezelés
        if (slider.id === 'restrictionSlider') {
            slider.addEventListener('input', function () {
                state.restrictionGames = parseInt(this.value);
                if (badge) badge.textContent = this.value;
                updateCheckoutSummary();
                updatePrice();
            });
        }
        if (slider.id === 'placementSlider') {
            slider.addEventListener('input', function () {
                state.placements = parseInt(this.value);
                if (badge) badge.textContent = this.value;
                updateCheckoutSummary();
                updatePrice();
            });
        }
        if (slider.id === 'winsSlider') {
            slider.addEventListener('input', function () {
                state.wins = parseInt(this.value);
                if (badge) badge.textContent = this.value;
                updateCheckoutSummary();
                updatePrice();
            });
        }
    });

    updateCheckoutSummary();
    updatePrice();
    loadBoostingPrices(); // Load prices from DB (overrides defaults if available)

    // BUY NOW → Checkout
    const buyNowBtn = document.querySelector('.checkout-buy-btn');
    if (buyNowBtn) {
        buyNowBtn.addEventListener('click', function () {
            if (this.disabled) return;
            const cap = s => s.charAt(0).toUpperCase() + s.slice(1);
            const finalEl = document.querySelector('.checkout-final');
            const price = finalEl ? finalEl.textContent.replace('EUR','').trim() : '€0.00';

            let name = '', detail = '';

            if (state.boostType === 'rank-boost') {
                name = 'LoL Rank Boost';
                const from = isMasterPlus(state.currentRank) ? cap(state.currentRank) + ' ' + state.currentLp + ' LP' : cap(state.currentRank) + ' ' + state.currentDiv;
                const to   = isMasterPlus(state.desiredRank)  ? cap(state.desiredRank)  + ' ' + state.desiredLp  + ' LP' : cap(state.desiredRank)  + ' ' + state.desiredDiv;
                detail = from + ' → ' + to;
            } else if (state.boostType === 'win-boost') {
                name   = 'LoL Win Boost';
                const rank = cap(state.currentRank) + ' ' + (isMasterPlus(state.currentRank) ? state.currentLp + ' LP' : state.currentDiv);
                detail = rank + ' · ' + state.wins + (state.wins === 1 ? ' Win' : ' Wins');
            } else if (state.boostType === 'placement-boost') {
                name   = 'LoL Placement Boost';
                detail = cap(state.placementRank) + ' · ' + state.placements + (state.placements === 1 ? ' Placement Game' : ' Placement Games');
            } else if (state.boostType === 'restriction-removal') {
                name   = 'LoL Restriction Removal';
                detail = state.restrictionGames + (state.restrictionGames === 1 ? ' Normal Game' : ' Normal Games');
            } else if (state.boostType === 'battle-pass') {
                name   = 'LoL Battle Pass Boost';
                detail = 'Milestone ' + state.bpCurrent + ' → Milestone ' + state.bpDesired;
            } else if (state.boostType === 'arena-boost') {
                name   = 'LoL Arena Win Boost';
                detail = cap(state.arenaRank) + ' ' + state.arenaLp + ' LP · ' + state.arenaWins + (state.arenaWins === 1 ? ' Win' : ' Wins');
            } else if (state.boostType === 'champion-mastery') {
                name   = 'LoL Champion Mastery';
                detail = (state.masteryChamp || 'Champion') + ' · Mastery ' + state.masteryFrom + ' → ' + state.masteryTo;
            }

            // Append region and extra options to detail
            const regionEl = document.querySelector('.region-select select, #regionSelect, [data-region]');
            const region = state.region || '';

            const extras = [];
            if (state.priority)  extras.push('Priority');
            if (state.soloOnly)  extras.push('Solo Only');
            if (state.stream)    extras.push('Stream');
            if (state.withBooster) extras.push('Play with Booster');

            const champEl  = document.querySelector('.champion-confirmed');
            const champName = champEl ? champEl.getAttribute('data-champ') || '' : '';
            const roleEls   = document.querySelectorAll('.role-option.selected, .role-btn.selected');
            const roles     = [...roleEls].map(r => r.getAttribute('data-role') || r.title || '').filter(Boolean);

            let fullDetail = detail;
            if (region) fullDetail += ' · ' + region;
            if (champName) fullDetail += ' · ' + champName;
            if (roles.length) fullDetail += ' · ' + roles.join(', ');
            if (extras.length) fullDetail += ' · ' + extras.join(', ');

            const boostItem = {
                type:  'boost',
                name:  name,
                detail: fullDetail,
                price: price,
                icon:  document.getElementById('boostHeroIcon')?.src.split('/').pop() || 'rankboost.png',
                qty:   1
            };
            localStorage.setItem('imustglide_boost_checkout', JSON.stringify(boostItem));
            window.location.href = 'checkout.html?mode=boost';
        });
    }

    //console.log('✅ LoL Boosting JS initialized!');
});