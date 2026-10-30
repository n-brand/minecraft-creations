// Datapack: Kostüme anziehbar machen, Deko platzierbar machen. Läuft nur auf dem Server.

import { DECO_BASES, armorBases } from "./items.mjs";
import { FLY_SCALE } from "./trident.mjs";

const NS = "server_pack_2026";
const json = (o) => JSON.stringify(o, null, 2);
const quote = (s) => s.replace(/\\/g, "\\\\").replace(/"/g, '\\"');

export function buildDatapack({ items }) {
  const files = new Map();
  const fn = (name, lines) => files.set(`data/${NS}/function/${name}.mcfunction`, lines.join("\n") + "\n");

  files.set("pack.mcmeta", json({ pack: { description: "§6Server Pack 2026 §7(Datapack)", min_format: [107, 0], max_format: [200, 0] } }));
  files.set("data/minecraft/tags/function/load.json", json({ values: [`${NS}:load`] }));
  files.set("data/minecraft/tags/function/tick.json", json({ values: [`${NS}:tick`] }));

  const load = [
    "scoreboard objectives add sp26 dummy",
    "scoreboard players set #90 sp26 90",
    `schedule function ${NS}:second 20t`,
  ];
  fn("second", [`execute as @a run function ${NS}:costume/check`, `execute as @a run function ${NS}:disc/check`, `schedule function ${NS}:second 20t`]);
  const tick = [`execute as @e[type=interaction,tag=sp26.deco] if data entity @s attack at @s run function ${NS}:deco/break`];

  /* --- Kostüme --- */
  const check = [];
  for (const item of items.filter((i) => i.kind === "costume")) {
    if (!item.equipment && item.slot !== "head") continue;
    const slot = `armor.${item.slot}`;
    const equippable = item.equipment ? { slot: item.slot, asset_id: item.equipment } : { slot: item.slot };
    // Marker mit Namen: wird das Teil später auf ein anderes Kostüm umbenannt, greift dessen Zeile wieder
    files.set(`data/${NS}/item_modifier/costume/${item.icon}.json`, json({ type: "minecraft:set_components", components: { "minecraft:equippable": equippable, "minecraft:custom_data": { sp26: item.name } } }));
    for (const base of armorBases(item.base)) check.push(`execute if items entity @s ${slot} minecraft:${base}[minecraft:custom_name="${quote(item.name)}"] unless items entity @s ${slot} *[minecraft:custom_data~{sp26:"${quote(item.name)}"}] run item modify entity @s ${slot} ${NS}:costume/${item.icon}`);
  }
  fn("costume/check", check);

  /* --- Musik-Discs: Lied der Mod, sobald die umbenannte Disc in der Hand ist --- */
  const discCheck = [];
  for (const item of items.filter((i) => i.song)) {
    files.set(`data/${NS}/jukebox_song/${item.icon}.json`, json({ sound_event: { sound_id: item.song.event }, description: { text: item.song.title }, length_in_seconds: item.song.seconds, comparator_output: item.song.index }));
    files.set(`data/${NS}/item_modifier/disc/${item.icon}.json`, json({ type: "minecraft:set_components", components: { "minecraft:jukebox_playable": `${NS}:${item.icon}`, "minecraft:custom_data": { sp26: item.name } } }));
    for (const slot of ["weapon.mainhand", "weapon.offhand"]) {
      discCheck.push(`execute if items entity @s ${slot} minecraft:${item.base}[minecraft:custom_name="${quote(item.name)}"] unless items entity @s ${slot} *[minecraft:custom_data~{sp26:"${quote(item.name)}"}] run item modify entity @s ${slot} ${NS}:disc/${item.icon}`);
    }
  }
  fn("disc/check", discCheck);

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
      // Mehrblock-Deko wieder auf echte Grösse bringen, Unterkante bleibt am Boden
      `data modify storage ${NS}:tmp scale set value ${item.scale ?? 1}f`,
      `data modify storage ${NS}:tmp ty set value ${((item.scale ?? 1) - 1) / 2}f`,
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
      // nicht gefunden: benanntes Item zurückgeben, damit der Name nicht verloren geht
      `$execute if score #found sp26 matches 0 if entity @s[gamemode=!creative] run give @s ${block}[minecraft:custom_name="$(name)"]`,
      'execute if score #found sp26 matches 0 run title @s actionbar {"text":"Deko nicht gefunden – Item zurückgegeben. Beim Platzieren auf die Stelle schauen","color":"red"}',
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
    // Hängende Deko (Laterne an der Decke) hängt einen Block tiefer
    const dy = base === "lantern" ? -1 : 0;
    const at = (y) => `~ ~${y === 0 ? "" : y} ~`;
    fn(`deco/${base}/spawn`, [
      "setblock ~ ~ ~ minecraft:air",
      `$summon minecraft:item_display ${at(dy)} {Tags:["sp26.deco"],item_display:"none",Rotation:[$(yaw)f,0f],transformation:{left_rotation:[0f,0f,0f,1f],right_rotation:[0f,0f,0f,1f],translation:[0f,$(ty)f,0f],scale:[$(scale)f,$(scale)f,$(scale)f]},item:{id:"${block}",count:1,components:{"minecraft:custom_name":"$(name)"}}}`,
      `summon minecraft:interaction ${at(dy - 0.5)} {Tags:["sp26.deco"],width:1f,height:1f}`,
      "scoreboard players set #found sp26 1",
    ]);
  }

  /* --- Geworfener Dreizack: rotes Modell fährt als Passagier mit (der Wurf selbst hat immer die Vanilla-Textur) --- */
  const thrown = items.filter((i) => i.thrown);
  if (thrown.length) {
    tick.push(
      `execute as @e[type=minecraft:trident,tag=!sp26.seen] run function ${NS}:trident/new`,
      `execute as @e[type=minecraft:trident,tag=sp26.thrown] run function ${NS}:trident/turn`,
      // aufgehoben oder verschwunden: Passagier bleibt sonst in der Luft stehen
      `execute as @e[type=minecraft:item_display,tag=sp26.fly] unless function ${NS}:trident/rides run kill @s`,
    );
    fn("trident/new", [
      "tag @s add sp26.seen",
      ...thrown.map((i) => `execute if items entity @s contents minecraft:trident[minecraft:custom_name="${quote(i.name)}"] run function ${NS}:trident/attach/${i.icon}`),
    ]);
    for (const i of thrown) {
      fn(`trident/attach/${i.icon}`, [
        "tag @s add sp26.thrown",
        "tag @s add sp26.cur",
        `execute at @s summon minecraft:item_display run function ${NS}:trident/mount`,
        `execute as @n[type=minecraft:item_display,tag=sp26.new] run data merge entity @s {item:{id:"minecraft:trident",count:1,components:{"minecraft:item_model":"${i.thrown}"}}}`,
        "tag @e[type=minecraft:item_display,tag=sp26.new] remove sp26.new",
        "tag @s remove sp26.cur",
        `function ${NS}:trident/turn`,
      ]);
    }
    fn("trident/mount", [
      "tag @s add sp26.fly",
      "tag @s add sp26.new",
      "data merge entity @s {item_display:\"none\",interpolation_duration:1}",
      "ride @s mount @e[type=minecraft:trident,tag=sp26.cur,limit=1]",
    ]);
    // Gieren (Rotation[0]) um y, Nicken (Rotation[1], beim Wurf-Objekt positiv = aufwärts) um x, in Bogenmass.
    // Der Passagier sitzt 0,5 Blöcke über dem Dreizack: translation schiebt ihn zurück.
    fn("trident/turn", [
      // steckt er fest, kennt das Spiel nur die gerundete Drehung (Schritte von 360/256°, abgerundet): genauso runden
      `execute if entity @s[nbt={inGround:1b}] run return run function ${NS}:trident/turn_ground`,
      `execute store result storage ${NS}:tmp fly.left_rotation.angle float 0.0000174533 run data get entity @s Rotation[0] 1000`,
      `execute store result storage ${NS}:tmp fly.right_rotation.angle float -0.0000174533 run data get entity @s Rotation[1] 1000`,
      `execute on passengers if entity @s[tag=sp26.fly] run function ${NS}:trident/apply`,
    ]);
    fn("trident/turn_ground", [
      "execute store result score #y sp26 run data get entity @s Rotation[0] 0.7111111",
      "execute store result score #x sp26 run data get entity @s Rotation[1] 0.7111111",
      `execute store result storage ${NS}:tmp fly.left_rotation.angle float 0.0245436926 run scoreboard players get #y sp26`,
      `execute store result storage ${NS}:tmp fly.right_rotation.angle float -0.0245436926 run scoreboard players get #x sp26`,
      `execute on passengers if entity @s[tag=sp26.fly] run function ${NS}:trident/apply`,
    ]);
    fn("trident/apply", [`data modify entity @s transformation merge from storage ${NS}:tmp fly`, "data merge entity @s {start_interpolation:0}"]);
    fn("trident/rides", ["execute on vehicle run return 1", "return 0"]);
    load.push(`data modify storage ${NS}:tmp fly set value {left_rotation:{angle:0f,axis:[0f,1f,0f]},right_rotation:{angle:0f,axis:[1f,0f,0f]},translation:[0f,-0.5f,0f],scale:[${FLY_SCALE}f,${FLY_SCALE}f,${FLY_SCALE}f]}`);
  }

  /* --- Diamant oder Netheritbarren + Eichenholzknopf zusammen auf den Boden werfen → ganzer Stack (je Knopf ein Stack) --- */
  const minusOne = '{type:"minecraft:set_count",count:-1,add:true}';
  for (const [key, id] of [["diamonds", "diamond"], ["netherite", "netherite_ingot"]]) {
    tick.push(`execute as @e[type=minecraft:item] if items entity @s contents minecraft:oak_button at @s if entity @e[type=minecraft:item,distance=..1.5,nbt={Item:{id:"minecraft:${id}"}}] run function ${NS}:recipe/${key}`);
    fn(`recipe/${key}`, [
      `execute as @e[type=minecraft:item,distance=..1.5] if items entity @s contents minecraft:${id} run tag @s add sp26.pay`,
      `item modify entity @n[type=minecraft:item,tag=sp26.pay] contents ${minusOne}`,
      `item modify entity @s contents ${minusOne}`,
      "tag @e[type=minecraft:item,tag=sp26.pay] remove sp26.pay",
      `summon minecraft:item ~ ~0.3 ~ {PickupDelay:10s,Item:{id:"minecraft:${id}",count:64}}`,
      "particle minecraft:happy_villager ~ ~0.3 ~ 0.3 0.3 0.3 0 20",
      "playsound minecraft:entity.player.levelup block @a[distance=..16] ~ ~ ~",
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

  fn("load", load);
  fn("tick", tick);
  return files;
}
