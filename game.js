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
const adminReviveBtn = document.getElementById('admin-revive-btn');
const adminSkipWaveBtn = document.getElementById('admin-skip-wave-btn');
const adminRestartGameBtn = document.getElementById('admin-restart-game-btn');

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
let lastLocalShotAt = 0;
let isAttackHeld = false;
let dragState = null;
let lastEquippedItemKey = null;

const swingAnims = new Map();
const recoilAnims = new Map();
const leftRecoilAnims = new Map();
const equipAnims = new Map();
const leftPunchAnims = new Map();
const enemyAggroUntil = new Map();
const enemyAlertBadges = new Map();
const alertCommWaves = [];
const dropslideEmitters = [];
const dropslideParticles = [];
const serverProjectiles = new Map();
let serverGrenades = [];
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
let isLeaveDialogOpen = false;
let isShopOpen = false;
let isModDialogOpen = false;
let isAdminPanelOpen = false;
let isChatMinimized = false;
let isMinimapMinimized = false;
let isMapExpanded = false;
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

function enterGameUI() {
    if (leaveBtn) leaveBtn.classList.add('visible');
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
    enemyAggroUntil.clear();
    enemyAlertBadges.clear();
    alertCommWaves.length = 0;
    dropslideEmitters.length = 0;
    dropslideParticles.length = 0;
    serverProjectiles.clear();
    serverGrenades = [];
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
    closeModDialog();
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
    if (isLeaveDialogOpen) closeLeaveDialog();
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
        description: 'Spawns a melee Rarebot at a Rarebot spawn region.',
        bodyType: 'rarebot',
        weapon: 'hands',
        stats: [{ label: 'HP', value: '255' }, { label: 'Team', value: 'Rarebot' }]
    },
    {
        id: 'rarebot-pistol',
        title: 'Rarebot (Pistol)',
        kindLabel: 'ENEMY',
        description: 'Spawns a ranged Rarebot with Rarebot Pistol at a Rarebot spawn region.',
        bodyType: 'rarebot',
        weapon: 'pistol',
        stats: [{ label: 'HP', value: '255' }, { label: 'Weapon', value: 'Rarebot Pistol' }]
    },
    {
        id: 'rarebot2',
        title: 'Rarebot 2.0',
        kindLabel: 'ENEMY',
        description: 'Spawns Rarebot 2.0 wielding Dual Rarebot Pistols with Dropslide.',
        bodyType: 'rarebot',
        weapon: 'dual-pistol',
        stats: [{ label: 'HP', value: '475' }, { label: 'Weapon', value: 'Dual Rarebot Pistol' }]
    },
    {
        id: 'goodbot',
        title: 'Goodbot',
        kindLabel: 'ALLY',
        description: 'Spawns a smart melee AI Goodbot at a Goodbot spawn region.',
        bodyType: 'goodbot',
        weapon: 'hands',
        stats: [{ label: 'HP', value: '1000' }, { label: 'Team', value: 'Goodbot' }]
    },
    {
        id: 'goodbot-pistol',
        title: 'Goodbot (Pistol)',
        kindLabel: 'ALLY',
        description: 'Spawns a smart ranged AI Goodbot with Goodbot Pistol at a Goodbot spawn region.',
        bodyType: 'goodbot',
        weapon: 'goodbot-pistol',
        stats: [{ label: 'HP', value: '1000' }, { label: 'Weapon', value: 'Goodbot Pistol' }]
    },
    {
        id: 'goodbot-cannon',
        title: 'Goodbot (Cannon)',
        kindLabel: 'ALLY',
        description: 'Spawns a smart heavy ranged AI Goodbot with Goodbot Cannon at a Goodbot spawn region.',
        bodyType: 'goodbot',
        weapon: 'goodbot-cannon',
        stats: [{ label: 'HP', value: '1000' }, { label: 'Weapon', value: 'Goodbot Cannon' }, { label: 'Damage', value: '250 AoE' }, { label: 'Stun', value: '1s' }]
    },
    {
        id: 'prototype',
        title: 'Prototype Rarebot',
        kindLabel: 'ENEMY',
        description: 'Spawns a fast Prototype Rarebot at a Rarebot spawn region.',
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

    const bodyImg = opt.bodyType === 'prototype'
        ? prototypeRarebotImg
        : (opt.bodyType === 'rarebot' ? rarebotImg : goodbotImg);
    const bodySize = 36;
    const refW = (goodbotImg.complete && goodbotImg.naturalWidth > 0) ? goodbotImg.naturalWidth : 512;
    const refH = (goodbotImg.complete && goodbotImg.naturalHeight > 0) ? goodbotImg.naturalHeight : 512;

    let minX = -bodySize / 2;
    let maxX = bodySize / 2;
    let minY = -bodySize / 2;
    let maxY = bodySize / 2;

    const isDualPistol = opt.weapon === 'dual-pistol';
    const isRangedPreview = opt.weapon === 'pistol' || isDualPistol || opt.weapon === 'goodbot-pistol' || opt.weapon === 'goodbot-cannon';
    let weaponImg = null;
    let wRect = null;
    let dualSplit = null;
    if (isRangedPreview) {
        weaponImg = opt.weapon === 'goodbot-cannon'
            ? goodbotCannonImg
            : ((opt.weapon === 'pistol' || isDualPistol) ? rarebotPistolImg : goodbotPistolImg);
        if (weaponImg.complete && weaponImg.naturalWidth > 0) {
            const metrics = getWeaponMetrics(opt.weapon, weaponImg);
            const pxScaleX = ((bodySize / refW) * HANDS_SCALE) / metrics.resScale;
            const pxScaleY = ((bodySize / refH) * HANDS_SCALE) / metrics.resScale;
            const wx = -metrics.anchorX * pxScaleX;
            const wy = -metrics.anchorY * pxScaleY;
            const ww = weaponImg.naturalWidth * pxScaleX;
            const wh = weaponImg.naturalHeight * pxScaleY;
            if (isDualPistol) {
                const sx = Math.max(1, Math.min(metrics.splitX, weaponImg.naturalWidth));
                const rw = weaponImg.naturalWidth - sx;
                const rightX = (sx - metrics.anchorX) * pxScaleX;
                const rightDrawW = rw * pxScaleX;
                dualSplit = { sx, rw, fullH: weaponImg.naturalHeight, rightX, rightDrawW, wy, wh };
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
    } else {
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

    if (bodyImg.complete && bodyImg.naturalWidth > 0) {
        g.drawImage(bodyImg, -bodySize / 2, -bodySize / 2, bodySize, bodySize);
    } else {
        g.fillStyle = opt.bodyType === 'goodbot' ? '#b833ff' : '#cc3f3f';
        g.fillRect(-bodySize / 2, -bodySize / 2, bodySize, bodySize);
    }
    g.restore();
    return c.toDataURL();
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
            showShopTooltip(tipDef, slot, false, false);
        });
        slot.addEventListener('pointerleave', () => {
            hideShopTooltip();
        });
        slot.addEventListener('focus', () => {
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
    if (isLeaveDialogOpen) closeLeaveDialog();
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
    hideShopTooltip();
    adminPanelOverlay.classList.remove('open');
    adminPanelOverlay.setAttribute('aria-hidden', 'true');
    syncCanvasCrosshairCursor();
}

function openSettings() {
    if (!settingsOverlay) return;
    if (isLeaveDialogOpen) closeLeaveDialog();
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

const ITEM_SLOT_IMAGES = {
    'goodbot-pistol': 'assets/Goodbot Pistol Slot.png',
    'goodbot-cannon': 'assets/Goodbot Cannon Slot.png',
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
        description: 'Lightweight plasma firearm dealing 45-58 damage per shot',
        cost: 15,
        slotImage: 'assets/Goodbot Pistol Slot.png',
        stats: [
            { label: 'Damage', value: '45-58' },
            { label: 'Firerate', value: '400ms' }
        ]
    },
    {
        id: 'goodbot-cannon',
        title: 'Goodbot Cannon',
        kind: 'weapon',
        description: 'Heavy cannon that recoils strongly and fires a spinning cannonball, triggering a purple stun shockwave for 1s and dealing 250 AoE damage with knockback.',
        cost: 500,
        slotImage: 'assets/Goodbot Cannon Slot.png',
        stats: [
            { label: 'Damage', value: '250 AoE' },
            { label: 'Cooldown', value: '2s' },
            { label: 'Stun', value: '1s' }
        ]
    },
    {
        id: 'goodbot-grenade',
        title: 'Goodbot Grenade',
        kind: 'ability',
        description: 'Ability (Press F or Right Click). Throws a grenade that triggers a 3-tile purple shockwave stunning rarebots for 1s, then explodes for 150-200 damage.',
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
        description: 'Deploys a smart AI melee Goodbot that guards bases, dodges hits/bullets, and grapples rarebots for 150 dmg + 0.5s stun.',
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
        description: 'Deploys a smart AI ranged Goodbot with Goodbot Pistol that guards bases and dodges hits/bullets.',
        cost: 250,
        stats: [
            { label: 'HP', value: '1000' },
            { label: 'Weapon', value: 'Goodbot Pistol' }
        ]
    },
    {
        id: 'unit-goodbot-cannon',
        title: 'Goodbot (Cannon)',
        kind: 'unit',
        customTypeLabel: 'UNIT',
        bodyType: 'goodbot',
        weapon: 'goodbot-cannon',
        description: 'Deploys a smart AI heavy ranged Goodbot wielding the Goodbot Cannon that follows you, dodges hits/bullets, and deals 250 AoE damage + 1s stun.',
        cost: 700,
        stats: [
            { label: 'HP', value: '1000' },
            { label: 'Weapon', value: 'Goodbot Cannon' },
            { label: 'Damage', value: '250 AoE / 2s CD' },
            { label: 'Stun', value: '1s' }
        ]
    }
];

const ITEM_BY_ID = Object.fromEntries([...SHOP_ITEMS, ...SHOP_UNITS].map(item => [item.id, item]));

function getMyEquippedWeapon() {
    if (ME.faction !== 'goodbot') return 'hands';
    const itemId = myInventory[activeSlot];
    if (itemId === 'goodbot-pistol') return 'goodbot-pistol';
    if (itemId === 'goodbot-cannon') return 'goodbot-cannon';
    return 'hands';
}

function isRangedCrosshairActive() {
    if (inMainMenu || myId === null) return false;
    if (isSettingsOpen || isLeaveDialogOpen || isShopOpen || isModDialogOpen || isAdminPanelOpen || isMapExpanded) return false;
    if (document.activeElement === chatInput || (tokenInput && document.activeElement === tokenInput)) return false;
    if (document.body.classList.contains('touch-mode')) return false;
    const wpn = getMyEquippedWeapon();
    return wpn === 'goodbot-pistol' || wpn === 'goodbot-cannon';
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
            if (alliesFull) {
                shopTooltipCost.textContent = `Cost: ${item.cost} Scraps (Max ${maxAlliesCount} Allies)`;
            } else {
                shopTooltipCost.textContent = cantAfford ? `Cost: ${item.cost} Scraps (Can't afford)` : `Cost: ${item.cost} Scraps`;
            }
            shopTooltipCost.classList.toggle('cant-afford', cantAfford || alliesFull);
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
        for (let i = 0; i < slotEls.length; i++) {
            const slotEl = slotEls[i];
            const itemKind = slotEl.dataset.itemKind || '';
            slotEl.classList.toggle('disabled', itemKind === 'unit' && alliesFull);
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
        if (unitFull) {
            shopTooltipCost.textContent = `Cost: ${lastHoveredShopItem.cost} Scraps (Max ${maxAlliesCount} Allies)`;
        } else {
            shopTooltipCost.textContent = cantAfford
                ? `Cost: ${lastHoveredShopItem.cost} Scraps (Can't afford)`
                : `Cost: ${lastHoveredShopItem.cost} Scraps`;
        }
        shopTooltipCost.classList.toggle('cant-afford', cantAfford || unitFull);
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
    if (isLeaveDialogOpen) closeLeaveDialog();
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
        if (isLeaveDialogOpen) closeLeaveDialog();
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
const botHandsImg = new Image();
const prototypeRarebotHandsImg = new Image();
const goodbotPistolImg = new Image();
const goodbotCannonImg = new Image();
const rarebotPistolImg = new Image();
const goodbotBulletImg = new Image();
const goodbotCannonBallImg = new Image();
const rarebotBulletImg = new Image();
const goodbotGrenadeImg = new Image();

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
    laserCannonShot: 0,
    bulletImpact1: 0,
    bulletImpact2: 0,
    bulletImpact3: 0,
    bulletWallImpact: 0,
    grapple1: 0,
    dropslide: 0
};

function playSpatialSound(key, wx, wy) {
    const masterVol = window.GAME_AUDIO_SETTINGS ? Number(window.GAME_AUDIO_SETTINGS.soundVolume) : 1;
    if (!isFinite(masterVol) || masterVol <= 0.005) return;
    const nowMs = performance.now();
    const minGap = key === 'explosion' ? 60 : ((key === 'swing' || key === 'hit') ? 45 : (key === 'dropslide' ? 40 : 15));
    if (nowMs - (lastSoundAt[key] || 0) < minGap) return;

    const ctxAudio = ensureAudioContext();
    if (!ctxAudio) return;

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
    const volumeMult = (key === 'hitReceive' || key === 'hitDeal') ? 0.1 : (key === 'grapple1' ? 2.7 : 1);
    const gainValue = falloff * falloff * masterVol * volumeMult;
    if (gainValue <= 0.005) return;

    if (!soundBuffers[key]) {
        const reqAt = nowMs;
        loadSoundBuffer(key, ctxAudio).then(() => {
            if (!soundBuffers[key]) return;
            if (performance.now() - reqAt > 400) return;
            const curNow = performance.now();
            if (curNow - (lastSoundAt[key] || 0) < minGap) return;
            lastSoundAt[key] = curNow;
            try {
                const source = ctxAudio.createBufferSource();
                source.buffer = soundBuffers[key];
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
    for (let li = 0; li < fullLayers.length; li++) {
        const grid = WORLD.MAP.mapData[fullLayers[li]];
        if (!grid) continue;
        for (let r = 0; r < WORLD.MAP.rows; r++) {
            const rowArr = grid[r];
            if (!rowArr) continue;
            for (let c = 0; c < WORLD.MAP.columns; c++) {
                const cell = rowArr[c];
                if (!cell) continue;
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
    const refreshIcons = () => {
        calibratedWeaponMetrics.clear();
        scaledSpriteCache.clear();
        refreshAdminSpawnIcons();
        refreshShopUnitIcons();
    };
    goodbotImg.onload = refreshIcons;
    rarebotImg.onload = refreshIcons;
    prototypeRarebotImg.onload = refreshIcons;
    botHandsImg.onload = refreshIcons;
    prototypeRarebotHandsImg.onload = refreshIcons;
    goodbotPistolImg.onload = refreshIcons;
    goodbotCannonImg.onload = refreshIcons;
    rarebotPistolImg.onload = refreshIcons;
    goodbotImg.src = 'assets/Goodbot.png';
    rarebotImg.src = 'assets/Rarebot.png';
    prototypeRarebotImg.src = 'assets/Prototype Rarebot.png';
    botHandsImg.src = 'assets/Bot Hands.png';
    prototypeRarebotHandsImg.src = 'assets/Prototype Rarebot Hands.png';
    goodbotPistolImg.src = 'assets/Goodbot Pistol.png';
    goodbotCannonImg.src = 'assets/Goodbot Cannon.png';
    rarebotPistolImg.src = 'assets/Rarebot Pistol.png';
    goodbotBulletImg.src = 'assets/Goodbot Bullet.png';
    goodbotCannonBallImg.src = 'assets/Goodbot Cannon Ball.png';
    rarebotBulletImg.src = 'assets/Rarebot Bullet.png';
    goodbotGrenadeImg.src = 'assets/Goodbot Grenade.png';
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
    const sig = entries.map(e => `${e.name}\t${e.scraps}\t${e.faction || 'goodbot'}\t${e.isAdmin ? 1 : 0}`).join('\n');
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

    for (const id in serverAllies) {
        const a = serverAllies[id];
        if (a.renderX === undefined) {
            a.renderX = a.x;
            a.renderY = a.y;
            a.renderAngle = a.angle || 0;
        }

        a.x = Math.max(0, Math.min(maxX, a.x + (a.vx || 0) * dt));
        a.y = Math.max(0, Math.min(maxY, a.y + (a.vy || 0) * dt));

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

    const nowMs = performance.now();
    updateAbilitySlotCooldown(nowMs);
    const crosshairClosing = isRangedCrosshairActive() && (isAttackHeld || (nowMs - lastLocalShotAt < 260));
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

    if (isAttackHeld && !inMainMenu && myId !== null && !isSettingsOpen && !isLeaveDialogOpen && !isShopOpen && !isModDialogOpen && !isAdminPanelOpen && !isMapExpanded && document.activeElement !== chatInput && (!tokenInput || document.activeElement !== tokenInput)) {
        triggerAttack();
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

function spawnGrenadeExplosionParticles(wx, wy, radius = 192) {
    grenadeShockwaves.push({
        x: wx,
        y: wy,
        radius,
        age: 0,
        life: 0.44,
        isExplosionFlash: true
    });
    const count = 44;
    for (let i = 0; i < count; i++) {
        if (explosions.length >= MAX_EXPLOSION_PARTICLES) {
            explosions.shift();
        }
        const angle = (Math.PI * 2 * i) / count + (Math.random() - 0.5) * 0.45;
        const speed = 150 + Math.random() * 340;
        explosions.push({
            x: wx + (Math.random() - 0.5) * 18,
            y: wy + (Math.random() - 0.5) * 18,
            vx: Math.cos(angle) * speed,
            vy: Math.sin(angle) * speed,
            radius: 9 + Math.random() * 14,
            life: 0.45 + Math.random() * 0.4,
            age: 0,
            color: GRENADE_EXPLOSION_COLORS[Math.floor(Math.random() * GRENADE_EXPLOSION_COLORS.length)]
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
    const isCannon = weapon === 'goodbot-cannon';
    const isDualPistol = weapon === 'dual-pistol';
    const isRangedWeapon = isCannon || isDualPistol || weapon === 'goodbot-pistol' || weapon === 'pistol';
    ctx.rotate(angle + (isRangedWeapon ? 0 : swingOffset));
    const refW = goodbotImg.complete && goodbotImg.naturalWidth > 0 ? goodbotImg.naturalWidth : 512;
    const refH = goodbotImg.complete && goodbotImg.naturalHeight > 0 ? goodbotImg.naturalHeight : 512;

    if (isRangedWeapon) {
        const weaponImg = isCannon
            ? goodbotCannonImg
            : ((weapon === 'pistol' || isDualPistol) ? rarebotPistolImg : goodbotPistolImg);
        if (weaponImg.complete && weaponImg.naturalWidth > 0) {
            const metrics = getWeaponMetrics(weapon, weaponImg);
            const pxScaleX = ((sW / refW) * HANDS_SCALE) / metrics.resScale;
            const pxScaleY = ((sH / refH) * HANDS_SCALE) / metrics.resScale;
            const anchorX = metrics.anchorX;
            const anchorY = metrics.anchorY;
            const fullW = weaponImg.naturalWidth;
            const fullH = weaponImg.naturalHeight;
            const pH = fullH * pxScaleY;
            const baseLeftX = -anchorX * pxScaleX;
            const baseTopY = -anchorY * pxScaleY;
            const bodyScale = sW / 48;

            if (isCannon) {
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
                const cDx = equip ? equip.dx * bodyScale : 0;
                const cDy = (equip ? equip.dy * bodyScale : 0) + (recoil ? recoil.dy * bodyScale : 0);
                const cRot = (equip ? equip.rot : 0) + (recoil ? recoil.rot : 0);
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

                ctx.save();
                if (leftPunch) {
                    ctx.translate(0, leftPunch.dy * bodyScale);
                    ctx.rotate(leftPunch.rot);
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
                if (leftPunch) {
                    ctx.save();
                    ctx.translate(0, leftPunch.dy * bodyScale);
                    ctx.rotate(leftPunch.rot);
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
                const rDx = equip ? equip.dx * bodyScale : 0;
                const rDy = (equip ? equip.dy * bodyScale : 0) + (recoil ? recoil.dy * bodyScale : 0);
                const rRot = (equip ? equip.rot : 0) + (recoil ? recoil.rot : 0);
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
        if (leftPunch) {
            ctx.save();
            ctx.translate(0, leftPunch.dy * bodyScale);
            ctx.rotate(leftPunch.rot);
            if (leftMip !== handsImg) {
                ctx.drawImage(leftMip, -hW / 2, -hH / 2, leftDrawW, hH);
            } else {
                ctx.drawImage(handsImg, 0, 0, splitX, handsImg.naturalHeight, -hW / 2, -hH / 2, leftDrawW, hH);
            }
            ctx.restore();
        } else {
            if (leftMip !== handsImg) {
                ctx.drawImage(leftMip, -hW / 2, -hH / 2, leftDrawW, hH);
            } else {
                ctx.drawImage(handsImg, 0, 0, splitX, handsImg.naturalHeight, -hW / 2, -hH / 2, leftDrawW, hH);
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
            if (rightMip !== handsImg) {
                ctx.drawImage(rightMip, -hW / 2 + leftDrawW, -hH / 2, rightDrawW, hH);
            } else {
                ctx.drawImage(handsImg, splitX, 0, rightW, handsImg.naturalHeight, -hW / 2 + leftDrawW, -hH / 2, rightDrawW, hH);
            }
        }
    } else {
        const r = sW * 0.14 * HANDS_SCALE;
        const hx = sW * 0.46 * HANDS_SCALE;
        const hy = -sH * 0.48 * HANDS_SCALE;
        ctx.fillStyle = '#2d2d30';
        ctx.strokeStyle = '#000000';
        ctx.lineWidth = Math.max(1.5, sW * 0.045);
        if (leftPunch) {
            ctx.save();
            ctx.translate(0, leftPunch.dy * bodyScale);
            ctx.rotate(leftPunch.rot);
        }
        ctx.beginPath();
        ctx.arc(-hx, hy, r, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
        if (leftPunch) {
            ctx.restore();
        }
        ctx.beginPath();
        ctx.arc(hx, hy, r, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
    }
    ctx.restore();
}

const pendingEntityLabels = [];

function drawEntityLabel(x, y, sH, label, faction) {
    if (!label) return;
    const lbl = getLabelSprite(label, faction);
    const drawX = Math.round((x - lbl.w / 2) * lbl.scale) / lbl.scale;
    const drawY = Math.round((y - sH / 2 - 10 - lbl.baselineY) * lbl.scale) / lbl.scale;
    ctx.drawImage(lbl.canvas, drawX, drawY, lbl.drawW, lbl.drawH);
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

    const cullPad = 96;
    const nowMs = performance.now();

    if (!inMainMenu && myId !== null) {
        const meCX = ME.x + ME.width / 2;
        const meCY = ME.y + ME.height / 2;

        if (raycastBeams.length > 0) {
            const bulletScale = (48 / 512) * HANDS_SCALE * 1.35;
            const beamWidth = Math.max(4, 24 * bulletScale * 1.5);
            for (let i = 0; i < raycastBeams.length; i++) {
                const b = raycastBeams[i];
                const dx = b.x2 - b.x1;
                const dy = b.y2 - b.y1;
                const beamLen = Math.hypot(dx, dy);
                if (beamLen < 2) continue;
                const alpha = Math.max(0, 1 - b.age / b.life);
                const beamAngle = Math.atan2(dy, dx) + Math.PI / 2;
                const bulletImg = b.variant === 'rarebot' ? rarebotBulletImg : goodbotBulletImg;
                ctx.save();
                ctx.globalAlpha = alpha;
                ctx.translate(b.x1 - camX, b.y1 - camY);
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
                if (bx < -48 || bx > camW + 48 || by < -48 || by > camH + 48) continue;
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

        if (grenadeShockwaves.length > 0) {
            ctx.save();
            for (let i = 0; i < grenadeShockwaves.length; i++) {
                const w = grenadeShockwaves[i];
                const sx = w.x - camX;
                const sy = w.y - camY;
                if (sx + w.radius < -40 || sx - w.radius > camW + 40 || sy + w.radius < -40 || sy - w.radius > camH + 40) continue;
                const p = Math.max(0, Math.min(1, w.age / w.life));
                if (w.isExplosionFlash) {
                    const r = w.radius * (0.25 + 0.75 * Math.min(1, p * 2.2));
                    const alpha = Math.max(0, 1 - p);
                    ctx.fillStyle = `rgba(184, 51, 255, ${(0.42 * alpha).toFixed(3)})`;
                    ctx.beginPath();
                    ctx.arc(sx, sy, r, 0, Math.PI * 2);
                    ctx.fill();
                    ctx.strokeStyle = `rgba(216, 74, 255, ${(0.85 * alpha).toFixed(3)})`;
                    ctx.lineWidth = 4;
                    ctx.stroke();
                } else {
                    const grow = Math.min(1, p / 0.22);
                    const r = w.radius * (0.2 + 0.8 * grow);
                    const fade = p < 0.7 ? 1 : Math.max(0, (1 - p) / 0.3);
                    ctx.fillStyle = `rgba(184, 51, 255, ${(0.5 * fade).toFixed(3)})`;
                    ctx.beginPath();
                    ctx.arc(sx, sy, r, 0, Math.PI * 2);
                    ctx.fill();
                    ctx.strokeStyle = `rgba(240, 170, 255, ${(0.75 * fade).toFixed(3)})`;
                    ctx.lineWidth = 3;
                    ctx.stroke();
                }
            }
            ctx.restore();
        }

        if (serverGrenades.length > 0) {
            const gReady = goodbotGrenadeImg.complete && goodbotGrenadeImg.naturalWidth > 0;
            const gRatio = gReady ? (goodbotGrenadeImg.naturalHeight / goodbotGrenadeImg.naturalWidth) : 1.35;
            const baseGW = gRatio > 1.05 ? GRENADE_DRAW_SIZE : 23;
            const gScale = Math.max(1, 24 / (baseGW * gRatio));
            const gDrawW = baseGW * gScale;
            const gDrawH = baseGW * gRatio * gScale;
            for (let i = 0; i < serverGrenades.length; i++) {
                const g = serverGrenades[i];
                const gx = g.x - camX;
                const gy = g.y - camY;
                if (gx < -48 || gx > camW + 48 || gy < -48 || gy > camH + 48) continue;
                if (g.phase === 'armed' || g.phase === 'shockwaved') {
                    const pulse = 0.5 + 0.5 * Math.sin(nowMs * 0.018);
                    ctx.save();
                    ctx.strokeStyle = `rgba(216, 74, 255, ${(0.35 + 0.45 * pulse).toFixed(3)})`;
                    ctx.lineWidth = 2;
                    ctx.beginPath();
                    ctx.arc(gx, gy, Math.max(gDrawW, gDrawH) * (0.52 + 0.12 * pulse), 0, Math.PI * 2);
                    ctx.stroke();
                    ctx.restore();
                }
                ctx.save();
                ctx.translate(gx, gy);
                ctx.rotate(g.angle || 0);
                if (gReady) {
                    ctx.imageSmoothingEnabled = true;
                    ctx.drawImage(goodbotGrenadeImg, -gDrawW / 2, -gDrawH / 2, gDrawW, gDrawH);
                } else {
                    const gr = 10;
                    ctx.fillStyle = '#1b1b22';
                    ctx.strokeStyle = '#000000';
                    ctx.lineWidth = 1.8;
                    ctx.beginPath();
                    ctx.ellipse(0, 0, gr * 0.85, gr * 1.15, 0, 0, Math.PI * 2);
                    ctx.fill();
                    ctx.stroke();
                    ctx.fillStyle = '#b833ff';
                    ctx.beginPath();
                    ctx.arc(0, 1, gr * 0.48, 0, Math.PI * 2);
                    ctx.fill();
                }
                ctx.restore();
            }
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
            const showBars = ME.faction === 'goodbot' && (enemyAggroUntil.get(key) || 0) > nowMs;
            const eKind = e.kind || 'rarebot';
            const eWeapon = e.weapon || 'hands';
            const eLabel = e.name || (eKind === 'prototype' ? 'Prototype Rarebot' : (eKind === 'rarebot2' ? 'Rarebot 2.0' : 'Rarebot'));
            const defMaxH = eKind === 'prototype' ? 120 : (eKind === 'rarebot2' ? 475 : 255);
            const bars = showBars ? {
                health: e.health ?? defMaxH,
                maxHealth: e.maxHealth ?? defMaxH,
                energy: e.energy ?? (eKind === 'prototype' ? 100 : 50),
                maxEnergy: e.maxEnergy ?? (eKind === 'prototype' ? 100 : 50)
            } : null;
            drawEntity(eRX, eRY, ew, eh, e.renderAngle ?? 0, es, null, 'rarebot', true, getSwingOffset(key, nowMs), bars, eKind, eWeapon, key, nowMs);
            if (!eInTree && eLabel) {
                pendingEntityLabels.push({ x: eRX, y: eRY, sH: eh * es, label: eLabel, faction: 'rarebot' });
            }
        }

        for (const id in serverAllies) {
            const a = serverAllies[id];
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
            if (!aInTree) {
                if (ME.faction === 'goodbot') {
                    const adx = aWorldCX - meCX;
                    const ady = aWorldCY - meCY;
                    showBars = (adx * adx + ady * ady) <= 260 * 260;
                } else if (ME.faction === 'rarebot') {
                    showBars = clientHasLOS(meCX, meCY, aWorldCX, aWorldCY);
                }
            }
            const bars = showBars ? {
                health: a.health ?? 1000,
                maxHealth: a.maxHealth ?? 1000,
                energy: a.energy ?? 255,
                maxEnergy: a.maxEnergy ?? 255
            } : null;
            drawEntity(aRX, aRY, aw, ah, a.renderAngle ?? 0, as, null, 'goodbot', true, getSwingOffset(key, nowMs), bars, null, a.weapon || 'hands', key, nowMs);
            if (!aInTree) {
                pendingEntityLabels.push({ x: aRX, y: aRY, sH: ah * as, label: a.name || 'Goodbot', faction: 'goodbot' });
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
            if (!pInTree) {
                if (ME.faction === 'goodbot' && pFaction === 'rarebot') {
                    showBars = (enemyAggroUntil.get(key) || 0) > nowMs;
                } else if (ME.faction === 'goodbot' && pFaction === 'goodbot') {
                    const adx = pWorldCX - meCX;
                    const ady = pWorldCY - meCY;
                    showBars = (adx * adx + ady * ady) <= 260 * 260;
                } else if (ME.faction === 'rarebot' && pFaction === 'goodbot') {
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
            drawEntity(pRX, pRY, pw, ph, p.renderAngle ?? 0, ps, null, pFaction, true, getSwingOffset(key, nowMs), bars, null, p.weapon || 'hands', key, nowMs);
            if (!pInTree && pLabel) {
                pendingEntityLabels.push({ x: pRX, y: pRY, sH: ph * ps, label: pLabel, faction: pFaction });
            }
        }

        if (ME.faction !== 'spectator') {
            const pRenderX = ME.x - camX + ME.width / 2;
            const pRenderY = ME.y - camY + ME.height / 2;
            const myKey = `player:${myId}`;
            const meInTree = isWorldPointInTree(meCX, meCY);
            drawEntity(pRenderX, pRenderY, ME.width, ME.height, ME.angle, ME.scale, null, ME.faction, true, getSwingOffset(myKey, nowMs), null, null, getMyEquippedWeapon(), myKey, nowMs);
            if (!meInTree) {
                pendingEntityLabels.push({ x: pRenderX, y: pRenderY, sH: ME.height * ME.scale, label: formatDisplayName(myName, isAdmin), faction: ME.faction });
            }
        }
    }

    ctx.save();
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.imageSmoothingEnabled = false;
    for (let cy = startCY; cy <= endCY; cy++) {
        const wy0 = cy * cs;
        for (let cx = startCX; cx <= endCX; cx++) {
            const bounds = WORLD.MAP.wallChunkBounds[cy] ? WORLD.MAP.wallChunkBounds[cy][cx] : null;
            if (!bounds) continue;
            drawClippedChunk(WORLD.MAP.wallChunks[cy][cx], cx * cs, wy0, bounds, camX, camY, visW, visH, vs);
        }
    }

    for (let cy = startCY; cy <= endCY; cy++) {
        const wy0 = cy * cs;
        for (let cx = startCX; cx <= endCX; cx++) {
            const bounds = WORLD.MAP.fgChunkBounds[cy] ? WORLD.MAP.fgChunkBounds[cy][cx] : null;
            if (!bounds) continue;
            drawClippedChunk(WORLD.MAP.fgChunks[cy][cx], cx * cs, wy0, bounds, camX, camY, visW, visH, vs);
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
        const cx = (((e.renderX ?? e.x) + (e.width || 48) * 0.5) / mapW) * pw;
        const cy = (((e.renderY ?? e.y) + (e.height || 48) * 0.5) / mapH) * ph;
        mctx.beginPath();
        mctx.arc(cx, cy, r, 0, Math.PI * 2);
        mctx.fillStyle = '#ff2a2a';
        mctx.fill();
        mctx.strokeStyle = 'rgba(0, 0, 0, 0.85)';
        mctx.stroke();
    }

    for (const id in serverAllies) {
        const a = serverAllies[id];
        const cx = (((a.renderX ?? a.x) + (a.width || 48) * 0.5) / mapW) * pw;
        const cy = (((a.renderY ?? a.y) + (a.height || 48) * 0.5) / mapH) * ph;
        mctx.beginPath();
        mctx.arc(cx, cy, r, 0, Math.PI * 2);
        mctx.fillStyle = '#b833ff';
        mctx.fill();
        mctx.strokeStyle = 'rgba(0, 0, 0, 0.85)';
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
            ME.faction = data.faction || 'goodbot';
            refreshAdminReviveButton();
            ME.maxHealth = Math.max(1, Number(data.maxHealth) || 1000);
            ME.maxEnergy = Math.max(1, Number(data.maxEnergy) || 255);
            ME.health = Math.max(0, Math.min(ME.maxHealth, data.health ?? ME.maxHealth));
            ME.energy = Math.max(0, Math.min(ME.maxEnergy, data.energy ?? ME.maxEnergy));
            ME.scraps = Math.max(0, Math.floor(data.scraps ?? 0));
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

        if (data.type === 'ability_left_swing') {
            const key = `player:${data.id}`;
            const nowMs = performance.now();
            if (!(data.id === myId && nowMs - lastLocalAbilityAt < 250)) {
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
                isExplosionFlash: false
            });
            addCameraShake(0.24, sx, sy);
            return;
        }

        if (data.type === 'grenade_explosion') {
            const gx = Number(data.x) || 0;
            const gy = Number(data.y) || 0;
            const grad = Number(data.radius) || 192;
            playSpatialSound('explosion', gx, gy);
            spawnGrenadeExplosionParticles(gx, gy, grad);
            addCameraShake(0.68, gx, gy);
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
            if (typeof data.endX === 'number' && typeof data.endY === 'number') {
                raycastBeams.push({
                    variant: data.variant || 'goodbot',
                    x1: Number(data.projX) || 0,
                    y1: Number(data.projY) || 0,
                    x2: data.endX,
                    y2: data.endY,
                    age: 0,
                    life: 0.14
                });
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
                if (data.hand === 'left') {
                    leftRecoilAnims.set(entityKey, { at: nowMs, strong: false });
                } else {
                    recoilAnims.set(entityKey, { at: nowMs, strong: isCannonShot });
                }
                playSpatialSound(isCannonShot ? 'laserCannonShot' : 'laserShot', data.x, data.y);
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
            const hx = typeof data.hitX === 'number' ? data.hitX : Number(data.x) || 0;
            const hy = typeof data.hitY === 'number' ? data.hitY : Number(data.y) || 0;
            const victimFaction = data.targetFaction || (data.kind === 'enemy' ? 'rarebot' : 'goodbot');
            if (victimFaction === 'goodbot' || victimFaction === 'rarebot') {
                hitPointMarkers.push({
                    x: hx,
                    y: hy,
                    color: victimFaction === 'goodbot' ? '#ff2a2a' : '#b833ff',
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
                    if (pFaction !== ME.faction) {
                        ME.faction = pFaction;
                        ME.maxHealth = incoming.maxHealth !== undefined ? Math.max(1, incoming.maxHealth) : 1000;
                        ME.maxEnergy = incoming.maxEnergy !== undefined ? Math.max(1, incoming.maxEnergy) : (pFaction === 'rarebot' ? 50 : 255);
                        enemyAggroUntil.clear();
                        refreshAdminReviveButton();
                        renderInventorySlots();
                    } else {
                        if (incoming.maxHealth !== undefined) ME.maxHealth = Math.max(1, incoming.maxHealth);
                        if (incoming.maxEnergy !== undefined) ME.maxEnergy = Math.max(1, incoming.maxEnergy);
                    }
                    if (incoming.health !== undefined) ME.health = Math.max(0, Math.min(ME.maxHealth, incoming.health));
                    if (incoming.energy !== undefined) ME.energy = Math.max(0, Math.min(ME.maxEnergy, incoming.energy));
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
                    existing.width = incoming.width || existing.width || 48;
                    existing.height = incoming.height || existing.height || 48;
                    if (incoming.name !== undefined) existing.name = incoming.name;
                    existing.isAdmin = pIsAdmin;
                    existing.faction = pFaction;
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
                        vx: incoming.vx || 0,
                        vy: incoming.vy || 0,
                        angle: incoming.angle || 0,
                        scale: incoming.scale ?? 1,
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
                    const defMaxH = eKind === 'prototype' ? 120 : (eKind === 'rarebot2' ? 475 : 255);
                    const defMaxE = eKind === 'prototype' ? 100 : 50;
                    const existing = serverEnemies[id];
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
                        existing.width = incoming.width || existing.width || 48;
                        existing.height = incoming.height || existing.height || 48;
                        existing.kind = eKind;
                        existing.weapon = incoming.weapon || 'hands';
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
                            vx: incoming.vx || 0,
                            vy: incoming.vy || 0,
                            angle: incoming.angle || 0,
                            scale: incoming.scale ?? 1,
                            maxHealth: incoming.maxHealth ?? defMaxH,
                            maxEnergy: incoming.maxEnergy ?? defMaxE,
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

            if (data.allies && typeof data.allies === 'object') {
                for (const id in data.allies) {
                    const incoming = data.allies[id];
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
                        existing.width = incoming.width || existing.width || 48;
                        existing.height = incoming.height || existing.height || 48;
                        existing.name = incoming.name || existing.name || 'Goodbot';
                        existing.weapon = incoming.weapon || 'hands';
                        existing.health = incoming.health ?? existing.health;
                        existing.maxHealth = incoming.maxHealth ?? 1000;
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
                            name: incoming.name || 'Goodbot',
                            vx: incoming.vx || 0,
                            vy: incoming.vy || 0,
                            angle: incoming.angle || 0,
                            scale: incoming.scale ?? 1,
                            maxHealth: incoming.maxHealth ?? 1000,
                            maxEnergy: incoming.maxEnergy ?? 255,
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
            for (const id in serverAllies) {
                if (serverAllies[id]._seq !== stateSeq) {
                    delete serverAllies[id];
                }
            }
            serverGrenades = Array.isArray(data.grenades) ? data.grenades : [];
            return;
        }

        if (data.type === 'player_left') {
            delete serverPlayers[data.id];
            enemyAggroUntil.delete(`player:${data.id}`);
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
    if (isSettingsOpen) {
        if (e.key === 'Escape') {
            e.preventDefault();
            closeSettings();
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

function triggerAttack() {
    ensureAudioContext();
    if (inMainMenu || myId === null || isSettingsOpen || isLeaveDialogOpen || isShopOpen || isModDialogOpen || isAdminPanelOpen || isMapExpanded) return;
    if (ME.faction === 'spectator') return;
    if (!ws || ws.readyState !== WebSocket.OPEN) return;

    const equippedWeapon = getMyEquippedWeapon();
    const isCannon = equippedWeapon === 'goodbot-cannon';
    const isPistol = equippedWeapon === 'goodbot-pistol';
    const cooldown = isCannon ? 2008 : (isPistol ? 408 : (ME.faction === 'rarebot' ? 508 : 428));
    const nowMs = performance.now();
    if (nowMs - lastAttackSentAt < cooldown) return;
    lastAttackSentAt = nowMs;

    const roundedAttackAngle = Math.round(ME.angle * 1000) / 1000;
    lastSentAngle = roundedAttackAngle;
    lastInputSendTime = nowMs;

    if (isCannon || isPistol) {
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
    if (inMainMenu || myId === null || isSettingsOpen || isLeaveDialogOpen || isShopOpen || isModDialogOpen || isAdminPanelOpen || isMapExpanded) return;
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
    ensureAudioContext();
    if (inMainMenu || myId === null || isSettingsOpen || isLeaveDialogOpen || isShopOpen || isModDialogOpen || isAdminPanelOpen || isMapExpanded) return;
    if (document.activeElement === chatInput || (tokenInput && document.activeElement === tokenInput)) return;
    if (e.target !== canvas) return;
    if (e.button === 2) {
        triggerAbility(false);
        return;
    }
    if (e.button !== 0) return;
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
            if (inMainMenu || isSettingsOpen || isLeaveDialogOpen || isModDialogOpen || isAdminPanelOpen) return;
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
        if (inMainMenu || isSettingsOpen || isLeaveDialogOpen || isModDialogOpen || isAdminPanelOpen) return;
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
