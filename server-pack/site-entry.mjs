// Eintrag „Server Pack 2026“ für data/items.js, gebaut aus derselben Item-Liste wie die Packs.
import { giveCommand } from "./items.mjs";

const BASES = {
  carved_pumpkin: ["Geschnitzter Kürbis", "Carved Pumpkin"],
  leather_helmet: ["Lederkappe", "Leather Cap"],
  leather_chestplate: ["Ledertunika", "Leather Tunic"],
  leather_leggings: ["Lederhose", "Leather Pants"],
  leather_boots: ["Lederstiefel", "Leather Boots"],
  elytra: ["Elytren", "Elytra"],
  skeleton_skull: ["Skelettschädel", "Skeleton Skull"],
  bundle: ["Bündel", "Bundle"],
  turtle_egg: ["Schildkrötenei", "Turtle Egg"],
  spruce_pressure_plate: ["Fichtenholzdruckplatte", "Spruce Pressure Plate"],
  lantern: ["Laterne", "Lantern"],
  bread: ["Brot", "Bread"],
  apple: ["Apfel", "Apple"],
  baked_potato: ["Ofenkartoffel", "Baked Potato"],
  beetroot_soup: ["Rote-Bete-Suppe", "Beetroot Soup"],
  cooked_beef: ["Steak", "Cooked Beef"],
  cooked_chicken: ["Gebratenes Hühnchen", "Cooked Chicken"],
  cooked_mutton: ["Gebratenes Hammelfleisch", "Cooked Mutton"],
  cooked_porkchop: ["Gebratenes Schweinefleisch", "Cooked Porkchop"],
  porkchop: ["Rohes Schweinefleisch", "Raw Porkchop"],
  cooked_salmon: ["Gebratener Lachs", "Cooked Salmon"],
  golden_carrot: ["Goldene Karotte", "Golden Carrot"],
  sweet_berries: ["Süsse Beeren", "Sweet Berries"],
  pumpkin_pie: ["Kürbiskuchen", "Pumpkin Pie"],
  mushroom_stew: ["Pilzsuppe", "Mushroom Stew"],
  suspicious_stew: ["Seltsame Suppe", "Suspicious Stew"],
  spider_eye: ["Spinnenauge", "Spider Eye"],
  honey_bottle: ["Honigflasche", "Honey Bottle"],
  milk_bucket: ["Milcheimer", "Milk Bucket"],
  paper: ["Papier", "Paper"],
  music_disc_13: ["Schallplatte „13“", "Music Disc 13"],
  trident: ["Dreizack", "Trident"],
  netherite_sword: ["Netheritschwert", "Netherite Sword"],
  bow: ["Bogen", "Bow"],
  crossbow: ["Armbrust", "Crossbow"],
  mace: ["Streitkolben", "Mace"],
  firework_rocket: ["Feuerwerksrakete", "Firework Rocket"],
  end_rod: ["Endstab", "End Rod"],
};
const MODS = { halloween: "Eigenes", mein_pack: "Mein Pack", tridents: "Dreizack-Packs", mine_cells: "Mine Cells 3D Weapons", fishy: "Fishy Weapons", christmas_hats: "Weihnachtsmützen", "decoween-neoforge": "Decoween", funny_pumpkin: "Funny Pumpkin", happyhallows: "Happy Hallows", spookify: "Spookify" };
const q = (s) => JSON.stringify(s);

/* --- Kostüm-Sets (Gruppen auf der Seite) --- */
const SETS = [
  [/^dark_mummy_/, "Dunkle Mumie"], [/^depth_monster_/, "Tiefenmonster"], [/^living_bark_/, "Baumrinde"], [/^pumpkin_caster_/, "Kürbis-Magier"],
  [/^vampire_/, "Vampir"], [/^(demon_|red_trident)/, "Teufel"], [/^angel_/, "Engel"], [/^witch_/, "Hexe"], [/^cultist_/, "Kultist"], [/^death_/, "Tod"],
  [/^ghost_/, "Geist"], [/^mummy_/, "Mumie"], [/^nightmare_/, "Albtraum"], [/^princess_/, "Prinzessin"], [/^scarecrow_/, "Vogelscheuche"],
  [/^automaton_/, "Automat"], [/^clown_/, "Clown"], [/^pumpkin_/, "Kürbis"], [/^bride_/, "Braut"], [/^frankenstein_/, "Frankenstein"],
  [/^mermaid_/, "Meerjungfrau"], [/^merman_/, "Wassermann"], [/^pirate_/, "Pirat"], [/^christmas_hat/, "Weihnachten"],
];
export function costumeSet(item) {
  return (SETS.find(([re]) => re.test(item.id)) || [null, "Sonstiges"])[1];
}

// Filter auf der Seite: überwiegende Art der Items einer Gruppe
const CATEGORIES = { costume: "Kostüme", deco: "Deko", food: "Essen", weapon: "Waffen" };
export function categoryOf(rows) {
  const count = {};
  for (const r of rows) { const c = CATEGORIES[r.kind] || "Sonstiges"; count[c] = (count[c] || 0) + 1; }
  return Object.entries(count).sort((a, b) => b[1] - a[1])[0][0];
}

