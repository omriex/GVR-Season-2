const CLOUDFLARED_WSS_URL = 'https://goodbots.bonto.page';

document.addEventListener('contextmenu', e => e.preventDefault());

const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d', { alpha: false });

const uiScaleLayer = document.getElementById('ui-scale-layer');
const mainMenu = document.getElementById('main-menu');
const gameUI = document.getElementById('game-ui');
const nameInput = document.getElementById('player-name-input');
const serverSelect = document.getElementById('server-select');
const server1Option = document.getElementById('server-1-option');
const menuError = document.getElementById('menu-error');
const playBtn = document.getElementById('play-btn');
const statsLayer = document.getElementById('stats-layer');
const scrapsValue = document.getElementById('scraps-value');
const healthFill = document.getElementById('health-fill');
const energyFill = document.getElementById('energy-fill');
const healthValue = document.getElementById('health-value');
const energyValue = document.getElementById('energy-value');
const gameStateTitle = document.getElementById('game-state-title');
const gameStateDivider = document.getElementById('game-state-divider');
const gameStateDesc = document.getElementById('game-state-desc');
const gameStartBtn = document.getElementById('game-start-btn');
const goodbotsCount = document.getElementById('goodbots-count');
const rarebotsCount = document.getElementById('rarebots-count');
const waveCount = document.getElementById('wave-count');
const leaderboardHeader = document.getElementById('leaderboard-header');
const leaderboardList = document.getElementById('leaderboard-list');
const chatLog = document.getElementById('chat-log');
const chatInput = document.getElementById('chat-input');
const chatWrapper = document.getElementById('chat-wrapper');
const chatToggleBtn = document.getElementById('chat-toggle-btn');
const shopBtn = document.getElementById('shop-btn');
const perfStats = document.getElementById('perf-stats');
const fpsCounter = document.getElementById('fps-counter');
const pingCounter = document.getElementById('ping-counter');
const settingsBtn = document.getElementById('settings-btn');
const leaveBtn = document.getElementById('leave-btn');
const settingsOverlay = document.getElementById('settings-overlay');
const settingsCloseBtn = document.getElementById('settings-close-btn');
const settingShowPing = document.getElementById('setting-show-ping');
const settingShowFps = document.getElementById('setting-show-fps');
const uiSizeButtons = document.querySelectorAll('.ui-size-btn');
const settingMusicVolume = document.getElementById('setting-music-volume');
const settingSoundVolume = document.getElementById('setting-sound-volume');
const musicVolumeValue = document.getElementById('music-volume-value');
const soundVolumeValue = document.getElementById('sound-volume-value');
const leaveOverlay = document.getElementById('leave-overlay');
const leaveYesBtn = document.getElementById('leave-yes-btn');
const leaveNoBtn = document.getElementById('leave-no-btn');
const shopOverlay = document.getElementById('shop-overlay');
const shopCloseBtn = document.getElementById('shop-close-btn');
const shopGrid = document.getElementById('shop-grid');
const shopTooltip = document.getElementById('shop-tooltip');
const shopTooltipTitle = document.getElementById('shop-tooltip-title');
const shopTooltipCost = document.getElementById('shop-tooltip-cost');
const shopTooltipDesc = document.getElementById('shop-tooltip-desc');
const shopTooltipStats = document.getElementById('shop-tooltip-stats');
const mobileJoystick = document.getElementById('mobile-joystick');
const mobileJoystickThumb = document.getElementById('mobile-joystick-thumb');
const mobileAttackBtn = document.getElementById('mobile-attack-btn');
const mobileSprintBtn = document.getElementById('mobile-sprint-btn');
const inventoryLayer = document.getElementById('inventory-layer');
const inventorySlots = document.querySelectorAll('#inventory-layer .slot');

const LOGICAL_WIDTH = 1280;
const LOGICAL_HEIGHT = 720;

const WORLD = {
    MAP: {
        tileSize: 64,
        chunkSize: 512,
        columns: 0,
        rows: 0,
        mapData: null,
        bgChunks: [],
        wallChunks: [],
        fgChunks: [],
        wallChunkBounds: [],
        fgChunkBounds: []
    },
    CAMERA: { x: null, y: null, width: LOGICAL_WIDTH, height: LOGICAL_HEIGHT },
    INPUTS: {
        keys: {
            w: false, a: false, s: false, d: false, shift: false,
            arrowup: false, arrowleft: false, arrowdown: false, arrowright: false
        },
        mouseX: 0,
        mouseY: 0
    },
    SYSTEM: { viewScale: 1, isReady: false, lastTime: performance.now(), _gameLoopRunning: false }
};

const ME = {
    x: 0,
    y: 0,
    serverX: 0,
    serverY: 0,
    width: 48,
    height: 48,
    vx: 0,
    vy: 0,
    angle: 0,
    scale: 1,
    health: 1000,
    maxHealth: 1000,
    energy: 255,
    maxEnergy: 255,
    scraps: 0,
    faction: 'goodbot',
    chats: []
};

let ws = null;
let myId = null;
let myName = '';
let inMainMenu = true;
let serverPlayers = {};
let serverEnemies = {};
let stateSeq = 0;
const lbBuf = [];
const emptyChats = [];
let pendingJoinName = null;
let lastRenderedHealth = -1;
let lastRenderedEnergy = -1;
let lastRenderedMaxHealth = -1;
let lastRenderedMaxEnergy = -1;
let lastRenderedScraps = -1;
let lastLeaderboardSig = '';
let hasConnected = false;
let isConnectingWs = false;
const sessionToken = (() => {
    try {
        const existing = sessionStorage.getItem('gvr_session_token');
        if (existing) return existing;
        const created = Math.random().toString(36).slice(2) + Date.now().toString(36);
        sessionStorage.setItem('gvr_session_token', created);
        return created;
    } catch (_) {
        return Math.random().toString(36).slice(2) + Date.now().toString(36);
    }
})();
let activeSlot = 0;
let myInventory = [null, null, null, null, null];
let lastAttackSentAt = 0;
let lastLocalShotAt = 0;
let isAttackHeld = false;
let dragState = null;
let lastEquippedItemKey = null;

const swingAnims = new Map();
const recoilAnims = new Map();
const equipAnims = new Map();
const leftPunchAnims = new Map();
const enemyAggroUntil = new Map();
const enemyAlertBadges = new Map();
const alertCommWaves = [];
const serverProjectiles = new Map();
const explosions = [];
const floatingTexts = [];
const pendingFloatingTexts = [];
const MAX_EXPLOSION_PARTICLES = 240;
const EXPLOSION_COLORS = ['#ff2a00', '#ff7b00', '#ffd000', '#ff4d00'];
const GOODBOT_BULLET_EXPLOSION_COLORS = ['#d84aff', '#a800ff', '#f0aaff', '#ffffff'];
const RAREBOT_BULLET_EXPLOSION_COLORS = ['#ff2a00', '#ff5e3a', '#ff9900', '#ffffff'];

let menuCamX = null;
let menuCamY = null;
let menuCamVX = 60;
let menuCamVY = 45;

let lastInputKeySig = '';
let lastSentAngle = 0;
let lastInputSendTime = 0;

let isSettingsOpen = false;
let isLeaveDialogOpen = false;
let isShopOpen = false;
let isChatMinimized = false;
let isJoining = false;
let serverPlayerCount = 0;
let serverMaxPlayers = 5;
let currentPingMs = null;
let pingProbeUrl = null;
let pingTimerId = null;

const UI_SIZE_MULTIPLIERS = {
    low: 0.8,
    normal: 1.0,
    big: 1.25
};

const initialDpr = window.devicePixelRatio || 1;
const baseDpr = initialDpr < 1 ? 1 : initialDpr;
let lastObservedDpr = initialDpr;
let currentUiScale = 1;
let joystickTouchId = null;
let aimTouchId = null;
let serverDeviceIsMobile = null;

function applyServerDeviceMode(isMobile) {
    if (typeof isMobile !== 'boolean') return;
    serverDeviceIsMobile = isMobile;
    document.body.classList.toggle('touch-mode', serverDeviceIsMobile);
    if (!serverDeviceIsMobile) {
        resetJoystick();
        setMobileSprint(false);
    }
}

function isNodeHostedOrigin() {
    const host = window.location.hostname;
    return host !== 'goodbots.duckdns.org' && !host.endsWith('.github.io');
}

async function fetchDeviceMode() {
    if (!isNodeHostedOrigin()) return;
    try {
        const res = await fetch('/api/device-mode', { cache: 'no-store' });
        if (!res.ok) return;
        const data = await res.json();
        if (typeof data.isMobile === 'boolean') {
            applyServerDeviceMode(data.isMobile);
        }
    } catch (_) {}
}

function layoutBottomHud() {
    if (!uiScaleLayer || !gameUI || !inventoryLayer || !chatWrapper || !statsLayer) return;
    if (gameUI.style.display === 'none') return;

    const effW = window.innerWidth / currentUiScale;
    const effH = window.innerHeight / currentUiScale;

    if (effW <= 640 || effH <= 540) {
        inventoryLayer.style.left = '';
        inventoryLayer.style.transform = '';
        chatWrapper.style.bottom = '';
        return;
    }

    chatWrapper.style.bottom = '';
    inventoryLayer.style.left = '';
    inventoryLayer.style.transform = '';

    const chatRight = chatWrapper.offsetLeft + chatWrapper.offsetWidth;
    const statsLeft = statsLayer.offsetLeft;
    const invWidth = inventoryLayer.offsetWidth;
    if (!invWidth || !statsLeft) return;

    const gap = 14;
    const minLeft = chatRight + gap;
    const maxRight = statsLeft - gap;
    const centerLeft = (effW - invWidth) / 2;

    if (maxRight - minLeft >= invWidth) {
        if (centerLeft < minLeft || centerLeft + invWidth > maxRight) {
            const clampedLeft = Math.max(minLeft, Math.min(maxRight - invWidth, centerLeft));
            inventoryLayer.style.left = `${Math.round(clampedLeft)}px`;
            inventoryLayer.style.transform = 'none';
        }
    } else {
        chatWrapper.style.bottom = `${inventoryLayer.offsetHeight + 44}px`;
    }
}

function updateServerDropdown(count, max) {
    if (typeof count === 'number' && isFinite(count) && count >= 0) {
        serverPlayerCount = count;
    }
    if (typeof max === 'number' && isFinite(max) && max > 0) {
        serverMaxPlayers = max;
    }
    if (server1Option) {
        server1Option.textContent = `Server 1 (${serverPlayerCount}/${serverMaxPlayers})`;
    }
}

function setMenuError(message) {
    if (menuError) {
        menuError.textContent = message || '';
    }
}

function enterGameUI() {
    if (leaveBtn) leaveBtn.classList.add('visible');
    if (mainMenu) mainMenu.classList.add('slide-up');
    if (gameUI) {
        gameUI.style.display = 'block';
        layoutBottomHud();
        setTimeout(() => { gameUI.style.opacity = '1'; }, 50);
    }
    setTimeout(() => {
        if (mainMenu && !inMainMenu) mainMenu.style.display = 'none';
    }, 600);
}

function returnToMainMenu() {
    isJoining = false;
    pendingJoinName = null;
    myId = null;
    inMainMenu = true;
    serverPlayers = {};
    serverEnemies = {};
    swingAnims.clear();
    recoilAnims.clear();
    equipAnims.clear();
    leftPunchAnims.clear();
    enemyAggroUntil.clear();
    enemyAlertBadges.clear();
    alertCommWaves.length = 0;
    serverProjectiles.clear();
    myInventory = [null, null, null, null, null];
    activeSlot = 0;
    lastEquippedItemKey = null;
    renderInventorySlots();
    selectSlot(0, false);
    hideShopTooltip();
    explosions.length = 0;
    floatingTexts.length = 0;
    pendingFloatingTexts.length = 0;
    ME.health = 1000;
    ME.maxHealth = 1000;
    ME.energy = 255;
    ME.maxEnergy = 255;
    ME.scraps = 0;
    ME.faction = 'goodbot';
    ME.chats = [];
    lastRenderedHealth = -1;
    lastRenderedEnergy = -1;
    lastRenderedMaxHealth = -1;
    lastRenderedMaxEnergy = -1;
    lastRenderedScraps = -1;
    lastLeaderboardSig = '';
    resetJoystick();
    setMobileSprint(false);
    clearHeldInputs();
    closeChat();
    closeLeaveDialog();
    closeShop();
    applyGameStateUI({
        phase: 'waiting',
        goodbots: 0,
        rarebots: 0,
        wave: 0,
        intermissionSeconds: 15,
        startVotes: 0,
        requiredVotes: 1,
        hasVoted: false
    });
    if (leaveBtn) leaveBtn.classList.remove('visible');
    if (chatLog) chatLog.textContent = '';
    if (leaderboardList) leaderboardList.textContent = '';
    if (gameUI) {
        gameUI.style.opacity = '0';
        gameUI.style.display = 'none';
    }
    if (mainMenu) {
        mainMenu.style.display = 'flex';
        void mainMenu.offsetWidth;
        mainMenu.classList.remove('slide-up');
    }
}

async function fetchInitialServerStatus() {
    if (!isNodeHostedOrigin()) return;
    try {
        const res = await fetch('/api/server-status', { cache: 'no-store' });
        if (!res.ok) return;
        const data = await res.json();
        const s1 = Array.isArray(data.servers) ? data.servers[0] : null;
        if (s1) {
            updateServerDropdown(s1.playerCount, s1.maxPlayers);
        }
    } catch (_) {}
}

const SETTINGS = {
    showPing: true,
    showFps: true,
    uiSize: 'normal',
    musicVolume: 100,
    soundVolume: 100
};

window.GAME_AUDIO_SETTINGS = {
    musicVolume: 1,
    soundVolume: 1
};

function updateUiScale() {
    const currentDpr = window.devicePixelRatio || 1;
    lastObservedDpr = currentDpr;
    const vvScale = window.visualViewport ? window.visualViewport.scale : 1;
    const browserZoom = (currentDpr / baseDpr) * (vvScale > 0 ? vvScale : 1);
    const inverseZoom = browserZoom > 0 ? 1 / browserZoom : 1;
    const sizeMult = UI_SIZE_MULTIPLIERS[SETTINGS.uiSize] || 1;
    currentUiScale = sizeMult * inverseZoom;

    document.documentElement.style.setProperty('--ui-scale', String(currentUiScale));

    if (uiScaleLayer) {
        const effW = window.innerWidth / currentUiScale;
        const effH = window.innerHeight / currentUiScale;
        const isMobile = effW <= 640;
        const isTablet = effW > 640 && effW <= 940;
        const isTiny = effW <= 380;
        const isShort = effH <= 540;
        uiScaleLayer.classList.toggle('layout-tablet', isTablet);
        uiScaleLayer.classList.toggle('layout-mobile', isMobile);
        uiScaleLayer.classList.toggle('layout-tiny', isTiny);
        uiScaleLayer.classList.toggle('layout-short', isShort);
        layoutBottomHud();
    }
}

function loadSettings() {
    try {
        const raw = localStorage.getItem('gvr_settings');
        if (raw) {
            const parsed = JSON.parse(raw);
            if (typeof parsed.showPing === 'boolean') SETTINGS.showPing = parsed.showPing;
            if (typeof parsed.showFps === 'boolean') SETTINGS.showFps = parsed.showFps;
            if (parsed.uiSize === 'low' || parsed.uiSize === 'normal' || parsed.uiSize === 'big') {
                SETTINGS.uiSize = parsed.uiSize;
            }
            if (typeof parsed.musicVolume === 'number' && isFinite(parsed.musicVolume)) {
                SETTINGS.musicVolume = Math.max(0, Math.min(100, Math.round(parsed.musicVolume)));
            }
            if (typeof parsed.soundVolume === 'number' && isFinite(parsed.soundVolume)) {
                SETTINGS.soundVolume = Math.max(0, Math.min(100, Math.round(parsed.soundVolume)));
            }
        }
    } catch (_) {}
}

function saveSettings() {
    try {
        localStorage.setItem('gvr_settings', JSON.stringify(SETTINGS));
    } catch (_) {}
}

function applySettingsToUI() {
    if (settingShowPing) settingShowPing.checked = SETTINGS.showPing;
    if (settingShowFps) settingShowFps.checked = SETTINGS.showFps;
    for (let i = 0; i < uiSizeButtons.length; i++) {
        const btn = uiSizeButtons[i];
        btn.classList.toggle('active', btn.dataset.uiSize === SETTINGS.uiSize);
    }
    if (settingMusicVolume) settingMusicVolume.value = String(SETTINGS.musicVolume);
    if (settingSoundVolume) settingSoundVolume.value = String(SETTINGS.soundVolume);
    if (musicVolumeValue) musicVolumeValue.textContent = `${SETTINGS.musicVolume}%`;
    if (soundVolumeValue) soundVolumeValue.textContent = `${SETTINGS.soundVolume}%`;

    window.GAME_AUDIO_SETTINGS.musicVolume = SETTINGS.musicVolume / 100;
    window.GAME_AUDIO_SETTINGS.soundVolume = SETTINGS.soundVolume / 100;

    if (fpsCounter) {
        fpsCounter.classList.toggle('hidden', !SETTINGS.showFps);
    }
    if (pingCounter) {
        pingCounter.classList.toggle('hidden', !SETTINGS.showPing);
    }
    if (perfStats) {
        perfStats.classList.toggle('hidden', !SETTINGS.showFps && !SETTINGS.showPing);
    }
    updateUiScale();
}

