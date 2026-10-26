// node server-pack/build.mjs – baut Resource Pack, Datapack, Befehle, Icons und den Seiten-Eintrag.
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { readZip, writeZip } from "./lib/zip.mjs";
import { NAMESPACE, applySizes, buildItemList, giveCommand, oggSeconds } from "./items.mjs";
import { buildResourcePack, decoScale, isModel3d } from "./resourcepack.mjs";
import { checkPack } from "./check.mjs";
import { buildDatapack } from "./datapack.mjs";
import { renderIcon } from "./icons.mjs";
import { entrySource, insertEntry } from "./site-entry.mjs";
import { armorLayer, costumePieces } from "./costumes.mjs";
import { readModel } from "./lib/javamodel.mjs";
import { blockHat, hatModel } from "./hats.mjs";

const here = path.dirname(fileURLToPath(import.meta.url));
const repo = path.dirname(here);
const sources = JSON.parse(fs.readFileSync(path.join(here, "quellen.json"), "utf8"));
const selection = fs.readFileSync(path.join(here, "auswahl.txt"), "utf8").split(/\r?\n/).map((s) => s.trim()).filter(Boolean);

/* --- Quellen lesen --- */
const assetsOnly = (n) => n.startsWith("assets/");
const modFiles = Object.fromEntries(Object.entries(sources.mods).map(([mod, p]) => [mod, readZip(fs.readFileSync(p), assetsOnly)]));
const hatFiles = readZip(fs.readFileSync(sources.hats));
const vanillaFiles = readZip(fs.readFileSync(sources.vanillaJar), (n) => n.startsWith("assets/minecraft/items/") || n.startsWith("assets/minecraft/textures/block/"));
const lang = Object.fromEntries(Object.keys(sources.mods).map((mod) => [mod, JSON.parse(modFiles[mod].get(`assets/${NAMESPACE[mod]}/lang/en_us.json`) || "{}")]));

/* --- Bauen und prüfen --- */
const selected = buildItemList({ selection, lang, is3d: (mod, id) => isModel3d(modFiles[mod], NAMESPACE[mod], id) });
/* --- Musik-Discs: Länge der Lieder --- */
for (const item of selected) if (item.song) { const ogg = modFiles[item.mod].get(item.song.file); if (ogg) item.song.seconds = oggSeconds(ogg); }

/* --- Mehrblock-Deko: echte Grösse beim Platzieren --- */
for (const item of selected) if (item.kind === "deco") item.scale = decoScale(modFiles[item.mod], item.ns, item.id);
const unknownSizes = applySizes(selected, JSON.parse(fs.readFileSync(path.join(here, "groessen.json"), "utf8")));
if (unknownSizes.length) console.log(` - groessen.json: unbekannte Namen: ${unknownSizes.join(", ")}`);
const scaled = selected.filter((i) => i.scale && i.scale !== 1);

/* --- Kostüm-Optik aus den Mod-Modellen (Funny Pumpkin) --- */
const fpClasses = readZip(fs.readFileSync(sources.mods.funny_pumpkin), (n) => /\/(item|client\/model)\/[^/]+\.class$/.test(n));
const pieces = costumePieces(fpClasses);
const costumeLayers = new Map();
for (const item of selected) {
  if (item.mod !== "funny_pumpkin" || !item.slot || item.equipment) continue;
  const piece = pieces.get(item.id);
  const modelClass = piece && [...fpClasses.keys()].find((k) => k.endsWith(`/client/model/${piece.model}.class`));
  const png = piece && modFiles.funny_pumpkin.get(piece.texture);
  if (!modelClass || !png) continue;
  const javaModel = readModel(fpClasses.get(modelClass));
  // Kopfteile: echtes 3D-Modell auf dem Kopf statt flacher Rüstungs-Optik
  if (item.slot === "head") {
    const textureName = piece.texture.split("/").pop().replace(".png", "");
    const hat = hatModel(javaModel, `halloween:item/hx/costume/${textureName}`);
    if (hat.elements.length) { item.hat = { model: hat, texture: png, textureName }; continue; }
  }
  const layer = armorLayer(javaModel, png, item.slot);
  if (!layer) continue;
  const name = `fp_${item.id}`;
  costumeLayers.set(item.key, { name, layer: item.slot === "legs" ? "humanoid_leggings" : "humanoid", png: layer });
  item.equipment = `halloween:${name}`;
}

