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
  paper: ["Papier", "Paper"],
  music_disc_13: ["Schallplatte „13“", "Music Disc 13"],
};
const MODS = { christmas_hats: "Weihnachtsmützen", "decoween-neoforge": "Decoween", funny_pumpkin: "Funny Pumpkin", happyhallows: "Happy Hallows", spookify: "Spookify" };
const q = (s) => JSON.stringify(s);

export function entrySource(items) {
  const groups = [];
  for (const base of Object.keys(BASES)) {
    for (const mod of Object.keys(MODS)) {
      const rows = items.filter((i) => i.base === base && i.mod === mod).sort((a, b) => a.name.localeCompare(b.name));
      if (!rows.length) continue;
      groups.push({ id: base, item: BASES[base][0], itemEn: `${BASES[base][1]} · ${MODS[mod]}`, names: rows.map((i) => (i.equipment ? [i.name, i.icon, giveCommand(i)] : [i.name, i.icon])) });
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
    features: [
      "Deko in 3D: Kerzenleuchter, Statuen, Leichen, Hexenkessel, Kristallkugel, Thron und mehr – hinstellen und per Linksklick wieder abbauen.",
      "Kostüme: Braut, Frankenstein, Meerjungfrau, Pirat, Mumie, Vampir, Hexe, Clown und viele mehr.",
      "Echte Optik beim Anziehen: Braut, Frankenstein, Meerjungfrau, Wassermann, Mumie, Pirat, Kürbis- und Baumrinden-Rüstung. Einfach umbenennen und anziehen.",
      "Weihnachtsmütze: Geschnitzten Kürbis „Christmas Hat“ nennen und aufsetzen – mit freier Sicht.",
      "Süssigkeiten, Muffin und Lollis liegen auf dem Brot und sind essbar.",
      "Hängende Deko (Leichen am Seil) liegt auf der Laterne: an die Decke hängen, dann erscheint das Modell.",
      "Totenköpfe mit Kerzen liegen auf dem Skelettschädel: aufsetzen oder hinstellen (platziert als normaler Schädel).",
      "Süssigkeiten-Beutel liegen auf dem Bündel – du kannst Sachen darin aufbewahren.",
      "Flügel liegen auf den Elytren – du kannst damit fliegen (angezogen sehen sie wie normale Elytren aus).",
      "6 Musik-Discs (spielen die normale Disc-Musik)."
    ],
    credits: [
      "Decoween",
      "Funny Pumpkin",
      "Happy Hallows",
      "Spookify – AndroFox",
      "Wearable Christmas Hats – Reijvi"
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
${groups.map((g) => `        { id: ${q(g.id)}, item: ${q(g.item)}, itemEn: ${q(g.itemEn)}, names: [${g.names.map((n) => "[" + n.map(q).join(", ") + "]").join(", ")}] }`).join(",\n")}
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
