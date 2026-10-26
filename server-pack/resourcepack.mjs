// Resource Pack: Modelle und Texturen aus den Mods kopieren, Item-Definitionen pro Grund-Item bauen.
import { equipmentFor } from "./items.mjs";
import { decodePng, encodePng } from "./lib/png.mjs";

/* --- Flügel-Textur auf Elytren-Form (64×32) umbauen --- */
// Elytren-Flügel: Vorderseite u 24–34, Rückseite u 36–46, je v 2–22 (10×20)
export function elytraTexture(src) {
  const img = decodePng(src);
  let x0 = img.w, y0 = img.h, x1 = -1, y1 = -1;
  for (let y = 0; y < img.h; y++) for (let x = 0; x < img.w / 2; x++) {
    if (img.data[(y * img.w + x) * 4 + 3] === 0) continue;
    x0 = Math.min(x0, x); y0 = Math.min(y0, y); x1 = Math.max(x1, x); y1 = Math.max(y1, y);
  }
  const out = Buffer.alloc(64 * 32 * 4);
  if (x1 < 0) return encodePng({ w: 64, h: 32, data: out });
  const w = x1 - x0 + 1, h = y1 - y0 + 1, rotate = w > h;
  for (const faceU of [24, 36]) {
    for (let v = 0; v < 20; v++) for (let u = 0; u < 10; u++) {
      // breites Motiv um 90° drehen, damit der Flügel nach unten hängt
      const sx = rotate ? x0 + Math.floor((v / 20) * w) : x0 + Math.floor((u / 10) * w);
      const sy = rotate ? y0 + Math.floor(((9 - u) / 10) * h) : y0 + Math.floor((v / 20) * h);
      img.data.copy(out, ((2 + v) * 64 + faceU + u) * 4, (sy * img.w + sx) * 4, (sy * img.w + sx) * 4 + 4);
    }
  }
  return encodePng({ w: 64, h: 32, data: out });
}

const split = (id, defNs = "minecraft") => (id.includes(":") ? id.split(":") : [defNs, id]);
const json = (o) => JSON.stringify(o, null, 2);

/* --- Modelle lesen --- */
const modelPath = (ns, p) => `assets/${ns}/models/${p}.json`;

export function isModel3d(files, ns, id) {
  for (let cur = `${ns}:item/${id}`, n = 0; cur && n < 12; n++) {
    const [mns, p] = split(cur);
    if (mns === "minecraft") return !/item\/(generated|handheld)/.test(p);
    const buf = files.get(modelPath(mns, p));
    if (!buf) return false;
    const j = JSON.parse(buf);
    if (j.elements) return true;
    cur = j.parent;
  }
  return false;
}

