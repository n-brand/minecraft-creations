// --- Resource Pack (für alle Spieler, vom Server verteilt) ---
// Umbenannte Items zeigen ein eigenes Modell; alle anderen bleiben exakt wie Vanilla 26.3.

import { readFileSync } from 'node:fs';
import { SET } from './set.mjs';
import { buildAssets } from './models.mjs';

const vanilla = item => JSON.parse(readFileSync(new URL(`./vanilla/${item}.json`, import.meta.url), 'utf8'));
const pretty = data => JSON.stringify(data, null, 2);

export const resourcePackFiles = (assets = buildAssets()) => {
    const files = {
        'pack.mcmeta': pretty({ pack: { description: '§6Halloween-Pack §7- Teufels-Set', min_format: 97, max_format: 100 } }),
        'pack.png': assets.packIcon,
        'assets/halloween/equipment/teufelsfluegel.json': pretty({
            layers: { wings: [{ texture: 'halloween:teufelsfluegel', use_player_texture: false }] }
        }),
        'assets/halloween/textures/entity/equipment/wings/teufelsfluegel.png': assets.wings
    };
    for (const [path, png] of Object.entries(assets.textures)) files[`assets/halloween/textures/${path}`] = png;
    for (const [key, model] of Object.entries(assets.models)) files[`assets/halloween/models/item/${key}.json`] = pretty(model);
    for (const entry of SET) {
        files[`assets/minecraft/items/${entry.item}.json`] = pretty({
            model: {
                type: 'minecraft:select',
                property: 'minecraft:component',
                component: 'minecraft:custom_name',
                cases: [{ when: entry.names, model: { type: 'minecraft:model', model: `halloween:item/${entry.key}` } }],
                fallback: vanilla(entry.item).model
            }
        });
    }
    return files;
};
