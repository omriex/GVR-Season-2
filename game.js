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
const bossBarsContainer = document.getElementById('boss-bars-container');
const bossBarSlots = Array.from(document.querySelectorAll('#boss-bars-container .boss-health-bar')).map((el) => ({
    el,
    title: el.querySelector('.boss-bar-title'),
    fill: el.querySelector('.boss-bar-fill'),
    value: el.querySelector('.boss-bar-value')
}));
const goodbotsCount = document.getElementById('goodbots-count');
const rarebotsCount = document.getElementById('rarebots-count');
const waveCount = document.getElementById('wave-count');
const leaderboardHeader = document.getElementById('leaderboard-header');
const leaderboardTabs = document.getElementById('leaderboard-tabs');
const leaderboardTabMatchBtn = document.getElementById('leaderboard-tab-match');
const leaderboardTabWavesBtn = document.getElementById('leaderboard-tab-waves');
const leaderboardList = document.getElementById('leaderboard-list');
const chatLog = document.getElementById('chat-log');
const chatForm = document.getElementById('chat-form');
const chatInput = document.getElementById('chat-input');
const chatSendBtn = document.getElementById('chat-send-btn');
const chatWrapper = document.getElementById('chat-wrapper');
const chatToggleBtn = document.getElementById('chat-toggle-btn');
const shopBtn = document.getElementById('shop-btn');
const minimapWrapper = document.getElementById('minimap-wrapper');
const minimapToggleBtn = document.getElementById('minimap-toggle-btn');
const minimapCanvas = document.getElementById('minimap-canvas');
const mapOverlay = document.getElementById('map-overlay');
const expandedMapCanvas = document.getElementById('expanded-map-canvas');
const perfStats = document.getElementById('perf-stats');
const fpsCounter = document.getElementById('fps-counter');
const pingCounter = document.getElementById('ping-counter');
const settingsBtn = document.getElementById('settings-btn');
const leaveBtn = document.getElementById('leave-btn');
const spectateBtn = document.getElementById('spectate-btn');
const settingsOverlay = document.getElementById('settings-overlay');
const settingsCloseBtn = document.getElementById('settings-close-btn');
const settingShowPing = document.getElementById('setting-show-ping');
const settingShowFps = document.getElementById('setting-show-fps');
const settingShowHitboxes = document.getElementById('setting-show-hitboxes');
const settingGeneralHitbox = document.getElementById('setting-general-hitbox');
const settingCameraShake = document.getElementById('setting-camera-shake');
const uiSizeButtons = document.querySelectorAll('.ui-size-btn');
const settingMusicVolume = document.getElementById('setting-music-volume');
const settingSoundVolume = document.getElementById('setting-sound-volume');
const musicVolumeValue = document.getElementById('music-volume-value');
const soundVolumeValue = document.getElementById('sound-volume-value');
const leaveOverlay = document.getElementById('leave-overlay');
const leaveYesBtn = document.getElementById('leave-yes-btn');
const leaveNoBtn = document.getElementById('leave-no-btn');
const spectateOverlay = document.getElementById('spectate-overlay');
const spectateYesBtn = document.getElementById('spectate-yes-btn');
const spectateNoBtn = document.getElementById('spectate-no-btn');
const shopOverlay = document.getElementById('shop-overlay');
const shopCloseBtn = document.getElementById('shop-close-btn');
const shopTabItemsBtn = document.getElementById('shop-tab-items');
const shopTabUnitsBtn = document.getElementById('shop-tab-units');
const shopUnitsStatus = document.getElementById('shop-units-status');
const shopGrid = document.getElementById('shop-grid');
const shopTooltip = document.getElementById('shop-tooltip');
const shopTooltipTitle = document.getElementById('shop-tooltip-title');
const shopTooltipType = document.getElementById('shop-tooltip-type');
const shopTooltipCost = document.getElementById('shop-tooltip-cost');
const shopTooltipDesc = document.getElementById('shop-tooltip-desc');
const shopTooltipStats = document.getElementById('shop-tooltip-stats');
const mobileJoystick = document.getElementById('mobile-joystick');
const mobileJoystickThumb = document.getElementById('mobile-joystick-thumb');
const mobileAttackBtn = document.getElementById('mobile-attack-btn');
const mobileSprintBtn = document.getElementById('mobile-sprint-btn');
const mobileAbilityBtn = document.getElementById('mobile-ability-btn');
const inventoryLayer = document.getElementById('inventory-layer');
const inventorySlots = document.querySelectorAll('#inventory-layer .slot');
const abilitySlot = document.getElementById('ability-slot');
const armorSlot = document.getElementById('armor-slot');
const adminModBtn = document.getElementById('admin-mod-btn');
const adminPanelBtn = document.getElementById('admin-panel-btn');
const tokenInput = document.getElementById('token-input');
const adminModOverlay = document.getElementById('admin-mod-overlay');
const adminModCloseBtn = document.getElementById('admin-mod-close-btn');
const adminModReasonInput = document.getElementById('admin-mod-reason-input');
const adminModPlayerList = document.getElementById('admin-mod-player-list');
const adminModBanSection = document.getElementById('admin-mod-ban-section');
const adminModBanList = document.getElementById('admin-mod-ban-list');
const adminPanelOverlay = document.getElementById('admin-panel-overlay');
const adminPanelCloseBtn = document.getElementById('admin-panel-close-btn');
const adminSpawnGrid = document.getElementById('admin-spawn-grid');
const adminSpawnFactionMenu = document.getElementById('admin-spawn-faction-menu');
const adminSpawnFactionTitle = document.getElementById('admin-spawn-faction-title');
const adminSpawnFactionButtons = document.querySelectorAll('#admin-spawn-faction-menu .admin-spawn-faction-btn');
const adminReviveBtn = document.getElementById('admin-revive-btn');
const adminSkipWaveBtn = document.getElementById('admin-skip-wave-btn');
const adminRestartGameBtn = document.getElementById('admin-restart-game-btn');
const waveLeaderboardBtn = document.getElementById('wave-leaderboard-btn');
const waveLeaderboardOverlay = document.getElementById('wave-leaderboard-overlay');
const waveLeaderboardCloseBtn = document.getElementById('wave-leaderboard-close-btn');
const waveLeaderboardRows = document.getElementById('wave-leaderboard-rows');

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
        fgChunkBounds: [],
        fullMapCanvas: null
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
    armor: null,
    sprinting: false,
    chats: []
};

let ws = null;
let myId = null;
let myName = '';
let inMainMenu = true;
let serverPlayers = {};
let serverEnemies = {};
let serverAllies = {};
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
let myAbility = null;
let abilityReadyAt = 0;
let lastLocalAbilityAt = 0;
let lastRenderedAbilityCooldownSec = -1;
let lastAttackSentAt = 0;
let lastBeamerHoldSentAt = 0;
let lastLocalShotAt = 0;
let isAttackHeld = false;
let isBeamerActive = false;
let dragState = null;
let lastEquippedItemKey = null;

const swingAnims = new Map();
const recoilAnims = new Map();
const leftRecoilAnims = new Map();
const equipAnims = new Map();
const leftPunchAnims = new Map();
const sprintAnims = new Map();
let sprintAnimSeq = 0;
let meLocalExhausted = false;
const sprintDustParticles = [];
const MAX_SPRINT_DUST_PARTICLES = 120;
const enemyAggroUntil = new Map();
const enemyAlertBadges = new Map();
const alertCommWaves = [];
const dropslideEmitters = [];
const dropslideParticles = [];
const serverProjectiles = new Map();
let serverGrenades = [];
const serverRockets = new Map();
const mapbotExplosions = [];
const grenadeShockwaves = [];
const raycastBeams = [];
const explosions = [];
const hitPointMarkers = [];
const activeDamageHitboxes = [];
const floatingTexts = [];
const pendingFloatingTexts = [];
const healParticles = [];
const MAX_HEAL_PARTICLES = 160;
const MAX_EXPLOSION_PARTICLES = 240;
const GRENADE_DRAW_SIZE = 17.68;
const EXPLOSION_COLORS = ['#ff2a00', '#ff7b00', '#ffd000', '#ff4d00'];
const GRENADE_EXPLOSION_COLORS = ['#d84aff', '#b833ff', '#9400e6', '#f0aaff'];
const RAREBOT_GRENADE_EXPLOSION_COLORS = ['#ff2a2a', '#ff5238', '#d9001b', '#ff998a'];
const GOODBOT_BULLET_EXPLOSION_COLORS = ['#d84aff', '#a800ff', '#f0aaff', '#ffffff'];
const RAREBOT_BULLET_EXPLOSION_COLORS = ['#ff2a00', '#ff5e3a', '#ff9900', '#ffffff'];

let camShakeTrauma = 0;
let camShakeOffsetX = 0;
let camShakeOffsetY = 0;

function addCameraShake(amount, wx, wy) {
    if (!SETTINGS.cameraShake) return;
    let distMult = 1;
    if (typeof wx === 'number' && typeof wy === 'number') {
        const lx = myId !== null ? (ME.x + ME.width / 2) : ((WORLD.CAMERA.x || 0) + WORLD.CAMERA.width / 2);
        const ly = myId !== null ? (ME.y + ME.height / 2) : ((WORLD.CAMERA.y || 0) + WORLD.CAMERA.height / 2);
        const dist = Math.hypot(wx - lx, wy - ly);
        if (dist > 1100) return;
        distMult = Math.max(0, 1 - Math.max(0, dist - 140) / 960);
    }
    const boost = Math.max(0, Number(amount) || 0) * distMult;
    if (boost > 0.005) {
        camShakeTrauma = Math.min(1, camShakeTrauma + boost);
    }
}

let crosshairGap = 9;
let hasMouseMoved = false;

let menuCamX = null;
let menuCamY = null;
let menuCamVX = 60;
let menuCamVY = 45;

let lastInputKeySig = '';
let lastSentAngle = 0;
let lastInputSendTime = 0;

let isSettingsOpen = false;
let isWaveLeaderboardOpen = false;
let isLeaveDialogOpen = false;
let isSpectateDialogOpen = false;
let isShopOpen = false;
let isModDialogOpen = false;
let isAdminPanelOpen = false;
let adminSpawnFactionTarget = null;
let isChatMinimized = false;
let isMinimapMinimized = false;
let isMapExpanded = false;
let activeLeaderboardTab = 'match';
let waveLeaderboardEntries = [];
let lastMatchLeaderboardEntries = [];
let lastGameStateData = null;
let isJoining = false;
let isAdmin = false;
let isChatMuted = false;
let suppressReloadDisconnect = false;
let lastSubmittedAdminToken = '';
let adminModState = { players: [], bannedIps: [] };
let lastHoveredShopItem = null;
let lastHoveredShopSlot = null;
let lastHoveredShowCost = true;
let lastHoveredPreferAbove = false;
let activeShopTab = 'items';
let currentAllyCount = 0;
let maxAlliesCount = 8;
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

function syncSpectateButtonVisibility() {
    if (spectateBtn) {
        spectateBtn.classList.toggle('visible', !inMainMenu && ME.faction !== 'spectator');
    }
}

function enterGameUI() {
    if (leaveBtn) leaveBtn.classList.add('visible');
    syncSpectateButtonVisibility();
    if (adminModBtn) adminModBtn.classList.toggle('visible', isAdmin);
    if (adminPanelBtn) adminPanelBtn.classList.toggle('visible', isAdmin);
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
    serverAllies = {};
    swingAnims.clear();
    recoilAnims.clear();
    leftRecoilAnims.clear();
    equipAnims.clear();
    leftPunchAnims.clear();
    sprintAnims.clear();
    meLocalExhausted = false;
    ME.sprinting = false;
    enemyAggroUntil.clear();
    enemyAlertBadges.clear();
    alertCommWaves.length = 0;
    dropslideEmitters.length = 0;
    dropslideParticles.length = 0;
    sprintDustParticles.length = 0;
    serverProjectiles.clear();
    serverGrenades = [];
    serverRockets.clear();
    mapbotExplosions.length = 0;
    grenadeShockwaves.length = 0;
    raycastBeams.length = 0;
    myInventory = [null, null, null, null, null];
    myAbility = null;
    abilityReadyAt = 0;
    lastLocalAbilityAt = 0;
    lastRenderedAbilityCooldownSec = -1;
    activeSlot = 0;
    lastEquippedItemKey = null;
    renderInventorySlots();
    selectSlot(0, false);
    hideShopTooltip();
    explosions.length = 0;
    hitPointMarkers.length = 0;
    activeDamageHitboxes.length = 0;
    floatingTexts.length = 0;
    pendingFloatingTexts.length = 0;
    healParticles.length = 0;
    camShakeTrauma = 0;
    camShakeOffsetX = 0;
    camShakeOffsetY = 0;
    isChatMuted = false;
    setAdminStatus(false);
    setShopTab('items');
    syncCanvasCrosshairCursor();
    ME.health = 1000;
    ME.maxHealth = 1000;
    ME.energy = 255;
    ME.maxEnergy = 255;
    ME.scraps = 0;
    ME.faction = 'goodbot';
    ME.armor = null;
    ME.chats = [];
    if (bossBarsContainer) {
        bossBarsContainer.classList.add('hidden');
    }
    for (let i = 0; i < bossBarSlots.length; i++) {
        const slot = bossBarSlots[i];
        slot.el.classList.add('hidden');
        slot.el.classList.remove('rarebot-boss', 'ally-boss', 'mapbot-boss');
    }
    lastRenderedHealth = -1;
    lastRenderedEnergy = -1;
    lastRenderedMaxHealth = -1;
    lastRenderedMaxEnergy = -1;
    lastRenderedScraps = -1;
    lastLeaderboardSig = '';
    lastMatchLeaderboardEntries = [];
    lastGameStateData = null;
    resetJoystick();
    setMobileSprint(false);
    clearHeldInputs();
    closeChat();
    closeWaveLeaderboard();
    closeLeaveDialog();
    closeSpectateDialog();
    closeShop();
    closeModDialog();
    closeAdminSpawnFactionMenu();
    closeAdminPanel();
    setMapExpanded(false);
    applyGameStateUI({
        phase: 'waiting',
        goodbots: 0,
        rarebots: 0,
        allyCount: 0,
        maxAllies: 8,
        wave: 0,
        intermissionSeconds: 15,
        startVotes: 0,
        requiredVotes: 1,
        hasVoted: false
    });
    if (leaveBtn) leaveBtn.classList.remove('visible');
    syncSpectateButtonVisibility();
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
        if (inMainMenu && typeof data.regionError === 'string' && data.regionError) {
            setMenuError(data.regionError);
        }
    } catch (_) {}
}

function setWaveLeaderboardEntries(entries) {
    if (!Array.isArray(entries)) return;
    waveLeaderboardEntries = entries.map((e, idx) => ({
        rank: Math.max(1, Math.floor(Number(e && e.rank) || (idx + 1))),
        name: String((e && e.name) || 'Player'),
        highestWave: Math.max(1, Math.floor(Number(e && e.highestWave) || 1)),
        wavesCleared: Math.max(0, Math.floor(Number(e && e.wavesCleared) || 0)),
        bestScraps: Math.max(0, Math.floor(Number(e && e.bestScraps) || 0))
    }));
    if (isWaveLeaderboardOpen) {
        renderWaveLeaderboardDialog();
    }
    if (activeLeaderboardTab === 'waves' && !inMainMenu) {
        lastLeaderboardSig = '';
        updateLeaderboard(lastMatchLeaderboardEntries);
    }
}

async function fetchWaveLeaderboard() {
    if (!isNodeHostedOrigin()) return;
    try {
        const res = await fetch('/api/wave-leaderboard', { cache: 'no-store' });
        if (!res.ok) return;
        const data = await res.json();
        if (data && Array.isArray(data.entries)) {
            setWaveLeaderboardEntries(data.entries);
        }
    } catch (_) {}
}

function renderWaveLeaderboardDialog() {
    if (!waveLeaderboardRows) return;
    waveLeaderboardRows.textContent = '';
    if (waveLeaderboardEntries.length === 0) {
        const emptyEl = document.createElement('div');
        emptyEl.className = 'wave-lb-empty';
        emptyEl.textContent = 'No wave records yet';
        waveLeaderboardRows.appendChild(emptyEl);
        return;
    }
    for (let i = 0; i < waveLeaderboardEntries.length; i++) {
        const entry = waveLeaderboardEntries[i];
        const rowEl = document.createElement('div');
        rowEl.className = 'wave-lb-row';

        const leftEl = document.createElement('div');
        leftEl.className = 'wave-lb-left';

        const rankEl = document.createElement('span');
        let rankClass = '';
        if (entry.rank === 1) rankClass = ' rank-1';
        else if (entry.rank === 2) rankClass = ' rank-2';
        else if (entry.rank === 3) rankClass = ' rank-3';
        rankEl.className = 'wave-lb-rank' + rankClass;
        rankEl.textContent = `#${entry.rank}`;
        leftEl.appendChild(rankEl);

        const infoEl = document.createElement('div');
        infoEl.className = 'wave-lb-info';

        const nameEl = document.createElement('div');
        nameEl.className = 'wave-lb-name';
        nameEl.textContent = entry.name;
        infoEl.appendChild(nameEl);

        const metaEl = document.createElement('div');
        metaEl.className = 'wave-lb-meta';
        metaEl.textContent = `Cleared: ${entry.wavesCleared} | Best Scraps: ${entry.bestScraps}`;
        infoEl.appendChild(metaEl);

        leftEl.appendChild(infoEl);
        rowEl.appendChild(leftEl);

        const waveEl = document.createElement('span');
        waveEl.className = 'wave-lb-wave';
        waveEl.textContent = `Wave ${entry.highestWave}`;
        rowEl.appendChild(waveEl);

        waveLeaderboardRows.appendChild(rowEl);
    }
}

function openWaveLeaderboard() {
    if (!waveLeaderboardOverlay) return;
    if (isSettingsOpen) closeSettings();
    if (isLeaveDialogOpen) closeLeaveDialog();
    if (isSpectateDialogOpen) closeSpectateDialog();
    if (isShopOpen) closeShop();
    if (isModDialogOpen) closeModDialog();
    if (isAdminPanelOpen) closeAdminPanel();
    if (isMapExpanded) setMapExpanded(false);
    isWaveLeaderboardOpen = true;
    clearHeldInputs();
    if (document.activeElement === chatInput) {
        closeChat();
    }
    renderWaveLeaderboardDialog();
    fetchWaveLeaderboard();
    waveLeaderboardOverlay.classList.add('open');
    waveLeaderboardOverlay.setAttribute('aria-hidden', 'false');
    syncCanvasCrosshairCursor();
}

function closeWaveLeaderboard() {
    if (!waveLeaderboardOverlay) return;
    isWaveLeaderboardOpen = false;
    waveLeaderboardOverlay.classList.remove('open');
    waveLeaderboardOverlay.setAttribute('aria-hidden', 'true');
    syncCanvasCrosshairCursor();
}

function setLeaderboardTab(nextTab) {
    activeLeaderboardTab = nextTab === 'waves' ? 'waves' : 'match';
    if (leaderboardTabMatchBtn) {
        const isMatch = activeLeaderboardTab === 'match';
        leaderboardTabMatchBtn.classList.toggle('active', isMatch);
        leaderboardTabMatchBtn.setAttribute('aria-selected', isMatch ? 'true' : 'false');
    }
    if (leaderboardTabWavesBtn) {
        const isWaves = activeLeaderboardTab === 'waves';
        leaderboardTabWavesBtn.classList.toggle('active', isWaves);
        leaderboardTabWavesBtn.setAttribute('aria-selected', isWaves ? 'true' : 'false');
    }
    lastLeaderboardSig = '';
    if (!inMainMenu) {
        updateLeaderboard(lastMatchLeaderboardEntries);
    }
}

