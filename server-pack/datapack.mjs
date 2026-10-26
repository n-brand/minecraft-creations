// Datapack: Kostüme anziehbar machen, Deko platzierbar machen. Läuft nur auf dem Server.

import { DECO_BASES } from "./items.mjs";

const NS = "server_pack_2026";
const json = (o) => JSON.stringify(o, null, 2);
const quote = (s) => s.replace(/\\/g, "\\\\").replace(/"/g, '\\"');

export function buildDatapack({ items }) {
  const files = new Map();
  const fn = (name, lines) => files.set(`data/${NS}/function/${name}.mcfunction`, lines.join("\n") + "\n");

  files.set("pack.mcmeta", json({ pack: { description: "§6Server Pack 2026 §7(Datapack)", min_format: [107, 0], max_format: [200, 0] } }));
  files.set("data/minecraft/tags/function/load.json", json({ values: [`${NS}:load`] }));
  files.set("data/minecraft/tags/function/tick.json", json({ values: [`${NS}:tick`] }));

  fn("load", [
    "scoreboard objectives add sp26 dummy",
    "scoreboard players set #90 sp26 90",
    `schedule function ${NS}:second 20t`,
  ]);
  fn("second", [`execute as @a run function ${NS}:costume/check`, `schedule function ${NS}:second 20t`]);
  fn("tick", [`execute as @e[type=interaction,tag=sp26.deco] if data entity @s attack at @s run function ${NS}:deco/break`]);

  /* --- Kostüme --- */
  const check = [];
  for (const item of items.filter((i) => i.kind === "costume")) {
    if (!item.equipment && item.slot !== "head") continue;
    const slot = `armor.${item.slot}`;
    const equippable = item.equipment ? { slot: item.slot, asset_id: item.equipment } : { slot: item.slot };
    // Marker mit Namen: wird das Teil später auf ein anderes Kostüm umbenannt, greift dessen Zeile wieder
    files.set(`data/${NS}/item_modifier/costume/${item.icon}.json`, json({ type: "minecraft:set_components", components: { "minecraft:equippable": equippable, "minecraft:custom_data": { sp26: item.name } } }));
    check.push(`execute if items entity @s ${slot} minecraft:${item.base}[minecraft:custom_name="${quote(item.name)}"] unless items entity @s ${slot} *[minecraft:custom_data~{sp26:"${quote(item.name)}"}] run item modify entity @s ${slot} ${NS}:costume/${item.icon}`);
  }
  fn("costume/check", check);

  /* --- Deko hinstellen --- */
  const decoItems = items.filter((i) => DECO_BASES.includes(i.base));
  for (const item of decoItems) {
    const block = `minecraft:${item.base}`;
    files.set(`data/${NS}/advancement/deco/${item.icon}.json`, json({
      criteria: {
        placed: {
          trigger: "minecraft:placed_block",
          conditions: {
            location: {
              type: "minecraft:all_of",
              terms: [
                { type: "minecraft:match_block", blocks: block },
                { type: "minecraft:match_tool", predicate: { items: block, components: { "minecraft:custom_name": item.name } } },
              ],
            },
          },
        },
      },
      rewards: { function: `${NS}:deco/placed/${item.icon}` },
    }));
    fn(`deco/placed/${item.icon}`, [
      `advancement revoke @s only ${NS}:deco/${item.icon}`,
      // erst im nächsten Tick suchen: dann steht der Block sicher und die Blickrichtung ist aktuell
      `data modify storage ${NS}:tmp name set value "${quote(item.name)}"`,
      "tag @s add sp26.placer",
      `schedule function ${NS}:deco/${item.base}/later 1t`,
    ]);
  }

  // Pro Grund-Block: Name merken, Blickrichtung auf 90° runden (Modell schaut zum Spieler), dann vom Auge aus suchen.
  // Nur den Block direkt vor dem angeschauten Block umwandeln (dort wurde er gesetzt);
  // der Strahl läuft nur durch Luft/ersetzbare Blöcke und den Grund-Block, nie durch Wände.
  const next = "^ ^ ^0.05";
  const go = "if score #found sp26 matches 0 if score #steps sp26 matches ..120";
  for (const base of [...new Set(decoItems.map((i) => i.base))]) {
    const block = `minecraft:${base}`;
    fn(`deco/${base}/place`, [
      `$data modify storage ${NS}:tmp name set value "$(name)"`,
      "execute store result score #yaw sp26 run data get entity @s Rotation[0]",
      "scoreboard players add #yaw sp26 585",
      "scoreboard players operation #yaw sp26 /= #90 sp26",
      "scoreboard players operation #yaw sp26 *= #90 sp26",
      `execute store result storage ${NS}:tmp yaw float 1 run scoreboard players get #yaw sp26`,
      "scoreboard players set #steps sp26 0",
      "scoreboard players set #found sp26 0",
      `execute anchored eyes positioned ^ ^ ^ run function ${NS}:deco/${base}/ray`,
      'execute if score #found sp26 matches 0 run title @s actionbar {"text":"Deko nicht gefunden – beim Platzieren direkt auf die Stelle schauen","color":"red"}',
    ]);
    fn(`deco/${base}/later`, [
      `execute as @a[tag=sp26.placer] at @s run function ${NS}:deco/${base}/place with storage ${NS}:tmp`,
      "tag @a remove sp26.placer",
    ]);
    fn(`deco/${base}/ray`, [
      "scoreboard players add #steps sp26 1",
      `execute if block ~ ~ ~ ${block} unless block ${next} #minecraft:replaceable unless block ${next} ${block} align xyz positioned ~0.5 ~0.5 ~0.5 unless entity @e[type=interaction,tag=sp26.deco,distance=..0.6] run function ${NS}:deco/${base}/spawn with storage ${NS}:tmp`,
      `execute ${go} positioned ${next} if block ~ ~ ~ #minecraft:replaceable run function ${NS}:deco/${base}/ray`,
      `execute ${go} positioned ${next} if block ~ ~ ~ ${block} run function ${NS}:deco/${base}/ray`,
    ]);
    fn(`deco/${base}/spawn`, [
      "setblock ~ ~ ~ minecraft:air",
      `$summon minecraft:item_display ~ ~ ~ {Tags:["sp26.deco"],item_display:"none",Rotation:[$(yaw)f,0f],item:{id:"${block}",count:1,components:{"minecraft:custom_name":"$(name)"}}}`,
      'summon minecraft:interaction ~ ~-0.5 ~ {Tags:["sp26.deco"],width:1f,height:1f}',
      "scoreboard players set #found sp26 1",
    ]);
  }

  /* --- Deko abbauen (Linksklick aufs Modell) --- */
  fn("deco/break", [
    'execute on attacker if entity @s[gamemode=!creative] at @s run tag @s add sp26.breaker',
    `execute if entity @a[tag=sp26.breaker] positioned ~ ~0.5 ~ run summon minecraft:item ~ ~ ~ {Tags:["sp26.drop"],Item:{id:"minecraft:stick",count:1}}`,
    "execute positioned ~ ~0.5 ~ as @n[type=minecraft:item,tag=sp26.drop,distance=..0.1] run data modify entity @s Item set from entity @n[type=minecraft:item_display,tag=sp26.deco,distance=..0.5] item",
    "execute positioned ~ ~0.5 ~ run tag @n[type=minecraft:item,tag=sp26.drop,distance=..0.1] remove sp26.drop",
    "tag @a[tag=sp26.breaker] remove sp26.breaker",
    "execute positioned ~ ~0.5 ~ run kill @n[type=minecraft:item_display,tag=sp26.deco,distance=..0.5]",
    "kill @s",
  ]);

  return files;
}
