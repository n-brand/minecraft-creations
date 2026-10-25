import { test } from "node:test";
import assert from "node:assert/strict";
import { buildDatapack } from "../datapack.mjs";

const item = (o) => ({ ...o, model: `${o.ns}:item/${o.id}`, icon: `${o.ns}_${o.id}` });
const items = [
  item({ key: "happyhallows/bride_mask", mod: "happyhallows", ns: "happyhallows", id: "bride_mask", name: "Bride Mask", base: "leather_helmet", slot: "head", equipment: "halloween:hh_bride", kind: "costume" }),
  item({ key: "funny_pumpkin/witch_costume_helmet", mod: "funny_pumpkin", ns: "funny_pumpkin", id: "witch_costume_helmet", name: "Witch Hat", base: "leather_helmet", slot: "head", equipment: null, kind: "costume" }),
  item({ key: "funny_pumpkin/witch_costume_chestplate", mod: "funny_pumpkin", ns: "funny_pumpkin", id: "witch_costume_chestplate", name: "Witch Robe", base: "leather_chestplate", slot: "chest", equipment: null, kind: "costume" }),
  item({ key: "decoween-neoforge/haunted_fountain", mod: "decoween-neoforge", ns: "decoween", id: "haunted_fountain", name: "Haunted Fountain", base: "oak_pressure_plate", slot: null, equipment: null, kind: "deco" }),
  item({ key: "funny_pumpkin/lay_corpse", mod: "funny_pumpkin", ns: "funny_pumpkin", id: "lay_corpse", name: "Lay Corpse", base: "oak_pressure_plate", slot: null, equipment: null, kind: "deco" }),
];
const files = buildDatapack({ items });
const fn = (name) => files.get(`data/server_pack_2026/function/${name}.mcfunction`);
const modifier = (name) => JSON.parse(files.get(`data/server_pack_2026/item_modifier/${name}.json`));

test("pack.mcmeta targets data format 107 and newer", () => {
  const meta = JSON.parse(files.get("pack.mcmeta")).pack;
  assert.deepEqual(meta.min_format, [107, 0]);
  assert.deepEqual(meta.max_format, [200, 0]);
  assert.deepEqual(JSON.parse(files.get("data/minecraft/tags/function/load.json")).values, ["server_pack_2026:load"]);
  assert.deepEqual(JSON.parse(files.get("data/minecraft/tags/function/tick.json")).values, ["server_pack_2026:tick"]);
});

test("costume check line for Bride Mask", () => {
  assert.ok(fn("costume/check").includes('execute if items entity @s armor.head minecraft:leather_helmet[minecraft:custom_name="Bride Mask"] unless items entity @s armor.head *[minecraft:custom_data~{sp26:1b}] run item modify entity @s armor.head server_pack_2026:costume/happyhallows_bride_mask'));
  const m = modifier("costume/happyhallows_bride_mask");
  assert.equal(m.function, "minecraft:set_components");
  assert.deepEqual(m.components["minecraft:equippable"], { slot: "head", asset_id: "halloween:hh_bride" });
  assert.deepEqual(m.components["minecraft:custom_data"], { sp26: true });
});

test("head pieces without armor texture get equippable without asset", () => {
  assert.deepEqual(modifier("costume/funny_pumpkin_witch_costume_helmet").components["minecraft:equippable"], { slot: "head" });
});

test("body pieces without armor texture are left alone", () => {
  assert.ok(!fn("costume/check").includes("Witch Robe"));
  assert.ok(!files.has("data/server_pack_2026/item_modifier/costume/funny_pumpkin_witch_costume_chestplate.json"));
});

test("load and second loop run the costume check every second", () => {
  assert.ok(fn("load").includes("schedule function server_pack_2026:second 20t"));
  assert.ok(fn("second").includes("execute as @a run function server_pack_2026:costume/check"));
  assert.ok(fn("second").includes("schedule function server_pack_2026:second 20t"));
});

test("every item modify reference has a modifier file", () => {
  for (const [, content] of files) {
    for (const m of String(content).matchAll(/item modify entity @s \S+ server_pack_2026:(\S+)/g)) {
      assert.ok(files.has(`data/server_pack_2026/item_modifier/${m[1]}.json`), m[1]);
    }
  }
});

/* --- Deko --- */
const adv = (icon) => JSON.parse(files.get(`data/server_pack_2026/advancement/deco/${icon}.json`));

test("one placed_block advancement per pressure-plate item with exact name", () => {
  const advs = [...files.keys()].filter((p) => p.startsWith("data/server_pack_2026/advancement/deco/"));
  assert.equal(advs.length, 2);
  const a = adv("decoween_haunted_fountain");
  assert.equal(a.criteria.placed.trigger, "minecraft:placed_block");
  assert.deepEqual(a.criteria.placed.conditions.location, [
    { condition: "minecraft:block_state_property", block: "minecraft:oak_pressure_plate" },
    { condition: "minecraft:match_tool", predicate: { items: "minecraft:oak_pressure_plate", components: { "minecraft:custom_name": "Haunted Fountain" } } },
  ]);
  assert.equal(a.rewards.function, "server_pack_2026:deco/placed/decoween_haunted_fountain");
});

test("reward revokes exactly its own advancement and passes the name", () => {
  const f = fn("deco/placed/decoween_haunted_fountain");
  assert.ok(f.includes("advancement revoke @s only server_pack_2026:deco/decoween_haunted_fountain"));
  assert.ok(f.includes('function server_pack_2026:deco/place {name:"Haunted Fountain"}'));
});

test("raycast only converts a pressure plate without existing deco", () => {
  const f = fn("deco/ray");
  assert.ok(f.includes("minecraft:oak_pressure_plate"));
  assert.ok(f.includes("unless entity @e[type=interaction,tag=sp26.deco,distance=..0.6]"));
});

test("left click breaks deco, drops only outside creative", () => {
  assert.ok(fn("tick").includes("execute as @e[type=interaction,tag=sp26.deco] if data entity @s attack at @s run function server_pack_2026:deco/break"));
  const f = fn("deco/break");
  assert.ok(f.includes("gamemode=!creative"));
  assert.ok(f.includes("distance=..0.5"));
});

test("item frames and armor stands are never touched", () => {
  for (const [, c] of files) assert.ok(!/item_frame|armor_stand/.test(String(c)));
});

test("every function reference resolves to a file", () => {
  for (const [path, content] of files) {
    for (const m of String(content).matchAll(/(?:function|"function":\s*)\s*"?server_pack_2026:([a-z0-9_/]+)/g)) {
      assert.ok(files.has(`data/server_pack_2026/function/${m[1]}.mcfunction`), `${path} → ${m[1]}`);
    }
  }
});

export { files, fn, items };
