import { decodePng } from "./lib/png.mjs";

// 3D-Hüte: Kopf-Teil eines Mod-Modells (Java-Würfel) als Minecraft-Item-Modell für den Kopf.
//
// Kopf-Item-Ebene (CustomHeadLayer) auf das Java-Modell umgerechnet, mit display.head scale 1.6:
//   item = G·java + C   mit G = 180° um z (x und y spiegeln), C = (8, 4, 8)
// Drehungen: R_item = G·R_java·G (Java: rotationZYX), als Euler x/y/z (Annahme: R = Rx·Ry·Rz).

const G = (v) => [-v[0], -v[1], v[2]];
const C = [8, 4, 8];
const r6 = (n) => Math.round(n * 1e6) / 1e6;

/* --- Matrizen (3×3, zeilenweise) --- */
const mul = (a, b) => a.map((row, i) => [0, 1, 2].map((j) => row[0] * b[0][j] + row[1] * b[1][j] + row[2] * b[2][j]));
const apply = (m, v) => m.map((row) => row[0] * v[0] + row[1] * v[1] + row[2] * v[2]);
const rx = (a) => [[1, 0, 0], [0, Math.cos(a), -Math.sin(a)], [0, Math.sin(a), Math.cos(a)]];
const ry = (a) => [[Math.cos(a), 0, Math.sin(a)], [0, 1, 0], [-Math.sin(a), 0, Math.cos(a)]];
const rz = (a) => [[Math.cos(a), -Math.sin(a), 0], [Math.sin(a), Math.cos(a), 0], [0, 0, 1]];
const GM = [[-1, 0, 0], [0, -1, 0], [0, 0, 1]];
const I = [[1, 0, 0], [0, 1, 0], [0, 0, 1]];

function eulerXYZ(m) {
  const b = Math.asin(Math.max(-1, Math.min(1, m[0][2])));
  const a = Math.atan2(-m[1][2], m[2][2]);
  const c = Math.atan2(-m[0][1], m[0][0]);
  const deg = (x) => r6((x * 180) / Math.PI) + 0;
  return { x: deg(a), y: deg(b), z: deg(c) };
}

/* --- UV einer Box im Textur-Netz (in 16tel der Textur) --- */
function boxFaces(c, texW, texH, tex) {
  const [u, v] = c.uv, [w, h, d] = c.size;
  const U = (x) => r6((x * 16) / texW), V = (y) => r6((y * 16) / texH);
  const rect = (x0, y0, x1, y1) => ({ uv: [U(x0), V(y0), U(x1), V(y1)], texture: tex });
  const f = {
    up: rect(u + d, v, u + d + w, v + d),
    down: rect(u + d + w, v, u + d + 2 * w, v + d),
    north: rect(u + d, v + d, u + d + w, v + d + h),
    east: rect(u, v + d, u + d, v + d + h),
    west: rect(u + d + w, v + d, u + 2 * d + w, v + d + h),
    south: rect(u + 2 * d + w, v + d, u + 2 * d + 2 * w, v + d + h),
  };
  if (c.mirror) {
    [f.east, f.west] = [f.west, f.east];
    for (const face of Object.values(f)) face.uv = [face.uv[2], face.uv[1], face.uv[0], face.uv[3]];
  }
  return f;
}

