const CLOUDFLARED_WSS_URL = 'https://locale-isa-beats-willing.trycloudflare.com';

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
const healthFill = document.getElementById('health-fill');
const energyFill = document.getElementById('energy-fill');
const leaderboardHeader = document.getElementById('leaderboard-header');
const leaderboardList = document.getElementById('leaderboard-list');
const chatLog = document.getElementById('chat-log');
const chatInput = document.getElementById('chat-input');
const chatWrapper = document.getElementById('chat-wrapper');
const chatToggleBtn = document.getElementById('chat-toggle-btn');
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
const mobileJoystick = document.getElementById('mobile-joystick');
const mobileJoystickThumb = document.getElementById('mobile-joystick-thumb');
const mobileSprintBtn = document.getElementById('mobile-sprint-btn');
const inventoryLayer = document.getElementById('inventory-layer');
const inventorySlots = document.querySelectorAll('#inventory-layer .slot');

const LOGICAL_WIDTH = 1280;
const LOGICAL_HEIGHT = 720;

const WORLD = {
    MAP: {
        tileSize: 64,
        chunkSize: 1024,
        columns: 0,
        rows: 0,
        mapData: null,
        bgChunks: [],
        wallChunks: [],
        fgChunks: []
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
    width: 49,
    height: 49,
    vx: 0,
    vy: 0,
    angle: 0,
    scale: 1,
    health: 255,
    energy: 255,
    chats: []
};

let ws = null;
let myId = null;
let myName = '';
let inMainMenu = true;
let serverPlayers = {};
let pendingJoinName = null;
let lastRenderedHealth = -1;
let lastRenderedEnergy = -1;
let lastLeaderboardSig = '';
let hasConnected = false;
let activeSlot = 0;

let menuCamX = null;
let menuCamY = null;
let menuCamVX = 60;
let menuCamVY = 45;

let lastInputKeySig = '';
let lastSentAngle = 0;
let lastInputSendTime = 0;

let isSettingsOpen = false;
let isLeaveDialogOpen = false;
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
    return host === 'localhost' || host === '127.0.0.1' || host.endsWith('.run.app');
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
    ME.chats = [];
    lastRenderedHealth = -1;
    lastRenderedEnergy = -1;
    lastLeaderboardSig = '';
    resetJoystick();
    setMobileSprint(false);
    clearHeldInputs();
    closeChat();
    closeLeaveDialog();
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
    if (!pingProbeUrl || !ws || ws.readyState !== WebSocket.OPEN) return;
    const start = performance.now();
    try {
        await fetch(pingProbeUrl, { method: 'HEAD', mode: 'no-cors', cache: 'no-store' });
        updatePingDisplay(performance.now() - start);
    } catch (_) {}
}

function startPingMonitor(wsUrl) {
    pingProbeUrl = wsUrlToHttpProbe(wsUrl);
    if (pingTimerId !== null) return;
    pingTimerId = setInterval(measurePingOnce, 2000);
}

let fpsFrames = 0;
let fpsLastSample = performance.now();
function startFpsCounter() {
    function tick(now) {
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
        requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
}

const tilesheetImg = new Image();
const goodbotImg = new Image();

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

    for (let cy = 0; cy < numCY; cy++) {
        WORLD.MAP.bgChunks[cy] = [];
        WORLD.MAP.wallChunks[cy] = [];
        WORLD.MAP.fgChunks[cy] = [];
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
    const bgCtx = WORLD.MAP.bgChunks[cy][cx].getContext('2d', { alpha: true });
    const wcCtx = WORLD.MAP.wallChunks[cy][cx].getContext('2d', { alpha: true });
    const fgCtx = WORLD.MAP.fgChunks[cy][cx].getContext('2d', { alpha: true });

    bgCtx.imageSmoothingEnabled = false;
    wcCtx.imageSmoothingEnabled = false;
    fgCtx.imageSmoothingEnabled = false;

    bgCtx.clearRect(0, 0, WORLD.MAP.chunkSize, WORLD.MAP.chunkSize);
    wcCtx.clearRect(0, 0, WORLD.MAP.chunkSize, WORLD.MAP.chunkSize);
    fgCtx.clearRect(0, 0, WORLD.MAP.chunkSize, WORLD.MAP.chunkSize);

    if (!tilesheetImg.complete || tilesheetImg.naturalWidth === 0) return;

    const tileSize = WORLD.MAP.tileSize;
    const startCol = Math.max(0, Math.floor((cx * WORLD.MAP.chunkSize) / tileSize));
    const endCol = Math.min(WORLD.MAP.columns, Math.ceil(((cx + 1) * WORLD.MAP.chunkSize) / tileSize));
    const startRow = Math.max(0, Math.floor((cy * WORLD.MAP.chunkSize) / tileSize));
    const endRow = Math.min(WORLD.MAP.rows, Math.ceil(((cy + 1) * WORLD.MAP.chunkSize) / tileSize));

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
                    const dx = (c * tileSize) - (cx * WORLD.MAP.chunkSize);
                    const dy = (r * tileSize) - (cy * WORLD.MAP.chunkSize);
                    drawTileCell(targetCtx, cell, dx, dy, tileSize);
                }
            }
        }
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
}

