# Halloween-Pack (Teufels-Set) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Ein Server-Resource-Pack plus Datapack für Minecraft 26.3, das umbenannte Lederhelme, Elytren und Dreizacke zu Teufelshörnern, -flügeln und -dreizack macht, und ein Eintrag „Halloween-Pack“ auf minecraft-creations mit Anleitung, zwei Downloads und 3D-Ansicht unter „Mehr lesen“.

**Architecture:** Ein Node-Generator ohne Zusatzpakete (`halloween/build.mjs`) erzeugt aus einer Liste `SET` alle Texturen, Modelle, beide Zips, Web-Assets für die 3D-Ansicht und eine Datei mit Grösse/SHA-1. Die Seite liest den Eintrag aus `data/items.js` und die Pack-Infos aus `data/halloween-pack.js`; die 3D-Ansicht ist ein eigenes ES-Modul, das three.js erst beim Öffnen des Dialogs lädt.

**Tech Stack:** Node 24 (`node:test`, `node:zlib`, `node:crypto`), statisches HTML/CSS/JS, three.js 0.160.0 von unpkg, Minecraft Java 26.3 (Resource-Pack-Format 97.1, Datapack-Format 121.0 – aus `version.json` im 26.3-Client-Jar bestätigt).

**Spec:** `docs/superpowers/specs/2026-10-25-halloween-pack-design.md`

## Global Constraints

- Ziel ist reines Vanilla **26.3**; Resource Pack `min_format` 97, `max_format` 100; Datapack `min_format` 121, `max_format` 125 (26.4-Snapshots: RP 100.x, DP 124/125).
- Namen exakt: `Teufelshörner`, `Teufelshoerner` (Lederhelm), `Teufelsflügel`, `Teufelsfluegel` (Elytra), `Teufelsdreizack` (Dreizack). Gross-/Kleinschreibung zählt.
- Eigener Namespace `halloween`. Nicht umbenannte Items müssen exakt wie Vanilla aussehen (Fallback = Vanilla-JSON aus dem 26.3-Jar, 1:1).
- Keine Zusatzpakete, kein Python. Generator: `node halloween/build.mjs`, Tests: `node --test halloween/`.
- Alle Pfade auf der Seite relativ (`./…`). Texte Deutsch, IDs/Klassen Englisch, nur strukturierende Kommentare.
- Pack-Link für den Server: `https://n-brand.github.io/minecraft-creations/downloads/texturepacks/halloween-pack.zip`; Anleitung empfiehlt `require-resource-pack=true`.
- Kein Mojang-Skin und keine Mojang-Texturen ins Repo; nur die drei nötigen Vanilla-Item-JSONs als Fallback-Vorlage.
- Git: Autor `Nicolas Brand <227780975+n-brand@users.noreply.github.com>` (lokal gesetzt), keine Claude-Erwähnung in Commits, **nie pushen**.
- Am Handy (375 px) kein Seitwärts-Scrollen, keine Konsolenfehler.

## Review Focus

1. **Nicht umbenannte Items:** gefärbter Lederhelm, Lederhelm mit Trim, Dreizack beim Werfen-Ausholen, kaputte Elytra müssen wie Vanilla aussehen → Test `fallback equals vanilla` (Task 3).
2. **Item wird zurückbenannt** (Name gelöscht/anders) während es getragen wird → Datapack setzt Komponenten zurück → Test `datapack has reset rules` (Task 4) prüft, dass für jedes Item eine Rücksetz-Zeile mit `!minecraft:equippable` existiert.
3. **Umlaut-freie Schreibweise** → jede Regel in `items/*.json` und im Datapack enthält beide Namen → Test `every name variant is covered` (Task 3 und 4).
4. **Dialog öffnen/schliessen mehrmals, oder Wechsel zu einem anderen Eintrag** → 3D-Ansicht gibt Renderer frei (kein wachsender WebGL-Kontext-Zähler, keine Konsolenwarnung „Too many active WebGL contexts“) → Prüfschritt in Task 6.
5. **Offline/PWA:** Seite offline öffnen, Dialog des Halloween-Packs → Text und Anleitung erscheinen, 3D-Ansicht zeigt eine Meldung statt eines Fehlers, falls three.js nicht im Speicher ist → Prüfschritt in Task 6.

