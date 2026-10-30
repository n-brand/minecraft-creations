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
import { FACE_OVERLAYS, armorLayer, costumePieces, faceOverlayModel } from "./costumes.mjs";
import { readModel } from "./lib/javamodel.mjs";
import { blockHat, combineHats, hatModel, mergeHats, shiftHat, transformHat } from "./hats.mjs";
import { recolorRed, tridentDefinition, tridentFlyingModel, tridentModels } from "./trident.mjs";

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
/* --- Eigene Namen (namen.json: Mod-Name → Name im Spiel) --- */
for (const [from, to] of Object.entries(JSON.parse(fs.readFileSync(path.join(here, "namen.json"), "utf8")))) {
  const item = selected.find((i) => i.name === from);
  if (item) item.name = to; else console.log(` - namen.json: unbekannter Name: ${from}`);
}
/* --- Musik-Discs: Länge der Lieder --- */
for (const item of selected) if (item.song) { const ogg = modFiles[item.mod].get(item.song.file); if (ogg) item.song.seconds = oggSeconds(ogg); }

/* --- Mehrblock-Deko: echte Grösse beim Platzieren --- */
for (const item of selected) if (item.kind === "deco") item.scale = decoScale(modFiles[item.mod], item.ns, item.id);
const unknownSizes = applySizes(selected, JSON.parse(fs.readFileSync(path.join(here, "groessen.json"), "utf8")));
if (unknownSizes.length) console.log(` - groessen.json: unbekannte Namen: ${unknownSizes.join(", ")}`);
const scaled = selected.filter((i) => i.scale && i.scale !== 1);

const hutVersatz = JSON.parse(fs.readFileSync(path.join(here, "hut-versatz.json"), "utf8"));

/* --- Kostüm-Optik aus den Mod-Modellen (Funny Pumpkin) --- */
const fpClasses = readZip(fs.readFileSync(sources.mods.funny_pumpkin), (n) => /\/(item|client\/model|client\/renderer)\/[^/]+\.class$/.test(n));
const pieces = costumePieces(fpClasses);
const costumeLayers = new Map();
for (const item of selected) {
  if (item.mod !== "funny_pumpkin" || !item.slot || item.equipment) continue;
  // Gesichts-Schicht ohne Mod-Modell (Vampirzähne)
  if (FACE_OVERLAYS[item.id] && modFiles.funny_pumpkin.has(FACE_OVERLAYS[item.id])) {
    const textureName = FACE_OVERLAYS[item.id].split("/").pop().replace(".png", "");
    item.hat = { model: hatModel(faceOverlayModel(), `halloween:item/hx/costume/${textureName}`), texture: modFiles.funny_pumpkin.get(FACE_OVERLAYS[item.id]), textureName };
    continue;
  }
  // Item-IDs, die in der Mod anders heissen als die Kostüm-Klasse
  const PIECE_ALIASES = { vampire_cloak: "vampire_cloak_chestplate" };
  const piece = pieces.get(PIECE_ALIASES[item.id] || item.id);
  const modelClass = piece && [...fpClasses.keys()].find((k) => k.endsWith(`/client/model/${piece.model}.class`));
  const png = piece && modFiles.funny_pumpkin.get(piece.texture);
  if (!modelClass || !png) continue;
  const javaModel = readModel(fpClasses.get(modelClass));
  // Kopfteile: echtes 3D-Modell auf dem Kopf statt flacher Rüstungs-Optik
  if (item.slot === "head") {
    const textureName = piece.texture.split("/").pop().replace(".png", "");
    const hat = hatModel(javaModel, `halloween:item/hx/costume/${textureName}`);
    if (hat.elements.length) {
      // Grösse (groessen.json) und Versatz (hut-versatz.json) direkt an den Hut-Teilen, damit Kombis mit Augen stimmen
      transformHat(hat, item.headScale ?? 1, hutVersatz[item.name] ?? 0);
      item.hat = { model: hat, texture: png, textureName, adjusted: true };
      continue;
    }
  }
  const layer = armorLayer(javaModel, png, item.slot);
  if (!layer) continue;
  const name = `fp_${item.id}`;
  costumeLayers.set(item.key, { name, layer: item.slot === "legs" ? "humanoid_leggings" : "humanoid", png: layer });
  item.equipment = `halloween:${name}`;
}

