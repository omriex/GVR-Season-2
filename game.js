import express from 'express';
import http from 'http';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { WebSocketServer, WebSocket } from 'ws';

const CLOUDFLARED_WSS_URL = 'https://locale-isa-beats-willing.trycloudflare.com';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = Number(process.env.PORT) || 3000;
const PLAYER_SIZE = 49;
const PLAYER_RADIUS = PLAYER_SIZE / 2;
const MAX_PLAYERS = 5;
const MAX_PER_IP = 8;
const MAP_PATH = path.join(__dirname, 'map.json');

let MAP = loadMapFromDisk();

function createEmptyGrid(w, h) {
    return Array.from({ length: h }, () => Array(w).fill(null));
}

function createDefaultMap() {
    const mapW = 32;
    const mapH = 32;
    return {
        config: { tileSize: 64, mapW, mapH },
        mapData: {
            floor1: Array.from({ length: mapH }, () => Array.from({ length: mapW }, () => ({ tx: 14, ty: 59, r: 0 }))),
            floor2: createEmptyGrid(mapW, mapH),
            wall: createEmptyGrid(mapW, mapH),
            tree: createEmptyGrid(mapW, mapH)
        }
    };
}

function validateCell(cell) {
    if (cell === null || cell === undefined) return null;
    if (typeof cell !== 'object') return false;
    const tx = Number(cell.tx);
    const ty = Number(cell.ty);
    const r = cell.r === undefined ? 0 : Number(cell.r);
    if (!Number.isInteger(tx) || tx < 0 || tx > 500) return false;
    if (!Number.isInteger(ty) || ty < 0 || ty > 500) return false;
    if (!Number.isInteger(r) || (r !== 0 && r !== 90 && r !== 180 && r !== 270)) return false;
    return { tx, ty, r };
}

function validateLayerGrid(grid, mapW, mapH) {
    if (!Array.isArray(grid) || grid.length !== mapH) return null;
    const clean = new Array(mapH);
    for (let y = 0; y < mapH; y++) {
        const row = grid[y];
        if (!Array.isArray(row) || row.length !== mapW) return null;
        const cleanRow = new Array(mapW);
        for (let x = 0; x < mapW; x++) {
            const cell = validateCell(row[x]);
            if (cell === false) return null;
            cleanRow[x] = cell;
        }
        clean[y] = cleanRow;
    }
    return clean;
}

function validateMapData(raw) {
    if (!raw || typeof raw !== 'object') return null;
    if (!raw.config || typeof raw.config !== 'object') return null;
    if (!raw.mapData || typeof raw.mapData !== 'object') return null;

    const tileSize = Number(raw.config.tileSize);
    const mapW = Number(raw.config.mapW);
    const mapH = Number(raw.config.mapH);

    if (!Number.isInteger(tileSize) || tileSize < 16 || tileSize > 256) return null;
    if (!Number.isInteger(mapW) || mapW < 1 || mapW > 300) return null;
    if (!Number.isInteger(mapH) || mapH < 1 || mapH > 300) return null;

    const floor1 = validateLayerGrid(raw.mapData.floor1, mapW, mapH);
    const floor2 = validateLayerGrid(raw.mapData.floor2, mapW, mapH);
    const wall = validateLayerGrid(raw.mapData.wall || raw.mapData.walls, mapW, mapH);
    const tree = validateLayerGrid(raw.mapData.tree || raw.mapData.trees, mapW, mapH);

    if (!floor1 || !floor2 || !wall || !tree) return null;

    return {
        config: { tileSize, mapW, mapH },
        mapData: { floor1, floor2, wall, tree }
    };
}

let lastMapMtimeMs = 0;

function loadMapFromDisk() {
    try {
        const stat = fs.statSync(MAP_PATH);
        const raw = JSON.parse(fs.readFileSync(MAP_PATH, 'utf8'));
        const valid = validateMapData(raw);
        if (valid) {
            lastMapMtimeMs = stat.mtimeMs;
            return valid;
        }
    } catch (_) {}
    return createDefaultMap();
}

