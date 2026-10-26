// --- Datapack (nur auf dem Server, in world/datapacks/) ---
// Jeden Tick: Trägt ein Spieler Teufelshörner oder -flügel, bekommt das Item die passende
// Ausrüstungs-Komponente. Heisst es nicht mehr so, wird die Vanilla-Komponente wiederhergestellt.

import { SET } from './set.mjs';

const pretty = data => JSON.stringify(data, null, 2);

export const toSnbt = value => {
    if (typeof value === 'string') return JSON.stringify(value);
    if (typeof value !== 'object') return String(value);
    return '{' + Object.entries(value).map(([key, v]) => `${key}:${toSnbt(v)}`).join(',') + '}';
};

// Ausrüstung pro Art: Slot im Befehl und Komponente, wenn der Name passt
const EQUIP = {
    // Ohne asset_id zeichnet Minecraft keine Rüstung, sondern das Item-Modell auf dem Kopf
    head: { slot: 'armor.head', equippable: { slot: 'head', equip_sound: 'minecraft:item.armor.equip_leather' } },
    wings: {
        slot: 'armor.chest',
        equippable: { slot: 'chest', equip_sound: 'minecraft:item.armor.equip_elytra', asset_id: 'halloween:teufelsfluegel', damage_on_hurt: false }
    }
};

// Vanilla-Ausrüstung (26.3) zum Zurücksetzen. "!minecraft:equippable" ginge nicht:
// das entfernt die Komponente ganz, und das Item liesse sich nicht mehr tragen.
const VANILLA_EQUIP = {
    leather_helmet: { slot: 'head', equip_sound: 'minecraft:item.armor.equip_leather', asset_id: 'minecraft:leather' },
    elytra: { slot: 'chest', equip_sound: 'minecraft:item.armor.equip_elytra', asset_id: 'minecraft:elytra', damage_on_hurt: false }
};

const setEquippable = equippable => pretty({
    type: 'minecraft:set_components',
    components: { 'minecraft:equippable': equippable }
});

const rules = entry => {
    const { slot, equippable } = EQUIP[entry.kind];
    const on = `[minecraft:equippable=${toSnbt(equippable)}]`;
    const named = name => `items entity @s ${slot} minecraft:${entry.item}[minecraft:custom_name=${toSnbt(name)}]`;
    return [
        `# ${entry.title}`,
        ...entry.names.map(name =>
            `execute if ${named(name)} unless items entity @s ${slot} *${on} run item modify entity @s ${slot} halloween:${entry.key}_an`),
        `execute if items entity @s ${slot} minecraft:${entry.item}${on} ` +
            entry.names.map(name => `unless ${named(name)}`).join(' ') +
            ` run item modify entity @s ${slot} halloween:${entry.key}_normal`
    ];
};

export const datapackFiles = () => {
    const worn = SET.filter(entry => EQUIP[entry.kind]);
    const files = {
        'pack.mcmeta': pretty({ pack: { description: 'Halloween-Pack: Teufels-Set', min_format: 121, max_format: 125 } }),
        'data/minecraft/tags/function/tick.json': pretty({ values: ['halloween:tick'] }),
        'data/halloween/function/tick.mcfunction': 'execute as @a run function halloween:player\n',
        'data/halloween/function/player.mcfunction': worn.flatMap(rules).join('\n')
    };
    for (const entry of worn) {
        files[`data/halloween/item_modifier/${entry.key}_an.json`] = setEquippable(EQUIP[entry.kind].equippable);
        files[`data/halloween/item_modifier/${entry.key}_normal.json`] = setEquippable(VANILLA_EQUIP[entry.item]);
    }
    return files;
};
