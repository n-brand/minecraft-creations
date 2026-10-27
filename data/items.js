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
    description: "Halloween auf unserem Server: 204 Deko-Items, Kostüme, Süssigkeiten und eine Weihnachtsmütze zum Umbenennen – ganz ohne Mods.",
    version: "26.3",
    edition: "Java",
    serverOnly: true,
    image: "images/server-pack-2026.png",
    updated: "2026-10-27",
    details: [
      "Das Server Pack 2026 bringt Sachen aus vier Halloween-Mods in Vanilla-Minecraft. Du benennst ein normales Item am Amboss um, und es sieht aus wie das Mod-Item. Ohne Umbenennen bleibt alles normal.",
      "Das Pack gibt es nur auf unserem Server, es lädt beim Beitreten automatisch. Hier findest du alle Namen und fertige /give-Befehle.",
      "3D-Deko liegt auf der Fichtenholzdruckplatte: Stell sie einfach hin, dann erscheint das Modell. Mit einem Linksklick aufs Modell baust du es wieder ab und bekommst das Item zurück."
    ],
    features: [
      "Deko in 3D: Kerzenleuchter, Totenkopf-Kerzen, Statuen, Leichen, Hexenkessel, Kristallkugel, Thron und mehr – hinstellen und per Linksklick wieder abbauen.",
      "Kostüme: Braut, Frankenstein, Meerjungfrau, Pirat, Mumie, Vampir, Hexe, Clown und viele mehr.",
      "Echte Optik beim Anziehen: Roben, Hosen und Schuhe wie in der Mod, Hüte, Masken, Hörner und Vampiraugen als 3D-Modell auf dem Kopf.",
      "Roter Dreizack zum Teufel-Kostüm: Dreizack „Red Trident“ nennen – rot in der Hand und auch im Flug.",
      "Kostüme gehen auch mit Diamant-, Eisen-, Netherit- und Kupfer-Rüstung: Rüstung umbenennen, dann sieht sie aus wie das Kostüm und schützt trotzdem wie vorher.",
      "Weihnachtsmütze: Geschnitzten Kürbis „Christmas Hat“ nennen und aufsetzen – mit freier Sicht.",
      "Süssigkeiten, Muffin und Lollis liegen auf dem Brot und sind essbar.",
      "Hängende Deko (Leichen am Seil) liegt auf der Laterne: an die Decke hängen, dann erscheint das Modell.",
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
        { id: "leather_helmet", item: "Albtraum", itemEn: "Kostüm · Funny Pumpkin", names: [["Nightmare Mask", "funny_pumpkin_nightmare_costume_helmet", "/give @s leather_helmet[custom_name=\"Nightmare Mask\"]"], ["Nightmare Robe", "funny_pumpkin_nightmare_costume_chestplate", "/give @s leather_chestplate[custom_name=\"Nightmare Robe\",equippable={slot:\"chest\",asset_id:\"halloween:fp_nightmare_costume_chestplate\"}]"], ["Nightmare Pants", "funny_pumpkin_nightmare_costume_leggings", "/give @s leather_leggings[custom_name=\"Nightmare Pants\",equippable={slot:\"legs\",asset_id:\"halloween:fp_nightmare_costume_leggings\"}]"], ["Nightmare Shoes", "funny_pumpkin_nightmare_costume_boots", "/give @s leather_boots[custom_name=\"Nightmare Shoes\",equippable={slot:\"feet\",asset_id:\"halloween:fp_nightmare_costume_boots\"}]"]] },
        { id: "leather_helmet", item: "Automat", itemEn: "Kostüm · Funny Pumpkin", names: [["Automaton Head", "funny_pumpkin_automaton_exoskeleton_helmet", "/give @s leather_helmet[custom_name=\"Automaton Head\"]"], ["Automaton Corps", "funny_pumpkin_automaton_exoskeleton_chestplate", "/give @s leather_chestplate[custom_name=\"Automaton Corps\",equippable={slot:\"chest\",asset_id:\"halloween:fp_automaton_exoskeleton_chestplate\"}]"], ["Automaton Legs", "funny_pumpkin_automaton_exoskeleton_leggings", "/give @s leather_leggings[custom_name=\"Automaton Legs\",equippable={slot:\"legs\",asset_id:\"halloween:fp_automaton_exoskeleton_leggings\"}]"], ["Automaton Feets", "funny_pumpkin_automaton_exoskeleton_boots", "/give @s leather_boots[custom_name=\"Automaton Feets\",equippable={slot:\"feet\",asset_id:\"halloween:fp_automaton_exoskeleton_boots\"}]"]] },
        { id: "leather_helmet", item: "Baumrinde", itemEn: "Kostüm · Funny Pumpkin", names: [["Living Bark Helmet", "funny_pumpkin_living_bark_armor_helmet", "/give @s leather_helmet[custom_name=\"Living Bark Helmet\",equippable={slot:\"head\",asset_id:\"halloween:fp_living_bark\"}]"], ["Living Bark Chestplate", "funny_pumpkin_living_bark_armor_chestplate", "/give @s leather_chestplate[custom_name=\"Living Bark Chestplate\",equippable={slot:\"chest\",asset_id:\"halloween:fp_living_bark\"}]"], ["Living Bark Leggings", "funny_pumpkin_living_bark_armor_leggings", "/give @s leather_leggings[custom_name=\"Living Bark Leggings\",equippable={slot:\"legs\",asset_id:\"halloween:fp_living_bark\"}]"], ["Living Bark Boots", "funny_pumpkin_living_bark_armor_boots", "/give @s leather_boots[custom_name=\"Living Bark Boots\",equippable={slot:\"feet\",asset_id:\"halloween:fp_living_bark\"}]"]] },
        { id: "leather_helmet", item: "Braut", itemEn: "Kostüm · Happy Hallows", names: [["Bride Mask", "happyhallows_bride_mask", "/give @s leather_helmet[custom_name=\"Bride Mask\",equippable={slot:\"head\",asset_id:\"halloween:hh_bride\"}]"], ["Bride Body", "happyhallows_bride_body", "/give @s leather_chestplate[custom_name=\"Bride Body\",equippable={slot:\"chest\",asset_id:\"halloween:hh_bride\"}]"], ["Bride Breeches", "happyhallows_bride_breeches", "/give @s leather_leggings[custom_name=\"Bride Breeches\",equippable={slot:\"legs\",asset_id:\"halloween:hh_bride\"}]"], ["Bride Boots", "happyhallows_bride_boots", "/give @s leather_boots[custom_name=\"Bride Boots\",equippable={slot:\"feet\",asset_id:\"halloween:hh_bride\"}]"]] },
        { id: "leather_helmet", item: "Clown", itemEn: "Kostüm · Funny Pumpkin", names: [["Clown Wig", "funny_pumpkin_clown_wig", "/give @s leather_helmet[custom_name=\"Clown Wig\"]"], ["Clown Frag", "funny_pumpkin_clown_costume_chestplate", "/give @s leather_chestplate[custom_name=\"Clown Frag\",equippable={slot:\"chest\",asset_id:\"halloween:fp_clown_costume_chestplate\"}]"], ["Clown Pants", "funny_pumpkin_clown_costume_leggings", "/give @s leather_leggings[custom_name=\"Clown Pants\",equippable={slot:\"legs\",asset_id:\"halloween:fp_clown_costume_leggings\"}]"], ["Clown Boots", "funny_pumpkin_clown_costume_boots", "/give @s leather_boots[custom_name=\"Clown Boots\",equippable={slot:\"feet\",asset_id:\"halloween:fp_clown_costume_boots\"}]"]] },
        { id: "leather_helmet", item: "Dunkle Mumie", itemEn: "Kostüm · Funny Pumpkin", names: [["Dark Mummy Mask", "funny_pumpkin_dark_mummy_costume_helmet", "/give @s leather_helmet[custom_name=\"Dark Mummy Mask\"]"], ["Dark Mummy Body", "funny_pumpkin_dark_mummy_costume_chestplate", "/give @s leather_chestplate[custom_name=\"Dark Mummy Body\",equippable={slot:\"chest\",asset_id:\"halloween:fp_dark_mummy_costume_chestplate\"}]"], ["Dark Mummy Pants", "funny_pumpkin_dark_mummy_costume_leggings", "/give @s leather_leggings[custom_name=\"Dark Mummy Pants\",equippable={slot:\"legs\",asset_id:\"halloween:fp_dark_mummy_costume_leggings\"}]"], ["Dark Mummy Boots", "funny_pumpkin_dark_mummy_costume_boots", "/give @s leather_boots[custom_name=\"Dark Mummy Boots\",equippable={slot:\"feet\",asset_id:\"halloween:fp_dark_mummy_costume_boots\"}]"]] },
        { id: "leather_helmet", item: "Engel", itemEn: "Kostüm · Funny Pumpkin", names: [["Angel Ring", "funny_pumpkin_angel_costume_helmet", "/give @s leather_helmet[custom_name=\"Angel Ring\"]"], ["Angel Wings", "funny_pumpkin_angel_costume_chestplate", "/give @s elytra[custom_name=\"Angel Wings\",equippable={slot:\"chest\",asset_id:\"halloween:fp_angel_wings\"}]"]] },
        { id: "leather_helmet", item: "Frankenstein", itemEn: "Kostüm · Happy Hallows", names: [["Frankenstein Mask", "happyhallows_frankenstein_mask", "/give @s leather_helmet[custom_name=\"Frankenstein Mask\",equippable={slot:\"head\",asset_id:\"halloween:hh_frankenstein\"}]"], ["Frankenstein Body", "happyhallows_frankenstein_body", "/give @s leather_chestplate[custom_name=\"Frankenstein Body\",equippable={slot:\"chest\",asset_id:\"halloween:hh_frankenstein\"}]"], ["Frankenstein Leggings", "happyhallows_frankenstein_leggings", "/give @s leather_leggings[custom_name=\"Frankenstein Leggings\",equippable={slot:\"legs\",asset_id:\"halloween:hh_frankenstein\"}]"], ["Frankenstein Feet", "happyhallows_frankenstein_feet", "/give @s leather_boots[custom_name=\"Frankenstein Feet\",equippable={slot:\"feet\",asset_id:\"halloween:hh_frankenstein\"}]"]] },
        { id: "leather_helmet", item: "Geist", itemEn: "Kostüm · Funny Pumpkin", names: [["Ghost Mask", "funny_pumpkin_ghost_costume_helmet", "/give @s leather_helmet[custom_name=\"Ghost Mask\"]"], ["Ghost Robe", "funny_pumpkin_ghost_costume_chestplate", "/give @s leather_chestplate[custom_name=\"Ghost Robe\",equippable={slot:\"chest\",asset_id:\"halloween:fp_ghost_costume_chestplate\"}]"]] },
        { id: "leather_helmet", item: "Hexe", itemEn: "Kostüm · Funny Pumpkin, Decoween", names: [["Witch Costume Helmet", "funny_pumpkin_witch_costume_helmet", "/give @s leather_helmet[custom_name=\"Witch Costume Helmet\"]"], ["Witch Hat", "decoween_witch_hat", "/give @s leather_helmet[custom_name=\"Witch Hat\"]"], ["Witch Robe", "funny_pumpkin_witch_costume_chestplate", "/give @s leather_chestplate[custom_name=\"Witch Robe\",equippable={slot:\"chest\",asset_id:\"halloween:fp_witch_costume_chestplate\"}]"], ["Witch Pants", "funny_pumpkin_witch_costume_leggings", "/give @s leather_leggings[custom_name=\"Witch Pants\",equippable={slot:\"legs\",asset_id:\"halloween:fp_witch_costume_leggings\"}]"], ["Witch Boots", "funny_pumpkin_witch_costume_boots", "/give @s leather_boots[custom_name=\"Witch Boots\",equippable={slot:\"feet\",asset_id:\"halloween:fp_witch_costume_boots\"}]"]] },
        { id: "leather_helmet", item: "Kultist", itemEn: "Kostüm · Funny Pumpkin", names: [["Cultist Hood", "funny_pumpkin_cultist_costume_helmet", "/give @s leather_helmet[custom_name=\"Cultist Hood\"]"], ["Cultist Robe", "funny_pumpkin_cultist_costume_chestplate", "/give @s leather_chestplate[custom_name=\"Cultist Robe\",equippable={slot:\"chest\",asset_id:\"halloween:fp_cultist_costume_chestplate\"}]"], ["Cultist Pants", "funny_pumpkin_cultist_costume_leggings", "/give @s leather_leggings[custom_name=\"Cultist Pants\",equippable={slot:\"legs\",asset_id:\"halloween:fp_cultist_costume_leggings\"}]"]] },
        { id: "leather_helmet", item: "Kürbis", itemEn: "Kostüm · Funny Pumpkin", names: [["Pumpkin Helmet", "funny_pumpkin_pumpkin_armor_helmet", "/give @s leather_helmet[custom_name=\"Pumpkin Helmet\",equippable={slot:\"head\",asset_id:\"halloween:fp_pumpkin\"}]"], ["Pumpkin Mask", "funny_pumpkin_pumpkin_mask_helmet", "/give @s leather_helmet[custom_name=\"Pumpkin Mask\"]"], ["Pumpkin Chestplate", "funny_pumpkin_pumpkin_armor_chestplate", "/give @s leather_chestplate[custom_name=\"Pumpkin Chestplate\",equippable={slot:\"chest\",asset_id:\"halloween:fp_pumpkin\"}]"], ["Pumpkin Leggings", "funny_pumpkin_pumpkin_armor_leggings", "/give @s leather_leggings[custom_name=\"Pumpkin Leggings\",equippable={slot:\"legs\",asset_id:\"halloween:fp_pumpkin\"}]"], ["Pumpkin Boots", "funny_pumpkin_pumpkin_armor_boots", "/give @s leather_boots[custom_name=\"Pumpkin Boots\",equippable={slot:\"feet\",asset_id:\"halloween:fp_pumpkin\"}]"]] },
        { id: "leather_chestplate", item: "Kürbis-Magier", itemEn: "Kostüm · Funny Pumpkin", names: [["Pumpkin Caster Cloak", "funny_pumpkin_pumpkin_caster_cloak_chestplate", "/give @s leather_chestplate[custom_name=\"Pumpkin Caster Cloak\"]"]] },
        { id: "leather_helmet", item: "Meerjungfrau", itemEn: "Kostüm · Happy Hallows", names: [["Mermaid Mask", "happyhallows_mermaid_mask", "/give @s leather_helmet[custom_name=\"Mermaid Mask\",equippable={slot:\"head\",asset_id:\"halloween:hh_mermaid\"}]"], ["Mermaid Body", "happyhallows_mermaid_body", "/give @s leather_chestplate[custom_name=\"Mermaid Body\",equippable={slot:\"chest\",asset_id:\"halloween:hh_mermaid\"}]"], ["Mermaid Tail", "happyhallows_mermaid_tail", "/give @s leather_leggings[custom_name=\"Mermaid Tail\",equippable={slot:\"legs\",asset_id:\"halloween:hh_mermaid\"}]"], ["Mermaid Fins", "happyhallows_mermaid_fins", "/give @s leather_boots[custom_name=\"Mermaid Fins\",equippable={slot:\"feet\",asset_id:\"halloween:hh_mermaid\"}]"]] },
        { id: "leather_helmet", item: "Mumie", itemEn: "Kostüm · Funny Pumpkin, Happy Hallows", names: [["Mummy Costume Helmet", "funny_pumpkin_mummy_costume_helmet", "/give @s leather_helmet[custom_name=\"Mummy Costume Helmet\"]"], ["Mummy Mask", "happyhallows_mummy_mask", "/give @s leather_helmet[custom_name=\"Mummy Mask\",equippable={slot:\"head\",asset_id:\"halloween:hh_mummy\"}]"], ["Mummy Body", "happyhallows_mummy_body", "/give @s leather_chestplate[custom_name=\"Mummy Body\",equippable={slot:\"chest\",asset_id:\"halloween:hh_mummy\"}]"], ["Mummy Costume Chestplate", "funny_pumpkin_mummy_costume_chestplate", "/give @s leather_chestplate[custom_name=\"Mummy Costume Chestplate\",equippable={slot:\"chest\",asset_id:\"halloween:fp_mummy_costume_chestplate\"}]"], ["Mummy Leggings", "happyhallows_mummy_leggings", "/give @s leather_leggings[custom_name=\"Mummy Leggings\",equippable={slot:\"legs\",asset_id:\"halloween:hh_mummy\"}]"], ["Mummy Pants", "funny_pumpkin_mummy_costume_leggings", "/give @s leather_leggings[custom_name=\"Mummy Pants\",equippable={slot:\"legs\",asset_id:\"halloween:fp_mummy_costume_leggings\"}]"], ["Mummy Boots", "funny_pumpkin_mummy_costume_boots", "/give @s leather_boots[custom_name=\"Mummy Boots\",equippable={slot:\"feet\",asset_id:\"halloween:fp_mummy_costume_boots\"}]"], ["Mummy Feet", "happyhallows_mummy_feet", "/give @s leather_boots[custom_name=\"Mummy Feet\",equippable={slot:\"feet\",asset_id:\"halloween:hh_mummy\"}]"]] },
        { id: "leather_helmet", item: "Pirat", itemEn: "Kostüm · Happy Hallows", names: [["Pirate Mask", "happyhallows_pirate_mask", "/give @s leather_helmet[custom_name=\"Pirate Mask\",equippable={slot:\"head\",asset_id:\"halloween:hh_pirate\"}]"], ["Pirate Body", "happyhallows_pirate_body", "/give @s leather_chestplate[custom_name=\"Pirate Body\",equippable={slot:\"chest\",asset_id:\"halloween:hh_pirate\"}]"], ["Pirate Pants", "happyhallows_pirate_pants", "/give @s leather_leggings[custom_name=\"Pirate Pants\",equippable={slot:\"legs\",asset_id:\"halloween:hh_pirate\"}]"], ["Pirate Plunderers", "happyhallows_pirate_plunderers", "/give @s leather_boots[custom_name=\"Pirate Plunderers\",equippable={slot:\"feet\",asset_id:\"halloween:hh_pirate\"}]"]] },
        { id: "leather_helmet", item: "Prinzessin", itemEn: "Kostüm · Funny Pumpkin", names: [["Princess Crown", "funny_pumpkin_princess_costume_helmet", "/give @s leather_helmet[custom_name=\"Princess Crown\"]"], ["Princess Dress", "funny_pumpkin_princess_costume_chestplate", "/give @s leather_chestplate[custom_name=\"Princess Dress\",equippable={slot:\"chest\",asset_id:\"halloween:fp_princess_costume_chestplate\"}]"], ["Princess Skirt", "funny_pumpkin_princess_costume_leggings", "/give @s leather_leggings[custom_name=\"Princess Skirt\",equippable={slot:\"legs\",asset_id:\"halloween:fp_princess_costume_leggings\"}]"], ["Princess Shoes", "funny_pumpkin_princess_costume_boots", "/give @s leather_boots[custom_name=\"Princess Shoes\",equippable={slot:\"feet\",asset_id:\"halloween:fp_princess_costume_boots\"}]"]] },
        { id: "leather_helmet", item: "Teufel", itemEn: "Kostüm · Funny Pumpkin, Eigenes", names: [["Demonic Horns", "funny_pumpkin_demon_costume_helmet", "/give @s leather_helmet[custom_name=\"Demonic Horns\"]"], ["Demonic Wings", "funny_pumpkin_demon_costume_chestplate", "/give @s elytra[custom_name=\"Demonic Wings\",equippable={slot:\"chest\",asset_id:\"halloween:fp_demon_wings\"}]"], ["Red Trident", "halloween_red_trident", "/give @s trident[custom_name=\"Red Trident\"]"]] },
        { id: "leather_helmet", item: "Tiefenmonster", itemEn: "Kostüm · Funny Pumpkin", names: [["Depth Monster Head", "funny_pumpkin_depth_monster_costume_helmet", "/give @s leather_helmet[custom_name=\"Depth Monster Head\"]"], ["Depth Monster Body", "funny_pumpkin_depth_monster_costume_chestplate", "/give @s leather_chestplate[custom_name=\"Depth Monster Body\",equippable={slot:\"chest\",asset_id:\"halloween:fp_depth_monster_costume_chestplate\"}]"], ["Depth Monster Pants", "funny_pumpkin_depth_monster_costume_leggings", "/give @s leather_leggings[custom_name=\"Depth Monster Pants\",equippable={slot:\"legs\",asset_id:\"halloween:fp_depth_monster_costume_leggings\"}]"], ["Depth Monster Boots", "funny_pumpkin_depth_monster_costume_boots", "/give @s leather_boots[custom_name=\"Depth Monster Boots\",equippable={slot:\"feet\",asset_id:\"halloween:fp_depth_monster_costume_boots\"}]"]] },
        { id: "leather_helmet", item: "Tod", itemEn: "Kostüm · Funny Pumpkin", names: [["Death Hood", "funny_pumpkin_death_costume_helmet", "/give @s leather_helmet[custom_name=\"Death Hood\"]"], ["Death Robe", "funny_pumpkin_death_costume_chestplate", "/give @s leather_chestplate[custom_name=\"Death Robe\",equippable={slot:\"chest\",asset_id:\"halloween:fp_death_costume_chestplate\"}]"]] },
        { id: "leather_helmet", item: "Vampir", itemEn: "Kostüm · Funny Pumpkin", names: [["Vampire Eyes 1", "funny_pumpkin_vampire_eyes_1", "/give @s leather_helmet[custom_name=\"Vampire Eyes 1\"]"], ["Vampire Eyes 2", "funny_pumpkin_vampire_eyes_2", "/give @s leather_helmet[custom_name=\"Vampire Eyes 2\"]"], ["Vampire Eyes 3", "funny_pumpkin_vampire_eyes_3", "/give @s leather_helmet[custom_name=\"Vampire Eyes 3\"]"], ["Vampire Hat", "funny_pumpkin_vampire_costume_1_helmet", "/give @s leather_helmet[custom_name=\"Vampire Hat\"]"], ["Vampire Hat Eyes 1", "funny_pumpkin_vampire_hat_eyes_1", "/give @s leather_helmet[custom_name=\"Vampire Hat Eyes 1\"]"], ["Vampire Hat Eyes 2", "funny_pumpkin_vampire_hat_eyes_2", "/give @s leather_helmet[custom_name=\"Vampire Hat Eyes 2\"]"], ["Vampire Hat Eyes 3", "funny_pumpkin_vampire_hat_eyes_3", "/give @s leather_helmet[custom_name=\"Vampire Hat Eyes 3\"]"], ["Vampire Cloak", "funny_pumpkin_vampire_cloak", "/give @s leather_chestplate[custom_name=\"Vampire Cloak\",equippable={slot:\"chest\",asset_id:\"halloween:fp_vampire_cloak\"}]"], ["Vampire Frag", "funny_pumpkin_vampire_costume_1_chestplate", "/give @s leather_chestplate[custom_name=\"Vampire Frag\",equippable={slot:\"chest\",asset_id:\"halloween:fp_vampire_costume_1_chestplate\"}]"], ["Vampire Vest", "funny_pumpkin_vampire_costume_2_chestplate", "/give @s leather_chestplate[custom_name=\"Vampire Vest\",equippable={slot:\"chest\",asset_id:\"halloween:fp_vampire_costume_2_chestplate\"}]"], ["Vampire Pants", "funny_pumpkin_vampire_costume_1_leggings", "/give @s leather_leggings[custom_name=\"Vampire Pants\",equippable={slot:\"legs\",asset_id:\"halloween:fp_vampire_costume_1_leggings\"}]"], ["Vampire Shoes", "funny_pumpkin_vampire_costume_1_boots", "/give @s leather_boots[custom_name=\"Vampire Shoes\",equippable={slot:\"feet\",asset_id:\"halloween:fp_vampire_costume_1_boots\"}]"]] },
        { id: "leather_helmet", item: "Vogelscheuche", itemEn: "Kostüm · Funny Pumpkin", names: [["Scarecrow Hat", "funny_pumpkin_scarecrow_costume_helmet", "/give @s leather_helmet[custom_name=\"Scarecrow Hat\"]"], ["Scarecrow Head", "funny_pumpkin_scarecrow_head", "/give @s leather_helmet[custom_name=\"Scarecrow Head\"]"], ["Scarecrow Robe", "funny_pumpkin_scarecrow_costume_chestplate", "/give @s leather_chestplate[custom_name=\"Scarecrow Robe\",equippable={slot:\"chest\",asset_id:\"halloween:fp_scarecrow_costume_chestplate\"}]"], ["Scarecrow Pants", "funny_pumpkin_scarecrow_costume_leggings", "/give @s leather_leggings[custom_name=\"Scarecrow Pants\",equippable={slot:\"legs\",asset_id:\"halloween:fp_scarecrow_costume_leggings\"}]"]] },
        { id: "leather_helmet", item: "Wassermann", itemEn: "Kostüm · Happy Hallows", names: [["Merman Mask", "happyhallows_merman_mask", "/give @s leather_helmet[custom_name=\"Merman Mask\",equippable={slot:\"head\",asset_id:\"halloween:hh_merman\"}]"], ["Merman Body", "happyhallows_merman_body", "/give @s leather_chestplate[custom_name=\"Merman Body\",equippable={slot:\"chest\",asset_id:\"halloween:hh_merman\"}]"], ["Merman Tail", "happyhallows_merman_tail", "/give @s leather_leggings[custom_name=\"Merman Tail\",equippable={slot:\"legs\",asset_id:\"halloween:hh_merman\"}]"], ["Merman Fins", "happyhallows_merman_fins", "/give @s leather_boots[custom_name=\"Merman Fins\",equippable={slot:\"feet\",asset_id:\"halloween:hh_merman\"}]"]] },
        { id: "carved_pumpkin", item: "Weihnachten", itemEn: "Kostüm · Weihnachtsmützen", names: [["Christmas Hat", "halloween_christmas_hat", "/give @s carved_pumpkin[custom_name=\"Christmas Hat\"]"]] },
        { id: "bundle", item: "Bündel", itemEn: "Bundle · Spookify", names: [["Bag Bone", "spookify_bag_bone"], ["Bag Ghost", "spookify_bag_ghost"], ["Bag Halloween", "spookify_bag_halloween"]] },
        { id: "spruce_pressure_plate", item: "Fichtenholzdruckplatte", itemEn: "Spruce Pressure Plate · Decoween", names: [["Candelabra", "decoween_candelabra"], ["Crystal Ball", "decoween_crystal_ball"], ["Deer Skull", "decoween_deer_skull"], ["Fortune Teller's Table", "decoween_fortune_table"], ["Gothic Throne", "decoween_gothic_throne"], ["Haunted Fountain", "decoween_haunted_fountain"], ["Haunted Well", "decoween_haunted_well"], ["Jack-in-the-Box", "decoween_jack_in_the_box"], ["Pumpkin Cart", "decoween_pumpkin_cart"], ["Pumpkin Pile", "decoween_pumpkin_pile"], ["Scarecrow", "decoween_scarecrow"], ["Skittish Crow", "decoween_startled_crow"], ["Skull Candle", "decoween_skull_candle"], ["Witch Broom", "decoween_witch_broom"], ["Witch Cauldron", "decoween_witch_cauldron"], ["Zombie Hand", "decoween_zombie_hand"]] },
        { id: "spruce_pressure_plate", item: "Fichtenholzdruckplatte", itemEn: "Spruce Pressure Plate · Funny Pumpkin", names: [["Ancient Skeleton", "funny_pumpkin_ancient_skeleton"], ["Berry Muffin Block", "funny_pumpkin_berry_muffin_block"], ["Candy Pumpkin", "funny_pumpkin_candy_pumpkin_block"], ["Death Statue Deepslate", "funny_pumpkin_death_statue_deepslate"], ["Death Statue Nether", "funny_pumpkin_death_statue_nether"], ["Death Statue Stone", "funny_pumpkin_death_statue_stone"], ["Drop Pumpkin Candle", "funny_pumpkin_drop_pumpkin_candle"], ["Gargoyle Statue Deepslate", "funny_pumpkin_gargoyle_statue_deepslate"], ["Gargoyle Statue Nether", "funny_pumpkin_gargoyle_statue_nether"], ["Gargoyle Statue Stone", "funny_pumpkin_gargoyle_statue_stone"], ["Lay Corpse", "funny_pumpkin_lay_corpse"], ["Lay Mushroom Corpse", "funny_pumpkin_lay_mushroom_corpse"], ["Lay Skeleton", "funny_pumpkin_lay_skeleton"], ["Lay Torn Corpse", "funny_pumpkin_lay_torn_corpse"], ["Lollipop Pot", "funny_pumpkin_lollipop_pot"], ["Pumpkin Candle", "funny_pumpkin_pumpkin_candle"], ["Seat Corpse", "funny_pumpkin_seat_corpse"], ["Seat Mushroom Corpse", "funny_pumpkin_seat_mushroom_corpse"], ["Seat Skeleton", "funny_pumpkin_seat_skeleton"], ["Seat Torn Corpse", "funny_pumpkin_seat_torn_corpse"], ["Sewing Table", "funny_pumpkin_sewing_table"], ["Skeleton Grave", "funny_pumpkin_skeleton_grave"]] },
        { id: "spruce_pressure_plate", item: "Fichtenholzdruckplatte", itemEn: "Spruce Pressure Plate · Happy Hallows", names: [["Candelabra with Black Candles", "happyhallows_black_candelabra"], ["Candelabra with Blue Candles", "happyhallows_blue_candelabra"], ["Candelabra with Brown Candles", "happyhallows_brown_candelabra"], ["Candelabra with Candles", "happyhallows_candelabra_plain"], ["Candelabra with Cyan Candles", "happyhallows_cyan_candelabra"], ["Candelabra with Gray Candles", "happyhallows_gray_candelabra"], ["Candelabra with Green Candles", "happyhallows_green_candelabra"], ["Candelabra with Light Blue Candles", "happyhallows_light_blue_candelabra"], ["Candelabra with Light Gray Candles", "happyhallows_light_gray_candelabra"], ["Candelabra with Lime Candles", "happyhallows_lime_candelabra"], ["Candelabra with Magenta Candles", "happyhallows_magenta_candelabra"], ["Candelabra with Orange Candles", "happyhallows_orange_candelabra"], ["Candelabra with Pink Candles", "happyhallows_pink_candelabra"], ["Candelabra with Purple Candles", "happyhallows_purple_candelabra"], ["Candelabra with Red Candles", "happyhallows_red_candelabra"], ["Candelabra with White Candles", "happyhallows_white_candelabra"], ["Candelabra with Yellow Candles", "happyhallows_yellow_candelabra"], ["Gravestone-Simple", "happyhallows_gravestone_plain"], ["Skull With Black Candles", "happyhallows_black_skull_candle"], ["Skull With Blue Candles", "happyhallows_blue_skull_candle"], ["Skull With Brown Candles", "happyhallows_brown_skull_candle"], ["Skull With Candles", "happyhallows_skull_candle"], ["Skull With Cyan Candles", "happyhallows_cyan_skull_candle"], ["Skull With Gray Candles", "happyhallows_gray_skull_candle"], ["Skull With Green Candles", "happyhallows_green_skull_candle"], ["Skull With Light Blue Candles", "happyhallows_light_blue_skull_candle"], ["Skull With Light Gray Candles", "happyhallows_light_gray_skull_candle"], ["Skull With Lime Candles", "happyhallows_lime_skull_candle"], ["Skull With Magenta Candles", "happyhallows_magenta_skull_candle"], ["Skull With Orange Candles", "happyhallows_orange_skull_candle"], ["Skull With Pink Candles", "happyhallows_pink_skull_candle"], ["Skull With Purple Candles", "happyhallows_purple_skull_candle"], ["Skull With Red Candles", "happyhallows_red_skull_candle"], ["Skull With White Candles", "happyhallows_white_skull_candle"], ["Skull With Yellow Candles", "happyhallows_yellow_skull_candle"]] },
        { id: "spruce_pressure_plate", item: "Fichtenholzdruckplatte", itemEn: "Spruce Pressure Plate · Spookify", names: [["Brain Jar", "spookify_brain_jar"], ["Broom Stick", "spookify_broom_stick"], ["Coffin", "spookify_coffin"], ["Kotel", "spookify_kotel"]] },
        { id: "lantern", item: "Laterne", itemEn: "Lantern · Funny Pumpkin", names: [["Hanged Corpse", "funny_pumpkin_hanged_corpse"], ["Hanged Torn Corpse", "funny_pumpkin_hanged_torn_corpse"]] },
        { id: "bread", item: "Brot", itemEn: "Bread · Funny Pumpkin", names: [["Berry Muffin", "funny_pumpkin_berry_muffin"], ["Black Candy", "funny_pumpkin_black_candy"], ["Blue Candy", "funny_pumpkin_blue_candy"], ["Caramel Key", "funny_pumpkin_caramel_key"], ["Cyan Candy", "funny_pumpkin_cyan_candy"], ["Gray Candy", "funny_pumpkin_gray_candy"], ["Green Candy", "funny_pumpkin_green_candy"], ["Light Blue Candy", "funny_pumpkin_light_blue_candy"], ["Light Gray Candy", "funny_pumpkin_light_gray_candy"], ["Lime Candy", "funny_pumpkin_lime_candy"], ["Magenta Candy", "funny_pumpkin_magenta_candy"], ["Nether Monster Egg", "funny_pumpkin_nether_monster_egg"], ["Nether Monster Egg Ingredient", "funny_pumpkin_nether_monster_egg_ingredient"], ["Orange Candy", "funny_pumpkin_orange_candy"], ["Pink Candy", "funny_pumpkin_pink_candy"], ["Pumpkin Lollipop", "funny_pumpkin_pumpkin_lollipop"], ["Purple Candy", "funny_pumpkin_purple_candy"], ["Red Candy", "funny_pumpkin_red_candy"], ["White Candy", "funny_pumpkin_white_candy"], ["Yellow Candy", "funny_pumpkin_yellow_candy"]] },
        { id: "music_disc_13", item: "Schallplatte „13“", itemEn: "Music Disc 13 · Funny Pumpkin", names: [["Carnival Of Horrors", "funny_pumpkin_music_disc_3"], ["Creepy House", "funny_pumpkin_music_disc_2"], ["Ghostly Choir", "funny_pumpkin_music_disc_5"], ["Sweet Candy", "funny_pumpkin_music_disc_6"], ["This Is Halloween", "funny_pumpkin_music_disc_1"], ["Witch Dance", "funny_pumpkin_music_disc_4"]] }
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