function resolvePlayerWalls(p, applyVelocity) {
    const wallGrid = MAP.mapData.wall;
    const tileSize = MAP.config.tileSize;
    const cols = MAP.config.mapW;
    const rows = MAP.config.mapH;
    const maxW = Math.max(0, cols * tileSize - p.width);
    const maxH = Math.max(0, rows * tileSize - p.height);
    const radius = (p.width * p.scale) / 2;

    if (wallGrid) {
        for (let iter = 0; iter < 3; iter++) {
            let cx = p.x + p.width / 2;
            let cy = p.y + p.height / 2;

            const left = Math.floor((cx - radius) / tileSize);
            const right = Math.floor((cx + radius) / tileSize);
            const top = Math.floor((cy - radius) / tileSize);
            const bottom = Math.floor((cy + radius) / tileSize);

            for (let r = top; r <= bottom; r++) {
                for (let c = left; c <= right; c++) {
                    if (c < 0 || c >= cols || r < 0 || r >= rows) continue;
                    if (!wallGrid[r] || !wallGrid[r][c]) continue;

                    const tileX = c * tileSize;
                    const tileY = r * tileSize;
                    const testX = cx < tileX ? tileX : (cx > tileX + tileSize ? tileX + tileSize : cx);
                    const testY = cy < tileY ? tileY : (cy > tileY + tileSize ? tileY + tileSize : cy);
                    const dX = cx - testX;
                    const dY = cy - testY;
                    const dist = Math.sqrt(dX * dX + dY * dY);

                    if (dist < radius) {
                        if (dist === 0) {
                            const lD = cx - tileX;
                            const rD = (tileX + tileSize) - cx;
                            const tD = cy - tileY;
                            const bD = (tileY + tileSize) - cy;
                            const mD = Math.min(lD, rD, tD, bD);
                            if (mD === lD) cx = tileX - radius;
                            else if (mD === rD) cx = tileX + tileSize + radius;
                            else if (mD === tD) cy = tileY - radius;
                            else cy = tileY + tileSize + radius;
                        } else {
                            const overlap = radius - dist;
                            const nx = dX / dist;
                            const ny = dY / dist;
                            cx += nx * overlap;
                            cy += ny * overlap;
                            if (applyVelocity) {
                                const dot = p.vx * nx + p.vy * ny;
                                if (dot < 0) {
                                    p.vx -= dot * nx;
                                    p.vy -= dot * ny;
                                }
                            }
                        }
                    }
                }
            }

            p.x = cx - p.width / 2;
            p.y = cy - p.height / 2;
        }
    }

    if (p.x < 0) {
        p.x = 0;
        if (applyVelocity && p.vx < 0) p.vx = 0;
    } else if (p.x > maxW) {
        p.x = maxW;
        if (applyVelocity && p.vx > 0) p.vx = 0;
    }

    if (p.y < 0) {
        p.y = 0;
        if (applyVelocity && p.vy < 0) p.vy = 0;
    } else if (p.y > maxH) {
        p.y = maxH;
        if (applyVelocity && p.vy > 0) p.vy = 0;
    }
}

function findSpawnPosition() {
    const centerX = (MAP.config.mapW * MAP.config.tileSize) / 2 - PLAYER_RADIUS;
    const centerY = (MAP.config.mapH * MAP.config.tileSize) / 2 - PLAYER_RADIUS;
    const dummy = { x: centerX, y: centerY, vx: 0, vy: 0, width: PLAYER_SIZE, height: PLAYER_SIZE, scale: 1 };
    resolvePlayerWalls(dummy, false);
    return { x: dummy.x, y: dummy.y };
}

function sanitizeName(raw) {
    if (typeof raw !== 'string') return 'Goodbot' + (Math.floor(Math.random() * 900) + 100);
    const cleaned = raw.replace(/[^\w \-\[\].!]/g, '').trim().slice(0, 16);
    return cleaned || ('Goodbot' + (Math.floor(Math.random() * 900) + 100));
}

function sanitizeChat(raw) {
    if (typeof raw !== 'string') return '';
    return raw.replace(/[\x00-\x1f\x7f]/g, ' ').replace(/\s+/g, ' ').trim().slice(0, 80);
}

