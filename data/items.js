// Alle Downloads der Seite. Neue Einträge einfach hier anhängen.
//
// Felder:
//   id          eindeutiger Kurzname (nur a-z, 0-9, -)
//   category    "mods" | "texturepacks" | "skins"
//   name        Anzeigename
//   description kurze Beschreibung (1–2 Sätze)
//   version     Minecraft-Version, z.B. "1.21.1"
//   edition     "Java" | "Bedrock"
//   loader      nur bei Mods: "Fabric" | "Forge" | "NeoForge" | "Quilt"
//   file        Pfad zur Datei unter downloads/<kategorie>/
//   image       optional: Vorschaubild unter images/ (sonst Kategorie-Icon)
//   updated     Datum im Format JJJJ-MM-TT
//   example     true = Platzhalter, zeigt „Bald verfügbar“ statt Download

window.ITEMS = [
  {
    id: "better-torches",
    category: "mods",
    name: "Better Torches",
    description: "Fackeln leuchten heller und lassen sich farbig einfärben.",
    version: "1.21.1",
    edition: "Java",
    loader: "Fabric",
    file: "downloads/mods/better-torches-1.0.0.jar",
    updated: "2026-10-20",
    example: true
  },
  {
    id: "quick-stack",
    category: "mods",
    name: "Quick Stack",
    description: "Sortiert Items per Tastendruck in Truhen in der Nähe.",
    version: "1.20.4",
    edition: "Java",
    loader: "Forge",
    file: "downloads/mods/quick-stack-0.3.2.jar",
    updated: "2026-09-02",
    example: true
  },
  {
    id: "soft-pastel",
    category: "texturepacks",
    name: "Soft Pastel",
    description: "Helle Pastellfarben für alle Blöcke, 16x Auflösung.",
    version: "1.21.1",
    edition: "Java",
    file: "downloads/texturepacks/soft-pastel-16x.zip",
    updated: "2026-10-11",
    example: true
  },
  {
    id: "dark-ui",
    category: "texturepacks",
    name: "Dark UI",
    description: "Dunkles Inventar und dunkle Menüs, schont die Augen.",
    version: "1.21",
    edition: "Bedrock",
    file: "downloads/texturepacks/dark-ui.mcpack",
    updated: "2026-08-28",
    example: true
  },
  {
    id: "knight-skin",
    category: "skins",
    name: "Ritter",
    description: "Ritter in Eisenrüstung mit rotem Umhang.",
    version: "alle",
    edition: "Java",
    file: "downloads/skins/ritter.png",
    updated: "2026-10-05",
    example: true
  },
  {
    id: "astronaut-skin",
    category: "skins",
    name: "Astronaut",
    description: "Weisser Raumanzug mit goldenem Visier.",
    version: "alle",
    edition: "Java",
    file: "downloads/skins/astronaut.png",
    updated: "2026-09-18",
    example: true
  }
];
