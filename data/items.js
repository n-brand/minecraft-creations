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
//   serverOnly  true = kein Download, zeigt „Nur auf dem Server“ (z.B. Server Pack 2026)
//               Im guide kann ein Name einen eigenen Befehl haben: [Name, Icon, "/give …"]
//   info        optional: Schlüssel in window.PACK_INFO (data/halloween-pack.js, vom Generator geschrieben)
//               für die Dateigrösse statt `size`
//   fileLabel   optional: Beschriftung des Haupt-Downloads (sonst „Download“)
//   extraFiles  optional: weitere Downloads [{ file, label, info }]
//   server      optional: Anleitung für den eigenen Server (steps, packInfo = Schlüssel in PACK_INFO
//               für Link und SHA-1)
//   viewer      optional: 3D-Ansicht in der Detailansicht (base = Ordner mit Modellen und Texturen, parts)

window.ITEMS = [
  {
    id: "server-pack-2026",
    category: "texturepacks",
    name: "Server Pack 2026",
    description: "Halloween auf unserem Server: 227 Deko-Items, Kostüme, Süssigkeiten und eine Weihnachtsmütze zum Umbenennen – ganz ohne Mods.",
    version: "26.3",
    edition: "Java",
    serverOnly: true,
    image: "images/server-pack-2026.png",
    updated: "2026-10-30",
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
      "Fishy Weapons – Tofubrain_ (Bogen: Vega_Senpai)"
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
        { id: "leather_helmet", cat: "Kostüme", item: "Albtraum", itemEn: "Kostüm · Funny Pumpkin", names: [["Nightmare Mask", "funny_pumpkin_nightmare_costume_helmet", "/give @s leather_helmet[custom_name=\"Nightmare Mask\"]"], ["Nightmare Robe", "funny_pumpkin_nightmare_costume_chestplate", "/give @s leather_chestplate[custom_name=\"Nightmare Robe\",equippable={slot:\"chest\",asset_id:\"halloween:fp_nightmare_costume_chestplate\"}]"], ["Nightmare Pants", "funny_pumpkin_nightmare_costume_leggings", "/give @s leather_leggings[custom_name=\"Nightmare Pants\",equippable={slot:\"legs\",asset_id:\"halloween:fp_nightmare_costume_leggings\"}]"], ["Nightmare Shoes", "funny_pumpkin_nightmare_costume_boots", "/give @s leather_boots[custom_name=\"Nightmare Shoes\",equippable={slot:\"feet\",asset_id:\"halloween:fp_nightmare_costume_boots\"}]"]] },
        { id: "leather_helmet", cat: "Kostüme", item: "Automat", itemEn: "Kostüm · Funny Pumpkin", names: [["Automaton Head", "funny_pumpkin_automaton_exoskeleton_helmet", "/give @s leather_helmet[custom_name=\"Automaton Head\"]"], ["Automaton Corps", "funny_pumpkin_automaton_exoskeleton_chestplate", "/give @s leather_chestplate[custom_name=\"Automaton Corps\",equippable={slot:\"chest\",asset_id:\"halloween:fp_automaton_exoskeleton_chestplate\"}]"], ["Automaton Legs", "funny_pumpkin_automaton_exoskeleton_leggings", "/give @s leather_leggings[custom_name=\"Automaton Legs\",equippable={slot:\"legs\",asset_id:\"halloween:fp_automaton_exoskeleton_leggings\"}]"], ["Automaton Feets", "funny_pumpkin_automaton_exoskeleton_boots", "/give @s leather_boots[custom_name=\"Automaton Feets\",equippable={slot:\"feet\",asset_id:\"halloween:fp_automaton_exoskeleton_boots\"}]"]] },
        { id: "leather_helmet", cat: "Kostüme", item: "Baumrinde", itemEn: "Kostüm · Funny Pumpkin", names: [["Living Bark Helmet", "funny_pumpkin_living_bark_armor_helmet", "/give @s leather_helmet[custom_name=\"Living Bark Helmet\",equippable={slot:\"head\",asset_id:\"halloween:fp_living_bark\"}]"], ["Living Bark Chestplate", "funny_pumpkin_living_bark_armor_chestplate", "/give @s leather_chestplate[custom_name=\"Living Bark Chestplate\",equippable={slot:\"chest\",asset_id:\"halloween:fp_living_bark\"}]"], ["Living Bark Leggings", "funny_pumpkin_living_bark_armor_leggings", "/give @s leather_leggings[custom_name=\"Living Bark Leggings\",equippable={slot:\"legs\",asset_id:\"halloween:fp_living_bark\"}]"], ["Living Bark Boots", "funny_pumpkin_living_bark_armor_boots", "/give @s leather_boots[custom_name=\"Living Bark Boots\",equippable={slot:\"feet\",asset_id:\"halloween:fp_living_bark\"}]"]] },
        { id: "leather_helmet", cat: "Kostüme", item: "Braut", itemEn: "Kostüm · Happy Hallows", names: [["Bride Mask", "happyhallows_bride_mask", "/give @s leather_helmet[custom_name=\"Bride Mask\",equippable={slot:\"head\",asset_id:\"halloween:hh_bride\"}]"], ["Bride Body", "happyhallows_bride_body", "/give @s leather_chestplate[custom_name=\"Bride Body\",equippable={slot:\"chest\",asset_id:\"halloween:hh_bride\"}]"], ["Bride Breeches", "happyhallows_bride_breeches", "/give @s leather_leggings[custom_name=\"Bride Breeches\",equippable={slot:\"legs\",asset_id:\"halloween:hh_bride\"}]"], ["Bride Boots", "happyhallows_bride_boots", "/give @s leather_boots[custom_name=\"Bride Boots\",equippable={slot:\"feet\",asset_id:\"halloween:hh_bride\"}]"]] },
        { id: "leather_helmet", cat: "Kostüme", item: "Clown", itemEn: "Kostüm · Funny Pumpkin", names: [["Clown Wig", "funny_pumpkin_clown_wig", "/give @s leather_helmet[custom_name=\"Clown Wig\"]"], ["Clown Frag", "funny_pumpkin_clown_costume_chestplate", "/give @s leather_chestplate[custom_name=\"Clown Frag\",equippable={slot:\"chest\",asset_id:\"halloween:fp_clown_costume_chestplate\"}]"], ["Clown Pants", "funny_pumpkin_clown_costume_leggings", "/give @s leather_leggings[custom_name=\"Clown Pants\",equippable={slot:\"legs\",asset_id:\"halloween:fp_clown_costume_leggings\"}]"], ["Clown Boots", "funny_pumpkin_clown_costume_boots", "/give @s leather_boots[custom_name=\"Clown Boots\",equippable={slot:\"feet\",asset_id:\"halloween:fp_clown_costume_boots\"}]"]] },
        { id: "leather_helmet", cat: "Kostüme", item: "Dunkle Mumie", itemEn: "Kostüm · Funny Pumpkin", names: [["Dark Mummy Mask", "funny_pumpkin_dark_mummy_costume_helmet", "/give @s leather_helmet[custom_name=\"Dark Mummy Mask\"]"], ["Dark Mummy Body", "funny_pumpkin_dark_mummy_costume_chestplate", "/give @s leather_chestplate[custom_name=\"Dark Mummy Body\",equippable={slot:\"chest\",asset_id:\"halloween:fp_dark_mummy_costume_chestplate\"}]"], ["Dark Mummy Pants", "funny_pumpkin_dark_mummy_costume_leggings", "/give @s leather_leggings[custom_name=\"Dark Mummy Pants\",equippable={slot:\"legs\",asset_id:\"halloween:fp_dark_mummy_costume_leggings\"}]"], ["Dark Mummy Boots", "funny_pumpkin_dark_mummy_costume_boots", "/give @s leather_boots[custom_name=\"Dark Mummy Boots\",equippable={slot:\"feet\",asset_id:\"halloween:fp_dark_mummy_costume_boots\"}]"]] },
        { id: "leather_helmet", cat: "Kostüme", item: "Engel", itemEn: "Kostüm · Funny Pumpkin", names: [["Angel Ring", "funny_pumpkin_angel_costume_helmet", "/give @s leather_helmet[custom_name=\"Angel Ring\"]"], ["Angel Wings", "funny_pumpkin_angel_costume_chestplate", "/give @s elytra[custom_name=\"Angel Wings\",equippable={slot:\"chest\",asset_id:\"halloween:fp_angel_wings\"}]"]] },
        { id: "leather_helmet", cat: "Kostüme", item: "Frankenstein", itemEn: "Kostüm · Happy Hallows", names: [["Frankenstein Mask", "happyhallows_frankenstein_mask", "/give @s leather_helmet[custom_name=\"Frankenstein Mask\",equippable={slot:\"head\",asset_id:\"halloween:hh_frankenstein\"}]"], ["Frankenstein Body", "happyhallows_frankenstein_body", "/give @s leather_chestplate[custom_name=\"Frankenstein Body\",equippable={slot:\"chest\",asset_id:\"halloween:hh_frankenstein\"}]"], ["Frankenstein Leggings", "happyhallows_frankenstein_leggings", "/give @s leather_leggings[custom_name=\"Frankenstein Leggings\",equippable={slot:\"legs\",asset_id:\"halloween:hh_frankenstein\"}]"], ["Frankenstein Feet", "happyhallows_frankenstein_feet", "/give @s leather_boots[custom_name=\"Frankenstein Feet\",equippable={slot:\"feet\",asset_id:\"halloween:hh_frankenstein\"}]"]] },
        { id: "leather_helmet", cat: "Kostüme", item: "Geist", itemEn: "Kostüm · Funny Pumpkin", names: [["Ghost Mask", "funny_pumpkin_ghost_costume_helmet", "/give @s leather_helmet[custom_name=\"Ghost Mask\"]"], ["Ghost Robe", "funny_pumpkin_ghost_costume_chestplate", "/give @s leather_chestplate[custom_name=\"Ghost Robe\",equippable={slot:\"chest\",asset_id:\"halloween:fp_ghost_costume_chestplate\"}]"]] },
        { id: "leather_helmet", cat: "Kostüme", item: "Hexe", itemEn: "Kostüm · Funny Pumpkin, Decoween", names: [["Witch Costume Helmet", "funny_pumpkin_witch_costume_helmet", "/give @s leather_helmet[custom_name=\"Witch Costume Helmet\"]"], ["Witch Hat", "decoween_witch_hat", "/give @s leather_helmet[custom_name=\"Witch Hat\"]"], ["Witch Robe", "funny_pumpkin_witch_costume_chestplate", "/give @s leather_chestplate[custom_name=\"Witch Robe\",equippable={slot:\"chest\",asset_id:\"halloween:fp_witch_costume_chestplate\"}]"], ["Witch Pants", "funny_pumpkin_witch_costume_leggings", "/give @s leather_leggings[custom_name=\"Witch Pants\",equippable={slot:\"legs\",asset_id:\"halloween:fp_witch_costume_leggings\"}]"], ["Witch Boots", "funny_pumpkin_witch_costume_boots", "/give @s leather_boots[custom_name=\"Witch Boots\",equippable={slot:\"feet\",asset_id:\"halloween:fp_witch_costume_boots\"}]"]] },
        { id: "leather_helmet", cat: "Kostüme", item: "Kultist", itemEn: "Kostüm · Funny Pumpkin", names: [["Cultist Hood", "funny_pumpkin_cultist_costume_helmet", "/give @s leather_helmet[custom_name=\"Cultist Hood\"]"], ["Cultist Robe", "funny_pumpkin_cultist_costume_chestplate", "/give @s leather_chestplate[custom_name=\"Cultist Robe\",equippable={slot:\"chest\",asset_id:\"halloween:fp_cultist_costume_chestplate\"}]"], ["Cultist Pants", "funny_pumpkin_cultist_costume_leggings", "/give @s leather_leggings[custom_name=\"Cultist Pants\",equippable={slot:\"legs\",asset_id:\"halloween:fp_cultist_costume_leggings\"}]"]] },
        { id: "leather_helmet", cat: "Kostüme", item: "Kürbis", itemEn: "Kostüm · Funny Pumpkin", names: [["Pumpkin Helmet", "funny_pumpkin_pumpkin_armor_helmet", "/give @s leather_helmet[custom_name=\"Pumpkin Helmet\",equippable={slot:\"head\",asset_id:\"halloween:fp_pumpkin\"}]"], ["Pumpkin Mask", "funny_pumpkin_pumpkin_mask_helmet", "/give @s leather_helmet[custom_name=\"Pumpkin Mask\"]"], ["Pumpkin Chestplate", "funny_pumpkin_pumpkin_armor_chestplate", "/give @s leather_chestplate[custom_name=\"Pumpkin Chestplate\",equippable={slot:\"chest\",asset_id:\"halloween:fp_pumpkin\"}]"], ["Pumpkin Leggings", "funny_pumpkin_pumpkin_armor_leggings", "/give @s leather_leggings[custom_name=\"Pumpkin Leggings\",equippable={slot:\"legs\",asset_id:\"halloween:fp_pumpkin\"}]"], ["Pumpkin Boots", "funny_pumpkin_pumpkin_armor_boots", "/give @s leather_boots[custom_name=\"Pumpkin Boots\",equippable={slot:\"feet\",asset_id:\"halloween:fp_pumpkin\"}]"]] },
        { id: "leather_chestplate", cat: "Kostüme", item: "Kürbis-Magier", itemEn: "Kostüm · Funny Pumpkin", names: [["Pumpkin Caster Cloak", "funny_pumpkin_pumpkin_caster_cloak_chestplate", "/give @s leather_chestplate[custom_name=\"Pumpkin Caster Cloak\"]"]] },
        { id: "leather_helmet", cat: "Kostüme", item: "Meerjungfrau", itemEn: "Kostüm · Happy Hallows", names: [["Mermaid Mask", "happyhallows_mermaid_mask", "/give @s leather_helmet[custom_name=\"Mermaid Mask\",equippable={slot:\"head\",asset_id:\"halloween:hh_mermaid\"}]"], ["Mermaid Body", "happyhallows_mermaid_body", "/give @s leather_chestplate[custom_name=\"Mermaid Body\",equippable={slot:\"chest\",asset_id:\"halloween:hh_mermaid\"}]"], ["Mermaid Tail", "happyhallows_mermaid_tail", "/give @s leather_leggings[custom_name=\"Mermaid Tail\",equippable={slot:\"legs\",asset_id:\"halloween:hh_mermaid\"}]"], ["Mermaid Fins", "happyhallows_mermaid_fins", "/give @s leather_boots[custom_name=\"Mermaid Fins\",equippable={slot:\"feet\",asset_id:\"halloween:hh_mermaid\"}]"]] },
        { id: "leather_helmet", cat: "Kostüme", item: "Mumie", itemEn: "Kostüm · Funny Pumpkin, Happy Hallows", names: [["Mummy Costume Helmet", "funny_pumpkin_mummy_costume_helmet", "/give @s leather_helmet[custom_name=\"Mummy Costume Helmet\"]"], ["Mummy Mask", "happyhallows_mummy_mask", "/give @s leather_helmet[custom_name=\"Mummy Mask\",equippable={slot:\"head\",asset_id:\"halloween:hh_mummy\"}]"], ["Mummy Body", "happyhallows_mummy_body", "/give @s leather_chestplate[custom_name=\"Mummy Body\",equippable={slot:\"chest\",asset_id:\"halloween:hh_mummy\"}]"], ["Mummy Costume Chestplate", "funny_pumpkin_mummy_costume_chestplate", "/give @s leather_chestplate[custom_name=\"Mummy Costume Chestplate\",equippable={slot:\"chest\",asset_id:\"halloween:fp_mummy_costume_chestplate\"}]"], ["Mummy Leggings", "happyhallows_mummy_leggings", "/give @s leather_leggings[custom_name=\"Mummy Leggings\",equippable={slot:\"legs\",asset_id:\"halloween:hh_mummy\"}]"], ["Mummy Pants", "funny_pumpkin_mummy_costume_leggings", "/give @s leather_leggings[custom_name=\"Mummy Pants\",equippable={slot:\"legs\",asset_id:\"halloween:fp_mummy_costume_leggings\"}]"], ["Mummy Boots", "funny_pumpkin_mummy_costume_boots", "/give @s leather_boots[custom_name=\"Mummy Boots\",equippable={slot:\"feet\",asset_id:\"halloween:fp_mummy_costume_boots\"}]"], ["Mummy Feet", "happyhallows_mummy_feet", "/give @s leather_boots[custom_name=\"Mummy Feet\",equippable={slot:\"feet\",asset_id:\"halloween:hh_mummy\"}]"]] },
        { id: "leather_helmet", cat: "Kostüme", item: "Pirat", itemEn: "Kostüm · Happy Hallows", names: [["Pirate Mask", "happyhallows_pirate_mask", "/give @s leather_helmet[custom_name=\"Pirate Mask\",equippable={slot:\"head\",asset_id:\"halloween:hh_pirate\"}]"], ["Pirate Body", "happyhallows_pirate_body", "/give @s leather_chestplate[custom_name=\"Pirate Body\",equippable={slot:\"chest\",asset_id:\"halloween:hh_pirate\"}]"], ["Pirate Pants", "happyhallows_pirate_pants", "/give @s leather_leggings[custom_name=\"Pirate Pants\",equippable={slot:\"legs\",asset_id:\"halloween:hh_pirate\"}]"], ["Pirate Plunderers", "happyhallows_pirate_plunderers", "/give @s leather_boots[custom_name=\"Pirate Plunderers\",equippable={slot:\"feet\",asset_id:\"halloween:hh_pirate\"}]"]] },
        { id: "leather_helmet", cat: "Kostüme", item: "Prinzessin", itemEn: "Kostüm · Funny Pumpkin", names: [["Princess Crown", "funny_pumpkin_princess_costume_helmet", "/give @s leather_helmet[custom_name=\"Princess Crown\"]"], ["Princess Dress", "funny_pumpkin_princess_costume_chestplate", "/give @s leather_chestplate[custom_name=\"Princess Dress\",equippable={slot:\"chest\",asset_id:\"halloween:fp_princess_costume_chestplate\"}]"], ["Princess Skirt", "funny_pumpkin_princess_costume_leggings", "/give @s leather_leggings[custom_name=\"Princess Skirt\",equippable={slot:\"legs\",asset_id:\"halloween:fp_princess_costume_leggings\"}]"], ["Princess Shoes", "funny_pumpkin_princess_costume_boots", "/give @s leather_boots[custom_name=\"Princess Shoes\",equippable={slot:\"feet\",asset_id:\"halloween:fp_princess_costume_boots\"}]"]] },
        { id: "leather_helmet", cat: "Kostüme", item: "Teufel", itemEn: "Kostüm · Funny Pumpkin", names: [["Demonic Horns", "funny_pumpkin_demon_costume_helmet", "/give @s leather_helmet[custom_name=\"Demonic Horns\"]"], ["Demonic Wings", "funny_pumpkin_demon_costume_chestplate", "/give @s elytra[custom_name=\"Demonic Wings\",equippable={slot:\"chest\",asset_id:\"halloween:fp_demon_wings\"}]"]] },
        { id: "leather_helmet", cat: "Kostüme", item: "Tiefenmonster", itemEn: "Kostüm · Funny Pumpkin", names: [["Depth Monster Head", "funny_pumpkin_depth_monster_costume_helmet", "/give @s leather_helmet[custom_name=\"Depth Monster Head\"]"], ["Depth Monster Body", "funny_pumpkin_depth_monster_costume_chestplate", "/give @s leather_chestplate[custom_name=\"Depth Monster Body\",equippable={slot:\"chest\",asset_id:\"halloween:fp_depth_monster_costume_chestplate\"}]"], ["Depth Monster Pants", "funny_pumpkin_depth_monster_costume_leggings", "/give @s leather_leggings[custom_name=\"Depth Monster Pants\",equippable={slot:\"legs\",asset_id:\"halloween:fp_depth_monster_costume_leggings\"}]"], ["Depth Monster Boots", "funny_pumpkin_depth_monster_costume_boots", "/give @s leather_boots[custom_name=\"Depth Monster Boots\",equippable={slot:\"feet\",asset_id:\"halloween:fp_depth_monster_costume_boots\"}]"]] },
        { id: "leather_helmet", cat: "Kostüme", item: "Tod", itemEn: "Kostüm · Funny Pumpkin", names: [["Death Hood", "funny_pumpkin_death_costume_helmet", "/give @s leather_helmet[custom_name=\"Death Hood\"]"], ["Death Robe", "funny_pumpkin_death_costume_chestplate", "/give @s leather_chestplate[custom_name=\"Death Robe\",equippable={slot:\"chest\",asset_id:\"halloween:fp_death_costume_chestplate\"}]"]] },
        { id: "leather_helmet", cat: "Kostüme", item: "Vampir", itemEn: "Kostüm · Funny Pumpkin", names: [["Vampire Eyes 1", "funny_pumpkin_vampire_eyes_1", "/give @s leather_helmet[custom_name=\"Vampire Eyes 1\"]"], ["Vampire Eyes 2", "funny_pumpkin_vampire_eyes_2", "/give @s leather_helmet[custom_name=\"Vampire Eyes 2\"]"], ["Vampire Eyes 3", "funny_pumpkin_vampire_eyes_3", "/give @s leather_helmet[custom_name=\"Vampire Eyes 3\"]"], ["Vampire Hat", "funny_pumpkin_vampire_costume_1_helmet", "/give @s leather_helmet[custom_name=\"Vampire Hat\"]"], ["Vampire Hat Eyes 1", "funny_pumpkin_vampire_hat_eyes_1", "/give @s leather_helmet[custom_name=\"Vampire Hat Eyes 1\"]"], ["Vampire Hat Eyes 2", "funny_pumpkin_vampire_hat_eyes_2", "/give @s leather_helmet[custom_name=\"Vampire Hat Eyes 2\"]"], ["Vampire Hat Eyes 3", "funny_pumpkin_vampire_hat_eyes_3", "/give @s leather_helmet[custom_name=\"Vampire Hat Eyes 3\"]"], ["Vampire Cloak", "funny_pumpkin_vampire_cloak", "/give @s leather_chestplate[custom_name=\"Vampire Cloak\",equippable={slot:\"chest\",asset_id:\"halloween:fp_vampire_cloak\"}]"], ["Vampire Frag", "funny_pumpkin_vampire_costume_1_chestplate", "/give @s leather_chestplate[custom_name=\"Vampire Frag\",equippable={slot:\"chest\",asset_id:\"halloween:fp_vampire_costume_1_chestplate\"}]"], ["Vampire Vest", "funny_pumpkin_vampire_costume_2_chestplate", "/give @s leather_chestplate[custom_name=\"Vampire Vest\",equippable={slot:\"chest\",asset_id:\"halloween:fp_vampire_costume_2_chestplate\"}]"], ["Vampire Pants", "funny_pumpkin_vampire_costume_1_leggings", "/give @s leather_leggings[custom_name=\"Vampire Pants\",equippable={slot:\"legs\",asset_id:\"halloween:fp_vampire_costume_1_leggings\"}]"], ["Vampire Shoes", "funny_pumpkin_vampire_costume_1_boots", "/give @s leather_boots[custom_name=\"Vampire Shoes\",equippable={slot:\"feet\",asset_id:\"halloween:fp_vampire_costume_1_boots\"}]"]] },
        { id: "leather_helmet", cat: "Kostüme", item: "Vogelscheuche", itemEn: "Kostüm · Funny Pumpkin", names: [["Scarecrow Hat", "funny_pumpkin_scarecrow_costume_helmet", "/give @s leather_helmet[custom_name=\"Scarecrow Hat\"]"], ["Scarecrow Head", "funny_pumpkin_scarecrow_head", "/give @s leather_helmet[custom_name=\"Scarecrow Head\"]"], ["Scarecrow Robe", "funny_pumpkin_scarecrow_costume_chestplate", "/give @s leather_chestplate[custom_name=\"Scarecrow Robe\",equippable={slot:\"chest\",asset_id:\"halloween:fp_scarecrow_costume_chestplate\"}]"], ["Scarecrow Pants", "funny_pumpkin_scarecrow_costume_leggings", "/give @s leather_leggings[custom_name=\"Scarecrow Pants\",equippable={slot:\"legs\",asset_id:\"halloween:fp_scarecrow_costume_leggings\"}]"]] },
        { id: "leather_helmet", cat: "Kostüme", item: "Wassermann", itemEn: "Kostüm · Happy Hallows", names: [["Merman Mask", "happyhallows_merman_mask", "/give @s leather_helmet[custom_name=\"Merman Mask\",equippable={slot:\"head\",asset_id:\"halloween:hh_merman\"}]"], ["Merman Body", "happyhallows_merman_body", "/give @s leather_chestplate[custom_name=\"Merman Body\",equippable={slot:\"chest\",asset_id:\"halloween:hh_merman\"}]"], ["Merman Tail", "happyhallows_merman_tail", "/give @s leather_leggings[custom_name=\"Merman Tail\",equippable={slot:\"legs\",asset_id:\"halloween:hh_merman\"}]"], ["Merman Fins", "happyhallows_merman_fins", "/give @s leather_boots[custom_name=\"Merman Fins\",equippable={slot:\"feet\",asset_id:\"halloween:hh_merman\"}]"]] },
        { id: "carved_pumpkin", cat: "Kostüme", item: "Weihnachten", itemEn: "Kostüm · Weihnachtsmützen", names: [["Christmas Hat", "halloween_christmas_hat", "/give @s carved_pumpkin[custom_name=\"Christmas Hat\"]"]] },
        { id: "bundle", cat: "Sonstiges", item: "Bündel", itemEn: "Bundle · Spookify", names: [["Bag Bone", "spookify_bag_bone", "/give @s bundle[custom_name=\"Bag Bone\"]"], ["Bag Ghost", "spookify_bag_ghost", "/give @s bundle[custom_name=\"Bag Ghost\"]"], ["Bag Halloween", "spookify_bag_halloween", "/give @s bundle[custom_name=\"Bag Halloween\"]"]] },
        { id: "spruce_pressure_plate", cat: "Deko", item: "Fichtenholzdruckplatte", itemEn: "Spruce Pressure Plate · Decoween", names: [["Candelabra", "decoween_candelabra", "/give @s spruce_pressure_plate[custom_name=\"Candelabra\"]"], ["Crystal Ball", "decoween_crystal_ball", "/give @s spruce_pressure_plate[custom_name=\"Crystal Ball\"]"], ["Deer Skull", "decoween_deer_skull", "/give @s spruce_pressure_plate[custom_name=\"Deer Skull\"]"], ["Fortune Teller's Table", "decoween_fortune_table", "/give @s spruce_pressure_plate[custom_name=\"Fortune Teller's Table\"]"], ["Gothic Throne", "decoween_gothic_throne", "/give @s spruce_pressure_plate[custom_name=\"Gothic Throne\"]"], ["Haunted Fountain", "decoween_haunted_fountain", "/give @s spruce_pressure_plate[custom_name=\"Haunted Fountain\"]"], ["Haunted Well", "decoween_haunted_well", "/give @s spruce_pressure_plate[custom_name=\"Haunted Well\"]"], ["Jack-in-the-Box", "decoween_jack_in_the_box", "/give @s spruce_pressure_plate[custom_name=\"Jack-in-the-Box\"]"], ["Pumpkin Cart", "decoween_pumpkin_cart", "/give @s spruce_pressure_plate[custom_name=\"Pumpkin Cart\"]"], ["Pumpkin Pile", "decoween_pumpkin_pile", "/give @s spruce_pressure_plate[custom_name=\"Pumpkin Pile\"]"], ["Scarecrow", "decoween_scarecrow", "/give @s spruce_pressure_plate[custom_name=\"Scarecrow\"]"], ["Skittish Crow", "decoween_startled_crow", "/give @s spruce_pressure_plate[custom_name=\"Skittish Crow\"]"], ["Skull Candle", "decoween_skull_candle", "/give @s spruce_pressure_plate[custom_name=\"Skull Candle\"]"], ["Witch Broom", "decoween_witch_broom", "/give @s spruce_pressure_plate[custom_name=\"Witch Broom\"]"], ["Witch Cauldron", "decoween_witch_cauldron", "/give @s spruce_pressure_plate[custom_name=\"Witch Cauldron\"]"], ["Zombie Hand", "decoween_zombie_hand", "/give @s spruce_pressure_plate[custom_name=\"Zombie Hand\"]"]] },
        { id: "spruce_pressure_plate", cat: "Deko", item: "Fichtenholzdruckplatte", itemEn: "Spruce Pressure Plate · Funny Pumpkin", names: [["Ancient Skeleton", "funny_pumpkin_ancient_skeleton", "/give @s spruce_pressure_plate[custom_name=\"Ancient Skeleton\"]"], ["Berry Muffin Block", "funny_pumpkin_berry_muffin_block", "/give @s spruce_pressure_plate[custom_name=\"Berry Muffin Block\"]"], ["Candy Pumpkin", "funny_pumpkin_candy_pumpkin_block", "/give @s spruce_pressure_plate[custom_name=\"Candy Pumpkin\"]"], ["Death Statue Deepslate", "funny_pumpkin_death_statue_deepslate", "/give @s spruce_pressure_plate[custom_name=\"Death Statue Deepslate\"]"], ["Death Statue Nether", "funny_pumpkin_death_statue_nether", "/give @s spruce_pressure_plate[custom_name=\"Death Statue Nether\"]"], ["Death Statue Stone", "funny_pumpkin_death_statue_stone", "/give @s spruce_pressure_plate[custom_name=\"Death Statue Stone\"]"], ["Drop Pumpkin Candle", "funny_pumpkin_drop_pumpkin_candle", "/give @s spruce_pressure_plate[custom_name=\"Drop Pumpkin Candle\"]"], ["Gargoyle Statue Deepslate", "funny_pumpkin_gargoyle_statue_deepslate", "/give @s spruce_pressure_plate[custom_name=\"Gargoyle Statue Deepslate\"]"], ["Gargoyle Statue Nether", "funny_pumpkin_gargoyle_statue_nether", "/give @s spruce_pressure_plate[custom_name=\"Gargoyle Statue Nether\"]"], ["Gargoyle Statue Stone", "funny_pumpkin_gargoyle_statue_stone", "/give @s spruce_pressure_plate[custom_name=\"Gargoyle Statue Stone\"]"], ["Lay Corpse", "funny_pumpkin_lay_corpse", "/give @s spruce_pressure_plate[custom_name=\"Lay Corpse\"]"], ["Lay Mushroom Corpse", "funny_pumpkin_lay_mushroom_corpse", "/give @s spruce_pressure_plate[custom_name=\"Lay Mushroom Corpse\"]"], ["Lay Skeleton", "funny_pumpkin_lay_skeleton", "/give @s spruce_pressure_plate[custom_name=\"Lay Skeleton\"]"], ["Lay Torn Corpse", "funny_pumpkin_lay_torn_corpse", "/give @s spruce_pressure_plate[custom_name=\"Lay Torn Corpse\"]"], ["Lollipop Pot", "funny_pumpkin_lollipop_pot", "/give @s spruce_pressure_plate[custom_name=\"Lollipop Pot\"]"], ["Pumpkin Candle", "funny_pumpkin_pumpkin_candle", "/give @s spruce_pressure_plate[custom_name=\"Pumpkin Candle\"]"], ["Seat Corpse", "funny_pumpkin_seat_corpse", "/give @s spruce_pressure_plate[custom_name=\"Seat Corpse\"]"], ["Seat Mushroom Corpse", "funny_pumpkin_seat_mushroom_corpse", "/give @s spruce_pressure_plate[custom_name=\"Seat Mushroom Corpse\"]"], ["Seat Skeleton", "funny_pumpkin_seat_skeleton", "/give @s spruce_pressure_plate[custom_name=\"Seat Skeleton\"]"], ["Seat Torn Corpse", "funny_pumpkin_seat_torn_corpse", "/give @s spruce_pressure_plate[custom_name=\"Seat Torn Corpse\"]"], ["Sewing Table", "funny_pumpkin_sewing_table", "/give @s spruce_pressure_plate[custom_name=\"Sewing Table\"]"], ["Skeleton Grave", "funny_pumpkin_skeleton_grave", "/give @s spruce_pressure_plate[custom_name=\"Skeleton Grave\"]"]] },
        { id: "spruce_pressure_plate", cat: "Deko", item: "Fichtenholzdruckplatte", itemEn: "Spruce Pressure Plate · Happy Hallows", names: [["Gravestone-Simple", "happyhallows_gravestone_plain", "/give @s spruce_pressure_plate[custom_name=\"Gravestone-Simple\"]"]] },
        { id: "spruce_pressure_plate", cat: "Deko", item: "Fichtenholzdruckplatte", itemEn: "Spruce Pressure Plate · Spookify", names: [["Brain Jar", "spookify_brain_jar", "/give @s spruce_pressure_plate[custom_name=\"Brain Jar\"]"], ["Broom Stick", "spookify_broom_stick", "/give @s spruce_pressure_plate[custom_name=\"Broom Stick\"]"], ["Coffin", "spookify_coffin", "/give @s spruce_pressure_plate[custom_name=\"Coffin\"]"], ["Kotel", "spookify_kotel", "/give @s spruce_pressure_plate[custom_name=\"Kotel\"]"]] },
        { id: "lantern", cat: "Deko", item: "Laterne", itemEn: "Lantern · Funny Pumpkin", names: [["Hanged Corpse", "funny_pumpkin_hanged_corpse", "/give @s lantern[custom_name=\"Hanged Corpse\"]"], ["Hanged Torn Corpse", "funny_pumpkin_hanged_torn_corpse", "/give @s lantern[custom_name=\"Hanged Torn Corpse\"]"]] },
        { id: "bread", cat: "Essen", item: "Brot", itemEn: "Bread · Mein Pack", names: [["Brownie", "mein_pack_brownie", "/give @s bread[custom_name=\"Brownie\"]"], ["Candycane", "mein_pack_candycane", "/give @s bread[custom_name=\"Candycane\"]"], ["Chocolate Muffin", "mein_pack_chocolate_muffin", "/give @s bread[custom_name=\"Chocolate Muffin\"]"], ["Gummy Bear", "mein_pack_gummy_bear", "/give @s bread[custom_name=\"Gummy Bear\"]"]] },
        { id: "bread", cat: "Essen", item: "Brot", itemEn: "Bread · Funny Pumpkin", names: [["Berry Muffin", "funny_pumpkin_berry_muffin", "/give @s bread[custom_name=\"Berry Muffin\"]"], ["Black Candy", "funny_pumpkin_black_candy", "/give @s bread[custom_name=\"Black Candy\"]"], ["Blue Candy", "funny_pumpkin_blue_candy", "/give @s bread[custom_name=\"Blue Candy\"]"], ["Caramel Key", "funny_pumpkin_caramel_key", "/give @s bread[custom_name=\"Caramel Key\"]"], ["Chocolate Egg", "funny_pumpkin_nether_monster_egg", "/give @s bread[custom_name=\"Chocolate Egg\"]"], ["Cyan Candy", "funny_pumpkin_cyan_candy", "/give @s bread[custom_name=\"Cyan Candy\"]"], ["Gray Candy", "funny_pumpkin_gray_candy", "/give @s bread[custom_name=\"Gray Candy\"]"], ["Green Candy", "funny_pumpkin_green_candy", "/give @s bread[custom_name=\"Green Candy\"]"], ["Lava Candy Egg", "funny_pumpkin_nether_monster_egg_ingredient", "/give @s bread[custom_name=\"Lava Candy Egg\"]"], ["Light Blue Candy", "funny_pumpkin_light_blue_candy", "/give @s bread[custom_name=\"Light Blue Candy\"]"], ["Light Gray Candy", "funny_pumpkin_light_gray_candy", "/give @s bread[custom_name=\"Light Gray Candy\"]"], ["Lime Candy", "funny_pumpkin_lime_candy", "/give @s bread[custom_name=\"Lime Candy\"]"], ["Magenta Candy", "funny_pumpkin_magenta_candy", "/give @s bread[custom_name=\"Magenta Candy\"]"], ["Orange Candy", "funny_pumpkin_orange_candy", "/give @s bread[custom_name=\"Orange Candy\"]"], ["Pink Candy", "funny_pumpkin_pink_candy", "/give @s bread[custom_name=\"Pink Candy\"]"], ["Pumpkin Lollipop", "funny_pumpkin_pumpkin_lollipop", "/give @s bread[custom_name=\"Pumpkin Lollipop\"]"], ["Purple Candy", "funny_pumpkin_purple_candy", "/give @s bread[custom_name=\"Purple Candy\"]"], ["Red Candy", "funny_pumpkin_red_candy", "/give @s bread[custom_name=\"Red Candy\"]"], ["White Candy", "funny_pumpkin_white_candy", "/give @s bread[custom_name=\"White Candy\"]"], ["Yellow Candy", "funny_pumpkin_yellow_candy", "/give @s bread[custom_name=\"Yellow Candy\"]"]] },
        { id: "apple", cat: "Essen", item: "Apfel", itemEn: "Apple · Mein Pack", names: [["Pear", "mein_pack_pear", "/give @s apple[custom_name=\"Pear\"]"]] },
        { id: "baked_potato", cat: "Essen", item: "Ofenkartoffel", itemEn: "Baked Potato · Mein Pack", names: [["McFries", "mein_pack_mcfries", "/give @s baked_potato[custom_name=\"McFries\"]"]] },
        { id: "beetroot_soup", cat: "Essen", item: "Rote-Bete-Suppe", itemEn: "Beetroot Soup · Mein Pack", names: [["Cold Soup", "mein_pack_cold_soup", "/give @s beetroot_soup[custom_name=\"Cold Soup\"]"], ["Strawberry Soup", "mein_pack_strawberry_soup", "/give @s beetroot_soup[custom_name=\"Strawberry Soup\"]"]] },
        { id: "cooked_beef", cat: "Essen", item: "Steak", itemEn: "Cooked Beef · Mein Pack", names: [["Cheese Burger", "mein_pack_cheese_burger", "/give @s cooked_beef[custom_name=\"Cheese Burger\"]"]] },
        { id: "cooked_chicken", cat: "Essen", item: "Gebratenes Hühnchen", itemEn: "Cooked Chicken · Mein Pack", names: [["Chicken Nuggets", "mein_pack_chicken_nuggets", "/give @s cooked_chicken[custom_name=\"Chicken Nuggets\"]"]] },
        { id: "cooked_mutton", cat: "Essen", item: "Gebratenes Hammelfleisch", itemEn: "Cooked Mutton · Mein Pack", names: [["Kebab", "mein_pack_kebab", "/give @s cooked_mutton[custom_name=\"Kebab\"]"]] },
        { id: "cooked_porkchop", cat: "Essen", item: "Gebratenes Schweinefleisch", itemEn: "Cooked Porkchop · Mein Pack", names: [["Big Mac", "mein_pack_big_mac", "/give @s cooked_porkchop[custom_name=\"Big Mac\"]"], ["Cooked Bacon", "mein_pack_cooked_bacon", "/give @s cooked_porkchop[custom_name=\"Cooked Bacon\"]"]] },
        { id: "porkchop", cat: "Essen", item: "Rohes Schweinefleisch", itemEn: "Raw Porkchop · Mein Pack", names: [["Raw Bacon", "mein_pack_raw_bacon", "/give @s porkchop[custom_name=\"Raw Bacon\"]"]] },
        { id: "cooked_salmon", cat: "Essen", item: "Gebratener Lachs", itemEn: "Cooked Salmon · Mein Pack", names: [["Fish", "mein_pack_fish", "/give @s cooked_salmon[custom_name=\"Fish\"]"]] },
        { id: "golden_carrot", cat: "Essen", item: "Goldene Karotte", itemEn: "Golden Carrot · Mein Pack", names: [["Banana", "mein_pack_banana", "/give @s golden_carrot[custom_name=\"Banana\"]"], ["Cheese", "mein_pack_cheese", "/give @s golden_carrot[custom_name=\"Cheese\"]"], ["Strawberry", "mein_pack_strawberry", "/give @s golden_carrot[custom_name=\"Strawberry\"]"]] },
        { id: "sweet_berries", cat: "Essen", item: "Süsse Beeren", itemEn: "Sweet Berries · Mein Pack", names: [["Black Berries", "mein_pack_black_berries", "/give @s sweet_berries[custom_name=\"Black Berries\"]"], ["Blueberries", "mein_pack_blueberries", "/give @s sweet_berries[custom_name=\"Blueberries\"]"], ["Raspberry", "mein_pack_raspberry", "/give @s sweet_berries[custom_name=\"Raspberry\"]"], ["Yellow Raspberry", "mein_pack_yellow_raspberry", "/give @s sweet_berries[custom_name=\"Yellow Raspberry\"]"]] },
        { id: "pumpkin_pie", cat: "Essen", item: "Kürbiskuchen", itemEn: "Pumpkin Pie · Mein Pack", names: [["Pancakes", "mein_pack_pancakes", "/give @s pumpkin_pie[custom_name=\"Pancakes\"]"]] },
        { id: "mushroom_stew", cat: "Essen", item: "Pilzsuppe", itemEn: "Mushroom Stew · Mein Pack", names: [["Ramen", "mein_pack_ramen", "/give @s mushroom_stew[custom_name=\"Ramen\"]"], ["Smashed Potato", "mein_pack_smashed_potato", "/give @s mushroom_stew[custom_name=\"Smashed Potato\"]"]] },
        { id: "suspicious_stew", cat: "Essen", item: "Seltsame Suppe", itemEn: "Suspicious Stew · Mein Pack", names: [["Cereal", "mein_pack_cereal", "/give @s suspicious_stew[custom_name=\"Cereal\"]"], ["Salad", "mein_pack_salad", "/give @s suspicious_stew[custom_name=\"Salad\"]"]] },
        { id: "honey_bottle", cat: "Essen", item: "Honigflasche", itemEn: "Honey Bottle · Mein Pack", names: [["Coca Cola", "mein_pack_coca_cola", "/give @s honey_bottle[custom_name=\"Coca Cola\"]"], ["Fanta", "mein_pack_fanta", "/give @s honey_bottle[custom_name=\"Fanta\"]"], ["Hot Chocolate", "mein_pack_hot_chocolate", "/give @s honey_bottle[custom_name=\"Hot Chocolate\"]"], ["Lemonade", "mein_pack_lemonade", "/give @s honey_bottle[custom_name=\"Lemonade\"]"], ["Lipton Ice Tea", "mein_pack_lipton_ice_tea", "/give @s honey_bottle[custom_name=\"Lipton Ice Tea\"]"], ["Sprite", "mein_pack_sprite", "/give @s honey_bottle[custom_name=\"Sprite\"]"]] },
        { id: "milk_bucket", cat: "Essen", item: "Milcheimer", itemEn: "Milk Bucket · Mein Pack", names: [["Apple Ice Cream", "mein_pack_apple_ice_cream", "/give @s milk_bucket[custom_name=\"Apple Ice Cream\"]"], ["Cake Ice Cream", "mein_pack_cake_ice_cream", "/give @s milk_bucket[custom_name=\"Cake Ice Cream\"]"], ["Chorus Ice Cream", "mein_pack_chorus_ice_cream", "/give @s milk_bucket[custom_name=\"Chorus Ice Cream\"]"], ["Cookie Ice Cream", "mein_pack_cookie_ice_cream", "/give @s milk_bucket[custom_name=\"Cookie Ice Cream\"]"], ["Ice Cream", "mein_pack_ice_cream", "/give @s milk_bucket[custom_name=\"Ice Cream\"]"], ["McFlurry", "mein_pack_mcflurry", "/give @s milk_bucket[custom_name=\"McFlurry\"]"], ["McFlurry Chocolate", "mein_pack_mcflurry_chocolate", "/give @s milk_bucket[custom_name=\"McFlurry Chocolate\"]"], ["Melon Popsicle", "mein_pack_melon_popsicle", "/give @s milk_bucket[custom_name=\"Melon Popsicle\"]"], ["Sweet Berries Ice Cream", "mein_pack_sweet_berries_ice_cream", "/give @s milk_bucket[custom_name=\"Sweet Berries Ice Cream\"]"], ["Water Ice Cream", "mein_pack_water_ice_cream", "/give @s milk_bucket[custom_name=\"Water Ice Cream\"]"]] },
        { id: "trident", cat: "Waffen", item: "Dreizack", itemEn: "Trident · Dreizack-Packs", names: [["Breeze Trident", "tridents_breeze_trident", "/give @s trident[custom_name=\"Breeze Trident\"]"], ["Devil Trident", "tridents_devil_trident", "/give @s trident[custom_name=\"Devil Trident\"]"], ["Rethoughted Trident", "tridents_rethoughted_trident", "/give @s trident[custom_name=\"Rethoughted Trident\"]"], ["Sugarcane Trident", "tridents_sugarcane_trident", "/give @s trident[custom_name=\"Sugarcane Trident\"]"]] },
        { id: "netherite_sword", cat: "Waffen", item: "Netheritschwert", itemEn: "Netherite Sword · Mine Cells 3D Weapons", names: [["Assassin's Dagger", "mine_cells_assassins_dagger", "/give @s netherite_sword[custom_name=\"Assassin's Dagger\"]"], ["Balanced Blade", "mine_cells_balanced_blade", "/give @s netherite_sword[custom_name=\"Balanced Blade\"]"], ["Blood Sword", "mine_cells_blood_sword", "/give @s netherite_sword[custom_name=\"Blood Sword\"]"], ["Broadsword", "mine_cells_broadsword", "/give @s netherite_sword[custom_name=\"Broadsword\"]"], ["Crowbar", "mine_cells_crowbar", "/give @s netherite_sword[custom_name=\"Crowbar\"]"], ["Cursed Sword", "mine_cells_cursed_sword", "/give @s netherite_sword[custom_name=\"Cursed Sword\"]"], ["Frost Blast", "mine_cells_frost_blast", "/give @s netherite_sword[custom_name=\"Frost Blast\"]"], ["Hattori's Katana", "mine_cells_hattoris_katana", "/give @s netherite_sword[custom_name=\"Hattori's Katana\"]"], ["Nutcracker", "mine_cells_nutcracker", "/give @s netherite_sword[custom_name=\"Nutcracker\"]"], ["Phaser", "mine_cells_phaser", "/give @s netherite_sword[custom_name=\"Phaser\"]"], ["Spite Sword", "mine_cells_spite_sword", "/give @s netherite_sword[custom_name=\"Spite Sword\"]"], ["Tentacle D***o", "mine_cells_tentacle", "/give @s netherite_sword[custom_name=\"Tentacle D***o\"]"], ["The Flint", "mine_cells_flint", "/give @s netherite_sword[custom_name=\"The Flint\"]"]] },
        { id: "bow", cat: "Waffen", item: "Bogen", itemEn: "Bow · Fishy Weapons", names: [["Fishy Bow", "fishy_fishy_bow", "/give @s bow[custom_name=\"Fishy Bow\"]"]] },
        { id: "crossbow", cat: "Waffen", item: "Armbrust", itemEn: "Crossbow · Fishy Weapons", names: [["Fishy Crossbow", "fishy_fishy_crossbow", "/give @s crossbow[custom_name=\"Fishy Crossbow\"]"]] },
        { id: "mace", cat: "Waffen", item: "Streitkolben", itemEn: "Mace · Fishy Weapons", names: [["Fishy Mace", "fishy_fishy_mace", "/give @s mace[custom_name=\"Fishy Mace\"]"]] },
        { id: "end_rod", cat: "Waffen", item: "Endstab", itemEn: "End Rod · Mine Cells 3D Weapons", names: [["Tentacle D***o", "mine_cells_tentacle_end_rod", "/give @s end_rod[custom_name=\"Tentacle D***o\"]"]] }
      ]
    }
  },
  {
    id: "halloween-pack",
    category: "texturepacks",
    name: "Halloween-Pack",
    description: "Teufelshörner, Teufelsflügel und ein Teufelsdreizack per Umbenennen – für deinen Server, alle Spieler sehen es.",
    version: "26.3",
    edition: "Java",
    file: "downloads/texturepacks/halloween-pack.zip",
    fileLabel: "Resource Pack",
    info: "halloween-pack",
    extraFiles: [
      { file: "downloads/texturepacks/halloween-datapack.zip", label: "Datapack für den Server", info: "halloween-datapack" }
    ],
    image: "images/halloween-pack.png",
    updated: "2026-10-25",
    details: [
      "Das Halloween-Pack ist für einen eigenen Server gemacht: Der Server schickt das Resource Pack allen Spielern, das Datapack läuft auf dem Server. Benennst du ein Item im Amboss richtig um, sehen alle Spieler die Teufels-Sachen – ohne Mods.",
      "Nicht umbenannte Lederkappen, Elytren und Dreizacke sehen normal aus. Später kommen weitere Halloween-Sachen dazu.",
      "Im Spiel noch nicht getestet – wenn etwas schief sitzt, bitte melden."
    ],
    features: [
      "Teufelshörner: Lederkappe umbenennen – 3D-Hörner im Inventar und auf dem Kopf. Schützt weiter wie eine Lederkappe.",
      "Teufelsflügel: Elytren umbenennen – beim Tragen rote Fledermausflügel. Fliegen geht wie immer.",
      "Teufelsdreizack: Dreizack umbenennen – 3D-Teufelsdreizack in Hand und Inventar. Geworfen sieht er aus wie ein normaler Dreizack.",
      "Auch ohne Umlaute: „Teufelshoerner“ und „Teufelsfluegel“ funktionieren ebenfalls."
    ],
    viewer: {
      base: "images/halloween-pack/",
      parts: [
        { id: "all", label: "Alles am Spieler" },
        { id: "teufelshoerner", label: "Hörner" },
        { id: "teufelsfluegel", label: "Flügel" },
        { id: "teufelsdreizack", label: "Dreizack" }
      ]
    },
    guide: {
      title: "Anleitung: Items umbenennen",
      steps: [
        "Auf dem Server spielen, auf dem das Halloween-Pack eingerichtet ist (siehe unten), und das Resource Pack beim Beitreten annehmen.",
        "Einen Amboss aufstellen und öffnen.",
        "Lederkappe, Elytren oder Dreizack links in den Amboss legen.",
        "Oben den Namen genau so eintippen wie unten angegeben – Gross- und Kleinschreibung zählt.",
        "Item herausnehmen. Teufelshörner und -flügel anziehen – erst dann erscheinen sie am Spieler."
      ],
      hint: "Tipp: Ein Klick auf einen Namen kopiert ihn.",
      giveHint: "Mit „/give“ kopierst du den Befehl für den Chat (Cheats müssen an sein).",
      iconPath: "images/halloween-pack/",
      groups: [
        { id: "leather_helmet", item: "Lederkappe", itemEn: "Leather Cap", names: [["Teufelshörner", "teufelshoerner"], ["Teufelshoerner", "teufelshoerner"]] },
        { id: "elytra", item: "Elytren", itemEn: "Elytra", names: [["Teufelsflügel", "teufelsfluegel"], ["Teufelsfluegel", "teufelsfluegel"]] },
        { id: "trident", item: "Dreizack", itemEn: "Trident", names: [["Teufelsdreizack", "teufelsdreizack"]] }
      ]
    },
    server: {
      title: "Auf dem Server einrichten",
      packInfo: "halloween-pack",
      steps: [
        "Server stoppen.",
        "In der Datei server.properties diese drei Zeilen eintragen (Link und SHA-1 unten kopieren).",
        "require-resource-pack=true empfiehlt sich: Wer das Pack ablehnt, sähe bei anderen statt Hörnern nur eine normale Lederkappe.",
        "Das Datapack (Zip, nicht entpacken) in den Ordner world/datapacks/ des Servers legen.",
        "Server starten. Beim Beitreten fragt Minecraft jeden Spieler, ob er das Pack laden will."
      ],
      hint: "Nach jedem Update des Packs die neue SHA-1 in server.properties eintragen, sonst laden Spieler die alte Version. Der Link funktioniert erst, wenn GitHub Pages für die Seite eingeschaltet ist."
    }
  },
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
