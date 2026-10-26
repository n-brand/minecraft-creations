// Icons für die Seite: flache Items = Textur, 3D-Items = isometrische Ansicht wie im Inventar.
import { decodePng, encodePng } from "./lib/png.mjs";

let SIZE = 64;
let FILES = new Map();
const split = (id) => (id.includes(":") ? id.split(":") : ["minecraft", id]);

function loadModel(id, depth = 0) {
  const [ns, p] = split(id);
  if (ns === "minecraft") return { generated: /item\/(generated|handheld)/.test(p), textures: {} };
  const buf = FILES.get(`assets/${ns}/models/${p}.json`);
  if (!buf) return { textures: {} };
  const j = JSON.parse(buf);
  const parent = j.parent && depth < 10 ? loadModel(j.parent, depth + 1) : { textures: {} };
  return {
    textures: { ...parent.textures, ...(j.textures || {}) },
    elements: j.elements || parent.elements,
    generated: parent.generated && !j.elements,
  };
}
const resolve = (t, k, n = 0) => { let v = t[k]; while (v && v.startsWith("#") && n++ < 10) v = t[v.slice(1)]; return v && !v.startsWith("#") ? v : null; };

const texCache = new Map();
function loadTex(id) {
  const [ns, p] = split(id);
  const key = `assets/${ns}/textures/${p}.png`;
  if (!texCache.has(key)) texCache.set(key, FILES.has(key) ? decodePng(FILES.get(key)) : null);
  return texCache.get(key);
}

function rotatePoint(p, rot) {
  // 26.x: Drehung als x/y/z (R = Rx·Ry·Rz), sonst axis + angle
  if (rot && rot.angle === undefined && (rot.x || rot.y || rot.z)) {
    const o = rot.origin || [8, 8, 8];
    let v = [p[0] - o[0], p[1] - o[1], p[2] - o[2]];
    for (const [axis, deg] of [["z", rot.z], ["y", rot.y], ["x", rot.x]]) if (deg) v = rotatePoint([v[0] + 8, v[1] + 8, v[2] + 8], { axis, angle: deg, origin: [8, 8, 8] }).map((n) => n - 8);
    return [v[0] + o[0], v[1] + o[1], v[2] + o[2]];
  }
  if (!rot || !rot.angle) return p;
  const a = (rot.angle * Math.PI) / 180, c = Math.cos(a), s = Math.sin(a), o = rot.origin || [8, 8, 8];
  let [x, y, z] = [p[0] - o[0], p[1] - o[1], p[2] - o[2]];
  if (rot.axis === "x") [y, z] = [y * c - z * s, y * s + z * c];
  else if (rot.axis === "y") [x, z] = [x * c + z * s, -x * s + z * c];
  else [x, y] = [x * c - y * s, x * s + y * c];
  return [x + o[0], y + o[1], z + o[2]];
}
function faceCorners(dir, [fx, fy, fz], [tx, ty, tz]) {
  switch (dir) {
    case "up": return [[fx, ty, fz], [tx, ty, fz], [fx, ty, tz], [fx, fz, tx, tz]];
    case "down": return [[fx, fy, tz], [tx, fy, tz], [fx, fy, fz], [fx, 16 - tz, tx, 16 - fz]];
    case "south": return [[fx, ty, tz], [tx, ty, tz], [fx, fy, tz], [fx, 16 - ty, tx, 16 - fy]];
    case "north": return [[tx, ty, fz], [fx, ty, fz], [tx, fy, fz], [16 - tx, 16 - ty, 16 - fx, 16 - fy]];
    case "east": return [[tx, ty, tz], [tx, ty, fz], [tx, fy, tz], [16 - tz, 16 - ty, 16 - fz, 16 - fy]];
    case "west": return [[fx, ty, fz], [fx, ty, tz], [fx, fy, fz], [fz, 16 - ty, tz, 16 - fy]];
  }
}
const C30 = Math.cos(Math.PI / 6);
const project = (p) => [(p[0] - p[2]) * C30, (p[0] + p[2]) * 0.5 - p[1]];

