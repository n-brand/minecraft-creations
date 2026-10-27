import { test } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import { readZip } from "../lib/zip.mjs";
import { readModel } from "../lib/javamodel.mjs";
import { hatModel } from "../hats.mjs";

const pose = (x = 0, y = 0, z = 0, rx = 0, ry = 0, rz = 0) => ({ x, y, z, rx, ry, rz });
const cube = (from, size, uv = [0, 0], inflate = 0) => ({ from, size, uv, inflate, mirror: false });

test("a plain head cube lands on the item head box (x mirrored, y up)", () => {
  const model = { texW: 64, texH: 64, parts: [{ name: "head", parent: "root", pose: pose(), cubes: [cube([-4, -8, -4], [8, 8, 8])] }] };
  const m = hatModel(model, "halloween:item/hx/costume/t");
  assert.equal(m.elements.length, 1);
  assert.deepEqual(m.elements[0].from, [4, 4, 4]);
  assert.deepEqual(m.elements[0].to, [12, 12, 12]);
  assert.deepEqual(m.display.head.scale, [1.6, 1.6, 1.6]);
  assert.equal(m.textures["0"], "halloween:item/hx/costume/t");
});

test("box texture layout maps to the right faces", () => {
  const model = { texW: 64, texH: 64, parts: [{ name: "head", parent: "root", pose: pose(), cubes: [cube([-4, -8, -4], [8, 8, 8], [0, 0])] }] };
  const f = hatModel(model, "t").elements[0].faces;
  // in 16ths of a 64px texture: 1px = 0.25
  assert.deepEqual(f.up.uv, [2, 0, 4, 2]);     // top region (u+d, v)
  assert.deepEqual(f.north.uv, [2, 2, 4, 4]);  // front region (u+d, v+d)
  assert.deepEqual(f.east.uv, [0, 2, 2, 4]);   // right region (u, v+d)
  assert.deepEqual(f.west.uv, [4, 2, 6, 4]);   // left region (u+d+w, v+d)
  assert.deepEqual(f.south.uv, [6, 2, 8, 4]);  // back region (u+2d+w, v+d)
});

test("inflate grows the box on every side", () => {
  const model = { texW: 64, texH: 64, parts: [{ name: "head", parent: "root", pose: pose(), cubes: [cube([-4, -8, -4], [8, 8, 8], [0, 0], 0.5)] }] };
  const e = hatModel(model, "t").elements[0];
  assert.deepEqual(e.from, [3.5, 3.5, 3.5]);
  assert.deepEqual(e.to, [12.5, 12.5, 12.5]);
});

test("rotated child parts keep their pivot and turn the right way", () => {
  // child at pose (0,-9,0) rotated 30° around Java z: G = 180° about z keeps z rotations
  const model = { texW: 64, texH: 64, parts: [
    { name: "head", parent: "root", pose: pose(), cubes: [] },
    { name: "brim", parent: "head", pose: pose(0, -9, 0, 0, 0, Math.PI / 6), cubes: [cube([-2, 0, -2], [4, 1, 4])] },
  ] };
  const e = hatModel(model, "t").elements[0];
  assert.deepEqual(e.rotation.origin, [8, 13, 8]);
  assert.ok(Math.abs(e.rotation.z - 30) < 1e-6 && Math.abs(e.rotation.x) < 1e-6 && Math.abs(e.rotation.y) < 1e-6, JSON.stringify(e.rotation));
  // Java x rotation flips sign under the 180° turn
  const m2 = { ...model, parts: [model.parts[0], { ...model.parts[1], pose: pose(0, -9, 0, Math.PI / 6, 0, 0) }] };
  assert.ok(Math.abs(hatModel(m2, "t").elements[0].rotation.x + 30) < 1e-6);
});

test("only the head part of a full costume model is used", () => {
  const model = { texW: 64, texH: 64, parts: [
    { name: "head", parent: "root", pose: pose(), cubes: [cube([-4, -8, -4], [8, 8, 8])] },
    { name: "body", parent: "root", pose: pose(), cubes: [cube([-4, 0, -2], [8, 12, 4])] },
  ] };
  assert.equal(hatModel(model, "t").elements.length, 1);
});

