// Item-Liste: Auswahl → Namen, Grund-Items, Kostüm-Slots und Equipment.

export const NAMESPACE = { "decoween-neoforge": "decoween", happyhallows: "happyhallows", funny_pumpkin: "funny_pumpkin", spookify: "spookify" };

const LEATHER = { head: "leather_helmet", chest: "leather_chestplate", legs: "leather_leggings", feet: "leather_boots" };

/* --- Kostüme --- */
export function slotOf(id) {
  if (/_(helmet|mask|hood|hat)$|^witch_hat$|^scarecrow_head$|^clown_(nose|wig)$|^vampire_(eyes_\d|fangs)$/.test(id)) return "head";
  if (/_(chestplate|body|robe)$|^vampire_cloak$/.test(id)) return "chest";
  if (/_(leggings|pants|breeches)$|^mermaid_tail$|^merman_tail$/.test(id)) return "legs";
  if (/_(boots|feet|shoes|plunderers|fins)$/.test(id)) return "feet";
  return null;
}

// Sets mit echten Rüstungs-Texturen → eigenes Equipment-Asset im Resource Pack
export const EQUIPMENT_SETS = [
  { re: /^happyhallows\/(bride|frankenstein|mermaid|merman|mummy|pirate)_/, name: (m) => "hh_" + m, layers: (m) => [`assets/happyhallows/textures/models/armor/${m}_layer_1.png`, `assets/happyhallows/textures/models/armor/${m}_layer_2.png`] },
  { re: /^funny_pumpkin\/(pumpkin|living_bark)_armor_/, name: (m) => "fp_" + m, layers: (m) => [`assets/funny_pumpkin/textures/models/armor/${m}___layer_1.png`, `assets/funny_pumpkin/textures/models/armor/${m}___layer_2.png`] },
];

export function equipmentFor(key) {
  for (const set of EQUIPMENT_SETS) {
    const m = key.match(set.re);
    if (m) return { asset: "halloween:" + set.name(m[1]), name: set.name(m[1]), layers: set.layers(m[1]) };
  }
  return null;
}

/* --- Grund-Items (Entscheidungen von Nicolas) --- */
const isWings = (name) => /Wings$/.test(name);
const isFood = (id) => /_candy$|^berry_muffin$|^pumpkin_lollipop$|^caramel_key$/.test(id);

export function baseFor({ mod, id, name, is3d }) {
  if (isWings(name)) return "elytra";
  const slot = slotOf(id);
  if (slot) return LEATHER[slot];
  if (/^music_disc_\d$/.test(id)) return "music_disc_13";
  if (mod === "happyhallows" && /skull_candle$/.test(id)) return "skeleton_skull";
  if (/^nether_monster_egg/.test(id)) return "turtle_egg";
  if (mod === "spookify" && /^bag_/.test(id)) return "bundle";
  if (isFood(id)) return "bread";
  return is3d ? "oak_pressure_plate" : "paper";
}

/* --- Liste --- */
const title = (id) => id.split("_").map((w) => w[0].toUpperCase() + w.slice(1)).join(" ");
const stripCodes = (s) => s.replace(/§./g, "").trim();

export function buildItemList({ selection, lang, is3d }) {
  const items = selection.map((key) => {
    const [mod, id] = key.split("/");
    const ns = NAMESPACE[mod];
    const l = lang[mod] || {};
    const desc = l[`item.${ns}.${id}.desc`];
    const raw = /^music_disc_\d$/.test(id) && desc
      ? stripCodes(desc).split(" - ").pop().replace(/\b\w/g, (c) => c.toUpperCase())
      : l[`item.${ns}.${id}`] || l[`block.${ns}.${id}`] || title(id);
    return { key, mod, ns, id, name: stripCodes(raw) };
  });
  const count = {};
  items.forEach((i) => (count[i.name] = (count[i.name] || 0) + 1));
  for (const i of items) {
    if (count[i.name] > 1) i.name = title(i.id);
    i.base = baseFor({ ...i, is3d: is3d(i.mod, i.id) });
    i.slot = isWings(i.name) ? null : slotOf(i.id);
    i.equipment = i.slot ? equipmentFor(i.key)?.asset ?? null : null;
    i.kind = i.slot ? "costume" : i.base === "oak_pressure_plate" ? "deco" : i.base === "bread" ? "food" : "other";
    i.model = `${i.ns}:item/${i.id}`;
    i.icon = `${i.ns}_${i.id}`;
  }
  return items;
}

export function giveCommand(item) {
  const parts = [`custom_name="${item.name.replace(/"/g, '\\"')}"`];
  if (item.equipment) parts.push(`equippable={slot:"${item.slot}",asset_id:"${item.equipment}"}`);
  return `/give @s ${item.base}[${parts.join(",")}]`;
}
