# Halloween-Pack (Teufels-Set) – Design

Stand: 2026-10-25

## Worum es geht

Nicolas betreibt einen Minecraft-Server (Java, neueste Version = 26.3). Dort soll ein
Halloween-Pack laufen, das der Server allen Spielern als Server-Resource-Pack mitgibt.
Spieler benennen normale Items im Amboss um und bekommen dadurch Teufels-Ausrüstung,
die **alle Spieler** sehen (nicht nur der Träger). Vorbild ist "Mein Pack" auf der
Seite minecraft-creations (Umbenennen + Anleitung), Vorbild für die Technik sind
Server wie die von BastiGHG und das "Custom Elytra DataPack" (Resource Pack +
Datapack, kein Client-Mod).

Das Pack heisst **"Halloween-Pack"** und ist ein Sammel-Pack: Jetzt kommt das
Teufels-Set hinein, später weitere Halloween-Sachen. Der Aufbau muss also neue
Items einfach ergänzen lassen.

## Ziele

1. **Teufelshörner:** Lederhelm umbenennen zu `Teufelshörner` → im Inventar und in
   der Hand ein 3D-Hörner-Modell; **aufgesetzt** sieht man die Hörner auf dem Kopf
   (keine Lederhelm-Optik). Der Helm schützt weiterhin wie ein Lederhelm.
2. **Teufelsflügel:** Elytra umbenennen zu `Teufelsflügel` → angezogen sieht man
   Teufelsflügel statt der normalen Elytra. Fliegen funktioniert normal.
3. **Teufelsdreizack:** Dreizack umbenennen zu `Teufelsdreizack` → in Hand und
   Inventar ein 3D-Teufelsdreizack.
4. **Webseite:** Neuer Eintrag "Halloween-Pack" (Kategorie Texturepacks) auf
   minecraft-creations mit Detailansicht, Umbenennen-Anleitung, Downloads für
   Resource Pack und Datapack, Anleitung zum Einrichten auf dem Server und einer
   **3D-Ansicht** (drehbar, wie die Blockbench-Seiten in `C:\Source\random`).

## Nicht-Ziele

- Keine Client-Mods (OptiFine, CIT Resewn), keine Server-Plugins (Paper/Spigot).
- Keine Bedrock-Version.
- Der geworfene Dreizack muss nicht anders aussehen (siehe Technik).
- Kein Umbau von "Mein Pack" und kein Zusammenlegen mit dem Halloween-Pack in
  `C:\Source\random` (das bleibt dort als eigenes Experiment).

## Anti-Ziele (wäre ein Fehlschlag, auch wenn es "technisch geht")

- Hörner nur im Inventar, auf dem Kopf aber Lederhelm.
- Nur der Träger sieht die Sachen, andere Spieler nicht.
- Normale (nicht umbenannte) Lederhelme, Elytren oder Dreizacke sehen anders aus.
- Minecraft zeigt beim Laden eine Warnung "für eine andere Version gemacht".

## Technik (entschieden)

Zwei Teile, beide im Download:

### A) Resource Pack `halloween-pack.zip` (für alle Spieler, vom Server verteilt)

- `pack.mcmeta`: Ziel 26.3 = Resource-Pack-Format 97.1 (Quelle: minecraft.wiki,
  nicht im Spiel geprüft). Formatspanne so, dass 26.3 sicher und 26.4 (Snapshots:
  100.x) möglichst ohne Warnung lädt; Schema wie bei Mein Pack
  (`pack_format`, `supported_formats`, `min_format`, `max_format`).
- Item-Definitionen `assets/minecraft/items/leather_helmet.json`, `elytra.json`,
  `trident.json`: `minecraft:select` auf `minecraft:component` /
  `minecraft:custom_name` (wie in Mein Pack), Fallback = Vanilla-Verhalten des
  jeweiligen Items. **Achtung:** Die Vanilla-Definitionen von Lederhelm (Färbung
  per `dye`-Tint) und Dreizack (eigener Spezialmodell-Aufbau für Hand vs. Inventar)
  müssen im Fallback exakt nachgebaut werden, sonst sehen normale Items falsch aus.
  Vorlage aus dem 26.3-Client-Jar nehmen, nicht aus dem Gedächtnis.