---

### Task 1: Generator-Grundlagen (PNG, ZIP, SHA-1)

**Files:**
- Create: `halloween/lib/png.mjs`, `halloween/lib/zip.mjs`
- Test: `halloween/test/lib.test.mjs`

**Interfaces:**
- Produces:
  - `pngBytes(pixels: number[][][]) -> Buffer` – `pixels[y][x] = [r,g,b,a]`, RGBA 8 bit, zlib-komprimiert (Muster wie `tools/make-icons.mjs` bzw. `png_bytes` in random).
  - `canvas(w, h, color = [0,0,0,0]) -> number[][][]`
  - `zipBytes(files: Record<string, string|Buffer>) -> Buffer` – Einträge sortiert, Methode Deflate, feste Zeit 2026-10-25 00:00 (reproduzierbare SHA-1), Ordner-Einträge werden nicht gebraucht.
  - `sha1(buf) -> string` (hex)

- [ ] **Step 1: Tests schreiben** – `pngBytes(canvas(2,2,[255,0,0,255]))` beginnt mit `\x89PNG`, IHDR-Breite/Höhe = 2; `zipBytes({"a.txt":"hi","b/c.json":"{}"})` zweimal → gleiche `sha1`; Zip enthält End-of-central-directory mit 2 Einträgen; `zipBytes` → per `zlib.inflateRawSync` lässt sich `a.txt` wieder zu `hi` entpacken (lokaler Header bei Offset 0 parsen).
- [ ] **Step 2:** `node --test halloween/` → FAIL (Module fehlen).
- [ ] **Step 3:** Implementieren (CRC32 per Tabelle selbst, `zlib.deflateRawSync`).
- [ ] **Step 4:** `node --test halloween/` → PASS. Zusätzlich manuell: Zip mit `unzip -t` in Git Bash → `No errors detected`.
- [ ] **Step 5: Commit** `Halloween-Pack: Generator-Grundlagen (PNG, ZIP)`

### Task 2: Teufels-Set – Modelle und Texturen

**Files:**
- Create: `halloween/set.mjs`, `halloween/models.mjs`
- Test: `halloween/test/models.test.mjs`

**Interfaces:**
- Consumes: `canvas`, `pngBytes` (Task 1)
- Produces:
  - `SET` (in `set.mjs`): Array von `{ key, title, item, itemDe, itemEn, names: string[], kind: "head"|"hand"|"wings", icon }` – genau drei Einträge:
    - `teufelshoerner`: item `leather_helmet`, itemDe „Lederkappe“, itemEn „Leather Cap“, names `["Teufelshörner","Teufelshoerner"]`, kind `head`
    - `teufelsfluegel`: item `elytra`, itemDe „Elytren“, itemEn „Elytra“, names `["Teufelsflügel","Teufelsfluegel"]`, kind `wings`
    - `teufelsdreizack`: item `trident`, itemDe „Dreizack“, itemEn „Trident“, names `["Teufelsdreizack"]`, kind `hand`
    Neue Halloween-Items = neuer Eintrag hier (Spec „Erweiterbarkeit“).
  - `buildAssets() -> { textures: Record<path, Buffer>, models: Record<key, object>, bbmodels: Record<key, object>, icons: Record<key, Buffer>, wings: Buffer, packIcon: Buffer, skin: Buffer }`
    - Texturen: `halloween:item/teufel` (32×32, Bereiche für Horn rot/dunkel/Spitze, Stiel schwarz, Zacken rot/glühend), `wings` = 64×32 im Elytra-Layout (Flügel-Box 10×20×2 ab Texturpunkt 22,0; Fledermausform mit Knochenstreben, dunkelrote Haut, unten gezackt, Lücken transparent), `icons` = 16×16 Inventar-Bilder für die Anleitung, `packIcon` 64×64, `skin` = eigener 64×64-Standard-Skin (breite Arme), nicht Steve kopiert.
    - Hörner: Elemente aus `HORN` in `C:\Source\random\blockbench\halloween\build.py` übernehmen (links bauen, rechts spiegeln), `display.head` = `{translation:[0,0,0], scale:[0.8,0.8,0.8]}`; zusätzlich `gui`, `ground`, `fixed`, `thirdperson_righthand`, `firstperson_righthand`.
    - Dreizack: Stiel 1×1×~26 senkrecht, Querstück, drei Spitzen mit Widerhaken; `display` für Hand/GUI angelehnt an `trident_in_hand.json` aus 26.3 (Werte im Plan-Kontext: thirdperson_righthand rot `[0,60,0]` trans `[11,17,-2]`; gui rot `[15,-25,-5]` scale 0.65), so angepasst, dass das Modell (Ursprung unten) in der Hand liegt.
    - Java-Grenzen: Koordinaten -16..32, Drehung eine Achse, 22.5°-Schritte.