/* --- Kopfteile, die in der Mod 3D-Blöcke sind (z.B. Hexenhut): auf den Kopf setzen --- */
for (const item of selected) if (item.slot === "head" && !item.hat && !item.equipment && isModel3d(modFiles[item.mod], item.ns, item.id)) item.hat = { model: blockHat(item.model, item.headScale ?? 1), texture: null };

const { files, items } = buildResourcePack({ items: selected, modFiles, vanillaFiles, hatFiles, costumeLayers });
const problems = checkPack(files);
const caseCount = [...files.keys()].filter((p) => p.startsWith("assets/minecraft/items/")).reduce((n, p) => n + JSON.parse(files.get(p)).model.cases.length, 0);
console.log(`${caseCount} Item-Modelle geprüft, ${problems.length} Probleme`);
if (problems.length) {
  problems.forEach((p) => console.log(" - " + p));
  process.exit(1);
}
const datapack = buildDatapack({ items });

/* --- Schreiben --- */
fs.writeFileSync(sources.resourcepackOut, writeZip(files));
fs.writeFileSync(sources.datapackOut, writeZip(datapack));

const out = path.join(here, "out");
fs.mkdirSync(out, { recursive: true });
const rows = items.map((i) => ({ name: i.name, base: i.base, kind: i.kind, cmd: giveCommand(i) }));
fs.writeFileSync(path.join(out, "befehle.json"), JSON.stringify(rows, null, 2));
fs.writeFileSync(path.join(out, "items.json"), JSON.stringify(items.map(({ key, name, base, slot, equipment, kind, scale, song }) => ({ key, name, base, slot, equipment, kind, scale, song: song && { event: song.event, seconds: song.seconds } })), null, 2));
fs.writeFileSync(path.join(out, "BEFEHLE.md"), "# Server Pack 2026 – Befehle\n\n| Name | Grund-Item | Befehl |\n|---|---|---|\n" + rows.map((r) => `| ${r.name} | ${r.base} | \`${r.cmd}\` |`).join("\n") + "\n");

const iconDir = path.join(repo, "images", "server-pack-2026");
fs.mkdirSync(iconDir, { recursive: true });
let icons = 0;
for (const item of items) {
  const png = renderIcon(item.model, files, 64);
  if (png) { fs.writeFileSync(path.join(iconDir, item.icon + ".png"), png); icons++; } else console.log(" - kein Icon: " + item.name);
}
const cover = renderIcon("funny_pumpkin:item/pumpkin_candle", files, 256);
if (cover) fs.writeFileSync(path.join(repo, "images", "server-pack-2026.png"), cover);

const itemsJs = path.join(repo, "data", "items.js");
fs.writeFileSync(itemsJs, insertEntry(fs.readFileSync(itemsJs, "utf8"), entrySource(items)));

const count = (k) => items.filter((i) => i.kind === k).length;
console.log(`Deko vergrössert: ${scaled.map((i) => `${i.name} ×${i.scale}`).join(", ")}`);
console.log(`3D-Hüte: ${selected.filter((i) => i.hat).map((i) => i.name).join(", ")}`);
console.log(`Kostüm-Optik aus Mod-Modellen: ${costumeLayers.size} Teile (${[...costumeLayers.keys()].map((k) => k.split("/")[1]).join(", ")})`);
console.log(`${items.length} Items (Kostüme ${count("costume")}, Deko ${count("deco")}, Essen ${count("food")}), ${icons} Icons, Datapack ${datapack.size} Dateien`);
console.log(`Resource Pack → ${sources.resourcepackOut}`);
console.log(`Datapack → ${sources.datapackOut}`);
