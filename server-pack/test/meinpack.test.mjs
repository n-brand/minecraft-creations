import { test } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { meinPackFood } from "../meinpack.mjs";

const write = (dir, rel, o) => { const p = path.join(dir, rel); fs.mkdirSync(path.dirname(p), { recursive: true }); fs.writeFileSync(p, typeof o === "string" ? o : JSON.stringify(o)); };
const sel = (cases) => ({ model: { type: "minecraft:select", property: "minecraft:component", component: "minecraft:custom_name", cases, fallback: { type: "minecraft:model", model: "minecraft:item/x" } } });

test("meinPackFood takes food names with their models and textures, skips coins, bundles and the pill", () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), "mp-"));
  write(dir, "assets/minecraft/items/bread.json", sel([{ when: "Brownie", model: { type: "minecraft:model", model: "food:item/brownie" } }]));
  write(dir, "assets/minecraft/items/dried_kelp.json", sel([{ when: "Pill", model: { type: "minecraft:model", model: "food:item/pill" } }]));
  write(dir, "assets/minecraft/items/gold_nugget.json", sel([{ when: "Gold Coin", model: { type: "minecraft:model", model: "food:item/coin" } }]));
  write(dir, "assets/food/models/item/brownie.json", { parent: "minecraft:item/generated", textures: { layer0: "food:item/brownie" } });
  write(dir, "assets/food/textures/item/brownie.png", "png");
  const items = meinPackFood(dir);
  assert.deepEqual(items.map((i) => i.name), ["Brownie"]);
  const [b] = items;
  assert.equal(b.base, "bread");
  assert.equal(b.kind, "food");
  assert.equal(b.model, "food:item/brownie");
  assert.deepEqual(b.files.map(([p]) => p).sort(), ["assets/food/models/item/brownie.json", "assets/food/textures/item/brownie.png"]);
});