- [ ] **Step 1: Tests** – jedes Modell hat `elements.length > 0`; alle `from`/`to` in [-16, 32]; jede `rotation.angle` ∈ {-45,-22.5,0,22.5,45}; jede Face-UV in [0,16]; `textures["0"] === "halloween:item/teufel"`; Flügel-PNG ist 64×32 und hat sowohl transparente als auch deckende Pixel im Bereich x 22..46, y 0..22; `SET` hat für jedes Item mindestens einen Namen.
- [ ] **Step 2:** FAIL. **Step 3:** Implementieren. **Step 4:** PASS.
- [ ] **Step 5: Commit** `Halloween-Pack: Teufelshoerner, -fluegel und -dreizack als Modelle`

### Task 3: Resource Pack zusammenbauen

**Files:**
- Create: `halloween/resourcepack.mjs`, `halloween/vanilla/leather_helmet.json`, `halloween/vanilla/elytra.json`, `halloween/vanilla/trident.json` (1:1 aus `%APPDATA%\.minecraft\versions\26.3\26.3.jar`, `assets/minecraft/items/…`)
- Test: `halloween/test/resourcepack.test.mjs`

**Interfaces:**
- Consumes: `SET`, `buildAssets` (Task 2), `zipBytes` (Task 1)
- Produces: `resourcePackFiles() -> Record<string, string|Buffer>` mit:
  - `pack.mcmeta`: `{"pack":{"description":"§6Halloween-Pack §7- Teufels-Set","min_format":97,"max_format":100}}`
  - `pack.png`
  - `assets/minecraft/items/<item>.json`: `{"model":{"type":"minecraft:select","property":"minecraft:component","component":"minecraft:custom_name","cases":[{"when":[...names],"model":{"type":"minecraft:model","model":"halloween:item/<key>"}}],"fallback": <vanilla .model>}}` – für Elytra **kein** eigenes Item-Modell nötig, aber Inventar-Icon: `halloween:item/teufelsfluegel` = `item/generated` mit Icon-Textur.
  - `assets/halloween/models/item/<key>.json`, `assets/halloween/textures/item/*.png`
  - `assets/halloween/equipment/teufelsfluegel.json`: `{"layers":{"wings":[{"texture":"halloween:teufelsfluegel","use_player_texture":false}]}}`
  - `assets/halloween/textures/entity/equipment/wings/teufelsfluegel.png`
- [ ] **Step 1: Tests** – `fallback equals vanilla`: für jedes Item `deepEqual(def.model.fallback, vanilla.model)`; `every name variant is covered`: `cases[0].when` enthält jeden Namen aus `SET`; jedes referenzierte `halloween:item/x` hat eine Modell-Datei, jede Modell-Textur hat eine PNG; `pack.mcmeta` hat `min_format` 97 und `max_format` 100; alle `.json` lassen sich parsen.
- [ ] **Step 2:** FAIL. **Step 3:** Implementieren. **Step 4:** PASS.
- [ ] **Step 5: Commit** `Halloween-Pack: Resource Pack fuer 26.3`

