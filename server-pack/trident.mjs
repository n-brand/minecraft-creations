// Roter Dreizack: Kopie des goldenen Dreizacks aus „Mein Pack", rot eingefärbt, per Umbenennen.
import { decodePng, encodePng } from "./lib/png.mjs";
import { boxFaces } from "./hats.mjs";

/* --- Farbe: Farbton auf Rot setzen, Sättigung und Helligkeit bleiben --- */
export function recolorRed(png) {
  const img = decodePng(png);
  const d = img.data;
  for (let i = 0; i < d.length; i += 4) {
    if (!d[i + 3]) continue;
    const r = d[i] / 255, g = d[i + 1] / 255, b = d[i + 2] / 255;
    const max = Math.max(r, g, b), min = Math.min(r, g, b);
    const v = max, s = max ? (max - min) / max : 0;
    // Hue 0 (Rot): R = v, G = B = v·(1 − s)
    d[i] = Math.round(v * 255);
    d[i + 1] = d[i + 2] = Math.round(v * (1 - s) * 255);
  }
  return encodePng(img);
}

/* --- 3D-Modelle für Hand und Wurf --- */
// Der Spezial-Renderer zeichnet das Entity-Modell gespiegelt in y und z: item = (x, −y, −z).
// Der Dreizack ist 31 px lang und ragt bis y = −27; erlaubt sind nur −16..32. Darum liegen die Elemente
// TRIDENT_SHIFT px höher, und die Item-Definition schiebt sie per transformation wieder zurück.
export const TRIDENT_SHIFT = 16;
// Flächen dabei: Java-Vorderseite (−z) → Süden, Rückseite → Norden, rechte Seite (−x) → Westen.
export function tridentModels(geometry, texture) {
  const elements = [];
  for (const part of geometry.parts) {
    for (const c of part.cubes) {
      const a = c.from.map((n) => n - c.inflate), b = c.from.map((n, i) => n + c.size[i] + c.inflate);
      const from = [a[0], -b[1] + TRIDENT_SHIFT, -b[2]], to = [b[0], -a[1] + TRIDENT_SHIFT, -a[2]];
      const f = c.faces || boxFaces(c, geometry.texW, geometry.texH, "#0"); // .jem-Würfel bringen ihre Flächen mit
      elements.push({ from, to, faces: { up: f.up, down: f.down, south: f.north, north: f.south, west: f.east, east: f.west } });
    }
  }
  const model = (parent) => ({ parent, textures: { 0: texture, particle: texture }, elements });
  return { inHand: model("minecraft:item/trident_in_hand"), throwing: model("minecraft:item/trident_throwing") };
}

/* --- Modell für den geworfenen Dreizack (item_display als Passagier, siehe datapack.mjs) --- */
// Achsen so gedreht, dass die Display-Drehung (Gieren um y, Nicken um x) dem Wurf-Renderer entspricht:
// Modell = (Java-z, Java-x, Java-y), Spitze zeigt nach −z. Halb so gross gebaut (Grenzen −16..32),
// das Display skaliert mit FLY_SCALE zurück. Jeder Würfel ist etwas dicker, damit er den Vanilla-Dreizack verdeckt.
export const FLY_SCALE = 2;
const FLY_INFLATE = 0.3;
// cover = Vanilla-Dreizack: als Hülle in der Stielfarbe dazu, damit er bei kürzeren/schmaleren Modellen nicht heraussticht.
const COVER_INFLATE = 0.15;
export function tridentFlyingModel(geometry, texture, cover = null) {
  const elements = [];
  const m = (j) => 8 + j / FLY_SCALE;
  const box = (c, grow) => {
    const a = c.from.map((n) => n - grow), b = c.from.map((n, i) => n + c.size[i] + grow);
    return { from: [m(a[2]), m(a[0]), m(a[1])], to: [m(b[2]), m(b[0]), m(b[1])] };
  };
  const facesOf = (c) => c.faces || boxFaces(c, geometry.texW, geometry.texH, "#0"); // .jem-Würfel bringen ihre Flächen mit
  for (const part of geometry.parts) {
    for (const c of part.cubes) {
      const f = facesOf(c);
      const turned = (face) => face && { ...face, rotation: 90 };
      elements.push({ ...box(c, c.inflate + FLY_INFLATE), faces: { north: turned(f.up), south: turned(f.down), west: turned(f.north), east: turned(f.south), down: f.east, up: f.west } });
    }
  }
  if (cover) {
    // Stielfarbe: Seitenfläche des längsten eigenen Würfels
    const pole = geometry.parts.flatMap((p) => p.cubes).sort((x, y) => y.size[1] - x.size[1])[0];
    const pf = facesOf(pole);
    const side = pf.north || pf.south || pf.east || pf.west || Object.values(pf)[0];
    const faces = Object.fromEntries(["north", "south", "east", "west", "up", "down"].map((k) => [k, side]));
    for (const c of cover.parts.flatMap((p) => p.cubes)) elements.push({ ...box(c, c.inflate + COVER_INFLATE), faces });
  }
  return { textures: { 0: texture, particle: texture }, elements };
}

/* --- Item-Definition wie beim Vanilla-Dreizack, nur mit eigenen Modellen --- */
export function tridentDefinition(icon, inHand, throwing) {
  return {
    type: "minecraft:select",
    property: "minecraft:display_context",
    cases: [{ when: ["gui", "ground", "fixed", "on_shelf"], model: { type: "minecraft:model", model: icon } }],
    fallback: {
      type: "minecraft:condition",
      property: "minecraft:using_item",
      on_false: { type: "minecraft:model", model: inHand },
      on_true: { type: "minecraft:model", model: throwing },
      transformation: { translation: [0, -TRIDENT_SHIFT / 16, 0], left_rotation: [0, 0, 0, 1], right_rotation: [0, 0, 0, 1], scale: [1, 1, 1] },
    },
  };
}
