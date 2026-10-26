import { test } from "node:test";
import assert from "node:assert/strict";
import { encodePng } from "../lib/png.mjs";
import { buildItemList } from "../items.mjs";
import { buildResourcePack, isModel3d } from "../resourcepack.mjs";
import { checkPack } from "../check.mjs";

const png = encodePng({ w: 1, h: 1, data: Buffer.from([200, 100, 50, 255]) });
const json = (o) => Buffer.from(JSON.stringify(o));

const modFiles = {
  funny_pumpkin: new Map([
    ["assets/funny_pumpkin/models/item/flat_thing.json", json({ parent: "item/generated", textures: { layer0: "funny_pumpkin:block/x" } })],
    ["assets/funny_pumpkin/textures/block/x.png", png],
    ["assets/funny_pumpkin/models/item/statue.json", json({ parent: "funny_pumpkin:block/statue" })],
    ["assets/funny_pumpkin/models/block/statue.json", json({ parent: "funny_pumpkin:block/template", render_type: "cutout", textures: { t: "funny_pumpkin:block/x" } })],
    ["assets/funny_pumpkin/models/block/template.json", json({ textures: { particle: "block/anvil" }, elements: [{ from: [0, 0, 0], to: [16, 16, 16], faces: { north: { texture: "#t" }, south: { texture: "#missing" } } }] })],
  ]),
};
const vanillaFiles = new Map([
  ["assets/minecraft/items/paper.json", json({ model: { type: "minecraft:model", model: "minecraft:item/paper" } })],
  ["assets/minecraft/items/spruce_pressure_plate.json", json({ model: { type: "minecraft:model", model: "minecraft:block/spruce_pressure_plate" } })],
  ["assets/minecraft/textures/block/anvil.png", png],
]);

const items = buildItemList({ selection: ["funny_pumpkin/flat_thing", "funny_pumpkin/statue"], lang: {}, is3d: (mod, id) => isModel3d(modFiles[mod], "funny_pumpkin", id) });
const { files } = buildResourcePack({ items, modFiles, vanillaFiles, hatFiles: null });
const read = (p) => JSON.parse(files.get(p).toString());

test("flat textures move into the item atlas", () => {
  assert.ok(files.has("assets/funny_pumpkin/textures/item/hx/block/x.png"));
  assert.equal(read("assets/funny_pumpkin/models/item/flat_thing.json").textures.layer0, "funny_pumpkin:item/hx/block/x");
});

test("vanilla block textures are copied into the item atlas", () => {
  assert.ok(files.has("assets/halloween/textures/item/hx/vanilla/block/anvil.png"));
  assert.equal(read("assets/funny_pumpkin/models/block/template.json").textures.particle, "halloween:item/hx/vanilla/block/anvil");
});

test("faces with undefined textures are removed and render_type dropped", () => {
  const faces = read("assets/funny_pumpkin/models/block/template.json").elements[0].faces;
  assert.ok(faces.north);
  assert.equal(faces.south, undefined);
  assert.equal(read("assets/funny_pumpkin/models/block/statue.json").render_type, undefined);
});

test("item definition selects on custom_name with vanilla fallback", () => {
  const def = read("assets/minecraft/items/spruce_pressure_plate.json").model;
  assert.equal(def.type, "minecraft:select");
  assert.equal(def.component, "minecraft:custom_name");
  assert.deepEqual(def.cases, [{ when: "Statue", model: { type: "minecraft:model", model: "funny_pumpkin:item/statue" } }]);
  assert.deepEqual(def.fallback, { type: "minecraft:model", model: "minecraft:block/spruce_pressure_plate" });
  assert.equal(read("pack.mcmeta").pack.min_format[0], 55);
});

test("checkPack accepts the built pack and reports mixed atlases", () => {
  assert.deepEqual(checkPack(files), []);
  const broken = new Map(files);
  broken.set("assets/funny_pumpkin/models/block/template.json", json({ textures: { particle: "block/anvil" }, elements: [{ from: [0, 0, 0], to: [16, 16, 16], faces: { north: { texture: "#t" } } }] }));
  assert.ok(checkPack(broken).some((p) => p.includes("mehrere Atlanten")));
});

test("wings get an elytra-shaped wings texture", async () => {
  const { decodePng } = await import("../lib/png.mjs");
  const wingPng = encodePng({ w: 64, h: 64, data: Buffer.alloc(64 * 64 * 4).fill(0).map((v, i) => (Math.floor(i / 4) % 64 < 12 && Math.floor(i / 256) > 24 && Math.floor(i / 256) < 36 ? 200 : 0)) });
  const mods = { funny_pumpkin: new Map([...modFiles.funny_pumpkin, ["assets/funny_pumpkin/textures/entities/demon_wings.png", wingPng], ["assets/funny_pumpkin/models/item/demon_costume_chestplate.json", json({ parent: "item/generated", textures: { layer0: "funny_pumpkin:block/x" } })]]) };
  const v = new Map([...vanillaFiles, ["assets/minecraft/items/elytra.json", json({ model: { type: "minecraft:model", model: "minecraft:item/elytra" } })]]);
  const wingsItems = buildItemList({ selection: ["funny_pumpkin/demon_costume_chestplate"], lang: { funny_pumpkin: { "item.funny_pumpkin.demon_costume_chestplate": "Demonic Wings" } }, is3d: () => false });
  const built = buildResourcePack({ items: wingsItems, modFiles: mods, vanillaFiles: v, hatFiles: null }).files;
  assert.deepEqual(JSON.parse(built.get("assets/halloween/equipment/fp_demon_wings.json")), { layers: { wings: [{ texture: "halloween:fp_demon_wings" }] } });
  const tex = decodePng(built.get("assets/halloween/textures/entity/equipment/wings/fp_demon_wings.png"));
  assert.equal(tex.w, 64);
  assert.equal(tex.h, 32);
  // front face of the elytra wing (u 24..34, v 2..22) carries the painted wing
  assert.ok(tex.data[(10 * 64 + 28) * 4 + 3] > 0);
});
