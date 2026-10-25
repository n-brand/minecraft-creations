import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, readFileSync, existsSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { build } from '../build.mjs';
import { sha1 } from '../lib/zip.mjs';

const readInfo = root => {
    const text = readFileSync(join(root, 'data/halloween-pack.js'), 'utf8');
    return JSON.parse(text.slice(text.indexOf('{'), text.lastIndexOf('}') + 1));
};

test('build schreibt beide Zips und die Pack-Infos', () => {
    const root = mkdtempSync(join(tmpdir(), 'halloween-'));
    build({ root, quiet: true });
    const pack = join(root, 'downloads/texturepacks/halloween-pack.zip');
    const datapack = join(root, 'downloads/texturepacks/halloween-datapack.zip');
    assert.ok(existsSync(pack));
    assert.ok(existsSync(datapack));
    const info = readInfo(root);
    assert.equal(info['halloween-pack'].sha1, sha1(readFileSync(pack)));
    assert.equal(info['halloween-pack'].url, 'https://n-brand.github.io/minecraft-creations/downloads/texturepacks/halloween-pack.zip');
    assert.match(info['halloween-datapack'].size, /KB$/);
    for (const file of ['teufelshoerner.png', 'teufelsfluegel.png', 'teufelsdreizack.png', 'teufelshoerner.json', 'teufelsdreizack.json', 'teufel.png', 'wings.png', 'skin.png']) {
        assert.ok(existsSync(join(root, 'images/halloween-pack', file)), file);
    }
    assert.ok(existsSync(join(root, 'images/halloween-pack.png')));
});

test('zweimal bauen ergibt die gleiche SHA-1', () => {
    const a = mkdtempSync(join(tmpdir(), 'halloween-'));
    const b = mkdtempSync(join(tmpdir(), 'halloween-'));
    build({ root: a, quiet: true });
    build({ root: b, quiet: true });
    assert.equal(readInfo(a)['halloween-pack'].sha1, readInfo(b)['halloween-pack'].sha1);
});
