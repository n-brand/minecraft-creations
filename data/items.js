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
//   size        optional: Dateigrösse als Text, z.B. "114 KB"
//   details     optional: Absätze für die Detailansicht („Mehr lesen“)
//   features    optional: Liste mit Funktionen für die Detailansicht
//   credits     optional: Ursprüngliche Packs/Ersteller, wenn etwas übernommen wurde
//   guide       optional: Umbenennen-Anleitung (steps, hint, giveHint = nur am PC, iconPath, groups mit
//               id = Minecraft-ID, item/itemEn = Itemname, names = [Name, Icon-Datei])
//   example     true = Platzhalter, zeigt „Bald verfügbar“ statt Download

window.ITEMS = [
  {
    id: "mein-pack",
    category: "texturepacks",
    name: "Mein Pack",
    description: "Goldene Dreizacke, niedrigeres Feuer, freie Sicht mit Kürbis-Kopf und 47 Essens-Texturen zum Umbenennen.",
    version: "1.21.5+",
    edition: "Java",
    file: "downloads/texturepacks/mein-pack.zip",
    image: "images/mein-pack.png",
    updated: "2026-09-26",
    size: "114 KB",
    details: [
      "Mein Pack fasst vier Texturepacks zu einem zusammen. Ein Teil der Änderungen ist immer aktiv, die Essens-Texturen erscheinen erst, wenn du ein Item am Amboss umbenennst. Ohne Umbenennen sehen alle Items normal aus.",
      "Im Zip liegen zwei Anleitungen: In UMBENENNEN.md steht für jedes Item, welche Namen es gibt. BEFEHLE.md enthält fertige /give-Befehle zum Kopieren, falls Cheats an sind. Gross- und Kleinschreibung beim Namen zählt."
    ],
    features: [
      "Immer aktiv: Der Dreizack ist golden.",
      "Immer aktiv: Das Feuer ist niedriger, wenn du brennst, und verdeckt weniger Sicht.",
      "Immer aktiv: Ein Kürbis auf dem Kopf verdeckt die Sicht nicht mehr.",
      "47 Essens- und Getränke-Texturen per Umbenennen, z.B. Big Mac, McFries, Kebab, Ramen, Coca Cola, Fanta, McFlurry, Pancakes und Happy Meal.",
      "Eigenes Item: Getrockneter Seetang mit dem Namen „Pill“ wird zur Tablette.",
      "Getrunkene Items wie Honigflasche und Milcheimer werden zu Limonaden, Eistee und Glace."
    ],
    credits: [
      "Golden Tridents! 1.0v – nela1",
      "LowOnFire – haikis",
      "No Pumpkin Blur",
      "McDonald Food V3 – ItzAX0LOTL"
    ],
    guide: {
      title: "Anleitung: Items umbenennen",
      steps: [
        "Pack in Minecraft aktivieren (Optionen → Ressourcenpakete) und ganz nach oben schieben.",
        "Einen Amboss aufstellen und öffnen.",
        "Das Item links in den Amboss legen, z.B. Brot.",
        "Oben den Namen genau so eintippen wie unten angegeben – Gross- und Kleinschreibung zählt.",
        "Item rechts herausnehmen. Das Umbenennen kostet 1 Erfahrungslevel."
      ],
      hint: "Tipp: Ein Klick auf einen Namen kopiert ihn.",
      giveHint: "Mit „/give“ kopierst du den Befehl für den Chat (Cheats müssen an sein).",
      iconPath: "images/mein-pack/",
      groups: [
        { id: "apple", item: "Apfel", itemEn: "Apple", names: [["Pear", "pear"]] },
        { id: "baked_potato", item: "Ofenkartoffel", itemEn: "Baked Potato", names: [["McFries", "mcfries"]] },
        { id: "beetroot_soup", item: "Rote-Bete-Suppe", itemEn: "Beetroot Soup", names: [["Strawberry Soup", "strawberrysoup"], ["Cold Soup", "coldsoup"]] },
        { id: "bread", item: "Brot", itemEn: "Bread", names: [["Brownie", "brownie"], ["Chocolate Muffin", "choc_chip_muffin"], ["Candycane", "candycane"], ["Gummy Bear", "gummy_bear"]] },
        { id: "cooked_beef", item: "Steak", itemEn: "Cooked Beef", names: [["Cheese Burger", "cheese_burger"]] },
        { id: "cooked_chicken", item: "Gebratenes Hühnchen", itemEn: "Cooked Chicken", names: [["Chicken Nuggets", "chicken_nuggets"]] },
        { id: "cooked_mutton", item: "Gebratenes Hammelfleisch", itemEn: "Cooked Mutton", names: [["Kebab", "kebab"]] },
        { id: "cooked_porkchop", item: "Gebratenes Schweinefleisch", itemEn: "Cooked Porkchop", names: [["Big Mac", "big_mac"], ["Cooked Bacon", "cooked_bacon"]] },
        { id: "porkchop", item: "Rohes Schweinefleisch", itemEn: "Raw Porkchop", names: [["Raw Bacon", "raw_bacon"]] },
        { id: "cooked_salmon", item: "Gebratener Lachs", itemEn: "Cooked Salmon", names: [["Fish", "fish"]] },
        { id: "golden_carrot", item: "Goldene Karotte", itemEn: "Golden Carrot", names: [["Banana", "banana"], ["Strawberry", "strawberry"], ["Cheese", "cheese"]] },
        { id: "honey_bottle", item: "Honigflasche", itemEn: "Honey Bottle", names: [["Lemonade", "lemonade"], ["Sprite", "sprite"], ["Coca Cola", "coca_cola"], ["Fanta", "fanta"], ["Lipton Ice Tea", "lipton_ice_tea_peach"], ["Hot Chocolate", "hot_chocolate"]] },
        { id: "milk_bucket", item: "Milcheimer", itemEn: "Milk Bucket", names: [["Ice Cream", "ice_cream"], ["McFlurry", "mcflurry"], ["McFlurry Chocolate", "mcflurry_chocolate"], ["Water Ice Cream", "water_ice_cream"], ["Sweet Berries Ice Cream", "sweet_berries_ice_cream"], ["Melon Popsicle", "melon_popsicle"], ["Cookie Ice Cream", "cookie_ice_cream"], ["Chorus Ice Cream", "chorus_ice_cream"], ["Cake Ice Cream", "cake_ice_cream"], ["Apple Ice Cream", "apple_ice_cream"]] },
        { id: "mushroom_stew", item: "Pilzsuppe", itemEn: "Mushroom Stew", names: [["Ramen", "ramen"], ["Smashed Potato", "smashedpotato"]] },
        { id: "suspicious_stew", item: "Seltsame Suppe", itemEn: "Suspicious Stew", names: [["Salad", "salad"], ["Cereal", "cereal"]] },
        { id: "pumpkin_pie", item: "Kürbiskuchen", itemEn: "Pumpkin Pie", names: [["Pancakes", "pancake"]] },
        { id: "sweet_berries", item: "Süsse Beeren", itemEn: "Sweet Berries", names: [["Blueberries", "blueberries"], ["Black Berries", "black_berries"], ["Raspberry", "raspberry"], ["Yellow Raspberry", "yellowraspberry"]] },
        { id: "spider_eye", item: "Spinnenauge", itemEn: "Spider Eye", names: [["Eggchan", "eggchan"]] },
        { id: "red_bundle", item: "Rotes Bündel", itemEn: "Red Bundle", names: [["Happy Meal", "happy_meal"]] },
        { id: "gold_nugget", item: "Goldklumpen", itemEn: "Gold Nugget", names: [["Gold Coin", "gold_coin"]] },
        { id: "iron_nugget", item: "Eisenklumpen", itemEn: "Iron Nugget", names: [["Silver Coin", "silver_coin"]] },
        { id: "dried_kelp", item: "Getrockneter Seetang", itemEn: "Dried Kelp", names: [["Pill", "pill"]] }
      ]
    }
  },
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