function render3d(model) {
  const faces = [];
  for (const e of model.elements) {
    for (const [dir, face] of Object.entries(e.faces || {})) {
      const texId = resolve(model.textures, (face.texture || "").replace(/^#/, ""));
      if (!texId) continue;
      const [a, b, c, uvDef] = faceCorners(dir, e.from, e.to);
      const P = [a, b, c].map((p) => rotatePoint(p, e.rotation));
      const Q = P.map(project);
      if ((Q[1][0] - Q[0][0]) * (Q[2][1] - Q[0][1]) - (Q[1][1] - Q[0][1]) * (Q[2][0] - Q[0][0]) <= 0) continue;
      const depth = P[1][0] + P[2][0] - P[0][0] + P[1][1] + P[2][1] - P[0][1] + P[1][2] + P[2][2] - P[0][2] + P[0][0] + P[0][1] + P[0][2];
      faces.push({ Q, uv: face.uv || uvDef, texId, depth, shade: dir === "up" ? 1 : dir === "south" || dir === "north" ? 0.8 : 0.62 });
    }
  }
  if (!faces.length) return null;
  const pts = faces.flatMap((f) => [f.Q[0], f.Q[1], f.Q[2], [f.Q[1][0] + f.Q[2][0] - f.Q[0][0], f.Q[1][1] + f.Q[2][1] - f.Q[0][1]]]);
  const minX = Math.min(...pts.map((p) => p[0])), maxX = Math.max(...pts.map((p) => p[0]));
  const minY = Math.min(...pts.map((p) => p[1])), maxY = Math.max(...pts.map((p) => p[1]));
  const pad = SIZE * 0.06, k = (SIZE - 2 * pad) / Math.max(maxX - minX, maxY - minY, 1);
  const ox = pad + ((SIZE - 2 * pad) - (maxX - minX) * k) / 2 - minX * k, oy = pad + ((SIZE - 2 * pad) - (maxY - minY) * k) / 2 - minY * k;
  const img = Buffer.alloc(SIZE * SIZE * 4);
  faces.sort((a, b) => a.depth - b.depth);
  for (const f of faces) {
    const tex = loadTex(f.texId);
    if (!tex) continue;
    const s = tex.w / 16;
    const [p0, p1, p2] = f.Q.map((p) => [p[0] * k + ox, p[1] * k + oy]);
    const ex = [p1[0] - p0[0], p1[1] - p0[1]], ey = [p2[0] - p0[0], p2[1] - p0[1]];
    const det = ex[0] * ey[1] - ex[1] * ey[0];
    if (Math.abs(det) < 1e-6) continue;
    const xs = [p0[0], p1[0], p2[0], p1[0] + ey[0]], ys = [p0[1], p1[1], p2[1], p1[1] + ey[1]];
    const [u1, v1, u2, v2] = f.uv;
    for (let y = Math.max(0, Math.floor(Math.min(...ys))); y < Math.min(SIZE, Math.ceil(Math.max(...ys))); y++) {
      for (let x = Math.max(0, Math.floor(Math.min(...xs))); x < Math.min(SIZE, Math.ceil(Math.max(...xs))); x++) {
        const dx = x + 0.5 - p0[0], dy = y + 0.5 - p0[1];
        const a = (dx * ey[1] - dy * ey[0]) / det, b = (ex[0] * dy - ex[1] * dx) / det;
        if (a < 0 || a > 1 || b < 0 || b > 1) continue;
        const tx = Math.min(tex.w - 1, Math.max(0, Math.floor((u1 + a * (u2 - u1)) * s - (u2 < u1 ? 1e-6 : 0))));
        const ty = Math.min(tex.h - 1, Math.max(0, Math.floor((v1 + b * (v2 - v1)) * s - (v2 < v1 ? 1e-6 : 0))));
        const i = (ty * tex.w + tx) * 4;
        if (tex.data[i + 3] < 128) continue;
        const o = (y * SIZE + x) * 4;
        img[o] = tex.data[i] * f.shade; img[o + 1] = tex.data[i + 1] * f.shade; img[o + 2] = tex.data[i + 2] * f.shade; img[o + 3] = 255;
      }
    }
  }
  return encodePng({ w: SIZE, h: SIZE, data: img });
}

function renderFlat(model) {
  const id = resolve(model.textures, "layer0");
  const tex = id && (loadTex(id));
  if (!tex) return null;
  const side = Math.min(tex.w, tex.h);
  const out = Buffer.alloc(SIZE * SIZE * 4);
  for (let y = 0; y < SIZE; y++) for (let x = 0; x < SIZE; x++) {
    const i = (Math.floor((y * side) / SIZE) * tex.w + Math.floor((x * side) / SIZE)) * 4;
    tex.data.copy(out, (y * SIZE + x) * 4, i, i + 4);
  }
  return encodePng({ w: SIZE, h: SIZE, data: out });
}

export function renderIcon(modelId, files, size = 64) {
  SIZE = size;
  if (FILES !== files) { FILES = files; texCache.clear(); }
  const m = loadModel(modelId);
  return m.elements && !m.generated ? render3d(m) : renderFlat(m);
}
