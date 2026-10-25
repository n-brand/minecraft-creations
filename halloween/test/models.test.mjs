import { test } from 'node:test';
import assert from 'node:assert/strict';
import { inflateSync } from 'node:zlib';
import { SET } from '../set.mjs';
import { buildAssets } from '../models.mjs';

const assets = buildAssets();
const ANGLES = [-45, -22.5, 0, 22.5, 45];

// PNG lesen (nur für eigene, ungefilterte PNGs aus pngBytes)
const readPng = png => {
    const w = png.readUInt32BE(16);
    const h = png.readUInt32BE(20);
    const idat = png.subarray(41, 41 + png.readUInt32BE(33));
    const raw = inflateSync(idat);
    return { w, h, alpha: (x, y) => raw[y * (w * 4 + 1) + 1 + x * 4 + 3] };
};

test('SET hat die drei Teufels-Items mit Namen', () => {
    assert.deepEqual(SET.map(entry => entry.item), ['leather_helmet', 'elytra', 'trident']);
    for (const entry of SET) assert.ok(entry.names.length > 0);
    assert.deepEqual(SET[0].names, ['Teufelshörner', 'Teufelshoerner']);
    assert.deepEqual(SET[1].names, ['Teufelsflügel', 'Teufelsfluegel']);
    assert.deepEqual(SET[2].names, ['Teufelsdreizack']);
});

test('3D-Modelle halten die Java-Grenzen ein', () => {
    for (const [key, model] of Object.entries(assets.models)) {
        if (!model.elements) continue;
        assert.ok(model.elements.length > 0, key);
        for (const el of model.elements) {
            for (const v of [...el.from, ...el.to]) assert.ok(v >= -16 && v <= 32, `${key}: ${v}`);
            if (el.rotation) assert.ok(ANGLES.includes(el.rotation.angle), `${key}: ${el.rotation.angle}`);
            for (const face of Object.values(el.faces)) {
                for (const v of face.uv) assert.ok(v >= 0 && v <= 16, `${key}: uv ${v}`);
            }
        }
    }
});

test('Hörner und Dreizack nutzen die Textur halloween:item/teufel', () => {
    assert.equal(assets.models.teufelshoerner.textures['0'], 'halloween:item/teufel');
    assert.equal(assets.models.teufelsdreizack.textures['0'], 'halloween:item/teufel');
    assert.ok(assets.models.teufelshoerner.display.head);
});

test('Flügel-Textur ist 64x32 mit Lücken und Haut', () => {
    const png = readPng(assets.wings);
    assert.equal(png.w, 64);
    assert.equal(png.h, 32);
    let clear = 0;
    let solid = 0;
    for (let y = 2; y < 22; y++) {
        for (let x = 24; x < 46; x++) png.alpha(x, y) === 0 ? clear++ : solid++;
    }
    assert.ok(clear > 0 && solid > 0, `clear ${clear}, solid ${solid}`);
});

test('Jedes Item hat ein Icon, dazu Pack-Bild und Skin', () => {
    for (const entry of SET) assert.ok(assets.icons[entry.key], entry.key);
    assert.equal(readPng(assets.packIcon).w, 64);
    assert.equal(readPng(assets.skin).w, 64);
    assert.equal(readPng(assets.skin).h, 64);
});
