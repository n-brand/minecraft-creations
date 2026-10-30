# minecraft-creations

Private Download-Seite von Nicolas Brand für eigene Minecraft-Inhalte: Mods, Texturepacks und Skins.

Es gelten zusätzlich die globalen Regeln aus `C:\Source\CLAUDE.md` (Git-Identität, keine Claude-Spuren, Footer-Credit, README-Links, PowerShell-Befehle in den Chat, Standard-Design).

## Projekt

- Repo: https://github.com/n-brand/minecraft-creations
- Live (GitHub Pages): https://n-brand.github.io/minecraft-creations/
- Lokaler Pfad: `C:\Source\minecraft-creations`, Branch `main`
- Lokal testen: Eintrag `minecraft-creations` in `C:\Source\.claude\launch.json` → http://localhost:4184

## Struktur

- `index.html` – einzige Seite: Sidebar (Kategorien) + Downloads-Raster + Installationshilfe
- `css/styles.css` – alle Styles; Dark ist Standard (`:root`), Light über `:root[data-theme="light"]`
- `javascript/main.js` – Service-Worker-Registrierung, Hell/Dunkel-Umschalter, Karten aus den Daten erzeugen, Filter (Kategorie per Hash `#mods` usw., Edition, Suche), Pixel-Art-Ersatzbilder (`ART`), Detail-Dialog, Umbenennen-Anleitung (`createGuide`), Hinweis-Toast
- `data/items.js` – **alle Downloads** als `window.ITEMS` (Felder oben in der Datei beschrieben). Neue Einträge nur hier, kein HTML anfassen.
- `downloads/<kategorie>/` – die Dateien (`.jar`, `.zip`, `.mcpack`, `.png`); werden **nie** offline gespeichert
- `images/` – Vorschaubilder (`image` im Eintrag), `images/icons/` App-Icons, `images/<eintrag>/` Item-Icons für Anleitungen (z.B. `images/mein-pack/` = Essens-Texturen aus dem Pack)
- **PWA:** `manifest.webmanifest`, `sw.js` (Service Worker, Muster wie im Portfolio: eigene Dateien Netz zuerst mit 4 s, sonst Speicher; Google Fonts aus dem Speicher; `downloads/` wird durchgereicht). Offline-Klick auf Download zeigt „Downloads gehen nur mit Internet“.
- `tools/build-sw.mjs` – schreibt die Offline-Liste in `sw.js` (zwischen `PRECACHE-START`/`-END`): alle Dateien in `css/`, `javascript/`, `data/`, `images/` plus Startseite und Manifest. **Nach jedem neuen Eintrag oder Bild ausführen:** `node tools/build-sw.mjs`
- `images/grass-block.png` – Grasblock-Textur von Nicolas (16×16 Pixel, 10-fach vergrössert auf 160 px); verwendet für Sidebar-Kachel, Texturepack-Ersatzbild und App-Icons (2026-10-24, Wunsch von Nicolas). Sonst bleibt der Portfolio-Stil.
- **Halloween-Pack** (`halloween/`): Generator ohne Zusatzpakete, `node halloween/build.mjs` (danach `node tools/build-sw.mjs`). Tests: `node --test "halloween/test/*.test.mjs"`. Schreibt `downloads/texturepacks/halloween-pack.zip` (Resource Pack, für alle Spieler) und `halloween-datapack.zip` (Datapack, nur Server), `images/halloween-pack/` (Anleitungs-Icons 16×16, Modelle/Texturen/Skin für die 3D-Ansicht), `images/halloween-pack.png`, `halloween/*.bbmodel` (Blockbench-Projekte, UUIDs ändern sich bei jedem Bau) und `data/halloween-pack.js` (`window.PACK_INFO`: Grösse, SHA-1, Pack-Link – nie von Hand ändern).
  - `set.mjs` = Liste aller Halloween-Items (Item-ID, Namen, `kind` head/wings/hand). Neues Item: Eintrag dort, Modell/Icon in `models.mjs`, bei head/wings Ausrüstung in `datapack.mjs` (`EQUIP`, `VANILLA_EQUIP`).
  - Resource Pack: `items/<item>.json` wählt per `custom_name` das Modell, Fallback = Vanilla-JSON aus `halloween/vanilla/` (1:1 aus dem 26.3-Client). Flügel = Equipment-Asset `halloween:teufelsfluegel` (Elytra-Layout 64×32).
  - Datapack (26.3-Syntax: Item-Modifier mit `"type"`, nicht `"function"`): tick prüft Kopf/Brust jedes Spielers. Teufelshörner → `equippable` ohne `asset_id` (Kopf zeigt Item-Modell), Teufelsflügel → `asset_id halloween:teufelsfluegel`. Zurücksetzen mit den Vanilla-Werten, **nicht** mit `"!minecraft:equippable"` (das entfernt die Komponente, Item wäre nicht mehr tragbar).
  - Ziel: Vanilla 26.3 (Resource Pack 97–100, Datapack 121–125).
