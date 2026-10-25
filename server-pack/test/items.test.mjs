import { test } from "node:test";
import assert from "node:assert/strict";
import { baseFor, buildItemList, giveCommand } from "../items.mjs";

test("baseFor follows Nicolas' base items", () => {
  const cases = [
    [{ mod: "decoween-neoforge", id: "haunted_fountain", name: "Haunted Fountain", is3d: true }, "oak_pressure_plate"],
    [{ mod: "happyhallows", id: "red_skull_candle", name: "Skull With Red Candles", is3d: true }, "skeleton_skull"],
    [{ mod: "funny_pumpkin", id: "red_candy", name: "Red Candy", is3d: false }, "bread"],
    [{ mod: "funny_pumpkin", id: "berry_muffin", name: "Berry Muffin", is3d: false }, "bread"],
    [{ mod: "funny_pumpkin", id: "pumpkin_lollipop", name: "Pumpkin Lollipop", is3d: false }, "bread"],
    [{ mod: "funny_pumpkin", id: "caramel_key", name: "Caramel Key", is3d: false }, "bread"],
    [{ mod: "funny_pumpkin", id: "demon_costume_chestplate", name: "Demonic Wings", is3d: false }, "elytra"],
    [{ mod: "funny_pumpkin", id: "nether_monster_egg", name: "Nether Monster Egg", is3d: true }, "turtle_egg"],
    [{ mod: "funny_pumpkin", id: "nether_monster_egg_ingredient", name: "Nether Monster Egg Ingredient", is3d: false }, "turtle_egg"],
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
  assert.equal(giveCommand({ base: "oak_pressure_plate", name: "Haunted Fountain", equipment: null, slot: null }), '/give @s oak_pressure_plate[custom_name="Haunted Fountain"]');
});