/* --- Modell --- */
export function hatModel(model, texture) {
  const byName = new Map(model.parts.map((p) => [p.name, p]));
  const hasHead = byName.has("head");
  const inHead = (p) => { for (let cur = p; cur; cur = byName.get(cur.parent)) if (cur.name === "head") return true; return false; };
  const parts = hasHead ? model.parts.filter(inHead) : model.parts;

  const world = new Map();
  const worldOf = (p) => {
    if (world.has(p.name)) return world.get(p.name);
    const parent = byName.get(p.parent);
    const pw = parent ? worldOf(parent) : { R: I, P: [0, 0, 0] };
    const pos = apply(pw.R, [p.pose.x, p.pose.y, p.pose.z]);
    const w = { R: mul(pw.R, mul(rz(p.pose.rz), mul(ry(p.pose.ry), rx(p.pose.rx)))), P: [pw.P[0] + pos[0], pw.P[1] + pos[1], pw.P[2] + pos[2]] };
    world.set(p.name, w);
    return w;
  };

  const elements = [];
  for (const p of parts) {
    const { R, P } = worldOf(p);
    const Ri = mul(GM, mul(R, GM));
    const origin = G(P).map((n, i) => r6(n + C[i]));
    for (const c of p.cubes) {
      const a = c.from.map((n) => n - c.inflate), b = c.from.map((n, i) => n + c.size[i] + c.inflate);
      const ga = G(a), gb = G(b);
      const from = [0, 1, 2].map((i) => r6(origin[i] + Math.min(ga[i], gb[i])));
      const to = [0, 1, 2].map((i) => r6(origin[i] + Math.max(ga[i], gb[i])));
      const el = { from, to, faces: boxFaces(c, model.texW, model.texH, "#0") };
      const e = eulerXYZ(Ri);
      if (e.x || e.y || e.z) el.rotation = { origin, ...e };
      elements.push(el);
    }
  }
  return {
    textures: { 0: texture, particle: texture },
    elements,
    display: { head: { rotation: [0, 0, 0], translation: [0, 0, 0], scale: [1.6, 1.6, 1.6] } },
  };
}

/* --- Block-Hüte (z.B. Hexenhut-Block): Modell unverändert, nur auf den Kopf setzen --- */
// Kopf-Ebene: java_y = -0.625·(y' − 8) − 4 mit y' = 8 + (y − 8)·k + t.
// Unterkante (y = 0) soll auf der Kopf-Oberseite (java_y = −8) sitzen → t = 6.4 + 8k; k = 1.
export function blockHat(model, k = 1) {
  return { parent: model, display: { head: { rotation: [0, 0, 0], translation: [0, Math.round((6.4 + 8 * k) * 1000) / 1000, 0], scale: [k, k, k] } } };
}

/* --- Mehrere Hüte mit gleicher Form zu einem verbinden (z.B. Clown-Nase + Perücke) --- */
// Jeder Würfel kommt von der Textur, auf der er am meisten bemalt ist.

function painted(img, faces) {
  let n = 0;
  for (const f of Object.values(faces)) {
    const [u0, v0, u1, v1] = f.uv.map((x, i) => Math.floor((x / 16) * (i % 2 ? img.h : img.w)));
    for (let y = Math.min(v0, v1); y < Math.max(v0, v1); y++) for (let x = Math.min(u0, u1); x < Math.max(u0, u1); x++) if (img.data[(y * img.w + x) * 4 + 3]) n++;
  }
  return n;
}

export function mergeHats(sources) {
  const imgs = sources.map((s) => decodePng(s.png));
  const textures = {};
  sources.forEach((s, i) => (textures[i] = s.texture));
  textures.particle = sources[sources.length - 1].texture;
  const elements = sources[0].model.elements.map((el, k) => {
    let best = 0, score = -1;
    sources.forEach((s, i) => { const p = painted(imgs[i], s.model.elements[k].faces); if (p > score) { score = p; best = i; } });
    const chosen = sources[best].model.elements[k];
    const faces = Object.fromEntries(Object.entries(chosen.faces).map(([dir, f]) => [dir, { ...f, texture: `#${best}` }]));
    return { ...chosen, faces };
  });
  return { textures, elements, display: sources[0].model.display };
}

/* --- Verschiedene Hut-Modelle zu einem kombinieren (z.B. Vampirhut + Vampiraugen) --- */
export function combineHats(models) {
  const textures = {};
  const elements = [];
  models.forEach((m, i) => {
    textures[i] = m.textures[0];
    for (const el of m.elements) elements.push({ ...el, faces: Object.fromEntries(Object.entries(el.faces).map(([dir, f]) => [dir, { ...f, texture: `#${i}` }])) });
  });
  textures.particle = models[0].textures[0];
  return { textures, elements, display: models[0].display };
}

/* --- Hut nach oben/unten verschieben (server-pack/hut-versatz.json, in Kopf-Pixeln) --- */
// Kopf-Ebene skaliert mit 0.625 → 1 Kopf-Pixel = 1.6 Einheiten der display-Verschiebung.
export function shiftHat(model, px) {
  const t = model.display.head.translation;
  t[1] = Math.round((t[1] + px * 1.6) * 1000) / 1000;
  return model;
}