function openSettings() {
    if (!settingsOverlay) return;
    if (isLeaveDialogOpen) closeLeaveDialog();
    if (isShopOpen) closeShop();
    isSettingsOpen = true;
    clearHeldInputs();
    if (document.activeElement === chatInput) {
        closeChat();
    }
    settingsOverlay.classList.add('open');
    settingsOverlay.setAttribute('aria-hidden', 'false');
}

function closeSettings() {
    if (!settingsOverlay) return;
    isSettingsOpen = false;
    settingsOverlay.classList.remove('open');
    settingsOverlay.setAttribute('aria-hidden', 'true');
}

function openLeaveDialog() {
    if (!leaveOverlay || inMainMenu) return;
    if (isSettingsOpen) closeSettings();
    if (isShopOpen) closeShop();
    isLeaveDialogOpen = true;
    clearHeldInputs();
    if (document.activeElement === chatInput) {
        closeChat();
    }
    leaveOverlay.classList.add('open');
    leaveOverlay.setAttribute('aria-hidden', 'false');
}

function closeLeaveDialog() {
    if (!leaveOverlay) return;
    isLeaveDialogOpen = false;
    leaveOverlay.classList.remove('open');
    leaveOverlay.setAttribute('aria-hidden', 'true');
}

const ITEM_SLOT_IMAGES = {
    'goodbot-pistol': 'assets/Goodbot Pistol Slot.png'
};

const SHOP_ITEMS = [
    {
        id: 'goodbot-pistol',
        title: 'Goodbot Pistol',
        description: 'Lightweight plasma firearm',
        cost: 15,
        slotImage: 'assets/Goodbot Pistol Slot.png',
        stats: [
            { label: 'Damage', value: 50 },
            { label: 'Firerate', value: '400ms' }
        ]
    }
];

const ITEM_BY_ID = Object.fromEntries(SHOP_ITEMS.map(item => [item.id, item]));

function getMyEquippedWeapon() {
    if (ME.faction !== 'goodbot') return 'hands';
    const itemId = myInventory[activeSlot];
    if (itemId === 'goodbot-pistol') return 'goodbot-pistol';
    return 'hands';
}

function syncEquipAnimation(forceSwitch = false) {
    if (myId === null || ME.faction !== 'goodbot') {
        lastEquippedItemKey = null;
        return;
    }
    const curItem = myInventory[activeSlot] || null;
    if (curItem && (curItem !== lastEquippedItemKey || forceSwitch)) {
        equipAnims.set(`player:${myId}`, performance.now());
    }
    lastEquippedItemKey = curItem;
}

function renderInventorySlots() {
    if (!inventorySlots || inventorySlots.length === 0) return;
    for (let i = 0; i < inventorySlots.length; i++) {
        const slotEl = inventorySlots[i];
        slotEl.textContent = '';
        const itemId = myInventory[i];
        const imgSrc = itemId ? ITEM_SLOT_IMAGES[itemId] : null;
        if (imgSrc) {
            const img = document.createElement('img');
            img.className = 'slot-item-img';
            img.src = imgSrc;
            img.alt = itemId;
            img.draggable = false;
            slotEl.appendChild(img);
        }
    }
}

function positionShopTooltipForSlot(slot, preferAbove = false) {
    if (!shopTooltip || !slot) return;
    const scale = currentUiScale > 0 ? currentUiScale : 1;
    const rect = slot.getBoundingClientRect();
    const effW = window.innerWidth / scale;
    const effH = window.innerHeight / scale;
    const tipW = shopTooltip.offsetWidth;
    const tipH = shopTooltip.offsetHeight;

    let left;
    let top;
    if (preferAbove) {
        left = rect.left / scale + (rect.width / scale - tipW) / 2;
        left = Math.max(8, Math.min(effW - tipW - 8, left));
        top = rect.top / scale - tipH - 10;
        if (top < 8) {
            top = Math.min(effH - tipH - 8, rect.bottom / scale + 10);
        }
    } else {
        left = rect.right / scale + 10;
        if (left + tipW > effW - 8) {
            left = rect.left / scale - tipW - 10;
        }
        if (left < 8) {
            left = Math.max(8, Math.min(effW - tipW - 8, rect.left / scale));
        }

        top = rect.top / scale;
        if (top + tipH > effH - 8) {
            top = Math.max(8, effH - tipH - 8);
        }
        if (top < 8) top = 8;
    }

    shopTooltip.style.left = `${Math.round(left)}px`;
    shopTooltip.style.top = `${Math.round(top)}px`;
}

function showShopTooltip(item, slot, showCost = true, preferAbove = false) {
    if (!shopTooltip) return;
    if (shopTooltipTitle) shopTooltipTitle.textContent = item.title;
    if (shopTooltipCost) {
        shopTooltipCost.style.display = showCost ? '' : 'none';
        if (showCost) {
            shopTooltipCost.textContent = `Cost: ${item.cost} Scraps`;
        }
    }
    if (shopTooltipDesc) shopTooltipDesc.textContent = item.description;
    if (shopTooltipStats) {
        shopTooltipStats.textContent = '';
        for (let i = 0; i < item.stats.length; i++) {
            const st = item.stats[i];
            const row = document.createElement('div');
            row.className = 'shop-tooltip-stat';
            row.textContent = `${st.label}: ${st.value}`;
            shopTooltipStats.appendChild(row);
        }
    }
    shopTooltip.classList.add('visible');
    shopTooltip.setAttribute('aria-hidden', 'false');
    positionShopTooltipForSlot(slot, preferAbove);
}

function hideShopTooltip() {
    if (!shopTooltip) return;
    shopTooltip.classList.remove('visible');
    shopTooltip.setAttribute('aria-hidden', 'true');
}

function renderShopItems() {
    if (!shopGrid) return;
    shopGrid.textContent = '';
    for (let i = 0; i < SHOP_ITEMS.length; i++) {
        const item = SHOP_ITEMS[i];
        const slot = document.createElement('button');
        slot.type = 'button';
        slot.className = 'shop-item-slot';

        if (item.slotImage) {
            const iconEl = document.createElement('img');
            iconEl.className = 'shop-item-icon';
            iconEl.src = item.slotImage;
            iconEl.alt = item.title;
            iconEl.draggable = false;
            slot.appendChild(iconEl);
        } else {
            const nameEl = document.createElement('span');
            nameEl.className = 'shop-item-name';
            nameEl.textContent = item.title;
            slot.appendChild(nameEl);
        }

        const costEl = document.createElement('span');
        costEl.className = 'shop-item-cost';
        costEl.textContent = String(item.cost);
        slot.appendChild(costEl);

        slot.addEventListener('pointerenter', () => {
            showShopTooltip(item, slot);
        });
        slot.addEventListener('pointerleave', () => {
            hideShopTooltip();
        });
        slot.addEventListener('focus', () => {
            showShopTooltip(item, slot);
        });
        slot.addEventListener('blur', () => {
            hideShopTooltip();
        });
        slot.addEventListener('click', () => {
            showShopTooltip(item, slot);
            if (ws && ws.readyState === WebSocket.OPEN && myId !== null) {
                ws.send(JSON.stringify({ type: 'buy_item', itemId: item.id }));
            }
        });

        shopGrid.appendChild(slot);
    }
}

function openShop() {
    if (!shopOverlay || inMainMenu) return;
    if (isSettingsOpen) closeSettings();
    if (isLeaveDialogOpen) closeLeaveDialog();
    isShopOpen = true;
    clearHeldInputs();
    if (document.activeElement === chatInput) {
        closeChat();
    }
    hideShopTooltip();
    shopOverlay.classList.add('open');
    shopOverlay.setAttribute('aria-hidden', 'false');
}

function closeShop() {
    if (!shopOverlay) return;
    isShopOpen = false;
    hideShopTooltip();
    shopOverlay.classList.remove('open');
    shopOverlay.setAttribute('aria-hidden', 'true');
}

function enableTouchMode() {
    if (serverDeviceIsMobile !== null) {
        document.body.classList.toggle('touch-mode', serverDeviceIsMobile);
        return;
    }
    if (!document.body.classList.contains('touch-mode')) {
        document.body.classList.add('touch-mode');
    }
}

function detectTouchCapability() {
    if (serverDeviceIsMobile !== null) {
        document.body.classList.toggle('touch-mode', serverDeviceIsMobile);
        return;
    }
    const hasTouch = ('ontouchstart' in window) || (navigator.maxTouchPoints > 0) || (window.matchMedia && window.matchMedia('(pointer: coarse)').matches);
    if (hasTouch) {
        enableTouchMode();
    }
}

function setMobileSprint(active) {
    const val = Boolean(active);
    if (WORLD.INPUTS.keys.shift !== val) {
        WORLD.INPUTS.keys.shift = val;
        sendInput(true);
    }
    if (mobileSprintBtn) {
        mobileSprintBtn.classList.toggle('pressed', val);
    }
}

function resetJoystick() {
    joystickTouchId = null;
    if (mobileJoystickThumb) {
        mobileJoystickThumb.style.transform = 'translate(0px, 0px)';
    }
    let changed = false;
    if (WORLD.INPUTS.keys.w) { WORLD.INPUTS.keys.w = false; changed = true; }
    if (WORLD.INPUTS.keys.s) { WORLD.INPUTS.keys.s = false; changed = true; }
    if (WORLD.INPUTS.keys.a) { WORLD.INPUTS.keys.a = false; changed = true; }
    if (WORLD.INPUTS.keys.d) { WORLD.INPUTS.keys.d = false; changed = true; }
    if (changed) sendInput(true);
}

function updateJoystickFromPoint(clientX, clientY) {
    if (!mobileJoystick) return;
    const rect = mobileJoystick.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const maxRadius = rect.width * 0.42;
    let dx = clientX - cx;
    let dy = clientY - cy;
    const dist = Math.sqrt(dx * dx + dy * dy);
    if (dist > maxRadius && dist > 0) {
        dx = (dx / dist) * maxRadius;
        dy = (dy / dist) * maxRadius;
    }

    if (mobileJoystickThumb) {
        const scaleDiv = currentUiScale > 0 ? currentUiScale : 1;
        mobileJoystickThumb.style.transform = `translate(${dx / scaleDiv}px, ${dy / scaleDiv}px)`;
    }

    const nx = maxRadius > 0 ? dx / maxRadius : 0;
    const ny = maxRadius > 0 ? dy / maxRadius : 0;
    const mag = Math.sqrt(nx * nx + ny * ny);
    const deadzone = 0.2;

    const nextUp = mag > deadzone && ny < -0.35;
    const nextDown = mag > deadzone && ny > 0.35;
    const nextLeft = mag > deadzone && nx < -0.35;
    const nextRight = mag > deadzone && nx > 0.35;

    let changed = false;
    if (WORLD.INPUTS.keys.w !== nextUp) { WORLD.INPUTS.keys.w = nextUp; changed = true; }
    if (WORLD.INPUTS.keys.s !== nextDown) { WORLD.INPUTS.keys.s = nextDown; changed = true; }
    if (WORLD.INPUTS.keys.a !== nextLeft) { WORLD.INPUTS.keys.a = nextLeft; changed = true; }
    if (WORLD.INPUTS.keys.d !== nextRight) { WORLD.INPUTS.keys.d = nextRight; changed = true; }

    if (mag > deadzone && aimTouchId === null) {
        const psX = (ME.x - (WORLD.CAMERA.x || 0) + ME.width / 2) * WORLD.SYSTEM.viewScale;
        const psY = (ME.y - (WORLD.CAMERA.y || 0) + ME.height / 2) * WORLD.SYSTEM.viewScale;
        WORLD.INPUTS.mouseX = psX + nx * 120;
        WORLD.INPUTS.mouseY = psY + ny * 120;
    }

    if (changed) sendInput(true);
}

function setChatMinimized(minimized) {
    isChatMinimized = Boolean(minimized);
    if (chatWrapper) {
        chatWrapper.classList.toggle('minimized', isChatMinimized);
    }
    if (chatToggleBtn) {
        chatToggleBtn.setAttribute('aria-expanded', isChatMinimized ? 'false' : 'true');
        chatToggleBtn.setAttribute('aria-label', isChatMinimized ? 'Maximize chat' : 'Minimize chat');
    }
    if (isChatMinimized && document.activeElement === chatInput) {
        chatInput.blur();
    }
}

function updatePingDisplay(ms) {
    if (typeof ms !== 'number' || !isFinite(ms) || ms < 0) return;
    currentPingMs = Math.round(ms);
    if (pingCounter) {
        pingCounter.textContent = `${currentPingMs} ms`;
    }
}

function wsUrlToHttpProbe(wsUrl) {
    if (!wsUrl) return null;
    if (wsUrl.startsWith('wss://')) return 'https://' + wsUrl.slice(6);
    if (wsUrl.startsWith('ws://')) return 'http://' + wsUrl.slice(5);
    return wsUrl;
}

async function measurePingOnce() {
    if (!ws || ws.readyState !== WebSocket.OPEN) return;
    ws.send(JSON.stringify({ type: 'ping', t: performance.now() }));
}

function startPingMonitor(wsUrl) {
    pingProbeUrl = wsUrlToHttpProbe(wsUrl);
    if (pingTimerId !== null) return;
    pingTimerId = setInterval(measurePingOnce, 2500);
}

let fpsFrames = 0;
let fpsLastSample = performance.now();
function sampleFps(now) {
    if ((window.devicePixelRatio || 1) !== lastObservedDpr) {
        updateUiScale();
    }
    fpsFrames++;
    const elapsed = now - fpsLastSample;
    if (elapsed >= 500) {
        const fps = Math.round((fpsFrames * 1000) / elapsed);
        fpsFrames = 0;
        fpsLastSample = now;
        if (fpsCounter && SETTINGS.showFps) {
            fpsCounter.textContent = `${fps} FPS`;
        }
    }
}
function startFpsCounter() {
    fpsFrames = 0;
    fpsLastSample = performance.now();
}

const tilesheetImg = new Image();
const goodbotImg = new Image();
const rarebotImg = new Image();
const prototypeRarebotImg = new Image();
const botHandsImg = new Image();
const prototypeRarebotHandsImg = new Image();
const goodbotPistolImg = new Image();
const rarebotPistolImg = new Image();
const goodbotBulletImg = new Image();
const rarebotBulletImg = new Image();

let audioCtx = null;
let soundBuffersLoaded = false;
let soundBuffersLoading = false;
let lastBulletImpactIdx = -1;
const soundBufferPromises = {};
const SOUND_FILES = {
    swing: 'sounds/swing.mp3',
    hit: 'sounds/hit.mp3',
    explosion: 'sounds/explosion.mp3',
    hitReceive: 'sounds/hit receive.mp3',
    hitDeal: 'sounds/hit deal.mp3',
    laserShot: 'sounds/laser shot.mp3',
    bulletImpact1: 'sounds/bullet impact 1.mp3',
    bulletImpact2: 'sounds/bullet impact 2.mp3',
    bulletImpact3: 'sounds/bullet impact 3.mp3',
    bulletWallImpact: 'sounds/bullet wall impact.mp3',
    grapple1: 'sounds/grapple 1.mp3'
};
const soundBuffers = {
    swing: null,
    hit: null,
    explosion: null,
    hitReceive: null,
    hitDeal: null,
    laserShot: null,
    bulletImpact1: null,
    bulletImpact2: null,
    bulletImpact3: null,
    bulletWallImpact: null,
    grapple1: null
};

function loadSoundBuffer(key, ctxAudio) {
    if (!ctxAudio || !SOUND_FILES[key] || soundBuffers[key]) return Promise.resolve();
    if (soundBufferPromises[key]) return soundBufferPromises[key];
    soundBufferPromises[key] = fetch(encodeURI(SOUND_FILES[key]))
        .then(res => (res.ok ? res.arrayBuffer() : null))
        .then(arr => (arr ? ctxAudio.decodeAudioData(arr) : null))
        .then(decoded => {
            if (decoded) soundBuffers[key] = decoded;
        })
        .catch(() => {})
        .finally(() => {
            delete soundBufferPromises[key];
        });
    return soundBufferPromises[key];
}