export function entrySource(items) {
  const groups = [];
  // Kostüme nach Set, jedes Teil mit eigenem /give (ein Set hat verschiedene Grund-Items)
  // der rote Dreizack gehört zum Teufel-Kostüm
  const costumes = items.filter((i) => i.kind === "costume" || i.base === "carved_pumpkin" || i.id === "red_trident");
  const sets = [...new Set(costumes.map(costumeSet))].sort((a, b) => a.localeCompare(b, "de"));
  for (const set of sets) {
    const SLOT_ORDER = { head: 0, chest: 1, legs: 2, feet: 3 }; // ohne Slot (Dreizack) zuletzt
    const rows = costumes.filter((i) => costumeSet(i) === set).sort((a, b) => (SLOT_ORDER[a.slot] ?? 4) - (SLOT_ORDER[b.slot] ?? 4) || a.name.localeCompare(b.name));
    const mods = [...new Set(rows.map((i) => MODS[i.mod]))].join(", ");
    groups.push({ id: rows[0].base, cat: "Kostüme", item: set, itemEn: `Kostüm · ${mods}`, names: rows.map((i) => [i.name, i.icon, giveCommand(i)]) });
  }
  for (const base of Object.keys(BASES)) {
    for (const mod of Object.keys(MODS)) {
      const rows = items.filter((i) => i.base === base && i.mod === mod && !costumes.includes(i)).sort((a, b) => a.name.localeCompare(b.name));
      if (!rows.length) continue;
      groups.push({ id: base, cat: categoryOf(rows), item: BASES[base][0], itemEn: `${BASES[base][1]} · ${MODS[mod]}`, names: rows.map((i) => [i.name, i.icon, giveCommand(i)]) });
    }
  }
  return `  {
    id: "server-pack-2026",
    category: "texturepacks",
    name: "Server Pack 2026",
    description: "Halloween auf unserem Server: ${items.length} Deko-Items, Kostüme, Süssigkeiten und eine Weihnachtsmütze zum Umbenennen – ganz ohne Mods.",
    version: "26.3",
    edition: "Java",
    serverOnly: true,
    image: "images/server-pack-2026.png",
    updated: "${new Date().toISOString().slice(0, 10)}",
    details: [
      "Das Server Pack 2026 bringt Sachen aus vier Halloween-Mods in Vanilla-Minecraft. Du benennst ein normales Item am Amboss um, und es sieht aus wie das Mod-Item. Ohne Umbenennen bleibt alles normal.",
      "Das Pack gibt es nur auf unserem Server, es lädt beim Beitreten automatisch. Hier findest du alle Namen und fertige /give-Befehle.",
      "3D-Deko liegt auf der Fichtenholzdruckplatte: Stell sie einfach hin, dann erscheint das Modell. Mit einem Linksklick aufs Modell baust du es wieder ab und bekommst das Item zurück."
    ],
    credits: [
      "Decoween",
      "Funny Pumpkin",
      "Happy Hallows",
      "Spookify – AndroFox",
      "Wearable Christmas Hats – Reijvi",
      "Devil Trident, Breeze Trident – Torrezx",
      "Christmas Sugarcane Trident",
      "Rethoughted Trident – CatFromNet (CC BY-NC 4.0)",
      "Mine Cells 3D Weapons – Mim1q",
      "Fishy Weapons – Tofubrain_ (Bogen: Vega_Senpai, Rakete: pikachurro)"
    ],
    guide: {
      title: "Anleitung: Items umbenennen",
      steps: [
        "Auf dem Server das Pack beim Beitreten annehmen.",
        "Einen Amboss aufstellen und öffnen.",
        "Das Grund-Item links in den Amboss legen, z.B. eine Fichtenholzdruckplatte.",
        "Oben den Namen genau so eintippen wie unten angegeben – Gross- und Kleinschreibung zählt.",
        "Item rechts herausnehmen. Das Umbenennen kostet 1 Erfahrungslevel."
      ],
      hint: "Tipp: Ein Klick auf einen Namen kopiert ihn.",
      giveHint: "Mit „/give“ kopierst du den Befehl für den Chat (Cheats müssen an sein).",
      iconPath: "images/server-pack-2026/",
      groups: [
${groups.map((g) => `        { id: ${q(g.id)}, cat: ${q(g.cat)}, item: ${q(g.item)}, itemEn: ${q(g.itemEn)}, names: [${g.names.map((n) => "[" + n.map(q).join(", ") + "]").join(", ")}] }`).join(",\n")}
      ]
    }
  },
`;
}

export function insertEntry(text, entry) {
  const crlf = text.includes("\r\n");
  let t = text.replace(/\r\n/g, "\n");
  const start = t.indexOf('  {\n    id: "server-pack-2026"');
  if (start >= 0) {
    const end = t.indexOf("\n  {\n    id: ", start + 10);
    t = t.slice(0, start) + entry + t.slice(end + 1);
  } else {
    t = t.replace("window.ITEMS = [\n", "window.ITEMS = [\n" + entry);
  }
  return crlf ? t.replace(/\n/g, "\r\n") : t;
}