function normalizeAngle(raw) {
    let a = Number(raw);
    if (!Number.isFinite(a)) return null;
    a = ((a + Math.PI) % (Math.PI * 2) + (Math.PI * 2)) % (Math.PI * 2) - Math.PI;
    return a;
}

function getClientIp(req) {
    const cf = req.headers['cf-connecting-ip'];
    if (typeof cf === 'string' && cf.length > 0) return cf.trim();
    return req.socket.remoteAddress || 'unknown';
}

function isStrictLocalRequest(req) {
    const addr = req.socket.remoteAddress || '';
    const isLoopback = addr === '127.0.0.1' || addr === '::1' || addr === '::ffff:127.0.0.1';
    const hasProxyHeaders = Boolean(
        req.headers['cf-connecting-ip'] ||
        req.headers['cf-ray'] ||
        req.headers['x-forwarded-for'] ||
        req.headers['x-real-ip']
    );
    return isLoopback && !hasProxyHeaders;
}

function detectIsMobileFromRequest(req) {
    const chMobile = req.headers['sec-ch-ua-mobile'];
    if (chMobile === '?1') return true;
    if (chMobile === '?0') return false;
    const ua = String(req.headers['user-agent'] || '');
    if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini|Mobile|Tablet/i.test(ua)) {
        return true;
    }
    return false;
}

const app = express();
app.disable('x-powered-by');
app.use(express.json({ limit: '5mb' }));

app.use((req, res, next) => {
    res.setHeader('X-Content-Type-Options', 'nosniff');
    const cleanPath = req.path.toLowerCase();
    if (
        cleanPath === '/server.js' ||
        cleanPath === '/package.json' ||
        cleanPath === '/package-lock.json' ||
        cleanPath === '/bun.lock' ||
        cleanPath.startsWith('/node_modules') ||
        cleanPath.startsWith('/.git') ||
        cleanPath.startsWith('/public')
    ) {
        return res.status(403).end();
    }
    next();
});

app.get('/config.json', (_req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Cache-Control', 'no-store');
    res.json({ wssUrl: CLOUDFLARED_WSS_URL });
});

app.get('/api/server-status', (_req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Cache-Control', 'no-store');
    res.json({
        servers: [
            {
                id: 'server-1',
                name: 'Server 1',
                playerCount: players.size,
                maxPlayers: MAX_PLAYERS
            }
        ]
    });
});

app.get('/api/device-mode', (req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Cache-Control', 'no-store');
    res.json({
        isMobile: detectIsMobileFromRequest(req)
    });
});

app.get('/map.json', (_req, res) => {
    res.setHeader('Cache-Control', 'no-store');
    res.json(MAP);
});

app.post('/api/map', (req, res) => {
    if (!isStrictLocalRequest(req)) {
        return res.status(403).json({ error: 'Local editor access only' });
    }
    const valid = validateMapData(req.body);
    if (!valid) {
        return res.status(400).json({ error: 'Invalid map format' });
    }
    const tmpPath = MAP_PATH + '.tmp';
    try {
        fs.writeFileSync(tmpPath, JSON.stringify(valid));
        fs.renameSync(tmpPath, MAP_PATH);
        try {
            lastMapMtimeMs = fs.statSync(MAP_PATH).mtimeMs;
        } catch (_) {}
        MAP = valid;
        const mapPayload = JSON.stringify({
            type: 'map_data',
            map: MAP,
            playerCount: players.size,
            maxPlayers: MAX_PLAYERS
        });
        for (const client of wss.clients) {
            if (client.readyState === WebSocket.OPEN) {
                client.send(mapPayload);
            }
        }
        return res.json({ ok: true });
    } catch (_) {
        try { fs.unlinkSync(tmpPath); } catch (_) {}
        return res.status(500).json({ error: 'Failed to save map.json' });
    }
});