function ensureAudioContext() {
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    if (!AudioCtx) return null;
    if (!audioCtx) {
        audioCtx = new AudioCtx();
    }
    if (audioCtx.state === 'suspended') {
        audioCtx.resume().catch(() => {});
    }
    if (!soundBuffersLoaded && !soundBuffersLoading) {
        soundBuffersLoading = true;
        Promise.all(
            Object.keys(SOUND_FILES).map(key => loadSoundBuffer(key, audioCtx))
        ).finally(() => {
            soundBuffersLoaded = true;
            soundBuffersLoading = false;
        });
    }
    return audioCtx;
}

const lastSoundAt = {
    swing: 0,
    hit: 0,
    explosion: 0,
    hitReceive: 0,
    hitDeal: 0,
    laserShot: 0,
    bulletImpact1: 0,
    bulletImpact2: 0,
    bulletImpact3: 0,
    bulletWallImpact: 0,
    grapple1: 0
};

function playSpatialSound(key, wx, wy) {
    const masterVol = window.GAME_AUDIO_SETTINGS ? Number(window.GAME_AUDIO_SETTINGS.soundVolume) : 1;
    if (!isFinite(masterVol) || masterVol <= 0.005) return;
    const nowMs = performance.now();
    const minGap = key === 'explosion' ? 60 : ((key === 'swing' || key === 'hit') ? 45 : 15);
    if (nowMs - (lastSoundAt[key] || 0) < minGap) return;

    const ctxAudio = ensureAudioContext();
    if (!ctxAudio) return;
    if (!soundBuffers[key]) {
        loadSoundBuffer(key, ctxAudio);
        return;
    }

    const lx = myId !== null ? (ME.x + ME.width / 2) : ((WORLD.CAMERA.x || 0) + WORLD.CAMERA.width / 2);
    const ly = myId !== null ? (ME.y + ME.height / 2) : ((WORLD.CAMERA.y || 0) + WORLD.CAMERA.height / 2);
    let dist = 0;
    if (typeof wx === 'number' && typeof wy === 'number') {
        const dx = wx - lx;
        const dy = wy - ly;
        const dSq = dx * dx + dy * dy;
        if (dSq > 1080 * 1080) return;
        dist = Math.sqrt(dSq);
    }
    const falloff = Math.max(0, Math.min(1, 1 - Math.max(0, dist - 80) / 1000));
    const volumeMult = (key === 'hitReceive' || key === 'hitDeal') ? 0.1 : (key === 'grapple1' ? 1.35 : 1);
    const gainValue = falloff * falloff * masterVol * volumeMult;
    if (gainValue <= 0.005) return;

    lastSoundAt[key] = nowMs;
    try {
        const source = ctxAudio.createBufferSource();
        source.buffer = soundBuffers[key];
        const gainNode = ctxAudio.createGain();
        gainNode.gain.value = gainValue;
        source.connect(gainNode);
        gainNode.connect(ctxAudio.destination);
        source.start(0);
    } catch (_) {}
}

function playRandomBulletImpact(wx, wy) {
    const candidates = [];
    for (let i = 0; i < 3; i++) {
        if (i !== lastBulletImpactIdx) candidates.push(i);
    }
    const picked = candidates[Math.floor(Math.random() * candidates.length)];
    lastBulletImpactIdx = picked;
    playSpatialSound(`bulletImpact${picked + 1}`, wx, wy);
}

function applyMapPayload(rawMap) {
    if (!rawMap) return;
    if (rawMap.config && rawMap.mapData) {
        WORLD.MAP.tileSize = rawMap.config.tileSize || 64;
        WORLD.MAP.columns = rawMap.config.mapW || 0;
        WORLD.MAP.rows = rawMap.config.mapH || 0;
        WORLD.MAP.mapData = {
            floor1: rawMap.mapData.floor1 || [],
            floor2: rawMap.mapData.floor2 || [],
            wall: rawMap.mapData.wall || rawMap.mapData.walls || [],
            tree: rawMap.mapData.tree || rawMap.mapData.trees || []
        };
    }
}

function drawTileCell(targetCtx, cell, dx, dy, tileSize) {
    if (!cell || !tilesheetImg.complete || tilesheetImg.naturalWidth === 0) return;
    const sInset = 0.5;
    const sSize = tileSize - (sInset * 2);
    const sx = cell.tx * tileSize + sInset;
    const sy = cell.ty * tileSize + sInset;
    const rot = (cell.r || 0) * Math.PI / 180;

    if (rot !== 0) {
        targetCtx.save();
        targetCtx.translate(dx + tileSize / 2, dy + tileSize / 2);
        targetCtx.rotate(rot);
        targetCtx.drawImage(tilesheetImg, sx, sy, sSize, sSize, -tileSize / 2, -tileSize / 2, tileSize, tileSize);
        targetCtx.restore();
    } else {
        targetCtx.drawImage(tilesheetImg, sx, sy, sSize, sSize, dx, dy, tileSize, tileSize);
    }
}

function preRenderMap() {
    if (!WORLD.MAP.columns || !WORLD.MAP.rows || !WORLD.MAP.mapData) return;

    const numCX = Math.ceil((WORLD.MAP.columns * WORLD.MAP.tileSize) / WORLD.MAP.chunkSize);
    const numCY = Math.ceil((WORLD.MAP.rows * WORLD.MAP.tileSize) / WORLD.MAP.chunkSize);

    WORLD.MAP.bgChunks = [];
    WORLD.MAP.wallChunks = [];
    WORLD.MAP.fgChunks = [];
    WORLD.MAP.wallChunkEmpty = [];
    WORLD.MAP.fgChunkEmpty = [];
    WORLD.MAP.wallChunkBounds = [];
    WORLD.MAP.fgChunkBounds = [];

    for (let cy = 0; cy < numCY; cy++) {
        WORLD.MAP.bgChunks[cy] = [];
        WORLD.MAP.wallChunks[cy] = [];
        WORLD.MAP.fgChunks[cy] = [];
        WORLD.MAP.wallChunkEmpty[cy] = [];
        WORLD.MAP.fgChunkEmpty[cy] = [];
        WORLD.MAP.wallChunkBounds[cy] = [];
        WORLD.MAP.fgChunkBounds[cy] = [];
        for (let cx = 0; cx < numCX; cx++) {
            const bg = document.createElement('canvas');
            bg.width = bg.height = WORLD.MAP.chunkSize;
            const wc = document.createElement('canvas');
            wc.width = wc.height = WORLD.MAP.chunkSize;
            const fg = document.createElement('canvas');
            fg.width = fg.height = WORLD.MAP.chunkSize;
            WORLD.MAP.bgChunks[cy][cx] = bg;
            WORLD.MAP.wallChunks[cy][cx] = wc;
            WORLD.MAP.fgChunks[cy][cx] = fg;
            renderChunk(cx, cy);
        }
    }
}

function renderChunk(cx, cy) {
    const bgCtx = WORLD.MAP.bgChunks[cy][cx].getContext('2d', { alpha: false });
    const wcCtx = WORLD.MAP.wallChunks[cy][cx].getContext('2d', { alpha: true });
    const fgCtx = WORLD.MAP.fgChunks[cy][cx].getContext('2d', { alpha: true });

    bgCtx.imageSmoothingEnabled = false;
    wcCtx.imageSmoothingEnabled = false;
    fgCtx.imageSmoothingEnabled = false;

    bgCtx.fillStyle = '#000000';
    bgCtx.fillRect(0, 0, WORLD.MAP.chunkSize, WORLD.MAP.chunkSize);
    wcCtx.clearRect(0, 0, WORLD.MAP.chunkSize, WORLD.MAP.chunkSize);
    fgCtx.clearRect(0, 0, WORLD.MAP.chunkSize, WORLD.MAP.chunkSize);

    WORLD.MAP.wallChunkEmpty[cy][cx] = true;
    WORLD.MAP.fgChunkEmpty[cy][cx] = true;
    WORLD.MAP.wallChunkBounds[cy][cx] = null;
    WORLD.MAP.fgChunkBounds[cy][cx] = null;

    if (!tilesheetImg.complete || tilesheetImg.naturalWidth === 0) return;

    const cs = WORLD.MAP.chunkSize;
    const tileSize = WORLD.MAP.tileSize;
    const startCol = Math.max(0, Math.floor((cx * cs) / tileSize));
    const endCol = Math.min(WORLD.MAP.columns, Math.ceil(((cx + 1) * cs) / tileSize));
    const startRow = Math.max(0, Math.floor((cy * cs) / tileSize));
    const endRow = Math.min(WORLD.MAP.rows, Math.ceil(((cy + 1) * cs) / tileSize));

    let wMinX = cs, wMinY = cs, wMaxX = 0, wMaxY = 0;
    let fMinX = cs, fMinY = cs, fMaxX = 0, fMaxY = 0;

    const layerOrder = ['floor1', 'floor2', 'wall', 'tree'];
    for (const layerName of layerOrder) {
        const grid = WORLD.MAP.mapData[layerName];
        if (!grid) continue;
        const targetCtx = layerName === 'tree' ? fgCtx : (layerName === 'wall' ? wcCtx : bgCtx);

        for (let r = startRow; r < endRow; r++) {
            const rowArr = grid[r];
            if (!rowArr) continue;
            for (let c = startCol; c < endCol; c++) {
                const cell = rowArr[c];
                if (cell) {
                    const dx = (c * tileSize) - (cx * cs);
                    const dy = (r * tileSize) - (cy * cs);
                    if (layerName === 'wall') {
                        WORLD.MAP.wallChunkEmpty[cy][cx] = false;
                        if (dx < wMinX) wMinX = dx;
                        if (dy < wMinY) wMinY = dy;
                        if (dx + tileSize > wMaxX) wMaxX = dx + tileSize;
                        if (dy + tileSize > wMaxY) wMaxY = dy + tileSize;
                    } else if (layerName === 'tree') {
                        WORLD.MAP.fgChunkEmpty[cy][cx] = false;
                        if (dx < fMinX) fMinX = dx;
                        if (dy < fMinY) fMinY = dy;
                        if (dx + tileSize > fMaxX) fMaxX = dx + tileSize;
                        if (dy + tileSize > fMaxY) fMaxY = dy + tileSize;
                    }
                    drawTileCell(targetCtx, cell, dx, dy, tileSize);
                }
            }
        }
    }

    if (!WORLD.MAP.wallChunkEmpty[cy][cx]) {
        WORLD.MAP.wallChunkBounds[cy][cx] = {
            minX: Math.max(0, wMinX),
            minY: Math.max(0, wMinY),
            maxX: Math.min(cs, wMaxX),
            maxY: Math.min(cs, wMaxY)
        };
    }
    if (!WORLD.MAP.fgChunkEmpty[cy][cx]) {
        WORLD.MAP.fgChunkBounds[cy][cx] = {
            minX: Math.max(0, fMinX),
            minY: Math.max(0, fMinY),
            maxX: Math.min(cs, fMaxX),
            maxY: Math.min(cs, fMaxY)
        };
    }
}

function loadAssets() {
    tilesheetImg.onload = () => {
        preRenderMap();
    };
    tilesheetImg.src = 'assets/tilesheet.png';
    if (tilesheetImg.complete && tilesheetImg.naturalWidth > 0) {
        preRenderMap();
    }
    goodbotImg.src = 'assets/Goodbot.png';
    rarebotImg.src = 'assets/Rarebot.png';
    prototypeRarebotImg.src = 'assets/Prototype Rarebot.png';
    botHandsImg.src = 'assets/Bot Hands.png';
    prototypeRarebotHandsImg.src = 'assets/Prototype Rarebot Hands.png';
    goodbotPistolImg.src = 'assets/Goodbot Pistol.png';
    rarebotPistolImg.src = 'assets/Rarebot Pistol.png';
    goodbotBulletImg.src = 'assets/Goodbot Bullet.png';
    rarebotBulletImg.src = 'assets/Rarebot Bullet.png';
}

function updateStatsUI() {
    const maxH = Math.max(1, Number(ME.maxHealth) || 1000);
    const maxE = Math.max(1, Number(ME.maxEnergy) || 255);
    const roundedHealth = Math.max(0, Math.min(maxH, Math.round(ME.health)));
    const roundedEnergy = Math.max(0, Math.min(maxE, Math.ceil(ME.energy)));
    const currentScraps = Math.max(0, Math.floor(Number(ME.scraps) || 0));

    if (roundedHealth !== lastRenderedHealth || maxH !== lastRenderedMaxHealth) {
        if (healthFill) healthFill.style.width = `${(roundedHealth / maxH) * 100}%`;
        if (healthValue) healthValue.textContent = String(roundedHealth);
        lastRenderedHealth = roundedHealth;
        lastRenderedMaxHealth = maxH;
    }

    if (roundedEnergy !== lastRenderedEnergy || maxE !== lastRenderedMaxEnergy) {
        if (energyFill) energyFill.style.width = `${(roundedEnergy / maxE) * 100}%`;
        if (energyValue) energyValue.textContent = String(roundedEnergy);
        lastRenderedEnergy = roundedEnergy;
        lastRenderedMaxEnergy = maxE;
    }

    if (currentScraps !== lastRenderedScraps) {
        if (scrapsValue) scrapsValue.textContent = String(currentScraps);
        lastRenderedScraps = currentScraps;
    }
}

function applyGameStateUI(state) {
    if (!state || typeof state !== 'object') return;
    if (goodbotsCount && typeof state.goodbots === 'number') {
        goodbotsCount.textContent = String(Math.max(0, Math.floor(state.goodbots)));
    }
    if (rarebotsCount && typeof state.rarebots === 'number') {
        rarebotsCount.textContent = String(Math.max(0, Math.floor(state.rarebots)));
    }
    if (waveCount && typeof state.wave === 'number') {
        waveCount.textContent = String(Math.max(0, Math.floor(state.wave)));
    }

    const phase = state.phase || 'waiting';
    if (phase === 'waiting') {
        if (gameStateTitle) gameStateTitle.textContent = 'Waiting to start...';
        if (gameStateDivider) gameStateDivider.classList.add('hidden');
        if (gameStateDesc) gameStateDesc.classList.add('hidden');
        if (gameStartBtn) {
            gameStartBtn.classList.remove('hidden');
            const votes = Number(state.startVotes) || 0;
            const req = Number(state.requiredVotes) || 1;
            const voted = state.hasVoted === true;
            gameStartBtn.classList.toggle('voted', voted);
            if (req <= 1 && (Number(state.goodbots) || 0) <= 1) {
                gameStartBtn.textContent = 'Start';
            } else {
                gameStartBtn.textContent = voted ? `Ready (${votes}/${req})` : `Start (${votes}/${req})`;
            }
        }
        return;
    }

    if (phase === 'intermission') {
        const secs = Math.max(0, Math.floor(Number(state.intermissionSeconds) || 0));
        if (gameStateTitle) gameStateTitle.textContent = `Intermission: ${secs}`;
        if (gameStateDivider) gameStateDivider.classList.add('hidden');
        if (gameStateDesc) gameStateDesc.classList.add('hidden');
        if (gameStartBtn) gameStartBtn.classList.add('hidden');
        return;
    }

    const waveNum = Math.max(1, Math.floor(Number(state.wave) || 1));
    if (gameStateTitle) gameStateTitle.textContent = `Wave: ${waveNum}`;
    if (gameStateDivider) gameStateDivider.classList.remove('hidden');
    if (gameStateDesc) {
        gameStateDesc.textContent = 'Eliminate all the enemies';
        gameStateDesc.classList.remove('hidden');
    }
    if (gameStartBtn) gameStartBtn.classList.add('hidden');
}

function updateLeaderboard(entries) {
    if (!leaderboardList) return;
    const sig = entries.map(e => `${e.name}\t${e.scraps}\t${e.faction || 'goodbot'}`).join('\n');
    if (sig === lastLeaderboardSig) return;
    lastLeaderboardSig = sig;
    leaderboardList.textContent = '';

    const spacerEl = document.createElement('span');
    const colLabelEl = document.createElement('span');
    colLabelEl.className = 'leaderboard-col-label';
    colLabelEl.textContent = 'scraps';
    leaderboardList.appendChild(spacerEl);
    leaderboardList.appendChild(colLabelEl);

    for (let i = 0; i < entries.length; i++) {
        const entry = entries[i];
        const nameEl = document.createElement('span');
        let factionClass = '';
        if (entry.faction === 'rarebot') factionClass = ' leaderboard-name-rarebot';
        else if (entry.faction === 'spectator') factionClass = ' leaderboard-name-spectator';
        nameEl.className = 'leaderboard-name' + factionClass;
        nameEl.textContent = entry.name;
        const scoreEl = document.createElement('span');
        scoreEl.className = 'leaderboard-score';
        scoreEl.textContent = String(entry.scraps);
        leaderboardList.appendChild(nameEl);
        leaderboardList.appendChild(scoreEl);
    }
}