- `javascript/viewer3d.js` – 3D-Ansicht (three.js 0.160.0 über die Import-Map in `index.html`, von unpkg; der Service Worker speichert diese Dateien). Wird beim Öffnen eines Eintrags mit `viewer` geladen und beim Schliessen freigegeben.
- `tools/make-icons.mjs` – erzeugt die App-Icons (gelbe gedrehte Kachel mit Grasblock auf Navy) ohne Zusatzpakete: `node tools/make-icons.mjs`. Die 16×16 Pixel des Grasblocks stehen als `GRASS`/`GRASS_COLORS` im Skript; bei neuer Textur dort ersetzen.

## Konventionen

- Design: Portfolio-Stil aus der globalen CLAUDE.md (Navy/Gelb, Nunito, Karten mit Schattenkante, Badge oben mittig, Sidebar am PC, Tab-Leiste unten am Handy ≤900px). Badge-Farben: Mod gelb, Texturepack grün, Skin rosa.
- Statische Seite ohne Build-Schritt (nur `tools/build-sw.mjs` für die Offline-Liste). Alle Pfade relativ (`./…`), da die Seite unter `/minecraft-creations/` läuft.
- **Teilbare Links:** `#<id>` öffnet die Detailansicht eines Eintrags direkt (z.B. `…/minecraft-creations/#mein-pack`), „Mehr lesen“ und der Titel sind echte Links darauf. Im Dialog „Link teilen“: am Handy das Teilen-Menü, sonst Link kopieren. Beim Schliessen springt die Adresse zurück auf die Kategorie. Darum darf eine `id` nie `all`, `mods`, `texturepacks`, `skins` oder `install` heissen.
- Einträge mit `example: true` sind Platzhalter und zeigen „Bald verfügbar“ statt Download. Sobald echte Dateien da sind, Beispiele entfernen.
- Handy (≤680px): zwei Karten pro Zeile, nur Bild, Badge, Titel und Download-Button.
- Pixel-Art: Pixel überlappen leicht (1.06), kein `crispEdges`, damit beim Drehen keine Linien entstehen.
- Dateien über 100 MB passen nicht ins Repo → GitHub Releases verwenden und dorthin verlinken.
- Texte auf Deutsch, Klassennamen und IDs auf Englisch. Nur strukturierende Kommentare (`/* --- Navigation --- */`).
- Keine externen Tracker oder Analytics.

## Aktueller Stand – IMMER AKTUELL HALTEN

Stand: 2026-10-25

