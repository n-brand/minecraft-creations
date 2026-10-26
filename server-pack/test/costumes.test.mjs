import { test } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import { encodePng, decodePng } from "../lib/png.mjs";
import { readZip } from "../lib/zip.mjs";
import { armorLayer, costumePieces } from "../costumes.mjs";

// 64x64 texture: everything red, so any copied pixel is visible
const red = encodePng({ w: 64, h: 64, data: Buffer.alloc(64 * 64 * 4).map((_, i) => [220, 20, 20, 255][i % 4]) });
const px = (img, x, y) => [...img.data.subarray((y * img.w + x) * 4, (y * img.w + x) * 4 + 4)];
const part = (name, cubes) => ({ name, parent: "root", pose: { x: 0, y: 0, z: 0, rx: 0, ry: 0, rz: 0 }, cubes });
const cube = (from, size, inflate = 0) => ({ from, size, uv: [0, 0], inflate, mirror: false });

test("chest piece: body and arm boxes land on the armor layout", () => {
  const model = { texW: 64, texH: 64, parts: [part("body", [cube([-4, 0, -2], [8, 12, 4])]), part("right_arm", [cube([-3, -2, -2], [4, 12, 4])])] };
  const img = decodePng(armorLayer(model, red, "chest"));
  assert.equal(img.w, 64);
  assert.equal(img.h, 32);
  assert.deepEqual(px(img, 20, 20), [220, 20, 20, 255]); // body front (u 20..28, v 20..32)
  assert.deepEqual(px(img, 44, 20), [220, 20, 20, 255]); // arm front (u 44..48)
  assert.equal(px(img, 2, 2)[3], 0); // head stays empty
});

test("boxes that do not match the armor shape are ignored", () => {
  const model = { texW: 64, texH: 64, parts: [part("body", [cube([-4.5, 5, 2.8], [9, 15, 0])])] };
  assert.equal(armorLayer(model, red, "chest"), null);
});

test("taller robe boxes are cut at the armor height", () => {
  const model = { texW: 64, texH: 64, parts: [part("body", [cube([-4, 0, -2], [8, 16, 4])])] };
  const img = decodePng(armorLayer(model, red, "chest"));
  assert.deepEqual(px(img, 20, 31), [220, 20, 20, 255]);
});

test("boots sit at the bottom of the leg", () => {
  const model = { texW: 64, texH: 64, parts: [part("right_leg", [cube([-2, 7, -2], [4, 5, 4])])] };
  const img = decodePng(armorLayer(model, red, "feet"));
  assert.equal(px(img, 4, 21)[3], 0); // upper leg empty
  assert.deepEqual(px(img, 4, 30), [220, 20, 20, 255]); // lower leg filled
});

const FP = "C:/Users/nicol/Downloads/funny_pumpkin-1.2.3-forge-1.20.1.jar";
test("costume pieces are found per item id in the mod", { skip: !fs.existsSync(FP) }, () => {
  const files = readZip(fs.readFileSync(FP));
  const pieces = costumePieces(files);
  assert.deepEqual(pieces.get("cultist_costume_chestplate"), { model: "Modelcultist_costume", texture: "assets/funny_pumpkin/textures/entities/cultist_costume.png" });
  assert.deepEqual(pieces.get("witch_costume_leggings"), { model: "ModelCostume_Legs", texture: "assets/funny_pumpkin/textures/entities/witch_leggings.png" });
  assert.ok(pieces.has("vampire_costume_1_boots"));
});
