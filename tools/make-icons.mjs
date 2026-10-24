// --- App-Icons erzeugen ---
// Gelbe, leicht gedrehte Kachel mit Grasblock auf Navy (wie die Kachel in der Sidebar).
// Aufruf: node tools/make-icons.mjs  → schreibt images/icons/*.png und icon.svg

import { writeFileSync, mkdirSync } from 'node:fs';
import { deflateSync } from 'node:zlib';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const OUT = join(ROOT, 'images', 'icons');

const NAVY = [13, 26, 45];
const YELLOW = [255, 212, 59];
const YELLOW_SHADE = [224, 168, 0];

// Grasblock 8x8, gleiche Farben wie in index.html
const PALETTE = { g: [95, 168, 58], G: [124, 194, 78], d: [139, 90, 43], e: [107, 68, 32] };
const BLOCK = [
    'gggggGgg',
    'gGgggggg',
    'gggggggg',
    'ggdddgdd',
    'dddddddd',
    'dddedddd',
    'ddddddeD',
    'dddddddd'
].map(row => row.replace('D', 'e'));

// --- PNG ---
const CRC_TABLE = Array.from({ length: 256 }, (_, n) => {
    let c = n;
    for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    return c >>> 0;
});

const crc32 = buf => {
    let c = 0xffffffff;
    for (const byte of buf) c = CRC_TABLE[(c ^ byte) & 0xff] ^ (c >>> 8);
    return (c ^ 0xffffffff) >>> 0;
};

const chunk = (type, data) => {
    const len = Buffer.alloc(4);
    len.writeUInt32BE(data.length);
    const body = Buffer.concat([Buffer.from(type, 'ascii'), data]);
    const crc = Buffer.alloc(4);
    crc.writeUInt32BE(crc32(body));
    return Buffer.concat([len, body, crc]);
};

const encodePng = (size, pixels) => {
    const header = Buffer.alloc(13);
    header.writeUInt32BE(size, 0);
    header.writeUInt32BE(size, 4);
    header[8] = 8;
    header[9] = 2;
    const raw = Buffer.alloc(size * (size * 3 + 1));
    for (let y = 0; y < size; y++) {
        raw[y * (size * 3 + 1)] = 0;
        pixels.copy(raw, y * (size * 3 + 1) + 1, y * size * 3, (y + 1) * size * 3);
    }
    return Buffer.concat([
        Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]),
        chunk('IHDR', header),
        chunk('IDAT', deflateSync(raw)),
        chunk('IEND', Buffer.alloc(0))
    ]);
};

// --- Zeichnen ---
const ANGLE = -4 * Math.PI / 180;

const insideRoundedSquare = (u, v, half, radius) => {
    const dx = Math.max(Math.abs(u) - (half - radius), 0);
    const dy = Math.max(Math.abs(v) - (half - radius), 0);
    return dx * dx + dy * dy <= radius * radius;
};

// Farbe an einer Stelle (x, y in 0..1)
const colorAt = (x, y, half) => {
    const cx = 0.5;
    const cy = 0.48;
    const shade = 0.03;
    const radius = half * 0.5;
    const toLocal = (px, py) => {
        const dx = px - cx;
        const dy = py - cy;
        return [dx * Math.cos(-ANGLE) - dy * Math.sin(-ANGLE), dx * Math.sin(-ANGLE) + dy * Math.cos(-ANGLE)];
    };

    const [u, v] = toLocal(x, y);
    if (insideRoundedSquare(u, v, half, radius)) {
        const g = half * 0.56;
        if (Math.abs(u) < g && Math.abs(v) < g) {
            const col = Math.min(7, Math.floor((u + g) / (2 * g) * 8));
            const row = Math.min(7, Math.floor((v + g) / (2 * g) * 8));
            return PALETTE[BLOCK[row][col]];
        }
        return YELLOW;
    }
    const [su, sv] = toLocal(x, y - shade);
    if (insideRoundedSquare(su, sv, half, radius)) return YELLOW_SHADE;
    return NAVY;
};

// 4x4 Unterabtastung pro Pixel für weiche Kanten
const render = (size, half) => {
    const pixels = Buffer.alloc(size * size * 3);
    const samples = 4;
    for (let y = 0; y < size; y++) {
        for (let x = 0; x < size; x++) {
            const sum = [0, 0, 0];
            for (let sy = 0; sy < samples; sy++) {
                for (let sx = 0; sx < samples; sx++) {
                    const c = colorAt((x + (sx + 0.5) / samples) / size, (y + (sy + 0.5) / samples) / size, half);
                    sum[0] += c[0];
                    sum[1] += c[1];
                    sum[2] += c[2];
                }
            }
            const i = (y * size + x) * 3;
            for (let k = 0; k < 3; k++) pixels[i + k] = Math.round(sum[k] / (samples * samples));
        }
    }
    return encodePng(size, pixels);
};

mkdirSync(OUT, { recursive: true });

const ICONS = [
    ['icon-32.png', 32, 0.42],
    ['apple-touch-icon.png', 180, 0.34],
    ['icon-192.png', 192, 0.34],
    ['icon-512.png', 512, 0.34],
    ['icon-maskable-512.png', 512, 0.26]
];

for (const [name, size, half] of ICONS) {
    writeFileSync(join(OUT, name), render(size, half));
    console.log(`${name} (${size}px)`);
}

// SVG-Variante für Browser-Tabs
const rects = BLOCK.flatMap((row, y) => [...row].map((ch, x) => {
    const [r, g, b] = PALETTE[ch];
    return `<rect x="${x}" y="${y}" width="1.06" height="1.06" fill="rgb(${r},${g},${b})"/>`;
})).join('');

writeFileSync(join(OUT, 'icon.svg'), `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">
<rect width="64" height="64" rx="14" fill="#0d1a2d"/>
<g transform="rotate(-4 32 31)">
<rect x="5" y="7" width="54" height="54" rx="13" fill="#e0a800"/>
<rect x="5" y="4" width="54" height="54" rx="13" fill="#ffd43b"/>
<g transform="translate(17 16) scale(3.75)">${rects}</g>
</g>
</svg>
`);
console.log('icon.svg');
