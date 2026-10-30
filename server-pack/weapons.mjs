// Waffen aus fremden Resource Packs übernehmen: Vanilla-Modelle (Mine Cells, Fishy Weapons) und
// OptiFine-Dreizack-Modelle (.jem), die in Entity-Würfel wie beim Vanilla-Dreizack umgerechnet werden.
import { boxFaces } from "./hats.mjs";

const split = (id) => (id.includes(":") ? id.split(":") : ["minecraft", id]);

/* --- OptiFine-Modell (.jem) → Würfel im Java-Entity-Raum --- */
// Blockbench-Raum (y oben) mit invertAxis "xy": Java = (−x, −y, z). translate addiert sich von Teil zu Untermodell,
// rotate dreht um den Drehpunkt des Untermodells. Vanilla kennt keine schrägen Würfel: nur 90°-Schritte.
const DIRS = { up: [0, 1, 0], down: [0, -1, 0], north: [0, 0, -1], south: [0, 0, 1], east: [1, 0, 0], west: [-1, 0, 0] };
const mul = (A, B) => A.map((row) => [0, 1, 2].map((j) => row.reduce((s, a, k) => s + a * B[k][j], 0)));
const apply = (A, v) => A.map((row) => row.reduce((s, a, k) => s + a * v[k], 0));
const I = [[1, 0, 0], [0, 1, 0], [0, 0, 1]];
function rotation([rx, ry, rz]) {
  const c = (d) => Math.round(Math.cos((d * Math.PI) / 180)), s = (d) => Math.round(Math.sin((d * Math.PI) / 180));
  const X = [[1, 0, 0], [0, c(rx), -s(rx)], [0, s(rx), c(rx)]];
  const Y = [[c(ry), 0, s(ry)], [0, 1, 0], [-s(ry), 0, c(ry)]];
  const Z = [[c(rz), -s(rz), 0], [s(rz), c(rz), 0], [0, 0, 1]];
  return mul(Z, mul(Y, X));
}
const faceName = (v) => Object.keys(DIRS).find((k) => DIRS[k].every((n, i) => n === v[i]));

export function readJem(jem) {
  const [texW, texH] = jem.textureSize || [64, 32];
  const parts = [], skipped = [];
  const U = (x) => (x * 16) / texW, V = (y) => (y * 16) / texH;
  const walk = (node, parent) => {
    const rot = node.rotate || [0, 0, 0];
    if (rot.some((a) => a % 90 !== 0)) { skipped.push(node.id || node.part); return; }
    // Abbildung lokal → Blockbench-Weltraum: parent( translate + R·lokal )
    const R = mul(parent.R, rotation(rot));
    const T = parent.T.map((n, i) => n + apply(parent.R, node.translate || [0, 0, 0])[i]);
    const cubes = [];
    for (const box of node.boxes || []) {
      const [x, y, z, w, h, d] = box.coordinates;
      const corners = [];
      for (const cx of [x, x + w]) for (const cy of [y, y + h]) for (const cz of [z, z + d]) corners.push(apply(R, [cx, cy, cz]).map((n, i) => n + T[i]));
      const min = [0, 1, 2].map((i) => Math.min(...corners.map((p) => p[i]))), max = [0, 1, 2].map((i) => Math.max(...corners.map((p) => p[i])));
      // Flächen im lokalen Raum (Namen = Blockbench-Richtungen), dann mitdrehen
      const local = box.textureOffset
        ? boxFaces({ uv: box.textureOffset, size: [w, h, d], mirror: false }, texW, texH, "#0")
        : Object.fromEntries(Object.keys(DIRS).map((k) => [k, box[`uv${k[0].toUpperCase()}${k.slice(1)}`]]).filter(([, uv]) => uv).map(([k, [u1, v1, u2, v2]]) => [k, { uv: [U(u1), V(v1), U(u2), V(v2)], texture: "#0" }]));
      const faces = {};
      for (const [k, f] of Object.entries(local)) faces[faceName(apply(R, DIRS[k]))] = f;
      cubes.push({ from: [-max[0], -max[1], min[2]], size: [0, 1, 2].map((i) => max[i] - min[i]), uv: box.textureOffset || [0, 0], inflate: box.sizeAdd || 0, mirror: false, faces });
    }
    if (cubes.length) parts.push({ name: node.id || node.part, cubes });
    for (const sub of node.submodels || []) walk(sub, { R, T });
  };
  for (const m of jem.models || []) walk(m, { R: I, T: [0, 0, 0] });
  return { texW, texH, parts, skipped };
}

/* --- Vanilla-Modell aus einem Pack holen: eigene Texturen/Modelle in einen eigenen Namespace --- */
// Was das Pack nicht selbst mitbringt (z.B. item/stick), bleibt Vanilla.
export function importModel(zip, id, ns, files = new Map()) {
  const [srcNs, p] = split(id);
  const buf = zip.get(`assets/${srcNs}/models/${p}.json`);
  if (!buf) return { id, files };
  const outNs = srcNs === "minecraft" ? ns : srcNs;
  const j = JSON.parse(buf);
  for (const [k, t] of Object.entries(j.textures || {})) {
    if (t.startsWith("#")) continue;
    const [tns, tp] = split(t);
    const src = `assets/${tns}/textures/${tp}.png`;
    if (!zip.has(src)) continue;
    const tout = tns === "minecraft" ? ns : tns;
    files.set(`assets/${tout}/textures/${tp}.png`, zip.get(src));
    if (zip.has(src + ".mcmeta")) files.set(`assets/${tout}/textures/${tp}.png.mcmeta`, zip.get(src + ".mcmeta"));
    j.textures[k] = `${tout}:${tp}`;
  }
  if (j.parent) j.parent = importModel(zip, j.parent, ns, files).id;
  files.set(`assets/${outNs}/models/${p}.json`, Buffer.from(JSON.stringify(j, null, 2)));
  return { id: `${outNs}:${p}`, files };
}

/* --- Item-Definition mit ausgetauschten Modellen (z.B. Bogen mit Spann-Stufen) --- */
export function swapModels(def, map) {
  return JSON.parse(JSON.stringify(def), (k, v) => (k === "model" && typeof v === "string" && map[v] ? map[v] : v));
}
