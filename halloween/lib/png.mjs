// --- PNG ohne Zusatzpakete ---
// pixels[y][x] = [r, g, b, a], 8 Bit pro Kanal

import { deflateSync, inflateSync } from 'node:zlib';
import { crc32 } from './crc32.mjs';

const chunk = (type, data) => {
    const len = Buffer.alloc(4);
    len.writeUInt32BE(data.length);
    const body = Buffer.concat([Buffer.from(type, 'ascii'), data]);
    const crc = Buffer.alloc(4);
    crc.writeUInt32BE(crc32(body));
    return Buffer.concat([len, body, crc]);
};

export const canvas = (w, h, color = [0, 0, 0, 0]) =>
    Array.from({ length: h }, () => Array.from({ length: w }, () => [...color]));

export const pngBytes = pixels => {
    const h = pixels.length;
    const w = pixels[0].length;
    const raw = Buffer.concat(pixels.map(row => Buffer.from([0, ...row.flat()])));
    const ihdr = Buffer.alloc(13);
    ihdr.writeUInt32BE(w, 0);
    ihdr.writeUInt32BE(h, 4);
    ihdr.set([8, 6, 0, 0, 0], 8);
    return Buffer.concat([
        Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]),
        chunk('IHDR', ihdr),
        chunk('IDAT', deflateSync(raw, { level: 9 })),
        chunk('IEND', Buffer.alloc(0))
    ]);
};

// Vergrössert ein PNG aus pngBytes um einen ganzen Faktor (scharfe Pixel)
export const scalePng = (png, factor) => {
    const w = png.readUInt32BE(16);
    const h = png.readUInt32BE(20);
    const raw = inflateSync(png.subarray(41, 41 + png.readUInt32BE(33)));
    const at = (x, y) => [...raw.subarray(y * (w * 4 + 1) + 1 + x * 4, y * (w * 4 + 1) + 5 + x * 4)];
    const out = canvas(w * factor, h * factor);
    for (let y = 0; y < h * factor; y++) {
        for (let x = 0; x < w * factor; x++) out[y][x] = at(Math.floor(x / factor), Math.floor(y / factor));
    }
    return pngBytes(out);
};