Erledigt:
- **Halloween-Pack** (Branch `halloween-pack`, Design `docs/superpowers/specs/2026-10-25-halloween-pack-design.md`, Plan `docs/superpowers/plans/`): Teufelshörner (Lederkappe), Teufelsflügel (Elytren), Teufelsdreizack per Umbenennen; Eintrag mit Anleitung, zwei Downloads, Server-Anleitung (Link + SHA-1 zum Kopieren, `require-resource-pack=true` empfohlen) und 3D-Ansicht unter „Mehr lesen“. Lokal geprüft: Desktop und 375px, 20× öffnen/schliessen ohne WebGL-Warnung, offline. Datapack auf echtem Vanilla-Server 26.3 getestet (mit Rüstungsständern): lädt fehlerfrei, setzt und setzt zurück.
- Grundseite im Portfolio-Stil mit Kategorien, Edition-Filter, Suche, Installationshilfe, Hell/Dunkel-Umschalter und Footer-Credit. Lokal geprüft (Desktop und 375px, keine Konsolenfehler, kein Seitwärts-Scrollen).
- Sechs Beispiel-Einträge (2 Mods, 2 Texturepacks, 2 Skins) mit `example: true`.
- Erster echter Eintrag „Mein Pack“ (Texturepack, Java, pack_format 55 → ab 1.21.5): `downloads/texturepacks/mein-pack.zip`, Bild = `pack.png` aus dem Zip (`images/mein-pack.png`). Texte aus `UMBENENNEN.md`, `BEFEHLE.md` und `CREDITS.txt` im Zip.
- Detailansicht als `<dialog>` („Mehr lesen →“ oder Klick auf den Titel) für Einträge mit `details`, `features`, `credits` oder `guide`; zeigt auch Dateigrösse (`size`).
- Umbenennen-Anleitung für Mein Pack (Feld `guide`): 5 Schritte, Suche, 22 Grund-Items (deutscher + englischer Name) mit 48 Namen inkl. Textur-Icon. Klick auf Namen kopiert ihn, „/give“ kopiert den Befehl. Namen 1:1 aus den `assets/minecraft/items/*.json` im Pack geprüft. Deutsche Itemnamen aus dem Gedächtnis – bei Gelegenheit im Spiel gegenprüfen.
- **Server Pack 2026** (Branch `server-pack-2026`, Worktree `C:\Source\minecraft-creations-server-pack`, lokal: Eintrag `minecraft-creations-server-pack` → http://localhost:4185): Eintrag mit `serverOnly: true` (kein Download, „Nur auf dem Server“ – Entscheidung Nicolas wegen Lizenzen der Mods). Anleitung mit 199 Namen in 15 Gruppen (Grund-Item · Mod), Icons in `images/server-pack-2026/` (flach = Mod-Textur, 3D = isometrisch gerendert), eigener /give-Befehl pro Name bei anziehbaren Kostümen (`equippable`). Design: `docs/superpowers/specs/2026-10-25-server-pack-2026-design.md`. Das Pack-Zip wird direkt nach `C:\Users\nicol\AppData\Roaming\.minecraft\resourcepacks\Server Pack 2026.zip` gebaut (Wunsch von Nicolas), nie ins Repo. Icons auf Wunsch von Nicolas mit veröffentlicht (2026-10-25).
- **Generator `server-pack/`** (Node, keine Pakete): `node server-pack/build.mjs` baut aus `auswahl.txt` + Mod-Jars (`quellen.json`) das Resource Pack (→ `.minecraft\resourcepacks`), das Datapack (→ `C:\Source\Minecraft\Server Pack 2026 Datapack.zip`), `server-pack/out/BEFEHLE.md`, die Icons und den Eintrag in `data/items.js`; bricht ab, wenn der Lade-Check (`check.mjs`) Probleme findet. Danach `node tools/build-sw.mjs`. Tests: `node --test "server-pack/test/*.test.mjs"`. Datapack (Namespace `server_pack_2026`): Kostüme bekommen beim Anziehen `equippable` (1×/s, nur Rüstungs-Slots), umbenannte Eichenholzdruckplatten werden beim Platzieren zum 3D-Modell (`item_display` + `interaction`), Linksklick baut ab. Ziel 26.3 (Datapack `min_format 107`).
- PWA (installierbar, offline lesbar, Downloads nur online). Lokal geprüft: Service Worker aktiv, 61 Dateien gespeichert, Seite inkl. Bilder lädt bei gestopptem Server.

Offen:
- **Server Pack 2026:** Im Spiel von Nicolas getestet, läuft (2026-10-27). Automatischer Servertest (Vanilla 26.3, lokal): alle Deko erzeugen/abbauen, alle Kostüm-Teile, alle Discs, Platzieren per Hinschauen. Neue Datapack-Versionen erst nach `/reload` aktiv. Roter Dreizack („Red Trident“, `trident.mjs`, gehört zum Teufel-Set): in der Hand 3D (Elemente 16 px höher, Item-Definition schiebt per `transformation` zurück – Modell-Grenzen −16..32 prüft `check.mjs`); geworfen fährt ein rotes `item_display` als Passagier mit (Datapack `trident/*`, steckend wie der Client auf 360/256° abgerundet). Im Spiel geprüft: kein Blau mehr sichtbar (2026-10-27). Musik-Discs auf Wunsch entfernt (2026-10-30). `namen.json` = eigene Namen statt Mod-Namen (z.B. Nether Monster Egg → Chocolate Egg). Red Trident wieder entfernt; dieselbe Technik nutzen jetzt die Dreizacke aus fremden Packs. Waffen (`weapons.mjs`, Quellen in `quellen.json` → `weapons`, Zips in Downloads): 4 Dreizacke (OptiFine-`.jem` → Vanilla-Würfel per `readJem`, schräge Teile werden weggelassen), 13 Mine-Cells-Waffen auf dem Netheritschwert, Fishy Bow/Crossbow/Mace/Rocket (Vanilla-Definition mit getauschten Modellen). Essen aus Mein Pack (`meinpack.mjs`, ohne Münzen, Happy Meal, Pille, Eggchan). Seite: Filter Kostüme/Deko/Essen/Waffen, am PC Raster, Liste „Was drin ist“ auf Wunsch entfernt. Extra im Datapack: Diamant oder Netheritbarren + Eichenholzknopf als Items auf den Boden → 64 Stück (je Knopf ein Stack). Offen: 3D-Hüte ohne 8×8-Kopfbox (z.B. Cultist-Kapuze), Grössen-Liste für Einzelfälle (Broom Stick, Coffin), Download-Link fürs Server-Resource-Pack (Entscheidung Nicolas).
- **Halloween-Pack im Spiel testen** (Client): Sitzen die Hörner auf dem Kopf (Annahme: Kopf-Item ohne `asset_id` wird als Item-Modell gezeichnet, `display.head` Skalierung 0.8)? Lage von Hörnern/Dreizack in der Hand und im Inventar (Display-Werte geschätzt)? Flügel-Textur richtig herum? Geworfener Dreizack bleibt Vanilla.
- Halloween-Pack: weitere Halloween-Sachen (z.B. eigene Deko wie Grabstein/Sarg). Spookify-Mod (AndroFox, All Rights Reserved) nicht übernehmen.
- **Mein Pack enthält fremde Packs** (Golden Tridents – nela1, LowOnFire – haikis, No Pumpkin Blur, McDonald Food V3 – ItzAX0LOTL). Vor dem Veröffentlichen klären, ob deren Lizenzen das Weiterverteilen erlauben; Credits stehen in der Detailansicht.
- Weitere echte Mods, Texturepacks und Skins von Nicolas hinzufügen, Beispiele entfernen.
- GitHub Pages in den Repo-Einstellungen aktivieren (Branch `main`, Ordner `/`).
- Eigene Vorschaubilder pro Eintrag (z.B. Skin-Kopf aus der echten PNG) statt Kategorie-Icon.
- Eintrag im Portfolio (`C:\Source\portfolio`, Generator `tools/build-pages.js`), falls gewünscht.
