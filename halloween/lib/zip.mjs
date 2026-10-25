// --- ZIP ohne Zusatzpakete ---
// Einträge sortiert, feste Zeit (2026-10-25 00:00), damit gleiche Inhalte die gleiche SHA-1 ergeben.

import { deflateRawSync } from 'node:zlib';
import { createHash } from 'node:crypto';
import { crc32 } from './crc32.mjs';

const DOS_TIME = 0;
const DOS_DATE = ((2026 - 1980) << 9) | (10 << 5) | 25;

export const sha1 = buf => createHash('sha1').update(buf).digest('hex');

export const zipBytes = files => {
    const locals = [];
    const centrals = [];
    let offset = 0;
    for (const path of Object.keys(files).sort()) {
        const data = Buffer.isBuffer(files[path]) ? files[path] : Buffer.from(files[path], 'utf8');
        const packed = deflateRawSync(data, { level: 9 });
        const name = Buffer.from(path, 'utf8');
        const crc = crc32(data);

        const local = Buffer.alloc(30);
        local.writeUInt32LE(0x04034b50, 0);
        local.writeUInt16LE(20, 4);
        local.writeUInt16LE(0x0800, 6);
        local.writeUInt16LE(8, 8);
        local.writeUInt16LE(DOS_TIME, 10);
        local.writeUInt16LE(DOS_DATE, 12);
        local.writeUInt32LE(crc, 14);
        local.writeUInt32LE(packed.length, 18);
        local.writeUInt32LE(data.length, 22);
        local.writeUInt16LE(name.length, 26);
        locals.push(local, name, packed);

        const central = Buffer.alloc(46);
        central.writeUInt32LE(0x02014b50, 0);
        central.writeUInt16LE(20, 4);
        central.writeUInt16LE(20, 6);
        central.writeUInt16LE(0x0800, 8);
        central.writeUInt16LE(8, 10);
        central.writeUInt16LE(DOS_TIME, 12);
        central.writeUInt16LE(DOS_DATE, 14);
        central.writeUInt32LE(crc, 16);
        central.writeUInt32LE(packed.length, 20);
        central.writeUInt32LE(data.length, 24);
        central.writeUInt16LE(name.length, 28);
        central.writeUInt32LE(offset, 42);
        centrals.push(central, name);

        offset += local.length + name.length + packed.length;
    }
    const dir = Buffer.concat(centrals);
    const count = Object.keys(files).length;
    const end = Buffer.alloc(22);
    end.writeUInt32LE(0x06054b50, 0);
    end.writeUInt16LE(count, 8);
    end.writeUInt16LE(count, 10);
    end.writeUInt32LE(dir.length, 12);
    end.writeUInt32LE(offset, 16);
    return Buffer.concat([...locals, dir, end]);
};