export function buildResourcePack({ items, modFiles, vanillaFiles, hatFiles, costumeLayers = new Map() }) {
  const out = new Map();
  const copied = new Set();

  /* --- Texturen: alles in den Item-Atlas --- */
  function copyTexture(src, texId) {
    const [ns, p] = split(texId);
    if (ns === "minecraft") {
      if (p.startsWith("item/")) return texId;
      const v = vanillaFiles.get(`assets/minecraft/textures/${p}.png`);
      if (!v) return texId;
      const id = `halloween:item/hx/vanilla/${p}`;
      out.set(`assets/halloween/textures/item/hx/vanilla/${p}.png`, v);
      return id;
    }
    const newPath = p.startsWith("item/") ? p : `item/hx/${p}`;
    const file = src.get(`assets/${ns}/textures/${p}.png`);
    if (file) {
      out.set(`assets/${ns}/textures/${newPath}.png`, file);
      const meta = src.get(`assets/${ns}/textures/${p}.png.mcmeta`);
      if (meta) out.set(`assets/${ns}/textures/${newPath}.png.mcmeta`, meta);
    }
    return `${ns}:${newPath}`;
  }

  function copyModel(src, modelId) {
    const [ns, p] = split(modelId);
    if (ns === "minecraft" || copied.has(`${ns}:${p}`)) return;
    copied.add(`${ns}:${p}`);
    const buf = src.get(modelPath(ns, p));
    if (!buf) return;
    const j = JSON.parse(buf);
    delete j.render_type;
    delete j.loader;
    for (const k of Object.keys(j.textures || {})) {
      const v = j.textures[k];
      if (v.endsWith("/")) delete j.textures[k];
      else if (!v.startsWith("#")) j.textures[k] = copyTexture(src, v);
    }
    if (j.parent) copyModel(src, j.parent);
    out.set(modelPath(ns, p), j);
  }

  /* --- Flächen ohne Textur entfernen (sonst lila-schwarz) --- */
  function fixFaces(modelId) {
    const chain = [];
    for (let cur = modelId, n = 0; cur && n < 12; n++) {
      const [ns, p] = split(cur);
      const j = ns !== "minecraft" && out.get(modelPath(ns, p));
      if (!j) break;
      chain.push(j);
      cur = j.parent;
    }
    const tex = Object.assign({}, ...chain.slice().reverse().map((j) => j.textures || {}));
    const resolve = (k, n = 0) => { let v = tex[k]; while (v && v.startsWith("#") && n++ < 10) v = tex[v.slice(1)]; return v && !v.startsWith("#") ? v : null; };
    const owner = chain.find((j) => j.elements);
    for (const e of owner?.elements || []) for (const dir of Object.keys(e.faces || {})) if (!resolve((e.faces[dir].texture || "").replace(/^#/, ""))) delete e.faces[dir];
  }

  for (const item of items) copyModel(modFiles[item.mod], item.model);
  for (const item of items) fixFaces(item.model);

  /* --- Rüstungs-Optik der 8 Sets --- */
  const done = new Set();
  for (const item of items) {
    const eq = item.equipment && equipmentFor(item.key);
    if (!eq || done.has(eq.name)) continue;
    done.add(eq.name);
    const [l1, l2] = eq.layers.map((p) => modFiles[item.mod].get(p));
    if (eq.wings) {
      out.set(`assets/halloween/textures/entity/equipment/wings/${eq.name}.png`, elytraTexture(l1));
      out.set(`assets/halloween/equipment/${eq.name}.json`, { layers: { wings: [{ texture: eq.asset }] } });
      continue;
    }
    out.set(`assets/halloween/textures/entity/equipment/humanoid/${eq.name}.png`, l1);
    out.set(`assets/halloween/textures/entity/equipment/humanoid_leggings/${eq.name}.png`, l2);
    out.set(`assets/halloween/equipment/${eq.name}.json`, { layers: { humanoid: [{ texture: eq.asset }], humanoid_leggings: [{ texture: eq.asset }] } });
  }

  /* --- Kostüme, deren Optik aus dem Mod-Modell erzeugt wurde --- */
  for (const { name, layer, png } of costumeLayers.values()) {
    out.set(`assets/halloween/textures/entity/equipment/${layer}/${name}.png`, png);
    out.set(`assets/halloween/equipment/${name}.json`, { layers: { [layer]: [{ texture: `halloween:${name}` }] } });
  }

  /* --- Weihnachtsmütze (Reijvi) --- */
  const all = [...items];
  if (hatFiles) {
    const t = "assets/minecraft/textures/item/christmas/";
    out.set("assets/halloween/textures/item/christmas_hat.png", hatFiles.get(t + "christmas_hat.png"));
    out.set("assets/halloween/textures/item/christmas_hat_layer.png", hatFiles.get(t + "christmas_hat_layer.png"));
    const hat = JSON.parse(hatFiles.get("assets/minecraft/models/item/carved_pumpkin.json"));
    hat.textures = { 1: "halloween:item/christmas_hat", 2: "halloween:item/christmas_hat_layer", particle: "halloween:item/christmas_hat" };
    out.set("assets/halloween/models/item/christmas_hat.json", hat);
    out.set("assets/minecraft/textures/misc/pumpkinblur.png", hatFiles.get("assets/minecraft/textures/misc/pumpkinblur.png"));
    out.set("pack.png", hatFiles.get("pack.png"));
    all.push({ key: "christmas_hats/christmas_hat", mod: "christmas_hats", ns: "halloween", id: "christmas_hat", name: "Christmas Hat", base: "carved_pumpkin", slot: null, equipment: null, kind: "other", model: "halloween:item/christmas_hat", icon: "halloween_christmas_hat" });
  }

  /* --- Item-Definitionen --- */
  const byBase = {};
  for (const item of all) (byBase[item.base] ||= []).push({ when: item.name, model: { type: "minecraft:model", model: item.model } });
  for (const [base, cases] of Object.entries(byBase)) {
    const vanilla = JSON.parse(vanillaFiles.get(`assets/minecraft/items/${base}.json`)).model;
    out.set(`assets/minecraft/items/${base}.json`, { model: { type: "minecraft:select", property: "minecraft:component", component: "minecraft:custom_name", cases, fallback: vanilla } });
  }

  out.set("pack.mcmeta", { pack: { description: "§6Server Pack 2026", pack_format: 55, supported_formats: [55, 99], min_format: [55, 0], max_format: [99, 0] } });

  const files = new Map();
  for (const [p, v] of out) files.set(p, Buffer.isBuffer(v) ? v : Buffer.from(json(v)));
  return { files, items: all };
}
