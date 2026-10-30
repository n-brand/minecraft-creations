import { test } from "node:test";
import assert from "node:assert/strict";
import { encodePng, decodePng } from "../lib/png.mjs";
import { renderIcon } from "../icons.mjs";
import { entrySource, insertEntry } from "../site-entry.mjs";

const items = [
  { key: "happyhallows/bride_mask", mod: "happyhallows", ns: "happyhallows", id: "bride_mask", name: "Bride Mask", base: "leather_helmet", slot: "head", equipment: "halloween:hh_bride", kind: "costume", model: "happyhallows:item/bride_mask", icon: "happyhallows_bride_mask" },
  { key: "decoween-neoforge/haunted_fountain", mod: "decoween-neoforge", ns: "decoween", id: "haunted_fountain", name: "Haunted Fountain", base: "spruce_pressure_plate", slot: null, equipment: null, kind: "deco", model: "decoween:item/haunted_fountain", icon: "decoween_haunted_fountain" },
];

test("entrySource builds the server-only entry", () => {
  const src = entrySource(items);
  assert.ok(src.includes('id: "server-pack-2026"'));
  assert.ok(src.includes("serverOnly: true"));
  assert.ok(src.includes('"/give @s leather_helmet[custom_name=\\"Bride Mask\\",equippable={slot:\\"head\\",asset_id:\\"halloween:hh_bride\\"}]"'));
  // jeder Name hat einen /give-Befehl zum Testen
  assert.ok(src.includes('["Haunted Fountain", "decoween_haunted_fountain", "/give @s'));
  assert.ok(/Linksklick/.test(src));
  // Kategorie für den Filter auf der Seite
  assert.match(src, /cat: "(Kostüme|Deko|Essen|Sonstiges)"/);
});

test("insertEntry replaces an existing entry and keeps CRLF", () => {
  const before = 'window.ITEMS = [\r\n  {\r\n    id: "server-pack-2026",\r\n    old: 1\r\n  },\r\n  {\r\n    id: "mein-pack"\r\n  }\r\n];\r\n';
  const after = insertEntry(before, '  {\n    id: "server-pack-2026",\n    neu: 2\n  },\n');
  assert.ok(after.includes("neu: 2"));
  assert.ok(!after.includes("old: 1"));
  assert.ok(after.includes('id: "mein-pack"'));
  assert.ok(!/[^\r]\n/.test(after));
});

test("renderIcon draws a one-cube model as 64x64 PNG", () => {
  const tex = encodePng({ w: 1, h: 1, data: Buffer.from([255, 0, 0, 255]) });
  const files = new Map([
    ["assets/t/models/item/cube.json", Buffer.from(JSON.stringify({ textures: { a: "t:item/red" }, elements: [{ from: [0, 0, 0], to: [16, 16, 16], faces: { up: { texture: "#a" }, south: { texture: "#a" }, east: { texture: "#a" } } }] }))],
    ["assets/t/textures/item/red.png", tex],
  ]);
  const img = decodePng(renderIcon("t:item/cube", files, 64));
  assert.equal(img.w, 64);
  assert.equal(img.data[(32 * 64 + 32) * 4 + 3], 255);
});

test("costumes are grouped by set (vampire, devil, …) with their own give commands", async () => {
  const { costumeSet } = await import("../site-entry.mjs");
  assert.equal(costumeSet({ mod: "funny_pumpkin", id: "vampire_costume_1_helmet" }), "Vampir");
  assert.equal(costumeSet({ mod: "funny_pumpkin", id: "vampire_eyes_2" }), "Vampir");
  assert.equal(costumeSet({ mod: "funny_pumpkin", id: "demon_costume_chestplate" }), "Teufel");
  assert.equal(costumeSet({ mod: "funny_pumpkin", id: "dark_mummy_costume_boots" }), "Dunkle Mumie");
  assert.equal(costumeSet({ mod: "happyhallows", id: "bride_mask" }), "Braut");
  assert.equal(costumeSet({ mod: "christmas_hats", id: "christmas_hat" }), "Weihnachten");
  const list = [
    { key: "funny_pumpkin/vampire_costume_1_helmet", mod: "funny_pumpkin", id: "vampire_costume_1_helmet", name: "Vampire Hat", base: "leather_helmet", slot: "head", equipment: null, kind: "costume", icon: "fp_vh" },
    { key: "funny_pumpkin/vampire_cloak", mod: "funny_pumpkin", id: "vampire_cloak", name: "Vampire Cloak", base: "leather_chestplate", slot: "chest", equipment: "halloween:fp_vampire_cloak", kind: "costume", icon: "fp_vc" },
  ];
  const src = entrySource(list);
  assert.ok(src.includes('item: "Vampir"'));
  assert.ok(src.includes('["Vampire Hat", "fp_vh", "/give @s leather_helmet[custom_name=\\"Vampire Hat\\"]"]'));
  assert.ok(src.includes("Diamant"));
});

test("pieces inside a set are ordered helmet, chestplate, pants, shoes", () => {
  const mk = (id, name, slot, base) => ({ key: `happyhallows/${id}`, mod: "happyhallows", id, name, base, slot, equipment: null, kind: "costume", icon: id });
  const src = entrySource([mk("bride_boots", "Bride Boots", "feet", "leather_boots"), mk("bride_body", "Bride Body", "chest", "leather_chestplate"), mk("bride_mask", "Bride Mask", "head", "leather_helmet"), mk("bride_breeches", "Bride Breeches", "legs", "leather_leggings")]);
  const order = ["Bride Mask", "Bride Body", "Bride Breeches", "Bride Boots"].map((n) => src.indexOf(`["${n}"`));
  assert.deepEqual([...order].sort((a, b) => a - b), order);
});