function syncMapFromDisk() {
    try {
        const stat = fs.statSync(MAP_PATH);
        if (!stat || stat.mtimeMs <= 0 || stat.mtimeMs === lastMapMtimeMs) return;
        const raw = JSON.parse(fs.readFileSync(MAP_PATH, 'utf8'));
        const valid = validateMapData(raw);
        if (!valid) return;
        lastMapMtimeMs = stat.mtimeMs;
        MAP = valid;
        const mapPayload = JSON.stringify({
            type: 'map_data',
            map: MAP,
            playerCount: players.size,
            maxPlayers: MAX_PLAYERS
        });
        for (const client of wss.clients) {
            if (client.readyState === WebSocket.OPEN) {
                client.send(mapPayload);
            }
        }
    } catch (_) {}
}

setInterval(syncMapFromDisk, 1500);

app.get(['/', '/index.html'], (req, res) => {
    res.setHeader('Accept-CH', 'Sec-CH-UA-Mobile');
    const html = fs.readFileSync(path.join(__dirname, 'index.html'), 'utf8');
    const host = req.headers.host;
    if (!host) {
        return res.type('html').send(html);
    }
    const xfProto = req.headers['x-forwarded-proto'];
    const proto = typeof xfProto === 'string' && xfProto.length > 0 ? xfProto.split(',')[0].trim() : req.protocol;
    const baseUrl = `${proto}://${host}`;
    const rendered = html.replaceAll('https://goodbots.duckdns.org/assets/Goodbot.png', `${baseUrl}/assets/Goodbot.png`);
    res.type('html').send(rendered);
});

app.use(express.static(__dirname, {
    dotfiles: 'deny',
    index: 'index.html'
}));

const server = http.createServer(app);
const wss = new WebSocketServer({
    server,
    maxPayload: 4096
});

let nextPlayerId = 1;
const players = new Map();
const ipCounts = new Map();
const chatHistory = [];

function broadcast(payload, excludeId = null) {
    const raw = JSON.stringify(payload);
    for (const [id, p] of players) {
        if (id === excludeId) continue;
        if (p.ws.readyState === WebSocket.OPEN) {
            p.ws.send(raw);
        }
    }
}

function broadcastServerInfo() {
    const raw = JSON.stringify({
        type: 'server_info',
        serverId: 'server-1',
        playerCount: players.size,
        maxPlayers: MAX_PLAYERS
    });
    for (const client of wss.clients) {
        if (client.readyState === WebSocket.OPEN) {
            client.send(raw);
        }
    }
}