function appendChatLog(name, text, faction = 'goodbot') {
    if (!chatLog) return;
    const entry = document.createElement('div');
    entry.className = 'chat-log-entry';
    const nameEl = document.createElement('span');
    let factionClass = '';
    if (faction === 'rarebot') factionClass = ' chat-log-name-rarebot';
    else if (faction === 'spectator') factionClass = ' chat-log-name-spectator';
    nameEl.className = 'chat-log-name' + factionClass;
    nameEl.textContent = name;
    entry.appendChild(nameEl);
    entry.appendChild(document.createTextNode(`: ${text}`));
    chatLog.appendChild(entry);
    while (chatLog.children.length > 50) {
        chatLog.removeChild(chatLog.firstChild);
    }
    chatLog.scrollTop = chatLog.scrollHeight;
}

function selectSlot(idx, notifyServer = true) {
    if (!inventorySlots || inventorySlots.length === 0) return;
    if (idx < 0 || idx >= inventorySlots.length) return;
    const prevSlot = activeSlot;
    activeSlot = idx;
    for (let i = 0; i < inventorySlots.length; i++) {
        if (i === activeSlot) inventorySlots[i].classList.add('active');
        else inventorySlots[i].classList.remove('active');
    }
    if (notifyServer) {
        syncEquipAnimation(prevSlot !== idx);
        if (ws && ws.readyState === WebSocket.OPEN && myId !== null) {
            ws.send(JSON.stringify({ type: 'select_slot', slot: idx }));
        }
    }
}

function updateMenuCamera(dt) {
    if (!WORLD.MAP.columns || !WORLD.CAMERA.width) return;
    const maxCamX = Math.max(0, WORLD.MAP.columns * WORLD.MAP.tileSize - WORLD.CAMERA.width);
    const maxCamY = Math.max(0, WORLD.MAP.rows * WORLD.MAP.tileSize - WORLD.CAMERA.height);

    if (menuCamX === null) {
        menuCamX = maxCamX / 2;
        menuCamY = maxCamY / 2;
    }

    menuCamX += menuCamVX * dt;
    menuCamY += menuCamVY * dt;

    if (menuCamX <= 0) { menuCamX = 0; menuCamVX = Math.abs(menuCamVX); }
    else if (menuCamX >= maxCamX) { menuCamX = maxCamX; menuCamVX = -Math.abs(menuCamVX); }

    if (menuCamY <= 0) { menuCamY = 0; menuCamVY = Math.abs(menuCamVY); }
    else if (menuCamY >= maxCamY) { menuCamY = maxCamY; menuCamVY = -Math.abs(menuCamVY); }

    WORLD.CAMERA.x = menuCamX;
    WORLD.CAMERA.y = menuCamY;
}

function getInputState() {
    return {
        up: WORLD.INPUTS.keys.w || WORLD.INPUTS.keys.arrowup,
        down: WORLD.INPUTS.keys.s || WORLD.INPUTS.keys.arrowdown,
        left: WORLD.INPUTS.keys.a || WORLD.INPUTS.keys.arrowleft,
        right: WORLD.INPUTS.keys.d || WORLD.INPUTS.keys.arrowright,
        sprint: WORLD.INPUTS.keys.shift
    };
}

function sendInput(force = false) {
    if (!myId || !ws || ws.readyState !== WebSocket.OPEN) return;
    const input = getInputState();
    const keySig = `${input.up ? 1 : 0}${input.down ? 1 : 0}${input.left ? 1 : 0}${input.right ? 1 : 0}${input.sprint ? 1 : 0}`;
    const keysChanged = keySig !== lastInputKeySig;

    let angleDiff = Math.abs(ME.angle - lastSentAngle);
    if (angleDiff > Math.PI) angleDiff = Math.abs(angleDiff - Math.PI * 2);

    const now = performance.now();
    if (!force && !keysChanged) {
        if (angleDiff <= 0.02 || now - lastInputSendTime < 33) return;
    }

    lastInputKeySig = keySig;
    lastSentAngle = ME.angle;
    lastInputSendTime = now;

    ws.send(JSON.stringify({
        type: 'input',
        up: input.up,
        down: input.down,
        left: input.left,
        right: input.right,
        sprint: input.sprint,
        angle: ME.angle
    }));
}

function update(dt) {
    const maxX = Math.max(0, WORLD.MAP.columns * WORLD.MAP.tileSize - ME.width);
    const maxY = Math.max(0, WORLD.MAP.rows * WORLD.MAP.tileSize - ME.height);

    ME.serverX = Math.max(0, Math.min(maxX, ME.serverX + ME.vx * dt));
    ME.serverY = Math.max(0, Math.min(maxY, ME.serverY + ME.vy * dt));

    const rdxMe = ME.serverX - ME.x;
    const rdyMe = ME.serverY - ME.y;
    if (rdxMe * rdxMe + rdyMe * rdyMe > 180 * 180) {
        ME.x = ME.serverX;
        ME.y = ME.serverY;
    } else {
        const meLerp = 1 - Math.exp(-dt * 24);
        ME.x += rdxMe * meLerp;
        ME.y += rdyMe * meLerp;
    }

    const smX = WORLD.INPUTS.mouseX / WORLD.SYSTEM.viewScale;
    const smY = WORLD.INPUTS.mouseY / WORLD.SYSTEM.viewScale;
    const psX = ME.x - (WORLD.CAMERA.x || 0) + ME.width / 2;
    const psY = ME.y - (WORLD.CAMERA.y || 0) + ME.height / 2;
    const mouseAngle = Math.atan2(smY - psY, smX - psX);
    ME.angle = mouseAngle + (Math.PI / 2);

    const targetCamX = ME.x + ME.width / 2 - WORLD.CAMERA.width / 2;
    const targetCamY = ME.y + ME.height / 2 - WORLD.CAMERA.height / 2;
    if (WORLD.CAMERA.x === null || isNaN(WORLD.CAMERA.x) || !isFinite(WORLD.CAMERA.x)) {
        WORLD.CAMERA.x = targetCamX;
        WORLD.CAMERA.y = targetCamY;
    } else {
        const lf = 1 - Math.exp(-Math.max(0, dt) * 40);
        WORLD.CAMERA.x += (targetCamX - WORLD.CAMERA.x) * lf;
        WORLD.CAMERA.y += (targetCamY - WORLD.CAMERA.y) * lf;
    }

    for (const id in serverPlayers) {
        const p = serverPlayers[id];
        if (p.renderX === undefined) {
            p.renderX = p.x;
            p.renderY = p.y;
            p.renderAngle = p.angle || 0;
        }

        p.x = Math.max(0, Math.min(maxX, p.x + (p.vx || 0) * dt));
        p.y = Math.max(0, Math.min(maxY, p.y + (p.vy || 0) * dt));

        const lerpF = 1 - Math.exp(-dt * 20);
        const rdx = p.x - p.renderX;
        const rdy = p.y - p.renderY;
        const rdist = Math.sqrt(rdx * rdx + rdy * rdy);
        const maxStep = 200;
        if (rdist > maxStep) {
            p.renderX = p.x - (rdx / rdist) * maxStep;
            p.renderY = p.y - (rdy / rdist) * maxStep;
        }
        p.renderX += (p.x - p.renderX) * lerpF;
        p.renderY += (p.y - p.renderY) * lerpF;

        let diff = (p.angle || 0) - p.renderAngle;
        while (diff < -Math.PI) diff += Math.PI * 2;
        while (diff > Math.PI) diff -= Math.PI * 2;
        p.renderAngle += diff * (1 - Math.exp(-dt * 20));
    }

    for (const id in serverEnemies) {
        const e = serverEnemies[id];
        if (e.renderX === undefined) {
            e.renderX = e.x;
            e.renderY = e.y;
            e.renderAngle = e.angle || 0;
        }

        e.x = Math.max(0, Math.min(maxX, e.x + (e.vx || 0) * dt));
        e.y = Math.max(0, Math.min(maxY, e.y + (e.vy || 0) * dt));

        const lerpF = 1 - Math.exp(-dt * 20);
        const rdx = e.x - e.renderX;
        const rdy = e.y - e.renderY;
        const rdist = Math.sqrt(rdx * rdx + rdy * rdy);
        const maxStep = 200;
        if (rdist > maxStep) {
            e.renderX = e.x - (rdx / rdist) * maxStep;
            e.renderY = e.y - (rdy / rdist) * maxStep;
        }
        e.renderX += (e.x - e.renderX) * lerpF;
        e.renderY += (e.y - e.renderY) * lerpF;

        let diff = (e.angle || 0) - e.renderAngle;
        while (diff < -Math.PI) diff += Math.PI * 2;
        while (diff > Math.PI) diff -= Math.PI * 2;
        e.renderAngle += diff * (1 - Math.exp(-dt * 20));
    }

    for (const [id, proj] of serverProjectiles) {
        proj.x += proj.vx * dt;
        proj.y += proj.vy * dt;
        proj.age += dt;
        if (proj.age >= 2.0) {
            serverProjectiles.delete(id);
        }
    }

    for (let i = explosions.length - 1; i >= 0; i--) {
        const pt = explosions[i];
        pt.age += dt;
        if (pt.age >= pt.life) {
            explosions[i] = explosions[explosions.length - 1];
            explosions.pop();
            continue;
        }
        const drag = Math.pow(0.06, dt);
        pt.x += pt.vx * dt;
        pt.y += pt.vy * dt;
        pt.vx *= drag;
        pt.vy *= drag;
    }

    for (let i = floatingTexts.length - 1; i >= 0; i--) {
        const ft = floatingTexts[i];
        ft.age += dt;
        if (ft.age >= ft.life) {
            floatingTexts[i] = floatingTexts[floatingTexts.length - 1];
            floatingTexts.pop();
        }
    }

    for (let i = alertCommWaves.length - 1; i >= 0; i--) {
        const w = alertCommWaves[i];
        w.age += dt;
        if (w.age >= w.life) {
            alertCommWaves[i] = alertCommWaves[alertCommWaves.length - 1];
            alertCommWaves.pop();
        }
    }

    if (pendingFloatingTexts.length > 0) {
        const waitingPlayers = new Set();
        for (let i = 0; i < pendingFloatingTexts.length; i++) {
            const pft = pendingFloatingTexts[i];
            if (waitingPlayers.has(pft.playerId) || hasFloatingTextBlocking(pft.playerId)) {
                waitingPlayers.add(pft.playerId);
                continue;
            }
            floatingTexts.push({
                playerId: pft.playerId,
                x: pft.x,
                y: pft.y,
                text: pft.text,
                color: pft.color,
                age: 0,
                life: pft.life
            });
            pendingFloatingTexts.splice(i, 1);
            i--;
        }
    }

    if (isAttackHeld && !inMainMenu && myId !== null && !isSettingsOpen && !isLeaveDialogOpen && !isShopOpen && document.activeElement !== chatInput) {
        triggerAttack();
    }

    sendInput(false);
}

function spawnExplosionParticles(wx, wy) {
    const count = 22;
    for (let i = 0; i < count; i++) {
        if (explosions.length >= MAX_EXPLOSION_PARTICLES) {
            explosions.shift();
        }
        const angle = (Math.PI * 2 * i) / count + (Math.random() - 0.5) * 0.45;
        const speed = 70 + Math.random() * 230;
        explosions.push({
            x: wx + (Math.random() - 0.5) * 8,
            y: wy + (Math.random() - 0.5) * 8,
            vx: Math.cos(angle) * speed,
            vy: Math.sin(angle) * speed,
            radius: 4 + Math.random() * 8,
            life: 0.35 + Math.random() * 0.35,
            age: 0,
            color: EXPLOSION_COLORS[Math.floor(Math.random() * EXPLOSION_COLORS.length)]
        });
    }
}

function spawnBulletWallParticles(wx, wy, variant) {
    const palette = variant === 'rarebot' ? RAREBOT_BULLET_EXPLOSION_COLORS : GOODBOT_BULLET_EXPLOSION_COLORS;
    const count = 12;
    for (let i = 0; i < count; i++) {
        if (explosions.length >= MAX_EXPLOSION_PARTICLES) {
            explosions.shift();
        }
        const angle = (Math.PI * 2 * i) / count + (Math.random() - 0.5) * 0.55;
        const speed = 65 + Math.random() * 145;
        explosions.push({
            x: wx + (Math.random() - 0.5) * 4,
            y: wy + (Math.random() - 0.5) * 4,
            vx: Math.cos(angle) * speed,
            vy: Math.sin(angle) * speed,
            radius: 2 + Math.random() * 2.5,
            life: 0.16 + Math.random() * 0.14,
            age: 0,
            color: palette[Math.floor(Math.random() * palette.length)]
        });
    }
}

function getSwingOffset(entityKey, nowMs) {
    const startedAt = swingAnims.get(entityKey);
    if (!startedAt) return 0;
    const duration = 260;
    const elapsed = nowMs - startedAt;
    if (elapsed >= duration || elapsed < 0) {
        swingAnims.delete(entityKey);
        return 0;
    }
    const p = elapsed / duration;
    if (p < 0.32) {
        const t = p / 0.32;
        const easeOut = 1 - (1 - t) * (1 - t);
        return -0.72 * easeOut;
    }
    if (p < 0.68) {
        const t = (p - 0.32) / 0.36;
        const easeInOut = t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
        return -0.72 + 1.44 * easeInOut;
    }
    const t = (p - 0.68) / 0.32;
    const easeOut = 1 - (1 - t) * (1 - t);
    return 0.72 * (1 - easeOut);
}

function clientHasLOS(x1, y1, x2, y2) {
    const grid = WORLD.MAP.mapData ? WORLD.MAP.mapData.wall : null;
    if (!grid) return true;
    const ts = WORLD.MAP.tileSize || 64;
    const cols = WORLD.MAP.columns || 0;
    const rows = WORLD.MAP.rows || 0;
    const dx = x2 - x1;
    const dy = y2 - y1;
    const dist = Math.hypot(dx, dy);
    if (dist <= 4) return true;
    const steps = Math.ceil(dist / (ts * 0.35));
    for (let i = 1; i < steps; i++) {
        const px = x1 + (dx * i) / steps;
        const py = y1 + (dy * i) / steps;
        const c = Math.floor(px / ts);
        const r = Math.floor(py / ts);
        if (c < 0 || c >= cols || r < 0 || r >= rows) return false;
        if (grid[r] && grid[r][c]) return false;
    }
    return true;
}

const labelSpriteCache = new Map();
let labelSpriteScale = 0;

if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(() => {
        labelSpriteCache.clear();
    });
}

function getLabelSprite(label, faction) {
    const scale = Math.max(0.5, WORLD.SYSTEM.viewScale || 1);
    if (labelSpriteScale !== scale) {
        labelSpriteCache.clear();
        labelSpriteScale = scale;
    }
    const key = `${faction}:${label}`;
    let cached = labelSpriteCache.get(key);
    if (cached) return cached;

    const c = document.createElement('canvas');
    const cctx = c.getContext('2d');
    cctx.font = '15px Viga, sans-serif';
    const textW = Math.ceil(cctx.measureText(label).width);
    const padX = 6;
    const w = Math.max(16, textW + padX * 2);
    const h = 24;
    c.width = Math.max(1, Math.ceil(w * scale));
    c.height = Math.max(1, Math.ceil(h * scale));
    cctx.scale(scale, scale);

    cctx.font = '15px Viga, sans-serif';
    cctx.textAlign = 'center';
    cctx.textBaseline = 'alphabetic';
    cctx.lineJoin = 'round';
    cctx.lineWidth = 3;
    cctx.strokeStyle = 'rgba(0,0,0,0.85)';
    if (faction === 'rarebot') cctx.fillStyle = '#f00000';
    else if (faction === 'spectator') cctx.fillStyle = '#ffffff';
    else cctx.fillStyle = '#d84aff';

    const baselineY = 18;
    cctx.strokeText(label, w / 2, baselineY);
    cctx.fillText(label, w / 2, baselineY);

    if (labelSpriteCache.size >= 64) {
        const firstKey = labelSpriteCache.keys().next().value;
        if (firstKey !== undefined) labelSpriteCache.delete(firstKey);
    }
    cached = {
        canvas: c,
        w,
        h,
        baselineY,
        scale,
        drawW: c.width / scale,
        drawH: c.height / scale
    };
    labelSpriteCache.set(key, cached);
    return cached;
}

function drawSubtleBars(x, topY, hp, maxHp, en, maxEn) {
    const barW = 34;
    const hpH = 3;
    const enH = 2;
    const left = Math.round(x - barW / 2);
    const top = Math.round(topY);
    const hpRatio = Math.max(0, Math.min(1, hp / Math.max(1, maxHp)));
    const enRatio = Math.max(0, Math.min(1, en / Math.max(1, maxEn)));

    ctx.globalAlpha = 0.55;
    ctx.fillStyle = 'rgba(0, 0, 0, 0.65)';
    ctx.fillRect(left - 1, top - 1, barW + 2, hpH + enH + 3);
    ctx.fillStyle = '#cc3f3f';
    ctx.fillRect(left, top, Math.round(barW * hpRatio), hpH);
    ctx.fillStyle = '#d1ab38';
    ctx.fillRect(left, top + hpH + 1, Math.round(barW * enRatio), enH);
    ctx.globalAlpha = 1;
}