function updateStatsUI() {
    const roundedHealth = Math.round(ME.health);
    const roundedEnergy = Math.ceil(ME.energy);

    if (roundedHealth !== lastRenderedHealth && healthFill) {
        healthFill.style.width = `${(roundedHealth / 255) * 100}%`;
        lastRenderedHealth = roundedHealth;
    }

    if (roundedEnergy !== lastRenderedEnergy && energyFill) {
        energyFill.style.width = `${(roundedEnergy / 255) * 100}%`;
        lastRenderedEnergy = roundedEnergy;
    }
}

function updateLeaderboard(names) {
    if (!leaderboardList) return;
    const sig = names.join('\n');
    if (sig === lastLeaderboardSig) return;
    lastLeaderboardSig = sig;
    leaderboardList.textContent = '';
    for (let i = 0; i < names.length; i++) {
        const el = document.createElement('div');
        el.className = 'leaderboard-entry';
        el.textContent = names[i];
        leaderboardList.appendChild(el);
    }
}

function appendChatLog(name, text) {
    if (!chatLog) return;
    const entry = document.createElement('div');
    entry.className = 'chat-log-entry';
    entry.textContent = `${name}: ${text}`;
    chatLog.appendChild(entry);
    while (chatLog.children.length > 50) {
        chatLog.removeChild(chatLog.firstChild);
    }
    chatLog.scrollTop = chatLog.scrollHeight;
}