wss.on('connection', (ws, req) => {
    const ip = getClientIp(req);
    const currentIpCount = ipCounts.get(ip) || 0;

    if (currentIpCount >= MAX_PER_IP) {
        ws.close(4009, 'Server busy');
        return;
    }

    ipCounts.set(ip, currentIpCount + 1);
    ws.isAlive = true;
    ws.isMobile = detectIsMobileFromRequest(req);

    let player = null;
    let msgWindowStart = Date.now();
    let msgCount = 0;
    let badMsgCount = 0;

    ws.send(JSON.stringify({
        type: 'map_data',
        map: MAP,
        playerCount: players.size,
        maxPlayers: MAX_PLAYERS,
        isMobile: ws.isMobile
    }));

    ws.on('pong', () => {
        ws.isAlive = true;
    });

    ws.on('message', (raw) => {
        const now = Date.now();
        if (now - msgWindowStart >= 1000) {
            msgWindowStart = now;
            msgCount = 0;
        }
        msgCount++;
        if (msgCount > 240) {
            ws.close(4008, 'Rate limit exceeded');
            return;
        }
        if (msgCount > 120) return;

        let data;
        try {
            data = JSON.parse(raw.toString());
        } catch (_) {
            badMsgCount++;
            if (badMsgCount > 10) ws.close(4004, 'Malformed payload');
            return;
        }

        if (!data || typeof data !== 'object' || typeof data.type !== 'string') return;

        if (data.type === 'join') {
            if (player) return;
            if (players.size >= MAX_PLAYERS) {
                ws.send(JSON.stringify({
                    type: 'server_full',
                    message: `Server is full (${players.size}/${MAX_PLAYERS})`,
                    playerCount: players.size,
                    maxPlayers: MAX_PLAYERS
                }));
                return;
            }
            const id = nextPlayerId++;
            const spawn = findSpawnPosition();
            player = {
                id,
                ws,
                name: sanitizeName(data.name),
                x: spawn.x,
                y: spawn.y,
                vx: 0,
                vy: 0,
                angle: 0,
                scale: 1,
                bopTimer: 0,
                health: 255,
                energy: 255,
                regenDelay: 0,
                exhausted: false,
                chats: [],
                lastChatAt: 0,
                width: PLAYER_SIZE,
                height: PLAYER_SIZE,
                input: {
                    up: false,
                    down: false,
                    left: false,
                    right: false,
                    sprint: false
                }
            };
            players.set(id, player);

            ws.send(JSON.stringify({
                type: 'init',
                id: player.id,
                name: player.name,
                x: player.x,
                y: player.y,
                health: player.health,
                energy: player.energy,
                map: MAP,
                chatLog: chatHistory,
                playerCount: players.size,
                maxPlayers: MAX_PLAYERS,
                isMobile: ws.isMobile
            }));
            broadcastServerInfo();
            return;
        }

        if (!player) return;

        if (data.type === 'leave') {
            players.delete(player.id);
            broadcast({ type: 'player_left', id: player.id }, player.id);
            player = null;
            ws.send(JSON.stringify({
                type: 'left_server',
                playerCount: players.size,
                maxPlayers: MAX_PLAYERS
            }));
            broadcastServerInfo();
            return;
        }

        if (data.type === 'input') {
            player.input.up = data.up === true;
            player.input.down = data.down === true;
            player.input.left = data.left === true;
            player.input.right = data.right === true;
            player.input.sprint = data.sprint === true;

            if (data.angle !== undefined) {
                const nextAngle = normalizeAngle(data.angle);
                if (nextAngle !== null) {
                    player.angle = nextAngle;
                }
            }
            return;
        }

        if (data.type === 'chat') {
            if (player.lastChatAt && now - player.lastChatAt < 250) return;
            const text = sanitizeChat(data.text);
            if (!text) return;
            player.lastChatAt = now;
            const durationMs = 3500 + text.length * 75;
            player.chats.push({
                text,
                expiresAt: now + durationMs
            });
            while (player.chats.length > 2) {
                player.chats.shift();
            }
            chatHistory.push({ name: player.name, text });
            while (chatHistory.length > 50) {
                chatHistory.shift();
            }
            broadcast({ type: 'chat_log', name: player.name, text });
        }
    });

    ws.on('close', () => {
        const count = ipCounts.get(ip) || 1;
        if (count <= 1) ipCounts.delete(ip);
        else ipCounts.set(ip, count - 1);

        if (player) {
            players.delete(player.id);
            broadcast({ type: 'player_left', id: player.id }, player.id);
            player = null;
            broadcastServerInfo();
        }
    });
});

let lastPhysicsTime = performance.now();