const HANDS_SCALE = 1.15;

function hasFloatingTextBlocking(playerId) {
    for (let i = 0; i < floatingTexts.length; i++) {
        const ft = floatingTexts[i];
        if (ft.playerId === playerId && ft.age * 24 < 22) {
            return true;
        }
    }
    return false;
}

function getRecoilTransform(entityKey, nowMs) {
    if (!entityKey) return null;
    const startedAt = recoilAnims.get(entityKey);
    if (!startedAt) return null;
    const duration = 135;
    const elapsed = nowMs - startedAt;
    if (elapsed < 0 || elapsed >= duration) {
        recoilAnims.delete(entityKey);
        return null;
    }
    const p = elapsed / duration;
    let mag;
    if (p < 0.24) {
        const t = p / 0.24;
        mag = 1 - (1 - t) * (1 - t);
    } else {
        const t = (p - 0.24) / 0.76;
        mag = Math.pow(1 - t, 2.2);
    }
    return { dy: mag * 10, rot: mag * 0.045 };
}

function getEquipTransform(entityKey, nowMs) {
    if (!entityKey) return null;
    const startedAt = equipAnims.get(entityKey);
    if (!startedAt) return null;
    const duration = 200;
    const elapsed = nowMs - startedAt;
    if (elapsed < 0 || elapsed >= duration) {
        equipAnims.delete(entityKey);
        return null;
    }
    const p = elapsed / duration;
    const c1 = 1.25;
    const c3 = c1 + 1;
    const ease = 1 + c3 * Math.pow(p - 1, 3) + c1 * Math.pow(p - 1, 2);
    const rem = 1 - ease;
    return { dx: -20 * rem, dy: 11 * rem, rot: -0.92 * rem };
}

function getLeftPunchOffset(entityKey, nowMs) {
    if (!entityKey) return null;
    const startedAt = leftPunchAnims.get(entityKey);
    if (!startedAt) return null;
    const duration = 240;
    const elapsed = nowMs - startedAt;
    if (elapsed < 0 || elapsed >= duration) {
        leftPunchAnims.delete(entityKey);
        return null;
    }
    const p = elapsed / duration;
    let mag;
    if (p < 0.28) {
        const t = p / 0.28;
        mag = 1 - (1 - t) * (1 - t);
    } else {
        const t = (p - 0.28) / 0.72;
        mag = Math.pow(1 - t, 2);
    }
    return { dy: -16 * mag, rot: 0.28 * mag };
}

const scaledSpriteCache = new Map();
let scaledSpriteViewScale = 0;

function getScaledSpriteCanvas(key, img, sx, sy, sw, sh, logicalW, logicalH) {
    if (!img || !img.complete || img.naturalWidth === 0) return null;
    const vs = Math.max(0.5, WORLD.SYSTEM.viewScale || 1);
    if (scaledSpriteViewScale !== vs) {
        scaledSpriteCache.clear();
        scaledSpriteViewScale = vs;
    }
    let cached = scaledSpriteCache.get(key);
    if (cached) return cached;

    const mipScale = vs * 1.25;
    const c = document.createElement('canvas');
    c.width = Math.max(8, Math.ceil(logicalW * mipScale));
    c.height = Math.max(8, Math.ceil(logicalH * mipScale));
    const cctx = c.getContext('2d');
    cctx.imageSmoothingEnabled = false;
    cctx.drawImage(img, sx, sy, sw, sh, 0, 0, c.width, c.height);
    scaledSpriteCache.set(key, c);
    return c;
}