- Eigene Modelle/Texturen unter Namespace `halloween:` (z.B.
  `halloween:item/teufelshoerner`, `halloween:item/teufelsdreizack`).
- Hörner-Modell: `display.head` so eingestellt, dass die Hörner auf dem Kopf sitzen
  (Vorlage: Teufelshörner in `C:\Source\random\blockbench\halloween\build.py`).
- Dreizack-Modell: `display` für Hand (first/third person) und GUI.
- Flügel: Equipment-Asset `assets/halloween/equipment/teufelsfluegel.json` mit
  Layer `wings` → Textur `assets/halloween/textures/entity/equipment/wings/teufelsfluegel.png`
  im Elytra-Texturlayout (64×32). Form der Flügel = Vanilla-Elytra, Fledermausform
  entsteht durch Transparenz in der Textur.
- `pack.png` als Pack-Icon.

### B) Datapack `halloween-datapack.zip` (nur auf dem Server, in `world/datapacks/`)

- `pack.mcmeta` für Datapack-Format 121.0 (26.3), Spanne analog.
- Tick-Funktion (`#minecraft:tick`) prüft jeden Spieler:
  - Kopf-Slot = `leather_helmet` mit `custom_name` "Teufelshörner" und noch mit
    Lederhelm-Optik → Komponente `equippable` setzen: `slot: head`, **ohne**
    `asset_id`. Dann zeichnet Minecraft keine Rüstungsschicht, sondern das
    Item-Modell auf dem Kopf (= Hörner aus dem Resource Pack).
  - Brust-Slot = `elytra` mit Name "Teufelsflügel" → `equippable` mit
    `asset_id: "halloween:teufelsfluegel"` (Slot chest, Elytra-Sound), Gleiten
    bleibt erhalten (`glider`).
  - Wird ein solches Item wieder umbenannt (Name passt nicht mehr), stellt die
    Funktion die normalen Komponenten wieder her, sobald es getragen wird.
- Umsetzung per Item-Modifier (`set_components`) und Prädikaten auf die
  Ausrüstung. Text-Komponenten ab 1.21.5 sind SNBT, nicht JSON – Namensvergleich
  entsprechend schreiben.
- Ob die Komponenten nur beim Tragen oder auch im Inventar gesetzt werden, ist
  Sache des Builders; Hauptsache, das Ergebnis aus den Zielen stimmt.

### Namen

- Genau `Teufelshörner`, `Teufelsflügel`, `Teufelsdreizack`. Zusätzlich die
  Schreibweisen ohne Umlaut (`Teufelshoerner`, `Teufelsfluegel`) gelten auch, weil
  manche Tastaturen/Spieler so tippen. Gross-/Kleinschreibung zählt (wie Mein Pack).

### Erweiterbarkeit

- Alle Sachen stehen in **einer** Liste im Generator (Item-ID, Namen, Modell,
  Textur, ob Datapack-Regel nötig). Neues Halloween-Item = Eintrag ergänzen,
  Generator laufen lassen.

## Aussehen (Claudes Entwurf, von Nicolas nicht im Detail abgesegnet)

- Farben: dunkles Teufelsrot mit schwarzen Schatten.
- Hörner: zwei gebogene Hörner vorne seitlich auf dem Kopf, rot mit dunkleren
  Spitzen; basiert auf den Teufelshörnern aus dem random-Halloween-Pack.
- Flügel: Fledermausflügel mit Knochenstreben, dunkelrote Haut, unten gezackt.
- Dreizack: schwarzer Stiel, drei rote Spitzen mit Widerhaken.
- Pixel-Stil wie Vanilla (16 px pro Block).

## Wo gebaut wird

Repo `C:\Source\minecraft-creations` (Regeln dort in `CLAUDE.md`).

- Quellordner `halloween/` (Generator + erzeugte Blockbench-Projekte `.bbmodel`
  zum Weiterbearbeiten). **Python ist auf Nicolas' PC nicht installiert**, darum
  Generator in Node ohne Zusatzpakete (`node halloween/build.mjs`), wie die
  bestehenden `tools/*.mjs`. Er schreibt Texturen (PNG), Modelle (JSON), beide Zips
  und das Vorschaubild.
- Downloads: `downloads/texturepacks/halloween-pack.zip` und
  `downloads/texturepacks/halloween-datapack.zip`.
