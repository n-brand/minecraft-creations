import { test } from "node:test";
import assert from "node:assert/strict";
import { encodePng, decodePng } from "../lib/png.mjs";
import { recolorRed, tridentModels } from "../trident.mjs";
import { checkPack } from "../check.mjs";

test("recolorRed turns gold into red and keeps brightness and transparency", () => {
  const gold = encodePng({ w: 2, h: 1, data: Buffer.from([230, 180, 40, 255, 0, 0, 0, 0]) });
  const img = decodePng(recolorRed(gold));
  const [r, g, b, a] = img.data;
  assert.ok(r > 200 && g < 60 && b < 60, `${r},${g},${b}`);
  assert.equal(a, 255);
  assert.equal(img.data[7], 0);
});

const geometry = { texW: 32, texH: 32, parts: [
  { name: "pole", parent: "root", pose: { x: 0, y: 0, z: 0, rx: 0, ry: 0, rz: 0 }, cubes: [{ from: [-0.5, 2, -0.5], size: [1, 25, 1], uv: [0, 6], inflate: 0, mirror: false }] },
  { name: "middle_spike", parent: "pole", pose: { x: 0, y: 0, z: 0, rx: 0, ry: 0, rz: 0 }, cubes: [{ from: [-0.5, -4, -0.5], size: [1, 4, 1], uv: [0, 0], inflate: 0, mirror: false }] },
] };

test("tridentModels builds hand and throw models in the special renderer's space", () => {
  const m = tridentModels(geometry, "halloween:entity/red_trident");
  assert.equal(m.inHand.parent, "minecraft:item/trident_in_hand");
  assert.equal(m.throwing.parent, "minecraft:item/trident_throwing");
  // special renderer draws the entity model flipped in y and z
  assert.deepEqual(m.inHand.elements[0].from, [-0.5, -27 + 16, -0.5]);
  assert.deepEqual(m.inHand.elements[0].to, [0.5, -2 + 16, 0.5]);
  assert.equal(m.inHand.textures["0"], "halloween:entity/red_trident");
});

test("red trident item definition: icon in gui, 3D model in hand, throw pose while using", async () => {
  const { tridentDefinition } = await import("../trident.mjs");
  const def = tridentDefinition("halloween:item/red_trident", "halloween:item/red_trident_in_hand", "halloween:item/red_trident_throwing");
  assert.equal(def.type, "minecraft:select");
  assert.deepEqual(def.cases[0].when, ["gui", "ground", "fixed", "on_shelf"]);
  assert.equal(def.cases[0].model.model, "halloween:item/red_trident");
  assert.equal(def.fallback.on_false.model, "halloween:item/red_trident_in_hand");
  assert.equal(def.fallback.on_true.model, "halloween:item/red_trident_throwing");
});

test("checkPack follows condition models too", () => {
  const json = (o) => Buffer.from(JSON.stringify(o));
  const files = new Map([
    ["assets/minecraft/items/trident.json", json({ model: { type: "minecraft:select", property: "minecraft:component", component: "minecraft:custom_name", cases: [{ when: "Red Trident", model: { type: "minecraft:condition", property: "minecraft:using_item", on_true: { type: "minecraft:model", model: "halloween:item/missing" }, on_false: { type: "minecraft:model", model: "minecraft:item/trident" } } }], fallback: { type: "minecraft:model", model: "minecraft:item/trident" } } })],
  ]);
  assert.ok(checkPack(files).some((p) => p.includes("halloween:item/missing")));
});

test("trident models stay inside the allowed -16..32 range, the definition moves them back", async () => {
  const { tridentDefinition, TRIDENT_SHIFT } = await import("../trident.mjs");
  const real = { texW: 32, texH: 32, parts: [{ name: "pole", parent: "root", pose: { x: 0, y: 0, z: 0, rx: 0, ry: 0, rz: 0 }, cubes: [{ from: [-0.5, -4, -0.5], size: [1, 31, 1], uv: [0, 0], inflate: 0, mirror: false }] }] };
  const m = tridentModels(real, "t");
  for (const e of m.inHand.elements) for (const v of [...e.from, ...e.to]) assert.ok(v >= -16 && v <= 32, String(v));
  const def = tridentDefinition("i", "h", "t");
  assert.deepEqual(def.fallback.transformation.translation, [0, -TRIDENT_SHIFT / 16, 0]);
});

test("checkPack reports elements outside the -16..32 range", () => {
  const json = (o) => Buffer.from(JSON.stringify(o));
  const files = new Map([
    ["assets/minecraft/items/stick.json", json({ model: { type: "minecraft:select", property: "minecraft:component", component: "minecraft:custom_name", cases: [{ when: "Long", model: { type: "minecraft:model", model: "x:item/long" } }], fallback: { type: "minecraft:model", model: "minecraft:item/stick" } } })],
    ["assets/x/models/item/long.json", json({ textures: { 0: "x:item/t" }, elements: [{ from: [0, -27, 0], to: [1, 0, 1], faces: { north: { uv: [0, 0, 1, 1], texture: "#0" } } }] })],
    ["assets/x/textures/item/t.png", Buffer.from("png")],
  ]);
  assert.ok(checkPack(files).some((p) => p.includes("ausserhalb")));
});