const SETTINGS = {
    showPing: true,
    showFps: true,
    showDamageHitboxes: false,
    generalHitbox: false,
    cameraShake: true,
    uiSize: 'low',
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
            if (typeof parsed.showDamageHitboxes === 'boolean') SETTINGS.showDamageHitboxes = parsed.showDamageHitboxes;
            if (typeof parsed.generalHitbox === 'boolean') SETTINGS.generalHitbox = parsed.generalHitbox;
            if (typeof parsed.cameraShake === 'boolean') SETTINGS.cameraShake = parsed.cameraShake;
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
    if (settingShowHitboxes) settingShowHitboxes.checked = SETTINGS.showDamageHitboxes;
    if (settingGeneralHitbox) settingGeneralHitbox.checked = SETTINGS.generalHitbox;
    if (settingCameraShake) settingCameraShake.checked = SETTINGS.cameraShake;
    if (!SETTINGS.showDamageHitboxes && !SETTINGS.generalHitbox) {
        activeDamageHitboxes.length = 0;
    }
    if (!SETTINGS.cameraShake) {
        camShakeTrauma = 0;
        camShakeOffsetX = 0;
        camShakeOffsetY = 0;
    }
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

function formatDisplayName(name, isAdminFlag) {
    const raw = String(name || '');
    return isAdminFlag ? ('\u2B50 ' + raw) : raw;
}

function setAdminStatus(nextAdmin) {
    isAdmin = Boolean(nextAdmin);
    if (adminModBtn) {
        adminModBtn.classList.toggle('visible', isAdmin && !inMainMenu);
    }
    if (adminPanelBtn) {
        adminPanelBtn.classList.toggle('visible', isAdmin && !inMainMenu);
    }
    if (tokenInput) {
        tokenInput.classList.toggle('applied', isAdmin);
        tokenInput.readOnly = isAdmin;
        if (isAdmin) {
            tokenInput.value = '';
        } else {
            tokenInput.value = '';
            lastSubmittedAdminToken = '';
        }
    }
    if (!isAdmin) {
        adminModState = { players: [], bannedIps: [] };
        closeModDialog();
        closeAdminPanel();
    }
    refreshAdminReviveButton();
    lastLeaderboardSig = '';
}

function submitAdminToken() {
    if (!tokenInput || inMainMenu || myId === null || isAdmin) return;
    const candidate = tokenInput.value.trim().slice(0, 64);
    if (!candidate || candidate === lastSubmittedAdminToken) return;
    lastSubmittedAdminToken = candidate;
    if (ws && ws.readyState === WebSocket.OPEN) {
        ws.send(JSON.stringify({ type: 'auth_admin', token: candidate }));
    }
}

function renderAdminModDialog() {
    if (!adminModPlayerList || !adminModBanList || !adminModBanSection) return;
    adminModPlayerList.textContent = '';
    const rows = Array.isArray(adminModState.players) ? adminModState.players : [];
    if (rows.length === 0) {
        const emptyEl = document.createElement('div');
        emptyEl.className = 'admin-mod-empty';
        emptyEl.textContent = 'No players online';
        adminModPlayerList.appendChild(emptyEl);
    } else {
        for (let i = 0; i < rows.length; i++) {
            const p = rows[i];
            const rowEl = document.createElement('div');
            rowEl.className = 'admin-mod-row';

            const nameEl = document.createElement('span');
            let fCls = '';
            if (p.faction === 'rarebot') fCls = ' rarebot';
            else if (p.faction === 'spectator') fCls = ' spectator';
            nameEl.className = 'admin-mod-name' + fCls;
            nameEl.textContent = formatDisplayName(p.name, Boolean(p.isAdmin));
            rowEl.appendChild(nameEl);

            if (p.isSelf) {
                const selfEl = document.createElement('span');
                selfEl.className = 'admin-mod-self';
                selfEl.textContent = '(You)';
                rowEl.appendChild(selfEl);
            } else {
                const actionsEl = document.createElement('div');
                actionsEl.className = 'admin-mod-actions';

                const kickBtn = document.createElement('button');
                kickBtn.type = 'button';
                kickBtn.className = 'admin-mod-action-btn kick';
                kickBtn.textContent = 'Kick';
                kickBtn.addEventListener('click', () => {
                    if (ws && ws.readyState === WebSocket.OPEN) {
                        const reason = adminModReasonInput ? adminModReasonInput.value.trim().slice(0, 100) : '';
                        ws.send(JSON.stringify({ type: 'admin_kick', targetId: p.id, reason }));
                        if (adminModReasonInput) adminModReasonInput.value = '';
                    }
                });

                const banBtn = document.createElement('button');
                banBtn.type = 'button';
                banBtn.className = 'admin-mod-action-btn ban';
                banBtn.textContent = 'Ban';
                banBtn.addEventListener('click', () => {
                    if (ws && ws.readyState === WebSocket.OPEN) {
                        const reason = adminModReasonInput ? adminModReasonInput.value.trim().slice(0, 100) : '';
                        ws.send(JSON.stringify({ type: 'admin_ban', targetId: p.id, reason }));
                        if (adminModReasonInput) adminModReasonInput.value = '';
                    }
                });

                const muteBtn = document.createElement('button');
                muteBtn.type = 'button';
                muteBtn.className = 'admin-mod-action-btn ' + (p.isMuted ? 'unmute' : 'mute');
                muteBtn.textContent = p.isMuted ? 'Unmute' : 'Mute';
                muteBtn.addEventListener('click', () => {
                    if (ws && ws.readyState === WebSocket.OPEN) {
                        ws.send(JSON.stringify({
                            type: p.isMuted ? 'admin_unmute' : 'admin_mute',
                            targetId: p.id
                        }));
                    }
                });

                actionsEl.appendChild(kickBtn);
                actionsEl.appendChild(banBtn);
                actionsEl.appendChild(muteBtn);
                rowEl.appendChild(actionsEl);
            }

            adminModPlayerList.appendChild(rowEl);
        }
    }

    const bans = Array.isArray(adminModState.bannedIps) ? adminModState.bannedIps : [];
    adminModBanSection.classList.toggle('visible', bans.length > 0);
    adminModBanList.textContent = '';
    for (let i = 0; i < bans.length; i++) {
        const b = bans[i];
        const rowEl = document.createElement('div');
        rowEl.className = 'admin-mod-row';

        const infoEl = document.createElement('div');
        infoEl.className = 'admin-mod-ban-info';

        const ipEl = document.createElement('span');
        ipEl.className = 'admin-mod-name ban-ip';
        ipEl.textContent = b.name ? `${b.ip} (${b.name})` : b.ip;
        infoEl.appendChild(ipEl);

        if (b.reason) {
            const reasonEl = document.createElement('span');
            reasonEl.className = 'admin-mod-ban-reason';
            reasonEl.textContent = `Reason: ${b.reason}`;
            infoEl.appendChild(reasonEl);
        }

        rowEl.appendChild(infoEl);

        const actionsEl = document.createElement('div');
        actionsEl.className = 'admin-mod-actions';
        const unbanBtn = document.createElement('button');
        unbanBtn.type = 'button';
        unbanBtn.className = 'admin-mod-action-btn unban';
        unbanBtn.textContent = 'Unban';
        unbanBtn.addEventListener('click', () => {
            if (ws && ws.readyState === WebSocket.OPEN) {
                ws.send(JSON.stringify({ type: 'admin_unban', ip: b.ip }));
            }
        });
        actionsEl.appendChild(unbanBtn);
        rowEl.appendChild(actionsEl);
        adminModBanList.appendChild(rowEl);
    }
}

function openModDialog() {
    if (!adminModOverlay || inMainMenu || !isAdmin) return;
    if (isSettingsOpen) closeSettings();
    if (isWaveLeaderboardOpen) closeWaveLeaderboard();
    if (isLeaveDialogOpen) closeLeaveDialog();
    if (isSpectateDialogOpen) closeSpectateDialog();
    if (isShopOpen) closeShop();
    if (isAdminPanelOpen) closeAdminPanel();
    if (isMapExpanded) setMapExpanded(false);
    isModDialogOpen = true;
    clearHeldInputs();
    if (document.activeElement === chatInput) {
        closeChat();
    }
    if (ws && ws.readyState === WebSocket.OPEN) {
        ws.send(JSON.stringify({ type: 'admin_request_mod_state' }));
    }
    renderAdminModDialog();
    adminModOverlay.classList.add('open');
    adminModOverlay.setAttribute('aria-hidden', 'false');
    syncCanvasCrosshairCursor();
}

function closeModDialog() {
    if (!adminModOverlay) return;
    isModDialogOpen = false;
    adminModOverlay.classList.remove('open');
    adminModOverlay.setAttribute('aria-hidden', 'true');
    syncCanvasCrosshairCursor();
}

const ADMIN_SPAWN_OPTIONS = [
    {
        id: 'rarebot',
        title: 'Rarebot',
        kindLabel: 'ENEMY',
        description: 'Basic melee Rarebot. Runs at you and hits up close.',
        bodyType: 'rarebot',
        weapon: 'hands',
        stats: [{ label: 'HP', value: '255' }, { label: 'Team', value: 'Rarebot' }]
    },
    {
        id: 'rarebot-pistol',
        title: 'Rarebot (Pistol)',
        kindLabel: 'ENEMY',
        description: 'Ranged Rarebot carrying a laser pistol.',
        bodyType: 'rarebot',
        weapon: 'pistol',
        stats: [{ label: 'HP', value: '255' }, { label: 'Weapon', value: 'Rarebot Pistol' }]
    },
    {
        id: 'rarebot2',
        title: 'Rarebot 2.0',
        kindLabel: 'ENEMY',
        description: 'Upgraded Rarebot with dual pistols and a fast dropslide dodge.',
        bodyType: 'rarebot',
        weapon: 'dual-pistol',
        stats: [{ label: 'HP', value: '475' }, { label: 'Weapon', value: 'Dual Rarebot Pistol' }]
    },
    {
        id: 'rarebot3',
        title: 'Rarebot 3.0',
        kindLabel: 'ENEMY',
        description: 'Armored elite Rarebot packing a rapid-fire Rarebot Assault Laser and dropslide.',
        bodyType: 'rarebot',
        armor: 'rarebot-armor',
        weapon: 'rarebot-assault-laser',
        stats: [{ label: 'HP', value: '600' }, { label: 'Armor', value: 'Rarebot Armor' }, { label: 'Weapon', value: 'Rarebot Assault Laser' }]
    },
    {
        id: 'rarebot-healer',
        title: 'Rarebot (Healer)',
        kindLabel: 'ENEMY',
        description: 'Medic Rarebot that shoots green heal bolts at hurt Rarebots and Dropships.',
        bodyType: 'rarebot',
        weapon: 'healer-gun',
        stats: [{ label: 'HP', value: '255' }, { label: 'Heal', value: '60 / Shot' }, { label: 'Team', value: 'Rarebot' }]
    },
    {
        id: 'rarebot-grenadier',
        title: 'Rarebot Grenadier',
        kindLabel: 'ENEMY',
        description: 'Tactical Rarebot that hides behind cover or allies while loading a red grenade, and rarely throws fast ugly punches up close.',
        bodyType: 'rarebot',
        weapon: 'rarebot-grenade',
        stats: [{ label: 'HP', value: '320' }, { label: 'Grenade', value: '150 Split AoE (5s)' }, { label: 'Melee', value: '80 Punch' }]
    },
    {
        id: 'rarebot-scout',
        title: 'Scout Rarebot',
        kindLabel: 'ENEMY',
        description: 'Fast melee Rarebot equipped with a dropslide dodge and quick melee strikes.',
        bodyType: 'scout',
        weapon: 'hands',
        stats: [{ label: 'HP', value: '300' }, { label: 'Melee', value: '55 Damage' }, { label: 'Ability', value: 'Dropslide' }]
    },
    {
        id: 'rarebot-sacrifice',
        title: 'Sacrifice Rarebot',
        kindLabel: 'ENEMY',
        description: 'Very fast, dodging Rarebot strapped with explosives that detonates on contact with Goodbots. Cannot be healed.',
        bodyType: 'sacrifice',
        weapon: 'none',
        stats: [{ label: 'HP', value: '100' }, { label: 'Explosion', value: '150 Split AoE' }, { label: 'Reward', value: '25 Scraps' }]
    },
    {
        id: 'rarebot-dropship',
        title: 'Rarebot Dropship',
        kindLabel: 'ENEMY',
        description: 'Big enemy boss ship that orbits the map and keeps dropping tough Rarebots.',
        bodyType: 'dropship',
        faction: 'rarebot',
        weapon: 'hands',
        stats: [{ label: 'HP', value: '8000' }, { label: 'Reward', value: '2200 Scraps' }, { label: 'Cap', value: '30 Rarebots' }]
    },
    {
        id: 'mapbot',
        title: 'Mapbot',
        kindLabel: 'BOSS',
        description: 'Supreme boss faction hostile to both Goodbots and Rarebots. Immune to stun and knockback; uses dual blasters, core ball blasts, homing rockets, dropslides, Knuckleboom Augmentation leaps, and crushing claws.',
        bodyType: 'mapbot',
        weapon: 'mapbot-claws',
        stats: [
            { label: 'HP', value: '100,000' },
            { label: 'Armor', value: '50% DR' },
            { label: 'Claws / Blasters', value: '650 / 500' },
            { label: 'Core / Rockets / Leap', value: '800 / 500 / 500' }
        ]
    },
    {
        id: 'goodbot',
        title: 'Goodbot',
        kindLabel: 'ALLY',
        description: 'Friendly melee Goodbot that fights Rarebots, dodges shots, and grapples.',
        bodyType: 'goodbot',
        weapon: 'hands',
        stats: [{ label: 'HP', value: '1000' }, { label: 'Team', value: 'Goodbot' }]
    },
    {
        id: 'goodbot-pistol',
        title: 'Goodbot (Pistol)',
        kindLabel: 'ALLY',
        description: 'Friendly Goodbot with a laser pistol.',
        bodyType: 'goodbot',
        weapon: 'goodbot-pistol',
        stats: [{ label: 'HP', value: '1000' }, { label: 'Weapon', value: 'Goodbot Pistol' }]
    },
    {
        id: 'goodbot-assault-laser',
        title: 'Goodbot (Assault Laser)',
        kindLabel: 'ALLY',
        description: 'Armored Goodbot with Goodbot Armor, an Assault Laser, and a crowd-seeking stun grenade.',
        bodyType: 'goodbot',
        armor: 'goodbot-armor',
        weapon: 'goodbot-assault-laser',
        stats: [{ label: 'HP', value: '1500' }, { label: 'Armor', value: 'Goodbot Armor' }, { label: 'Weapon', value: 'Goodbot Assault Laser' }, { label: 'Ability', value: 'Grenade (10s CD)' }]
    },
    {
        id: 'goodbot-cannon',
        title: 'Goodbot (Cannon)',
        kindLabel: 'ALLY',
        description: 'Heavy Goodbot with a blast cannon that stuns groups of enemies.',
        bodyType: 'goodbot',
        weapon: 'goodbot-cannon',
        stats: [{ label: 'HP', value: '1000' }, { label: 'Weapon', value: 'Goodbot Cannon' }, { label: 'Damage', value: '250 AoE' }, { label: 'Stun', value: '1s' }]
    },
    {
        id: 'goodbot-beamer',
        title: 'Goodbot (Beamer)',
        kindLabel: 'ALLY',
        description: 'Friendly Goodbot armed with a continuous laser beam.',
        bodyType: 'goodbot',
        weapon: 'goodbot-beamer',
        stats: [{ label: 'HP', value: '1000' }, { label: 'Weapon', value: 'Goodbot Beamer' }, { label: 'Damage', value: '15-21 / Beam' }]
    },
    {
        id: 'goodbot-dropship',
        title: 'Goodbot Dropship',
        kindLabel: 'ALLY',
        description: 'Friendly gunship that orbits the base and keeps deploying Goodbot squads.',
        bodyType: 'dropship',
        faction: 'goodbot',
        weapon: 'hands',
        stats: [{ label: 'HP', value: '8000' }, { label: 'Team', value: 'Goodbot' }]
    },
    {
        id: 'prototype',
        title: 'Prototype Rarebot',
        kindLabel: 'ENEMY',
        description: 'Quick little melee Rarebot. Weak alone, nasty in swarms.',
        bodyType: 'prototype',
        weapon: 'hands',
        stats: [{ label: 'HP', value: '120' }, { label: 'Team', value: 'Rarebot' }]
    }
];

function createEntityPreviewUrl(opt) {
    const c = document.createElement('canvas');
    c.width = 76;
    c.height = 76;
    const g = c.getContext('2d');
    g.imageSmoothingEnabled = false;

    if (opt.bodyType === 'dropship') {
        drawDropshipSprite(g, 38, 38, 60, 60, opt.faction || 'rarebot', -Math.PI * 0.2, 0);
        return c.toDataURL();
    }

    if (opt.bodyType === 'mapbot') {
        const B = 36;
        const pad = 4;
        const minX = -0.7129 * B - 0.2539 * B;
        const maxX = 0.7129 * B + 0.2539 * B;
        const minY = -0.5098 * B - 0.08595 * B;
        const maxY = 0.50195 * B;
        const fitScale = Math.min(1, (76 - pad * 2) / (maxX - minX), (76 - pad * 2) / (maxY - minY));
        g.save();
        g.translate(38 - ((minX + maxX) * 0.5) * fitScale, 38 - ((minY + maxY) * 0.5) * fitScale);
        g.scale(fitScale, fitScale);
        if (mapbotBlasterSide1Img.complete && mapbotBlasterSide1Img.naturalWidth > 0) {
            const bw = 0.5078 * B;
            const bh = 0.3867 * B;
            g.drawImage(mapbotBlasterSide1Img, -0.7129 * B - bw * 0.5, -0.1387 * B - bh * 0.5, bw, bh);
        }
        if (mapbotBlasterSide2Img.complete && mapbotBlasterSide2Img.naturalWidth > 0) {
            const bw = 0.5078 * B;
            const bh = 0.3867 * B;
            g.drawImage(mapbotBlasterSide2Img, 0.7129 * B - bw * 0.5, -0.1387 * B - bh * 0.5, bw, bh);
        }
        if (mapbotImg.complete && mapbotImg.naturalWidth > 0) {
            g.drawImage(mapbotImg, -B * 0.5, -B * 0.5, B, B);
        } else {
            g.fillStyle = '#a824ff';
            g.beginPath();
            g.arc(0, 0, B * 0.5, 0, Math.PI * 2);
            g.fill();
        }
        const cw = 0.5 * B;
        const ch = 0.1719 * B;
        if (mapbotCoreImg.complete && mapbotCoreImg.naturalWidth > 0) {
            g.drawImage(mapbotCoreImg, -cw * 0.5, -0.5098 * B - ch * 0.5, cw, ch);
        } else {
            g.fillStyle = '#d84aff';
            g.strokeStyle = '#0e0e14';
            g.lineWidth = Math.max(1.2, B * 0.04);
            g.beginPath();
            g.roundRect(-cw * 0.36, -0.5098 * B - ch * 0.35, cw * 0.72, ch * 0.7, ch * 0.35);
            g.fill();
            g.stroke();
        }
        if (mapbotClawsImg.complete && mapbotClawsImg.naturalWidth > 0) {
            const clw = 1.2305 * B;
            const clh = 0.3125 * B;
            g.drawImage(mapbotClawsImg, -clw * 0.5, 0.3457 * B - clh * 0.5, clw, clh);
        }
        g.restore();
        return c.toDataURL();
    }

    const bodyImg = opt.bodyType === 'prototype'
        ? prototypeRarebotImg
        : (opt.bodyType === 'sacrifice'
            ? sacrificeRarebotImg
            : (opt.bodyType === 'scout'
                ? scoutRarebotImg
                : (opt.bodyType === 'rarebot' ? rarebotImg : goodbotImg)));
    const bodySize = 36;
    const refW = (goodbotImg.complete && goodbotImg.naturalWidth > 0) ? goodbotImg.naturalWidth : 512;
    const refH = (goodbotImg.complete && goodbotImg.naturalHeight > 0) ? goodbotImg.naturalHeight : 512;

    const bodyDrawW = ((opt.bodyType === 'scout' || opt.bodyType === 'sacrifice') && bodyImg.complete && bodyImg.naturalWidth > 0)
        ? bodySize * (bodyImg.naturalWidth / refW)
        : bodySize;
    const bodyDrawH = ((opt.bodyType === 'scout' || opt.bodyType === 'sacrifice') && bodyImg.complete && bodyImg.naturalHeight > 0)
        ? bodySize * (bodyImg.naturalHeight / refH)
        : bodySize;
    const bodyDrawX = -bodyDrawW / 2;
    const bodyDrawY = -bodySize / 2;

    let minX = bodyDrawX;
    let maxX = bodyDrawX + bodyDrawW;
    let minY = bodyDrawY;
    let maxY = bodyDrawY + bodyDrawH;

    const isDualPistol = opt.weapon === 'dual-pistol';
    const isBeamerPreview = opt.weapon === 'goodbot-beamer';
    const isAssaultLaserPreview = opt.weapon === 'goodbot-assault-laser' || opt.weapon === 'rarebot-assault-laser';
    const isHealerPreview = opt.weapon === 'healer-gun';
    const isRangedPreview = opt.weapon === 'pistol' || isDualPistol || opt.weapon === 'goodbot-pistol' || opt.weapon === 'goodbot-cannon' || isBeamerPreview || isAssaultLaserPreview || isHealerPreview;
    let weaponImg = null;
    let wRect = null;
    let dualSplit = null;
    let heldGrenadeRect = null;
    if (isRangedPreview) {
        weaponImg = isBeamerPreview
            ? goodbotBeamerImg
            : (opt.weapon === 'goodbot-assault-laser'
                ? goodbotAssaultLaserImg
                : (opt.weapon === 'rarebot-assault-laser'
                    ? rarebotAssaultLaserImg
                    : (isHealerPreview
                        ? rarebotHealerGunImg
                        : (opt.weapon === 'goodbot-cannon'
                            ? goodbotCannonImg
                            : ((opt.weapon === 'pistol' || isDualPistol) ? rarebotPistolImg : goodbotPistolImg)))));
        const wNatW = weaponImg ? weaponImg.naturalWidth : 0;
        const wNatH = weaponImg ? weaponImg.naturalHeight : 0;
        if (weaponImg && weaponImg.complete && wNatW > 0) {
            const metrics = getWeaponMetrics(opt.weapon, weaponImg);
            const pxScaleX = ((bodySize / refW) * HANDS_SCALE) / metrics.resScale;
            const pxScaleY = ((bodySize / refH) * HANDS_SCALE) / metrics.resScale;
            const wx = -metrics.anchorX * pxScaleX;
            const wy = -metrics.anchorY * pxScaleY;
            const ww = wNatW * pxScaleX;
            const wh = wNatH * pxScaleY;
            if (isDualPistol) {
                const sx = Math.max(1, Math.min(metrics.splitX, wNatW));
                const rw = wNatW - sx;
                const rightX = (sx - metrics.anchorX) * pxScaleX;
                const rightDrawW = rw * pxScaleX;
                dualSplit = { sx, rw, fullH: wNatH, rightX, rightDrawW, wy, wh };
                const leftEdge = -(rightX + rightDrawW);
                const rightEdge = rightX + rightDrawW;
                if (leftEdge < minX) minX = leftEdge;
                if (rightEdge > maxX) maxX = rightEdge;
                if (wy < minY) minY = wy;
                if (wy + wh > maxY) maxY = wy + wh;
            } else {
                wRect = { wx, wy, ww, wh };
                if (wx < minX) minX = wx;
                if (wx + ww > maxX) maxX = wx + ww;
                if (wy < minY) minY = wy;
                if (wy + wh > maxY) maxY = wy + wh;
            }
        }
    } else if (opt.weapon !== 'none') {
        const handsImg = opt.bodyType === 'prototype' ? prototypeRarebotHandsImg : botHandsImg;
        if (handsImg.complete && handsImg.naturalWidth > 0) {
            const ww = bodySize * (handsImg.naturalWidth / refW) * HANDS_SCALE;
            const wh = bodySize * (handsImg.naturalHeight / refH) * HANDS_SCALE;
            const wx = -ww / 2;
            const wy = -wh / 2;
            weaponImg = handsImg;
            wRect = { wx, wy, ww, wh };
            if (wx < minX) minX = wx;
            if (wx + ww > maxX) maxX = wx + ww;
            if (wy < minY) minY = wy;
            if (wy + wh > maxY) maxY = wy + wh;
        }
        if (opt.weapon === 'rarebot-grenade') {
            const pScale = bodySize / 48;
            const rgReady = rarebotGrenadeImg.complete && rarebotGrenadeImg.naturalWidth > 0;
            const rgRatio = rgReady ? (rarebotGrenadeImg.naturalHeight / rarebotGrenadeImg.naturalWidth) : 1.1142857;
            const baseGW = rgRatio > 1.05 ? GRENADE_DRAW_SIZE : 23;
            const gScale = Math.max(1, 24 / (baseGW * rgRatio));
            const gw = baseGW * gScale * pScale;
            const gh = baseGW * rgRatio * gScale * pScale;
            const gcx = -19.5 * pScale;
            const gcy = -25 * pScale;
            heldGrenadeRect = { cx: gcx, cy: gcy, w: gw, h: gh };
            if (gcx - gw * 0.5 < minX) minX = gcx - gw * 0.5;
            if (gcx + gw * 0.5 > maxX) maxX = gcx + gw * 0.5;
            if (gcy - gh * 0.5 < minY) minY = gcy - gh * 0.5;
            if (gcy + gh * 0.5 > maxY) maxY = gcy + gh * 0.5;
        }
    }

    const totalW = Math.max(1, maxX - minX);
    const totalH = Math.max(1, maxY - minY);
    const pad = 6;
    const fitScale = Math.min(1, (76 - pad * 2) / totalW, (76 - pad * 2) / totalH);
    const drawCx = 38 - ((minX + maxX) * 0.5) * fitScale;
    const drawCy = 38 - ((minY + maxY) * 0.5) * fitScale;

    g.save();
    g.translate(drawCx, drawCy);
    g.scale(fitScale, fitScale);

    if (weaponImg && dualSplit && dualSplit.rw > 0) {
        g.save();
        g.scale(-1, 1);
        g.drawImage(weaponImg, dualSplit.sx, 0, dualSplit.rw, dualSplit.fullH, dualSplit.rightX, dualSplit.wy, dualSplit.rightDrawW, dualSplit.wh);
        g.restore();
        g.drawImage(weaponImg, dualSplit.sx, 0, dualSplit.rw, dualSplit.fullH, dualSplit.rightX, dualSplit.wy, dualSplit.rightDrawW, dualSplit.wh);
    } else if (weaponImg && wRect) {
        g.drawImage(weaponImg, wRect.wx, wRect.wy, wRect.ww, wRect.wh);
    }

    if (heldGrenadeRect) {
        g.save();
        g.translate(heldGrenadeRect.cx, heldGrenadeRect.cy);
        g.rotate(-0.18);
        if (rarebotGrenadeImg.complete && rarebotGrenadeImg.naturalWidth > 0) {
            g.drawImage(rarebotGrenadeImg, -heldGrenadeRect.w * 0.5, -heldGrenadeRect.h * 0.5, heldGrenadeRect.w, heldGrenadeRect.h);
        } else {
            g.fillStyle = '#e02424';
            g.beginPath();
            g.arc(0, 0, heldGrenadeRect.w * 0.42, 0, Math.PI * 2);
            g.fill();
        }
        g.restore();
    }

    if (bodyImg.complete && bodyImg.naturalWidth > 0) {
        g.drawImage(bodyImg, bodyDrawX, bodyDrawY, bodyDrawW, bodyDrawH);
    } else {
        g.fillStyle = opt.bodyType === 'goodbot' ? '#b833ff' : '#cc3f3f';
        g.fillRect(-bodySize / 2, -bodySize / 2, bodySize, bodySize);
    }
    if ((opt.armor === 'goodbot-armor' || opt.armor === 'goodbot-armor-2' || opt.armor === 'goodbot-armor-3' || (opt.bodyType === 'goodbot' && opt.weapon === 'goodbot-assault-laser')) && goodbotArmorImg.complete && goodbotArmorImg.naturalWidth > 0) {
        g.drawImage(goodbotArmorImg, -bodySize / 2, -bodySize / 2, bodySize, bodySize);
    } else if ((opt.armor === 'rarebot-armor' || (opt.bodyType === 'rarebot' && opt.weapon === 'rarebot-assault-laser')) && rarebotArmorImg.complete && rarebotArmorImg.naturalWidth > 0) {
        g.drawImage(rarebotArmorImg, -bodySize / 2, -bodySize / 2, bodySize, bodySize);
    }
    g.restore();
    return c.toDataURL();
}

function positionAdminSpawnFactionMenu(clientX, clientY) {
    if (!adminSpawnFactionMenu) return;
    const scale = currentUiScale > 0 ? currentUiScale : 1;
    const effW = window.innerWidth / scale;
    const effH = window.innerHeight / scale;
    const menuW = adminSpawnFactionMenu.offsetWidth || 184;
    const menuH = adminSpawnFactionMenu.offsetHeight || 150;
    let left = clientX / scale + 6;
    let top = clientY / scale + 6;
    if (left + menuW > effW - 8) left = Math.max(8, clientX / scale - menuW - 6);
    if (top + menuH > effH - 8) top = Math.max(8, effH - menuH - 8);
    adminSpawnFactionMenu.style.left = `${Math.round(left)}px`;
    adminSpawnFactionMenu.style.top = `${Math.round(top)}px`;
}

function openAdminSpawnFactionMenu(opt, clientX, clientY) {
    if (!adminSpawnFactionMenu || !opt) return;
    adminSpawnFactionTarget = opt;
    if (adminSpawnFactionTitle) {
        adminSpawnFactionTitle.textContent = opt.title;
    }
    adminSpawnFactionMenu.classList.add('visible');
    adminSpawnFactionMenu.setAttribute('aria-hidden', 'false');
    positionAdminSpawnFactionMenu(clientX, clientY);
}

function closeAdminSpawnFactionMenu() {
    if (!adminSpawnFactionMenu) return;
    adminSpawnFactionTarget = null;
    adminSpawnFactionMenu.classList.remove('visible');
    adminSpawnFactionMenu.setAttribute('aria-hidden', 'true');
}

function renderAdminSpawnGrid() {
    if (!adminSpawnGrid) return;
    adminSpawnGrid.textContent = '';
    for (let i = 0; i < ADMIN_SPAWN_OPTIONS.length; i++) {
        const opt = ADMIN_SPAWN_OPTIONS[i];
        const slot = document.createElement('button');
        slot.type = 'button';
        slot.className = 'shop-item-slot';
        slot.setAttribute('aria-label', opt.title);
        slot.dataset.spawnEntity = opt.id;

        const img = document.createElement('img');
        img.className = 'shop-item-icon';
        img.src = createEntityPreviewUrl(opt);
        img.alt = opt.title;
        img.draggable = false;
        slot.appendChild(img);

        const tipDef = {
            title: opt.title,
            kind: opt.kindLabel === 'ALLY' ? 'ability' : 'unit',
            customTypeLabel: opt.kindLabel,
            description: opt.description,
            cost: 0,
            stats: opt.stats
        };

        slot.addEventListener('pointerenter', () => {
            if (adminSpawnFactionMenu && adminSpawnFactionMenu.classList.contains('visible')) return;
            showShopTooltip(tipDef, slot, false, false);
        });
        slot.addEventListener('pointerleave', () => {
            hideShopTooltip();
        });
        slot.addEventListener('focus', () => {
            if (adminSpawnFactionMenu && adminSpawnFactionMenu.classList.contains('visible')) return;
            showShopTooltip(tipDef, slot, false, false);
        });
        slot.addEventListener('blur', () => {
            hideShopTooltip();
        });
        slot.addEventListener('click', () => {
            if (ws && ws.readyState === WebSocket.OPEN && isAdmin) {
                ws.send(JSON.stringify({ type: 'admin_spawn_entity', entityType: opt.id }));
            }
        });
        slot.addEventListener('contextmenu', (e) => {
            e.preventDefault();
            e.stopPropagation();
            hideShopTooltip();
            openAdminSpawnFactionMenu(opt, e.clientX, e.clientY);
        });

        adminSpawnGrid.appendChild(slot);
    }
}

function refreshAdminSpawnIcons() {
    if (!adminSpawnGrid) return;
    const imgs = adminSpawnGrid.querySelectorAll('img.shop-item-icon');
    for (let i = 0; i < imgs.length && i < ADMIN_SPAWN_OPTIONS.length; i++) {
        imgs[i].src = createEntityPreviewUrl(ADMIN_SPAWN_OPTIONS[i]);
    }
}

function refreshAdminReviveButton() {
    if (!adminReviveBtn) return;
    adminReviveBtn.disabled = !(isAdmin && ME.faction === 'spectator');
}

function openAdminPanel() {
    if (!adminPanelOverlay || inMainMenu || !isAdmin) return;
    if (isSettingsOpen) closeSettings();
    if (isWaveLeaderboardOpen) closeWaveLeaderboard();
    if (isLeaveDialogOpen) closeLeaveDialog();
    if (isSpectateDialogOpen) closeSpectateDialog();
    if (isShopOpen) closeShop();
    if (isModDialogOpen) closeModDialog();
    if (isMapExpanded) setMapExpanded(false);
    isAdminPanelOpen = true;
    clearHeldInputs();
    if (document.activeElement === chatInput) {
        closeChat();
    }
    hideShopTooltip();
    refreshAdminSpawnIcons();
    refreshAdminReviveButton();
    adminPanelOverlay.classList.add('open');
    adminPanelOverlay.setAttribute('aria-hidden', 'false');
    syncCanvasCrosshairCursor();
}

function closeAdminPanel() {
    if (!adminPanelOverlay) return;
    isAdminPanelOpen = false;
    closeAdminSpawnFactionMenu();
    hideShopTooltip();
    adminPanelOverlay.classList.remove('open');
    adminPanelOverlay.setAttribute('aria-hidden', 'true');
    syncCanvasCrosshairCursor();
}

function openSettings() {
    if (!settingsOverlay) return;
    if (isWaveLeaderboardOpen) closeWaveLeaderboard();
    if (isLeaveDialogOpen) closeLeaveDialog();
    if (isSpectateDialogOpen) closeSpectateDialog();
    if (isShopOpen) closeShop();
    if (isModDialogOpen) closeModDialog();
    if (isAdminPanelOpen) closeAdminPanel();
    if (isMapExpanded) setMapExpanded(false);
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
    if (isWaveLeaderboardOpen) closeWaveLeaderboard();
    if (isSpectateDialogOpen) closeSpectateDialog();
    if (isShopOpen) closeShop();
    if (isModDialogOpen) closeModDialog();
    if (isAdminPanelOpen) closeAdminPanel();
    if (isMapExpanded) setMapExpanded(false);
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

function openSpectateDialog() {
    if (!spectateOverlay || inMainMenu || ME.faction === 'spectator') return;
    if (isSettingsOpen) closeSettings();
    if (isWaveLeaderboardOpen) closeWaveLeaderboard();
    if (isLeaveDialogOpen) closeLeaveDialog();
    if (isShopOpen) closeShop();
    if (isModDialogOpen) closeModDialog();
    if (isAdminPanelOpen) closeAdminPanel();
    if (isMapExpanded) setMapExpanded(false);
    isSpectateDialogOpen = true;
    clearHeldInputs();
    if (document.activeElement === chatInput) {
        closeChat();
    }
    spectateOverlay.classList.add('open');
    spectateOverlay.setAttribute('aria-hidden', 'false');
    syncCanvasCrosshairCursor();
}

function closeSpectateDialog() {
    if (!spectateOverlay) return;
    isSpectateDialogOpen = false;
    spectateOverlay.classList.remove('open');
    spectateOverlay.setAttribute('aria-hidden', 'true');
    syncCanvasCrosshairCursor();
}

function drawDropshipSprite(targetCtx, x, y, sW, sH, faction, angle, nowMs = performance.now()) {
    const img = faction === 'goodbot' ? goodbotDropshipImg : rarebotDropshipImg;
    const rotorImg = faction === 'goodbot' ? goodbotDropshipRotorImg : rarebotDropshipRotorImg;
    const podOffsetX = (154 / 512) * sW;
    const podOffsetY = (10 / 512) * sH;
    const rotorSize = sW * (220 / 512);
    const rotorAngle = (nowMs / 250) * (Math.PI / 2);

    targetCtx.save();
    targetCtx.translate(x, y);
    targetCtx.rotate(angle);
    if (img.complete && img.naturalWidth > 0) {
        targetCtx.imageSmoothingEnabled = true;
        targetCtx.drawImage(img, -sW / 2, -sH / 2, sW, sH);
    } else {
        targetCtx.fillStyle = '#141416';
        targetCtx.strokeStyle = '#050507';
        targetCtx.lineWidth = Math.max(3, sW * 0.044);
        targetCtx.beginPath();
        targetCtx.ellipse(0, 0, sW * 0.32, sH * 0.42, 0, 0, Math.PI * 2);
        targetCtx.fill();
        targetCtx.stroke();
        targetCtx.fillStyle = faction === 'goodbot' ? '#b833ff' : '#ff2a2a';
        targetCtx.beginPath();
        targetCtx.arc(0, -sH * 0.12, sW * 0.1, 0, Math.PI * 2);
        targetCtx.fill();
    }
    if (rotorImg.complete && rotorImg.naturalWidth > 0) {
        targetCtx.imageSmoothingEnabled = true;
        for (let side = -1; side <= 1; side += 2) {
            targetCtx.save();
            targetCtx.translate(side * podOffsetX, podOffsetY);
            targetCtx.rotate(rotorAngle);
            targetCtx.drawImage(rotorImg, -rotorSize / 2, -rotorSize / 2, rotorSize, rotorSize);
            targetCtx.restore();
        }
    }
    targetCtx.restore();
}

const ITEM_SLOT_IMAGES = {
    'goodbot-pistol': 'assets/Goodbot Pistol Slot.png',
    'goodbot-assault-laser': 'assets/Goodbot Assault Laser Slot.png',
    'goodbot-cannon': 'assets/Goodbot Cannon Slot.png',
    'goodbot-beamer': 'assets/Goodbot Beamer Slot.png',
    'goodbot-armor': 'assets/Goodbot Armor Slot.png',
    'goodbot-armor-2': 'assets/Goodbot Armor Slot.png',
    'goodbot-armor-3': 'assets/Goodbot Armor Slot.png',
    'goodbot-grenade': 'assets/Goodbot Grenade Slot.png'
};

let grenadeFallbackSlotUrl = null;
function getGrenadeFallbackSlotUrl() {
    if (grenadeFallbackSlotUrl) return grenadeFallbackSlotUrl;
    const c = document.createElement('canvas');
    c.width = 64;
    c.height = 64;
    const g = c.getContext('2d');
    g.fillStyle = '#18181d';
    g.strokeStyle = '#000000';
    g.lineWidth = 4;
    g.beginPath();
    g.arc(32, 34, 18, 0, Math.PI * 2);
    g.fill();
    g.stroke();
    g.fillStyle = '#393944';
    g.fillRect(25, 11, 14, 9);
    g.strokeRect(25, 11, 14, 9);
    g.fillStyle = '#b833ff';
    g.beginPath();
    g.arc(32, 34, 8, 0, Math.PI * 2);
    g.fill();
    g.fillStyle = '#f0aaff';
    g.beginPath();
    g.arc(30, 32, 3, 0, Math.PI * 2);
    g.fill();
    grenadeFallbackSlotUrl = c.toDataURL();
    return grenadeFallbackSlotUrl;
}

const SHOP_ITEMS = [
    {
        id: 'goodbot-pistol',
        title: 'Goodbot Pistol',
        kind: 'weapon',
        description: 'Cheap reliable sidearm that shoots quick purple laser bolts.',
        cost: 15,
        slotImage: 'assets/Goodbot Pistol Slot.png',
        stats: [
            { label: 'Damage', value: '45-58' },
            { label: 'Firerate', value: '400ms' }
        ]
    },
    {
        id: 'goodbot-assault-laser',
        title: 'Goodbot Assault Laser',
        kind: 'weapon',
        description: 'Two-handed rapid-fire laser rifle that sprays fast bolts every 150ms.',
        cost: 275,
        slotImage: ITEM_SLOT_IMAGES['goodbot-assault-laser'],
        stats: [
            { label: 'Damage', value: '30-36' },
            { label: 'Cooldown', value: '150ms' }
        ]
    },
    {
        id: 'goodbot-cannon',
        title: 'Goodbot Cannon',
        kind: 'weapon',
        description: 'Fires a heavy plasma orb that knocks you back, stuns enemies for 1s, and splashes 250 damage.',
        cost: 500,
        slotImage: 'assets/Goodbot Cannon Slot.png',
        stats: [
            { label: 'Damage', value: '250 Split AoE' },
            { label: 'Cooldown', value: '2s' },
            { label: 'Stun', value: '1s' }
        ]
    },
    {
        id: 'goodbot-beamer',
        title: 'Goodbot Beamer',
        kind: 'weapon',
        description: 'Fires an instant, nonstop laser beam straight to the nearest wall.',
        cost: 600,
        slotImage: ITEM_SLOT_IMAGES['goodbot-beamer'],
        stats: [
            { label: 'Damage', value: '15-21 / Beam' },
            { label: 'Cooldown', value: '0ms' },
            { label: 'Range', value: 'To Wall' }
        ]
    },
    {
        id: 'goodbot-armor',
        title: 'Goodbot Armor',
        kind: 'armor',
        tier: 1,
        description: 'Heavy dark plating that boosts your Max HP to 1500 and heals +500 HP right away.',
        cost: 400,
        slotImage: ITEM_SLOT_IMAGES['goodbot-armor'],
        stats: [
            { label: 'Max HP', value: '1500 (+500)' },
            { label: 'Type', value: 'Armor (Tier 1)' }
        ]
    },
    {
        id: 'goodbot-armor-2',
        title: 'Tier 2 Armor',
        kind: 'armor',
        tier: 2,
        description: 'Heavy dark plating that boosts your Max HP to 2000 and heals +1000 HP right away.',
        cost: 900,
        slotImage: ITEM_SLOT_IMAGES['goodbot-armor-2'],
        stats: [
            { label: 'Max HP', value: '2000 (+1000)' },
            { label: 'Type', value: 'Armor (Tier 2)' }
        ]
    },
    {
        id: 'goodbot-armor-3',
        title: 'Tier 3 Armor',
        kind: 'armor',
        tier: 3,
        description: 'Heavy dark plating that boosts your Max HP to 3500, heals +2500 HP right away, and gives 20% damage/knockback reduction and 0.5s stun reduction.',
        cost: 2000,
        slotImage: ITEM_SLOT_IMAGES['goodbot-armor-3'],
        stats: [
            { label: 'Max HP', value: '3500 (+2500)' },
            { label: 'Damage Taken', value: '-20% (All)' },
            { label: 'Knockback', value: '-20% (All)' },
            { label: 'Stun', value: '-0.5s (All)' },
            { label: 'Type', value: 'Armor (Tier 3)' }
        ]
    },
    {
        id: 'goodbot-grenade',
        title: 'Goodbot Grenade',
        kind: 'ability',
        description: 'Press F or Right Click to lob a grenade that stuns Rarebots for 1s, then blows up for 150-200 damage.',
        cost: 250,
        slotImage: 'assets/Goodbot Grenade Slot.png',
        stats: [
            { label: 'Type', value: 'Ability' },
            { label: 'Damage', value: '150-200' },
            { label: 'Cooldown', value: '10s' },
            { label: 'Shockwave', value: '1s Stun (3 Tiles)' },
            { label: 'Explosion', value: '3 Tiles' }
        ]
    }
];

const SHOP_UNITS = [
    {
        id: 'unit-goodbot',
        title: 'Goodbot',
        kind: 'unit',
        customTypeLabel: 'UNIT',
        bodyType: 'goodbot',
        weapon: 'hands',
        description: 'Melee Goodbot ally. Guards the base, dodges incoming shots, and grapples enemies for a 0.5s stun.',
        cost: 100,
        stats: [
            { label: 'HP', value: '1000' },
            { label: 'Grapple', value: '150 Dmg / 5s CD' },
            { label: 'Stun', value: '0.5s' }
        ]
    },
    {
        id: 'unit-goodbot-pistol',
        title: 'Goodbot (Pistol)',
        kind: 'unit',
        customTypeLabel: 'UNIT',
        bodyType: 'goodbot',
        weapon: 'goodbot-pistol',
        description: 'Goodbot ally with a pistol. Keeps distance, dodges fire, and shoots incoming Rarebots.',
        cost: 250,
        stats: [
            { label: 'HP', value: '1000' },
            { label: 'Weapon', value: 'Goodbot Pistol' }
        ]
    },
    {
        id: 'unit-goodbot-assault-laser',
        title: 'Goodbot (Assault Laser)',
        kind: 'unit',
        customTypeLabel: 'UNIT',
        bodyType: 'goodbot',
        armor: 'goodbot-armor',
        weapon: 'goodbot-assault-laser',
        description: 'Armored Goodbot ally with 1500 HP, a rapid Assault Laser, and a grenade he saves for crowds or lone stragglers.',
        cost: 500,
        stats: [
            { label: 'HP', value: '1500' },
            { label: 'Armor', value: 'Goodbot Armor' },
            { label: 'Weapon', value: 'Goodbot Assault Laser' },
            { label: 'Damage', value: '30-36' },
            { label: 'Cooldown', value: '150ms' },
            { label: 'Ability', value: 'Goodbot Grenade / 10s CD' }
        ]
    },
    {
        id: 'unit-goodbot-cannon',
        title: 'Goodbot (Cannon)',
        kind: 'unit',
        customTypeLabel: 'UNIT',
        bodyType: 'goodbot',
        weapon: 'goodbot-cannon',
        description: 'Follows you with a heavy cannon that stuns and blasts crowds of Rarebots.',
        cost: 700,
        stats: [
            { label: 'HP', value: '1000' },
            { label: 'Weapon', value: 'Goodbot Cannon' },
            { label: 'Damage', value: '250 Split AoE / 2s CD' },
            { label: 'Stun', value: '1s' }
        ]
    },
    {
        id: 'unit-goodbot-beamer',
        title: 'Goodbot (Beamer)',
        kind: 'unit',
        customTypeLabel: 'UNIT',
        bodyType: 'goodbot',
        weapon: 'goodbot-beamer',
        description: 'Follows you and sweeps a steady laser beam through Rarebots until it hits a wall.',
        cost: 850,
        stats: [
            { label: 'HP', value: '1000' },
            { label: 'Weapon', value: 'Goodbot Beamer' },
            { label: 'Damage', value: '15-21 / Beam' },
            { label: 'Range', value: 'To Wall' }
        ]
    }
];

const ITEM_BY_ID = Object.fromEntries([...SHOP_ITEMS, ...SHOP_UNITS].map(item => [item.id, item]));

function getMyEquippedWeapon() {
    if (ME.faction !== 'goodbot') return 'hands';
    const itemId = myInventory[activeSlot];
    if (itemId === 'goodbot-pistol') return 'goodbot-pistol';
    if (itemId === 'goodbot-assault-laser') return 'goodbot-assault-laser';
    if (itemId === 'goodbot-cannon') return 'goodbot-cannon';
    if (itemId === 'goodbot-beamer') return 'goodbot-beamer';
    return 'hands';
}

function isRangedCrosshairActive() {
    if (inMainMenu || myId === null) return false;
    if (isSettingsOpen || isWaveLeaderboardOpen || isLeaveDialogOpen || isSpectateDialogOpen || isShopOpen || isModDialogOpen || isAdminPanelOpen || isMapExpanded) return false;
    if (document.activeElement === chatInput || (tokenInput && document.activeElement === tokenInput)) return false;
    if (document.body.classList.contains('touch-mode')) return false;
    const wpn = getMyEquippedWeapon();
    return wpn === 'goodbot-pistol' || wpn === 'goodbot-assault-laser' || wpn === 'goodbot-cannon' || wpn === 'goodbot-beamer';
}

function syncCanvasCrosshairCursor() {
    if (!canvas) return;
    canvas.classList.toggle('ranged-crosshair', isRangedCrosshairActive());
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

function updateAbilitySlotCooldown(nowMs) {
    const remMs = (myAbility && abilityReadyAt > nowMs) ? (abilityReadyAt - nowMs) : 0;
    const remSec = remMs > 0 ? Math.ceil(remMs / 1000) : 0;
    if (remSec === lastRenderedAbilityCooldownSec) return;
    lastRenderedAbilityCooldownSec = remSec;
    if (abilitySlot) {
        const cdOverlay = abilitySlot.querySelector('.ability-cooldown-overlay');
        if (remSec > 0) {
            abilitySlot.classList.add('on-cooldown');
            if (cdOverlay) {
                cdOverlay.style.display = 'flex';
                cdOverlay.textContent = String(remSec);
            }
        } else {
            abilitySlot.classList.remove('on-cooldown');
            if (cdOverlay) {
                cdOverlay.style.display = 'none';
                cdOverlay.textContent = '';
            }
        }
    }
    if (mobileAbilityBtn) {
        if (remSec > 0) {
            mobileAbilityBtn.classList.add('on-cooldown');
            mobileAbilityBtn.textContent = String(remSec);
        } else {
            mobileAbilityBtn.classList.remove('on-cooldown');
            mobileAbilityBtn.textContent = 'ABILITY';
        }
    }
}

function renderInventorySlots() {
    if (inventorySlots && inventorySlots.length > 0) {
        for (let i = 0; i < inventorySlots.length; i++) {
            const slotEl = inventorySlots[i];
            slotEl.textContent = '';
            const numEl = document.createElement('span');
            numEl.className = 'slot-number';
            numEl.textContent = String(i + 1);
            slotEl.appendChild(numEl);
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
    if (abilitySlot) {
        abilitySlot.textContent = '';
        const keyEl = document.createElement('span');
        keyEl.className = 'slot-number';
        keyEl.textContent = 'F';
        abilitySlot.appendChild(keyEl);
        const abilityItem = myAbility ? ITEM_BY_ID[myAbility] : null;
        const imgSrc = myAbility ? ITEM_SLOT_IMAGES[myAbility] : null;
        if (imgSrc) {
            const img = document.createElement('img');
            img.className = 'slot-item-img';
            img.src = imgSrc;
            img.alt = abilityItem ? abilityItem.title : myAbility;
            img.draggable = false;
            if (myAbility === 'goodbot-grenade') {
                img.onerror = () => {
                    img.onerror = null;
                    img.src = getGrenadeFallbackSlotUrl();
                };
            }
            abilitySlot.appendChild(img);
        }
        const cdOverlay = document.createElement('div');
        cdOverlay.className = 'ability-cooldown-overlay';
        cdOverlay.style.display = 'none';
        abilitySlot.appendChild(cdOverlay);
        lastRenderedAbilityCooldownSec = -1;
        updateAbilitySlotCooldown(performance.now());
    }
    if (armorSlot) {
        armorSlot.textContent = '';
        const equippedArmor = ME.armor || null;
        const armorItem = equippedArmor ? ITEM_BY_ID[equippedArmor] : null;
        const imgSrc = equippedArmor ? (ITEM_SLOT_IMAGES[equippedArmor] || (equippedArmor === 'rarebot-armor' ? 'assets/Rarebot Armor.png' : null)) : null;
        if (imgSrc) {
            const img = document.createElement('img');
            img.className = 'slot-item-img';
            img.src = imgSrc;
            img.alt = armorItem ? armorItem.title : equippedArmor;
            img.draggable = false;
            armorSlot.appendChild(img);
        }
    }
    if (mobileAbilityBtn) {
        const canUseAbility = Boolean(myAbility) && ME.faction === 'goodbot';
        mobileAbilityBtn.classList.toggle('has-ability', canUseAbility);
        lastRenderedAbilityCooldownSec = -1;
        updateAbilitySlotCooldown(performance.now());
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
    lastHoveredShopItem = item;
    lastHoveredShopSlot = slot;
    lastHoveredShowCost = showCost;
    lastHoveredPreferAbove = preferAbove;
    if (shopTooltipTitle) shopTooltipTitle.textContent = item.title;
    if (shopTooltipType) {
        if (item.customTypeLabel) {
            shopTooltipType.style.display = 'block';
            shopTooltipType.textContent = item.customTypeLabel;
        } else if (item.kind === 'ability') {
            shopTooltipType.style.display = 'block';
            shopTooltipType.textContent = 'ABILITY';
        } else {
            shopTooltipType.style.display = 'none';
            shopTooltipType.textContent = '';
        }
    }
    if (shopTooltipCost) {
        shopTooltipCost.style.display = showCost ? '' : 'none';
        if (showCost) {
            const cantAfford = ME.scraps < item.cost;
            const alliesFull = item.kind === 'unit' && currentAllyCount >= maxAlliesCount;
            const curArmorTier = ME.armor && ITEM_BY_ID[ME.armor] ? (ITEM_BY_ID[ME.armor].tier || 1) : 0;
            const itemArmorTier = item.kind === 'armor' ? (item.tier || 1) : 0;
            const armorOwned = item.kind === 'armor' && curArmorTier >= itemArmorTier;
            if (armorOwned) {
                shopTooltipCost.textContent = ME.armor === item.id
                    ? `Cost: ${item.cost} Scraps (Equipped)`
                    : `Cost: ${item.cost} Scraps (Lower Tier)`;
            } else if (alliesFull) {
                shopTooltipCost.textContent = `Cost: ${item.cost} Scraps (Max ${maxAlliesCount} Allies)`;
            } else {
                shopTooltipCost.textContent = cantAfford ? `Cost: ${item.cost} Scraps (Can't afford)` : `Cost: ${item.cost} Scraps`;
            }
            shopTooltipCost.classList.toggle('cant-afford', cantAfford || alliesFull || armorOwned);
        } else {
            shopTooltipCost.classList.remove('cant-afford');
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
    lastHoveredShopItem = null;
    lastHoveredShopSlot = null;
    shopTooltip.classList.remove('visible');
    shopTooltip.setAttribute('aria-hidden', 'true');
}

function refreshShopAffordability() {
    const alliesFull = currentAllyCount >= maxAlliesCount;
    if (shopUnitsStatus) {
        shopUnitsStatus.textContent = alliesFull
            ? `Allies: ${currentAllyCount}/${maxAlliesCount} (MAX)`
            : `Allies: ${currentAllyCount}/${maxAlliesCount}`;
        shopUnitsStatus.classList.toggle('visible', activeShopTab === 'units');
        shopUnitsStatus.classList.toggle('full', alliesFull);
    }
    if (shopGrid) {
        const slotEls = shopGrid.querySelectorAll('.shop-item-slot');
        const curArmorTier = ME.armor && ITEM_BY_ID[ME.armor] ? (ITEM_BY_ID[ME.armor].tier || 1) : 0;
        for (let i = 0; i < slotEls.length; i++) {
            const slotEl = slotEls[i];
            const itemKind = slotEl.dataset.itemKind || '';
            const itemId = slotEl.dataset.itemId || '';
            const itemDef = itemId ? ITEM_BY_ID[itemId] : null;
            const armorOwned = itemKind === 'armor' && curArmorTier >= (itemDef ? (itemDef.tier || 1) : 1);
            slotEl.classList.toggle('disabled', (itemKind === 'unit' && alliesFull) || armorOwned);
        }
        const costEls = shopGrid.querySelectorAll('.shop-item-cost');
        for (let i = 0; i < costEls.length; i++) {
            const costVal = Number(costEls[i].dataset.cost) || 0;
            costEls[i].classList.toggle('cant-afford', ME.scraps < costVal);
        }
    }
    if (lastHoveredShopItem && lastHoveredShowCost && shopTooltip && shopTooltip.classList.contains('visible') && shopTooltipCost) {
        const cantAfford = ME.scraps < lastHoveredShopItem.cost;
        const unitFull = lastHoveredShopItem.kind === 'unit' && alliesFull;
        const curArmorTier = ME.armor && ITEM_BY_ID[ME.armor] ? (ITEM_BY_ID[ME.armor].tier || 1) : 0;
        const armorOwned = lastHoveredShopItem.kind === 'armor' && curArmorTier >= (lastHoveredShopItem.tier || 1);
        if (armorOwned) {
            shopTooltipCost.textContent = ME.armor === lastHoveredShopItem.id
                ? `Cost: ${lastHoveredShopItem.cost} Scraps (Equipped)`
                : `Cost: ${lastHoveredShopItem.cost} Scraps (Lower Tier)`;
        } else if (unitFull) {
            shopTooltipCost.textContent = `Cost: ${lastHoveredShopItem.cost} Scraps (Max ${maxAlliesCount} Allies)`;
        } else {
            shopTooltipCost.textContent = cantAfford
                ? `Cost: ${lastHoveredShopItem.cost} Scraps (Can't afford)`
                : `Cost: ${lastHoveredShopItem.cost} Scraps`;
        }
        shopTooltipCost.classList.toggle('cant-afford', cantAfford || unitFull || armorOwned);
        if (lastHoveredShopSlot) {
            positionShopTooltipForSlot(lastHoveredShopSlot, lastHoveredPreferAbove);
        }
    }
}

function setShopTab(nextTab) {
    activeShopTab = nextTab === 'units' ? 'units' : 'items';
    if (shopTabItemsBtn) {
        const isItems = activeShopTab === 'items';
        shopTabItemsBtn.classList.toggle('active', isItems);
        shopTabItemsBtn.setAttribute('aria-selected', isItems ? 'true' : 'false');
    }
    if (shopTabUnitsBtn) {
        const isUnits = activeShopTab === 'units';
        shopTabUnitsBtn.classList.toggle('active', isUnits);
        shopTabUnitsBtn.setAttribute('aria-selected', isUnits ? 'true' : 'false');
    }
    hideShopTooltip();
    renderShopItems();
}

function refreshShopUnitIcons() {
    if (!shopGrid || activeShopTab !== 'units') return;
    const imgs = shopGrid.querySelectorAll('img.shop-item-icon');
    for (let i = 0; i < imgs.length && i < SHOP_UNITS.length; i++) {
        imgs[i].src = createEntityPreviewUrl(SHOP_UNITS[i]);
    }
}

function renderShopItems() {
    if (!shopGrid) return;
    shopGrid.textContent = '';
    const list = activeShopTab === 'units' ? SHOP_UNITS : SHOP_ITEMS;
    for (let i = 0; i < list.length; i++) {
        const item = list[i];
        const slot = document.createElement('button');
        slot.type = 'button';
        slot.className = 'shop-item-slot';
        slot.dataset.itemId = item.id;
        slot.dataset.itemKind = item.kind;

        if (item.kind === 'ability') {
            const tagEl = document.createElement('span');
            tagEl.className = 'shop-item-tag';
            tagEl.textContent = 'ABILITY';
            slot.appendChild(tagEl);
        }

        if (item.kind === 'unit') {
            const iconEl = document.createElement('img');
            iconEl.className = 'shop-item-icon';
            iconEl.src = createEntityPreviewUrl(item);
            iconEl.alt = item.title;
            iconEl.draggable = false;
            slot.appendChild(iconEl);
        } else if (item.slotImage) {
            const iconEl = document.createElement('img');
            iconEl.className = 'shop-item-icon';
            iconEl.src = item.slotImage;
            iconEl.alt = item.title;
            iconEl.draggable = false;
            if (item.id === 'goodbot-grenade') {
                iconEl.onerror = () => {
                    iconEl.onerror = null;
                    iconEl.src = getGrenadeFallbackSlotUrl();
                };
            }
            slot.appendChild(iconEl);
        } else {
            const nameEl = document.createElement('span');
            nameEl.className = 'shop-item-name';
            nameEl.textContent = item.title;
            slot.appendChild(nameEl);
        }

        const costEl = document.createElement('span');
        costEl.className = 'shop-item-cost';
        costEl.dataset.cost = String(item.cost);
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
            if (item.kind === 'unit' && currentAllyCount >= maxAlliesCount) return;
            const curArmorTier = ME.armor && ITEM_BY_ID[ME.armor] ? (ITEM_BY_ID[ME.armor].tier || 1) : 0;
            if (item.kind === 'armor' && curArmorTier >= (item.tier || 1)) return;
            if (ws && ws.readyState === WebSocket.OPEN && myId !== null) {
                ws.send(JSON.stringify({ type: 'buy_item', itemId: item.id }));
            }
        });

        shopGrid.appendChild(slot);
    }
    refreshShopAffordability();
}

function openShop() {
    if (!shopOverlay || inMainMenu) return;
    if (isSettingsOpen) closeSettings();
    if (isWaveLeaderboardOpen) closeWaveLeaderboard();
    if (isLeaveDialogOpen) closeLeaveDialog();
    if (isSpectateDialogOpen) closeSpectateDialog();
    if (isModDialogOpen) closeModDialog();
    if (isAdminPanelOpen) closeAdminPanel();
    if (isMapExpanded) setMapExpanded(false);
    isShopOpen = true;
    clearHeldInputs();
    if (document.activeElement === chatInput) {
        closeChat();
    }
    hideShopTooltip();
    refreshShopUnitIcons();
    refreshShopAffordability();
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

function setMinimapMinimized(minimized) {
    isMinimapMinimized = Boolean(minimized);
    if (minimapWrapper) {
        minimapWrapper.classList.toggle('minimized', isMinimapMinimized);
    }
    if (minimapToggleBtn) {
        minimapToggleBtn.setAttribute('aria-expanded', isMinimapMinimized ? 'false' : 'true');
        minimapToggleBtn.setAttribute('aria-label', isMinimapMinimized ? 'Maximize map' : 'Minimize map');
    }
}

function setMapExpanded(expanded) {
    if (!mapOverlay) return;
    if (expanded && (inMainMenu || myId === null)) return;
    isMapExpanded = Boolean(expanded);
    if (isMapExpanded) {
        if (isSettingsOpen) closeSettings();
        if (isWaveLeaderboardOpen) closeWaveLeaderboard();
        if (isLeaveDialogOpen) closeLeaveDialog();
        if (isSpectateDialogOpen) closeSpectateDialog();
        if (isShopOpen) closeShop();
        if (isModDialogOpen) closeModDialog();
        if (isAdminPanelOpen) closeAdminPanel();
        if (document.activeElement === chatInput) {
            closeChat();
        }
    }
    mapOverlay.classList.toggle('open', isMapExpanded);
    mapOverlay.setAttribute('aria-hidden', isMapExpanded ? 'false' : 'true');
    syncCanvasCrosshairCursor();
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

let keepAliveTimerId = null;

async function measurePingOnce() {
    if (!ws || ws.readyState !== WebSocket.OPEN) return;
    ws.send(JSON.stringify({ type: 'ping', t: performance.now() }));
}

function sendClientKeepAliveHttp() {
    if (inMainMenu) return;
    const targetUrl = isNodeHostedOrigin() ? '/health' : (pingProbeUrl ? `${pingProbeUrl.replace(/\/+$/, '')}/health` : null);
    if (!targetUrl) return;
    fetch(targetUrl, { cache: 'no-store' }).catch(() => {});
}

function startPingMonitor(wsUrl) {
    pingProbeUrl = wsUrlToHttpProbe(wsUrl);
    if (pingTimerId === null) {
        pingTimerId = setInterval(measurePingOnce, 2500);
    }
    if (keepAliveTimerId === null) {
        keepAliveTimerId = setInterval(sendClientKeepAliveHttp, 180000);
    }
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
const sacrificeRarebotImg = new Image();
const scoutRarebotImg = new Image();
const botHandsImg = new Image();
const prototypeRarebotHandsImg = new Image();
const goodbotPistolImg = new Image();
const goodbotCannonImg = new Image();
const rarebotPistolImg = new Image();
const goodbotBulletImg = new Image();
const goodbotCannonBallImg = new Image();
const rarebotBulletImg = new Image();
const rarebotHealBulletImg = new Image();
const goodbotGrenadeImg = new Image();
const rarebotGrenadeImg = new Image();
const goodbotBeamerImg = new Image();
const goodbotAssaultLaserImg = new Image();
const rarebotAssaultLaserImg = new Image();
const goodbotArmorImg = new Image();
const rarebotArmorImg = new Image();
const rarebotHealerGunImg = new Image();
const rarebotDropshipImg = new Image();
const goodbotDropshipImg = new Image();
const rarebotDropshipRotorImg = new Image();
const goodbotDropshipRotorImg = new Image();
const mapbotImg = new Image();
const mapbotBlasterSide1Img = new Image();
const mapbotBlasterSide2Img = new Image();
const mapbotBlasterImg = new Image();
const mapbotClawsImg = new Image();
const mapbotCoreImg = new Image();
const mapbotChargingLaserImg = new Image();
const mapbotRocketImg = new Image();
const mapbotBlastImg = new Image();
const mapbotExplosionImg = new Image();

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
    laserCannonShot: 'sounds/laser cannon shot.mp3',
    bulletImpact1: 'sounds/bullet impact 1.mp3',
    bulletImpact2: 'sounds/bullet impact 2.mp3',
    bulletImpact3: 'sounds/bullet impact 3.mp3',
    bulletWallImpact: 'sounds/bullet wall impact.mp3',
    grapple1: 'sounds/grapple 1.mp3',
    dropslide: 'sounds/dropslide.mp3?v=2'
};
const soundBuffers = {
    swing: null,
    hit: null,
    explosion: null,
    hitReceive: null,
    hitDeal: null,
    laserShot: null,
    laserCannonShot: null,
    bulletImpact1: null,
    bulletImpact2: null,
    bulletImpact3: null,
    bulletWallImpact: null,
    grapple1: null,
    dropslide: null
};

function loadSoundBuffer(key, ctxAudio) {
    if (!ctxAudio || !SOUND_FILES[key] || soundBuffers[key]) return Promise.resolve();
    if (soundBufferPromises[key]) return soundBufferPromises[key];
    soundBufferPromises[key] = fetch(encodeURI(SOUND_FILES[key]), { cache: 'no-cache' })
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
    beamerShot: 0,
    laserCannonShot: 0,
    bulletImpact1: 0,
    bulletImpact2: 0,
    bulletImpact3: 0,
    bulletWallImpact: 0,
    grapple1: 0,
    dropslide: 0,
    mapbotCoreBlast: 0
};

function playSpatialSound(key, wx, wy, options = null) {
    const masterVol = window.GAME_AUDIO_SETTINGS ? Number(window.GAME_AUDIO_SETTINGS.soundVolume) : 1;
    if (!isFinite(masterVol) || masterVol <= 0.005) return;
    const nowMs = performance.now();
    const minGap = key === 'mapbotCoreBlast' ? 140 : (key === 'beamerShot' ? 110 : (key === 'bulletWallImpact' ? 70 : (key === 'explosion' ? 60 : ((key === 'swing' || key === 'hit') ? 45 : (key === 'dropslide' ? 40 : 15)))));
    if (nowMs - (lastSoundAt[key] || 0) < minGap) return;

    const ctxAudio = ensureAudioContext();
    if (!ctxAudio) return;

    const lx = myId !== null ? (ME.x + ME.width / 2) : ((WORLD.CAMERA.x || 0) + WORLD.CAMERA.width / 2);
    const ly = myId !== null ? (ME.y + ME.height / 2) : ((WORLD.CAMERA.y || 0) + WORLD.CAMERA.height / 2);
    const maxHearDist = key === 'mapbotCoreBlast' ? 1500 : 1080;
    let dist = 0;
    if (typeof wx === 'number' && typeof wy === 'number') {
        const dx = wx - lx;
        const dy = wy - ly;
        const dSq = dx * dx + dy * dy;
        if (dSq > maxHearDist * maxHearDist) return;
        dist = Math.sqrt(dSq);
    }
    const falloff = Math.max(0, Math.min(1, 1 - Math.max(0, dist - 80) / (maxHearDist - 80)));
    const optVolMult = (options && typeof options.volumeMult === 'number') ? options.volumeMult : 1;
    const volumeMult = (key === 'mapbotCoreBlast' ? 2.0 : (key === 'beamerShot' ? 0.55 : ((key === 'hitReceive' || key === 'hitDeal') ? 0.1 : (key === 'grapple1' ? 2.7 : 1)))) * optVolMult;
    const gainValue = falloff * falloff * masterVol * volumeMult;
    if (gainValue <= 0.005) return;

    const playbackRate = (options && typeof options.playbackRate === 'number')
        ? options.playbackRate
        : (key === 'mapbotCoreBlast' ? 0.34 : (key === 'beamerShot' ? 0.78 : 1));

    const bufferKey = key === 'mapbotCoreBlast' ? 'explosion' : (key === 'beamerShot' ? 'laserShot' : key);
    if (!soundBuffers[bufferKey]) {
        const reqAt = nowMs;
        loadSoundBuffer(bufferKey, ctxAudio).then(() => {
            if (!soundBuffers[bufferKey]) return;
            if (performance.now() - reqAt > 400) return;
            const curNow = performance.now();
            if (curNow - (lastSoundAt[key] || 0) < minGap) return;
            lastSoundAt[key] = curNow;
            try {
                const source = ctxAudio.createBufferSource();
                source.buffer = soundBuffers[bufferKey];
                if (playbackRate !== 1) {
                    source.playbackRate.value = playbackRate;
                }
                const gainNode = ctxAudio.createGain();
                gainNode.gain.value = gainValue;
                source.connect(gainNode);
                gainNode.connect(ctxAudio.destination);
                source.start(0);
            } catch (_) {}
        });
        return;
    }

    lastSoundAt[key] = nowMs;
    try {
        const source = ctxAudio.createBufferSource();
        source.buffer = soundBuffers[bufferKey];
        if (playbackRate !== 1) {
            source.playbackRate.value = playbackRate;
        }
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

let mapbotThemeBuffer = null;
let mapbotThemePromise = null;
let mapbotThemeSource = null;
let mapbotThemeGain = null;
let mapbotThemeLowpass = null;
let mapbotThemePanner = null;
let mapbotThemeNodes = [];
let mapbotThemeSilenceAt = 0;

function loadMapbotThemeBuffer(ctxAudio) {
    if (!ctxAudio || mapbotThemeBuffer) return Promise.resolve(mapbotThemeBuffer);
    if (mapbotThemePromise) return mapbotThemePromise;
    mapbotThemePromise = fetch(encodeURI('music/Mapbot Theme.mp3'), { cache: 'no-cache' })
        .then(res => (res.ok ? res.arrayBuffer() : null))
        .then(arr => (arr ? ctxAudio.decodeAudioData(arr) : null))
        .then(decoded => {
            if (decoded) mapbotThemeBuffer = decoded;
            return mapbotThemeBuffer;
        })
        .catch(() => null)
        .finally(() => {
            mapbotThemePromise = null;
        });
    return mapbotThemePromise;
}

function stopMapbotThemeAudio() {
    if (mapbotThemeSource) {
        try {
            mapbotThemeSource.onended = null;
            mapbotThemeSource.stop();
        } catch (_) {}
        try {
            mapbotThemeSource.disconnect();
        } catch (_) {}
        mapbotThemeSource = null;
    }
    for (let i = 0; i < mapbotThemeNodes.length; i++) {
        try {
            mapbotThemeNodes[i].disconnect();
        } catch (_) {}
    }
    mapbotThemeNodes = [];
    mapbotThemeGain = null;
    mapbotThemeLowpass = null;
    mapbotThemePanner = null;
    mapbotThemeSilenceAt = 0;
}

function startMapbotThemeAudio(ctxAudio) {
    if (!ctxAudio || !mapbotThemeBuffer || mapbotThemeSource) return;
    try {
        const source = ctxAudio.createBufferSource();
        source.buffer = mapbotThemeBuffer;
        source.loop = true;

        const highpass = ctxAudio.createBiquadFilter();
        highpass.type = 'highpass';
        highpass.frequency.value = 390;
        highpass.Q.value = 0.7;

        const peaking = ctxAudio.createBiquadFilter();
        peaking.type = 'peaking';
        peaking.frequency.value = 1050;
        peaking.Q.value = 1.05;
        peaking.gain.value = 2.0;

        const lowpass = ctxAudio.createBiquadFilter();
        lowpass.type = 'lowpass';
        lowpass.frequency.value = 1500;
        lowpass.Q.value = 0.75;

        const gainNode = ctxAudio.createGain();
        gainNode.gain.value = 0;

        let panner = null;
        if (typeof ctxAudio.createStereoPanner === 'function') {
            panner = ctxAudio.createStereoPanner();
            panner.pan.value = 0;
        }

        source.connect(highpass);
        highpass.connect(peaking);
        peaking.connect(lowpass);
        if (panner) {
            lowpass.connect(panner);
            panner.connect(gainNode);
            mapbotThemeNodes = [highpass, peaking, lowpass, panner, gainNode];
        } else {
            lowpass.connect(gainNode);
            mapbotThemeNodes = [highpass, peaking, lowpass, gainNode];
        }
        gainNode.connect(ctxAudio.destination);

        source.onended = () => {
            if (mapbotThemeSource === source) {
                stopMapbotThemeAudio();
            }
        };

        source.start(0);
        mapbotThemeSource = source;
        mapbotThemeGain = gainNode;
        mapbotThemeLowpass = lowpass;
        mapbotThemePanner = panner;
        mapbotThemeSilenceAt = 0;
    } catch (_) {
        stopMapbotThemeAudio();
    }
}

function updateMapbotThemeAudio() {
    if (!audioCtx) return;

    const musicVol = window.GAME_AUDIO_SETTINGS ? Number(window.GAME_AUDIO_SETTINGS.musicVolume) : 1;
    let closestDistSq = Infinity;
    let closestX = 0;
    let hasLivingMapbot = false;

    if (!inMainMenu && myId !== null) {
        const lx = ME.x + ME.width / 2;
        const ly = ME.y + ME.height / 2;
        for (const id in serverEnemies) {
            const e = serverEnemies[id];
            if (!e || (e.kind || 'rarebot') !== 'mapbot' || (e.health ?? 0) <= 0) continue;
            hasLivingMapbot = true;
            const ew = e.width || 48;
            const eh = e.height || 48;
            const ex = (e.renderX ?? e.x) + ew * 0.5;
            const ey = (e.renderY ?? e.y) + eh * 0.5;
            const dx = ex - lx;
            const dy = ey - ly;
            const dSq = dx * dx + dy * dy;
            if (dSq < closestDistSq) {
                closestDistSq = dSq;
                closestX = dx;
            }
        }
    }

    if (!hasLivingMapbot || !isFinite(musicVol) || musicVol <= 0.005) {
        if (mapbotThemeGain && mapbotThemeSource) {
            const tNow = audioCtx.currentTime;
            mapbotThemeGain.gain.setTargetAtTime(0, tNow, 0.08);
            const nowMs = performance.now();
            if (!mapbotThemeSilenceAt) mapbotThemeSilenceAt = nowMs;
            if (nowMs - mapbotThemeSilenceAt > 450) {
                stopMapbotThemeAudio();
            }
        }
        return;
    }

    mapbotThemeSilenceAt = 0;
    if (!mapbotThemeBuffer) {
        loadMapbotThemeBuffer(audioCtx);
        return;
    }
    if (audioCtx.state !== 'running') return;
    if (!mapbotThemeSource) {
        startMapbotThemeAudio(audioCtx);
    }
    if (!mapbotThemeGain || !mapbotThemeLowpass) return;

    const dist = Math.sqrt(closestDistSq);
    const minDist = 90;
    const maxDist = 1350;
    const falloff = Math.max(0, Math.min(1, 1 - Math.max(0, dist - minDist) / (maxDist - minDist)));
    const targetGain = falloff * falloff * 0.16 * musicVol;
    const targetLowpass = 920 + falloff * 960;
    const tNow = audioCtx.currentTime;

    mapbotThemeGain.gain.setTargetAtTime(targetGain, tNow, 0.08);
    mapbotThemeLowpass.frequency.setTargetAtTime(targetLowpass, tNow, 0.08);
    if (mapbotThemePanner) {
        const pan = Math.max(-0.8, Math.min(0.8, closestX / 620));
        mapbotThemePanner.pan.setTargetAtTime(pan, tNow, 0.08);
    }
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
    const rotDeg = ((Math.round(cell.r || 0) % 360) + 360) % 360;

    if (rotDeg === 0) {
        targetCtx.drawImage(tilesheetImg, sx, sy, sSize, sSize, dx, dy, tileSize, tileSize);
        return;
    }

    targetCtx.save();
    if (rotDeg === 90) {
        targetCtx.transform(0, 1, -1, 0, dx + tileSize, dy);
        targetCtx.drawImage(tilesheetImg, sx, sy, sSize, sSize, 0, 0, tileSize, tileSize);
    } else if (rotDeg === 180) {
        targetCtx.transform(-1, 0, 0, -1, dx + tileSize, dy + tileSize);
        targetCtx.drawImage(tilesheetImg, sx, sy, sSize, sSize, 0, 0, tileSize, tileSize);
    } else if (rotDeg === 270) {
        targetCtx.transform(0, -1, 1, 0, dx, dy + tileSize);
        targetCtx.drawImage(tilesheetImg, sx, sy, sSize, sSize, 0, 0, tileSize, tileSize);
    } else {
        targetCtx.translate(dx + tileSize / 2, dy + tileSize / 2);
        targetCtx.rotate((rotDeg * Math.PI) / 180);
        targetCtx.drawImage(tilesheetImg, sx, sy, sSize, sSize, -tileSize / 2, -tileSize / 2, tileSize, tileSize);
    }
    targetCtx.restore();
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

    if (!tilesheetImg.complete || tilesheetImg.naturalWidth === 0) {
        WORLD.MAP.fullMapCanvas = null;
        return;
    }
    const mapTilePx = 32;
    const fullW = WORLD.MAP.columns * mapTilePx;
    const fullH = WORLD.MAP.rows * mapTilePx;
    const fullCanvas = document.createElement('canvas');
    fullCanvas.width = fullW;
    fullCanvas.height = fullH;
    const fullCtx = fullCanvas.getContext('2d');
    fullCtx.imageSmoothingEnabled = false;
    fullCtx.clearRect(0, 0, fullW, fullH);
    const fullLayers = ['floor1', 'floor2', 'wall', 'tree'];
    const fullWallGrid = WORLD.MAP.mapData.wall;
    for (let li = 0; li < fullLayers.length; li++) {
        const fullLayerName = fullLayers[li];
        const grid = WORLD.MAP.mapData[fullLayerName];
        if (!grid) continue;
        for (let r = 0; r < WORLD.MAP.rows; r++) {
            const rowArr = grid[r];
            if (!rowArr) continue;
            const wallRow = fullWallGrid ? fullWallGrid[r] : null;
            for (let c = 0; c < WORLD.MAP.columns; c++) {
                const cell = rowArr[c];
                if (!cell) continue;
                if (fullLayerName === 'floor1' && cell.tx === 5 && cell.ty === 48 && wallRow && wallRow[c]) continue;
                const sInset = 0.5;
                const ts = WORLD.MAP.tileSize;
                const sSize = ts - sInset * 2;
                const sx = cell.tx * ts + sInset;
                const sy = cell.ty * ts + sInset;
                const rotDeg = ((Math.round(cell.r || 0) % 360) + 360) % 360;
                const dx = c * mapTilePx;
                const dy = r * mapTilePx;
                if (rotDeg === 0) {
                    fullCtx.drawImage(tilesheetImg, sx, sy, sSize, sSize, dx, dy, mapTilePx, mapTilePx);
                } else {
                    fullCtx.save();
                    if (rotDeg === 90) {
                        fullCtx.transform(0, 1, -1, 0, dx + mapTilePx, dy);
                        fullCtx.drawImage(tilesheetImg, sx, sy, sSize, sSize, 0, 0, mapTilePx, mapTilePx);
                    } else if (rotDeg === 180) {
                        fullCtx.transform(-1, 0, 0, -1, dx + mapTilePx, dy + mapTilePx);
                        fullCtx.drawImage(tilesheetImg, sx, sy, sSize, sSize, 0, 0, mapTilePx, mapTilePx);
                    } else if (rotDeg === 270) {
                        fullCtx.transform(0, -1, 1, 0, dx, dy + mapTilePx);
                        fullCtx.drawImage(tilesheetImg, sx, sy, sSize, sSize, 0, 0, mapTilePx, mapTilePx);
                    } else {
                        fullCtx.translate(dx + mapTilePx / 2, dy + mapTilePx / 2);
                        fullCtx.rotate((rotDeg * Math.PI) / 180);
                        fullCtx.drawImage(tilesheetImg, sx, sy, sSize, sSize, -mapTilePx / 2, -mapTilePx / 2, mapTilePx, mapTilePx);
                    }
                    fullCtx.restore();
                }
            }
        }
    }
    WORLD.MAP.fullMapCanvas = fullCanvas;
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
    const wallGrid = WORLD.MAP.mapData.wall;
    for (const layerName of layerOrder) {
        const grid = WORLD.MAP.mapData[layerName];
        if (!grid) continue;
        const targetCtx = layerName === 'tree' ? fgCtx : (layerName === 'wall' ? wcCtx : bgCtx);

        for (let r = startRow; r < endRow; r++) {
            const rowArr = grid[r];
            if (!rowArr) continue;
            const wallRow = wallGrid ? wallGrid[r] : null;
            for (let c = startCol; c < endCol; c++) {
                const cell = rowArr[c];
                if (cell) {
                    if (layerName === 'floor1' && cell.tx === 5 && cell.ty === 48 && wallRow && wallRow[c]) continue;
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
    const refreshIcons = () => {
        calibratedWeaponMetrics.clear();
        scaledSpriteCache.clear();
        refreshAdminSpawnIcons();
        refreshShopUnitIcons();
    };
    goodbotImg.onload = refreshIcons;
    rarebotImg.onload = refreshIcons;
    prototypeRarebotImg.onload = refreshIcons;
    sacrificeRarebotImg.onload = refreshIcons;
    scoutRarebotImg.onload = refreshIcons;
    botHandsImg.onload = refreshIcons;
    prototypeRarebotHandsImg.onload = refreshIcons;
    goodbotPistolImg.onload = refreshIcons;
    goodbotCannonImg.onload = refreshIcons;
    rarebotPistolImg.onload = refreshIcons;
    goodbotBeamerImg.onload = refreshIcons;
    goodbotAssaultLaserImg.onload = refreshIcons;
    rarebotAssaultLaserImg.onload = refreshIcons;
    goodbotArmorImg.onload = refreshIcons;
    rarebotArmorImg.onload = refreshIcons;
    rarebotHealerGunImg.onload = refreshIcons;
    rarebotDropshipImg.onload = refreshIcons;
    goodbotDropshipImg.onload = refreshIcons;
    rarebotDropshipRotorImg.onload = refreshIcons;
    goodbotDropshipRotorImg.onload = refreshIcons;
    mapbotImg.onload = refreshIcons;
    mapbotBlasterSide1Img.onload = refreshIcons;
    mapbotBlasterSide2Img.onload = refreshIcons;
    mapbotBlasterImg.onload = refreshIcons;
    mapbotClawsImg.onload = refreshIcons;
    mapbotCoreImg.onload = refreshIcons;
    mapbotChargingLaserImg.onload = refreshIcons;
    mapbotRocketImg.onload = refreshIcons;
    mapbotBlastImg.onload = refreshIcons;
    mapbotExplosionImg.onload = refreshIcons;
    goodbotImg.src = 'assets/Goodbot.png';
    rarebotImg.src = 'assets/Rarebot.png';
    prototypeRarebotImg.src = 'assets/Prototype Rarebot.png';
    sacrificeRarebotImg.src = 'assets/Sacrifice Rarebot.png?v=3';
    scoutRarebotImg.src = 'assets/Scout Rarebot.png?v=3';
    botHandsImg.src = 'assets/Bot Hands.png';
    prototypeRarebotHandsImg.src = 'assets/Prototype Rarebot Hands.png';
    goodbotPistolImg.src = 'assets/Goodbot Pistol.png';
    goodbotCannonImg.src = 'assets/Goodbot Cannon.png';
    rarebotPistolImg.src = 'assets/Rarebot Pistol.png';
    goodbotBeamerImg.src = 'assets/Goodbot Beamer.png';
    goodbotAssaultLaserImg.src = 'assets/Goodbot Assault Laser.png';
    rarebotAssaultLaserImg.src = 'assets/Rarebot Assault Laser.png';
    goodbotArmorImg.src = 'assets/Goodbot Armor.png';
    rarebotArmorImg.src = 'assets/Rarebot Armor.png';
    rarebotHealerGunImg.src = 'assets/Rarebot Healer Gun.png';
    goodbotBulletImg.src = 'assets/Goodbot Bullet.png';
    goodbotCannonBallImg.src = 'assets/Goodbot Cannon Ball.png';
    rarebotBulletImg.src = 'assets/Rarebot Bullet.png';
    rarebotHealBulletImg.src = 'assets/Rarebot Heal Bullet.png';
    goodbotGrenadeImg.src = 'assets/Goodbot Grenade.png';
    rarebotGrenadeImg.src = 'assets/Rarebot Grenade.png';
    rarebotDropshipImg.src = 'assets/Rarebot Dropship.png';
    goodbotDropshipImg.src = 'assets/Goodbot Dropship.png';
    rarebotDropshipRotorImg.src = 'assets/Rarebot Dropship Rotor.png';
    goodbotDropshipRotorImg.src = 'assets/Goodbot Dropship Rotor.png';
    mapbotImg.src = 'assets/Mapbot.png';
    mapbotBlasterSide1Img.src = 'assets/Mapbot Blaster Side 1.png';
    mapbotBlasterSide2Img.src = 'assets/Mapbot Blaster Side 2.png';
    mapbotBlasterImg.src = 'assets/Mapbot Blaster.png';
    mapbotClawsImg.src = 'assets/Mapbot Claws.png';
    mapbotCoreImg.src = 'assets/Mapbot Core.png?v=3';
    mapbotChargingLaserImg.src = 'assets/Mapbot Charging Laser.png';
    mapbotRocketImg.src = 'assets/Mapbot Rocket.png';
    mapbotBlastImg.src = 'assets/Mapbot Blast.png?v=3';
    mapbotExplosionImg.src = 'assets/Mapbot Explosion.png';
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
        refreshShopAffordability();
    }
}

function updateBossHealthBar() {
    if (!bossBarsContainer || bossBarSlots.length === 0) return;
    const activeBosses = [];
    for (const id in serverEnemies) {
        const e = serverEnemies[id];
        if ((e.kind === 'mapbot' || e.kind === 'dropship') && (e.health || 0) > 0) {
            const isMapbot = e.kind === 'mapbot';
            activeBosses.push({
                priority: isMapbot ? 0 : 1,
                id: Number(id) || 0,
                entity: e,
                defaultFaction: isMapbot ? 'mapbot' : 'rarebot',
                defaultName: isMapbot ? 'Mapbot' : 'Rarebot Dropship',
                defaultMaxHp: isMapbot ? 100000 : 8000
            });
        }
    }
    for (const id in serverAllies) {
        const a = serverAllies[id];
        if (a.kind === 'dropship' && (a.health || 0) > 0) {
            activeBosses.push({
                priority: 2,
                id: Number(id) || 0,
                entity: a,
                defaultFaction: 'goodbot',
                defaultName: 'Goodbot Dropship',
                defaultMaxHp: 8000
            });
        }
    }
    if (activeBosses.length === 0) {
        bossBarsContainer.classList.add('hidden');
        for (let i = 0; i < bossBarSlots.length; i++) {
            const slot = bossBarSlots[i];
            slot.el.classList.add('hidden');
            slot.el.classList.remove('rarebot-boss', 'ally-boss', 'mapbot-boss');
        }
        return;
    }
    activeBosses.sort((a, b) => (a.priority - b.priority) || (a.id - b.id));
    const maxStacks = Math.min(3, bossBarSlots.length);
    const shownCount = Math.min(maxStacks, activeBosses.length);
    bossBarsContainer.classList.remove('hidden');
    for (let i = 0; i < bossBarSlots.length; i++) {
        const slot = bossBarSlots[i];
        if (i >= shownCount) {
            slot.el.classList.add('hidden');
            slot.el.classList.remove('rarebot-boss', 'ally-boss', 'mapbot-boss');
            continue;
        }
        const item = activeBosses[i];
        const boss = item.entity;
        const bossFaction = boss.faction || item.defaultFaction;
        slot.el.classList.remove('hidden');
        slot.el.classList.toggle('rarebot-boss', bossFaction === 'rarebot');
        slot.el.classList.toggle('ally-boss', bossFaction === 'goodbot');
        slot.el.classList.toggle('mapbot-boss', bossFaction === 'mapbot');
        if (slot.title) slot.title.textContent = boss.name || item.defaultName;
        const maxHp = Math.max(1, Math.round(boss.maxHealth || item.defaultMaxHp));
        const hp = Math.max(0, Math.min(maxHp, Math.round(boss.health || 0)));
        if (slot.fill) slot.fill.style.width = `${(hp / maxHp) * 100}%`;
        if (slot.value) slot.value.textContent = `${hp} / ${maxHp}`;
    }
}

function applyGameStateUI(state) {
    if (!state || typeof state !== 'object') return;
    if (typeof state.allyCount === 'number' && isFinite(state.allyCount)) {
        currentAllyCount = Math.max(0, Math.floor(state.allyCount));
    }
    if (typeof state.maxAllies === 'number' && isFinite(state.maxAllies) && state.maxAllies > 0) {
        maxAlliesCount = Math.floor(state.maxAllies);
    }
    refreshShopAffordability();
    if (goodbotsCount && typeof state.goodbots === 'number') {
        goodbotsCount.textContent = String(Math.max(0, Math.floor(state.goodbots)));
    }
    if (rarebotsCount && typeof state.rarebots === 'number') {
        rarebotsCount.textContent = String(Math.max(0, Math.floor(state.rarebots)));
    }
    if (waveCount && typeof state.wave === 'number') {
        waveCount.textContent = String(Math.max(0, Math.floor(state.wave)));
    }

    if (typeof state.regionError === 'string' && state.regionError) {
        if (gameStateTitle) gameStateTitle.textContent = 'Map Region Error';
        if (gameStateDivider) gameStateDivider.classList.remove('hidden');
        if (gameStateDesc) {
            gameStateDesc.textContent = state.regionError;
            gameStateDesc.classList.remove('hidden');
        }
        if (gameStartBtn) gameStartBtn.classList.add('hidden');
        return;
    }

    lastGameStateData = state;
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
        if (gameStartBtn) {
            if (ME.faction !== 'goodbot') {
                gameStartBtn.classList.add('hidden');
                gameStartBtn.classList.remove('voted');
            } else {
                gameStartBtn.classList.remove('hidden');
                const votes = Number(state.startVotes) || 0;
                const req = Math.max(1, Number(state.requiredVotes) || 1);
                const voted = state.hasVoted === true;
                gameStartBtn.classList.toggle('voted', voted);
                if (req <= 1 && !voted) {
                    gameStartBtn.textContent = 'Skip';
                } else {
                    gameStartBtn.textContent = voted ? `Skipping (${votes}/${req})` : `Skip (${votes}/${req})`;
                }
            }
        }
        return;
    }

    const waveNum = Math.max(1, Math.floor(Number(state.wave) || 1));
    if (gameStateTitle) gameStateTitle.textContent = `Wave: ${waveNum}`;
    if (gameStateDivider) gameStateDivider.classList.remove('hidden');
    if (gameStateDesc) {
        gameStateDesc.textContent = 'Eliminate all the enemies';
        gameStateDesc.classList.remove('hidden');
    }
    if (gameStartBtn) {
        gameStartBtn.classList.add('hidden');
        gameStartBtn.classList.remove('voted');
    }
}

function updateLeaderboard(entries) {
    lastMatchLeaderboardEntries = Array.isArray(entries) ? entries : [];
    if (!leaderboardList) return;

    if (activeLeaderboardTab === 'waves') {
        const topWaves = waveLeaderboardEntries.slice(0, 10);
        const waveSig = 'waves|' + topWaves.map(e => `${e.rank}\t${e.name}\t${e.highestWave}`).join('\n');
        if (waveSig === lastLeaderboardSig) return;
        lastLeaderboardSig = waveSig;
        leaderboardList.textContent = '';

        const spacerEl = document.createElement('span');
        const colLabelEl = document.createElement('span');
        colLabelEl.className = 'leaderboard-col-label';
        colLabelEl.textContent = 'wave';
        leaderboardList.appendChild(spacerEl);
        leaderboardList.appendChild(colLabelEl);

        if (topWaves.length === 0) {
            const emptyEl = document.createElement('span');
            emptyEl.className = 'leaderboard-empty';
            emptyEl.textContent = 'No records yet';
            leaderboardList.appendChild(emptyEl);
            return;
        }

        for (let i = 0; i < topWaves.length; i++) {
            const entry = topWaves[i];
            const nameEl = document.createElement('span');
            nameEl.className = 'leaderboard-name';
            nameEl.textContent = `#${entry.rank} ${entry.name}`;
            const scoreEl = document.createElement('span');
            scoreEl.className = 'leaderboard-score';
            scoreEl.textContent = `W${entry.highestWave}`;
            leaderboardList.appendChild(nameEl);
            leaderboardList.appendChild(scoreEl);
        }
        return;
    }

    const sig = 'match|' + lastMatchLeaderboardEntries.map(e => `${e.name}\t${e.scraps}\t${e.faction || 'goodbot'}\t${e.isAdmin ? 1 : 0}`).join('\n');
    if (sig === lastLeaderboardSig) return;
    lastLeaderboardSig = sig;
    leaderboardList.textContent = '';

    const spacerEl = document.createElement('span');
    const colLabelEl = document.createElement('span');
    colLabelEl.className = 'leaderboard-col-label';
    colLabelEl.textContent = 'scraps';
    leaderboardList.appendChild(spacerEl);
    leaderboardList.appendChild(colLabelEl);

    for (let i = 0; i < lastMatchLeaderboardEntries.length; i++) {
        const entry = lastMatchLeaderboardEntries[i];
        const nameEl = document.createElement('span');
        let factionClass = '';
        if (entry.faction === 'rarebot') factionClass = ' leaderboard-name-rarebot';
        else if (entry.faction === 'spectator') factionClass = ' leaderboard-name-spectator';
        nameEl.className = 'leaderboard-name' + factionClass;
        nameEl.textContent = formatDisplayName(entry.name, Boolean(entry.isAdmin));
        const scoreEl = document.createElement('span');
        scoreEl.className = 'leaderboard-score';
        scoreEl.textContent = String(entry.scraps);
        leaderboardList.appendChild(nameEl);
        leaderboardList.appendChild(scoreEl);
    }
}

function appendChatLog(name, text, faction = 'goodbot', isAdminFlag = false) {
    if (!chatLog) return;
    const entry = document.createElement('div');
    entry.className = 'chat-log-entry';
    const nameEl = document.createElement('span');
    let factionClass = '';
    if (faction === 'rarebot') factionClass = ' chat-log-name-rarebot';
    else if (faction === 'spectator') factionClass = ' chat-log-name-spectator';
    nameEl.className = 'chat-log-name' + factionClass;
    nameEl.textContent = formatDisplayName(name, Boolean(isAdminFlag));
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
    if (prevSlot !== idx) {
        isBeamerActive = false;
    }
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

    const roundedAngle = Math.round(ME.angle * 100) / 100;
    let angleDiff = Math.abs(roundedAngle - lastSentAngle);
    if (angleDiff > Math.PI) angleDiff = Math.abs(angleDiff - Math.PI * 2);

    const now = performance.now();
    if (!force && !keysChanged) {
        if (angleDiff <= 0.06 || now - lastInputSendTime < 90) return;
    }

    lastInputKeySig = keySig;
    lastSentAngle = roundedAngle;
    lastInputSendTime = now;

    ws.send(JSON.stringify({
        type: 'input',
        up: input.up,
        down: input.down,
        left: input.left,
        right: input.right,
        sprint: input.sprint,
        angle: roundedAngle
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

    const worldW = WORLD.MAP.columns * WORLD.MAP.tileSize;
    const worldH = WORLD.MAP.rows * WORLD.MAP.tileSize;

    for (const id in serverEnemies) {
        const e = serverEnemies[id];
        if (e.renderX === undefined) {
            e.renderX = e.x;
            e.renderY = e.y;
            e.renderAngle = e.angle || 0;
            e.renderJumpHeight = e.jumpHeight || 0;
        }

        const eMaxX = Math.max(0, worldW - (e.width || 48));
        const eMaxY = Math.max(0, worldH - (e.height || 48));
        e.x = Math.max(0, Math.min(eMaxX, e.x + (e.vx || 0) * dt));
        e.y = Math.max(0, Math.min(eMaxY, e.y + (e.vy || 0) * dt));

        const lerpRate = e.airborne ? 28 : 20;
        const lerpF = 1 - Math.exp(-dt * lerpRate);
        const rdx = e.x - e.renderX;
        const rdy = e.y - e.renderY;
        const rdist = Math.sqrt(rdx * rdx + rdy * rdy);
        const maxStep = e.airborne ? 420 : 200;
        if (rdist > maxStep) {
            e.renderX = e.x - (rdx / rdist) * maxStep;
            e.renderY = e.y - (rdy / rdist) * maxStep;
        }
        e.renderX += (e.x - e.renderX) * lerpF;
        e.renderY += (e.y - e.renderY) * lerpF;
        e.renderJumpHeight = (e.renderJumpHeight || 0) + ((e.jumpHeight || 0) - (e.renderJumpHeight || 0)) * lerpF;

        let diff = (e.angle || 0) - e.renderAngle;
        while (diff < -Math.PI) diff += Math.PI * 2;
        while (diff > Math.PI) diff -= Math.PI * 2;
        e.renderAngle += diff * (1 - Math.exp(-dt * 20));
    }

    for (const id in serverAllies) {
        const a = serverAllies[id];
        if (a.renderX === undefined) {
            a.renderX = a.x;
            a.renderY = a.y;
            a.renderAngle = a.angle || 0;
        }

        const aMaxX = Math.max(0, worldW - (a.width || 48));
        const aMaxY = Math.max(0, worldH - (a.height || 48));
        a.x = Math.max(0, Math.min(aMaxX, a.x + (a.vx || 0) * dt));
        a.y = Math.max(0, Math.min(aMaxY, a.y + (a.vy || 0) * dt));

        const lerpF = 1 - Math.exp(-dt * 20);
        const rdx = a.x - a.renderX;
        const rdy = a.y - a.renderY;
        const rdist = Math.sqrt(rdx * rdx + rdy * rdy);
        const maxStep = 200;
        if (rdist > maxStep) {
            a.renderX = a.x - (rdx / rdist) * maxStep;
            a.renderY = a.y - (rdy / rdist) * maxStep;
        }
        a.renderX += (a.x - a.renderX) * lerpF;
        a.renderY += (a.y - a.renderY) * lerpF;

        let diff = (a.angle || 0) - a.renderAngle;
        while (diff < -Math.PI) diff += Math.PI * 2;
        while (diff > Math.PI) diff -= Math.PI * 2;
        a.renderAngle += diff * (1 - Math.exp(-dt * 20));
    }

    sprintAnimSeq++;
    if (!inMainMenu && myId !== null) {
        if (ME.energy <= 0) meLocalExhausted = true;
        if (!WORLD.INPUTS.keys.shift || ME.energy >= 15) meLocalExhausted = false;
        const meMoveInput = WORLD.INPUTS.keys.w || WORLD.INPUTS.keys.s || WORLD.INPUTS.keys.a || WORLD.INPUTS.keys.d ||
            WORLD.INPUTS.keys.arrowup || WORLD.INPUTS.keys.arrowdown || WORLD.INPUTS.keys.arrowleft || WORLD.INPUTS.keys.arrowright;
        const meIntentSprint = ME.faction !== 'spectator' && (
            Boolean(ME.sprinting) ||
            (WORLD.INPUTS.keys.shift && meMoveInput && ME.energy > 0 && !meLocalExhausted)
        );
        let meAnimVx = ME.vx;
        let meAnimVy = ME.vy;
        if (meIntentSprint && Math.hypot(meAnimVx, meAnimVy) < 20 && meMoveInput) {
            const ix = (WORLD.INPUTS.keys.d || WORLD.INPUTS.keys.arrowright ? 1 : 0) - (WORLD.INPUTS.keys.a || WORLD.INPUTS.keys.arrowleft ? 1 : 0);
            const iy = (WORLD.INPUTS.keys.s || WORLD.INPUTS.keys.arrowdown ? 1 : 0) - (WORLD.INPUTS.keys.w || WORLD.INPUTS.keys.arrowup ? 1 : 0);
            const ilen = Math.hypot(ix, iy);
            if (ilen > 0) {
                meAnimVx = (ix / ilen) * 260;
                meAnimVy = (iy / ilen) * 260;
            }
        }
        stepEntitySprintAnim(
            `player:${myId}`,
            meIntentSprint,
            meAnimVx,
            meAnimVy,
            ME.angle,
            ME.x + ME.width * 0.5,
            ME.y + ME.height * 0.5,
            ME.width * 0.5,
            dt,
            sprintAnimSeq,
            true
        );

        for (const id in serverPlayers) {
            const p = serverPlayers[id];
            if ((p.faction || 'goodbot') === 'spectator') continue;
            const pw = p.width || 48;
            const ph = p.height || 48;
            stepEntitySprintAnim(
                `player:${id}`,
                Boolean(p.sprinting),
                p.vx || 0,
                p.vy || 0,
                p.renderAngle ?? p.angle ?? 0,
                (p.renderX ?? p.x) + pw * 0.5,
                (p.renderY ?? p.y) + ph * 0.5,
                pw * 0.5,
                dt,
                sprintAnimSeq,
                false
            );
        }

        for (const id in serverEnemies) {
            const e = serverEnemies[id];
            if ((e.kind || 'rarebot') === 'dropship') continue;
            const ew = e.width || 48;
            const eh = e.height || 48;
            stepEntitySprintAnim(
                `enemy:${id}`,
                Boolean(e.sprinting),
                e.vx || 0,
                e.vy || 0,
                e.renderAngle ?? e.angle ?? 0,
                (e.renderX ?? e.x) + ew * 0.5,
                (e.renderY ?? e.y) + eh * 0.5,
                ew * 0.5,
                dt,
                sprintAnimSeq,
                false
            );
        }

        for (const id in serverAllies) {
            const a = serverAllies[id];
            if (a.kind === 'dropship') continue;
            const aw = a.width || 48;
            const ah = a.height || 48;
            stepEntitySprintAnim(
                `ally:${id}`,
                Boolean(a.sprinting),
                a.vx || 0,
                a.vy || 0,
                a.renderAngle ?? a.angle ?? 0,
                (a.renderX ?? a.x) + aw * 0.5,
                (a.renderY ?? a.y) + ah * 0.5,
                aw * 0.5,
                dt,
                sprintAnimSeq,
                false
            );
        }
    }
    for (const [key, anim] of sprintAnims) {
        if (anim.seq !== sprintAnimSeq) {
            sprintAnims.delete(key);
        }
    }

    for (const [id, proj] of serverProjectiles) {
        proj.x += proj.vx * dt;
        proj.y += proj.vy * dt;
        proj.age += dt;
        if (proj.kind === 'cannonball' || proj.variant === 'goodbot-cannon') {
            proj.spinAngle = (proj.spinAngle || 0) + 14 * dt;
            proj.particleAccum = (proj.particleAccum || 0) + dt;
            while (proj.particleAccum >= 0.022) {
                proj.particleAccum -= 0.022;
                spawnCannonTrailParticle(proj.x, proj.y);
            }
        }
        if (proj.age >= 2.0) {
            serverProjectiles.delete(id);
        }
    }

    if (serverRockets.size > 0) {
        const rLerp = 1 - Math.exp(-dt * 24);
        const rAngLerp = 1 - Math.exp(-dt * 22);
        for (const [, r] of serverRockets) {
            r.x += (r.tx - r.x) * rLerp;
            r.y += (r.ty - r.y) * rLerp;
            let diff = r.angle - r.renderAngle;
            while (diff < -Math.PI) diff += Math.PI * 2;
            while (diff > Math.PI) diff -= Math.PI * 2;
            r.renderAngle += diff * rAngLerp;
            r.trailAccum = (r.trailAccum || 0) + dt;
            while (r.trailAccum >= 0.032) {
                r.trailAccum -= 0.032;
                if (explosions.length >= MAX_EXPLOSION_PARTICLES) {
                    explosions.shift();
                }
                const backAng = r.renderAngle + Math.PI * 0.5 + (Math.random() - 0.5) * 0.45;
                const spd = 25 + Math.random() * 55;
                explosions.push({
                    x: r.x - Math.sin(r.renderAngle) * 14 + (Math.random() - 0.5) * 4,
                    y: r.y + Math.cos(r.renderAngle) * 14 + (Math.random() - 0.5) * 4,
                    vx: Math.cos(backAng) * spd,
                    vy: Math.sin(backAng) * spd,
                    radius: 3 + Math.random() * 3.5,
                    life: 0.2 + Math.random() * 0.16,
                    age: 0,
                    color: GRENADE_EXPLOSION_COLORS[Math.floor(Math.random() * GRENADE_EXPLOSION_COLORS.length)]
                });
            }
        }
    }

    for (let i = raycastBeams.length - 1; i >= 0; i--) {
        const b = raycastBeams[i];
        b.age += dt;
        if (b.age >= b.life) {
            raycastBeams[i] = raycastBeams[raycastBeams.length - 1];
            raycastBeams.pop();
        }
    }

    if (dropslideEmitters.length > 0) {
        for (let i = dropslideEmitters.length - 1; i >= 0; i--) {
            const em = dropslideEmitters[i];
            em.remaining -= dt;
            if (em.kind === 'enemy' && serverEnemies[em.id]) {
                const ent = serverEnemies[em.id];
                em.x = (ent.renderX ?? ent.x) + (ent.width || 48) * 0.5;
                em.y = (ent.renderY ?? ent.y) + (ent.height || 48) * 0.5;
            } else if (em.kind === 'ally' && serverAllies[em.id]) {
                const ent = serverAllies[em.id];
                em.x = (ent.renderX ?? ent.x) + (ent.width || 48) * 0.5;
                em.y = (ent.renderY ?? ent.y) + (ent.height || 48) * 0.5;
            } else if (em.kind === 'player' && serverPlayers[em.id]) {
                const ent = serverPlayers[em.id];
                em.x = (ent.renderX ?? ent.x) + (ent.width || 48) * 0.5;
                em.y = (ent.renderY ?? ent.y) + (ent.height || 48) * 0.5;
            }
            em.accum += dt;
            while (em.accum >= 0.015) {
                em.accum -= 0.015;
                spawnDropslideWhiteParticles(em.x, em.y, em.dx, em.dy, 2);
            }
            if (em.remaining <= 0) {
                dropslideEmitters[i] = dropslideEmitters[dropslideEmitters.length - 1];
                dropslideEmitters.pop();
            }
        }
    }

    if (dropslideParticles.length > 0) {
        const drag = Math.pow(0.06, dt);
        for (let i = dropslideParticles.length - 1; i >= 0; i--) {
            const pt = dropslideParticles[i];
            pt.age += dt;
            if (pt.age >= pt.life) {
                dropslideParticles[i] = dropslideParticles[dropslideParticles.length - 1];
                dropslideParticles.pop();
                continue;
            }
            pt.x += pt.vx * dt;
            pt.y += pt.vy * dt;
            pt.vx *= drag;
            pt.vy *= drag;
        }
    }

    if (sprintDustParticles.length > 0) {
        const dustDrag = Math.pow(0.08, dt);
        for (let i = sprintDustParticles.length - 1; i >= 0; i--) {
            const pt = sprintDustParticles[i];
            pt.age += dt;
            if (pt.age >= pt.life) {
                sprintDustParticles[i] = sprintDustParticles[sprintDustParticles.length - 1];
                sprintDustParticles.pop();
                continue;
            }
            pt.x += pt.vx * dt;
            pt.y += pt.vy * dt;
            pt.vx *= dustDrag;
            pt.vy *= dustDrag;
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

    for (let i = healParticles.length - 1; i >= 0; i--) {
        const hpObj = healParticles[i];
        let tx = 0;
        let ty = 0;
        let validTarget = false;
        if (hpObj.targetId === myId && ME.faction === 'goodbot') {
            tx = ME.x + ME.width * 0.5;
            ty = ME.y + ME.height * 0.5;
            validTarget = true;
        } else if (serverPlayers[hpObj.targetId] && serverPlayers[hpObj.targetId].faction === 'goodbot') {
            const tp = serverPlayers[hpObj.targetId];
            tx = (tp.renderX ?? tp.x) + (tp.width || 48) * 0.5;
            ty = (tp.renderY ?? tp.y) + (tp.height || 48) * 0.5;
            validTarget = true;
        }
        if (!validTarget) {
            healParticles[i] = healParticles[healParticles.length - 1];
            healParticles.pop();
            continue;
        }
        hpObj.age += dt;
        if (hpObj.age < hpObj.growDur) {
            const t = Math.max(0, hpObj.age / hpObj.growDur);
            const ease = 1 - Math.pow(1 - t, 3);
            hpObj.curR = hpObj.r * ease;
            hpObj.x = hpObj.startX + hpObj.ox * ease;
            hpObj.y = hpObj.startY + hpObj.oy * ease;
        } else {
            hpObj.curR = hpObj.r;
            const dx = tx - hpObj.x;
            const dy = ty - hpObj.y;
            const dist = Math.hypot(dx, dy);
            const step = hpObj.speed * dt;
            if (dist <= 26 || step >= dist || hpObj.age >= 4.0) {
                if (hpObj.hp > 0) {
                    let merged = false;
                    for (let j = floatingTexts.length - 1; j >= 0; j--) {
                        const ft = floatingTexts[j];
                        if (ft.isKillHeal && ft.playerId === hpObj.targetId && ft.age < 0.4) {
                            ft.healSum = (ft.healSum || 0) + hpObj.hp;
                            ft.text = `+${Math.round(ft.healSum)}`;
                            ft.age = Math.min(ft.age, 0.12);
                            merged = true;
                            break;
                        }
                    }
                    if (!merged) {
                        floatingTexts.push({
                            playerId: hpObj.targetId,
                            x: tx,
                            y: ty - 34,
                            text: `+${Math.round(hpObj.hp)}`,
                            color: '#32ff32',
                            age: 0,
                            life: 1.1,
                            isKillHeal: true,
                            healSum: hpObj.hp
                        });
                    }
                }
                healParticles[i] = healParticles[healParticles.length - 1];
                healParticles.pop();
            } else {
                const inv = 1 / dist;
                hpObj.x += dx * inv * step;
                hpObj.y += dy * inv * step;
                hpObj.speed += 320 * dt;
            }
        }
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

    for (let i = hitPointMarkers.length - 1; i >= 0; i--) {
        const m = hitPointMarkers[i];
        m.age += dt;
        if (m.age >= m.life) {
            hitPointMarkers[i] = hitPointMarkers[hitPointMarkers.length - 1];
            hitPointMarkers.pop();
        }
    }

    for (let i = activeDamageHitboxes.length - 1; i >= 0; i--) {
        const hb = activeDamageHitboxes[i];
        hb.age += dt;
        if (hb.age >= hb.life) {
            activeDamageHitboxes[i] = activeDamageHitboxes[activeDamageHitboxes.length - 1];
            activeDamageHitboxes.pop();
        }
    }

    for (let i = grenadeShockwaves.length - 1; i >= 0; i--) {
        const w = grenadeShockwaves[i];
        w.age += dt;
        if (w.age >= w.life) {
            grenadeShockwaves[i] = grenadeShockwaves[grenadeShockwaves.length - 1];
            grenadeShockwaves.pop();
        }
    }

    for (let i = mapbotExplosions.length - 1; i >= 0; i--) {
        const me = mapbotExplosions[i];
        me.age += dt;
        if (me.age >= me.life) {
            mapbotExplosions[i] = mapbotExplosions[mapbotExplosions.length - 1];
            mapbotExplosions.pop();
        }
    }


    const nowMs = performance.now();
    updateAbilitySlotCooldown(nowMs);
    const isBeamerEquipped = getMyEquippedWeapon() === 'goodbot-beamer';
    if (!isBeamerEquipped || ME.faction !== 'goodbot') {
        isBeamerActive = false;
    }
    const crosshairClosing = isRangedCrosshairActive() && (isAttackHeld || isBeamerActive || (nowMs - lastLocalShotAt < 260));
    crosshairGap = crosshairClosing ? 1 : 9;
    syncCanvasCrosshairCursor();

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

    if ((isAttackHeld || (isBeamerEquipped && isBeamerActive)) && !inMainMenu && myId !== null && !isSettingsOpen && !isWaveLeaderboardOpen && !isLeaveDialogOpen && !isShopOpen && !isModDialogOpen && !isAdminPanelOpen && !isMapExpanded && document.activeElement !== chatInput && (!tokenInput || document.activeElement !== tokenInput)) {
        triggerAttack(true);
    }

    if (SETTINGS.cameraShake && camShakeTrauma > 0.001) {
        camShakeTrauma = Math.max(0, camShakeTrauma - dt * 2.4);
        const shakeMag = camShakeTrauma * camShakeTrauma * 14;
        const shakeAng = Math.random() * Math.PI * 2;
        camShakeOffsetX = Math.cos(shakeAng) * shakeMag;
        camShakeOffsetY = Math.sin(shakeAng) * shakeMag;
    } else {
        camShakeTrauma = 0;
        camShakeOffsetX = 0;
        camShakeOffsetY = 0;
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

function spawnGrenadeExplosionParticles(wx, wy, radius = 192, variant = 'goodbot') {
    const isRarebot = variant === 'rarebot';
    const palette = isRarebot ? RAREBOT_GRENADE_EXPLOSION_COLORS : GRENADE_EXPLOSION_COLORS;
    grenadeShockwaves.push({
        x: wx,
        y: wy,
        radius,
        age: 0,
        life: isRarebot ? 0.5 : 0.44,
        isExplosionFlash: true,
        variant: isRarebot ? 'rarebot' : 'goodbot'
    });
    const count = isRarebot ? 54 : 44;
    for (let i = 0; i < count; i++) {
        if (explosions.length >= MAX_EXPLOSION_PARTICLES) {
            explosions.shift();
        }
        const angle = (Math.PI * 2 * i) / count + (Math.random() - 0.5) * 0.45;
        const speed = (isRarebot ? 180 : 150) + Math.random() * (isRarebot ? 390 : 340);
        explosions.push({
            x: wx + (Math.random() - 0.5) * 18,
            y: wy + (Math.random() - 0.5) * 18,
            vx: Math.cos(angle) * speed,
            vy: Math.sin(angle) * speed,
            radius: (isRarebot ? 10.5 : 9) + Math.random() * 14,
            life: 0.45 + Math.random() * 0.4,
            age: 0,
            color: palette[Math.floor(Math.random() * palette.length)]
        });
    }
}

function spawnBulletWallParticles(wx, wy, variant) {
    const palette = variant === 'rarebot' ? RAREBOT_BULLET_EXPLOSION_COLORS : GOODBOT_BULLET_EXPLOSION_COLORS;
    const count = variant === 'goodbot-beamer' ? 4 : 12;
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

function spawnCannonTrailParticle(wx, wy) {
    if (explosions.length >= MAX_EXPLOSION_PARTICLES) {
        explosions.shift();
    }
    const ang = Math.random() * Math.PI * 2;
    const spd = 22 + Math.random() * 68;
    explosions.push({
        x: wx + (Math.random() - 0.5) * 18,
        y: wy + (Math.random() - 0.5) * 18,
        vx: Math.cos(ang) * spd,
        vy: Math.sin(ang) * spd,
        radius: 4.5 + Math.random() * 5.5,
        life: 0.24 + Math.random() * 0.24,
        age: 0,
        color: GRENADE_EXPLOSION_COLORS[Math.floor(Math.random() * GRENADE_EXPLOSION_COLORS.length)]
    });
}

function spawnCannonImpactParticles(wx, wy, radius = 138) {
    grenadeShockwaves.push({
        x: wx,
        y: wy,
        radius,
        age: 0,
        life: 0.62,
        isExplosionFlash: false
    });
    const count = 30;
    for (let i = 0; i < count; i++) {
        if (explosions.length >= MAX_EXPLOSION_PARTICLES) {
            explosions.shift();
        }
        const angle = (Math.PI * 2 * i) / count + (Math.random() - 0.5) * 0.45;
        const speed = 110 + Math.random() * 260;
        explosions.push({
            x: wx + (Math.random() - 0.5) * 14,
            y: wy + (Math.random() - 0.5) * 14,
            vx: Math.cos(angle) * speed,
            vy: Math.sin(angle) * speed,
            radius: 6 + Math.random() * 10,
            life: 0.34 + Math.random() * 0.34,
            age: 0,
            color: GRENADE_EXPLOSION_COLORS[Math.floor(Math.random() * GRENADE_EXPLOSION_COLORS.length)]
        });
    }
}

function spawnDropslideWhiteParticles(wx, wy, dx = 0, dy = 0, count = 5) {
    const baseAngle = (dx !== 0 || dy !== 0) ? Math.atan2(-dy, -dx) : (Math.random() * Math.PI * 2);
    for (let i = 0; i < count; i++) {
        if (dropslideParticles.length >= MAX_EXPLOSION_PARTICLES) {
            dropslideParticles.shift();
        }
        const spread = (Math.random() - 0.5) * 1.4;
        const ang = baseAngle + spread;
        const speed = 35 + Math.random() * 95;
        dropslideParticles.push({
            x: wx + (Math.random() - 0.5) * 20,
            y: wy + (Math.random() - 0.5) * 20,
            vx: Math.cos(ang) * speed,
            vy: Math.sin(ang) * speed,
            radius: 2.5 + Math.random() * 3.5,
            life: 0.22 + Math.random() * 0.18,
            age: 0,
            color: Math.random() < 0.75 ? '#ffffff' : '#e8f0ff'
        });
    }
}

function spawnSprintDustPuff(wx, wy, dirX, dirY, sideSign, radius) {
    if (sprintDustParticles.length >= MAX_SPRINT_DUST_PARTICLES) {
        sprintDustParticles.shift();
    }
    const rightX = -dirY;
    const rightY = dirX;
    const footX = wx - dirX * (radius * 0.45) + rightX * (sideSign * radius * 0.42);
    const footY = wy - dirY * (radius * 0.45) + rightY * (sideSign * radius * 0.42);
    const backSpread = (Math.random() - 0.5) * 0.7;
    const backAng = Math.atan2(-dirY, -dirX) + backSpread;
    const kickSpeed = 16 + Math.random() * 28;
    sprintDustParticles.push({
        x: footX + (Math.random() - 0.5) * 4,
        y: footY + (Math.random() - 0.5) * 4,
        vx: Math.cos(backAng) * kickSpeed,
        vy: Math.sin(backAng) * kickSpeed,
        radius: 2.3 + Math.random() * 1.5,
        life: 0.22 + Math.random() * 0.10,
        age: 0,
        color: Math.random() < 0.5 ? '#d8d4ca' : '#c6c1b6'
    });
}

function stepEntitySprintAnim(entityKey, isSprinting, vx, vy, aimAngle, worldCX, worldCY, radius, dt, seq, isLocalPlayer) {
    let anim = sprintAnims.get(entityKey);
    const speed = Math.hypot(vx, vy);
    const hasMotion = speed > 14 || isLocalPlayer;
    const targetBlend = (isSprinting && hasMotion) ? 1 : 0;

    if (!anim) {
        if (targetBlend === 0) return;
        const fx = speed > 10 ? vx / speed : Math.sin(aimAngle);
        const fy = speed > 10 ? vy / speed : -Math.cos(aimAngle);
        anim = {
            phase: Math.random() * Math.PI * 2,
            blend: 0,
            dirX: fx,
            dirY: fy,
            moveAngle: Math.atan2(fx, -fy),
            lastStepIdx: -1,
            seq
        };
        sprintAnims.set(entityKey, anim);
    }
    anim.seq = seq;

    const blendAlpha = 1 - Math.exp(-dt * (targetBlend > anim.blend ? 14 : 11));
    anim.blend += (targetBlend - anim.blend) * blendAlpha;
    if (targetBlend === 0 && anim.blend < 0.005) {
        sprintAnims.delete(entityKey);
        return;
    }

    let tDirX = anim.dirX;
    let tDirY = anim.dirY;
    if (speed > 14) {
        tDirX = vx / speed;
        tDirY = vy / speed;
    } else if (isSprinting) {
        tDirX = Math.sin(aimAngle);
        tDirY = -Math.cos(aimAngle);
    }
    const dirLerp = 1 - Math.exp(-dt * 16);
    anim.dirX += (tDirX - anim.dirX) * dirLerp;
    anim.dirY += (tDirY - anim.dirY) * dirLerp;
    const dLen = Math.hypot(anim.dirX, anim.dirY);
    if (dLen > 0.001) {
        anim.dirX /= dLen;
        anim.dirY /= dLen;
    }
    anim.moveAngle = Math.atan2(anim.dirX, -anim.dirY);

    const speedFactor = isLocalPlayer && speed < 14
        ? 0.9
        : Math.max(0.28, Math.min(1.22, speed / 245));
    anim.phase += dt * (11.2 + speedFactor * 3.1) * (0.35 + 0.65 * anim.blend);

    const stepIdx = Math.floor(anim.phase / Math.PI);
    if (anim.blend > 0.45 && stepIdx !== anim.lastStepIdx) {
        if (anim.lastStepIdx !== -1) {
            const camX = WORLD.CAMERA.x || 0;
            const camY = WORLD.CAMERA.y || 0;
            const camW = WORLD.CAMERA.width || LOGICAL_WIDTH;
            const camH = WORLD.CAMERA.height || LOGICAL_HEIGHT;
            const sx = worldCX - camX;
            const sy = worldCY - camY;
            if (sx >= -64 && sx <= camW + 64 && sy >= -64 && sy <= camH + 64) {
                spawnSprintDustPuff(worldCX, worldCY, anim.dirX, anim.dirY, (stepIdx & 1) ? 1 : -1, radius);
            }
        }
        anim.lastStepIdx = stepIdx;
    } else if (anim.blend <= 0.25) {
        anim.lastStepIdx = -1;
    }
}

function getSwingOffset(entityKey, nowMs) {
    const entry = swingAnims.get(entityKey);
    if (!entry) return 0;
    const startedAt = typeof entry === 'number' ? entry : entry.at;
    const isUgly = typeof entry === 'object' && entry !== null && Boolean(entry.ugly);
    const isClaws = typeof entry === 'object' && entry !== null && Boolean(entry.claws);
    const duration = isClaws ? 240 : (isUgly ? 175 : 260);
    const elapsed = nowMs - startedAt;
    if (elapsed >= duration || elapsed < 0) {
        swingAnims.delete(entityKey);
        return 0;
    }
    const p = elapsed / duration;
    if (isClaws) {
        if (p < 0.25) {
            const t = p / 0.25;
            return -0.22 * (1 - (1 - t) * (1 - t));
        }
        if (p < 0.58) {
            const t = (p - 0.25) / 0.33;
            const easeOut = 1 - (1 - t) * (1 - t);
            return -0.22 + 1.22 * easeOut;
        }
        const t = (p - 0.58) / 0.42;
        return 1.0 * (1 - t * t);
    }
    if (isUgly) {
        const jitter = Math.sin(p * Math.PI * 6) * 0.16 * (1 - p);
        if (p < 0.22) {
            return -0.42 * (p / 0.22) + jitter;
        }
        if (p < 0.56) {
            const t = (p - 0.22) / 0.34;
            return -0.42 + 1.48 * t + jitter;
        }
        const t = (p - 0.56) / 0.44;
        return 1.06 * (1 - t) + jitter * 0.6;
    }
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

function isWorldPointInTree(wx, wy) {
    const grid = WORLD.MAP.mapData ? WORLD.MAP.mapData.tree : null;
    if (!grid) return false;
    const ts = WORLD.MAP.tileSize || 64;
    const c = Math.floor(wx / ts);
    const r = Math.floor(wy / ts);
    if (r < 0 || r >= grid.length || c < 0 || !grid[r] || c >= grid[r].length) return false;
    return Boolean(grid[r][c]);
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
    else if (faction === 'mapbot') cctx.fillStyle = '#e040ff';
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
    if (playerId === undefined || playerId === null) return false;
    for (let i = 0; i < floatingTexts.length; i++) {
        const ft = floatingTexts[i];
        if (ft.playerId === playerId && ft.age * 24 < 22) {
            return true;
        }
    }
    return false;
}

const calibratedWeaponMetrics = new Map();

function measureOpaqueBounds(img, x0, x1) {
    const w = img.naturalWidth;
    const h = img.naturalHeight;
    if (!w || !h) return null;
    const c = document.createElement('canvas');
    c.width = w;
    c.height = h;
    const g = c.getContext('2d');
    g.drawImage(img, 0, 0);
    let data;
    try {
        data = g.getImageData(0, 0, w, h).data;
    } catch (_) {
        return null;
    }
    const startX = Math.max(0, Math.floor(x0));
    const endX = Math.min(w, Math.ceil(x1));
    let minX = w;
    let minY = h;
    let maxX = -1;
    let maxY = -1;
    let sumX = 0;
    let sumY = 0;
    let count = 0;
    for (let y = 0; y < h; y++) {
        const rowOff = y * w;
        for (let x = startX; x < endX; x++) {
            if (data[(rowOff + x) * 4 + 3] > 20) {
                if (x < minX) minX = x;
                if (x > maxX) maxX = x;
                if (y < minY) minY = y;
                if (y > maxY) maxY = y;
                sumX += x;
                sumY += y;
                count++;
            }
        }
    }
    if (count === 0) return null;
    return { minX, minY, maxX, maxY, cx: sumX / count, cy: sumY / count, w: maxX - minX + 1, h: maxY - minY + 1, count };
}

function getWeaponMetrics(weapon, weaponImg) {
    if (weapon !== 'goodbot-cannon') {
        return { splitX: 284, anchorX: 284, anchorY: 596, resScale: 1 };
    }
    const w = weaponImg && weaponImg.complete ? weaponImg.naturalWidth : 0;
    const h = weaponImg && weaponImg.complete ? weaponImg.naturalHeight : 0;
    if (!w || !h) {
        return { splitX: 284, anchorX: 284, anchorY: 596, resScale: 0.8 };
    }
    const cacheKey = `${weapon}:${w}x${h}:${botHandsImg.complete ? botHandsImg.naturalWidth : 0}:v3`;
    if (calibratedWeaponMetrics.has(cacheKey)) {
        return calibratedWeaponMetrics.get(cacheKey);
    }
    const refW = (goodbotImg.complete && goodbotImg.naturalWidth > 0) ? goodbotImg.naturalWidth : 512;
    const refH = (goodbotImg.complete && goodbotImg.naturalHeight > 0) ? goodbotImg.naturalHeight : 512;
    let splitX = Math.floor(w * 0.5);
    let anchorX = w * 0.5;
    let anchorY = h <= Math.round(refH * 1.15) ? h * 0.5 : (h - refH * 0.5);
    let resScale = 1;

    if (w <= Math.round(refW * 1.15) && h <= Math.round(refH * 1.15)) {
        splitX = Math.floor(w * 0.5);
        anchorX = w * 0.5;
        anchorY = h * 0.5;
    } else {
        const cannonLeft = measureOpaqueBounds(weaponImg, 0, Math.floor(w * 0.36));
        const cannonAll = measureOpaqueBounds(weaponImg, 0, w);
        let matchedByHand = false;

        if (botHandsImg.complete && botHandsImg.naturalWidth > 0) {
            const bhW = botHandsImg.naturalWidth;
            const bhH = botHandsImg.naturalHeight;
            const bhLeft = measureOpaqueBounds(botHandsImg, 0, Math.floor(bhW * 0.5));
            if (bhLeft && cannonLeft) {
                const refLeftCx = bhLeft.cx - bhW * 0.5;
                const refLeftCy = bhLeft.cy - bhH * 0.5;
                const bhScaleGuess = (w > 1100) ? (cannonLeft.h / Math.max(1, bhLeft.h)) : 1;
                const hRatio = cannonLeft.h / Math.max(1, bhLeft.h * bhScaleGuess);
                if (hRatio >= 0.65 && hRatio <= 1.5 && cannonLeft.maxY < h * 0.92) {
                    const candX = cannonLeft.cx - refLeftCx * bhScaleGuess;
                    const candY = cannonLeft.cy - refLeftCy * bhScaleGuess;
                    if (candX >= w * 0.25 && candX <= w * 0.75 && candY >= h * 0.35 && candY <= h + refH * 0.4 * bhScaleGuess) {
                        resScale = bhScaleGuess;
                        anchorX = candX;
                        anchorY = candY;
                        splitX = Math.max(cannonLeft.maxX + 2, Math.min(w - 1, Math.round(anchorX)));
                        matchedByHand = true;
                    }
                }
            }
        }

        if (!matchedByHand && goodbotPistolImg.complete && goodbotPistolImg.naturalWidth > 0) {
            const pw = goodbotPistolImg.naturalWidth;
            const ph = goodbotPistolImg.naturalHeight;
            if (Math.abs(w - pw) <= 48 && Math.abs(h - ph) <= 48) {
                splitX = 284;
                anchorX = 284;
                anchorY = 596;
                matchedByHand = true;
            }
        }

        if (!matchedByHand && cannonAll) {
            if (w > 1100) {
                resScale = w / (refW * 1.15);
            }
            anchorX = (cannonAll.minX + cannonAll.maxX) * 0.5;
            if (w > refW * 1.05 * resScale) {
                const rightEdgeBias = Math.max(0, cannonAll.maxX - w * 0.5);
                if (cannonAll.minX < w * 0.25 && rightEdgeBias > cannonAll.w * 0.4) {
                    anchorX = Math.min(w * 0.62, Math.max(w * 0.42, cannonAll.minX + (refW * 0.5) * resScale));
                }
            }
            anchorY = Math.min(h - 10 * resScale, Math.max(h * 0.45, cannonAll.maxY - (refH * 0.25) * resScale));
            splitX = Math.max(1, Math.min(w - 1, Math.round(anchorX)));
        }
    }

    resScale = resScale * 0.8;

    const result = { splitX, anchorX, anchorY, resScale };
    calibratedWeaponMetrics.set(cacheKey, result);
    return result;
}

function getRecoilTransform(entityKey, nowMs, mapRef = recoilAnims) {
    if (!entityKey) return null;
    const entry = mapRef.get(entityKey);
    if (!entry) return null;
    const startedAt = typeof entry === 'number' ? entry : entry.at;
    const isStrong = typeof entry === 'object' && entry !== null && Boolean(entry.strong);
    const duration = isStrong ? 300 : 135;
    const elapsed = nowMs - startedAt;
    if (elapsed < 0 || elapsed >= duration) {
        mapRef.delete(entityKey);
        return null;
    }
    const p = elapsed / duration;
    const peakP = isStrong ? 0.16 : 0.24;
    let mag;
    if (p < peakP) {
        const t = p / peakP;
        mag = 1 - (1 - t) * (1 - t);
    } else {
        const t = (p - peakP) / (1 - peakP);
        mag = Math.pow(1 - t, isStrong ? 1.8 : 2.2);
    }
    return {
        dy: mag * (isStrong ? 20 : 10),
        rot: mag * (isStrong ? 0.34 : 0.045)
    };
}

function getLeftRecoilTransform(entityKey, nowMs) {
    return getRecoilTransform(entityKey, nowMs, leftRecoilAnims);
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
    const isCanvas = img instanceof HTMLCanvasElement;
    const natW = img ? (isCanvas ? img.width : img.naturalWidth) : 0;
    const natH = img ? (isCanvas ? img.height : img.naturalHeight) : 0;
    if (!img || (!isCanvas && !img.complete) || natW === 0 || natH === 0) return null;
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
    if (weapon === 'none') return;
    ctx.save();
    ctx.translate(x, y);
    const isCannon = weapon === 'goodbot-cannon';
    const isBeamer = weapon === 'goodbot-beamer';
    const isGoodbotAssaultLaser = weapon === 'goodbot-assault-laser';
    const isRarebotAssaultLaser = weapon === 'rarebot-assault-laser';
    const isAssaultLaser = isGoodbotAssaultLaser || isRarebotAssaultLaser;
    const isHealer = weapon === 'healer-gun';
    const isDualPistol = weapon === 'dual-pistol';
    const isRangedWeapon = isCannon || isBeamer || isAssaultLaser || isHealer || isDualPistol || weapon === 'goodbot-pistol' || weapon === 'pistol';
    const sprintAnim = entityKey ? sprintAnims.get(entityKey) : null;
    const sprintBlend = sprintAnim ? sprintAnim.blend : 0;
    const sprintPhase = sprintAnim ? sprintAnim.phase : 0;
    const sprintSin = sprintBlend > 0.01 ? Math.sin(sprintPhase) : 0;
    const sprintCos2 = sprintBlend > 0.01 ? Math.cos(sprintPhase * 2) : 0;
    const bodyTwist = sprintBlend > 0.01 ? sprintSin * 0.045 * sprintBlend : 0;
    ctx.rotate(angle + (isRangedWeapon ? 0 : (swingOffset + bodyTwist * (Math.abs(swingOffset) > 0.02 ? 0.2 : 1))));
    const refW = goodbotImg.complete && goodbotImg.naturalWidth > 0 ? goodbotImg.naturalWidth : 512;
    const refH = goodbotImg.complete && goodbotImg.naturalHeight > 0 ? goodbotImg.naturalHeight : 512;

    if (isRangedWeapon) {
        const weaponImg = isBeamer
            ? goodbotBeamerImg
            : (isGoodbotAssaultLaser
                ? goodbotAssaultLaserImg
                : (isRarebotAssaultLaser
                    ? rarebotAssaultLaserImg
                    : (isHealer
                        ? rarebotHealerGunImg
                        : (isCannon
                            ? goodbotCannonImg
                            : ((weapon === 'pistol' || isDualPistol) ? rarebotPistolImg : goodbotPistolImg)))));
        const fullW = weaponImg ? weaponImg.naturalWidth : 0;
        const fullH = weaponImg ? weaponImg.naturalHeight : 0;
        if (weaponImg && weaponImg.complete && fullW > 0) {
            const metrics = getWeaponMetrics(weapon, weaponImg);
            const pxScaleX = ((sW / refW) * HANDS_SCALE) / metrics.resScale;
            const pxScaleY = ((sH / refH) * HANDS_SCALE) / metrics.resScale;
            const anchorX = metrics.anchorX;
            const anchorY = metrics.anchorY;
            const pH = fullH * pxScaleY;
            const baseLeftX = -anchorX * pxScaleX;
            const baseTopY = -anchorY * pxScaleY;
            const bodyScale = sW / 48;
            const isLocalBeamerFiring = isBeamer && entityKey === `player:${myId}` && isBeamerActive;

            if (isCannon || isBeamer || isAssaultLaser) {
                const fullDrawW = fullW * pxScaleX;
                const fullMip = getScaledSpriteCanvas(
                    `${weapon}_ALL`,
                    weaponImg,
                    0,
                    0,
                    fullW,
                    fullH,
                    (fullW / refW) * (48 / metrics.resScale) * HANDS_SCALE,
                    (fullH / refH) * (48 / metrics.resScale) * HANDS_SCALE
                ) || weaponImg;
                const equip = getEquipTransform(entityKey, nowMs);
                const recoil = getRecoilTransform(entityKey, nowMs);
                const fireAtten = (recoil || isLocalBeamerFiring) ? 0.15 : 1;
                const carry = sprintBlend * fireAtten;
                const carryDx = carry > 0.01 ? (-2.1 * carry) * bodyScale : 0;
                const carryDy = carry > 0.01 ? (2.3 + sprintCos2 * 0.95) * carry * bodyScale : 0;
                const carryRot = carry > 0.01 ? (-0.20 + sprintSin * 0.045) * carry : 0;
                const cDx = (equip ? equip.dx * bodyScale : 0) + carryDx;
                const cDy = (equip ? equip.dy * bodyScale : 0) + (recoil ? recoil.dy * bodyScale : 0) + carryDy;
                const cRot = (equip ? equip.rot : 0) + (recoil ? recoil.rot : 0) + carryRot;
                if (cDx !== 0 || cDy !== 0) {
                    ctx.translate(cDx, cDy);
                }
                if (cRot !== 0) {
                    ctx.rotate(cRot);
                }
                if (fullMip !== weaponImg) {
                    ctx.drawImage(fullMip, baseLeftX, baseTopY, fullDrawW, pH);
                } else {
                    ctx.drawImage(weaponImg, 0, 0, fullW, fullH, baseLeftX, baseTopY, fullDrawW, pH);
                }
                ctx.restore();
                return;
            }

            const splitX = metrics.splitX;
            const leftW = Math.max(1, Math.min(splitX, fullW));
            const leftDrawW = leftW * pxScaleX;
            const rightW = fullW - leftW;
            const rightDrawW = rightW * pxScaleX;
            const leftPunch = getLeftPunchOffset(entityKey, nowMs);

            if (isDualPistol && rightW > 0) {
                const rightMip = getScaledSpriteCanvas(
                    `${weapon}_R`,
                    weaponImg,
                    leftW,
                    0,
                    rightW,
                    fullH,
                    (rightW / refW) * (48 / metrics.resScale) * HANDS_SCALE,
                    (fullH / refH) * (48 / metrics.resScale) * HANDS_SCALE
                ) || weaponImg;
                const rightX = (leftW - anchorX) * pxScaleX;
                const leftRecoil = getLeftRecoilTransform(entityKey, nowMs);
                const leftCarry = sprintBlend * ((leftRecoil || leftPunch) ? 0.15 : 1);

                ctx.save();
                if (leftPunch) {
                    ctx.translate(0, leftPunch.dy * bodyScale);
                    ctx.rotate(leftPunch.rot);
                }
                if (leftCarry > 0.01) {
                    ctx.translate(1.1 * leftCarry * bodyScale, (1.1 - sprintSin * 2.1) * leftCarry * bodyScale);
                    ctx.rotate((0.14 - sprintSin * 0.04) * leftCarry);
                }
                ctx.scale(-1, 1);
                if (leftRecoil) {
                    ctx.translate(0, leftRecoil.dy * bodyScale);
                    ctx.rotate(leftRecoil.rot);
                }
                if (rightMip !== weaponImg) {
                    ctx.drawImage(rightMip, rightX, baseTopY, rightDrawW, pH);
                } else {
                    ctx.drawImage(weaponImg, leftW, 0, rightW, fullH, rightX, baseTopY, rightDrawW, pH);
                }
                ctx.restore();
            } else {
                const leftMip = getScaledSpriteCanvas(
                    `${weapon}_L`,
                    weaponImg,
                    0,
                    0,
                    leftW,
                    fullH,
                    (leftW / refW) * (48 / metrics.resScale) * HANDS_SCALE,
                    (fullH / refH) * (48 / metrics.resScale) * HANDS_SCALE
                ) || weaponImg;
                const leftPumpBlend = sprintBlend * (leftPunch ? 0 : 1);
                const leftPumpDy = leftPumpBlend > 0.01 ? -sprintSin * 4.4 * leftPumpBlend * bodyScale : 0;
                const leftPumpDx = leftPumpBlend > 0.01 ? 0.6 * leftPumpBlend * bodyScale : 0;
                const leftPumpRot = leftPumpBlend > 0.01 ? (0.07 + sprintSin * 0.07) * leftPumpBlend : 0;
                if (leftPunch || leftPumpBlend > 0.01) {
                    ctx.save();
                    ctx.translate(leftPumpDx, (leftPunch ? leftPunch.dy * bodyScale : 0) + leftPumpDy);
                    ctx.rotate((leftPunch ? leftPunch.rot : 0) + leftPumpRot);
                    if (leftMip !== weaponImg) {
                        ctx.drawImage(leftMip, baseLeftX, baseTopY, leftDrawW, pH);
                    } else {
                        ctx.drawImage(weaponImg, 0, 0, leftW, fullH, baseLeftX, baseTopY, leftDrawW, pH);
                    }
                    ctx.restore();
                } else {
                    if (leftMip !== weaponImg) {
                        ctx.drawImage(leftMip, baseLeftX, baseTopY, leftDrawW, pH);
                    } else {
                        ctx.drawImage(weaponImg, 0, 0, leftW, fullH, baseLeftX, baseTopY, leftDrawW, pH);
                    }
                }
            }

            if (rightW > 0) {
                const rightMip = getScaledSpriteCanvas(
                    `${weapon}_R`,
                    weaponImg,
                    leftW,
                    0,
                    rightW,
                    fullH,
                    (rightW / refW) * (48 / metrics.resScale) * HANDS_SCALE,
                    (fullH / refH) * (48 / metrics.resScale) * HANDS_SCALE
                ) || weaponImg;
                const equip = getEquipTransform(entityKey, nowMs);
                const recoil = getRecoilTransform(entityKey, nowMs);
                const rightCarry = sprintBlend * (recoil ? 0.15 : 1);
                const rightCarryDx = rightCarry > 0.01 ? -1.4 * rightCarry * bodyScale : 0;
                const rightCarryDy = rightCarry > 0.01 ? (1.4 + sprintSin * (isDualPistol ? 2.1 : 1.5)) * rightCarry * bodyScale : 0;
                const rightCarryRot = rightCarry > 0.01 ? (-0.15 + sprintSin * 0.04) * rightCarry : 0;
                const rDx = (equip ? equip.dx * bodyScale : 0) + rightCarryDx;
                const rDy = (equip ? equip.dy * bodyScale : 0) + (recoil ? recoil.dy * bodyScale : 0) + rightCarryDy;
                const rRot = (equip ? equip.rot : 0) + (recoil ? recoil.rot : 0) + rightCarryRot;
                const needRightXform = rDx !== 0 || rDy !== 0 || rRot !== 0;
                const rightX = (leftW - anchorX) * pxScaleX;
                if (needRightXform) {
                    ctx.save();
                    if (rDx !== 0 || rDy !== 0) {
                        ctx.translate(rDx, rDy);
                    }
                    if (rRot !== 0) {
                        ctx.rotate(rRot);
                    }
                }
                if (rightMip !== weaponImg) {
                    ctx.drawImage(rightMip, rightX, baseTopY, rightDrawW, pH);
                } else {
                    ctx.drawImage(weaponImg, leftW, 0, rightW, fullH, rightX, baseTopY, rightDrawW, pH);
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
    const bodyScale = sW / 48;
    const leftPunch = getLeftPunchOffset(entityKey, nowMs);
    const swingAtten = Math.abs(swingOffset) > 0.03 ? 0.2 : 1;
    const unarmedSprint = sprintBlend * swingAtten;
    const leftSprintPump = unarmedSprint * (leftPunch ? 0 : 1);
    const leftPumpDx = leftSprintPump > 0.01 ? 0.7 * leftSprintPump * bodyScale : 0;
    const leftPumpDy = leftSprintPump > 0.01 ? -sprintSin * 5.0 * leftSprintPump * bodyScale : 0;
    const leftPumpRot = leftSprintPump > 0.01 ? (0.08 + sprintSin * 0.08) * leftSprintPump : 0;
    const rightPumpDx = unarmedSprint > 0.01 ? -0.7 * unarmedSprint * bodyScale : 0;
    const rightPumpDy = unarmedSprint > 0.01 ? sprintSin * 5.0 * unarmedSprint * bodyScale : 0;
    const rightPumpRot = unarmedSprint > 0.01 ? (-0.08 - sprintSin * 0.08) * unarmedSprint : 0;

    if (handsImg.complete && handsImg.naturalWidth > 0) {
        const hW = sW * (handsImg.naturalWidth / refW) * HANDS_SCALE;
        const hH = sH * (handsImg.naturalHeight / refH) * HANDS_SCALE;
        const splitX = Math.floor(handsImg.naturalWidth / 2);
        const rightW = handsImg.naturalWidth - splitX;
        const leftDrawW = (splitX / handsImg.naturalWidth) * hW;
        const rightDrawW = (rightW / handsImg.naturalWidth) * hW;
        const handsKey = spriteKind === 'prototype' ? 'proto_hands' : 'bot_hands';
        const leftMip = getScaledSpriteCanvas(
            `${handsKey}_L`,
            handsImg,
            0,
            0,
            splitX,
            handsImg.naturalHeight,
            (splitX / refW) * 48 * HANDS_SCALE,
            (handsImg.naturalHeight / refH) * 48 * HANDS_SCALE
        ) || handsImg;
        if (leftPunch || leftSprintPump > 0.01) {
            ctx.save();
            ctx.translate(leftPumpDx, (leftPunch ? leftPunch.dy * bodyScale : 0) + leftPumpDy);
            ctx.rotate((leftPunch ? leftPunch.rot : 0) + leftPumpRot);
            if (leftMip !== handsImg) {
                ctx.drawImage(leftMip, -hW / 2, -hH / 2, leftDrawW, hH);
            } else {
                ctx.drawImage(handsImg, 0, 0, splitX, handsImg.naturalHeight, -hW / 2, -hH / 2, leftDrawW, hH);
            }
            if (weapon === 'rarebot-grenade') {
                const rgReady = rarebotGrenadeImg.complete && rarebotGrenadeImg.naturalWidth > 0;
                const rgRatio = rgReady ? (rarebotGrenadeImg.naturalHeight / rarebotGrenadeImg.naturalWidth) : 1.1142857;
                const baseGW = rgRatio > 1.05 ? GRENADE_DRAW_SIZE : 23;
                const gScale = Math.max(1, 24 / (baseGW * rgRatio));
                const gDrawW = baseGW * gScale * bodyScale;
                const gDrawH = baseGW * rgRatio * gScale * bodyScale;
                ctx.save();
                ctx.translate(-19.5 * bodyScale, -25 * bodyScale);
                ctx.rotate(-0.18);
                if (rgReady) {
                    ctx.drawImage(rarebotGrenadeImg, -gDrawW * 0.5, -gDrawH * 0.5, gDrawW, gDrawH);
                } else {
                    ctx.fillStyle = '#e02424';
                    ctx.beginPath();
                    ctx.arc(0, 0, gDrawW * 0.42, 0, Math.PI * 2);
                    ctx.fill();
                }
                ctx.restore();
            }
            ctx.restore();
        } else {
            if (leftMip !== handsImg) {
                ctx.drawImage(leftMip, -hW / 2, -hH / 2, leftDrawW, hH);
            } else {
                ctx.drawImage(handsImg, 0, 0, splitX, handsImg.naturalHeight, -hW / 2, -hH / 2, leftDrawW, hH);
            }
            if (weapon === 'rarebot-grenade') {
                const rgReady = rarebotGrenadeImg.complete && rarebotGrenadeImg.naturalWidth > 0;
                const rgRatio = rgReady ? (rarebotGrenadeImg.naturalHeight / rarebotGrenadeImg.naturalWidth) : 1.1142857;
                const baseGW = rgRatio > 1.05 ? GRENADE_DRAW_SIZE : 23;
                const gScale = Math.max(1, 24 / (baseGW * rgRatio));
                const gDrawW = baseGW * gScale * bodyScale;
                const gDrawH = baseGW * rgRatio * gScale * bodyScale;
                ctx.save();
                ctx.translate(-19.5 * bodyScale, -25 * bodyScale);
                ctx.rotate(-0.18);
                if (rgReady) {
                    ctx.drawImage(rarebotGrenadeImg, -gDrawW * 0.5, -gDrawH * 0.5, gDrawW, gDrawH);
                } else {
                    ctx.fillStyle = '#e02424';
                    ctx.beginPath();
                    ctx.arc(0, 0, gDrawW * 0.42, 0, Math.PI * 2);
                    ctx.fill();
                }
                ctx.restore();
            }
        }
        if (rightW > 0) {
            const rightMip = getScaledSpriteCanvas(
                `${handsKey}_R`,
                handsImg,
                splitX,
                0,
                rightW,
                handsImg.naturalHeight,
                (rightW / refW) * 48 * HANDS_SCALE,
                (handsImg.naturalHeight / refH) * 48 * HANDS_SCALE
            ) || handsImg;
            if (unarmedSprint > 0.01) {
                ctx.save();
                ctx.translate(rightPumpDx, rightPumpDy);
                ctx.rotate(rightPumpRot);
            }
            if (rightMip !== handsImg) {
                ctx.drawImage(rightMip, -hW / 2 + leftDrawW, -hH / 2, rightDrawW, hH);
            } else {
                ctx.drawImage(handsImg, splitX, 0, rightW, handsImg.naturalHeight, -hW / 2 + leftDrawW, -hH / 2, rightDrawW, hH);
            }
            if (unarmedSprint > 0.01) {
                ctx.restore();
            }
        }
    } else {
        const r = sW * 0.14 * HANDS_SCALE;
        const hx = sW * 0.46 * HANDS_SCALE;
        const hy = -sH * 0.48 * HANDS_SCALE;
        ctx.fillStyle = '#2d2d30';
        ctx.strokeStyle = '#000000';
        ctx.lineWidth = Math.max(1.5, sW * 0.045);
        if (leftPunch || leftSprintPump > 0.01) {
            ctx.save();
            ctx.translate(leftPumpDx, (leftPunch ? leftPunch.dy * bodyScale : 0) + leftPumpDy);
            ctx.rotate((leftPunch ? leftPunch.rot : 0) + leftPumpRot);
        }
        ctx.beginPath();
        ctx.arc(-hx, hy, r, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
        if (leftPunch || leftSprintPump > 0.01) {
            ctx.restore();
        }
        if (unarmedSprint > 0.01) {
            ctx.save();
            ctx.translate(rightPumpDx, rightPumpDy);
            ctx.rotate(rightPumpRot);
        }
        ctx.beginPath();
        ctx.arc(hx, hy, r, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
        if (unarmedSprint > 0.01) {
            ctx.restore();
        }
    }
    ctx.restore();
}

let beamerBeamAssetsCache = null;

function getBeamerBeamAssets() {
    if (beamerBeamAssetsCache) return beamerBeamAssetsCache;

    const strip = document.createElement('canvas');
    strip.width = 36;
    strip.height = 64;
    const sCtx = strip.getContext('2d');
    sCtx.fillStyle = 'rgba(184, 51, 255, 0.32)';
    sCtx.fillRect(4, 0, 28, 64);
    sCtx.fillStyle = 'rgba(216, 74, 255, 0.85)';
    sCtx.fillRect(11, 0, 14, 64);
    sCtx.fillStyle = '#ffffff';
    sCtx.fillRect(15.25, 0, 5.5, 64);

    const startGlow = document.createElement('canvas');
    startGlow.width = 28;
    startGlow.height = 28;
    const sgCtx = startGlow.getContext('2d');
    sgCtx.fillStyle = '#f0aaff';
    sgCtx.beginPath();
    sgCtx.arc(14, 14, 10.5, 0, Math.PI * 2);
    sgCtx.fill();
    sgCtx.fillStyle = '#ffffff';
    sgCtx.beginPath();
    sgCtx.arc(14, 14, 5, 0, Math.PI * 2);
    sgCtx.fill();

    const endGlow = document.createElement('canvas');
    endGlow.width = 44;
    endGlow.height = 44;
    const egCtx = endGlow.getContext('2d');
    egCtx.fillStyle = 'rgba(216, 74, 255, 0.6)';
    egCtx.beginPath();
    egCtx.arc(22, 22, 16.5, 0, Math.PI * 2);
    egCtx.fill();
    egCtx.fillStyle = '#ffffff';
    egCtx.beginPath();
    egCtx.arc(22, 22, 7.5, 0, Math.PI * 2);
    egCtx.fill();

    beamerBeamAssetsCache = { strip, startGlow, endGlow };
    return beamerBeamAssetsCache;
}

const pendingEntityLabels = [];

function drawEntityLabel(x, y, sH, label, faction) {
    if (!label) return;
    const lbl = getLabelSprite(label, faction);
    const drawX = Math.round((x - lbl.w / 2) * lbl.scale) / lbl.scale;
    const drawY = Math.round((y - sH / 2 - 10 - lbl.baselineY) * lbl.scale) / lbl.scale;
    ctx.drawImage(lbl.canvas, drawX, drawY, lbl.drawW, lbl.drawH);
}

function drawEntity(x, y, width, height, angle, scale, label, faction, showHands, swingOffset, bars, spriteKind = null, weapon = 'hands', entityKey = null, nowMs = 0, armor = null) {
    const sW = width * scale;
    const sH = height * scale;
    const isSpectator = faction === 'spectator';

    if (spriteKind === 'dropship' || spriteKind === 'dropship-rarebot' || spriteKind === 'dropship-goodbot') {
        const shipFaction = spriteKind === 'dropship-goodbot' ? 'goodbot' : (spriteKind === 'dropship-rarebot' ? 'rarebot' : faction);
        drawDropshipSprite(ctx, x, y, sW, sH, shipFaction, angle, nowMs);
        if (label) {
            drawEntityLabel(x, y, sH, label, faction);
        }
        if (bars) {
            drawSubtleBars(x, y + sH / 2 + 6, bars.health, bars.maxHealth, bars.energy, bars.maxEnergy);
        }
        return;
    }

    if (spriteKind === 'mapbot') {
        const B = 48 * scale;
        const sprintAnim = entityKey ? sprintAnims.get(entityKey) : null;
        const sprintBlend = sprintAnim ? sprintAnim.blend : 0;
        let bodyX = x;
        let bodyY = y;
        let strideSin = 0;
        if (sprintBlend > 0.01) {
            strideSin = Math.sin(sprintAnim.phase);
            const stepLift = Math.abs(strideSin) * 1.4 * sprintBlend * scale;
            const lean = 2.4 * sprintBlend * scale;
            bodyX += sprintAnim.dirX * lean;
            bodyY += sprintAnim.dirY * lean - stepLift;
        }
        const leftRecoil = getLeftRecoilTransform(entityKey, nowMs);
        const rightRecoil = getRecoilTransform(entityKey, nowMs);
        const leftRecoilPx = leftRecoil ? Math.min(4.5, leftRecoil.dy * 0.45) * scale : 0;
        const rightRecoilPx = rightRecoil ? Math.min(4.5, rightRecoil.dy * 0.45) * scale : 0;
        const clawLungePx = (swingOffset || 0) * 0.65 * B;

        ctx.save();
        ctx.translate(bodyX, bodyY);
        ctx.rotate(sprintBlend > 0.01 ? (angle + strideSin * 0.04 * sprintBlend) : angle);
        ctx.imageSmoothingEnabled = true;

        if (mapbotBlasterSide1Img.complete && mapbotBlasterSide1Img.naturalWidth > 0) {
            const bw = 0.5078 * B;
            const bh = 0.3867 * B;
            ctx.drawImage(mapbotBlasterSide1Img, -0.7129 * B - bw * 0.5, -0.1387 * B + leftRecoilPx - bh * 0.5, bw, bh);
        }
        if (mapbotBlasterSide2Img.complete && mapbotBlasterSide2Img.naturalWidth > 0) {
            const bw = 0.5078 * B;
            const bh = 0.3867 * B;
            ctx.drawImage(mapbotBlasterSide2Img, 0.7129 * B - bw * 0.5, -0.1387 * B + rightRecoilPx - bh * 0.5, bw, bh);
        }

        if (mapbotImg.complete && mapbotImg.naturalWidth > 0) {
            ctx.drawImage(mapbotImg, -B * 0.5, -B * 0.5, B, B);
        } else {
            ctx.fillStyle = '#a824ff';
            ctx.beginPath();
            ctx.arc(0, 0, B * 0.5, 0, Math.PI * 2);
            ctx.fill();
        }

        const cw = 0.5 * B;
        const ch = 0.1719 * B;
        if (mapbotCoreImg.complete && mapbotCoreImg.naturalWidth > 0) {
            ctx.drawImage(mapbotCoreImg, -cw * 0.5, -0.5098 * B - ch * 0.5, cw, ch);
        } else {
            ctx.fillStyle = '#d84aff';
            ctx.strokeStyle = '#0e0e14';
            ctx.lineWidth = Math.max(1.2, B * 0.04);
            ctx.beginPath();
            ctx.roundRect(-cw * 0.36, -0.5098 * B - ch * 0.35, cw * 0.72, ch * 0.7, ch * 0.35);
            ctx.fill();
            ctx.stroke();
        }

        if (mapbotClawsImg.complete && mapbotClawsImg.naturalWidth > 0) {
            const clw = 1.2305 * B;
            const clh = 0.3125 * B;
            ctx.drawImage(mapbotClawsImg, -clw * 0.5, 0.3457 * B - clawLungePx - clh * 0.5, clw, clh);
        }

        ctx.restore();

        if (label) {
            drawEntityLabel(x, y, B, label, faction);
        }
        if (bars) {
            drawSubtleBars(x, y + B * 0.5 + 6, bars.health, bars.maxHealth, bars.energy, bars.maxEnergy);
        }
        return;
    }

    let spriteImg = goodbotImg;
    let bodyKey = 'body_goodbot';
    if (spriteKind === 'prototype') {
        spriteImg = prototypeRarebotImg;
        bodyKey = 'body_proto';
    } else if (spriteKind === 'sacrifice') {
        spriteImg = sacrificeRarebotImg;
        bodyKey = 'body_sacrifice';
    } else if (spriteKind === 'scout') {
        spriteImg = scoutRarebotImg;
        bodyKey = 'body_scout';
    } else if (spriteKind === 'rarebot' || spriteKind === 'rarebot2' || spriteKind === 'rarebot3' || spriteKind === 'healer' || spriteKind === 'grenadier' || faction === 'rarebot') {
        spriteImg = rarebotImg;
        bodyKey = 'body_rarebot';
    }

    const sprintAnim = (!isSpectator && entityKey) ? sprintAnims.get(entityKey) : null;
    const sprintBlend = sprintAnim ? sprintAnim.blend : 0;
    let bodyX = x;
    let bodyY = y;
    let strideSin = 0;
    if (sprintBlend > 0.01) {
        strideSin = Math.sin(sprintAnim.phase);
        const stepLift = Math.abs(strideSin) * 1.15 * sprintBlend * (sH / 48);
        const lean = 1.9 * sprintBlend * (sW / 48);
        bodyX += sprintAnim.dirX * lean;
        bodyY += sprintAnim.dirY * lean - stepLift;
    }

    if (showHands && !isSpectator && weapon !== 'none') {
        drawBotHands(bodyX, bodyY, sW, sH, angle, swingOffset, spriteKind, weapon, entityKey, nowMs);
    }

    if (spriteImg.complete && spriteImg.naturalWidth > 0) {
        const refW = (goodbotImg.complete && goodbotImg.naturalWidth > 0) ? goodbotImg.naturalWidth : 512;
        const refH = (goodbotImg.complete && goodbotImg.naturalHeight > 0) ? goodbotImg.naturalHeight : 512;
        const isExtendedSprite = spriteKind === 'scout' || spriteKind === 'sacrifice';
        const mipW = isExtendedSprite ? width * (spriteImg.naturalWidth / refW) : width;
        const mipH = isExtendedSprite ? height * (spriteImg.naturalHeight / refH) : height;
        const drawW = isExtendedSprite ? sW * (spriteImg.naturalWidth / refW) : sW;
        const drawH = isExtendedSprite ? sH * (spriteImg.naturalHeight / refH) : sH;
        const bodyMip = getScaledSpriteCanvas(bodyKey, spriteImg, 0, 0, spriteImg.naturalWidth, spriteImg.naturalHeight, mipW, mipH) || spriteImg;
        ctx.save();
        if (isSpectator) ctx.globalAlpha = 0.5;
        ctx.translate(bodyX, bodyY);
        ctx.rotate(sprintBlend > 0.01 ? (angle + strideSin * 0.055 * sprintBlend) : angle);
        ctx.drawImage(bodyMip, -drawW / 2, -sH / 2, drawW, drawH);
        if ((armor === 'goodbot-armor' || armor === 'goodbot-armor-2' || armor === 'goodbot-armor-3') && !isSpectator) {
            if (goodbotArmorImg.complete && goodbotArmorImg.naturalWidth > 0) {
                const armorMip = getScaledSpriteCanvas('armor_goodbot', goodbotArmorImg, 0, 0, goodbotArmorImg.naturalWidth, goodbotArmorImg.naturalHeight, width, height) || goodbotArmorImg;
                ctx.drawImage(armorMip, -sW / 2, -sH / 2, sW, sH);
            }
            if (armor === 'goodbot-armor-2' || armor === 'goodbot-armor-3') {
                const isT3 = armor === 'goodbot-armor-3';
                ctx.strokeStyle = isT3 ? '#ffd24a' : '#4be3ff';
                ctx.lineWidth = Math.max(2, sW * 0.065);
                ctx.beginPath();
                ctx.arc(0, 0, sW * 0.44, -Math.PI * 0.78, -Math.PI * 0.22);
                ctx.stroke();
                ctx.beginPath();
                ctx.arc(0, 0, sW * 0.44, Math.PI * 0.22, Math.PI * 0.78);
                ctx.stroke();
                if (isT3) {
                    ctx.strokeStyle = 'rgba(200, 66, 255, 0.85)';
                    ctx.lineWidth = Math.max(1.5, sW * 0.045);
                    ctx.beginPath();
                    ctx.arc(0, 0, sW * 0.5, 0, Math.PI * 2);
                    ctx.stroke();
                }
            }
        } else if ((armor === 'rarebot-armor' || spriteKind === 'rarebot3') && !isSpectator && rarebotArmorImg.complete && rarebotArmorImg.naturalWidth > 0) {
            const armorMip = getScaledSpriteCanvas('armor_rarebot', rarebotArmorImg, 0, 0, rarebotArmorImg.naturalWidth, rarebotArmorImg.naturalHeight, width, height) || rarebotArmorImg;
            ctx.drawImage(armorMip, -sW / 2, -sH / 2, sW, sH);
        }
        ctx.restore();
    }

    if (label) {
        drawEntityLabel(x, y, sH, label, faction);
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

function drawClippedChunk(chunkCanvas, worldX0, worldY0, bounds, camX, camY, visW, visH, viewScale) {
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
    const dx0 = Math.round((ix0 - camX) * viewScale);
    const dy0 = Math.round((iy0 - camY) * viewScale);
    const dx1 = Math.round((ix1 - camX) * viewScale);
    const dy1 = Math.round((iy1 - camY) * viewScale);
    const dw = dx1 - dx0;
    const dh = dy1 - dy0;
    if (dw <= 0 || dh <= 0) return;
    ctx.drawImage(chunkCanvas, ix0 - worldX0, iy0 - worldY0, sw, sh, dx0, dy0, dw, dh);
}

function render() {
    if (!WORLD.SYSTEM.isReady) return;
    if (!WORLD.MAP.bgChunks.length || !WORLD.MAP.bgChunks[0].length) return;

    const camX = Math.floor((WORLD.CAMERA.x || 0) + camShakeOffsetX);
    const camY = Math.floor((WORLD.CAMERA.y || 0) + camShakeOffsetY);
    const camW = WORLD.CAMERA.width;
    const camH = WORLD.CAMERA.height;
    const visW = Math.ceil(camW) + 1;
    const visH = Math.ceil(camH) + 1;
    const vs = WORLD.SYSTEM.viewScale;
    const cs = WORLD.MAP.chunkSize;
    const mapW = WORLD.MAP.columns * WORLD.MAP.tileSize;
    const mapH = WORLD.MAP.rows * WORLD.MAP.tileSize;

    if (camX < 0 || camY < 0 || camX + visW > mapW || camY + visH > mapH) {
        ctx.fillStyle = '#000000';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
    }

    ctx.save();
    ctx.setTransform(1, 0, 0, 1, 0, 0);
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
                visH,
                vs
            );
        }
    }

    ctx.scale(vs, vs);
    ctx.imageSmoothingEnabled = false;

    const cullPad = 280;
    const nowMs = performance.now();

    if (!inMainMenu && myId !== null) {
        const meCX = ME.x + ME.width / 2;
        const meCY = ME.y + ME.height / 2;

        if (raycastBeams.length > 0) {
            const bulletScale = (48 / 512) * HANDS_SCALE * 1.35;
            const beamWidth = Math.max(4, 24 * bulletScale * 1.5);
            const beamerAssets = getBeamerBeamAssets();
            for (let i = 0; i < raycastBeams.length; i++) {
                const b = raycastBeams[i];
                const sx1 = b.x1 - camX;
                const sy1 = b.y1 - camY;
                const sx2 = b.x2 - camX;
                const sy2 = b.y2 - camY;
                const minX = sx1 < sx2 ? sx1 : sx2;
                const maxX = sx1 > sx2 ? sx1 : sx2;
                const minY = sy1 < sy2 ? sy1 : sy2;
                const maxY = sy1 > sy2 ? sy1 : sy2;
                if (maxX < -42 || minX > camW + 42 || maxY < -42 || minY > camH + 42) continue;
                const dx = b.x2 - b.x1;
                const dy = b.y2 - b.y1;
                const beamLen = Math.hypot(dx, dy);
                if (beamLen < 2) continue;
                const beamAngle = Math.atan2(dy, dx) + Math.PI / 2;
                if (b.variant === 'goodbot-beamer') {
                    const alpha = Math.min(1, Math.max(0, (1 - b.age / b.life) * 1.4));
                    const seed = b.seed || 0;
                    const pulse = Math.sin(nowMs * 0.032 + seed);
                    const pulseScale = (28 + pulse * 4) / 28;
                    const stripHalfW = 18 * pulseScale;
                    const startSize = 28 * ((10 + pulse * 1.5) / 10.5);
                    const endSize = 44 * ((16 + pulse * 2.5) / 16.5);
                    ctx.save();
                    ctx.globalAlpha = alpha;
                    ctx.translate(sx1, sy1);
                    ctx.rotate(beamAngle);
                    ctx.imageSmoothingEnabled = true;
                    ctx.drawImage(beamerAssets.strip, 0, 0, 36, 64, -stripHalfW, -beamLen, stripHalfW * 2, beamLen);

                    ctx.strokeStyle = '#f5c2ff';
                    ctx.lineWidth = 2;
                    ctx.beginPath();
                    ctx.moveTo(0, 0);
                    const segStep = 56;
                    const segCount = Math.max(2, Math.ceil(beamLen / segStep));
                    for (let s = 1; s < segCount; s++) {
                        const sy = -(beamLen * s) / segCount;
                        const wave = Math.sin(s * 2.1 + nowMs * 0.045 + seed * 3) * 6.5;
                        ctx.lineTo(wave, sy);
                    }
                    ctx.lineTo(0, -beamLen);
                    ctx.stroke();

                    ctx.drawImage(beamerAssets.startGlow, -startSize * 0.5, -startSize * 0.5, startSize, startSize);
                    ctx.drawImage(beamerAssets.endGlow, -endSize * 0.5, -beamLen - endSize * 0.5, endSize, endSize);
                    ctx.restore();
                    continue;
                }
                if (b.variant === 'mapbot-blaster') {
                    const alpha = Math.min(1, Math.max(0, (1 - b.age / b.life) * 1.4));
                    const bw = 0.36 * 48;
                    ctx.save();
                    ctx.globalAlpha = alpha;
                    ctx.translate(sx1, sy1);
                    ctx.rotate(beamAngle);
                    ctx.imageSmoothingEnabled = true;
                    if (mapbotChargingLaserImg.complete && mapbotChargingLaserImg.naturalWidth > 0) {
                        ctx.drawImage(mapbotChargingLaserImg, -bw * 0.5, -beamLen, bw, beamLen);
                    } else {
                        ctx.fillStyle = '#d84aff';
                        ctx.fillRect(-4.5, -beamLen, 9, beamLen);
                    }
                    ctx.fillStyle = '#f5c2ff';
                    ctx.beginPath();
                    ctx.arc(0, 0, 6, 0, Math.PI * 2);
                    ctx.fill();
                    ctx.beginPath();
                    ctx.arc(0, -beamLen, 10, 0, Math.PI * 2);
                    ctx.fill();
                    ctx.restore();
                    continue;
                }
                const alpha = Math.max(0, 1 - b.age / b.life);
                const bulletImg = b.variant === 'rarebot' ? rarebotBulletImg : goodbotBulletImg;
                ctx.save();
                ctx.globalAlpha = alpha;
                ctx.translate(sx1, sy1);
                ctx.rotate(beamAngle);
                if (bulletImg.complete && bulletImg.naturalWidth > 0) {
                    ctx.imageSmoothingEnabled = true;
                    ctx.drawImage(bulletImg, -beamWidth / 2, -beamLen, beamWidth, beamLen);
                } else {
                    ctx.fillStyle = b.variant === 'rarebot' ? '#ff2a2a' : '#b833ff';
                    ctx.fillRect(-2, -beamLen, 4, beamLen);
                }
                ctx.restore();
            }
        }

        if (serverProjectiles.size > 0) {
            const bulletScale = (48 / 512) * HANDS_SCALE * 1.35;
            for (const [, proj] of serverProjectiles) {
                const bx = proj.x - camX;
                const by = proj.y - camY;
                if (bx < -120 || bx > camW + 120 || by < -120 || by > camH + 120) continue;
                if (proj.kind === 'mapbot-core-blast' || proj.variant === 'mapbot-core-blast') {
                    const pulse = 1 + 0.08 * Math.sin(nowMs * 0.022);
                    const bSize = (proj.radius || 32) * 2.8 * pulse;
                    ctx.save();
                    ctx.translate(bx, by);
                    ctx.rotate(proj.spinAngle !== undefined ? proj.spinAngle : (proj.angle || 0));
                    ctx.imageSmoothingEnabled = true;
                    if (mapbotBlastImg.complete && mapbotBlastImg.naturalWidth > 0) {
                        ctx.drawImage(mapbotBlastImg, -bSize * 0.5, -bSize * 0.5, bSize, bSize);
                    } else {
                        const r = proj.radius || 32;
                        ctx.fillStyle = '#b833ff';
                        ctx.beginPath();
                        ctx.arc(0, 0, r, 0, Math.PI * 2);
                        ctx.fill();
                        ctx.fillStyle = '#f5c2ff';
                        ctx.beginPath();
                        ctx.arc(0, 0, r * 0.48, 0, Math.PI * 2);
                        ctx.fill();
                    }
                    ctx.restore();
                    continue;
                }
                const isCannonBall = proj.kind === 'cannonball' || proj.variant === 'goodbot-cannon';
                if (isCannonBall) {
                    ctx.save();
                    ctx.translate(bx, by);
                    ctx.rotate(proj.spinAngle !== undefined ? proj.spinAngle : (proj.angle || 0));
                    if (goodbotCannonBallImg.complete && goodbotCannonBallImg.naturalWidth > 0) {
                        const cw = 52;
                        const ch = 52;
                        const cbMip = getScaledSpriteCanvas(
                            'cannonball_goodbot_52',
                            goodbotCannonBallImg,
                            0,
                            0,
                            goodbotCannonBallImg.naturalWidth,
                            goodbotCannonBallImg.naturalHeight,
                            cw,
                            ch
                        ) || goodbotCannonBallImg;
                        ctx.imageSmoothingEnabled = true;
                        ctx.drawImage(cbMip, -cw / 2, -ch / 2, cw, ch);
                    } else {
                        ctx.fillStyle = '#b833ff';
                        ctx.strokeStyle = '#000000';
                        ctx.lineWidth = 2.5;
                        ctx.beginPath();
                        ctx.arc(0, 0, 26, 0, Math.PI * 2);
                        ctx.fill();
                        ctx.stroke();
                        ctx.fillStyle = '#f0aaff';
                        ctx.beginPath();
                        ctx.arc(-8, -8, 8, 0, Math.PI * 2);
                        ctx.fill();
                    }
                    ctx.restore();
                    continue;
                }
                if (proj.kind === 'heal-bullet' || proj.variant === 'rarebot-heal') {
                    ctx.save();
                    ctx.translate(bx, by);
                    ctx.rotate(proj.angle || 0);
                    if (rarebotHealBulletImg.complete && rarebotHealBulletImg.naturalWidth > 0) {
                        const bw = rarebotHealBulletImg.naturalWidth * bulletScale;
                        const bh = rarebotHealBulletImg.naturalHeight * bulletScale;
                        const healMip = getScaledSpriteCanvas(
                            'bullet_rarebot_heal',
                            rarebotHealBulletImg,
                            0,
                            0,
                            rarebotHealBulletImg.naturalWidth,
                            rarebotHealBulletImg.naturalHeight,
                            bw,
                            bh
                        ) || rarebotHealBulletImg;
                        ctx.drawImage(healMip, -bw / 2, -bh / 2, bw, bh);
                    } else {
                        ctx.fillStyle = '#24f042';
                        ctx.fillRect(-2, -12, 4, 24);
                    }
                    ctx.restore();
                    continue;
                }
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

        if (serverRockets.size > 0) {
            const rw = 16;
            const rh = 16 * (410 / 256);
            for (const [, r] of serverRockets) {
                const rx = r.x - camX;
                const ry = r.y - camY;
                if (rx < -48 || rx > camW + 48 || ry < -48 || ry > camH + 48) continue;
                ctx.save();
                ctx.translate(rx, ry);
                ctx.rotate(r.renderAngle ?? r.angle ?? 0);
                ctx.imageSmoothingEnabled = true;
                if (mapbotRocketImg.complete && mapbotRocketImg.naturalWidth > 0) {
                    ctx.drawImage(mapbotRocketImg, -rw * 0.5, -rh * 0.5, rw, rh);
                } else {
                    ctx.fillStyle = '#c84aff';
                    ctx.beginPath();
                    ctx.ellipse(0, 0, 5, 10, 0, 0, Math.PI * 2);
                    ctx.fill();
                }
                ctx.restore();
            }
        }

        if (mapbotExplosions.length > 0) {
            const expReady = mapbotExplosionImg.complete && mapbotExplosionImg.naturalWidth >= 1536;
            for (let i = 0; i < mapbotExplosions.length; i++) {
                const me = mapbotExplosions[i];
                const mx = me.x - camX;
                const my = me.y - camY;
                const drawSize = me.radius * 2.15;
                if (mx + drawSize < -40 || mx - drawSize > camW + 40 || my + drawSize < -40 || my - drawSize > camH + 40) continue;
                const p = Math.max(0, Math.min(0.999, me.age / me.life));
                if (expReady) {
                    const frame = Math.min(5, Math.floor(p * 6));
                    ctx.save();
                    ctx.imageSmoothingEnabled = true;
                    ctx.drawImage(mapbotExplosionImg, frame * 256, 0, 256, 256, mx - drawSize * 0.5, my - drawSize * 0.5, drawSize, drawSize);
                    ctx.restore();
                } else {
                    ctx.save();
                    ctx.fillStyle = `rgba(216, 74, 255, ${(0.6 * (1 - p)).toFixed(3)})`;
                    ctx.beginPath();
                    ctx.arc(mx, my, me.radius * (0.3 + 0.7 * p), 0, Math.PI * 2);
                    ctx.fill();
                    ctx.restore();
                }
            }
        }

        if (grenadeShockwaves.length > 0) {
            ctx.save();
            for (let i = 0; i < grenadeShockwaves.length; i++) {
                const w = grenadeShockwaves[i];
                const sx = w.x - camX;
                const sy = w.y - camY;
                if (sx + w.radius < -40 || sx - w.radius > camW + 40 || sy + w.radius < -40 || sy - w.radius > camH + 40) continue;
                const p = Math.max(0, Math.min(1, w.age / w.life));
                const isRed = w.variant === 'rarebot';
                if (w.isExplosionFlash) {
                    const r = w.radius * (0.25 + 0.75 * Math.min(1, p * 2.2));
                    const alpha = Math.max(0, 1 - p);
                    ctx.fillStyle = isRed
                        ? `rgba(255, 42, 42, ${(0.42 * alpha).toFixed(3)})`
                        : `rgba(184, 51, 255, ${(0.42 * alpha).toFixed(3)})`;
                    ctx.beginPath();
                    ctx.arc(sx, sy, r, 0, Math.PI * 2);
                    ctx.fill();
                    ctx.strokeStyle = isRed
                        ? `rgba(255, 110, 90, ${(0.85 * alpha).toFixed(3)})`
                        : `rgba(216, 74, 255, ${(0.85 * alpha).toFixed(3)})`;
                    ctx.lineWidth = 4;
                    ctx.stroke();
                } else {
                    const grow = Math.min(1, p / 0.22);
                    const r = w.radius * (0.2 + 0.8 * grow);
                    const fade = p < 0.7 ? 1 : Math.max(0, (1 - p) / 0.3);
                    ctx.fillStyle = isRed
                        ? `rgba(220, 28, 36, ${(0.5 * fade).toFixed(3)})`
                        : `rgba(184, 51, 255, ${(0.5 * fade).toFixed(3)})`;
                    ctx.beginPath();
                    ctx.arc(sx, sy, r, 0, Math.PI * 2);
                    ctx.fill();
                    ctx.strokeStyle = isRed
                        ? `rgba(255, 140, 130, ${(0.75 * fade).toFixed(3)})`
                        : `rgba(240, 170, 255, ${(0.75 * fade).toFixed(3)})`;
                    ctx.lineWidth = 3;
                    ctx.stroke();
                }
            }
            ctx.restore();
        }

        if (serverGrenades.length > 0) {
            const gReady = goodbotGrenadeImg.complete && goodbotGrenadeImg.naturalWidth > 0;
            const rgReady = rarebotGrenadeImg.complete && rarebotGrenadeImg.naturalWidth > 0;
            for (let i = 0; i < serverGrenades.length; i++) {
                const g = serverGrenades[i];
                const gx = g.x - camX;
                const gy = g.y - camY;
                if (gx < -48 || gx > camW + 48 || gy < -48 || gy > camH + 48) continue;
                const isRarebot = g.variant === 'rarebot';
                const img = isRarebot ? rarebotGrenadeImg : goodbotGrenadeImg;
                const imgReady = isRarebot ? rgReady : gReady;
                const gRatio = imgReady ? (img.naturalHeight / img.naturalWidth) : 1.1142857;
                const baseGW = gRatio > 1.05 ? GRENADE_DRAW_SIZE : 23;
                const gScale = Math.max(1, 24 / (baseGW * gRatio));
                const gDrawW = baseGW * gScale;
                const gDrawH = baseGW * gRatio * gScale;
                if (g.phase === 'armed' || g.phase === 'shockwaved') {
                    const pulse = 0.5 + 0.5 * Math.sin(nowMs * 0.018);
                    ctx.save();
                    ctx.strokeStyle = isRarebot
                        ? `rgba(255, 58, 58, ${(0.35 + 0.45 * pulse).toFixed(3)})`
                        : `rgba(216, 74, 255, ${(0.35 + 0.45 * pulse).toFixed(3)})`;
                    ctx.lineWidth = 2;
                    ctx.beginPath();
                    ctx.arc(gx, gy, Math.max(gDrawW, gDrawH) * (0.52 + 0.12 * pulse), 0, Math.PI * 2);
                    ctx.stroke();
                    ctx.restore();
                }
                ctx.save();
                ctx.translate(gx, gy);
                ctx.rotate(g.angle || 0);
                if (imgReady) {
                    ctx.imageSmoothingEnabled = true;
                    ctx.drawImage(img, -gDrawW / 2, -gDrawH / 2, gDrawW, gDrawH);
                } else {
                    const gr = 10;
                    ctx.fillStyle = '#1b1b22';
                    ctx.strokeStyle = '#000000';
                    ctx.lineWidth = 1.8;
                    ctx.beginPath();
                    ctx.ellipse(0, 0, gr * 0.85, gr * 1.15, 0, 0, Math.PI * 2);
                    ctx.fill();
                    ctx.stroke();
                    ctx.fillStyle = isRarebot ? '#e02424' : '#b833ff';
                    ctx.beginPath();
                    ctx.arc(0, 1, gr * 0.48, 0, Math.PI * 2);
                    ctx.fill();
                }
                ctx.restore();
            }
        }

        if (sprintDustParticles.length > 0) {
            for (let i = 0; i < sprintDustParticles.length; i++) {
                const pt = sprintDustParticles[i];
                const px = pt.x - camX;
                const py = pt.y - camY;
                if (px < -16 || px > camW + 16 || py < -16 || py > camH + 16) continue;
                const alpha = Math.max(0, 1 - pt.age / pt.life);
                ctx.globalAlpha = alpha * 0.28;
                ctx.fillStyle = pt.color;
                ctx.beginPath();
                ctx.arc(px, py, pt.radius * (0.75 + 0.45 * (1 - alpha)), 0, Math.PI * 2);
                ctx.fill();
            }
            ctx.globalAlpha = 1;
        }

        if (dropslideParticles.length > 0) {
            for (let i = 0; i < dropslideParticles.length; i++) {
                const pt = dropslideParticles[i];
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

        pendingEntityLabels.length = 0;

        for (const id in serverEnemies) {
            const e = serverEnemies[id];
            const eKind = e.kind || 'rarebot';
            if (eKind === 'dropship' || eKind === 'mapbot') continue;
            const eFaction = e.faction || 'rarebot';
            const ew = e.width || 48;
            const eh = e.height || 48;
            const eWorldCX = (e.renderX ?? e.x) + ew / 2;
            const eWorldCY = (e.renderY ?? e.y) + eh / 2;
            const eRX = eWorldCX - camX;
            const eRY = eWorldCY - camY;
            if (eRX < -cullPad || eRX > camW + cullPad || eRY < -cullPad || eRY > camH + cullPad) continue;
            const es = Math.min(2, Math.max(0.3, e.scale || 1));
            const key = `enemy:${id}`;
            const eInTree = isWorldPointInTree(eWorldCX, eWorldCY);
            let showBars = false;
            if (!eInTree && ME.faction !== 'spectator') {
                if (eFaction === ME.faction) {
                    const edx = eWorldCX - meCX;
                    const edy = eWorldCY - meCY;
                    showBars = (edx * edx + edy * edy) <= 260 * 260;
                } else if (ME.faction === 'goodbot') {
                    showBars = (enemyAggroUntil.get(key) || 0) > nowMs;
                } else {
                    showBars = clientHasLOS(meCX, meCY, eWorldCX, eWorldCY);
                }
            }
            const eWeapon = e.weapon || 'hands';
            const eLabel = e.name || (eKind === 'grenadier' ? 'Rarebot Grenadier' : (eKind === 'sacrifice' ? 'Sacrifice Rarebot' : (eKind === 'scout' ? 'Scout Rarebot' : (eKind === 'healer' ? 'Healer Rarebot' : (eKind === 'prototype' ? 'Prototype Rarebot' : (eKind === 'rarebot3' ? 'Rarebot 3.0' : (eKind === 'rarebot2' ? 'Rarebot 2.0' : 'Rarebot')))))));
            const defMaxH = eKind === 'prototype' ? 120 : (eKind === 'sacrifice' ? 100 : (eKind === 'scout' ? 300 : (eKind === 'rarebot3' ? 600 : (eKind === 'rarebot2' ? 475 : (eKind === 'grenadier' ? 320 : 255)))));
            const defMaxE = eKind === 'prototype' ? 100 : 50;
            const bars = showBars ? {
                health: e.health ?? defMaxH,
                maxHealth: e.maxHealth ?? defMaxH,
                energy: e.energy ?? defMaxE,
                maxEnergy: e.maxEnergy ?? defMaxE
            } : null;
            drawEntity(eRX, eRY, ew, eh, e.renderAngle ?? 0, es, null, eFaction, eKind !== 'sacrifice', getSwingOffset(key, nowMs), bars, eKind, eWeapon, key, nowMs, e.armor || (eKind === 'rarebot3' ? 'rarebot-armor' : null));
            if (!eInTree && eLabel) {
                pendingEntityLabels.push({ x: eRX, y: eRY, sH: eh * es, label: eLabel, faction: eFaction });
            }
        }

        for (const id in serverAllies) {
            const a = serverAllies[id];
            const aKind = a.kind || null;
            if (aKind === 'dropship') continue;
            const aFaction = a.faction || 'goodbot';
            const aw = a.width || 48;
            const ah = a.height || 48;
            const aWorldCX = (a.renderX ?? a.x) + aw / 2;
            const aWorldCY = (a.renderY ?? a.y) + ah / 2;
            const aRX = aWorldCX - camX;
            const aRY = aWorldCY - camY;
            if (aRX < -cullPad || aRX > camW + cullPad || aRY < -cullPad || aRY > camH + cullPad) continue;
            const as = Math.min(2, Math.max(0.3, a.scale || 1));
            const key = `ally:${id}`;
            const aInTree = isWorldPointInTree(aWorldCX, aWorldCY);
            let showBars = false;
            if (!aInTree && ME.faction !== 'spectator') {
                if (aFaction === ME.faction) {
                    const adx = aWorldCX - meCX;
                    const ady = aWorldCY - meCY;
                    showBars = (adx * adx + ady * ady) <= 260 * 260;
                } else if (ME.faction === 'goodbot') {
                    showBars = (enemyAggroUntil.get(key) || 0) > nowMs;
                } else {
                    showBars = clientHasLOS(meCX, meCY, aWorldCX, aWorldCY);
                }
            }
            const aDefMaxH = a.weapon === 'goodbot-assault-laser' ? 1500 : 1000;
            const bars = showBars ? {
                health: a.health ?? aDefMaxH,
                maxHealth: a.maxHealth ?? aDefMaxH,
                energy: a.energy ?? 255,
                maxEnergy: a.maxEnergy ?? 255
            } : null;
            drawEntity(aRX, aRY, aw, ah, a.renderAngle ?? 0, as, null, aFaction, true, getSwingOffset(key, nowMs), bars, aKind, a.weapon || 'hands', key, nowMs, a.armor || (a.weapon === 'goodbot-assault-laser' ? 'goodbot-armor' : null));
            if (!aInTree) {
                pendingEntityLabels.push({ x: aRX, y: aRY, sH: ah * as, label: a.name || 'Goodbot', faction: aFaction });
            }
        }

        for (const id in serverPlayers) {
            const p = serverPlayers[id];
            const pFaction = p.faction || 'goodbot';
            if (pFaction === 'spectator') continue;
            const pw = p.width || 48;
            const ph = p.height || 48;
            const pWorldCX = (p.renderX ?? p.x) + pw / 2;
            const pWorldCY = (p.renderY ?? p.y) + ph / 2;
            const pRX = pWorldCX - camX;
            const pRY = pWorldCY - camY;
            if (pRX < -cullPad || pRX > camW + cullPad || pRY < -cullPad || pRY > camH + cullPad) continue;
            const ps = Math.min(2, Math.max(0.3, p.scale || 1));
            const key = `player:${id}`;
            const pInTree = isWorldPointInTree(pWorldCX, pWorldCY);
            let showBars = false;
            if (!pInTree && ME.faction !== 'spectator') {
                if (pFaction === ME.faction) {
                    const adx = pWorldCX - meCX;
                    const ady = pWorldCY - meCY;
                    showBars = (adx * adx + ady * ady) <= 260 * 260;
                } else if (ME.faction === 'goodbot') {
                    showBars = (enemyAggroUntil.get(key) || 0) > nowMs;
                } else {
                    showBars = clientHasLOS(meCX, meCY, pWorldCX, pWorldCY);
                }
            }
            const bars = showBars ? {
                health: p.health ?? 1000,
                maxHealth: p.maxHealth ?? 1000,
                energy: p.energy ?? (pFaction === 'rarebot' ? 50 : 255),
                maxEnergy: p.maxEnergy ?? (pFaction === 'rarebot' ? 50 : 255)
            } : null;
            const pLabel = formatDisplayName(p.name, Boolean(p.isAdmin));
            drawEntity(pRX, pRY, pw, ph, p.renderAngle ?? 0, ps, null, pFaction, true, getSwingOffset(key, nowMs), bars, null, p.weapon || 'hands', key, nowMs, p.armor || null);
            if (!pInTree && pLabel) {
                pendingEntityLabels.push({ x: pRX, y: pRY, sH: ph * ps, label: pLabel, faction: pFaction });
            }
        }

        if (ME.faction !== 'spectator') {
            const pRenderX = ME.x - camX + ME.width / 2;
            const pRenderY = ME.y - camY + ME.height / 2;
            const myKey = `player:${myId}`;
            const meInTree = isWorldPointInTree(meCX, meCY);
            drawEntity(pRenderX, pRenderY, ME.width, ME.height, ME.angle, ME.scale, null, ME.faction, true, getSwingOffset(myKey, nowMs), null, null, getMyEquippedWeapon(), myKey, nowMs, ME.armor);
            if (!meInTree) {
                pendingEntityLabels.push({ x: pRenderX, y: pRenderY, sH: ME.height * ME.scale, label: formatDisplayName(myName, isAdmin), faction: ME.faction });
            }
        }

        for (const id in serverEnemies) {
            const e = serverEnemies[id];
            if ((e.kind || 'rarebot') !== 'mapbot' || e.airborne) continue;
            const eFaction = e.faction || 'mapbot';
            const ew = e.width || 48;
            const eh = e.height || 48;
            const eWorldCX = (e.renderX ?? e.x) + ew / 2;
            const eWorldCY = (e.renderY ?? e.y) + eh / 2;
            const eRX = eWorldCX - camX;
            const eRY = eWorldCY - camY;
            if (eRX < -cullPad || eRX > camW + cullPad || eRY < -cullPad || eRY > camH + cullPad) continue;
            const es = Math.min(2, Math.max(0.3, e.scale || 1));
            const key = `enemy:${id}`;
            const eInTree = isWorldPointInTree(eWorldCX, eWorldCY);
            const showBars = !eInTree;
            const eWeapon = e.weapon || 'mapbot-claws';
            const eLabel = e.name || 'Mapbot';
            const bars = showBars ? {
                health: e.health ?? 100000,
                maxHealth: e.maxHealth ?? 100000,
                energy: e.energy ?? 500,
                maxEnergy: e.maxEnergy ?? 500
            } : null;
            drawEntity(eRX, eRY, ew, eh, e.renderAngle ?? 0, es, null, eFaction, true, getSwingOffset(key, nowMs), bars, 'mapbot', eWeapon, key, nowMs, e.armor || null);
            if (!eInTree && eLabel) {
                pendingEntityLabels.push({ x: eRX, y: eRY, sH: eh * es, label: eLabel, faction: eFaction });
            }
        }
    }

    ctx.save();
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.imageSmoothingEnabled = false;
    for (let cy = startCY; cy <= endCY; cy++) {
        const wy0 = cy * cs;
        const maxLocalH = Math.min(cs, mapH - wy0);
        if (maxLocalH <= 0) continue;
        for (let cx = startCX; cx <= endCX; cx++) {
            if (WORLD.MAP.wallChunkEmpty[cy] && WORLD.MAP.wallChunkEmpty[cy][cx]) continue;
            const wx0 = cx * cs;
            const maxLocalW = Math.min(cs, mapW - wx0);
            if (maxLocalW <= 0) continue;
            drawClippedChunk(
                WORLD.MAP.wallChunks[cy][cx],
                wx0,
                wy0,
                { minX: 0, minY: 0, maxX: maxLocalW, maxY: maxLocalH },
                camX,
                camY,
                visW,
                visH,
                vs
            );
        }
    }

    for (let cy = startCY; cy <= endCY; cy++) {
        const wy0 = cy * cs;
        const maxLocalH = Math.min(cs, mapH - wy0);
        if (maxLocalH <= 0) continue;
        for (let cx = startCX; cx <= endCX; cx++) {
            if (WORLD.MAP.fgChunkEmpty[cy] && WORLD.MAP.fgChunkEmpty[cy][cx]) continue;
            const wx0 = cx * cs;
            const maxLocalW = Math.min(cs, mapW - wx0);
            if (maxLocalW <= 0) continue;
            drawClippedChunk(
                WORLD.MAP.fgChunks[cy][cx],
                wx0,
                wy0,
                { minX: 0, minY: 0, maxX: maxLocalW, maxY: maxLocalH },
                camX,
                camY,
                visW,
                visH,
                vs
            );
        }
    }
    ctx.restore();

    if (!inMainMenu && myId !== null) {
        for (let i = 0; i < pendingEntityLabels.length; i++) {
            const item = pendingEntityLabels[i];
            drawEntityLabel(item.x, item.y, item.sH, item.label, item.faction);
        }
        pendingEntityLabels.length = 0;
        for (const id in serverPlayers) {
            const p = serverPlayers[id];
            if ((p.faction || 'goodbot') !== 'spectator') continue;
            const pw = p.width || 48;
            const ph = p.height || 48;
            const pRX = (p.renderX ?? p.x) - camX + pw / 2;
            const pRY = (p.renderY ?? p.y) - camY + ph / 2;
            if (pRX < -cullPad || pRX > camW + cullPad || pRY < -cullPad || pRY > camH + cullPad) continue;
            const ps = Math.min(2, Math.max(0.3, p.scale || 1));
            const key = `player:${id}`;
            drawEntity(pRX, pRY, pw, ph, p.renderAngle ?? 0, ps, formatDisplayName(p.name, Boolean(p.isAdmin)), 'spectator', false, 0, null, null, 'hands', key, nowMs);
        }

        if (ME.faction === 'spectator') {
            const pRenderX = ME.x - camX + ME.width / 2;
            const pRenderY = ME.y - camY + ME.height / 2;
            const myKey = `player:${myId}`;
            drawEntity(pRenderX, pRenderY, ME.width, ME.height, ME.angle, ME.scale, formatDisplayName(myName, isAdmin), 'spectator', false, 0, null, null, 'hands', myKey, nowMs);
        }

        for (const id in serverEnemies) {
            const e = serverEnemies[id];
            if ((e.kind || 'rarebot') !== 'dropship') continue;
            const ew = e.width || 224;
            const eh = e.height || 224;
            const eRX = (e.renderX ?? e.x) + ew / 2 - camX;
            const eRY = (e.renderY ?? e.y) + eh / 2 - camY;
            if (eRX < -cullPad || eRX > camW + cullPad || eRY < -cullPad || eRY > camH + cullPad) continue;
            const es = Math.min(2, Math.max(0.3, e.scale || 1));
            const key = `enemy:${id}`;
            drawEntity(eRX, eRY, ew, eh, e.renderAngle ?? 0, es, e.name || 'Rarebot Dropship', e.faction || 'rarebot', false, 0, null, 'dropship-rarebot', 'none', key, nowMs);
        }

        for (const id in serverAllies) {
            const a = serverAllies[id];
            if (a.kind !== 'dropship') continue;
            const aw = a.width || 224;
            const ah = a.height || 224;
            const aRX = (a.renderX ?? a.x) + aw / 2 - camX;
            const aRY = (a.renderY ?? a.y) + ah / 2 - camY;
            if (aRX < -cullPad || aRX > camW + cullPad || aRY < -cullPad || aRY > camH + cullPad) continue;
            const as = Math.min(2, Math.max(0.3, a.scale || 1));
            const key = `ally:${id}`;
            drawEntity(aRX, aRY, aw, ah, a.renderAngle ?? 0, as, a.name || 'Goodbot Dropship', a.faction || 'goodbot', false, 0, null, 'dropship-goodbot', 'none', key, nowMs);
        }

        for (const id in serverEnemies) {
            const e = serverEnemies[id];
            if ((e.kind || 'rarebot') !== 'mapbot' || !e.airborne) continue;
            const eFaction = e.faction || 'mapbot';
            const ew = e.width || 48;
            const eh = e.height || 48;
            const eWorldCX = (e.renderX ?? e.x) + ew / 2;
            const eWorldCY = (e.renderY ?? e.y) + eh / 2;
            const eRX = eWorldCX - camX;
            const eRY = eWorldCY - camY;
            if (eRX < -cullPad || eRX > camW + cullPad || eRY < -cullPad || eRY > camH + cullPad) continue;
            const es = Math.min(2, Math.max(0.3, e.scale || 1));
            const jh = Math.max(0, Math.min(1.6, e.renderJumpHeight ?? e.jumpHeight ?? 0));
            const airScale = es * (1 + jh * 0.36);
            const airY = eRY - jh * 26;
            const key = `enemy:${id}`;
            const eWeapon = e.weapon || 'mapbot-claws';
            const eLabel = e.name || 'Mapbot';
            const bars = {
                health: e.health ?? 100000,
                maxHealth: e.maxHealth ?? 100000,
                energy: e.energy ?? 500,
                maxEnergy: e.maxEnergy ?? 500
            };
            ctx.save();
            ctx.fillStyle = `rgba(0, 0, 0, ${(Math.max(0.14, 0.34 - jh * 0.1)).toFixed(3)})`;
            ctx.beginPath();
            ctx.ellipse(eRX, eRY + 8, ew * 0.48 * Math.max(0.65, 1 - jh * 0.14), eh * 0.28 * Math.max(0.65, 1 - jh * 0.14), 0, 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();
            drawEntity(eRX, airY, ew, eh, e.renderAngle ?? 0, airScale, null, eFaction, true, getSwingOffset(key, nowMs), bars, 'mapbot', eWeapon, key, nowMs, e.armor || null);
            if (eLabel) {
                drawEntityLabel(eRX, airY, eh * airScale, eLabel, eFaction);
            }
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

    if (healParticles.length > 0) {
        ctx.fillStyle = '#32ff32';
        ctx.beginPath();
        for (let i = 0; i < healParticles.length; i++) {
            const hpObj = healParticles[i];
            if (hpObj.curR <= 0.15) continue;
            const px = hpObj.x - camX;
            const py = hpObj.y - camY;
            if (px < -16 || px > camW + 16 || py < -16 || py > camH + 16) continue;
            ctx.moveTo(px + hpObj.curR, py);
            ctx.arc(px, py, hpObj.curR, 0, Math.PI * 2);
        }
        ctx.fill();
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
                } else if (ft.playerId !== undefined && serverPlayers[ft.playerId]) {
                    const fp = serverPlayers[ft.playerId];
                    tx = (fp.renderX ?? fp.x) + fp.width / 2;
                    ty = (fp.renderY ?? fp.y) - 26;
                } else if (ft.allyId !== undefined && serverAllies[ft.allyId]) {
                    const fa = serverAllies[ft.allyId];
                    tx = (fa.renderX ?? fa.x) + (fa.width || 48) / 2;
                    ty = (fa.renderY ?? fa.y) - 26;
                } else if (ft.enemyId !== undefined && serverEnemies[ft.enemyId]) {
                    const fe = serverEnemies[ft.enemyId];
                    tx = (fe.renderX ?? fe.x) + (fe.width || 48) / 2;
                    ty = (fe.renderY ?? fe.y) - 26;
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

        if ((SETTINGS.showDamageHitboxes || SETTINGS.generalHitbox) && activeDamageHitboxes.length > 0) {
            ctx.save();
            for (let i = 0; i < activeDamageHitboxes.length; i++) {
                const hb = activeDamageHitboxes[i];
                const hx = hb.x - camX;
                const hy = hb.y - camY;
                const half = hb.size * 0.5;
                if (hx + half < -40 || hx - half > camW + 40 || hy + half < -40 || hy - half > camH + 40) continue;
                ctx.save();
                ctx.translate(hx, hy);
                if (hb.shape === 'circle') {
                    if (SETTINGS.showDamageHitboxes) {
                        ctx.fillStyle = 'rgba(255, 255, 255, 0.28)';
                        ctx.beginPath();
                        ctx.arc(0, 0, half, 0, Math.PI * 2);
                        ctx.fill();
                    }
                    ctx.strokeStyle = SETTINGS.generalHitbox ? '#ffffff' : 'rgba(255, 255, 255, 0.65)';
                    ctx.lineWidth = 1.5;
                    ctx.beginPath();
                    ctx.arc(0, 0, half, 0, Math.PI * 2);
                    ctx.stroke();
                } else {
                    if (hb.angle) ctx.rotate(hb.angle);
                    if (SETTINGS.showDamageHitboxes) {
                        ctx.fillStyle = 'rgba(255, 255, 255, 0.28)';
                        ctx.fillRect(-half, -half, hb.size, hb.size);
                    }
                    ctx.strokeStyle = SETTINGS.generalHitbox ? '#ffffff' : 'rgba(255, 255, 255, 0.65)';
                    ctx.lineWidth = 1.5;
                    ctx.strokeRect(-half, -half, hb.size, hb.size);
                }
                ctx.restore();
            }
            ctx.restore();
        }

        if (SETTINGS.generalHitbox) {
            ctx.save();
            ctx.strokeStyle = '#ffffff';
            ctx.lineWidth = 1.5;

            for (const id in serverEnemies) {
                const e = serverEnemies[id];
                const ew = e.width || 48;
                const eh = e.height || 48;
                const es = Math.min(2, Math.max(0.3, e.scale || 1));
                const er = (ew * es) * 0.5;
                const ecx = (e.renderX ?? e.x) + ew * 0.5 - camX;
                const ecy = (e.renderY ?? e.y) + eh * 0.5 - camY;
                if (ecx + er < -20 || ecx - er > camW + 20 || ecy + er < -20 || ecy - er > camH + 20) continue;
                ctx.beginPath();
                ctx.arc(ecx, ecy, er, 0, Math.PI * 2);
                ctx.stroke();
            }

            for (const id in serverAllies) {
                const a = serverAllies[id];
                const aw = a.width || 48;
                const ah = a.height || 48;
                const as = Math.min(2, Math.max(0.3, a.scale || 1));
                const ar = (aw * as) * 0.5;
                const acx = (a.renderX ?? a.x) + aw * 0.5 - camX;
                const acy = (a.renderY ?? a.y) + ah * 0.5 - camY;
                if (acx + ar < -20 || acx - ar > camW + 20 || acy + ar < -20 || acy - ar > camH + 20) continue;
                ctx.beginPath();
                ctx.arc(acx, acy, ar, 0, Math.PI * 2);
                ctx.stroke();
            }

            for (const id in serverPlayers) {
                const p = serverPlayers[id];
                if ((p.faction || 'goodbot') === 'spectator') continue;
                const pw = p.width || 48;
                const ph = p.height || 48;
                const ps = Math.min(2, Math.max(0.3, p.scale || 1));
                const pr = (pw * ps) * 0.5;
                const pcx = (p.renderX ?? p.x) + pw * 0.5 - camX;
                const pcy = (p.renderY ?? p.y) + ph * 0.5 - camY;
                if (pcx + pr < -20 || pcx - pr > camW + 20 || pcy + pr < -20 || pcy - pr > camH + 20) continue;
                ctx.beginPath();
                ctx.arc(pcx, pcy, pr, 0, Math.PI * 2);
                ctx.stroke();
            }

            if (ME.faction !== 'spectator') {
                const myr = (ME.width * (ME.scale || 1)) * 0.5;
                const mycx = ME.x + ME.width * 0.5 - camX;
                const mycy = ME.y + ME.height * 0.5 - camY;
                ctx.beginPath();
                ctx.arc(mycx, mycy, myr, 0, Math.PI * 2);
                ctx.stroke();
            }

            for (let i = 0; i < serverGrenades.length; i++) {
                const g = serverGrenades[i];
                const gx = g.x - camX;
                const gy = g.y - camY;
                if (gx < -20 || gx > camW + 20 || gy < -20 || gy > camH + 20) continue;
                ctx.beginPath();
                ctx.arc(gx, gy, 8.5, 0, Math.PI * 2);
                ctx.stroke();
            }

            for (const [, proj] of serverProjectiles) {
                const bx = proj.x - camX;
                const by = proj.y - camY;
                const br = proj.radius || ((proj.kind === 'cannonball' || proj.variant === 'goodbot-cannon') ? 26 : 5);
                if (bx + br < -20 || bx - br > camW + 20 || by + br < -20 || by - br > camH + 20) continue;
                ctx.beginPath();
                ctx.arc(bx, by, br, 0, Math.PI * 2);
                ctx.stroke();
            }

            for (let i = 0; i < raycastBeams.length; i++) {
                const b = raycastBeams[i];
                ctx.beginPath();
                ctx.moveTo(b.x1 - camX, b.y1 - camY);
                ctx.lineTo(b.x2 - camX, b.y2 - camY);
                ctx.stroke();
            }

            for (let i = 0; i < grenadeShockwaves.length; i++) {
                const w = grenadeShockwaves[i];
                const sx = w.x - camX;
                const sy = w.y - camY;
                if (sx + w.radius < -40 || sx - w.radius > camW + 40 || sy + w.radius < -40 || sy - w.radius > camH + 40) continue;
                ctx.beginPath();
                ctx.arc(sx, sy, w.radius, 0, Math.PI * 2);
                ctx.stroke();
            }

            ctx.restore();
        }

        if (hitPointMarkers.length > 0) {
            ctx.save();
            ctx.imageSmoothingEnabled = false;
            for (let i = 0; i < hitPointMarkers.length; i++) {
                const m = hitPointMarkers[i];
                const mx = Math.round(m.x - camX);
                const my = Math.round(m.y - camY);
                if (mx < -20 || mx > camW + 20 || my < -20 || my > camH + 20) continue;
                const progress = m.age / m.life;
                const alpha = progress < 0.45 ? 1 : Math.max(0, 1 - (progress - 0.45) / 0.55);
                ctx.globalAlpha = alpha;
                ctx.fillStyle = 'rgba(0, 0, 0, 0.9)';
                ctx.fillRect(mx - 2, my - 2, 4, 4);
                ctx.fillRect(mx - 2, my - 8, 4, 5);
                ctx.fillRect(mx - 2, my + 3, 4, 5);
                ctx.fillRect(mx - 8, my - 2, 5, 4);
                ctx.fillRect(mx + 3, my - 2, 5, 4);
                ctx.fillStyle = m.color;
                ctx.fillRect(mx - 1, my - 1, 2, 2);
                ctx.fillRect(mx - 1, my - 7, 2, 4);
                ctx.fillRect(mx - 1, my + 3, 2, 4);
                ctx.fillRect(mx - 7, my - 1, 4, 2);
                ctx.fillRect(mx + 3, my - 1, 4, 2);
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

    if (hasMouseMoved && isRangedCrosshairActive()) {
        const cx = Math.round(WORLD.INPUTS.mouseX);
        const cy = Math.round(WORLD.INPUTS.mouseY);
        const gap = crosshairGap;
        const len = 8;
        const thick = 2;
        const halfT = 1;
        ctx.save();
        ctx.imageSmoothingEnabled = false;
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(cx - halfT, cy - gap - len, thick, len);
        ctx.fillRect(cx - gap - len, cy - halfT, len, thick);
        ctx.fillRect(cx + gap, cy - halfT, len, thick);
        ctx.fillRect(cx - halfT, cy + gap, thick, len);
        ctx.restore();
    }

    if (!inMainMenu && myId !== null) {
        if (minimapCanvas && !isMinimapMinimized) {
            renderMapView(minimapCanvas, 4);
        }
        if (expandedMapCanvas && isMapExpanded) {
            renderMapView(expandedMapCanvas, 7);
        }
    }
}

function renderMapView(targetCanvas, baseRadius) {
    if (!targetCanvas || !WORLD.MAP.columns || !WORLD.MAP.rows) return;
    const dpr = Math.min(2, window.devicePixelRatio || 1);
    const rect = targetCanvas.getBoundingClientRect();
    const cssW = rect.width > 0 ? rect.width : (targetCanvas.clientWidth || 200);
    const cssH = rect.height > 0 ? rect.height : (targetCanvas.clientHeight || 200);
    const pw = Math.max(1, Math.round(cssW * dpr));
    const ph = Math.max(1, Math.round(cssH * dpr));
    if (targetCanvas.width !== pw || targetCanvas.height !== ph) {
        targetCanvas.width = pw;
        targetCanvas.height = ph;
    }
    const mctx = targetCanvas.getContext('2d');
    mctx.clearRect(0, 0, pw, ph);
    if (WORLD.MAP.fullMapCanvas) {
        mctx.imageSmoothingEnabled = pw < 512;
        if (mctx.imageSmoothingEnabled) {
            mctx.imageSmoothingQuality = 'high';
        }
        mctx.drawImage(WORLD.MAP.fullMapCanvas, 0, 0, pw, ph);
    }

    const mapW = WORLD.MAP.columns * WORLD.MAP.tileSize;
    const mapH = WORLD.MAP.rows * WORLD.MAP.tileSize;
    if (mapW <= 0 || mapH <= 0) return;

    const r = Math.max(3, baseRadius * (pw / Math.max(1, cssW)) * (cssW >= 320 ? 1 : Math.max(0.7, cssW / 200)));
    mctx.lineWidth = Math.max(1.2, r * 0.35);

    for (const id in serverEnemies) {
        const e = serverEnemies[id];
        if (e.kind === 'dropship') continue;
        const ef = e.faction || (e.kind === 'mapbot' ? 'mapbot' : 'rarebot');
        const isMapbot = ef === 'mapbot' || e.kind === 'mapbot';
        const cx = (((e.renderX ?? e.x) + (e.width || 48) * 0.5) / mapW) * pw;
        const cy = (((e.renderY ?? e.y) + (e.height || 48) * 0.5) / mapH) * ph;
        mctx.beginPath();
        mctx.arc(cx, cy, r, 0, Math.PI * 2);
        mctx.fillStyle = ef === 'mapbot' ? '#d84aff' : (ef === 'goodbot' ? '#b833ff' : '#ff2a2a');
        mctx.fill();
        mctx.strokeStyle = isMapbot ? '#ffffff' : 'rgba(0, 0, 0, 0.85)';
        mctx.stroke();
    }

    for (const id in serverAllies) {
        const a = serverAllies[id];
        if (a.kind === 'dropship') continue;
        const af = a.faction || 'goodbot';
        const cx = (((a.renderX ?? a.x) + (a.width || 48) * 0.5) / mapW) * pw;
        const cy = (((a.renderY ?? a.y) + (a.height || 48) * 0.5) / mapH) * ph;
        mctx.beginPath();
        mctx.arc(cx, cy, r, 0, Math.PI * 2);
        mctx.fillStyle = af === 'mapbot' ? '#d84aff' : (af === 'rarebot' ? '#ff2a2a' : '#b833ff');
        mctx.fill();
        mctx.strokeStyle = af === 'mapbot' ? '#ffffff' : 'rgba(0, 0, 0, 0.85)';
        mctx.stroke();
    }

    for (const id in serverPlayers) {
        const p = serverPlayers[id];
        const pf = p.faction || 'goodbot';
        if (pf === 'spectator') continue;
        const cx = (((p.renderX ?? p.x) + (p.width || 48) * 0.5) / mapW) * pw;
        const cy = (((p.renderY ?? p.y) + (p.height || 48) * 0.5) / mapH) * ph;
        mctx.beginPath();
        mctx.arc(cx, cy, r, 0, Math.PI * 2);
        mctx.fillStyle = pf === 'rarebot' ? '#ff2a2a' : '#b833ff';
        mctx.fill();
        mctx.strokeStyle = 'rgba(0, 0, 0, 0.85)';
        mctx.stroke();
    }

    if (ME.faction !== 'spectator') {
        const mx = ((ME.x + ME.width * 0.5) / mapW) * pw;
        const my = ((ME.y + ME.height * 0.5) / mapH) * ph;
        mctx.beginPath();
        mctx.arc(mx, my, r * 1.15, 0, Math.PI * 2);
        mctx.fillStyle = ME.faction === 'rarebot' ? '#ff2a2a' : '#b833ff';
        mctx.fill();
        mctx.strokeStyle = '#ffffff';
        mctx.stroke();
    }

    for (const id in serverEnemies) {
        const e = serverEnemies[id];
        if (e.kind !== 'dropship') continue;
        const ef = e.faction || 'rarebot';
        const cx = (((e.renderX ?? e.x) + (e.width || 224) * 0.5) / mapW) * pw;
        const cy = (((e.renderY ?? e.y) + (e.height || 224) * 0.5) / mapH) * ph;
        mctx.beginPath();
        mctx.arc(cx, cy, r * 2.1, 0, Math.PI * 2);
        mctx.fillStyle = ef === 'mapbot' ? '#d84aff' : (ef === 'goodbot' ? '#b833ff' : '#ff2a2a');
        mctx.fill();
        mctx.strokeStyle = '#ffffff';
        mctx.stroke();
    }

    for (const id in serverAllies) {
        const a = serverAllies[id];
        if (a.kind !== 'dropship') continue;
        const af = a.faction || 'goodbot';
        const cx = (((a.renderX ?? a.x) + (a.width || 224) * 0.5) / mapW) * pw;
        const cy = (((a.renderY ?? a.y) + (a.height || 224) * 0.5) / mapH) * ph;
        mctx.beginPath();
        mctx.arc(cx, cy, r * 2.1, 0, Math.PI * 2);
        mctx.fillStyle = af === 'mapbot' ? '#d84aff' : (af === 'rarebot' ? '#ff2a2a' : '#b833ff');
        mctx.fill();
        mctx.strokeStyle = '#ffffff';
        mctx.stroke();
    }
}

function gameLoop(now) {
    if (!WORLD.SYSTEM.isReady) return;
    requestAnimationFrame(gameLoop);
    sampleFps(now);

    let dt = (now - WORLD.SYSTEM.lastTime) / 1000;
    WORLD.SYSTEM.lastTime = now;
    if (dt > 0.1) dt = 0.1;
    if (dt < 0 || isNaN(dt)) dt = 0.016;

    updateMapbotThemeAudio();

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

        if (data.type === 'wave_leaderboard') {
            if (Array.isArray(data.entries)) {
                setWaveLeaderboardEntries(data.entries);
            }
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

        if (data.type === 'region_error') {
            isJoining = false;
            pendingJoinName = null;
            inMainMenu = true;
            setMenuError(data.message || 'Missing required map regions');
            return;
        }

        if (data.type === 'map_data') {
            if (typeof data.isMobile === 'boolean') {
                applyServerDeviceMode(data.isMobile);
            }
            updateServerDropdown(data.playerCount, data.maxPlayers);
            if (Array.isArray(data.waveLeaderboard)) {
                setWaveLeaderboardEntries(data.waveLeaderboard);
            }
            if (inMainMenu && !suppressReloadDisconnect) {
                setMenuError(typeof data.regionError === 'string' ? data.regionError : '');
            }
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
            isChatMuted = Boolean(data.isMuted);
            WORLD.CAMERA.x = null;
            WORLD.CAMERA.y = null;
            setMenuError('');
            updateServerDropdown(data.playerCount, data.maxPlayers);
            setAdminStatus(Boolean(data.isAdmin));
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
            ME.sprinting = false;
            meLocalExhausted = false;
            sprintAnims.clear();
            sprintDustParticles.length = 0;
            ME.faction = data.faction || 'goodbot';
            syncSpectateButtonVisibility();
            refreshAdminReviveButton();
            ME.maxHealth = Math.max(1, Number(data.maxHealth) || 1000);
            ME.maxEnergy = Math.max(1, Number(data.maxEnergy) || 255);
            ME.health = Math.max(0, Math.min(ME.maxHealth, data.health ?? ME.maxHealth));
            ME.energy = Math.max(0, Math.min(ME.maxEnergy, data.energy ?? ME.maxEnergy));
            ME.scraps = Math.max(0, Math.floor(data.scraps ?? 0));
            ME.armor = data.armor || null;
            ME.chats = [];
            myInventory = Array.isArray(data.inventory) ? data.inventory.slice(0, 5) : [null, null, null, null, null];
            while (myInventory.length < 5) myInventory.push(null);
            myAbility = data.ability || null;
            abilityReadyAt = typeof data.abilityCooldownMs === 'number' && data.abilityCooldownMs > 0 ? (performance.now() + data.abilityCooldownMs) : 0;
            activeSlot = Number.isInteger(data.activeSlot) ? Math.max(0, Math.min(4, data.activeSlot)) : 0;
            lastEquippedItemKey = myInventory[activeSlot] || null;
            renderInventorySlots();
            lastRenderedHealth = -1;
            lastRenderedEnergy = -1;
            lastRenderedMaxHealth = -1;
            lastRenderedMaxEnergy = -1;
            lastRenderedScraps = -1;
            updateStatsUI();
            refreshShopAffordability();
            updateBossHealthBar();
            if (Array.isArray(data.waveLeaderboard)) {
                setWaveLeaderboardEntries(data.waveLeaderboard);
            }
            updateLeaderboard([{ name: myName, scraps: ME.scraps, faction: ME.faction, isAdmin }]);
            if (data.gameState) {
                applyGameStateUI(data.gameState);
            }
            selectSlot(activeSlot, false);
            if (chatLog) {
                chatLog.textContent = '';
                if (Array.isArray(data.chatLog)) {
                    for (let i = 0; i < data.chatLog.length; i++) {
                        appendChatLog(data.chatLog[i].name, data.chatLog[i].text, data.chatLog[i].faction || 'goodbot', Boolean(data.chatLog[i].isAdmin));
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

        if (data.type === 'kicked' || data.type === 'banned') {
            suppressReloadDisconnect = true;
            returnToMainMenu();
            setMenuError(data.message || (data.type === 'banned' ? 'Your IP has been banned from this server.' : 'You were kicked from the server.'));
            return;
        }

        if (data.type === 'chat_muted') {
            isChatMuted = Boolean(data.muted);
            return;
        }

        if (data.type === 'admin_auth_result') {
            setAdminStatus(Boolean(data.isAdmin));
            if (!data.ok && tokenInput && !isAdmin) {
                lastSubmittedAdminToken = '';
            }
            return;
        }

        if (data.type === 'admin_mod_state') {
            adminModState = {
                players: Array.isArray(data.players) ? data.players : [],
                bannedIps: Array.isArray(data.bannedIps) ? data.bannedIps : []
            };
            if (isModDialogOpen) {
                renderAdminModDialog();
            }
            return;
        }

        if (data.type === 'admin_teleported') {
            if (typeof data.x === 'number' && typeof data.y === 'number') {
                ME.x = data.x;
                ME.y = data.y;
                ME.serverX = data.x;
                ME.serverY = data.y;
                ME.vx = 0;
                ME.vy = 0;
            }
            return;
        }

        if (data.type === 'shutdown') {
            window.location.reload();
            return;
        }

        if (data.type === 'chat_log') {
            if (typeof data.name === 'string' && typeof data.text === 'string') {
                appendChatLog(data.name, data.text, data.faction || 'goodbot', Boolean(data.isAdmin));
            }
            return;
        }

        if (data.type === 'entity_swing') {
            const key = `${data.kind}:${data.id}`;
            const nowMs = performance.now();
            const prevEntry = swingAnims.get(key);
            const prevAt = typeof prevEntry === 'number' ? prevEntry : (prevEntry ? prevEntry.at : 0);
            if (!(data.kind === 'player' && data.id === myId && prevAt && nowMs - prevAt < 160)) {
                swingAnims.set(key, data.variant === 'mapbot-claws' ? { at: nowMs, claws: true } : (data.ugly ? { at: nowMs, ugly: true } : nowMs));
                playSpatialSound('swing', data.x, data.y);
            }
            if (ME.faction === 'goodbot' && data.kind === 'enemy') {
                const swungEnemy = serverEnemies[data.id];
                if (!swungEnemy || (swungEnemy.faction || 'rarebot') !== ME.faction) {
                    if (data.targetId === myId) {
                        enemyAggroUntil.set(key, nowMs + 8000);
                    } else if (typeof data.x === 'number' && typeof data.y === 'number') {
                        const dist = Math.hypot(data.x - (ME.x + ME.width / 2), data.y - (ME.y + ME.height / 2));
                        if (dist <= 135) enemyAggroUntil.set(key, nowMs + 8000);
                    }
                }
            } else if (ME.faction === 'goodbot' && data.kind === 'ally') {
                const swungAlly = serverAllies[data.id];
                if (swungAlly && (swungAlly.faction || 'goodbot') !== ME.faction) {
                    if (data.targetId === myId) {
                        enemyAggroUntil.set(key, nowMs + 8000);
                    } else if (typeof data.x === 'number' && typeof data.y === 'number') {
                        const dist = Math.hypot(data.x - (ME.x + ME.width / 2), data.y - (ME.y + ME.height / 2));
                        if (dist <= 135) enemyAggroUntil.set(key, nowMs + 8000);
                    }
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
                const punchedEnemy = serverEnemies[data.id];
                if (!punchedEnemy || (punchedEnemy.faction || 'rarebot') !== ME.faction) {
                    if (data.targetId === myId) {
                        enemyAggroUntil.set(key, nowMs + 8000);
                    } else if (typeof data.x === 'number' && typeof data.y === 'number') {
                        const dist = Math.hypot(data.x - (ME.x + ME.width / 2), data.y - (ME.y + ME.height / 2));
                        if (dist <= 135) enemyAggroUntil.set(key, nowMs + 8000);
                    }
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

        if (data.type === 'ability_left_swing') {
            const kind = data.kind === 'enemy' ? 'enemy' : (data.kind === 'ally' ? 'ally' : 'player');
            const key = `${kind}:${data.id}`;
            const nowMs = performance.now();
            if (!(kind === 'player' && data.id === myId && nowMs - lastLocalAbilityAt < 250)) {
                leftPunchAnims.set(key, nowMs);
                playSpatialSound('swing', data.x, data.y);
            }
            return;
        }

        if (data.type === 'grenade_shockwave') {
            const sx = Number(data.x) || 0;
            const sy = Number(data.y) || 0;
            grenadeShockwaves.push({
                x: sx,
                y: sy,
                radius: Number(data.radius) || 192,
                age: 0,
                life: 0.72,
                isExplosionFlash: false,
                variant: data.variant === 'rarebot' ? 'rarebot' : 'goodbot'
            });
            addCameraShake(0.24, sx, sy);
            return;
        }

        if (data.type === 'grenade_explosion') {
            const gx = Number(data.x) || 0;
            const gy = Number(data.y) || 0;
            const grad = Number(data.radius) || 192;
            const gVariant = data.variant === 'rarebot' ? 'rarebot' : 'goodbot';
            if (gVariant === 'rarebot') {
                playSpatialSound('explosion', gx, gy, { playbackRate: 0.62, volumeMult: 1.12 });
                spawnGrenadeExplosionParticles(gx, gy, grad, gVariant);
                addCameraShake(1.15, gx, gy);
            } else {
                playSpatialSound('explosion', gx, gy);
                spawnGrenadeExplosionParticles(gx, gy, grad, gVariant);
                addCameraShake(0.68, gx, gy);
            }
            return;
        }

        if (data.type === 'cannon_impact') {
            if (typeof data.id === 'number') {
                serverProjectiles.delete(data.id);
            }
            const cx = Number(data.x) || 0;
            const cy = Number(data.y) || 0;
            const crad = Number(data.radius) || 138;
            playSpatialSound('explosion', cx, cy);
            spawnCannonImpactParticles(cx, cy, crad);
            addCameraShake(0.36, cx, cy);
            return;
        }

        if (data.type === 'inventory_update') {
            if (Array.isArray(data.inventory)) {
                myInventory = data.inventory.slice(0, 5);
                while (myInventory.length < 5) myInventory.push(null);
            }
            if (data.ability !== undefined) {
                myAbility = data.ability || null;
            }
            if (data.armor !== undefined) {
                ME.armor = data.armor || null;
            }
            if (typeof data.maxHealth === 'number' && isFinite(data.maxHealth)) {
                ME.maxHealth = Math.max(1, data.maxHealth);
            }
            if (typeof data.health === 'number' && isFinite(data.health)) {
                ME.health = Math.max(0, Math.min(ME.maxHealth, data.health));
            }
            if (typeof data.abilityCooldownMs === 'number') {
                abilityReadyAt = data.abilityCooldownMs > 0 ? (performance.now() + data.abilityCooldownMs) : 0;
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
            refreshShopAffordability();
            return;
        }

        if (data.type === 'dropslide') {
            const dx = Number(data.dx) || 0;
            const dy = Number(data.dy) || 0;
            let wx = Number(data.x) || 0;
            let wy = Number(data.y) || 0;
            if (data.kind === 'enemy' && serverEnemies[data.id]) {
                const ent = serverEnemies[data.id];
                wx = (ent.renderX ?? ent.x) + (ent.width || 48) * 0.5;
                wy = (ent.renderY ?? ent.y) + (ent.height || 48) * 0.5;
            } else if (data.kind === 'ally' && serverAllies[data.id]) {
                const ent = serverAllies[data.id];
                wx = (ent.renderX ?? ent.x) + (ent.width || 48) * 0.5;
                wy = (ent.renderY ?? ent.y) + (ent.height || 48) * 0.5;
            }
            playSpatialSound('dropslide', wx, wy);
            spawnDropslideWhiteParticles(wx, wy, dx, dy, 6);
            dropslideEmitters.push({
                kind: data.kind,
                id: data.id,
                x: wx,
                y: wy,
                dx,
                dy,
                remaining: Math.max(0.12, (Number(data.durationMs) || 260) / 1000),
                accum: 0
            });
            return;
        }

        if (data.type === 'ranged_shot') {
            const isCannonShot = data.variant === 'goodbot-cannon' || data.projKind === 'cannonball';
            const isBeamerShot = data.variant === 'goodbot-beamer';
            if (typeof data.endX === 'number' && typeof data.endY === 'number') {
                const bx1 = Number(data.projX) || 0;
                const by1 = Number(data.projY) || 0;
                if (isBeamerShot) {
                    const shooterKey = `${data.kind}:${data.id}`;
                    let found = null;
                    for (let i = 0; i < raycastBeams.length; i++) {
                        if (raycastBeams[i].variant === 'goodbot-beamer' && raycastBeams[i].shooterKey === shooterKey) {
                            found = raycastBeams[i];
                            break;
                        }
                    }
                    if (found) {
                        found.x1 = bx1;
                        found.y1 = by1;
                        found.x2 = data.endX;
                        found.y2 = data.endY;
                        found.age = 0;
                    } else {
                        raycastBeams.push({
                            variant: 'goodbot-beamer',
                            shooterKey,
                            x1: bx1,
                            y1: by1,
                            x2: data.endX,
                            y2: data.endY,
                            age: 0,
                            life: 0.13,
                            seed: Math.random() * 100
                        });
                    }
                } else {
                    raycastBeams.push({
                        variant: data.variant || 'goodbot',
                        x1: bx1,
                        y1: by1,
                        x2: data.endX,
                        y2: data.endY,
                        age: 0,
                        life: data.variant === 'mapbot-blaster' ? 0.22 : 0.14,
                        seed: 0
                    });
                }
            } else if (typeof data.projId === 'number') {
                serverProjectiles.set(data.projId, {
                    id: data.projId,
                    kind: data.projKind || (isCannonShot ? 'cannonball' : 'bullet'),
                    radius: Number(data.projRadius) || (isCannonShot ? 26 : 5),
                    variant: data.variant || 'goodbot',
                    x: Number(data.projX) || 0,
                    y: Number(data.projY) || 0,
                    vx: Number(data.vx) || 0,
                    vy: Number(data.vy) || 0,
                    angle: Number(data.angle) || 0,
                    spinAngle: Number(data.angle) || 0,
                    particleAccum: 0,
                    age: 0
                });
            }
            const nowMs = performance.now();
            if (!(data.kind === 'player' && data.id === myId && nowMs - lastLocalShotAt < 250)) {
                const entityKey = `${data.kind}:${data.id}`;
                if (data.variant === 'mapbot-blaster') {
                    if (data.side === 'left') {
                        leftRecoilAnims.set(entityKey, { at: nowMs, strong: false });
                    } else {
                        recoilAnims.set(entityKey, { at: nowMs, strong: false });
                    }
                    playSpatialSound('laserCannonShot', data.x, data.y);
                    addCameraShake(0.28, data.projX, data.projY);
                } else if (data.variant === 'mapbot-core-blast' || data.projKind === 'mapbot-core-blast') {
                    playSpatialSound('mapbotCoreBlast', data.x, data.y, { volumeMult: 2.0, playbackRate: 0.34 });
                    addCameraShake(1.0, data.x, data.y);
                } else {
                    if (!isBeamerShot) {
                        if (data.hand === 'left') {
                            leftRecoilAnims.set(entityKey, { at: nowMs, strong: false });
                        } else {
                            recoilAnims.set(entityKey, { at: nowMs, strong: isCannonShot });
                        }
                    }
                    playSpatialSound(isBeamerShot ? 'beamerShot' : (isCannonShot ? 'laserCannonShot' : 'laserShot'), data.x, data.y);
                }
            }
            if (ME.faction === 'goodbot' && data.kind === 'enemy' && typeof data.x === 'number' && typeof data.y === 'number') {
                const dist = Math.hypot(data.x - (ME.x + ME.width / 2), data.y - (ME.y + ME.height / 2));
                if (dist <= 360) {
                    enemyAggroUntil.set(`enemy:${data.id}`, nowMs + 8000);
                }
            }
            return;
        }

        if (data.type === 'mapbot_core_blast_impact') {
            if (typeof data.id === 'number') {
                serverProjectiles.delete(data.id);
            }
            const ix = Number(data.x) || 0;
            const iy = Number(data.y) || 0;
            const iRad = Number(data.radius) || 96;
            mapbotExplosions.push({
                x: ix,
                y: iy,
                radius: iRad,
                age: 0,
                life: 0.48
            });
            grenadeShockwaves.push({
                x: ix,
                y: iy,
                radius: iRad,
                variant: 'goodbot',
                isExplosionFlash: true,
                age: 0,
                life: 0.34
            });
            playSpatialSound('mapbotCoreBlast', ix, iy, { volumeMult: 2.0, playbackRate: 0.30 });
            addCameraShake(0.95, ix, iy);
            return;
        }

        if (data.type === 'mapbot_rocket_explosion') {
            if (data.id !== undefined) {
                serverRockets.delete(data.id);
            }
            const rex = Number(data.x) || 0;
            const rey = Number(data.y) || 0;
            const rRad = Number(data.radius) || 148;
            mapbotExplosions.push({
                x: rex,
                y: rey,
                radius: rRad,
                age: 0,
                life: 0.42
            });
            playSpatialSound('explosion', rex, rey, { playbackRate: 0.82 });
            addCameraShake(0.65, rex, rey);
            return;
        }

        if (data.type === 'mapbot_knuckleboom_explosion') {
            const kx = Number(data.x) || 0;
            const ky = Number(data.y) || 0;
            const kRad = Number(data.radius) || 88;
            const isLand = data.stage === 'land';
            mapbotExplosions.push({
                x: kx,
                y: ky,
                radius: kRad,
                age: 0,
                life: isLand ? 0.48 : 0.36
            });
            grenadeShockwaves.push({
                x: kx,
                y: ky,
                radius: kRad,
                variant: 'goodbot',
                isExplosionFlash: true,
                age: 0,
                life: isLand ? 0.34 : 0.24
            });
            playSpatialSound('explosion', kx, ky, {
                volumeMult: isLand ? 1.65 : 1.35,
                playbackRate: isLand ? 0.72 : 0.9
            });
            addCameraShake(isLand ? 0.85 : 0.48, kx, ky);
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
            const hx = typeof data.hitX === 'number' ? data.hitX : Number(data.x) || 0;
            const hy = typeof data.hitY === 'number' ? data.hitY : Number(data.y) || 0;
            const victimFaction = data.targetFaction || (data.kind === 'enemy' ? ((serverEnemies[data.id] && serverEnemies[data.id].faction) || 'rarebot') : 'goodbot');
            if (victimFaction === 'goodbot' || victimFaction === 'rarebot' || victimFaction === 'mapbot') {
                hitPointMarkers.push({
                    x: hx,
                    y: hy,
                    color: victimFaction === 'goodbot' ? '#ff2a2a' : (victimFaction === 'mapbot' ? '#e040ff' : '#b833ff'),
                    age: 0,
                    life: 0.6
                });
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
            } else if (data.attackerKind === 'ally' && serverAllies[data.attackerId]) {
                const aa = serverAllies[data.attackerId];
                attX = (aa.renderX ?? aa.x) + aa.width / 2;
                attY = (aa.renderY ?? aa.y) + aa.height / 2;
            }
            playSpatialSound('hitDeal', attX, attY);
            if (data.weaponKind === 'ranged') {
                playRandomBulletImpact(data.x, data.y);
            } else if (data.weaponKind === 'grapple') {
                playSpatialSound('grapple1', data.x, data.y);
            }
            const dmgVal = Math.max(1, Math.round(Number(data.damage) || 0));
            if (data.kind === 'player' && data.id === myId) {
                floatingTexts.push({
                    playerId: myId,
                    x: ME.x + ME.width / 2,
                    y: ME.y - 26,
                    xOff: (Math.random() - 0.5) * 18,
                    text: `-${dmgVal}`,
                    color: '#ff3030',
                    age: 0,
                    life: 1.3
                });
                if (ME.faction === 'goodbot') {
                    enemyAggroUntil.set(`${data.attackerKind}:${data.attackerId}`, performance.now() + 8000);
                }
            } else if (data.kind === 'enemy') {
                floatingTexts.push({
                    enemyId: data.id,
                    x: Number(data.x) || 0,
                    y: (Number(data.y) || 0) - 50,
                    xOff: (Math.random() - 0.5) * 18,
                    text: `-${dmgVal}`,
                    color: '#ff3030',
                    age: 0,
                    life: 1.3
                });
            }
            return;
        }

        if (data.type === 'entity_healed') {
            if (data.projId) {
                serverProjectiles.delete(data.projId);
            }
            const healVal = Math.max(1, Math.round(Number(data.amount) || 0));
            const hx = Number(data.x) || 0;
            const hy = Number(data.y) || 0;
            if (data.targetKind === 'enemy') {
                floatingTexts.push({
                    enemyId: data.id,
                    x: hx,
                    y: hy - 36,
                    xOff: (Math.random() - 0.5) * 18,
                    text: `+${healVal}`,
                    color: '#32ff4a',
                    age: 0,
                    life: 1.15
                });
            } else if (data.targetKind === 'ally') {
                floatingTexts.push({
                    allyId: data.id,
                    x: hx,
                    y: hy - 36,
                    xOff: (Math.random() - 0.5) * 18,
                    text: `+${healVal}`,
                    color: '#32ff4a',
                    age: 0,
                    life: 1.15
                });
            }
            return;
        }

        if (data.type === 'damage_hitbox') {
            if (SETTINGS.showDamageHitboxes || SETTINGS.generalHitbox) {
                const size = Number(data.size) || 48;
                const durationMs = Math.max(40, Number(data.durationMs) || 150);
                activeDamageHitboxes.push({
                    x: Number(data.x) || 0,
                    y: Number(data.y) || 0,
                    size,
                    angle: Number(data.angle) || 0,
                    shape: data.shape === 'circle' ? 'circle' : 'square',
                    age: 0,
                    life: durationMs / 1000
                });
            }
            return;
        }

        if (data.type === 'explosion') {
            playSpatialSound('explosion', data.x, data.y);
            spawnExplosionParticles(data.x, data.y);
            addCameraShake(0.5, data.x, data.y);
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

        if (data.type === 'kill_heal' && Array.isArray(data.particles)) {
            const baseX = Number(data.x) || 0;
            const baseY = Number(data.y) || 0;
            for (let i = 0; i < data.particles.length; i++) {
                const pt = data.particles[i];
                if (healParticles.length >= MAX_HEAL_PARTICLES) {
                    healParticles.shift();
                }
                healParticles.push({
                    targetId: data.targetId,
                    startX: baseX,
                    startY: baseY,
                    x: baseX,
                    y: baseY,
                    ox: Number(pt.ox) || 0,
                    oy: Number(pt.oy) || 0,
                    hp: Math.max(0, Number(pt.hp) || 0),
                    r: Math.max(1.5, Number(pt.r) || 4),
                    growDur: Math.max(0.08, (Number(pt.growMs) || 180) / 1000),
                    speed: Math.max(200, Number(pt.speed) || 680),
                    burstAng: Number(pt.burstAng) || 0,
                    age: 0,
                    curR: 0
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
                        playerId: h.allyId !== undefined ? undefined : h.id,
                        allyId: h.allyId,
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
                const pIsAdmin = Boolean(incoming.isAdmin);
                lbBuf.push({ id: numId, name: incoming.name, scraps: pScraps, faction: pFaction, isAdmin: pIsAdmin });
                if (numId === myId) {
                    if (pIsAdmin !== isAdmin) {
                        setAdminStatus(pIsAdmin);
                    }
                    ME.serverX = incoming.x;
                    ME.serverY = incoming.y;
                    ME.vx = incoming.vx || 0;
                    ME.vy = incoming.vy || 0;
                    ME.scale = incoming.scale ?? 1;
                    ME.sprinting = Boolean(incoming.sprinting);
                    if (pFaction !== ME.faction) {
                        ME.faction = pFaction;
                        ME.maxHealth = incoming.maxHealth !== undefined ? Math.max(1, incoming.maxHealth) : 1000;
                        ME.maxEnergy = incoming.maxEnergy !== undefined ? Math.max(1, incoming.maxEnergy) : (pFaction === 'rarebot' ? 50 : 255);
                        enemyAggroUntil.clear();
                        syncSpectateButtonVisibility();
                        if (pFaction === 'spectator' && isSpectateDialogOpen) {
                            closeSpectateDialog();
                        }
                        refreshAdminReviveButton();
                        renderInventorySlots();
                        if (lastGameStateData) {
                            applyGameStateUI(lastGameStateData);
                        }
                    } else {
                        if (incoming.maxHealth !== undefined) ME.maxHealth = Math.max(1, incoming.maxHealth);
                        if (incoming.maxEnergy !== undefined) ME.maxEnergy = Math.max(1, incoming.maxEnergy);
                    }
                    if (incoming.health !== undefined) ME.health = Math.max(0, Math.min(ME.maxHealth, incoming.health));
                    if (incoming.energy !== undefined) ME.energy = Math.max(0, Math.min(ME.maxEnergy, incoming.energy));
                    const nextArmor = incoming.armor || null;
                    if (nextArmor !== ME.armor) {
                        ME.armor = nextArmor;
                        renderInventorySlots();
                        refreshShopAffordability();
                    }
                    ME.scraps = pScraps;
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
                    existing.vx = incoming.vx || 0;
                    existing.vy = incoming.vy || 0;
                    existing.angle = incoming.angle || 0;
                    existing.scale = incoming.scale ?? 1;
                    existing.sprinting = Boolean(incoming.sprinting);
                    existing.width = incoming.width || existing.width || 48;
                    existing.height = incoming.height || existing.height || 48;
                    if (incoming.name !== undefined) existing.name = incoming.name;
                    existing.isAdmin = pIsAdmin;
                    existing.faction = pFaction;
                    existing.armor = incoming.armor || null;
                    existing.health = incoming.health ?? existing.health;
                    existing.maxHealth = incoming.maxHealth ?? 1000;
                    existing.energy = incoming.energy ?? existing.energy;
                    existing.maxEnergy = incoming.maxEnergy ?? (pFaction === 'rarebot' ? 50 : 255);
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
                        isAdmin: pIsAdmin,
                        faction: pFaction,
                        armor: incoming.armor || null,
                        vx: incoming.vx || 0,
                        vy: incoming.vy || 0,
                        angle: incoming.angle || 0,
                        scale: incoming.scale ?? 1,
                        sprinting: Boolean(incoming.sprinting),
                        maxHealth: incoming.maxHealth ?? 1000,
                        maxEnergy: incoming.maxEnergy ?? (pFaction === 'rarebot' ? 50 : 255),
                        scraps: pScraps,
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
                    const eKind = incoming.kind || 'rarebot';
                    const isMapbot = eKind === 'mapbot';
                    const defMaxH = isMapbot ? 100000 : (eKind === 'dropship' ? 8000 : (eKind === 'prototype' ? 120 : (eKind === 'sacrifice' ? 100 : (eKind === 'scout' ? 300 : (eKind === 'rarebot3' ? 600 : (eKind === 'rarebot2' ? 475 : (eKind === 'grenadier' ? 320 : 255)))))));
                    const defMaxE = isMapbot ? 500 : (eKind === 'prototype' ? 100 : 50);
                    const defSize = eKind === 'dropship' ? 224 : 48;
                    const eFaction = incoming.faction || (isMapbot ? 'mapbot' : 'rarebot');
                    const existing = serverEnemies[id];
                    if (existing) {
                        const dx = incoming.x - existing.renderX;
                        const dy = incoming.y - existing.renderY;
                        const isAirborne = Boolean(incoming.airborne);
                        const jumped = (dx * dx + dy * dy) > (isAirborne ? 90000 : 14400);
                        existing.x = incoming.x;
                        existing.y = incoming.y;
                        existing.vx = incoming.vx || 0;
                        existing.vy = incoming.vy || 0;
                        existing.angle = incoming.angle || 0;
                        existing.scale = incoming.scale ?? 1;
                        existing.sprinting = Boolean(incoming.sprinting);
                        existing.airborne = isAirborne;
                        existing.jumpHeight = Number(incoming.jumpHeight) || 0;
                        existing.width = incoming.width || existing.width || defSize;
                        existing.height = incoming.height || existing.height || defSize;
                        existing.name = incoming.name !== undefined ? incoming.name : existing.name;
                        existing.kind = eKind;
                        existing.faction = eFaction;
                        existing.weapon = incoming.weapon || (isMapbot ? 'mapbot-claws' : 'hands');
                        existing.armor = incoming.armor || null;
                        existing.health = incoming.health ?? existing.health;
                        existing.maxHealth = incoming.maxHealth ?? defMaxH;
                        existing.energy = incoming.energy ?? existing.energy;
                        existing.maxEnergy = incoming.maxEnergy ?? defMaxE;
                        existing._seq = stateSeq;
                        if (jumped) {
                            existing.renderX = incoming.x;
                            existing.renderY = incoming.y;
                        }
                    } else {
                        serverEnemies[id] = {
                            ...incoming,
                            kind: eKind,
                            faction: eFaction,
                            vx: incoming.vx || 0,
                            vy: incoming.vy || 0,
                            angle: incoming.angle || 0,
                            scale: incoming.scale ?? 1,
                            sprinting: Boolean(incoming.sprinting),
                            airborne: Boolean(incoming.airborne),
                            jumpHeight: Number(incoming.jumpHeight) || 0,
                            renderJumpHeight: Number(incoming.jumpHeight) || 0,
                            maxHealth: incoming.maxHealth ?? defMaxH,
                            maxEnergy: incoming.maxEnergy ?? defMaxE,
                            weapon: incoming.weapon || (isMapbot ? 'mapbot-claws' : 'hands'),
                            armor: incoming.armor || null,
                            width: incoming.width || defSize,
                            height: incoming.height || defSize,
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

            if (data.allies && typeof data.allies === 'object') {
                for (const id in data.allies) {
                    const incoming = data.allies[id];
                    const aKind = incoming.kind || null;
                    const aFaction = incoming.faction || 'goodbot';
                    const aDefSize = aKind === 'dropship' ? 224 : 48;
                    const aDefMaxH = aKind === 'dropship' ? 8000 : (incoming.weapon === 'goodbot-assault-laser' ? 1500 : 1000);
                    const existing = serverAllies[id];
                    if (existing) {
                        const dx = incoming.x - existing.renderX;
                        const dy = incoming.y - existing.renderY;
                        const jumped = (dx * dx + dy * dy) > 14400;
                        existing.x = incoming.x;
                        existing.y = incoming.y;
                        existing.vx = incoming.vx || 0;
                        existing.vy = incoming.vy || 0;
                        existing.angle = incoming.angle || 0;
                        existing.scale = incoming.scale ?? 1;
                        existing.sprinting = Boolean(incoming.sprinting);
                        existing.width = incoming.width || existing.width || aDefSize;
                        existing.height = incoming.height || existing.height || aDefSize;
                        existing.kind = aKind;
                        existing.faction = aFaction;
                        existing.name = incoming.name || existing.name || (aKind === 'dropship' ? 'Goodbot Dropship' : 'Goodbot');
                        existing.weapon = incoming.weapon || 'hands';
                        existing.armor = incoming.armor || null;
                        existing.health = incoming.health ?? existing.health;
                        existing.maxHealth = incoming.maxHealth ?? aDefMaxH;
                        existing.energy = incoming.energy ?? existing.energy;
                        existing.maxEnergy = incoming.maxEnergy ?? 255;
                        existing._seq = stateSeq;
                        if (jumped) {
                            existing.renderX = incoming.x;
                            existing.renderY = incoming.y;
                        }
                    } else {
                        serverAllies[id] = {
                            ...incoming,
                            kind: aKind,
                            faction: aFaction,
                            name: incoming.name || (aKind === 'dropship' ? 'Goodbot Dropship' : 'Goodbot'),
                            vx: incoming.vx || 0,
                            vy: incoming.vy || 0,
                            angle: incoming.angle || 0,
                            scale: incoming.scale ?? 1,
                            sprinting: Boolean(incoming.sprinting),
                            maxHealth: incoming.maxHealth ?? aDefMaxH,
                            maxEnergy: incoming.maxEnergy ?? 255,
                            weapon: incoming.weapon || 'hands',
                            armor: incoming.armor || null,
                            width: incoming.width || aDefSize,
                            height: incoming.height || aDefSize,
                            renderX: incoming.x,
                            renderY: incoming.y,
                            renderAngle: incoming.angle || 0,
                            _seq: stateSeq
                        };
                    }
                }
            }
            for (const id in serverAllies) {
                if (serverAllies[id]._seq !== stateSeq) {
                    delete serverAllies[id];
                }
            }
            serverGrenades = Array.isArray(data.grenades) ? data.grenades : [];
            if (Array.isArray(data.rockets)) {
                for (let i = 0; i < data.rockets.length; i++) {
                    const inc = data.rockets[i];
                    const existing = serverRockets.get(inc.id);
                    if (existing) {
                        existing.tx = Number(inc.x) || 0;
                        existing.ty = Number(inc.y) || 0;
                        existing.angle = Number(inc.angle) || 0;
                        existing._seq = stateSeq;
                    } else {
                        const rx = Number(inc.x) || 0;
                        const ry = Number(inc.y) || 0;
                        const ra = Number(inc.angle) || 0;
                        serverRockets.set(inc.id, {
                            id: inc.id,
                            x: rx,
                            y: ry,
                            tx: rx,
                            ty: ry,
                            angle: ra,
                            renderAngle: ra,
                            trailAccum: 0,
                            _seq: stateSeq
                        });
                    }
                }
                for (const [rid, r] of serverRockets) {
                    if (r._seq !== stateSeq) {
                        serverRockets.delete(rid);
                    }
                }
            } else {
                serverRockets.clear();
            }
            updateBossHealthBar();
            return;
        }

        if (data.type === 'player_left') {
            delete serverPlayers[data.id];
            enemyAggroUntil.delete(`player:${data.id}`);
            sprintAnims.delete(`player:${data.id}`);
        }
    };

    ws.onclose = () => {
        ws = null;
        if (suppressReloadDisconnect) {
            return;
        }
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
    isBeamerActive = false;
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
    resetJoystick();
    clearHeldInputs();
    chatInput.focus();
}

function closeChat() {
    if (!chatInput) return;
    chatInput.value = '';
    chatInput.blur();
}

function submitChat() {
    if (!chatInput) return;
    const text = chatInput.value.trim().slice(0, 80);
    if (text && !isChatMuted && ws && ws.readyState === WebSocket.OPEN && myId !== null && !inMainMenu) {
        ws.send(JSON.stringify({ type: 'chat', text }));
    }
    closeChat();
}

window.addEventListener('keydown', e => {
    if (isLeaveDialogOpen) {
        if (e.key === 'Escape') {
            e.preventDefault();
            closeLeaveDialog();
        }
        return;
    }
    if (isSpectateDialogOpen) {
        if (e.key === 'Escape') {
            e.preventDefault();
            closeSpectateDialog();
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
    if (isWaveLeaderboardOpen) {
        if (e.key === 'Escape') {
            e.preventDefault();
            closeWaveLeaderboard();
        }
        return;
    }
    if (isModDialogOpen) {
        if (e.key === 'Escape') {
            e.preventDefault();
            closeModDialog();
        }
        return;
    }
    if (isAdminPanelOpen) {
        if (e.key === 'Escape') {
            e.preventDefault();
            if (adminSpawnFactionMenu && adminSpawnFactionMenu.classList.contains('visible')) {
                closeAdminSpawnFactionMenu();
                return;
            }
            closeAdminPanel();
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
    if (isMapExpanded) {
        if (e.key === 'Escape' || e.key.toLowerCase() === 'm') {
            e.preventDefault();
            setMapExpanded(false);
            return;
        }
    }
    if (tokenInput && document.activeElement === tokenInput) {
        if (e.key === 'Enter') {
            e.preventDefault();
            submitAdminToken();
            tokenInput.blur();
        } else if (e.key === 'Escape') {
            e.preventDefault();
            tokenInput.blur();
        }
        return;
    }
    if (e.key === 'Enter' || e.key === 'NumpadEnter' || e.keyCode === 13 || e.which === 13) {
        if (inMainMenu) {
            if (playBtn) playBtn.click();
            return;
        }
        if (myId !== null && chatInput) {
            e.preventDefault();
            if (document.activeElement === chatInput) {
                submitChat();
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
    if (e.key.toLowerCase() === 't' && !inMainMenu && myId !== null && isAdmin) {
        e.preventDefault();
        if (ws && ws.readyState === WebSocket.OPEN && WORLD.CAMERA.x !== null) {
            const targetWorldX = WORLD.CAMERA.x + (WORLD.INPUTS.mouseX / WORLD.SYSTEM.viewScale);
            const targetWorldY = WORLD.CAMERA.y + (WORLD.INPUTS.mouseY / WORLD.SYSTEM.viewScale);
            ws.send(JSON.stringify({ type: 'admin_teleport', x: targetWorldX, y: targetWorldY }));
        }
        return;
    }
    if (e.key.toLowerCase() === 'm' && !inMainMenu && myId !== null) {
        e.preventDefault();
        setMapExpanded(!isMapExpanded);
        return;
    }
    if (e.key.toLowerCase() === 'b' && !inMainMenu) {
        e.preventDefault();
        openShop();
        return;
    }
    if (e.key.toLowerCase() === 'f' && !inMainMenu && myId !== null) {
        e.preventDefault();
        triggerAbility(false);
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
    hasMouseMoved = true;
    WORLD.INPUTS.mouseX = e.clientX;
    WORLD.INPUTS.mouseY = e.clientY;
});

window.addEventListener('blur', () => {
    clearHeldInputs();
    if (document.activeElement === chatInput) {
        closeChat();
    }
    if (tokenInput && document.activeElement === tokenInput) {
        tokenInput.blur();
    }
});

function triggerAttack(isHoldRepeat = false) {
    ensureAudioContext();
    if (inMainMenu || myId === null || isSettingsOpen || isWaveLeaderboardOpen || isLeaveDialogOpen || isSpectateDialogOpen || isShopOpen || isModDialogOpen || isAdminPanelOpen || isMapExpanded) return;
    if (ME.faction === 'spectator') return;
    if (!ws || ws.readyState !== WebSocket.OPEN) return;

    const equippedWeapon = getMyEquippedWeapon();
    const isCannon = equippedWeapon === 'goodbot-cannon';
    const isPistol = equippedWeapon === 'goodbot-pistol';
    const isAssaultLaser = equippedWeapon === 'goodbot-assault-laser';
    const isBeamer = equippedWeapon === 'goodbot-beamer';
    const nowMs = performance.now();

    if (isBeamer) {
        if (isHoldRepeat && nowMs - lastBeamerHoldSentAt < 60) return;
        lastBeamerHoldSentAt = nowMs;
        lastAttackSentAt = nowMs;
        lastLocalShotAt = nowMs;
        const roundedAttackAngle = Math.round(ME.angle * 1000) / 1000;
        lastSentAngle = roundedAttackAngle;
        lastInputSendTime = nowMs;
        playSpatialSound('beamerShot', ME.x + ME.width / 2, ME.y + ME.height / 2);
        ws.send(JSON.stringify({ type: 'attack', angle: roundedAttackAngle }));
        return;
    }

    const cooldown = isCannon ? 2008 : (isAssaultLaser ? 156 : (isPistol ? 408 : (ME.faction === 'rarebot' ? 508 : 428)));
    if (nowMs - lastAttackSentAt < cooldown) return;
    lastAttackSentAt = nowMs;

    const roundedAttackAngle = Math.round(ME.angle * 1000) / 1000;
    lastSentAngle = roundedAttackAngle;
    lastInputSendTime = nowMs;

    if (isCannon || isPistol || isAssaultLaser) {
        lastLocalShotAt = nowMs;
        recoilAnims.set(`player:${myId}`, { at: nowMs, strong: isCannon });
        playSpatialSound(isCannon ? 'laserCannonShot' : 'laserShot', ME.x + ME.width / 2, ME.y + ME.height / 2);
        if (isCannon) {
            addCameraShake(0.2);
        }
        ws.send(JSON.stringify({ type: 'attack', angle: roundedAttackAngle }));
    } else {
        swingAnims.set(`player:${myId}`, nowMs);
        playSpatialSound('swing', ME.x + ME.width / 2, ME.y + ME.height / 2);
        ws.send(JSON.stringify({ type: 'attack', angle: roundedAttackAngle }));
    }
}

function triggerAbility(useAimAngleOnly = false) {
    ensureAudioContext();
    if (inMainMenu || myId === null || isSettingsOpen || isWaveLeaderboardOpen || isLeaveDialogOpen || isSpectateDialogOpen || isShopOpen || isModDialogOpen || isAdminPanelOpen || isMapExpanded) return;
    if (ME.faction !== 'goodbot') return;
    if (myAbility !== 'goodbot-grenade') return;
    if (!ws || ws.readyState !== WebSocket.OPEN) return;

    const nowMs = performance.now();
    if (nowMs < abilityReadyAt) return;

    let targetX;
    let targetY;
    if (useAimAngleOnly) {
        const cx = ME.x + ME.width * 0.5;
        const cy = ME.y + ME.height * 0.5;
        targetX = cx + Math.sin(ME.angle) * 260;
        targetY = cy - Math.cos(ME.angle) * 260;
    } else {
        targetX = (WORLD.CAMERA.x || 0) + (WORLD.INPUTS.mouseX / WORLD.SYSTEM.viewScale);
        targetY = (WORLD.CAMERA.y || 0) + (WORLD.INPUTS.mouseY / WORLD.SYSTEM.viewScale);
    }

    lastLocalAbilityAt = nowMs;
    abilityReadyAt = nowMs + 10000;
    leftPunchAnims.set(`player:${myId}`, nowMs);
    playSpatialSound('swing', ME.x + ME.width / 2, ME.y + ME.height / 2);
    updateAbilitySlotCooldown(nowMs);
    const roundedAbilityAngle = Math.round(ME.angle * 1000) / 1000;
    lastSentAngle = roundedAbilityAngle;
    lastInputSendTime = nowMs;
    ws.send(JSON.stringify({
        type: 'use_ability',
        targetX,
        targetY,
        angle: roundedAbilityAngle
    }));
}

window.addEventListener('mousedown', (e) => {
    if (adminSpawnFactionMenu && adminSpawnFactionMenu.classList.contains('visible')) {
        if (!e.target.closest('#admin-spawn-faction-menu') && !(e.button === 2 && e.target.closest('#admin-spawn-grid .shop-item-slot'))) {
            closeAdminSpawnFactionMenu();
        }
    }
    ensureAudioContext();
    if (inMainMenu || myId === null || isSettingsOpen || isWaveLeaderboardOpen || isLeaveDialogOpen || isSpectateDialogOpen || isShopOpen || isModDialogOpen || isAdminPanelOpen || isMapExpanded) return;
    if (document.activeElement === chatInput || (tokenInput && document.activeElement === tokenInput)) return;
    if (e.target !== canvas) return;
    if (e.button === 2) {
        triggerAbility(false);
        return;
    }
    if (e.button !== 0) return;
    if (getMyEquippedWeapon() === 'goodbot-beamer') {
        isAttackHeld = false;
        isBeamerActive = !isBeamerActive;
        if (isBeamerActive) {
            triggerAttack(false);
        }
        return;
    }
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
    fetchWaveLeaderboard();
    connectToServer();

    window.addEventListener('touchstart', () => {
        ensureAudioContext();
        enableTouchMode();
    }, { passive: true });

    if (mobileJoystick) {
        mobileJoystick.addEventListener('touchstart', (e) => {
            if (inMainMenu || isSettingsOpen || isWaveLeaderboardOpen || isLeaveDialogOpen || isSpectateDialogOpen || isModDialogOpen || isAdminPanelOpen) return;
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
            if (getMyEquippedWeapon() === 'goodbot-beamer') {
                isAttackHeld = false;
                isBeamerActive = !isBeamerActive;
                if (isBeamerActive) {
                    triggerAttack(false);
                }
                return;
            }
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
            if (getMyEquippedWeapon() === 'goodbot-beamer') {
                isAttackHeld = false;
                isBeamerActive = !isBeamerActive;
                if (isBeamerActive) {
                    triggerAttack(false);
                }
                return;
            }
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

    if (mobileAbilityBtn) {
        mobileAbilityBtn.addEventListener('touchstart', (e) => {
            e.preventDefault();
            triggerAbility(true);
        }, { passive: false });
        mobileAbilityBtn.addEventListener('mousedown', (e) => {
            if (e.button !== 0) return;
            e.preventDefault();
            triggerAbility(true);
        });
    }

    canvas.addEventListener('touchstart', (e) => {
        if (inMainMenu || isSettingsOpen || isWaveLeaderboardOpen || isLeaveDialogOpen || isSpectateDialogOpen || isModDialogOpen || isAdminPanelOpen) return;
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

    if (adminModBtn) {
        adminModBtn.addEventListener('click', () => {
            if (isModDialogOpen) closeModDialog();
            else openModDialog();
        });
    }

    if (adminModCloseBtn) {
        adminModCloseBtn.addEventListener('click', () => {
            closeModDialog();
        });
    }

    if (adminModOverlay) {
        adminModOverlay.addEventListener('click', (e) => {
            if (e.target === adminModOverlay) {
                closeModDialog();
            }
        });
    }

    if (adminPanelBtn) {
        adminPanelBtn.addEventListener('click', () => {
            if (isAdminPanelOpen) closeAdminPanel();
            else openAdminPanel();
        });
    }

    if (adminPanelCloseBtn) {
        adminPanelCloseBtn.addEventListener('click', () => {
            closeAdminPanel();
        });
    }

    if (adminPanelOverlay) {
        adminPanelOverlay.addEventListener('click', (e) => {
            if (e.target === adminPanelOverlay) {
                closeAdminPanel();
            }
        });
    }

    if (adminReviveBtn) {
        adminReviveBtn.addEventListener('click', () => {
            if (ws && ws.readyState === WebSocket.OPEN && isAdmin && ME.faction === 'spectator') {
                ws.send(JSON.stringify({ type: 'admin_revive' }));
            }
        });
    }

    if (adminSkipWaveBtn) {
        adminSkipWaveBtn.addEventListener('click', () => {
            if (ws && ws.readyState === WebSocket.OPEN && isAdmin) {
                ws.send(JSON.stringify({ type: 'admin_skip_wave' }));
            }
        });
    }

    if (adminRestartGameBtn) {
        adminRestartGameBtn.addEventListener('click', () => {
            if (ws && ws.readyState === WebSocket.OPEN && isAdmin) {
                ws.send(JSON.stringify({ type: 'admin_restart_game' }));
            }
        });
    }

    renderAdminSpawnGrid();
    refreshAdminReviveButton();

    if (adminSpawnFactionMenu) {
        adminSpawnFactionMenu.addEventListener('mousedown', (e) => {
            e.stopPropagation();
        });
        adminSpawnFactionMenu.addEventListener('contextmenu', (e) => {
            e.preventDefault();
            e.stopPropagation();
        });
    }

    for (let i = 0; i < adminSpawnFactionButtons.length; i++) {
        const btn = adminSpawnFactionButtons[i];
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            if (adminSpawnFactionTarget && ws && ws.readyState === WebSocket.OPEN && isAdmin) {
                ws.send(JSON.stringify({
                    type: 'admin_spawn_entity',
                    entityType: adminSpawnFactionTarget.id,
                    faction: btn.dataset.spawnFaction
                }));
            }
        });
    }

    if (tokenInput) {
        tokenInput.addEventListener('focus', () => {
            clearHeldInputs();
        });
        tokenInput.addEventListener('change', () => {
            submitAdminToken();
        });
        tokenInput.addEventListener('blur', () => {
            submitAdminToken();
        });
    }

    if (settingsBtn) {
        settingsBtn.addEventListener('click', () => {
            openSettings();
        });
    }

    if (waveLeaderboardBtn) {
        waveLeaderboardBtn.addEventListener('click', () => {
            if (isWaveLeaderboardOpen) closeWaveLeaderboard();
            else openWaveLeaderboard();
        });
    }

    if (waveLeaderboardCloseBtn) {
        waveLeaderboardCloseBtn.addEventListener('click', () => {
            closeWaveLeaderboard();
        });
    }

    if (waveLeaderboardOverlay) {
        waveLeaderboardOverlay.addEventListener('click', (e) => {
            if (e.target === waveLeaderboardOverlay) {
                closeWaveLeaderboard();
            }
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

    if (spectateBtn) {
        spectateBtn.addEventListener('click', () => {
            openSpectateDialog();
        });
    }

    if (spectateNoBtn) {
        spectateNoBtn.addEventListener('click', () => {
            closeSpectateDialog();
        });
    }

    if (spectateYesBtn) {
        spectateYesBtn.addEventListener('click', () => {
            if (ws && ws.readyState === WebSocket.OPEN && myId !== null) {
                ws.send(JSON.stringify({ type: 'spectate' }));
            }
            closeSpectateDialog();
        });
    }

    if (spectateOverlay) {
        spectateOverlay.addEventListener('click', (e) => {
            if (e.target === spectateOverlay) {
                closeSpectateDialog();
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

    if (settingShowHitboxes) {
        settingShowHitboxes.addEventListener('change', () => {
            SETTINGS.showDamageHitboxes = settingShowHitboxes.checked;
            saveSettings();
            applySettingsToUI();
        });
    }

    if (settingGeneralHitbox) {
        settingGeneralHitbox.addEventListener('change', () => {
            SETTINGS.generalHitbox = settingGeneralHitbox.checked;
            saveSettings();
            applySettingsToUI();
        });
    }

    if (settingCameraShake) {
        settingCameraShake.addEventListener('change', () => {
            SETTINGS.cameraShake = settingCameraShake.checked;
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

    if (shopTabItemsBtn) {
        shopTabItemsBtn.addEventListener('click', () => {
            setShopTab('items');
        });
    }

    if (shopTabUnitsBtn) {
        shopTabUnitsBtn.addEventListener('click', () => {
            setShopTab('units');
        });
    }

    setShopTab('items');

    if (chatToggleBtn) {
        chatToggleBtn.addEventListener('click', () => {
            setChatMinimized(!isChatMinimized);
        });
    }

    if (minimapToggleBtn) {
        minimapToggleBtn.addEventListener('click', () => {
            setMinimapMinimized(!isMinimapMinimized);
        });
    }

    if (mapOverlay) {
        mapOverlay.addEventListener('click', (e) => {
            if (e.target === mapOverlay) {
                setMapExpanded(false);
            }
        });
    }

    if (chatForm) {
        chatForm.addEventListener('submit', (e) => {
            e.preventDefault();
            submitChat();
        });
    }

    if (chatInput) {
        chatInput.addEventListener('focus', () => {
            resetJoystick();
            clearHeldInputs();
        });
        chatInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter' || e.key === 'NumpadEnter' || e.keyCode === 13 || e.which === 13) {
                e.preventDefault();
                e.stopPropagation();
                submitChat();
            }
        });
    }

    if (chatSendBtn) {
        chatSendBtn.addEventListener('touchstart', (e) => {
            e.stopPropagation();
        }, { passive: true });
    }

    if (chatLog) {
        chatLog.addEventListener('selectstart', e => e.preventDefault());
        chatLog.addEventListener('copy', e => e.preventDefault());
        chatLog.addEventListener('cut', e => e.preventDefault());
    }

    for (let i = 0; i < inventorySlots.length; i++) {
        inventorySlots[i].addEventListener('pointerenter', (e) => {
            if (e.pointerType !== 'mouse' || dragState || isShopOpen) return;
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

    if (abilitySlot) {
        abilitySlot.addEventListener('pointerenter', (e) => {
            if (e.pointerType !== 'mouse' || dragState || isShopOpen) return;
            const itemDef = myAbility ? ITEM_BY_ID[myAbility] : null;
            if (itemDef) {
                showShopTooltip(itemDef, abilitySlot, false, true);
            }
        });
        abilitySlot.addEventListener('pointerleave', () => {
            if (!isShopOpen) {
                hideShopTooltip();
            }
        });
        abilitySlot.addEventListener('pointerdown', (e) => {
            if (e.pointerType === 'mouse' && e.button !== 0) return;
            e.preventDefault();
            if (!isShopOpen) {
                hideShopTooltip();
            }
            triggerAbility(true);
        });
    }

    if (armorSlot) {
        armorSlot.addEventListener('pointerenter', (e) => {
            if (e.pointerType !== 'mouse' || dragState || isShopOpen) return;
            const itemDef = ME.armor ? ITEM_BY_ID[ME.armor] : null;
            if (itemDef) {
                showShopTooltip(itemDef, armorSlot, false, true);
            }
        });
        armorSlot.addEventListener('pointerleave', () => {
            if (!isShopOpen) {
                hideShopTooltip();
            }
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
            const collapsed = leaderboardList.classList.toggle('hidden');
            if (leaderboardTabs) {
                leaderboardTabs.classList.toggle('hidden', collapsed);
            }
        });
    }

    if (leaderboardTabMatchBtn) {
        leaderboardTabMatchBtn.addEventListener('click', () => {
            setLeaderboardTab('match');
        });
    }

    if (leaderboardTabWavesBtn) {
        leaderboardTabWavesBtn.addEventListener('click', () => {
            setLeaderboardTab('waves');
        });
    }

    if (playBtn) {
        playBtn.addEventListener('click', () => {
            if (!inMainMenu || isJoining) return;
            suppressReloadDisconnect = false;
            setMenuError('');
            if (tokenInput) tokenInput.value = '';

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
