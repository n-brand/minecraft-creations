// Kostüme: Mod-Modelle (Java-Code) auf die normale Rüstungs-Optik von Minecraft übertragen.
import { decodePng, encodePng } from "./lib/png.mjs";

/* --- Welches Modell und welche Textur gehört zu welchem Kostüm-Teil --- */
// Klassennamen wie CultistCostumeItem$Chestplate → Item-ID cultist_costume_chestplate
export function costumePieces(files) {
  // Modell steht in der Renderer-Klasse ($Chestplate$1), Textur in der Item-Klasse ($Chestplate)
  const found = new Map();
  for (const [name, buf] of files) {
    const m = name.match(/\/item\/([A-Za-z0-9]+)Item\$(Helmet|Chestplate|Leggings|Boots)(\$\d+)?\.class$/);
    if (!m) continue;
    const id = m[1].replace(/([a-z])([A-Z0-9])/g, "$1_$2").toLowerCase() + "_" + m[2].toLowerCase();
    const s = buf.toString("latin1");
    const entry = found.get(id) || {};
    entry.model ||= (s.match(/client\/model\/(Model[A-Za-z0-9_]+)/) || [])[1];
    const texture = (s.match(/textures\/entities\/[a-z0-9_]+\.png/) || [])[0];
    if (texture) entry.texture ||= `assets/funny_pumpkin/${texture}`;
    found.set(id, entry);
  }
  // Curios-Zubehör (z.B. VampireEyes1Renderer): Modell und Textur stehen im Renderer
  for (const [name, buf] of files) {
    const m = name.match(/\/client\/renderer\/([A-Za-z0-9]+)Renderer\.class$/);
    if (!m) continue;
    const s = buf.toString("latin1");
    if (!s.includes("ICurioRenderer")) continue;
    const model = (s.match(/client\/model\/(Model[A-Za-z0-9_]+)/) || [])[1];
    const texture = (s.match(/textures\/entities\/[a-z0-9_]+\.png/) || [])[0];
    const id = m[1].replace(/([a-z])([A-Z0-9])/g, "$1_$2").toLowerCase();
    if (model && texture && !found.has(id)) found.set(id, { model, texture: `assets/funny_pumpkin/${texture}` });
  }
  const pieces = new Map();
  for (const [id, e] of found) if (e.model && e.texture) pieces.set(id, { model: e.model, texture: e.texture });
  return pieces;
}

/* --- Rüstungs-Layout (64×32) --- */
// Ziel-Boxen im Rüstungs-Bild: u/v = Ecke, w/h/d = Grösse, top = oberer Rand der Box im Modell (Pixel)
const BOX = {
  head: { bone: ["head"], u: 0, v: 0, w: 8, h: 8, d: 8, top: -8 },
  body: { bone: ["body"], u: 16, v: 16, w: 8, h: 12, d: 4, top: 0 },
  arm: { bone: ["right_arm", "left_arm"], u: 40, v: 16, w: 4, h: 12, d: 4, top: -2 },
  leg: { bone: ["right_leg", "left_leg"], u: 0, v: 16, w: 4, h: 12, d: 4, top: 0 },
};
const SLOT_BOXES = { head: ["head"], chest: ["body", "arm"], legs: ["body", "leg"], feet: ["leg"] };

// Flächen einer Box im Textur-Netz (wie bei Minecraft-Modellen): [x, y, breite, höhe, seitlich?]
function faces(u, v, w, h, d) {
  return {
    top: [u + d, v, w, d], bottom: [u + d + w, v, w, d],
    right: [u, v + d, d, h], front: [u + d, v + d, w, h], left: [u + d + w, v + d, d, h], back: [u + 2 * d + w, v + d, w, h],
  };
}

export function armorLayer(model, png, slot) {
  const src = decodePng(png);
  const scale = src.w / (model.texW || src.w);
  const out = Buffer.alloc(64 * 32 * 4);
  let used = 0;
  for (const boxName of SLOT_BOXES[slot]) {
    const box = BOX[boxName];
    const part = box.bone.map((b) => model.parts.find((p) => p.name === b)).find(Boolean);
    if (!part) continue;
    // nur Würfel in Rüstungs-Grundform; innere Schicht zuerst, äussere darüber
    const cubes = part.cubes.filter((c) => c.size[0] === box.w && c.size[2] === box.d && c.size[1] > 0).sort((a, b) => a.inflate - b.inflate);
    for (const c of cubes) {
      const offset = Math.round(c.from[1] - box.top);
      if (offset >= box.h || offset + c.size[1] <= 0) continue;
      const sf = faces(c.uv[0], c.uv[1], c.size[0], c.size[1], c.size[2]);
      const df = faces(box.u, box.v, box.w, box.h, box.d);
      for (const key of Object.keys(sf)) {
        const [sx, sy, sw, sh] = sf[key];
        const [dx, dy, dw, dh] = df[key];
        const side = key !== "top" && key !== "bottom";
        if (key === "top" && offset !== 0) continue;
        if (key === "bottom" && offset + c.size[1] !== box.h) continue;
        for (let y = 0; y < (side ? sh : dh); y++) {
          const ty = side ? y + offset : y;
          if (ty < 0 || ty >= dh) continue;
          for (let x = 0; x < dw; x++) {
            const fx = Math.floor((sx + (x * sw) / dw) * scale), fy = Math.floor((sy + (side ? y : (y * sh) / dh)) * scale);
            if (fx >= src.w || fy >= src.h) continue;
            const i = (fy * src.w + fx) * 4;
            if (src.data[i + 3] === 0) continue;
            src.data.copy(out, ((dy + ty) * 64 + dx + x) * 4, i, i + 4);
            used++;
          }
        }
      }
    }
  }
  return used ? encodePng({ w: 64, h: 32, data: out }) : null;
}

/* --- Gesichts-Schichten ohne eigenes Modell (z.B. Vampirzähne): Textur im Kopf-Layout --- */
export const FACE_OVERLAYS = { vampire_fangs: "assets/funny_pumpkin/textures/entities/mob_vampire_fangs.png" };

export function faceOverlayModel() {
  return { texW: 64, texH: 64, parts: [{ name: "head", parent: "root", pose: { x: 0, y: 0, z: 0, rx: 0, ry: 0, rz: 0 }, cubes: [{ from: [-4, -8, -4], size: [8, 8, 8], uv: [0, 0], inflate: 0.05, mirror: false }] }] };
}
