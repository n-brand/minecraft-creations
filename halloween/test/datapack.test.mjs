import { test } from 'node:test';
import assert from 'node:assert/strict';
import { SET } from '../set.mjs';
import { datapackFiles, toSnbt } from '../datapack.mjs';

const files = datapackFiles();
const player = files['data/halloween/function/player.mcfunction'];

test('pack.mcmeta gilt für 26.3 bis 26.4', () => {
    const { pack } = JSON.parse(files['pack.mcmeta']);
    assert.equal(pack.min_format, 121);
    assert.equal(pack.max_format, 125);
});

test('tick läuft für alle Spieler', () => {
    assert.deepEqual(JSON.parse(files['data/minecraft/tags/function/tick.json']), { values: ['halloween:tick'] });
    assert.match(files['data/halloween/function/tick.mcfunction'], /execute as @a run function halloween:player/);
});

test('every name variant is covered', () => {
    for (const entry of SET.filter(e => e.kind !== 'hand')) {
        for (const name of entry.names) assert.ok(player.includes(`[minecraft:custom_name="${name}"]`), name);
    }
});

test('datapack has reset rules', () => {
    for (const entry of SET.filter(e => e.kind !== 'hand')) {
        const reset = player.split('\n').filter(line => line.endsWith(`halloween:${entry.key}_normal`));
        assert.equal(reset.length, 1, entry.item);
        for (const name of entry.names) assert.ok(reset[0].includes(`unless items`) && reset[0].includes(name), name);
    }
});

// "!minecraft:equippable" würde die Komponente ganz entfernen (Item nicht mehr tragbar),
// darum setzt das Zurücksetzen die Vanilla-Werte von 26.3
test('Zurücksetzen stellt die Vanilla-Ausrüstung her', () => {
    const normal = key => JSON.parse(files[`data/halloween/item_modifier/${key}_normal.json`]);
    assert.deepEqual(normal('teufelshoerner'), {
        type: 'minecraft:set_components',
        components: { 'minecraft:equippable': { slot: 'head', equip_sound: 'minecraft:item.armor.equip_leather', asset_id: 'minecraft:leather' } }
    });
    assert.deepEqual(normal('teufelsfluegel'), {
        type: 'minecraft:set_components',
        components: { 'minecraft:equippable': { slot: 'chest', equip_sound: 'minecraft:item.armor.equip_elytra', asset_id: 'minecraft:elytra', damage_on_hurt: false } }
    });
    assert.ok(!Object.keys(files).some(path => path.endsWith('/normal.json')));
});

test('Hörner verlieren die Rüstungsoptik, Flügel bekommen eigene', () => {
    const horns = JSON.parse(files['data/halloween/item_modifier/teufelshoerner_an.json']).components['minecraft:equippable'];
    assert.equal(horns.slot, 'head');
    assert.equal(horns.asset_id, undefined);
    const wings = JSON.parse(files['data/halloween/item_modifier/teufelsfluegel_an.json']).components['minecraft:equippable'];
    assert.equal(wings.slot, 'chest');
    assert.equal(wings.asset_id, 'halloween:teufelsfluegel');
    assert.ok(player.includes(`armor.chest`));
    // Prüfung im Befehl nutzt dasselbe Objekt wie der Item-Modifier
    assert.ok(player.includes(`[minecraft:equippable=${toSnbt(horns)}]`));
    assert.ok(player.includes(`[minecraft:equippable=${toSnbt(wings)}]`));
});

test('Dreizack braucht keine Datapack-Regel', () => {
    assert.ok(!player.includes('trident'));
});

test('toSnbt schreibt Schlüssel ohne Anführungszeichen', () => {
    assert.equal(toSnbt({ slot: 'head', damage_on_hurt: false }), '{slot:"head",damage_on_hurt:false}');
});