/* --- Clown: Nase und Perücke als ein Item ("Clown Wig") --- */
{
  const wig = selected.find((i) => i.key === "funny_pumpkin/clown_wig");
  const nose = pieces.get("clown_nose");
  const nosePng = nose && modFiles.funny_pumpkin.get(nose.texture);
  const noseClass = nose && [...fpClasses.keys()].find((k) => k.endsWith(`/client/model/${nose.model}.class`));
  if (wig?.hat?.texture && nosePng && noseClass) {
    const noseName = nose.texture.split("/").pop().replace(".png", "");
    const noseHat = hatModel(readModel(fpClasses.get(noseClass)), `halloween:item/hx/costume/${noseName}`);
    wig.hat.model = mergeHats([
      { model: noseHat, png: nosePng, texture: `halloween:item/hx/costume/${noseName}` },
      { model: wig.hat.model, png: wig.hat.texture, texture: `halloween:item/hx/costume/${wig.hat.textureName}` },
    ]);
    wig.hat.extra = [{ name: noseName, png: nosePng }];
  }
}

/* --- Vampirhut zusammen mit je einer Augen-Variante: 3 zusätzliche Items --- */
{
  const hat = selected.find((i) => i.key === "funny_pumpkin/vampire_costume_1_helmet");
  for (const n of [1, 2, 3]) {
    const eyes = selected.find((i) => i.key === `funny_pumpkin/vampire_eyes_${n}`);
    if (!hat?.hat?.texture || !eyes?.hat?.texture) continue;
    selected.push({
      ...hat,
      key: `funny_pumpkin/vampire_hat_eyes_${n}`, id: `vampire_hat_eyes_${n}`, name: `Vampire Hat Eyes ${n}`, icon: `funny_pumpkin_vampire_hat_eyes_${n}`,
      hat: { model: combineHats([hat.hat.model, eyes.hat.model]), texture: hat.hat.texture, textureName: hat.hat.textureName, extra: [{ name: eyes.hat.textureName, png: eyes.hat.texture }] },
    });
  }
}

/* --- Kopfteile, die in der Mod 3D-Blöcke sind (z.B. Hexenhut): auf den Kopf setzen --- */
for (const item of selected) if (item.slot === "head" && !item.hat && !item.equipment && isModel3d(modFiles[item.mod], item.ns, item.id)) item.hat = { model: blockHat(item.model, item.headScale ?? 1), texture: null };

/* --- Roter Dreizack: Kopie des goldenen aus „Mein Pack", rot eingefärbt --- */
if (sources.goldenTrident && fs.existsSync(sources.goldenTrident.item) && fs.existsSync(sources.goldenTrident.entity)) {
  const tridentClass = readZip(fs.readFileSync(sources.vanillaJar), (n) => n.endsWith("/projectile/TridentModel.class"));
  const geometry = readModel([...tridentClass.values()][0]);
  const models = tridentModels(geometry, "halloween:item/hx/red_trident_entity");
  selected.push({
    key: "halloween/red_trident", mod: "halloween", ns: "halloween", id: "red_trident", name: "Red Trident", base: "trident",
    slot: null, equipment: null, kind: "other", model: "halloween:item/red_trident", icon: "halloween_red_trident", thrown: "halloween:red_trident_flying",
    definition: tridentDefinition("halloween:item/red_trident", "halloween:item/red_trident_in_hand", "halloween:item/red_trident_throwing"),
    files: [
      ["assets/halloween/textures/item/red_trident.png", recolorRed(fs.readFileSync(sources.goldenTrident.item))],
      ["assets/halloween/textures/item/hx/red_trident_entity.png", recolorRed(fs.readFileSync(sources.goldenTrident.entity))],
      ["assets/halloween/models/item/red_trident.json", Buffer.from(JSON.stringify({ parent: "minecraft:item/generated", textures: { layer0: "halloween:item/red_trident" } }, null, 2))],
      ["assets/halloween/models/item/red_trident_in_hand.json", Buffer.from(JSON.stringify(models.inHand, null, 2))],
      ["assets/halloween/models/item/red_trident_throwing.json", Buffer.from(JSON.stringify(models.throwing, null, 2))],
      // geworfen: Modell für das mitfliegende item_display (Datapack)
      ["assets/halloween/models/item/red_trident_flying.json", Buffer.from(JSON.stringify(tridentFlyingModel(geometry, "halloween:item/hx/red_trident_entity"), null, 2))],
      ["assets/halloween/items/red_trident_flying.json", Buffer.from(JSON.stringify({ model: { type: "minecraft:model", model: "halloween:item/red_trident_flying" } }, null, 2))],
    ],
  });
}

/* --- Hüte verschieben (hut-versatz.json, in Kopf-Pixeln; minus = tiefer) --- */
for (const [name, px] of Object.entries(hutVersatz)) {
  const item = selected.find((i) => i.name === name && i.hat);
  if (item?.hat.adjusted) continue;
  if (item) shiftHat(item.hat.model, px); else console.log(` - hut-versatz.json: unbekannter Hut: ${name}`);
}

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