### Task 4: Datapack

**Files:**
- Create: `halloween/datapack.mjs`
- Test: `halloween/test/datapack.test.mjs`

**Interfaces:**
- Consumes: `SET` (Task 2), `zipBytes` (Task 1)
- Produces: `datapackFiles() -> Record<string, string>` mit:
  - `pack.mcmeta`: `{"pack":{"description":"Halloween-Pack: Teufels-Set","min_format":121,"max_format":125}}`
  - `data/minecraft/tags/function/tick.json` → `["halloween:tick"]`
  - `data/halloween/function/tick.mcfunction`: `execute as @a run function halloween:player`
  - `data/halloween/function/player.mcfunction`, je Item mit `kind` `head`/`wings`:
    - An: `execute if items entity @s armor.head minecraft:leather_helmet[minecraft:custom_name="Teufelshörner"] unless items entity @s armor.head *[minecraft:equippable=<AN>] run item modify entity @s armor.head halloween:teufelshoerner_an` (je Namensvariante eine Zeile)
    - Aus: `execute if items entity @s armor.head minecraft:leather_helmet[minecraft:equippable=<AN>] unless items … [custom_name=<Name1>] unless items … [custom_name=<Name2>] run item modify entity @s armor.head halloween:normal`
  - `data/halloween/item_modifier/teufelshoerner_an.json`: `set_components` mit `minecraft:equippable` = `{"slot":"head","equip_sound":"minecraft:item.armor.equip_leather"}` (kein `asset_id` → Kopf zeigt Item-Modell)
  - `data/halloween/item_modifier/teufelsfluegel_an.json`: `minecraft:equippable` = `{"slot":"chest","equip_sound":"minecraft:item.armor.equip_elytra","asset_id":"halloween:teufelsfluegel","damage_on_hurt":false}` (Slot `armor.chest`)
  - `data/halloween/item_modifier/normal.json`: `set_components` mit `{"!minecraft:equippable":{}}` (Patch entfernen → Vanilla-Komponente)
  - `<AN>` in den Befehlen ist exakt dasselbe Objekt wie im Item-Modifier, als SNBT geschrieben (aus demselben JS-Objekt erzeugt, nicht doppelt getippt).
  - Exakter Komponentenvergleich ist eine Annahme (Spec: im Spiel nicht prüfbar) – in Task 7 mit dem Vanilla-Server prüfen.
- [ ] **Step 1: Tests** – `datapack has reset rules`: für jedes Item mit kind head/wings gibt es eine Zeile mit `halloween:normal`; `every name variant is covered`: jeder Name aus `SET` kommt in `player.mcfunction` vor; Item-Modifier sind gültiges JSON mit `function: "minecraft:set_components"`; `pack.mcmeta` hat 121/125; der Dreizack (kind hand) erzeugt keine Datapack-Zeilen.
- [ ] **Step 2:** FAIL. **Step 3:** Implementieren. **Step 4:** PASS.
- [ ] **Step 5: Commit** `Halloween-Pack: Datapack fuer Hoerner und Fluegel`

### Task 5: Generator-Ausgabe und Seiten-Eintrag

**Files:**
- Create: `halloween/build.mjs`, Ausgaben: `downloads/texturepacks/halloween-pack.zip`, `downloads/texturepacks/halloween-datapack.zip`, `halloween/teufelshoerner.bbmodel`, `halloween/teufelsdreizack.bbmodel`, `images/halloween-pack.png` (Pack-Icon 10× vergrössert), `images/halloween-pack/` (Icons für Anleitung, Modelle `*.json`, Texturen, `wings.png`, `skin.png` für die 3D-Ansicht), `data/halloween-pack.js`
- Modify: `data/items.js` (Feldbeschreibung oben + Eintrag), `javascript/main.js` (Download-Bereich + Server-Anleitung), `css/styles.css`
- Test: `halloween/test/build.test.mjs`

