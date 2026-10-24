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
- `javascript/main.js` – Hell/Dunkel-Umschalter, Karten aus den Daten erzeugen, Filter (Kategorie per Hash `#mods` usw., Edition, Suche), Pixel-Art-Ersatzbilder (`ART`)
- `data/items.js` – **alle Downloads** als `window.ITEMS` (Felder oben in der Datei beschrieben). Neue Einträge nur hier, kein HTML anfassen.
- `downloads/<kategorie>/` – die Dateien (`.jar`, `.zip`, `.mcpack`, `.png`)
- `images/` – Favicon und optionale Vorschaubilder (`image` im Eintrag)

## Konventionen

- Design: Portfolio-Stil aus der globalen CLAUDE.md (Navy/Gelb, Nunito, Karten mit Schattenkante, Badge oben mittig, Sidebar am PC, Tab-Leiste unten am Handy ≤900px). Badge-Farben: Mod gelb, Texturepack grün, Skin rosa.
- Statische Seite ohne Build-Schritt. Alle Pfade relativ (`./…`), da die Seite unter `/minecraft-creations/` läuft.
- Einträge mit `example: true` sind Platzhalter und zeigen „Bald verfügbar“ statt Download. Sobald echte Dateien da sind, Beispiele entfernen.
- Handy (≤680px): zwei Karten pro Zeile, nur Bild, Badge, Titel und Download-Button.
- Pixel-Art: Pixel überlappen leicht (1.06), kein `crispEdges`, damit beim Drehen keine Linien entstehen.
- Dateien über 100 MB passen nicht ins Repo → GitHub Releases verwenden und dorthin verlinken.
- Texte auf Deutsch, Klassennamen und IDs auf Englisch. Nur strukturierende Kommentare (`/* --- Navigation --- */`).
- Keine externen Tracker oder Analytics.

## Aktueller Stand – IMMER AKTUELL HALTEN

Stand: 2026-10-24

Erledigt:
- Grundseite im Portfolio-Stil mit Kategorien, Edition-Filter, Suche, Installationshilfe, Hell/Dunkel-Umschalter und Footer-Credit. Lokal geprüft (Desktop und 375px, keine Konsolenfehler, kein Seitwärts-Scrollen).
- Sechs Beispiel-Einträge (2 Mods, 2 Texturepacks, 2 Skins) mit `example: true`.
- Erster echter Eintrag „Mein Pack“ (Texturepack, Java, pack_format 55 → ab 1.21.5): `downloads/texturepacks/mein-pack.zip`, Bild = `pack.png` aus dem Zip (`images/mein-pack.png`). Texte aus `UMBENENNEN.md`, `BEFEHLE.md` und `CREDITS.txt` im Zip.
- Detailansicht als `<dialog>` („Mehr lesen →“ oder Klick auf den Titel) für Einträge mit `details`, `features` oder `credits`; zeigt auch Dateigrösse (`size`).

Offen:
- **Mein Pack enthält fremde Packs** (Golden Tridents – nela1, LowOnFire – haikis, No Pumpkin Blur, McDonald Food V3 – ItzAX0LOTL). Vor dem Veröffentlichen klären, ob deren Lizenzen das Weiterverteilen erlauben; Credits stehen in der Detailansicht.
- Weitere echte Mods, Texturepacks und Skins von Nicolas hinzufügen, Beispiele entfernen.
- GitHub Pages in den Repo-Einstellungen aktivieren (Branch `main`, Ordner `/`).
- Eigene Vorschaubilder pro Eintrag (z.B. Skin-Kopf aus der echten PNG) statt Kategorie-Icon.
- Eintrag im Portfolio (`C:\Source\portfolio`, Generator `tools/build-pages.js`), falls gewünscht.