function selectSlot(idx) {
    if (!inventorySlots || inventorySlots.length === 0) return;
    if (idx < 0 || idx >= inventorySlots.length) return;
    activeSlot = idx;
    for (let i = 0; i < inventorySlots.length; i++) {
        if (i === activeSlot) inventorySlots[i].classList.add('active');
        else inventorySlots[i].classList.remove('active');
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

    sendInput(false);
}

function drawPlayer(x, y, width, height, angle, scale, label) {
    const sW = width * scale;
    const sH = height * scale;
    if (goodbotImg.complete && goodbotImg.naturalWidth > 0) {
        ctx.save();
        ctx.translate(x, y);
        ctx.rotate(angle);
        ctx.drawImage(goodbotImg, -sW / 2, -sH / 2, sW, sH);
        ctx.restore();
    }

    if (label) {
        ctx.textAlign = 'center';
        ctx.textBaseline = 'alphabetic';
        ctx.lineJoin = 'round';
        ctx.lineWidth = 3;
        ctx.strokeStyle = 'rgba(0,0,0,0.85)';
        ctx.font = '15px Viga, sans-serif';
        ctx.fillStyle = '#ffffff';
        ctx.strokeText(label, x, y - sH / 2 - 10);
        ctx.fillText(label, x, y - sH / 2 - 10);
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

function render() {
    if (!WORLD.SYSTEM.isReady) return;
    if (!WORLD.MAP.bgChunks.length || !WORLD.MAP.bgChunks[0].length) return;

    ctx.fillStyle = '#000000';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.save();
    ctx.scale(WORLD.SYSTEM.viewScale, WORLD.SYSTEM.viewScale);
    ctx.imageSmoothingEnabled = false;

    const camX = Math.floor(WORLD.CAMERA.x || 0);
    const camY = Math.floor(WORLD.CAMERA.y || 0);

    const startCX = Math.max(0, Math.floor(camX / WORLD.MAP.chunkSize));
    const endCX = Math.min(WORLD.MAP.bgChunks[0].length - 1, Math.floor((camX + WORLD.CAMERA.width) / WORLD.MAP.chunkSize));
    const startCY = Math.max(0, Math.floor(camY / WORLD.MAP.chunkSize));
    const endCY = Math.min(WORLD.MAP.bgChunks.length - 1, Math.floor((camY + WORLD.CAMERA.height) / WORLD.MAP.chunkSize));

    for (let cy = startCY; cy <= endCY; cy++) {
        for (let cx = startCX; cx <= endCX; cx++) {
            const dx = cx * WORLD.MAP.chunkSize - camX;
            const dy = cy * WORLD.MAP.chunkSize - camY;
            ctx.drawImage(WORLD.MAP.bgChunks[cy][cx], dx, dy, WORLD.MAP.chunkSize + 1, WORLD.MAP.chunkSize + 1);
        }
    }

    if (!inMainMenu && myId !== null) {
        for (const id in serverPlayers) {
            const p = serverPlayers[id];
            const pRX = (p.renderX ?? p.x) - camX + p.width / 2;
            const pRY = (p.renderY ?? p.y) - camY + p.height / 2;
            const ps = Math.min(2, Math.max(0.3, p.scale || 1));
            drawPlayer(pRX, pRY, p.width, p.height, p.renderAngle ?? 0, ps, p.name);
        }

        const pRenderX = ME.x - camX + ME.width / 2;
        const pRenderY = ME.y - camY + ME.height / 2;
        drawPlayer(pRenderX, pRenderY, ME.width, ME.height, ME.angle, ME.scale, myName);
    }

    for (let cy = startCY; cy <= endCY; cy++) {
        for (let cx = startCX; cx <= endCX; cx++) {
            const dx = cx * WORLD.MAP.chunkSize - camX;
            const dy = cy * WORLD.MAP.chunkSize - camY;
            ctx.drawImage(WORLD.MAP.wallChunks[cy][cx], dx, dy, WORLD.MAP.chunkSize + 1, WORLD.MAP.chunkSize + 1);
        }
    }

    for (let cy = startCY; cy <= endCY; cy++) {
        for (let cx = startCX; cx <= endCX; cx++) {
            const dx = cx * WORLD.MAP.chunkSize - camX;
            const dy = cy * WORLD.MAP.chunkSize - camY;
            ctx.drawImage(WORLD.MAP.fgChunks[cy][cx], dx, dy, WORLD.MAP.chunkSize + 1, WORLD.MAP.chunkSize + 1);
        }
    }

    if (!inMainMenu && myId !== null) {
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
    const host = window.location.hostname;
    if (host === 'localhost' || host === '127.0.0.1' || host.endsWith('.run.app')) {
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
    if (ws && (ws.readyState === WebSocket.OPEN || ws.readyState === WebSocket.CONNECTING)) return;

    const wsUrl = await resolveWsUrl();
    startPingMonitor(wsUrl);
    const wsConnectStart = performance.now();
    ws = new WebSocket(wsUrl);

    ws.onopen = () => {
        hasConnected = true;
        updatePingDisplay(performance.now() - wsConnectStart);
        measurePingOnce();
        if (pendingJoinName !== null) {
            ws.send(JSON.stringify({ type: 'join', name: pendingJoinName }));
            pendingJoinName = null;
        }
    };

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
            ME.health = data.health ?? 255;
            ME.energy = data.energy ?? 255;
            ME.chats = [];
            updateStatsUI();
            updateLeaderboard([myName]);
            selectSlot(0);
            if (chatLog) {
                chatLog.textContent = '';
                if (Array.isArray(data.chatLog)) {
                    for (let i = 0; i < data.chatLog.length; i++) {
                        appendChatLog(data.chatLog[i].name, data.chatLog[i].text);
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
                appendChatLog(data.name, data.text);
            }
            return;
        }

        if (data.type === 'state') {
            const next = {};
            const lbEntries = [];
            for (const id in data.players) {
                const incoming = data.players[id];
                const numId = parseInt(id, 10);
                lbEntries.push({ id: numId, name: incoming.name });
                if (numId === myId) {
                    ME.serverX = incoming.x;
                    ME.serverY = incoming.y;
                    ME.vx = incoming.vx;
                    ME.vy = incoming.vy;
                    ME.scale = incoming.scale ?? 1;
                    if (incoming.health !== undefined) ME.health = incoming.health;
                    if (incoming.energy !== undefined) ME.energy = incoming.energy;
                    ME.chats = Array.isArray(incoming.chats) ? incoming.chats : [];
                    updateStatsUI();
                    continue;
                }
                const existing = serverPlayers[id];
                if (existing) {
                    const dx = incoming.x - existing.renderX;
                    const dy = incoming.y - existing.renderY;
                    const jumped = (dx * dx + dy * dy) > (120 * 120);
                    Object.assign(existing, incoming);
                    if (!Array.isArray(incoming.chats)) existing.chats = [];
                    if (jumped) {
                        existing.renderX = incoming.x;
                        existing.renderY = incoming.y;
                    }
                    next[id] = existing;
                } else {
                    next[id] = {
                        ...incoming,
                        chats: Array.isArray(incoming.chats) ? incoming.chats : [],
                        renderX: incoming.x,
                        renderY: incoming.y,
                        renderAngle: incoming.angle || 0
                    };
                }
            }
            lbEntries.sort((a, b) => a.id - b.id);
            updateLeaderboard(lbEntries.map(e => e.name));
            serverPlayers = next;
            return;
        }

        if (data.type === 'player_left') {
            delete serverPlayers[data.id];
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
}

window.addEventListener('resize', () => {
    resizeCanvas();
    updateUiScale();
});

if (window.visualViewport) {
    window.visualViewport.addEventListener('resize', updateUiScale);
}

function clearHeldInputs() {
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

    window.addEventListener('touchstart', enableTouchMode, { passive: true });

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

    for (let i = 0; i < inventorySlots.length; i++) {
        inventorySlots[i].addEventListener('click', () => {
            selectSlot(i);
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
                ws.send(JSON.stringify({ type: 'join', name: myName }));
            } else {
                pendingJoinName = myName;
                connectToServer();
            }
        });
    }
});