const FP = "C:/Users/nicol/Downloads/funny_pumpkin-1.2.3-forge-1.20.1.jar";
test("real witch hat becomes a 3D model with all its pieces", { skip: !fs.existsSync(FP) }, () => {
  const f = readZip(fs.readFileSync(FP), (n) => n.endsWith("client/model/ModelWitch_Hat2.class"));
  const m = hatModel(readModel([...f.values()][0]), "t");
  assert.equal(m.elements.length, 6);
  for (const e of m.elements) for (const v of [...e.from, ...e.to]) assert.ok(v >= -16 && v <= 32, String(v));
});

test("blockHat puts a block model on top of the head", async () => {
  const { blockHat } = await import("../hats.mjs");
  assert.deepEqual(blockHat("decoween:item/witch_hat"), { parent: "decoween:item/witch_hat", display: { head: { rotation: [0, 0, 0], translation: [0, 14.4, 0], scale: [1, 1, 1] } } });
});

test("blockHat keeps the brim on the head when scaled", async () => {
  const { blockHat } = await import("../hats.mjs");
  const h = blockHat("m", 1.3).display.head;
  assert.deepEqual(h.scale, [1.3, 1.3, 1.3]);
  assert.ok(Math.abs(h.translation[1] - 16.8) < 1e-9);
});

test("mergeHats keeps each piece from the texture where it is painted", async () => {
  const { mergeHats } = await import("../hats.mjs");
  const { encodePng } = await import("../lib/png.mjs");
  // 16x16 textures: nose painted at the top-left, wig painted at the bottom-right
  const paint = (x0, y0) => encodePng({ w: 16, h: 16, data: Buffer.alloc(16 * 16 * 4).map((_, i) => { const p = Math.floor(i / 4), x = p % 16, y = Math.floor(p / 16); return x >= x0 && x < x0 + 8 && y >= y0 && y < y0 + 8 ? 255 : 0; }) });
  const el = (u) => ({ from: [0, 0, 0], to: [1, 1, 1], faces: { north: { uv: [u, u, u + 8, u + 8], texture: "#0" } } });
  const shape = { textures: { 0: "a" }, elements: [{ ...el(0), from: [7, 5, 1] }, { ...el(8), from: [2, 6, 6] }], display: { head: { scale: [1.6, 1.6, 1.6] } } };
  const merged = mergeHats([{ model: shape, png: paint(0, 0), texture: "x:nose" }, { model: shape, png: paint(8, 8), texture: "x:wig" }]);
  assert.deepEqual(merged.textures, { 0: "x:nose", 1: "x:wig", particle: "x:wig" });
  assert.equal(merged.elements.length, 2);
  assert.equal(merged.elements[0].faces.north.texture, "#0");
  assert.equal(merged.elements[1].faces.north.texture, "#1");
});

test("combineHats puts different hat models together, each with its own texture", async () => {
  const { combineHats } = await import("../hats.mjs");
  const hat = { textures: { 0: "x:hat", particle: "x:hat" }, elements: [{ from: [4, 12, 4], to: [12, 20, 12], faces: { up: { uv: [0, 0, 1, 1], texture: "#0" } } }], display: { head: { scale: [1.6, 1.6, 1.6] } } };
  const eyes = { textures: { 0: "x:eyes", particle: "x:eyes" }, elements: [{ from: [3.95, 3.95, 3.95], to: [12.05, 12.05, 12.05], faces: { north: { uv: [0, 0, 1, 1], texture: "#0" } } }], display: { head: { scale: [1.6, 1.6, 1.6] } } };
  const m = combineHats([hat, eyes]);
  assert.deepEqual(m.textures, { 0: "x:hat", 1: "x:eyes", particle: "x:hat" });
  assert.equal(m.elements.length, 2);
  assert.equal(m.elements[0].faces.up.texture, "#0");
  assert.equal(m.elements[1].faces.north.texture, "#1");
  assert.deepEqual(m.display, hat.display);
});

test("shiftHat moves a hat by head pixels (1 head pixel = 1.6 display units)", async () => {
  const { shiftHat } = await import("../hats.mjs");
  const m = { display: { head: { rotation: [0, 0, 0], translation: [0, 0, 0], scale: [1.6, 1.6, 1.6] } } };
  shiftHat(m, -1);
  assert.ok(Math.abs(m.display.head.translation[1] + 1.6) < 1e-9);
  const b = { display: { head: { rotation: [0, 0, 0], translation: [0, 14.4, 0], scale: [1, 1, 1] } } };
  shiftHat(b, 2);
  assert.ok(Math.abs(b.display.head.translation[1] - 17.6) < 1e-9);
});
