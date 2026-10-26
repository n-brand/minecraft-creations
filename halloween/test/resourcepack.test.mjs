import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { SET } from '../set.mjs';
import { resourcePackFiles } from '../resourcepack.mjs';

const files = resourcePackFiles();
const json = path => JSON.parse(files[path]);
const vanilla = item => JSON.parse(readFileSync(new URL(`../vanilla/${item}.json`, import.meta.url), 'utf8'));

test('pack.mcmeta gilt für 26.3 bis 26.4', () => {
    const { pack } = json('pack.mcmeta');
    assert.equal(pack.min_format, 97);
    assert.equal(pack.max_format, 100);
    assert.ok(files['pack.png']);
});

test('fallback equals vanilla', () => {
    for (const entry of SET) {
        const def = json(`assets/minecraft/items/${entry.item}.json`);
        assert.deepEqual(def.model.fallback, vanilla(entry.item).model, entry.item);
    }
});

test('every name variant is covered', () => {
    for (const entry of SET) {
        const def = json(`assets/minecraft/items/${entry.item}.json`);
        assert.equal(def.model.property, 'minecraft:component');
        assert.equal(def.model.component, 'minecraft:custom_name');
        const when = def.model.cases.flatMap(c => [c.when].flat());
        for (const name of entry.names) assert.ok(when.includes(name), name);
    }
});

test('alle Verweise auf Modelle und Texturen zeigen auf Dateien im Pack', () => {
    const file = (id, folder, ext) => {
        const [ns, path] = id.includes(':') ? id.split(':') : ['minecraft', id];
        return `assets/${ns}/${folder}/${path}.${ext}`;
    };
    for (const entry of SET) {
        const def = json(`assets/minecraft/items/${entry.item}.json`);
        for (const c of def.model.cases) {
            const modelPath = file(c.model.model, 'models', 'json');
            assert.ok(files[modelPath], modelPath);
            for (const tex of Object.values(JSON.parse(files[modelPath]).textures)) {
                assert.ok(files[file(tex, 'textures', 'png')], tex);
            }
        }
    }
    const equipment = json('assets/halloween/equipment/teufelsfluegel.json');
    const wing = equipment.layers.wings[0];
    assert.equal(wing.use_player_texture, false);
    assert.ok(files[file(wing.texture, 'textures/entity/equipment/wings', 'png')]);
});

test('alle JSON-Dateien sind gültig', () => {
    for (const path of Object.keys(files).filter(p => p.endsWith('.json') || p.endsWith('.mcmeta'))) {
        assert.doesNotThrow(() => JSON.parse(files[path]), path);
    }
});
