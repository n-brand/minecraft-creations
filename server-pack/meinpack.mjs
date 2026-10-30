// Essen aus „Mein Pack“ (McDonald Food u.a.): Namen, Modelle und Texturen 1:1 übernehmen, nichts anderes.
import fs from "node:fs";
import path from "node:path";

// keine Essens-Sachen: Münzen, Happy-Meal-Bündel; die Pille ist kein Essen
export const MEIN_PACK_SKIP = { files: ["gold_nugget", "iron_nugget", "red_bundle"], names: ["Pill"] };

const split = (id) => (id.includes(":") ? id.split(":") : ["minecraft", id]);
const slug = (s) => s.toLowerCase().replace(/[^a-z0-9]+/g, "_").replace(/^_|_$/g, "");

/* --- Alle Modell-IDs einer (verschachtelten) Item-Definition --- */
export function modelIds(m, out = []) {
  if (!m) return out;
  if (typeof m.model === "string") out.push(m.model);
  for (const c of m.cases || []) modelIds(c.model, out);
  for (const k of ["fallback", "on_true", "on_false"]) modelIds(m[k], out);
  for (const e of m.entries || []) modelIds(e.model, out);
  for (const x of m.models || []) modelIds(x, out);
  return out;
}

/* --- Modell samt Eltern und Texturen aus dem Pack-Ordner holen (Vanilla bleibt Vanilla) --- */
export function collectFiles(read, ids) {
  const files = new Map();
  const seen = new Set();
  const visit = (id) => {
    if (!id || seen.has(id)) return;
    seen.add(id);
    const [ns, p] = split(id);
    if (ns === "minecraft") return;
    const rel = `assets/${ns}/models/${p}.json`;
    const buf = read(rel);
    if (!buf) return;
    files.set(rel, buf);
    const j = JSON.parse(buf);
    for (const t of Object.values(j.textures || {})) {
      if (t.startsWith("#")) continue;
      const [tns, tp] = split(t);
      if (tns === "minecraft") continue;
      for (const ext of [".png", ".png.mcmeta"]) {
        const trel = `assets/${tns}/textures/${tp}${ext}`;
        const tbuf = read(trel);
        if (tbuf) files.set(trel, tbuf);
      }
    }
    visit(j.parent);
  };
  ids.forEach(visit);
  return [...files];
}

/* --- Items für die Item-Liste des Server Packs --- */
export function meinPackFood(dir, skip = MEIN_PACK_SKIP) {
  const read = (rel) => { const p = path.join(dir, rel); return fs.existsSync(p) ? fs.readFileSync(p) : null; };
  const itemsDir = path.join(dir, "assets/minecraft/items");
  const items = [];
  for (const file of fs.readdirSync(itemsDir).filter((f) => f.endsWith(".json")).sort()) {
    const base = file.slice(0, -5);
    if (skip.files.includes(base)) continue;
    const def = JSON.parse(fs.readFileSync(path.join(itemsDir, file), "utf8")).model;
    if (def.property !== "minecraft:custom_name" && def.component !== "minecraft:custom_name") continue;
    for (const c of def.cases || []) {
      const names = Array.isArray(c.when) ? c.when : [c.when];
      for (const name of names) {
        if (skip.names.includes(name)) continue;
        const ids = modelIds(c.model);
        items.push({
          key: `mein_pack/${base}/${slug(name)}`, mod: "mein_pack", ns: split(ids[0])[0], id: slug(name), name, base,
          slot: null, equipment: null, kind: "food", model: ids[0], icon: `mein_pack_${slug(name)}`,
          definition: c.model, files: collectFiles(read, ids),
        });
      }
    }
  }
  return items;
}
