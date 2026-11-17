const CLOUDFLARED_WSS_URL = '';

document.addEventListener('contextmenu', e => e.preventDefault());

const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d', { alpha: false });

const mainMenu = document.getElementById('main-menu');
const gameUI = document.getElementById('game-ui');
const nameInput = document.getElementById('player-name-input');
const playBtn = document.getElementById('play-btn');
const healthFill = document.getElementById('health-fill');
const energyFill = document.getElementById('energy-fill');

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
    width: 49,
    height: 49,
    vx: 0,
    vy: 0,
    angle: 0,
    scale: 1,
    bopTimer: 0,
    health: 255,
    energy: 255
};

let ws = null;
let myId = null;
let myName = '';
let myTeleportId = 0;
let inMainMenu = true;
let serverPlayers = {};
let pendingJoinName = null;
let lastRenderedHealth = -1;
let lastRenderedEnergy = -1;

let menuCamX = null;
let menuCamY = null;
let menuCamVX = 60;
let menuCamVY = 45;

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
    goodbotImg.src = 'assets/Goodbot.png';
}

function updateStatsUI() {
    const roundedHealth = Math.round(ME.health);
    const roundedEnergy = Math.round(ME.energy);

    if (roundedHealth !== lastRenderedHealth && healthFill) {
        healthFill.style.width = `${(roundedHealth / 255) * 100}%`;
        lastRenderedHealth = roundedHealth;
    }

    if (roundedEnergy !== lastRenderedEnergy && energyFill) {
        energyFill.style.width = `${(roundedEnergy / 255) * 100}%`;
        lastRenderedEnergy = roundedEnergy;
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

function resolveCircleCollisions() {
    const wallGrid = WORLD.MAP.mapData && WORLD.MAP.mapData.wall;
    if (!wallGrid) return;

    const scale = ME.scale;
    const radius = (ME.width * scale) / 2;
    const tileSize = WORLD.MAP.tileSize;

    for (let iter = 0; iter < 3; iter++) {
        let pX = ME.x + ME.width / 2;
        let pY = ME.y + ME.height / 2;

        const left = Math.floor((pX - radius) / tileSize);
        const right = Math.floor((pX + radius) / tileSize);
        const top = Math.floor((pY - radius) / tileSize);
        const bottom = Math.floor((pY + radius) / tileSize);

        for (let r = top; r <= bottom; r++) {
            for (let c = left; c <= right; c++) {
                if (c < 0 || c >= WORLD.MAP.columns || r < 0 || r >= WORLD.MAP.rows) continue;
                if (!wallGrid[r] || !wallGrid[r][c]) continue;

                const tileX = c * tileSize;
                const tileY = r * tileSize;

                const testX = pX < tileX ? tileX : (pX > tileX + tileSize ? tileX + tileSize : pX);
                const testY = pY < tileY ? tileY : (pY > tileY + tileSize ? tileY + tileSize : pY);

                const dX = pX - testX;
                const dY = pY - testY;
                const dist = Math.sqrt(dX * dX + dY * dY);

                if (dist < radius) {
                    if (dist === 0) {
                        const lD = pX - tileX;
                        const rD = (tileX + tileSize) - pX;
                        const tD = pY - tileY;
                        const bD = (tileY + tileSize) - pY;
                        const mD = Math.min(lD, rD, tD, bD);
                        if (mD === lD) pX = tileX - radius;
                        else if (mD === rD) pX = tileX + tileSize + radius;
                        else if (mD === tD) pY = tileY - radius;
                        else pY = tileY + tileSize + radius;
                    } else {
                        const overlap = radius - dist;
                        const nx = dX / dist;
                        const ny = dY / dist;
                        pX += nx * overlap;
                        pY += ny * overlap;
                        const dot = ME.vx * nx + ME.vy * ny;
                        if (dot < 0) {
                            ME.vx -= dot * nx;
                            ME.vy -= dot * ny;
                        }
                    }
                }
            }
        }

        ME.x = pX - ME.width / 2;
        ME.y = pY - ME.height / 2;
    }
}

function resolveCircleVsWalls(p) {
    const wallGrid = WORLD.MAP.mapData && WORLD.MAP.mapData.wall;
    if (!wallGrid) return;

    const radius = p.width / 2;
    const tileSize = WORLD.MAP.tileSize;

    for (let iter = 0; iter < 2; iter++) {
        let pX = p.x + p.width / 2;
        let pY = p.y + p.height / 2;

        const left = Math.floor((pX - radius) / tileSize);
        const right = Math.floor((pX + radius) / tileSize);
        const top = Math.floor((pY - radius) / tileSize);
        const bottom = Math.floor((pY + radius) / tileSize);

        for (let r = top; r <= bottom; r++) {
            for (let c = left; c <= right; c++) {
                if (c < 0 || c >= WORLD.MAP.columns || r < 0 || r >= WORLD.MAP.rows) continue;
                if (!wallGrid[r] || !wallGrid[r][c]) continue;

                const tileX = c * tileSize;
                const tileY = r * tileSize;

                const testX = pX < tileX ? tileX : (pX > tileX + tileSize ? tileX + tileSize : pX);
                const testY = pY < tileY ? tileY : (pY > tileY + tileSize ? tileY + tileSize : pY);

                const dX = pX - testX;
                const dY = pY - testY;
                const dist = Math.sqrt(dX * dX + dY * dY);

                if (dist < radius) {
                    if (dist === 0) {
                        const lD = pX - tileX;
                        const rD = (tileX + tileSize) - pX;
                        const tD = pY - tileY;
                        const bD = (tileY + tileSize) - pY;
                        const mD = Math.min(lD, rD, tD, bD);
                        if (mD === lD) pX = tileX - radius;
                        else if (mD === rD) pX = tileX + tileSize + radius;
                        else if (mD === tD) pY = tileY - radius;
                        else pY = tileY + tileSize + radius;
                    } else {
                        const overlap = radius - dist;
                        pX += (dX / dist) * overlap;
                        pY += (dY / dist) * overlap;
                    }
                }
            }
        }

        p.x = pX - p.width / 2;
        p.y = pY - p.height / 2;
    }
}

function resolvePlayerCollisionsLocal() {
    const meR = ME.width / 2;
    const mecx = ME.x + ME.width / 2;
    const mecy = ME.y + ME.height / 2;

    for (const id in serverPlayers) {
        const p = serverPlayers[id];
        const pR = p.width / 2;
        const minDist = meR + pR;

        const pcx = (p.renderX ?? p.x) + p.width / 2;
        const pcy = (p.renderY ?? p.y) + p.height / 2;

        const dX = mecx - pcx;
        const dY = mecy - pcy;
        const dist = Math.sqrt(dX * dX + dY * dY);

        if (dist > 0 && dist < minDist) {
            const overlap = minDist - dist;
            const nx = dX / dist;
            const ny = dY / dist;

            ME.x += nx * (overlap * 0.25);
            ME.y += ny * (overlap * 0.25);

            p.x -= nx * (overlap * 0.75);
            p.y -= ny * (overlap * 0.75);

            resolveCircleVsWalls(p);

            if (p.renderX !== undefined) {
                p.renderX = p.x;
                p.renderY = p.y;
            }

            const dot = ME.vx * nx + ME.vy * ny;
            if (dot < 0) {
                ME.vx -= dot * nx * 0.25;
                ME.vy -= dot * ny * 0.25;
            }
        }
    }

    resolveCircleCollisions();
}

let lastSentX = -1;
let lastSentY = -1;
let lastSentAngle = -1;
let lastSentTime = 0;

function sendPositionUpdate() {
    if (!myId || !ws || ws.readyState !== WebSocket.OPEN) return;
    const now = performance.now();
    const dt = now - lastSentTime;
    const moved = Math.abs(ME.x - lastSentX) > 0.05 || Math.abs(ME.y - lastSentY) > 0.05 || Math.abs(ME.angle - lastSentAngle) > 0.02;
    if (!moved && dt < 200) return;
    if (dt < 25) return;

    lastSentTime = now;
    lastSentX = ME.x;
    lastSentY = ME.y;
    lastSentAngle = ME.angle;

    ws.send(JSON.stringify({
        type: 'position_update',
        x: ME.x,
        y: ME.y,
        vx: ME.vx,
        vy: ME.vy,
        angle: ME.angle,
        scale: ME.scale,
        teleportId: myTeleportId,
        clientTimestamp: Date.now()
    }));
}

function update(dt) {
    let inputX = 0;
    let inputY = 0;

    if (WORLD.INPUTS.keys.w || WORLD.INPUTS.keys.arrowup) inputY -= 1;
    if (WORLD.INPUTS.keys.s || WORLD.INPUTS.keys.arrowdown) inputY += 1;
    if (WORLD.INPUTS.keys.a || WORLD.INPUTS.keys.arrowleft) inputX -= 1;
    if (WORLD.INPUTS.keys.d || WORLD.INPUTS.keys.arrowright) inputX += 1;

    const isMoving = inputX !== 0 || inputY !== 0;
    if (isMoving) {
        const len = Math.sqrt(inputX * inputX + inputY * inputY);
        inputX /= len;
        inputY /= len;
    }

    const intentSprint = WORLD.INPUTS.keys.shift && isMoving && ME.energy > 0;
    if (intentSprint) {
        ME.energy = Math.max(0, ME.energy - 21.24 * dt);
    } else {
        ME.energy = Math.min(255, ME.energy + 30 * dt);
    }
    updateStatsUI();

    ME.bopTimer = intentSprint ? ME.bopTimer + dt : 0;
    ME.scale = 1 + (ME.bopTimer > 0 ? Math.sin(ME.bopTimer * 15) * 0.05 : 0);

    const friction = Math.pow(0.001, dt);
    const accel = intentSprint ? 1866 : 1493;

    ME.vx += inputX * accel * dt;
    ME.vy += inputY * accel * dt;
    ME.vx *= friction;
    ME.vy *= friction;
    ME.x += ME.vx * dt;
    ME.y += ME.vy * dt;

    for (let i = 0; i < 3; i++) resolveCircleCollisions();
    for (let i = 0; i < 2; i++) resolvePlayerCollisionsLocal();

    const maxX = Math.max(0, WORLD.MAP.columns * WORLD.MAP.tileSize - ME.width);
    const maxY = Math.max(0, WORLD.MAP.rows * WORLD.MAP.tileSize - ME.height);
    if (ME.x < 0) ME.x = 0;
    if (ME.y < 0) ME.y = 0;
    if (ME.x > maxX) ME.x = maxX;
    if (ME.y > maxY) ME.y = maxY;

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

        p.x += (p.vx || 0) * dt;
        p.y += (p.vy || 0) * dt;

        const lerpF = 1 - Math.exp(-dt * 18);
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

    sendPositionUpdate();
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
        ctx.lineJoin = 'round';
        ctx.lineWidth = 3;
        ctx.strokeStyle = 'rgba(0,0,0,0.85)';
        ctx.font = '15px Viga, sans-serif';
        ctx.fillStyle = '#ffffff';
        ctx.strokeText(label, x, y - sH / 2 - 10);
        ctx.fillText(label, x, y - sH / 2 - 10);
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

async function resolveWsUrl() {
    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
        const portPart = window.location.port ? ':' + window.location.port : '';
        return 'ws://' + window.location.hostname + portPart;
    }
    if (CLOUDFLARED_WSS_URL) return CLOUDFLARED_WSS_URL;
    try {
        const res = await fetch('config.json', { cache: 'no-store' });
        if (res.ok) {
            const cfg = await res.json();
            if (cfg && cfg.wssUrl) return cfg.wssUrl;
        }
    } catch (_) {}
    const proto = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    return proto + '//' + window.location.host;
}

async function connectToServer() {
    if (ws && (ws.readyState === WebSocket.OPEN || ws.readyState === WebSocket.CONNECTING)) return;

    const wsUrl = await resolveWsUrl();
    ws = new WebSocket(wsUrl);

    ws.onopen = () => {
        if (!inMainMenu && pendingJoinName !== null) {
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

        if (data.type === 'map_data') {
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
            myId = data.id;
            myName = data.name;
            myTeleportId = data.teleportId || 0;
            inMainMenu = false;

            applyMapPayload(data.map);
            preRenderMap();

            ME.x = data.x;
            ME.y = data.y;
            ME.vx = 0;
            ME.vy = 0;
            ME.health = 255;
            ME.energy = 255;
            updateStatsUI();

            WORLD.CAMERA.x = ME.x + ME.width / 2 - WORLD.CAMERA.width / 2;
            WORLD.CAMERA.y = ME.y + ME.height / 2 - WORLD.CAMERA.height / 2;

            WORLD.SYSTEM.lastTime = performance.now();
            WORLD.SYSTEM.isReady = true;
            if (!WORLD.SYSTEM._gameLoopRunning) {
                WORLD.SYSTEM._gameLoopRunning = true;
                requestAnimationFrame(gameLoop);
            }
            return;
        }

        if (data.type === 'state') {
            const next = {};
            for (const id in data.players) {
                if (parseInt(id, 10) === myId) continue;
                const incoming = data.players[id];
                const existing = serverPlayers[id];
                if (existing) {
                    const dx = incoming.x - existing.renderX;
                    const dy = incoming.y - existing.renderY;
                    const jumped = (dx * dx + dy * dy) > (120 * 120);
                    Object.assign(existing, incoming);
                    if (jumped) {
                        existing.renderX = incoming.x;
                        existing.renderY = incoming.y;
                    }
                    next[id] = existing;
                } else {
                    next[id] = {
                        ...incoming,
                        renderX: incoming.x,
                        renderY: incoming.y,
                        renderAngle: incoming.angle || 0
                    };
                }
            }
            serverPlayers = next;
            return;
        }

        if (data.type === 'correct' || data.type === 'teleport') {
            ME.x = data.x;
            ME.y = data.y;
            ME.vx = 0;
            ME.vy = 0;
            if (data.teleportId !== undefined) myTeleportId = data.teleportId;
            if (data.type === 'teleport') WORLD.CAMERA.x = null;
            return;
        }

        if (data.type === 'player_left') {
            delete serverPlayers[data.id];
        }
    };

    ws.onclose = () => {
        ws = null;
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

window.addEventListener('resize', resizeCanvas);

window.addEventListener('keydown', e => {
    const key = e.key.toLowerCase();
    if (e.key === 'Enter' && inMainMenu) {
        if (playBtn) playBtn.click();
        return;
    }
    if (document.activeElement && (document.activeElement.tagName === 'INPUT' || document.activeElement.tagName === 'TEXTAREA')) return;
    if (Object.prototype.hasOwnProperty.call(WORLD.INPUTS.keys, key)) {
        WORLD.INPUTS.keys[key] = true;
    }
});

window.addEventListener('keyup', e => {
    const key = e.key.toLowerCase();
    if (Object.prototype.hasOwnProperty.call(WORLD.INPUTS.keys, key)) {
        WORLD.INPUTS.keys[key] = false;
    }
});

window.addEventListener('mousemove', e => {
    WORLD.INPUTS.mouseX = e.clientX;
    WORLD.INPUTS.mouseY = e.clientY;
});

window.addEventListener('blur', () => {
    for (const k in WORLD.INPUTS.keys) WORLD.INPUTS.keys[k] = false;
});

window.addEventListener('DOMContentLoaded', () => {
    const savedName = localStorage.getItem('playerName');
    if (savedName && nameInput) nameInput.value = savedName;

    resizeCanvas();
    loadAssets();
    connectToServer();

    if (playBtn) {
        playBtn.addEventListener('click', () => {
            if (!inMainMenu) return;
            const raw = nameInput ? nameInput.value.trim() : '';
            myName = raw || ('Goodbot' + (Math.floor(Math.random() * 900) + 100));
            localStorage.setItem('playerName', myName);
            inMainMenu = false;
            WORLD.CAMERA.x = null;
            WORLD.CAMERA.y = null;

            if (mainMenu) mainMenu.classList.add('slide-up');
            if (gameUI) {
                gameUI.style.display = 'block';
                setTimeout(() => { gameUI.style.opacity = '1'; }, 50);
            }
            setTimeout(() => {
                if (mainMenu) mainMenu.style.display = 'none';
            }, 600);

            if (ws && ws.readyState === WebSocket.OPEN) {
                ws.send(JSON.stringify({ type: 'join', name: myName }));
            } else {
                pendingJoinName = myName;
                connectToServer();
            }
        });
    }
});
