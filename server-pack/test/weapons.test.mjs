import { test } from "node:test";
import assert from "node:assert/strict";
import { readJem, importModel, swapModels } from "../weapons.mjs";

test("readJem: OptiFine boxes (invertAxis xy, translate) become entity-model cubes like vanilla", () => {
  const jem = { textureSize: [32, 32], models: [{ part: "body", invertAxis: "xy", translate: [0, -27, 0], boxes: [{ coordinates: [-0.5, 2, -0.5, 1, 24, 1], textureOffset: [16, 0] }] }] };
  const g = readJem(jem);
  assert.equal(g.texW, 32);
  const c = g.parts[0].cubes[0];
  // Blockbench y 2..26 → Java y 1..25 (Spitze bei kleinem y wie beim Vanilla-Dreizack)
  assert.deepEqual(c.from, [-0.5, 1, -0.5]);
  assert.deepEqual(c.size, [1, 24, 1]);
  assert.deepEqual(c.uv, [16, 0]);
});

test("readJem: submodels add their translate, 90° turns swap the box, odd angles are skipped", () => {
  const jem = { textureSize: [32, 32], models: [{ part: "body", invertAxis: "xy", translate: [0, -27, 0], submodels: [
    { id: "bone", invertAxis: "xy", translate: [0, 27, 0], rotate: [0, -90, 0], boxes: [{ coordinates: [-1, -4, -7, 2, 2, 6], textureOffset: [0, 0] }] },
    { id: "bow", invertAxis: "xy", translate: [0, 20, 0], rotate: [45, -80, 0], boxes: [{ coordinates: [0, 0, 0, 1, 1, 1], textureOffset: [0, 0] }] },
  ] }] };
  const g = readJem(jem);
  assert.equal(g.skipped.length, 1);
  const cubes = g.parts.flatMap((p) => p.cubes);
  assert.equal(cubes.length, 1);
  // 6 lang in z, nach 90° um y 6 lang in x
  assert.equal(cubes[0].size[0], 6);
  assert.equal(cubes[0].size[2], 2);
  assert.ok(cubes[0].faces.north && cubes[0].faces.east);
});

test("importModel moves the pack's own minecraft textures into the new namespace, vanilla stays", () => {
  const json = (o) => Buffer.from(JSON.stringify(o));
  const zip = new Map([
    ["assets/minecraft/models/item/bow.json", json({ textures: { 1: "item/sa", 2: "item/stick", particle: "item/sa" }, elements: [] })],
    ["assets/minecraft/textures/item/sa.png", Buffer.from("png")],
  ]);
  const { id, files } = importModel(zip, "minecraft:item/bow", "fishy");
  assert.equal(id, "fishy:item/bow");
  const model = JSON.parse(files.get("assets/fishy/models/item/bow.json"));
  assert.equal(model.textures[1], "fishy:item/sa");
  assert.equal(model.textures[2], "item/stick");
  assert.ok(files.has("assets/fishy/textures/item/sa.png"));
});

test("swapModels replaces model ids in a vanilla item definition", () => {
  const def = { type: "minecraft:condition", on_true: { type: "minecraft:model", model: "minecraft:item/bow_pulling_0" }, on_false: { type: "minecraft:model", model: "minecraft:item/bow" } };
  const out = swapModels(def, { "minecraft:item/bow": "fishy:item/bow" });
  assert.equal(out.on_false.model, "fishy:item/bow");
  assert.equal(out.on_true.model, "minecraft:item/bow_pulling_0");
});