function drawBotHands(x, y, sW, sH, angle, swingOffset, spriteKind, weapon, entityKey, nowMs) {
    ctx.save();
    ctx.translate(x, y);
    const isPistol = weapon === 'goodbot-pistol' || weapon === 'pistol';
    ctx.rotate(angle + (isPistol ? 0 : swingOffset));
    const refW = goodbotImg.complete && goodbotImg.naturalWidth > 0 ? goodbotImg.naturalWidth : 512;
    const refH = goodbotImg.complete && goodbotImg.naturalHeight > 0 ? goodbotImg.naturalHeight : 512;

    if (isPistol) {
        const pistolImg = weapon === 'pistol' ? rarebotPistolImg : goodbotPistolImg;
        if (pistolImg.complete && pistolImg.naturalWidth > 0) {
            const pxScaleX = (sW / refW) * HANDS_SCALE;
            const pxScaleY = (sH / refH) * HANDS_SCALE;
            const splitX = 284;
            const fullH = pistolImg.naturalHeight;
            const pH = fullH * pxScaleY;
            const leftW = Math.min(splitX, pistolImg.naturalWidth);
            const leftDrawW = leftW * pxScaleX;
            const rightW = pistolImg.naturalWidth - leftW;
            const rightDrawW = rightW * pxScaleX;
            const leftMip = getScaledSpriteCanvas(`${weapon}_L`, pistolImg, 0, 0, leftW, fullH, (leftW / refW) * 48 * HANDS_SCALE, (fullH / refH) * 48 * HANDS_SCALE) || pistolImg;
            const bodyScale = sW / 48;
            const leftPunch = getLeftPunchOffset(entityKey, nowMs);
            if (leftPunch) {
                ctx.save();
                ctx.translate(0, leftPunch.dy * bodyScale);
                ctx.rotate(leftPunch.rot);
                if (leftMip !== pistolImg) {
                    ctx.drawImage(leftMip, -splitX * pxScaleX, -596 * pxScaleY, leftDrawW, pH);
                } else {
                    ctx.drawImage(pistolImg, 0, 0, leftW, fullH, -splitX * pxScaleX, -596 * pxScaleY, leftDrawW, pH);
                }
                ctx.restore();
            } else {
                if (leftMip !== pistolImg) {
                    ctx.drawImage(leftMip, -splitX * pxScaleX, -596 * pxScaleY, leftDrawW, pH);
                } else {
                    ctx.drawImage(pistolImg, 0, 0, leftW, fullH, -splitX * pxScaleX, -596 * pxScaleY, leftDrawW, pH);
                }
            }

            if (rightW > 0) {
                const rightMip = getScaledSpriteCanvas(`${weapon}_R`, pistolImg, leftW, 0, rightW, fullH, (rightW / refW) * 48 * HANDS_SCALE, (fullH / refH) * 48 * HANDS_SCALE) || pistolImg;
                const equip = getEquipTransform(entityKey, nowMs);
                const recoil = getRecoilTransform(entityKey, nowMs);
                const rDx = equip ? equip.dx * bodyScale : 0;
                const rDy = (equip ? equip.dy * bodyScale : 0) + (recoil ? recoil.dy * bodyScale : 0);
                const rRot = (equip ? equip.rot : 0) + (recoil ? recoil.rot : 0);
                const needRightXform = rDx !== 0 || rDy !== 0 || rRot !== 0;
                if (needRightXform) {
                    ctx.save();
                    if (rDx !== 0 || rDy !== 0) {
                        ctx.translate(rDx, rDy);
                    }
                    if (rRot !== 0) {
                        ctx.rotate(rRot);
                    }
                }
                if (rightMip !== pistolImg) {
                    ctx.drawImage(rightMip, 0, -596 * pxScaleY, rightDrawW, pH);
                } else {
                    ctx.drawImage(pistolImg, leftW, 0, rightW, fullH, 0, -596 * pxScaleY, rightDrawW, pH);
                }
                if (needRightXform) {
                    ctx.restore();
                }
            }
            ctx.restore();
            return;
        }
    }

    const handsImg = spriteKind === 'prototype' ? prototypeRarebotHandsImg : botHandsImg;
    if (handsImg.complete && handsImg.naturalWidth > 0) {
        const hW = sW * (handsImg.naturalWidth / refW) * HANDS_SCALE;
        const hH = sH * (handsImg.naturalHeight / refH) * HANDS_SCALE;
        const handsKey = spriteKind === 'prototype' ? 'proto_hands' : 'bot_hands';
        const handsMip = getScaledSpriteCanvas(
            handsKey,
            handsImg,
            0,
            0,
            handsImg.naturalWidth,
            handsImg.naturalHeight,
            48 * (handsImg.naturalWidth / refW) * HANDS_SCALE,
            48 * (handsImg.naturalHeight / refH) * HANDS_SCALE
        ) || handsImg;
        ctx.drawImage(handsMip, -hW / 2, -hH / 2, hW, hH);
    } else {
        const r = sW * 0.14 * HANDS_SCALE;
        const hx = sW * 0.46 * HANDS_SCALE;
        const hy = -sH * 0.48 * HANDS_SCALE;
        ctx.fillStyle = '#2d2d30';
        ctx.strokeStyle = '#000000';
        ctx.lineWidth = Math.max(1.5, sW * 0.045);
        ctx.beginPath();
        ctx.arc(-hx, hy, r, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
        ctx.beginPath();
        ctx.arc(hx, hy, r, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
    }
    ctx.restore();
}

function drawEntity(x, y, width, height, angle, scale, label, faction, showHands, swingOffset, bars, spriteKind = null, weapon = 'hands', entityKey = null, nowMs = 0) {
    const sW = width * scale;
    const sH = height * scale;
    let spriteImg = goodbotImg;
    let bodyKey = 'body_goodbot';
    if (spriteKind === 'prototype') {
        spriteImg = prototypeRarebotImg;
        bodyKey = 'body_proto';
    } else if (faction === 'rarebot') {
        spriteImg = rarebotImg;
        bodyKey = 'body_rarebot';
    }
    const isSpectator = faction === 'spectator';

    if (showHands && !isSpectator) {
        drawBotHands(x, y, sW, sH, angle, swingOffset, spriteKind, weapon, entityKey, nowMs);
    }

    if (spriteImg.complete && spriteImg.naturalWidth > 0) {
        const bodyMip = getScaledSpriteCanvas(bodyKey, spriteImg, 0, 0, spriteImg.naturalWidth, spriteImg.naturalHeight, width, height) || spriteImg;
        ctx.save();
        if (isSpectator) ctx.globalAlpha = 0.5;
        ctx.translate(x, y);
        ctx.rotate(angle);
        ctx.drawImage(bodyMip, -sW / 2, -sH / 2, sW, sH);
        ctx.restore();
    }

    if (label) {
        const lbl = getLabelSprite(label, faction);
        const drawX = Math.round((x - lbl.w / 2) * lbl.scale) / lbl.scale;
        const drawY = Math.round((y - sH / 2 - 10 - lbl.baselineY) * lbl.scale) / lbl.scale;
        ctx.drawImage(lbl.canvas, drawX, drawY, lbl.drawW, lbl.drawH);
    }

    if (bars) {
        drawSubtleBars(x, y + sH / 2 + 6, bars.health, bars.maxHealth, bars.energy, bars.maxEnergy);
    }
}

function wrapChatLines(text) {
    const words = String(text || '').trim().split(/\s+/).filter(Boolean);
    if (words.length === 0) return [];
    const lines = [];
    const maxLineWidth = 240;
    let current = '';
    let wordCount = 0;

    for (let i = 0; i < words.length; i++) {
        const word = words[i];
        if (ctx.measureText(word).width > maxLineWidth) {
            if (current) {
                lines.push(current);
                current = '';
                wordCount = 0;
            }
            let chunk = '';
            for (let c = 0; c < word.length; c++) {
                const nextChunk = chunk + word[c];
                if (chunk && ctx.measureText(nextChunk).width > maxLineWidth) {
                    lines.push(chunk);
                    chunk = word[c];
                } else {
                    chunk = nextChunk;
                }
            }
            if (chunk) {
                current = chunk;
                wordCount = 1;
            }
            continue;
        }

        const candidate = current ? current + ' ' + word : word;
        if (current && (wordCount >= 5 || ctx.measureText(candidate).width > maxLineWidth)) {
            lines.push(current);
            current = word;
            wordCount = 1;
        } else {
            current = candidate;
            wordCount++;
        }
    }

    if (current) lines.push(current);
    return lines;
}

function drawChatBubbles(chats, x, bottomY) {
    if (!chats || chats.length === 0) return;
    ctx.font = '14px Viga, sans-serif';
    const paddingX = 10;
    const paddingY = 6;
    const lineHeight = 18;
    const bubbleGap = 5;
    let currentBottomY = bottomY;
    const startIdx = Math.max(0, chats.length - 2);

    for (let i = chats.length - 1; i >= startIdx; i--) {
        const lines = wrapChatLines(chats[i]);
        if (lines.length === 0) continue;

        let maxW = 0;
        for (let l = 0; l < lines.length; l++) {
            const w = ctx.measureText(lines[l]).width;
            if (w > maxW) maxW = w;
        }

        const bubbleW = Math.ceil(maxW + paddingX * 2);
        const bubbleH = lines.length * lineHeight + paddingY * 2;
        const topY = Math.round(currentBottomY - bubbleH);
        const leftX = Math.round(x - bubbleW / 2);

        ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
        ctx.fillRect(leftX, topY, bubbleW, bubbleH);

        ctx.fillStyle = '#ffffff';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        for (let l = 0; l < lines.length; l++) {
            ctx.fillText(lines[l], x, topY + paddingY + lineHeight * (l + 0.5));
        }

        currentBottomY = topY - bubbleGap;
    }
}

function drawClippedChunk(chunkCanvas, worldX0, worldY0, bounds, camX, camY, visW, visH) {
    const rx0 = worldX0 + bounds.minX;
    const ry0 = worldY0 + bounds.minY;
    const rx1 = worldX0 + bounds.maxX;
    const ry1 = worldY0 + bounds.maxY;
    const ix0 = rx0 > camX ? rx0 : camX;
    const iy0 = ry0 > camY ? ry0 : camY;
    const ix1 = rx1 < camX + visW ? rx1 : camX + visW;
    const iy1 = ry1 < camY + visH ? ry1 : camY + visH;
    const sw = ix1 - ix0;
    const sh = iy1 - iy0;
    if (sw <= 0 || sh <= 0) return;
    ctx.drawImage(chunkCanvas, ix0 - worldX0, iy0 - worldY0, sw, sh, ix0 - camX, iy0 - camY, sw, sh);
}

function render() {
    if (!WORLD.SYSTEM.isReady) return;
    if (!WORLD.MAP.bgChunks.length || !WORLD.MAP.bgChunks[0].length) return;

    const camX = Math.floor(WORLD.CAMERA.x || 0);
    const camY = Math.floor(WORLD.CAMERA.y || 0);
    const camW = WORLD.CAMERA.width;
    const camH = WORLD.CAMERA.height;
    const visW = Math.ceil(camW);
    const visH = Math.ceil(camH);
    const cs = WORLD.MAP.chunkSize;
    const mapW = WORLD.MAP.columns * WORLD.MAP.tileSize;
    const mapH = WORLD.MAP.rows * WORLD.MAP.tileSize;

    if (camX < 0 || camY < 0 || camX + visW > mapW || camY + visH > mapH) {
        ctx.fillStyle = '#000000';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
    }

    ctx.save();
    ctx.scale(WORLD.SYSTEM.viewScale, WORLD.SYSTEM.viewScale);
    ctx.imageSmoothingEnabled = false;

    const startCX = Math.max(0, Math.floor(camX / cs));
    const endCX = Math.min(WORLD.MAP.bgChunks[0].length - 1, Math.floor((camX + visW) / cs));
    const startCY = Math.max(0, Math.floor(camY / cs));
    const endCY = Math.min(WORLD.MAP.bgChunks.length - 1, Math.floor((camY + visH) / cs));

    for (let cy = startCY; cy <= endCY; cy++) {
        const wy0 = cy * cs;
        const maxLocalH = Math.min(cs, mapH - wy0);
        if (maxLocalH <= 0) continue;
        for (let cx = startCX; cx <= endCX; cx++) {
            const wx0 = cx * cs;
            const maxLocalW = Math.min(cs, mapW - wx0);
            if (maxLocalW <= 0) continue;
            drawClippedChunk(
                WORLD.MAP.bgChunks[cy][cx],
                wx0,
                wy0,
                { minX: 0, minY: 0, maxX: maxLocalW, maxY: maxLocalH },
                camX,
                camY,
                visW,
                visH
            );
        }
    }

    const cullPad = 96;
    const nowMs = performance.now();

    if (!inMainMenu && myId !== null) {
        const meCX = ME.x + ME.width / 2;
        const meCY = ME.y + ME.height / 2;

        if (serverProjectiles.size > 0) {
            const bulletScale = (48 / 512) * HANDS_SCALE * 1.35;
            for (const [, proj] of serverProjectiles) {
                const bx = proj.x - camX;
                const by = proj.y - camY;
                if (bx < -48 || bx > camW + 48 || by < -48 || by > camH + 48) continue;
                const bulletImg = proj.variant === 'rarebot' ? rarebotBulletImg : goodbotBulletImg;
                ctx.save();
                ctx.translate(bx, by);
                ctx.rotate(proj.angle || 0);
                if (bulletImg.complete && bulletImg.naturalWidth > 0) {
                    const bw = bulletImg.naturalWidth * bulletScale;
                    const bh = bulletImg.naturalHeight * bulletScale;
                    const bulletMip = getScaledSpriteCanvas(
                        proj.variant === 'rarebot' ? 'bullet_rarebot' : 'bullet_goodbot',
                        bulletImg,
                        0,
                        0,
                        bulletImg.naturalWidth,
                        bulletImg.naturalHeight,
                        bw,
                        bh
                    ) || bulletImg;
                    ctx.drawImage(bulletMip, -bw / 2, -bh / 2, bw, bh);
                } else {
                    ctx.fillStyle = proj.variant === 'rarebot' ? '#ff2a2a' : '#b833ff';
                    ctx.fillRect(-2, -12, 4, 24);
                }
                ctx.restore();
            }
        }

        for (const id in serverEnemies) {
            const e = serverEnemies[id];
            const ew = e.width || 48;
            const eh = e.height || 48;
            const eRX = (e.renderX ?? e.x) - camX + ew / 2;
            const eRY = (e.renderY ?? e.y) - camY + eh / 2;
            if (eRX < -cullPad || eRX > camW + cullPad || eRY < -cullPad || eRY > camH + cullPad) continue;
            const es = Math.min(2, Math.max(0.3, e.scale || 1));
            const key = `enemy:${id}`;
            const showBars = ME.faction === 'goodbot' && (enemyAggroUntil.get(key) || 0) > nowMs;
            const eKind = e.kind || 'rarebot';
            const eWeapon = e.weapon || 'hands';
            const eLabel = e.name || (eKind === 'prototype' ? 'Prototype Rarebot' : 'Rarebot');
            const bars = showBars ? {
                health: e.health ?? (eKind === 'prototype' ? 120 : 255),
                maxHealth: e.maxHealth ?? (eKind === 'prototype' ? 120 : 255),
                energy: e.energy ?? (eKind === 'prototype' ? 100 : 50),
                maxEnergy: e.maxEnergy ?? (eKind === 'prototype' ? 100 : 50)
            } : null;
            drawEntity(eRX, eRY, ew, eh, e.renderAngle ?? 0, es, eLabel, 'rarebot', true, getSwingOffset(key, nowMs), bars, eKind, eWeapon, key, nowMs);
        }

        for (const id in serverPlayers) {
            const p = serverPlayers[id];
            const pw = p.width || 48;
            const ph = p.height || 48;
            const pFaction = p.faction || 'goodbot';
            const pRX = (p.renderX ?? p.x) - camX + pw / 2;
            const pRY = (p.renderY ?? p.y) - camY + ph / 2;
            if (pRX < -cullPad || pRX > camW + cullPad || pRY < -cullPad || pRY > camH + cullPad) continue;
            const ps = Math.min(2, Math.max(0.3, p.scale || 1));
            const key = `player:${id}`;
            let showBars = false;
            if (ME.faction === 'goodbot' && pFaction === 'rarebot') {
                showBars = (enemyAggroUntil.get(key) || 0) > nowMs;
            } else if (ME.faction === 'goodbot' && pFaction === 'goodbot') {
                const adx = ((p.renderX ?? p.x) + pw / 2) - meCX;
                const ady = ((p.renderY ?? p.y) + ph / 2) - meCY;
                showBars = (adx * adx + ady * ady) <= 260 * 260;
            } else if (ME.faction === 'rarebot' && pFaction === 'goodbot') {
                showBars = clientHasLOS(meCX, meCY, (p.renderX ?? p.x) + pw / 2, (p.renderY ?? p.y) + ph / 2);
            }
            const bars = showBars ? {
                health: p.health ?? (pFaction === 'rarebot' ? 255 : 1000),
                maxHealth: p.maxHealth ?? (pFaction === 'rarebot' ? 255 : 1000),
                energy: p.energy ?? (pFaction === 'rarebot' ? 50 : 255),
                maxEnergy: p.maxEnergy ?? (pFaction === 'rarebot' ? 50 : 255)
            } : null;
            drawEntity(pRX, pRY, pw, ph, p.renderAngle ?? 0, ps, p.name, pFaction, pFaction !== 'spectator', getSwingOffset(key, nowMs), bars, null, p.weapon || 'hands', key, nowMs);
        }

        const pRenderX = ME.x - camX + ME.width / 2;
        const pRenderY = ME.y - camY + ME.height / 2;
        const myKey = `player:${myId}`;
        drawEntity(pRenderX, pRenderY, ME.width, ME.height, ME.angle, ME.scale, myName, ME.faction, ME.faction !== 'spectator', getSwingOffset(myKey, nowMs), null, null, getMyEquippedWeapon(), myKey, nowMs);
    }

    for (let cy = startCY; cy <= endCY; cy++) {
        const wy0 = cy * cs;
        for (let cx = startCX; cx <= endCX; cx++) {
            const bounds = WORLD.MAP.wallChunkBounds[cy] ? WORLD.MAP.wallChunkBounds[cy][cx] : null;
            if (!bounds) continue;
            drawClippedChunk(WORLD.MAP.wallChunks[cy][cx], cx * cs, wy0, bounds, camX, camY, visW, visH);
        }
    }

    for (let cy = startCY; cy <= endCY; cy++) {
        const wy0 = cy * cs;
        for (let cx = startCX; cx <= endCX; cx++) {
            const bounds = WORLD.MAP.fgChunkBounds[cy] ? WORLD.MAP.fgChunkBounds[cy][cx] : null;
            if (!bounds) continue;
            drawClippedChunk(WORLD.MAP.fgChunks[cy][cx], cx * cs, wy0, bounds, camX, camY, visW, visH);
        }
    }

    if (alertCommWaves.length > 0) {
        ctx.save();
        for (let i = 0; i < alertCommWaves.length; i++) {
            const w = alertCommWaves[i];
            const p = Math.max(0, Math.min(1, w.age / w.life));
            const alpha = (1 - p) * 0.8;
            const wx = w.x - camX;
            const wy = w.y - camY;
            const r = 18 + p * 190;
            ctx.strokeStyle = `rgba(255, 70, 50, ${alpha.toFixed(3)})`;
            ctx.lineWidth = 3 * (1 - p * 0.5);
            ctx.beginPath();
            ctx.arc(wx, wy, r, 0, Math.PI * 2);
            ctx.stroke();

            if (p < 0.7) {
                const tx = w.targetX - camX;
                const ty = w.targetY - camY;
                ctx.strokeStyle = `rgba(255, 130, 60, ${((1 - p / 0.7) * 0.75).toFixed(3)})`;
                ctx.lineWidth = 2;
                ctx.beginPath();
                ctx.moveTo(wx, wy);
                ctx.lineTo(tx, ty);
                ctx.stroke();
            }
        }
        ctx.restore();
    }

    if (!inMainMenu && myId !== null && enemyAlertBadges.size > 0) {
        ctx.save();
        ctx.font = 'bold 20px Viga, sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.lineJoin = 'round';
        ctx.lineWidth = 3.5;
        ctx.strokeStyle = 'rgba(0, 0, 0, 0.9)';
        for (const [eid, badge] of enemyAlertBadges) {
            if (nowMs >= badge.until) {
                enemyAlertBadges.delete(eid);
                continue;
            }
            const e = serverEnemies[eid];
            if (!e) continue;
            const ex = (e.renderX ?? e.x) + (e.width || 48) / 2 - camX;
            const ey = (e.renderY ?? e.y) - 34 - camY;
            if (ex < -48 || ex > camW + 48 || ey < -48 || ey > camH + 48) continue;
            const rem = (badge.until - nowMs) / 1100;
            ctx.globalAlpha = Math.max(0, Math.min(1, rem * 1.4));
            ctx.fillStyle = badge.isMessenger ? '#ff9900' : '#ff2a2a';
            const pop = Math.sin(Math.min(1, 1 - rem) * Math.PI) * 5;
            ctx.strokeText('!', ex, ey - pop);
            ctx.fillText('!', ex, ey - pop);
        }
        ctx.restore();
    }

    if (explosions.length > 0) {
        for (let i = 0; i < explosions.length; i++) {
            const pt = explosions[i];
            const px = pt.x - camX;
            const py = pt.y - camY;
            if (px < -24 || px > camW + 24 || py < -24 || py > camH + 24) continue;
            const alpha = Math.max(0, 1 - pt.age / pt.life);
            ctx.globalAlpha = alpha * 0.85;
            ctx.fillStyle = pt.color;
            ctx.beginPath();
            ctx.arc(px, py, pt.radius * (0.6 + 0.4 * alpha), 0, Math.PI * 2);
            ctx.fill();
        }
        ctx.globalAlpha = 1;
    }

    if (!inMainMenu && myId !== null) {
        if (floatingTexts.length > 0) {
            ctx.save();
            ctx.font = '16px Viga, sans-serif';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'alphabetic';
            ctx.lineJoin = 'round';
            ctx.lineWidth = 3;
            ctx.strokeStyle = 'rgba(0,0,0,0.9)';
            for (let i = 0; i < floatingTexts.length; i++) {
                const ft = floatingTexts[i];
                const alpha = Math.max(0, 1 - ft.age / ft.life);
                let tx = ft.x;
                let ty = ft.y;
                if (ft.playerId === myId) {
                    tx = ME.x + ME.width / 2;
                    ty = ME.y - 26;
                } else if (serverPlayers[ft.playerId]) {
                    const fp = serverPlayers[ft.playerId];
                    tx = (fp.renderX ?? fp.x) + fp.width / 2;
                    ty = (fp.renderY ?? fp.y) - 26;
                }
                const sx = tx + (ft.xOff || 0) - camX;
                const sy = ty - camY - ft.age * 24;
                ctx.globalAlpha = alpha;
                ctx.fillStyle = ft.color || '#ffe100';
                ctx.strokeText(ft.text, sx, sy);
                ctx.fillText(ft.text, sx, sy);
            }
            ctx.restore();
        }

        for (const id in serverPlayers) {
            const p = serverPlayers[id];
            if (!p.chats || p.chats.length === 0) continue;
            const pRX = (p.renderX ?? p.x) - camX + p.width / 2;
            const pRY = (p.renderY ?? p.y) - camY + p.height / 2;
            const ps = Math.min(2, Math.max(0.3, p.scale || 1));
            drawChatBubbles(p.chats, pRX, pRY - (p.height * ps) / 2 - 28);
        }

        if (ME.chats && ME.chats.length > 0) {
            const pRenderX = ME.x - camX + ME.width / 2;
            const pRenderY = ME.y - camY + ME.height / 2;
            drawChatBubbles(ME.chats, pRenderX, pRenderY - (ME.height * ME.scale) / 2 - 28);
        }
    }

    ctx.restore();
}

function gameLoop(now) {
    if (!WORLD.SYSTEM.isReady) return;
    requestAnimationFrame(gameLoop);
    sampleFps(now);

    let dt = (now - WORLD.SYSTEM.lastTime) / 1000;
    WORLD.SYSTEM.lastTime = now;
    if (dt > 0.1) dt = 0.1;
    if (dt < 0 || isNaN(dt)) dt = 0.016;

    if (inMainMenu) {
        updateMenuCamera(dt);
        render();
        return;
    }

    if (!myId) return;
    update(dt);
    render();
}

function normalizeWsUrl(rawUrl) {
    let u = String(rawUrl || '').trim().replace(/\/+$/, '');
    if (u.startsWith('https://')) u = 'wss://' + u.slice(8);
    else if (u.startsWith('http://')) u = 'ws://' + u.slice(7);
    return u;
}

async function resolveWsUrl() {
    if (isNodeHostedOrigin()) {
        const proto = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
        return proto + '//' + window.location.host;
    }
    if (CLOUDFLARED_WSS_URL) return normalizeWsUrl(CLOUDFLARED_WSS_URL);
    try {
        const res = await fetch('config.json', { cache: 'no-store' });
        if (res.ok) {
            const cfg = await res.json();
            if (cfg && cfg.wssUrl) return normalizeWsUrl(cfg.wssUrl);
        }
    } catch (_) {}
    const proto = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    return proto + '//' + window.location.host;
}

async function connectToServer() {
    if (isConnectingWs) return;
    if (ws && (ws.readyState === WebSocket.OPEN || ws.readyState === WebSocket.CONNECTING)) return;
    isConnectingWs = true;

    let wsUrl;
    try {
        wsUrl = await resolveWsUrl();
        startPingMonitor(wsUrl);
        const wsConnectStart = performance.now();
        ws = new WebSocket(wsUrl);

        ws.onopen = () => {
            hasConnected = true;
            updatePingDisplay(performance.now() - wsConnectStart);
            measurePingOnce();
            if (pendingJoinName !== null) {
                ws.send(JSON.stringify({ type: 'join', name: pendingJoinName, sessionToken }));
                pendingJoinName = null;
            }
        };
    } finally {
        isConnectingWs = false;
    }

    ws.onmessage = (event) => {
        let data;
        try {
            data = JSON.parse(event.data);
        } catch (_) {
            return;
        }

        if (data.type === 'pong' && typeof data.t === 'number') {
            updatePingDisplay(performance.now() - data.t);
            return;
        }

        if (data.type === 'server_info') {
            updateServerDropdown(data.playerCount, data.maxPlayers);
            return;
        }

        if (data.type === 'game_state') {
            applyGameStateUI(data);
            return;
        }

        if (data.type === 'left_server') {
            updateServerDropdown(data.playerCount, data.maxPlayers);
            return;
        }

        if (data.type === 'server_full') {
            isJoining = false;
            pendingJoinName = null;
            inMainMenu = true;
            updateServerDropdown(data.playerCount, data.maxPlayers);
            setMenuError(data.message || `Server is full (${serverPlayerCount}/${serverMaxPlayers})`);
            return;
        }

        if (data.type === 'map_data') {
            if (typeof data.isMobile === 'boolean') {
                applyServerDeviceMode(data.isMobile);
            }
            updateServerDropdown(data.playerCount, data.maxPlayers);
            applyMapPayload(data.map);
            preRenderMap();
            WORLD.SYSTEM.isReady = true;
            resizeCanvas();
            if (!WORLD.SYSTEM._gameLoopRunning) {
                WORLD.SYSTEM._gameLoopRunning = true;
                requestAnimationFrame(gameLoop);
            }
            return;
        }

        if (data.type === 'init') {
            if (typeof data.isMobile === 'boolean') {
                applyServerDeviceMode(data.isMobile);
            }
            isJoining = false;
            pendingJoinName = null;
            myId = data.id;
            myName = data.name;
            inMainMenu = false;
            WORLD.CAMERA.x = null;
            WORLD.CAMERA.y = null;
            setMenuError('');
            updateServerDropdown(data.playerCount, data.maxPlayers);
            enterGameUI();

            applyMapPayload(data.map);
            preRenderMap();

            ME.x = data.x;
            ME.y = data.y;
            ME.serverX = data.x;
            ME.serverY = data.y;
            ME.vx = 0;
            ME.vy = 0;
            ME.scale = 1;
            ME.faction = data.faction || 'goodbot';
            ME.maxHealth = Math.max(1, Number(data.maxHealth) || 1000);
            ME.maxEnergy = Math.max(1, Number(data.maxEnergy) || 255);
            ME.health = Math.max(0, Math.min(ME.maxHealth, data.health ?? ME.maxHealth));
            ME.energy = Math.max(0, Math.min(ME.maxEnergy, data.energy ?? ME.maxEnergy));
            ME.scraps = Math.max(0, Math.floor(data.scraps ?? 0));
            ME.chats = [];
            myInventory = Array.isArray(data.inventory) ? data.inventory.slice(0, 5) : [null, null, null, null, null];
            while (myInventory.length < 5) myInventory.push(null);
            activeSlot = Number.isInteger(data.activeSlot) ? Math.max(0, Math.min(4, data.activeSlot)) : 0;
            lastEquippedItemKey = myInventory[activeSlot] || null;
            renderInventorySlots();
            lastRenderedHealth = -1;
            lastRenderedEnergy = -1;
            lastRenderedMaxHealth = -1;
            lastRenderedMaxEnergy = -1;
            updateStatsUI();
            updateLeaderboard([{ name: myName, scraps: ME.scraps, faction: ME.faction }]);
            if (data.gameState) {
                applyGameStateUI(data.gameState);
            }
            selectSlot(activeSlot, false);
            if (chatLog) {
                chatLog.textContent = '';
                if (Array.isArray(data.chatLog)) {
                    for (let i = 0; i < data.chatLog.length; i++) {
                        appendChatLog(data.chatLog[i].name, data.chatLog[i].text, data.chatLog[i].faction || 'goodbot');
                    }
                }
            }

            lastInputKeySig = '';
            WORLD.CAMERA.x = ME.x + ME.width / 2 - WORLD.CAMERA.width / 2;
            WORLD.CAMERA.y = ME.y + ME.height / 2 - WORLD.CAMERA.height / 2;

            WORLD.SYSTEM.lastTime = performance.now();
            WORLD.SYSTEM.isReady = true;
            if (!WORLD.SYSTEM._gameLoopRunning) {
                WORLD.SYSTEM._gameLoopRunning = true;
                requestAnimationFrame(gameLoop);
            }
            sendInput(true);
            return;
        }

        if (data.type === 'shutdown') {
            window.location.reload();
            return;
        }

        if (data.type === 'chat_log') {
            if (typeof data.name === 'string' && typeof data.text === 'string') {
                appendChatLog(data.name, data.text, data.faction || 'goodbot');
            }
            return;
        }

        if (data.type === 'entity_swing') {
            const key = `${data.kind}:${data.id}`;
            const nowMs = performance.now();
            if (!(data.kind === 'player' && data.id === myId && swingAnims.has(key) && nowMs - swingAnims.get(key) < 160)) {
                swingAnims.set(key, nowMs);
                playSpatialSound('swing', data.x, data.y);
            }
            if (ME.faction === 'goodbot' && data.kind === 'enemy') {
                if (data.targetId === myId) {
                    enemyAggroUntil.set(key, nowMs + 8000);
                } else if (typeof data.x === 'number' && typeof data.y === 'number') {
                    const dist = Math.hypot(data.x - (ME.x + ME.width / 2), data.y - (ME.y + ME.height / 2));
                    if (dist <= 135) enemyAggroUntil.set(key, nowMs + 8000);
                }
            } else if (ME.faction === 'goodbot' && data.kind === 'player' && data.id !== myId) {
                const attacker = serverPlayers[data.id];
                if (attacker && attacker.faction === 'rarebot' && typeof data.x === 'number' && typeof data.y === 'number') {
                    const dist = Math.hypot(data.x - (ME.x + ME.width / 2), data.y - (ME.y + ME.height / 2));
                    if (dist <= 135) enemyAggroUntil.set(key, nowMs + 8000);
                }
            }
            return;
        }

        if (data.type === 'left_punch') {
            const key = `${data.kind}:${data.id}`;
            const nowMs = performance.now();
            leftPunchAnims.set(key, nowMs);
            playSpatialSound('swing', data.x, data.y);
            if (ME.faction === 'goodbot' && data.kind === 'enemy') {
                if (data.targetId === myId) {
                    enemyAggroUntil.set(key, nowMs + 8000);
                } else if (typeof data.x === 'number' && typeof data.y === 'number') {
                    const dist = Math.hypot(data.x - (ME.x + ME.width / 2), data.y - (ME.y + ME.height / 2));
                    if (dist <= 135) enemyAggroUntil.set(key, nowMs + 8000);
                }
            }
            return;
        }

        if (data.type === 'rarebot_alert_comm') {
            const nowMs = performance.now();
            alertCommWaves.push({
                x: Number(data.x) || 0,
                y: Number(data.y) || 0,
                targetX: Number(data.targetX) || Number(data.x) || 0,
                targetY: Number(data.targetY) || Number(data.y) || 0,
                age: 0,
                life: 0.9
            });
            if (data.messengerId !== undefined && data.messengerId !== null) {
                enemyAlertBadges.set(String(data.messengerId), { until: nowMs + 1100, isMessenger: true });
            }
            if (Array.isArray(data.alertedIds)) {
                for (let i = 0; i < data.alertedIds.length; i++) {
                    enemyAlertBadges.set(String(data.alertedIds[i]), { until: nowMs + 1100, isMessenger: false });
                }
            }
            return;
        }

        if (data.type === 'inventory_update') {
            if (Array.isArray(data.inventory)) {
                myInventory = data.inventory.slice(0, 5);
                while (myInventory.length < 5) myInventory.push(null);
            }
            if (Number.isInteger(data.activeSlot)) {
                activeSlot = Math.max(0, Math.min(4, data.activeSlot));
            }
            if (typeof data.scraps === 'number') {
                ME.scraps = Math.max(0, Math.floor(data.scraps));
            }
            renderInventorySlots();
            selectSlot(activeSlot, false);
            syncEquipAnimation(false);
            updateStatsUI();
            return;
        }

        if (data.type === 'ranged_shot') {
            if (typeof data.projId === 'number') {
                serverProjectiles.set(data.projId, {
                    id: data.projId,
                    variant: data.variant || 'goodbot',
                    x: Number(data.projX) || 0,
                    y: Number(data.projY) || 0,
                    vx: Number(data.vx) || 0,
                    vy: Number(data.vy) || 0,
                    angle: Number(data.angle) || 0,
                    age: 0
                });
            }
            const nowMs = performance.now();
            if (!(data.kind === 'player' && data.id === myId && nowMs - lastLocalShotAt < 250)) {
                recoilAnims.set(`${data.kind}:${data.id}`, nowMs);
                playSpatialSound('laserShot', data.x, data.y);
            }
            if (ME.faction === 'goodbot' && data.kind === 'enemy' && typeof data.x === 'number' && typeof data.y === 'number') {
                const dist = Math.hypot(data.x - (ME.x + ME.width / 2), data.y - (ME.y + ME.height / 2));
                if (dist <= 360) {
                    enemyAggroUntil.set(`enemy:${data.id}`, nowMs + 8000);
                }
            }
            return;
        }

        if (data.type === 'projectile_wall_hit') {
            if (typeof data.id === 'number') {
                serverProjectiles.delete(data.id);
            }
            spawnBulletWallParticles(data.x, data.y, data.variant || 'goodbot');
            playSpatialSound('bulletWallImpact', data.tileX, data.tileY);
            return;
        }

        if (data.type === 'entity_hit') {
            if (data.projectileId) {
                serverProjectiles.delete(data.projectileId);
            }
            playSpatialSound('hit', data.x, data.y);
            playSpatialSound('hitReceive', data.x, data.y);
            let attX = typeof data.attackerX === 'number' ? data.attackerX : data.x;
            let attY = typeof data.attackerY === 'number' ? data.attackerY : data.y;
            if (data.attackerKind === 'player') {
                if (data.attackerId === myId) {
                    attX = ME.x + ME.width / 2;
                    attY = ME.y + ME.height / 2;
                } else if (serverPlayers[data.attackerId]) {
                    const ap = serverPlayers[data.attackerId];
                    attX = (ap.renderX ?? ap.x) + ap.width / 2;
                    attY = (ap.renderY ?? ap.y) + ap.height / 2;
                }
            } else if (data.attackerKind === 'enemy' && serverEnemies[data.attackerId]) {
                const ae = serverEnemies[data.attackerId];
                attX = (ae.renderX ?? ae.x) + ae.width / 2;
                attY = (ae.renderY ?? ae.y) + ae.height / 2;
            }
            playSpatialSound('hitDeal', attX, attY);
            if (data.weaponKind === 'ranged') {
                playRandomBulletImpact(data.x, data.y);
            } else if (data.weaponKind === 'grapple') {
                playSpatialSound('grapple1', data.x, data.y);
            }
            if (data.kind === 'player' && data.id === myId) {
                const dmgVal = Math.max(1, Math.round(Number(data.damage) || 0));
                floatingTexts.push({
                    playerId: myId,
                    x: ME.x + ME.width / 2,
                    y: ME.y,
                    xOff: (Math.random() - 0.5) * 18,
                    text: `-${dmgVal}`,
                    color: '#ff3030',
                    age: 0,
                    life: 1.3
                });
                if (ME.faction === 'goodbot') {
                    enemyAggroUntil.set(`${data.attackerKind}:${data.attackerId}`, performance.now() + 8000);
                }
            }
            return;
        }

        if (data.type === 'explosion') {
            playSpatialSound('explosion', data.x, data.y);
            spawnExplosionParticles(data.x, data.y);
            return;
        }

        if (data.type === 'scrap_gain' && Array.isArray(data.gains)) {
            for (let i = 0; i < data.gains.length; i++) {
                const g = data.gains[i];
                floatingTexts.push({
                    playerId: g.id,
                    x: Number(g.x) || 0,
                    y: Number(g.y) || 0,
                    text: `+${Math.max(1, Math.floor(Number(g.amount) || 0))}`,
                    color: '#ffe100',
                    age: 0,
                    life: 1.3
                });
            }
            return;
        }

        if (data.type === 'round_heal' && Array.isArray(data.heals)) {
            for (let i = 0; i < data.heals.length; i++) {
                const h = data.heals[i];
                const hpGain = Math.max(0, Math.floor(Number(h.hpGain) || 0));
                const energyGain = Math.max(0, Math.floor(Number(h.energyGain) || 0));
                const hx = Number(h.x) || 0;
                const hy = Number(h.y) || 0;
                if (hpGain > 0) {
                    pendingFloatingTexts.push({
                        playerId: h.id,
                        x: hx,
                        y: hy,
                        text: `+${hpGain}`,
                        color: '#32ff32',
                        life: 1.3
                    });
                }
                if (energyGain > 0) {
                    pendingFloatingTexts.push({
                        playerId: h.id,
                        x: hx,
                        y: hy,
                        text: `+${energyGain}`,
                        color: '#d1ab38',
                        life: 1.3
                    });
                }
            }
            return;
        }

        if (data.type === 'state') {
            stateSeq++;
            lbBuf.length = 0;
            for (const id in data.players) {
                const incoming = data.players[id];
                const numId = parseInt(id, 10);
                const pScraps = Math.max(0, Math.floor(incoming.scraps ?? 0));
                const pFaction = incoming.faction || 'goodbot';
                lbBuf.push({ id: numId, name: incoming.name, scraps: pScraps, faction: pFaction });
                if (numId === myId) {
                    ME.serverX = incoming.x;
                    ME.serverY = incoming.y;
                    ME.vx = incoming.vx;
                    ME.vy = incoming.vy;
                    ME.scale = incoming.scale ?? 1;
                    if (incoming.faction !== undefined && incoming.faction !== ME.faction) {
                        ME.faction = incoming.faction;
                        enemyAggroUntil.clear();
                    }
                    if (incoming.maxHealth !== undefined) ME.maxHealth = Math.max(1, incoming.maxHealth);
                    if (incoming.maxEnergy !== undefined) ME.maxEnergy = Math.max(1, incoming.maxEnergy);
                    if (incoming.health !== undefined) ME.health = Math.max(0, Math.min(ME.maxHealth, incoming.health));
                    if (incoming.energy !== undefined) ME.energy = Math.max(0, Math.min(ME.maxEnergy, incoming.energy));
                    if (incoming.scraps !== undefined) ME.scraps = pScraps;
                    ME.chats = Array.isArray(incoming.chats) ? incoming.chats : [];
                    updateStatsUI();
                    continue;
                }
                const existing = serverPlayers[id];
                if (existing) {
                    const dx = incoming.x - existing.renderX;
                    const dy = incoming.y - existing.renderY;
                    const jumped = (dx * dx + dy * dy) > 14400;
                    existing.x = incoming.x;
                    existing.y = incoming.y;
                    existing.vx = incoming.vx;
                    existing.vy = incoming.vy;
                    existing.angle = incoming.angle;
                    existing.scale = incoming.scale ?? 1;
                    existing.width = incoming.width || 48;
                    existing.height = incoming.height || 48;
                    existing.name = incoming.name;
                    existing.faction = pFaction;
                    existing.health = incoming.health;
                    existing.maxHealth = incoming.maxHealth;
                    existing.energy = incoming.energy;
                    existing.maxEnergy = incoming.maxEnergy;
                    existing.scraps = pScraps;
                    const nextWeapon = incoming.weapon || 'hands';
                    if (existing.weapon !== nextWeapon && nextWeapon !== 'hands') {
                        equipAnims.set(`player:${id}`, performance.now());
                    }
                    existing.weapon = nextWeapon;
                    existing.chats = Array.isArray(incoming.chats) ? incoming.chats : emptyChats;
                    existing._seq = stateSeq;
                    if (jumped) {
                        existing.renderX = incoming.x;
                        existing.renderY = incoming.y;
                    }
                } else {
                    serverPlayers[id] = {
                        ...incoming,
                        weapon: incoming.weapon || 'hands',
                        width: incoming.width || 48,
                        height: incoming.height || 48,
                        chats: Array.isArray(incoming.chats) ? incoming.chats : emptyChats,
                        renderX: incoming.x,
                        renderY: incoming.y,
                        renderAngle: incoming.angle || 0,
                        _seq: stateSeq
                    };
                }
            }
            for (const id in serverPlayers) {
                if (serverPlayers[id]._seq !== stateSeq) {
                    delete serverPlayers[id];
                }
            }
            lbBuf.sort((a, b) => a.id - b.id);
            updateLeaderboard(lbBuf);

            if (data.enemies && typeof data.enemies === 'object') {
                for (const id in data.enemies) {
                    const incoming = data.enemies[id];
                    const existing = serverEnemies[id];
                    if (existing) {
                        const dx = incoming.x - existing.renderX;
                        const dy = incoming.y - existing.renderY;
                        const jumped = (dx * dx + dy * dy) > 14400;
                        existing.x = incoming.x;
                        existing.y = incoming.y;
                        existing.vx = incoming.vx;
                        existing.vy = incoming.vy;
                        existing.angle = incoming.angle;
                        existing.scale = incoming.scale ?? 1;
                        existing.width = incoming.width || 48;
                        existing.height = incoming.height || 48;
                        existing.kind = incoming.kind || 'rarebot';
                        existing.weapon = incoming.weapon || 'hands';
                        existing.health = incoming.health;
                        existing.maxHealth = incoming.maxHealth;
                        existing.energy = incoming.energy;
                        existing.maxEnergy = incoming.maxEnergy;
                        existing._seq = stateSeq;
                        if (jumped) {
                            existing.renderX = incoming.x;
                            existing.renderY = incoming.y;
                        }
                    } else {
                        serverEnemies[id] = {
                            ...incoming,
                            kind: incoming.kind || 'rarebot',
                            weapon: incoming.weapon || 'hands',
                            width: incoming.width || 48,
                            height: incoming.height || 48,
                            renderX: incoming.x,
                            renderY: incoming.y,
                            renderAngle: incoming.angle || 0,
                            _seq: stateSeq
                        };
                    }
                }
            }
            for (const id in serverEnemies) {
                if (serverEnemies[id]._seq !== stateSeq) {
                    delete serverEnemies[id];
                }
            }
            return;
        }

        if (data.type === 'player_left') {
            delete serverPlayers[data.id];
            enemyAggroUntil.delete(`player:${data.id}`);
        }
    };

    ws.onclose = () => {
        ws = null;
        if (hasConnected) {
            window.location.reload();
            return;
        }
        if (!inMainMenu) {
            setTimeout(() => {
                pendingJoinName = myName;
                connectToServer();
            }, 1000);
        }
    };
}

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    WORLD.SYSTEM.viewScale = Math.max(canvas.width / LOGICAL_WIDTH, canvas.height / LOGICAL_HEIGHT);
    WORLD.CAMERA.width = canvas.width / WORLD.SYSTEM.viewScale;
    WORLD.CAMERA.height = canvas.height / WORLD.SYSTEM.viewScale;
    ctx.imageSmoothingEnabled = false;
    labelSpriteCache.clear();
    scaledSpriteCache.clear();
}

window.addEventListener('resize', () => {
    resizeCanvas();
    updateUiScale();
});

if (window.visualViewport) {
    window.visualViewport.addEventListener('resize', updateUiScale);
}

function clearHeldInputs() {
    isAttackHeld = false;
    let changed = false;
    for (const k in WORLD.INPUTS.keys) {
        if (WORLD.INPUTS.keys[k]) {
            WORLD.INPUTS.keys[k] = false;
            changed = true;
        }
    }
    if (changed) sendInput(true);
}

function openChat() {
    if (!chatInput) return;
    if (isChatMinimized) setChatMinimized(false);
    clearHeldInputs();
    chatInput.focus();
}

function closeChat() {
    if (!chatInput) return;
    chatInput.value = '';
    chatInput.blur();
}

window.addEventListener('keydown', e => {
    if (isLeaveDialogOpen) {
        if (e.key === 'Escape') {
            e.preventDefault();
            closeLeaveDialog();
        }
        return;
    }
    if (isSettingsOpen) {
        if (e.key === 'Escape') {
            e.preventDefault();
            closeSettings();
        }
        return;
    }
    if (isShopOpen) {
        if (e.key === 'Escape' || e.key.toLowerCase() === 'b') {
            e.preventDefault();
            closeShop();
        }
        return;
    }
    if (e.key === 'Enter') {
        if (inMainMenu) {
            if (playBtn) playBtn.click();
            return;
        }
        if (myId !== null && chatInput) {
            e.preventDefault();
            if (document.activeElement === chatInput) {
                const text = chatInput.value.trim().slice(0, 80);
                if (text && ws && ws.readyState === WebSocket.OPEN) {
                    ws.send(JSON.stringify({ type: 'chat', text }));
                }
                closeChat();
            } else {
                openChat();
            }
            return;
        }
    }
    if (e.key === 'Escape' && document.activeElement === chatInput) {
        e.preventDefault();
        closeChat();
        return;
    }
    if (document.activeElement && (document.activeElement.tagName === 'INPUT' || document.activeElement.tagName === 'TEXTAREA')) return;
    if (e.key.toLowerCase() === 'b' && !inMainMenu) {
        e.preventDefault();
        openShop();
        return;
    }
    if (e.key >= '1' && e.key <= '5' && !inMainMenu) {
        selectSlot(Number(e.key) - 1);
        return;
    }
    const key = e.key.toLowerCase();
    if (Object.prototype.hasOwnProperty.call(WORLD.INPUTS.keys, key)) {
        if (!WORLD.INPUTS.keys[key]) {
            WORLD.INPUTS.keys[key] = true;
            sendInput(true);
        }
    }
});

window.addEventListener('keyup', e => {
    const key = e.key.toLowerCase();
    if (Object.prototype.hasOwnProperty.call(WORLD.INPUTS.keys, key)) {
        if (WORLD.INPUTS.keys[key]) {
            WORLD.INPUTS.keys[key] = false;
            sendInput(true);
        }
    }
});

window.addEventListener('mousemove', e => {
    WORLD.INPUTS.mouseX = e.clientX;
    WORLD.INPUTS.mouseY = e.clientY;
});

window.addEventListener('blur', () => {
    clearHeldInputs();
    if (document.activeElement === chatInput) {
        closeChat();
    }
});

function triggerAttack() {
    ensureAudioContext();
    if (inMainMenu || myId === null || isSettingsOpen || isLeaveDialogOpen || isShopOpen) return;
    if (ME.faction === 'spectator') return;
    if (!ws || ws.readyState !== WebSocket.OPEN) return;

    const equippedWeapon = getMyEquippedWeapon();
    const isPistol = equippedWeapon === 'goodbot-pistol';
    const cooldown = isPistol ? 408 : (ME.faction === 'rarebot' ? 508 : 428);
    const nowMs = performance.now();
    if (nowMs - lastAttackSentAt < cooldown) return;
    lastAttackSentAt = nowMs;

    if (isPistol) {
        lastLocalShotAt = nowMs;
        recoilAnims.set(`player:${myId}`, nowMs);
        playSpatialSound('laserShot', ME.x + ME.width / 2, ME.y + ME.height / 2);
        ws.send(JSON.stringify({ type: 'attack', angle: ME.angle }));
    } else {
        swingAnims.set(`player:${myId}`, nowMs);
        playSpatialSound('swing', ME.x + ME.width / 2, ME.y + ME.height / 2);
        ws.send(JSON.stringify({ type: 'attack', angle: ME.angle }));
    }
}

window.addEventListener('mousedown', (e) => {
    ensureAudioContext();
    if (e.button !== 0) return;
    if (inMainMenu || myId === null || isSettingsOpen || isLeaveDialogOpen || isShopOpen) return;
    if (document.activeElement === chatInput) return;
    if (e.target !== canvas) return;
    isAttackHeld = true;
    triggerAttack();
});

window.addEventListener('mouseup', (e) => {
    if (e.button === 0) {
        isAttackHeld = false;
    }
});

window.addEventListener('keydown', () => {
    ensureAudioContext();
}, { passive: true });

window.addEventListener('DOMContentLoaded', () => {
    const savedName = localStorage.getItem('playerName');
    if (savedName && nameInput) nameInput.value = savedName;

    detectTouchCapability();
    fetchDeviceMode();
    loadSettings();
    applySettingsToUI();
    startFpsCounter();

    resizeCanvas();
    updateUiScale();
    loadAssets();
    fetchInitialServerStatus();
    connectToServer();

    window.addEventListener('touchstart', () => {
        ensureAudioContext();
        enableTouchMode();
    }, { passive: true });

    if (mobileJoystick) {
        mobileJoystick.addEventListener('touchstart', (e) => {
            if (inMainMenu || isSettingsOpen || isLeaveDialogOpen) return;
            e.preventDefault();
            if (joystickTouchId !== null) return;
            const touch = e.changedTouches[0];
            if (!touch) return;
            joystickTouchId = touch.identifier;
            updateJoystickFromPoint(touch.clientX, touch.clientY);
        }, { passive: false });

        mobileJoystick.addEventListener('touchmove', (e) => {
            if (joystickTouchId === null) return;
            e.preventDefault();
            for (let i = 0; i < e.changedTouches.length; i++) {
                const t = e.changedTouches[i];
                if (t.identifier === joystickTouchId) {
                    updateJoystickFromPoint(t.clientX, t.clientY);
                    break;
                }
            }
        }, { passive: false });

        const endJoystick = (e) => {
            if (joystickTouchId === null) return;
            for (let i = 0; i < e.changedTouches.length; i++) {
                if (e.changedTouches[i].identifier === joystickTouchId) {
                    resetJoystick();
                    break;
                }
            }
        };
        mobileJoystick.addEventListener('touchend', endJoystick, { passive: true });
        mobileJoystick.addEventListener('touchcancel', endJoystick, { passive: true });
    }

    if (mobileAttackBtn) {
        mobileAttackBtn.addEventListener('touchstart', (e) => {
            e.preventDefault();
            isAttackHeld = true;
            triggerAttack();
        }, { passive: false });
        mobileAttackBtn.addEventListener('touchend', (e) => {
            e.preventDefault();
            isAttackHeld = false;
        }, { passive: false });
        mobileAttackBtn.addEventListener('touchcancel', () => {
            isAttackHeld = false;
        }, { passive: true });
        mobileAttackBtn.addEventListener('mousedown', (e) => {
            if (e.button !== 0) return;
            e.preventDefault();
            isAttackHeld = true;
            triggerAttack();
        });
    }

    if (mobileSprintBtn) {
        mobileSprintBtn.addEventListener('touchstart', (e) => {
            e.preventDefault();
            setMobileSprint(true);
        }, { passive: false });
        mobileSprintBtn.addEventListener('touchend', (e) => {
            e.preventDefault();
            setMobileSprint(false);
        }, { passive: false });
        mobileSprintBtn.addEventListener('touchcancel', () => {
            setMobileSprint(false);
        }, { passive: true });
    }

    canvas.addEventListener('touchstart', (e) => {
        if (inMainMenu || isSettingsOpen || isLeaveDialogOpen) return;
        if (aimTouchId === null && e.changedTouches[0]) {
            aimTouchId = e.changedTouches[0].identifier;
            WORLD.INPUTS.mouseX = e.changedTouches[0].clientX;
            WORLD.INPUTS.mouseY = e.changedTouches[0].clientY;
        }
    }, { passive: true });

    canvas.addEventListener('touchmove', (e) => {
        if (aimTouchId === null) return;
        for (let i = 0; i < e.changedTouches.length; i++) {
            const t = e.changedTouches[i];
            if (t.identifier === aimTouchId) {
                WORLD.INPUTS.mouseX = t.clientX;
                WORLD.INPUTS.mouseY = t.clientY;
                break;
            }
        }
    }, { passive: true });

    const endAimTouch = (e) => {
        if (aimTouchId === null) return;
        for (let i = 0; i < e.changedTouches.length; i++) {
            if (e.changedTouches[i].identifier === aimTouchId) {
                aimTouchId = null;
                break;
            }
        }
    };
    canvas.addEventListener('touchend', endAimTouch, { passive: true });
    canvas.addEventListener('touchcancel', endAimTouch, { passive: true });

    if (settingsBtn) {
        settingsBtn.addEventListener('click', () => {
            openSettings();
        });
    }

    if (leaveBtn) {
        leaveBtn.addEventListener('click', () => {
            openLeaveDialog();
        });
    }

    if (leaveNoBtn) {
        leaveNoBtn.addEventListener('click', () => {
            closeLeaveDialog();
        });
    }

    if (leaveYesBtn) {
        leaveYesBtn.addEventListener('click', () => {
            if (ws && ws.readyState === WebSocket.OPEN) {
                ws.send(JSON.stringify({ type: 'leave' }));
            }
            returnToMainMenu();
        });
    }

    if (leaveOverlay) {
        leaveOverlay.addEventListener('click', (e) => {
            if (e.target === leaveOverlay) {
                closeLeaveDialog();
            }
        });
    }

    if (settingsCloseBtn) {
        settingsCloseBtn.addEventListener('click', () => {
            closeSettings();
        });
    }

    if (settingsOverlay) {
        settingsOverlay.addEventListener('click', (e) => {
            if (e.target === settingsOverlay) {
                closeSettings();
            }
        });
    }

    if (settingShowPing) {
        settingShowPing.addEventListener('change', () => {
            SETTINGS.showPing = settingShowPing.checked;
            saveSettings();
            applySettingsToUI();
        });
    }

    if (settingShowFps) {
        settingShowFps.addEventListener('change', () => {
            SETTINGS.showFps = settingShowFps.checked;
            saveSettings();
            applySettingsToUI();
        });
    }

    for (let i = 0; i < uiSizeButtons.length; i++) {
        uiSizeButtons[i].addEventListener('click', () => {
            const nextSize = uiSizeButtons[i].dataset.uiSize;
            if (nextSize === 'low' || nextSize === 'normal' || nextSize === 'big') {
                SETTINGS.uiSize = nextSize;
                saveSettings();
                applySettingsToUI();
            }
        });
    }

    if (settingMusicVolume) {
        settingMusicVolume.addEventListener('input', () => {
            SETTINGS.musicVolume = Number(settingMusicVolume.value);
            saveSettings();
            applySettingsToUI();
        });
    }

    if (settingSoundVolume) {
        settingSoundVolume.addEventListener('input', () => {
            SETTINGS.soundVolume = Number(settingSoundVolume.value);
            saveSettings();
            applySettingsToUI();
        });
    }

    if (shopBtn) {
        shopBtn.addEventListener('click', () => {
            if (isShopOpen) closeShop();
            else openShop();
        });
    }

    if (shopCloseBtn) {
        shopCloseBtn.addEventListener('click', () => {
            closeShop();
        });
    }

    if (shopOverlay) {
        shopOverlay.addEventListener('click', (e) => {
            if (e.target === shopOverlay) {
                closeShop();
            }
        });
    }

    renderShopItems();

    if (chatToggleBtn) {
        chatToggleBtn.addEventListener('click', () => {
            setChatMinimized(!isChatMinimized);
        });
    }

    if (chatInput) {
        chatInput.addEventListener('focus', () => {
            clearHeldInputs();
        });
    }

    if (chatLog) {
        chatLog.addEventListener('selectstart', e => e.preventDefault());
        chatLog.addEventListener('copy', e => e.preventDefault());
        chatLog.addEventListener('cut', e => e.preventDefault());
    }

    for (let i = 0; i < inventorySlots.length; i++) {
        inventorySlots[i].addEventListener('pointerenter', () => {
            if (dragState || isShopOpen) return;
            const itemId = myInventory[i];
            const itemDef = itemId ? ITEM_BY_ID[itemId] : null;
            if (itemDef) {
                showShopTooltip(itemDef, inventorySlots[i], false, true);
            }
        });
        inventorySlots[i].addEventListener('pointerleave', () => {
            if (!isShopOpen) {
                hideShopTooltip();
            }
        });
        inventorySlots[i].addEventListener('pointerdown', (e) => {
            if (e.pointerType === 'mouse' && e.button !== 0) return;
            if (!isShopOpen) {
                hideShopTooltip();
            }
            const itemId = myInventory[i];
            if (!itemId) {
                selectSlot(i);
                return;
            }
            e.preventDefault();
            dragState = {
                fromSlot: i,
                itemId,
                pointerId: e.pointerId,
                startX: e.clientX,
                startY: e.clientY,
                active: false,
                ghostEl: null,
                overSlot: -1
            };
        });
    }

    const cleanupInventoryDrag = () => {
        for (let j = 0; j < inventorySlots.length; j++) {
            inventorySlots[j].classList.remove('dragging-source');
            inventorySlots[j].classList.remove('drag-over');
        }
        if (dragState && dragState.ghostEl && dragState.ghostEl.parentNode) {
            dragState.ghostEl.parentNode.removeChild(dragState.ghostEl);
        }
        dragState = null;
    };

    window.addEventListener('pointermove', (e) => {
        if (!dragState || e.pointerId !== dragState.pointerId) return;
        const dist = Math.hypot(e.clientX - dragState.startX, e.clientY - dragState.startY);
        if (!dragState.active && dist > 5) {
            dragState.active = true;
            const srcSlot = inventorySlots[dragState.fromSlot];
            if (srcSlot) srcSlot.classList.add('dragging-source');
            const imgSrc = ITEM_SLOT_IMAGES[dragState.itemId];
            if (imgSrc) {
                const ghost = document.createElement('img');
                ghost.className = 'inventory-drag-ghost';
                ghost.src = imgSrc;
                ghost.alt = dragState.itemId;
                const rect = srcSlot ? srcSlot.getBoundingClientRect() : null;
                const w = rect ? Math.max(24, rect.width - 10) : 48;
                const h = rect ? Math.max(24, rect.height - 10) : 48;
                ghost.style.width = `${Math.round(w)}px`;
                ghost.style.height = `${Math.round(h)}px`;
                document.body.appendChild(ghost);
                dragState.ghostEl = ghost;
            }
        }
        if (!dragState.active) return;
        if (dragState.ghostEl) {
            dragState.ghostEl.style.left = `${e.clientX}px`;
            dragState.ghostEl.style.top = `${e.clientY}px`;
        }
        let hitSlot = -1;
        for (let j = 0; j < inventorySlots.length; j++) {
            const rect = inventorySlots[j].getBoundingClientRect();
            const isInside = e.clientX >= rect.left && e.clientX <= rect.right && e.clientY >= rect.top && e.clientY <= rect.bottom;
            inventorySlots[j].classList.toggle('drag-over', isInside && j !== dragState.fromSlot);
            if (isInside) hitSlot = j;
        }
        dragState.overSlot = hitSlot;
    });

    const finishInventoryDrag = (e) => {
        if (!dragState || e.pointerId !== dragState.pointerId) return;
        const fromSlot = dragState.fromSlot;
        const toSlot = dragState.overSlot;
        const wasActive = dragState.active;
        cleanupInventoryDrag();
        if (!wasActive) {
            selectSlot(fromSlot);
            return;
        }
        if (toSlot !== -1 && toSlot !== fromSlot) {
            const tmp = myInventory[toSlot];
            myInventory[toSlot] = myInventory[fromSlot];
            myInventory[fromSlot] = tmp;
            if (activeSlot === fromSlot) {
                activeSlot = toSlot;
            } else if (activeSlot === toSlot) {
                activeSlot = fromSlot;
            }
            renderInventorySlots();
            selectSlot(activeSlot, false);
            if (ws && ws.readyState === WebSocket.OPEN && myId !== null) {
                ws.send(JSON.stringify({ type: 'move_slot', fromSlot, toSlot }));
            }
        }
    };

    window.addEventListener('pointerup', finishInventoryDrag);
    window.addEventListener('pointercancel', (e) => {
        if (!dragState || e.pointerId !== dragState.pointerId) return;
        cleanupInventoryDrag();
    });

    if (gameStartBtn) {
        gameStartBtn.addEventListener('click', () => {
            if (inMainMenu || myId === null) return;
            if (ws && ws.readyState === WebSocket.OPEN) {
                ws.send(JSON.stringify({ type: 'start_vote' }));
            }
        });
    }

    if (leaderboardHeader && leaderboardList) {
        leaderboardHeader.addEventListener('click', () => {
            leaderboardList.classList.toggle('hidden');
        });
    }

    if (playBtn) {
        playBtn.addEventListener('click', () => {
            if (!inMainMenu || isJoining) return;
            setMenuError('');

            if (serverPlayerCount >= serverMaxPlayers) {
                setMenuError(`Server is full (${serverPlayerCount}/${serverMaxPlayers})`);
                return;
            }

            const raw = nameInput ? nameInput.value.trim() : '';
            myName = raw || ('Goodbot' + (Math.floor(Math.random() * 900) + 100));
            localStorage.setItem('playerName', myName);
            isJoining = true;

            if (ws && ws.readyState === WebSocket.OPEN) {
                ws.send(JSON.stringify({ type: 'join', name: myName, sessionToken }));
            } else {
                pendingJoinName = myName;
                connectToServer();
            }
        });
    }
});
