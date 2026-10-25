import { test } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import { readZip, writeZip } from "../lib/zip.mjs";
import { decodePng, encodePng } from "../lib/png.mjs";

const HH_JAR = "C:\\Users\\nicol\\Downloads\\happyhallows-1.21.1-4.jar";

test("writeZip and readZip round-trip", () => {
  const zip = writeZip(new Map([["a.txt", "hi"], ["dir/b.json", "{}"]]));
  const back = readZip(zip);
  assert.equal(back.get("a.txt").toString(), "hi");
  assert.equal(back.get("dir/b.json").toString(), "{}");
  assert.equal(back.size, 2);
});

test("readZip reads a real mod jar", { skip: !fs.existsSync(HH_JAR) }, () => {
  const files = readZip(fs.readFileSync(HH_JAR));
  assert.ok(files.has("assets/happyhallows/lang/en_us.json"));
  assert.ok(JSON.parse(files.get("assets/happyhallows/lang/en_us.json")));
});

test("encodePng and decodePng round-trip", () => {
  const data = Buffer.from([255, 0, 0, 255, 0, 255, 0, 128, 0, 0, 255, 0, 10, 20, 30, 255]);
  const img = decodePng(encodePng({ w: 2, h: 2, data }));
  assert.equal(img.w, 2);
  assert.equal(img.h, 2);
  assert.deepEqual([...img.data], [...data]);
});

test("decodePng reads a mod texture", { skip: !fs.existsSync(HH_JAR) }, () => {
  const files = readZip(fs.readFileSync(HH_JAR));
  const img = decodePng(files.get("assets/happyhallows/textures/block/candelabra_red.png"));
  assert.ok(img.w > 0 && img.data.length === img.w * img.h * 4);
});