**Interfaces:**
- Consumes: Tasks 1–4
- Produces:
  - `data/halloween-pack.js`: `window.PACK_INFO = { "halloween-pack": { size: "…KB", sha1: "<hex>", url: "<Pack-Link>" }, "halloween-datapack": { size: "…KB" } };` – nur vom Generator geschrieben. `index.html` lädt die Datei vor `items.js`.
  - Neue Felder in `items.js` (oben dokumentieren): `extraFiles: [{ file, label, info }]` (weitere Downloads; `info` = Schlüssel in `PACK_INFO`), `server: { steps: string[], packInfo: "halloween-pack" }` (Server-Anleitung; zeigt URL und SHA-1 aus `PACK_INFO` mit Kopieren-Klick, Hinweis „Nach jedem Update SHA-1 neu eintragen“), `viewer: { base: "images/halloween-pack/", parts: [...] }` (3D-Ansicht, Task 6).
  - Eintrag `id: "halloween-pack"`, category `texturepacks`, name „Halloween-Pack“, edition Java, version „26.3“, file = Resource-Pack-Zip (Button „Resource Pack“), `extraFiles` = Datapack („Datapack für den Server“), `image: "images/halloween-pack.png"`, `details`/`features` (inkl. „Im Spiel noch nicht getestet“ und dem Hinweis, dass geworfene Dreizacke normal aussehen), `guide` im Format von Mein Pack mit `iconPath: "images/halloween-pack/"`, 3 Gruppen aus `SET`, Schritte wie Mein Pack plus „Teufelshörner und -flügel anziehen – erst dann erscheinen sie am Spieler“.
  - Server-Schritte: Resource-Pack-Zip-Link in `server.properties` unter `resource-pack=`, SHA-1 unter `resource-pack-sha1=`, `require-resource-pack=true` (empfohlen, Grund in einem Satz), Datapack-Zip nach `world/datapacks/`, Server neu starten oder `/reload`, GitHub Pages muss eingeschaltet sein.
