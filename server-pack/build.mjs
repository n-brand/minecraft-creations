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
import { meinPackFood } from "./meinpack.mjs";
import { tridentDefinition, tridentFlyingModel, tridentModels } from "./trident.mjs";
import { importModel, readJem, swapModels } from "./weapons.mjs";

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

/* --- Waffen aus fremden Packs (quellen.json → weapons) --- */
const W = sources.weapons || {};
const asJson = (o) => Buffer.from(JSON.stringify(o, null, 2));
const slugOf = (name) => name.toLowerCase().replace(/[^a-z0-9]+/g, "_").replace(/^_|_$/g, "");
// Dateinamen mit Leerzeichen vor .json (z.B. "bow_pulling_0 .json") wie gemeint lesen
const readPack = (p) => new Map([...readZip(fs.readFileSync(p))].map(([k, v]) => [k.replace(/ +.json$/, ".json"), v]));
const weapon = (o) => ({ slot: null, equipment: null, kind: "weapon", ...o });

// Dreizacke: OptiFine-Modell → 3D in der Hand, Wurf über das mitfliegende Modell (wie früher beim roten Dreizack)
// Vanilla-Dreizack als Hülle fürs fliegende Modell (verdeckt den türkisen Wurf-Dreizack ganz)
const vanillaTrident = (W.tridents || []).length ? readModel([...readZip(fs.readFileSync(sources.vanillaJar), (n) => n.endsWith("/projectile/TridentModel.class")).values()][0]) : null;
for (const t of W.tridents || []) {
  if (!fs.existsSync(t.zip)) { console.log(` - Dreizack fehlt: ${t.zip}`); continue; }
  const zip = readPack(t.zip);
  const jem = JSON.parse(zip.get("assets/minecraft/optifine/cem/trident.jem"));
  const tex = jem.models?.[0]?.texture || jem.texture;
  const texPath = tex.startsWith("textures/") ? `assets/minecraft/${tex}` : `assets/minecraft/optifine/cem/${tex}`;
  const geometry = readJem(jem);
  if (geometry.skipped.length) console.log(` - ${t.name}: schräge Teile weggelassen (${geometry.skipped.join(", ")})`);
  const id = slugOf(t.name), ns = "weapons", entityTex = `${ns}:item/hx/${id}_entity`;
  const models = tridentModels(geometry, entityTex);
  selected.push(weapon({
    key: `tridents/${id}`, mod: "tridents", ns, id, name: t.name, base: "trident", model: `${ns}:item/${id}`, icon: `tridents_${id}`, thrown: `${ns}:${id}_flying`,
    definition: tridentDefinition(`${ns}:item/${id}`, `${ns}:item/${id}_in_hand`, `${ns}:item/${id}_throwing`),
    files: [
      [`assets/${ns}/textures/item/${id}.png`, zip.get("assets/minecraft/textures/item/trident.png")],
      [`assets/${ns}/textures/item/hx/${id}_entity.png`, zip.get(texPath)],
      [`assets/${ns}/models/item/${id}.json`, asJson({ parent: "minecraft:item/generated", textures: { layer0: `${ns}:item/${id}` } })],
      [`assets/${ns}/models/item/${id}_in_hand.json`, asJson(models.inHand)],
      [`assets/${ns}/models/item/${id}_throwing.json`, asJson(models.throwing)],
      [`assets/${ns}/models/item/${id}_flying.json`, asJson(tridentFlyingModel(geometry, entityTex, vanillaTrident))],
      [`assets/${ns}/items/${id}_flying.json`, asJson({ model: { type: "minecraft:model", model: `${ns}:item/${id}_flying` } })],
    ],
  }));
}

// Mine Cells 3D Weapons: jedes Modell auf dem Netheritschwert
// zusätzliche Grund-Items für einzelne Waffen (gleicher Name, gleiches Modell)
const MINE_CELLS_EXTRA_BASES = { tentacle: ["end_rod"] };
const MINE_CELLS_NAMES = { assassins_dagger: "Assassin's Dagger", hattoris_katana: "Hattori's Katana", flint: "The Flint", tentacle: "Tentacle D***o" };
if (W.mineCells && fs.existsSync(W.mineCells)) {
  const zip = readPack(W.mineCells);
  for (const p of [...zip.keys()].filter((k) => /^assets\/minecells\/models\/item\/[^/]+\.json$/.test(k)).sort()) {
    const id = path.basename(p, ".json");
    const { id: model, files } = importModel(zip, `minecells:item/${id}`, "minecells");
    const name = MINE_CELLS_NAMES[id] || id.split("_").map((w) => w[0].toUpperCase() + w.slice(1)).join(" ");
    for (const base of ["netherite_sword", ...(MINE_CELLS_EXTRA_BASES[id] || [])]) {
      const suffix = base === "netherite_sword" ? "" : `_${base}`;
      selected.push(weapon({ key: `mine_cells/${id}${suffix}`, mod: "mine_cells", ns: "minecells", id, name, base, model, icon: `mine_cells_${id}${suffix}`, files: [...files] }));
    }
  }
}

// Fishy Weapons: Bogen, Armbrust (mit Spann-Stufen), Streitkolben (Rakete auf Wunsch raus) – Vanilla-Definition mit eigenen Modellen
const FISHY = [
  ["Fishy Bow", "bow", ["bow", "bow_pulling_0", "bow_pulling_1", "bow_pulling_2"]],
  ["Fishy Crossbow", "crossbow", ["crossbow", "crossbow_arrow", "crossbow_firework", "crossbow_pulling_0", "crossbow_pulling_1", "crossbow_pulling_2"]],
  ["Fishy Mace", "mace", ["mace"]],
];
if (W.fishy && fs.existsSync(W.fishy)) {
  const zip = readPack(W.fishy);
  for (const [name, base, ids] of FISHY) {
    const files = new Map(), map = {};
    for (const m of ids) map[`minecraft:item/${m}`] = importModel(zip, `minecraft:item/${m}`, "fishy", files).id;
    const vanilla = JSON.parse(vanillaFiles.get(`assets/minecraft/items/${base}.json`)).model;
    const id = slugOf(name);
    selected.push(weapon({ key: `fishy/${id}`, mod: "fishy", ns: "fishy", id, name, base, model: map[`minecraft:item/${base}`], icon: `fishy_${id}`, definition: swapModels(vanilla, map), files: [...files] }));
  }
}

/* --- Essen aus „Mein Pack“ (nur Essen, Namen wie dort) --- */
if (sources.meinPack && fs.existsSync(sources.meinPack)) selected.push(...meinPackFood(sources.meinPack));

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
