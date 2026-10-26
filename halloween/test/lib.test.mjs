import { test } from 'node:test';
import assert from 'node:assert/strict';
import { inflateRawSync } from 'node:zlib';
import { canvas, pngBytes } from '../lib/png.mjs';
import { zipBytes, sha1 } from '../lib/zip.mjs';

test('pngBytes schreibt PNG mit Breite und Höhe', () => {
    const png = pngBytes(canvas(2, 3, [255, 0, 0, 255]));
    assert.deepEqual([...png.subarray(0, 8)], [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);
    assert.equal(png.toString('ascii', 12, 16), 'IHDR');
    assert.equal(png.readUInt32BE(16), 2);
    assert.equal(png.readUInt32BE(20), 3);
});

test('zipBytes ist reproduzierbar', () => {
    const files = { 'a.txt': 'hi', 'b/c.json': '{}' };
    assert.equal(sha1(zipBytes(files)), sha1(zipBytes(files)));
});

test('zipBytes hat Verzeichnis mit allen Einträgen', () => {
    const zip = zipBytes({ 'a.txt': 'hi', 'b/c.json': '{}' });
    const end = zip.lastIndexOf(Buffer.from([0x50, 0x4b, 0x05, 0x06]));
    assert.ok(end > 0);
    assert.equal(zip.readUInt16LE(end + 10), 2);
});

test('zipBytes lässt sich wieder entpacken', () => {
    const zip = zipBytes({ 'a.txt': 'hi' });
    assert.equal(zip.readUInt32LE(0), 0x04034b50);
    const size = zip.readUInt32LE(18);
    const nameLen = zip.readUInt16LE(26);
    const extraLen = zip.readUInt16LE(28);
    const name = zip.toString('utf8', 30, 30 + nameLen);
    const data = zip.subarray(30 + nameLen + extraLen, 30 + nameLen + extraLen + size);
    assert.equal(name, 'a.txt');
    assert.equal(inflateRawSync(data).toString(), 'hi');
});