- Eintrag in `data/items.js` (`id: "halloween-pack"`), mit `guide` wie Mein Pack
  (3 Items, deutscher + englischer Itemname, Icon), plus Text zur Einrichtung auf
  dem Server (Resource Pack über `server.properties` → `resource-pack=` mit
  Download-URL und `resource-pack-sha1=`, `require-resource-pack` optional;
  Datapack in `world/datapacks/`, dann `/reload`).
- Der Eintrag braucht **zwei Download-Dateien**; `items.js`/`main.js` kennen bisher
  nur `file`. Feld erweitern (z.B. `extraFiles` mit Beschriftung) – Entscheidung
  des Builders, Konventionen in `CLAUDE.md` nachziehen.
- **3D-Ansicht** in der Detailansicht: three.js (fest versioniert, wie in random
  `three@0.160.0`), lädt die Java-Modell-JSONs und Texturen aus dem Pack-Ordner,
  Umschalter Hörner / Flügel / Dreizack / Alles am Spieler, drehbar (OrbitControls).
  Spieler-Figur mit einem Standard-Skin (Steve-ähnlich, selbst gezeichnet – keinen
  Mojang-Skin ins Repo kopieren). Elytra als Vanilla-Elytra-Geometrie mit der
  Flügeltextur. Vorlage für Modell-Lesen: `C:\Source\random\blockbench\cowboyhut\index.html`
  und `blockbench/viewer/index.html`.
- Am Handy (≤680px) muss die 3D-Ansicht ohne Seitwärts-Scrollen funktionieren.
- PWA: neue Bilder/Skripte in die Offline-Liste (`node tools/build-sw.mjs`);
  three.js-Dateien ebenfalls offline verfügbar machen. Downloads bleiben online-only.
- `CLAUDE.md` "Aktueller Stand" und README nachziehen. Commit, nicht pushen.

## Prüfen

- Lokal: http://localhost:4184 (Eintrag `minecraft-creations` in
  `C:\Source\.claude\launch.json`): Karte, Detailansicht, Anleitung, beide
  Downloads, 3D-Ansicht am PC und bei 375px, keine Konsolenfehler.
- JSON-Dateien im Pack syntaktisch gültig, Zip-Struktur korrekt (pack.mcmeta im
  Wurzelverzeichnis).
- **Im Spiel nicht prüfbar** für Claude. Auf der Seite und in `CLAUDE.md` als
  "im Spiel noch nicht getestet" vermerken; Nicolas testet auf dem Server.

## Entscheidungen nach der Prüfung

- **Server:** reines Vanilla 26.3, alle Spieler auf 26.3 (Nicolas). Kein
  ViaVersion o.Ä. zu berücksichtigen.
- **Pack-Link:** GitHub Pages (Nicolas):
  `https://n-brand.github.io/minecraft-creations/downloads/texturepacks/halloween-pack.zip`.
  Pages muss Nicolas im Repo einschalten (steht schon unter "Offen"). Der
  Generator gibt nach jedem Bau die SHA-1 des Zips aus; die Seite zeigt Link und
  SHA-1 für `server.properties`, mit Hinweis: nach jedem Update SHA-1 neu
  eintragen. SHA-1 wird vom Generator in die Seitendaten geschrieben, nicht von
  Hand.
- **`require-resource-pack=true`** wird in der Anleitung empfohlen (Claudes
  Entscheidung): Wer das Pack ablehnt, sähe die Hörner anderer Spieler als
  normalen Lederhelm bzw. Item.
- **Vorlagen aus dem Client:** Das 26.3-Client-Jar liegt unter
  `%APPDATA%\.minecraft\versions\26.3\`. Vanilla-Item-Definitionen
  (`leather_helmet.json`, `elytra.json`, `trident.json`), Elytra-Texturlayout und
  Formatnummern dort nachlesen (nur lesen, nichts davon ins Repo kopieren ausser
  den nötigen Fallback-JSONs).
- Mein Pack definiert keine `items/`-Dateien für Lederhelm, Elytra oder Dreizack
  → kein Konflikt zwischen beiden Packs.

## Offen für den Builder

- Genaue Pixel/Modelle im Rahmen von "Aussehen".
- Datapack-Details (Funktionsnamen, Prädikate vs. `execute if items`).
- Darstellung der zwei Downloads und der Server-Anleitung auf der Seite.
