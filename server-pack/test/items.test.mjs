import { test } from "node:test";
import fs from "node:fs";
import assert from "node:assert/strict";
import { baseFor, buildItemList, giveCommand } from "../items.mjs";

test("baseFor follows Nicolas' base items", () => {
  const cases = [
    [{ mod: "decoween-neoforge", id: "haunted_fountain", name: "Haunted Fountain", is3d: true }, "spruce_pressure_plate"],
    [{ mod: "funny_pumpkin", id: "hanged_corpse", name: "Hanged Corpse", is3d: true }, "lantern"],
    [{ mod: "happyhallows", id: "red_skull_candle", name: "Skull With Red Candles", is3d: true }, "spruce_pressure_plate"],
    [{ mod: "funny_pumpkin", id: "red_candy", name: "Red Candy", is3d: false }, "bread"],
    [{ mod: "funny_pumpkin", id: "berry_muffin", name: "Berry Muffin", is3d: false }, "bread"],
    [{ mod: "funny_pumpkin", id: "pumpkin_lollipop", name: "Pumpkin Lollipop", is3d: false }, "bread"],
    [{ mod: "funny_pumpkin", id: "caramel_key", name: "Caramel Key", is3d: false }, "bread"],
    [{ mod: "funny_pumpkin", id: "demon_costume_chestplate", name: "Demonic Wings", is3d: false }, "elytra"],
    [{ mod: "funny_pumpkin", id: "nether_monster_egg", name: "Nether Monster Egg", is3d: false }, "bread"],
    [{ mod: "funny_pumpkin", id: "nether_monster_egg_ingredient", name: "Nether Monster Egg Ingredient", is3d: false }, "bread"],
    [{ mod: "spookify", id: "bag_ghost", name: "Bag Ghost", is3d: true }, "bundle"],
    [{ mod: "funny_pumpkin", id: "music_disc_3", name: "Carnival Of Horrors", is3d: false }, "music_disc_13"],
    [{ mod: "happyhallows", id: "bride_mask", name: "Bride Mask", is3d: false }, "leather_helmet"],
    [{ mod: "funny_pumpkin", id: "demonic_cloth", name: "Demonic Cloth", is3d: false }, "paper"],
  ];
  for (const [input, base] of cases) assert.equal(baseFor(input), base, input.id);
});

const lang = {
  funny_pumpkin: {
    "item.funny_pumpkin.nether_monster_egg": "§eNether Monster Egg",
    "item.funny_pumpkin.nether_monster_egg_ingredient": "Nether Monster Egg",
    "item.funny_pumpkin.lay_corpse": "Corpse",
    "item.funny_pumpkin.hanged_corpse": "Corpse",
    "item.funny_pumpkin.seat_corpse": "Corpse",
    "item.funny_pumpkin.music_disc_4": "Music Disc",
    "item.funny_pumpkin.music_disc_4.desc": "§7Devilry - Witch dance",
    "item.funny_pumpkin.witch_costume_helmet": "Witch Hat",
    "item.funny_pumpkin.pumpkin_armor_helmet": "Pumpkin Helmet",
    "item.funny_pumpkin.pumpkin_mask_helmet": "Pumpkin Mask",
  },
  happyhallows: { "item.happyhallows.bride_mask": "Bride Mask" },
};
const list = buildItemList({
  selection: ["funny_pumpkin/nether_monster_egg", "funny_pumpkin/nether_monster_egg_ingredient", "funny_pumpkin/lay_corpse", "funny_pumpkin/hanged_corpse", "funny_pumpkin/seat_corpse", "funny_pumpkin/music_disc_4", "funny_pumpkin/witch_costume_helmet", "funny_pumpkin/pumpkin_armor_helmet", "funny_pumpkin/pumpkin_mask_helmet", "happyhallows/bride_mask"],
  lang,
  is3d: (mod, id) => /corpse|egg$/.test(id),
});
const byId = (id) => list.find((i) => i.id === id);

test("buildItemList strips color codes and dedupes names", () => {
  assert.equal(byId("nether_monster_egg").name, "Nether Monster Egg");
  assert.equal(byId("nether_monster_egg_ingredient").name, "Nether Monster Egg Ingredient");
  assert.deepEqual(["lay_corpse", "hanged_corpse", "seat_corpse"].map((id) => byId(id).name), ["Lay Corpse", "Hanged Corpse", "Seat Corpse"]);
  assert.equal(byId("music_disc_4").name, "Witch Dance");
});

test("buildItemList sets equipment only for sets with armor textures", () => {
  assert.equal(byId("bride_mask").equipment, "halloween:hh_bride");
  assert.equal(byId("pumpkin_armor_helmet").equipment, "halloween:fp_pumpkin");
  assert.equal(byId("witch_costume_helmet").equipment, null);
  assert.equal(byId("pumpkin_mask_helmet").equipment, null);
  assert.equal(byId("bride_mask").kind, "costume");
  assert.equal(byId("lay_corpse").kind, "deco");
  assert.equal(byId("bride_mask").icon, "happyhallows_bride_mask");
  assert.equal(byId("bride_mask").model, "happyhallows:item/bride_mask");
});

test("giveCommand builds the exact /give line", () => {
  assert.equal(giveCommand(byId("bride_mask")), '/give @s leather_helmet[custom_name="Bride Mask",equippable={slot:"head",asset_id:"halloween:hh_bride"}]');
  assert.equal(giveCommand({ base: "spruce_pressure_plate", name: "Haunted Fountain", equipment: null, slot: null }), '/give @s spruce_pressure_plate[custom_name="Haunted Fountain"]');
});

test("wings are elytra costumes with their own wing look", () => {
  const [wings] = buildItemList({
    selection: ["funny_pumpkin/demon_costume_chestplate"],
    lang: { funny_pumpkin: { "item.funny_pumpkin.demon_costume_chestplate": "Demonic Wings" } },
    is3d: () => false,
  });
  assert.equal(wings.base, "elytra");
  assert.equal(wings.slot, "chest");
  assert.equal(wings.kind, "costume");
  assert.equal(wings.equipment, "halloween:fp_demon_wings");
  assert.equal(giveCommand(wings), '/give @s elytra[custom_name="Demonic Wings",equippable={slot:"chest",asset_id:"halloween:fp_demon_wings"}]');
});

test("oggSeconds reads the length of a vorbis file", { skip: !fs.existsSync("C:/Users/nicol/Downloads/funny_pumpkin-1.2.3-forge-1.20.1.jar") }, async () => {
  const { readZip } = await import("../lib/zip.mjs");
  const { oggSeconds } = await import("../items.mjs");
  const f = readZip(fs.readFileSync("C:/Users/nicol/Downloads/funny_pumpkin-1.2.3-forge-1.20.1.jar"), (n) => n.endsWith("sounds/witch_dance.ogg"));
  const s = oggSeconds([...f.values()][0]);
  assert.ok(s > 30 && s < 600, String(s));
});

test("size list multiplies the placed deco size by name", async () => {
  const { applySizes } = await import("../items.mjs");
  const list = [{ name: "Fortune Teller's Table", kind: "deco", scale: 1 }, { name: "Gothic Throne", kind: "deco", scale: 2 }, { name: "Bride Mask", kind: "costume" }];
  const unknown = applySizes(list, { "Fortune Teller's Table": 1.5, "Gothic Throne": 1.25, "Gibt Es Nicht": 2 });
  assert.equal(list[0].scale, 1.5);
  assert.equal(list[1].scale, 2.5);
  assert.equal(list[2].scale, undefined);
  assert.deepEqual(unknown, ["Gibt Es Nicht"]);
});
