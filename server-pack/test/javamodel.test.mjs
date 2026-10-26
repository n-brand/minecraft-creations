import { test } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import { readZip } from "../lib/zip.mjs";
import { readModel } from "../lib/javamodel.mjs";

const FP = "C:/Users/nicol/Downloads/funny_pumpkin-1.2.3-forge-1.20.1.jar";

test("reads the cultist costume geometry from the mod class", { skip: !fs.existsSync(FP) }, () => {
  const files = readZip(fs.readFileSync(FP), (n) => n.endsWith("client/model/Modelcultist_costume.class"));
  const m = readModel([...files.values()][0]);
  assert.equal(m.texW, 128);
  assert.equal(m.texH, 128);
  const body = m.parts.find((p) => p.name === "body");
  assert.deepEqual(body.cubes.map((c) => [c.uv, c.size]), [[[24, 37], [8, 5, 4]], [[0, 22], [8, 16, 4]], [[50, 35], [6, 15, 0]], [[0, 42], [9, 15, 0]]]);
  assert.deepEqual(m.parts.find((p) => p.name === "right_arm").pose, { x: -5, y: 2, z: 0, rx: 0, ry: 0, rz: 0 });
  assert.equal(m.parts.find((p) => p.name === "cube_r1").parent, "head");
});

test("every funny pumpkin model class can be read", { skip: !fs.existsSync(FP) }, () => {
  const files = readZip(fs.readFileSync(FP), (n) => /client\/model\/Model[^$]*\.class$/.test(n));
  for (const [name, buf] of files) assert.ok(readModel(buf).parts.length > 0, name);
});