- [ ] **Step 1: Test** – `build.mjs` exportiert `build({ root })`; Test baut in ein Temp-Verzeichnis und prüft: beide Zips existieren, `PACK_INFO.sha1` = SHA-1 der Zip-Datei, zweimal bauen → identische SHA-1.
- [ ] **Step 2:** FAIL. **Step 3:** Implementieren (Generator + Seite). `node halloween/build.mjs` gibt Pfade, Grössen und SHA-1 aus.
- [ ] **Step 4:** `node --test halloween/` PASS; `unzip -t` beider Zips ohne Fehler; `node tools/build-sw.mjs`; im Browser (preview `minecraft-creations`, http://localhost:4184) `#halloween-pack` öffnen → Karte, beide Download-Buttons laden die Zips (Status 200), Anleitung mit 3 Items, Server-Anleitung zeigt URL und SHA-1, Klick kopiert; 375 px ohne Seitwärts-Scrollen; Mein Pack unverändert.
- [ ] **Step 5: Commit** `Halloween-Pack: Eintrag mit Anleitung und Downloads`

### Task 6: 3D-Ansicht unter „Mehr lesen“

**Files:**
- Create: `javascript/viewer3d.js` (ES-Modul)
- Modify: `javascript/main.js` (im Detail-Dialog bei `item.viewer` einen Bereich einfügen und `import('./viewer3d.js')` dynamisch laden; beim Schliessen `dispose()`), `css/styles.css`, `sw.js` (Cache-zuerst für `unpkg.com/three@0.160.0/…` wie Google Fonts; `VERSION` → `v2`)

**Interfaces:**
- Consumes: `viewer`-Feld und Dateien in `images/halloween-pack/` (Task 5)
- Produces: `export async function mountViewer(container: HTMLElement, viewer: {base, parts}) -> { dispose(): void }`
  - three 0.160.0 + `OrbitControls` per Import-URL von unpkg (wie random), Pixel-Texturen `NearestFilter`.
  - Java-Modell-Leser nach `buildJavaModel` aus `C:\Source\random\blockbench\cowboyhut\index.html` (Box pro Element, Face-UVs, Drehung um `origin`).
  - Spielerfigur nach `buildPlayer`/`skinPart` derselben Datei, mit `skin.png`.
  - Elytra-Geometrie wie Vanilla: je Flügel Box 10×20×2 mit Textur ab (22,0), Drehpunkt (±5, 0, 0) am Rücken, Drehung x 15°, z ∓15°, rechter Flügel gespiegelt; Textur `wings.png`.
  - Hörner per `display.head` (Skalierung 0.8) auf den Kopf, Dreizack in die rechte Hand.
  - Umschalter (Buttons, `aria-pressed`): „Alles am Spieler“ (Standard), „Hörner“, „Flügel“, „Dreizack“ – einzeln zentriert ohne Spieler.
  - Höhe ca. 360 px am PC, 280 px ≤680px; Breite 100 %; Ziehen dreht, kein Seiten-Scrollen-Kapern am Handy (`touch-action: none` nur auf dem Canvas).
  - Kann three.js nicht laden (offline): Text „3D-Ansicht braucht Internet“.
  - `dispose()` stoppt die Render-Schleife, `renderer.dispose()` und `forceContextLoss()`.
- [ ] **Step 1:** Implementieren.
- [ ] **Step 2: Prüfen im Browser** (localhost:4184/#halloween-pack): alle vier Ansichten zeigen das Modell, keine Konsolenfehler; Screenshot je Ansicht; Dialog 5× öffnen/schliessen → keine Warnung „Too many active WebGL contexts“; Mein-Pack-Dialog zeigt keine 3D-Ansicht; 375 px ohne Seitwärts-Scrollen; Hell- und Dunkelmodus.
- [ ] **Step 3: Offline prüfen:** Service Worker aktiv, Server stoppen, Seite neu laden → Dialog öffnet, Anleitung sichtbar, 3D-Ansicht zeigt Modell (aus Cache) oder die Meldung, kein unbehandelter Fehler.
- [ ] **Step 4:** `node tools/build-sw.mjs`, **Commit** `Halloween-Pack: 3D-Ansicht in der Detailansicht`

### Task 7 (nur mit Nicolas' OK): Datapack und Pack auf einem lokalen Vanilla-Server prüfen

Braucht den Download von `server.jar` 26.3 von Mojang (piston-data.mojang.com) – **vorher Nicolas fragen**. Java 25 liegt beim Minecraft-Launcher (`%APPDATA%\.minecraft\runtime\…`).

- [ ] Server in `%TEMP%`-Ordner (nicht im Repo) mit `level-type=flat`, Datapack in `world/datapacks/` starten; im Log: Datapack geladen, keine Fehler zu `halloween:` (Funktion, Item-Modifier, Tag).
- [ ] Über die Server-Konsole prüfen, dass Befehle aus `player.mcfunction` parsen (`/function halloween:tick` ohne Fehler). Was ohne Client nicht geht (Aussehen), bleibt als „im Spiel testen“ offen.
- [ ] Ergebnis in `CLAUDE.md` vermerken.

### Task 8: Doku

**Files:** Modify `CLAUDE.md` (Struktur: `halloween/`, neue Felder, `data/halloween-pack.js`, 3D-Ansicht, Tests; „Aktueller Stand“ inkl. „im Spiel nicht getestet“ und „GitHub Pages einschalten“), `README.md` (Abschnitt „Halloween-Pack neu bauen“: `node halloween/build.mjs`, `node --test halloween/`, danach `node tools/build-sw.mjs`).

- [ ] Ändern, **Commit** `Halloween-Pack: Doku`, Push-Befehl für Nicolas angeben: `git -C C:\Source\minecraft-creations push`