function stepPhysics() {
    const now = performance.now();
    let dt = (now - lastPhysicsTime) / 1000;
    lastPhysicsTime = now;
    if (players.size === 0) return;
    if (dt > 0.05) dt = 0.05;
    if (dt <= 0 || isNaN(dt)) dt = 1 / 60;

    const friction = Math.pow(0.001, dt);
    const list = Array.from(players.values());

    for (let i = 0; i < list.length; i++) {
        const p = list[i];
        let inputX = 0;
        let inputY = 0;

        if (p.input.up) inputY -= 1;
        if (p.input.down) inputY += 1;
        if (p.input.left) inputX -= 1;
        if (p.input.right) inputX += 1;

        const isMoving = inputX !== 0 || inputY !== 0;
        if (isMoving) {
            const len = Math.sqrt(inputX * inputX + inputY * inputY);
            inputX /= len;
            inputY /= len;
        }

        if (p.energy <= 0) p.exhausted = true;
        if (!p.input.sprint || p.energy >= 15) p.exhausted = false;

        const intentSprint = p.input.sprint && isMoving && p.energy > 0 && !p.exhausted;
        if (intentSprint) {
            p.energy = Math.max(0, p.energy - 21.24 * dt);
            p.regenDelay = 5;
            if (p.energy <= 0) p.exhausted = true;
        } else {
            if (p.regenDelay > 0) {
                p.regenDelay = Math.max(0, p.regenDelay - dt);
            } else {
                p.energy = Math.min(255, p.energy + 30 * dt);
            }
        }

        p.bopTimer = intentSprint ? p.bopTimer + dt : 0;
        p.scale = 1 + (p.bopTimer > 0 ? Math.sin(p.bopTimer * 15) * 0.05 : 0);

        const accel = intentSprint ? 1866 : 1493;
        p.vx += inputX * accel * dt;
        p.vy += inputY * accel * dt;
        p.vx *= friction;
        p.vy *= friction;

        if (Math.abs(p.vx) < 0.05) p.vx = 0;
        if (Math.abs(p.vy) < 0.05) p.vy = 0;

        p.x += p.vx * dt;
        p.y += p.vy * dt;

        resolvePlayerWalls(p, true);
    }

    for (let iter = 0; iter < 2; iter++) {
        for (let i = 0; i < list.length; i++) {
            const a = list[i];
            for (let j = i + 1; j < list.length; j++) {
                const b = list[j];
                const minDist = (a.width + b.width) / 2;
                const acx = a.x + a.width / 2;
                const acy = a.y + a.height / 2;
                const bcx = b.x + b.width / 2;
                const bcy = b.y + b.height / 2;
                const dX = acx - bcx;
                const dY = acy - bcy;
                const dist = Math.sqrt(dX * dX + dY * dY);

                if (dist < minDist) {
                    const nx = dist > 0 ? dX / dist : 1;
                    const ny = dist > 0 ? dY / dist : 0;
                    const overlap = minDist - dist;
                    a.x += nx * (overlap * 0.5);
                    a.y += ny * (overlap * 0.5);
                    b.x -= nx * (overlap * 0.5);
                    b.y -= ny * (overlap * 0.5);
                    resolvePlayerWalls(a, false);
                    resolvePlayerWalls(b, false);
                }
            }
        }
    }
}

setInterval(stepPhysics, 1000 / 60);

setInterval(() => {
    for (const client of wss.clients) {
        if (!client.isAlive) {
            client.terminate();
            continue;
        }
        client.isAlive = false;
        client.ping();
    }
}, 15000);

setInterval(() => {
    if (players.size === 0) return;
    const nowMs = Date.now();
    const snapshot = {};
    for (const [id, p] of players) {
        if (p.chats.length > 0) {
            p.chats = p.chats.filter(c => c.expiresAt > nowMs);
        }
        const entry = {
            id: p.id,
            name: p.name,
            x: Math.round(p.x * 100) / 100,
            y: Math.round(p.y * 100) / 100,
            vx: Math.round(p.vx * 100) / 100,
            vy: Math.round(p.vy * 100) / 100,
            angle: Math.round(p.angle * 1000) / 1000,
            scale: Math.round(p.scale * 1000) / 1000,
            health: Math.round(p.health * 100) / 100,
            energy: Math.round(p.energy * 100) / 100,
            width: p.width,
            height: p.height
        };
        if (p.chats.length > 0) {
            entry.chats = p.chats.map(c => c.text);
        }
        snapshot[id] = entry;
    }
    const payload = JSON.stringify({ type: 'state', players: snapshot });
    for (const [, p] of players) {
        if (p.ws.readyState === WebSocket.OPEN) {
            p.ws.send(payload);
        }
    }
}, 33);

server.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
});

let shuttingDown = false;

function handleShutdown() {
    if (shuttingDown) return;
    shuttingDown = true;
    const payload = JSON.stringify({ type: 'shutdown' });
    for (const client of wss.clients) {
        if (client.readyState === WebSocket.OPEN) {
            try {
                client.send(payload);
            } catch (_) {}
        }
    }
    setTimeout(() => {
        for (const client of wss.clients) {
            try { client.close(1001); } catch (_) {}
        }
        try { wss.close(); } catch (_) {}
        try { server.close(); } catch (_) {}
        process.exit(0);
    }, 80);
}

process.on('SIGINT', handleShutdown);
process.on('SIGTERM', handleShutdown);
process.on('SIGBREAK', handleShutdown);
process.on('SIGHUP', handleShutdown);
