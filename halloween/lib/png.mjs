// --- PNG ohne Zusatzpakete ---
// pixels[y][x] = [r, g, b, a], 8 Bit pro Kanal

import { deflateSync } from 'node:zlib';
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
