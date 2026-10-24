# Minecraft Creations

**Live:** [https://n-brand.github.io/minecraft-creations/](https://n-brand.github.io/minecraft-creations/)

Meine Mods, Texturepacks und Skins für Minecraft zum Herunterladen.

## Neuen Download hinzufügen

1. Datei nach `downloads/<kategorie>/` legen (`mods`, `texturepacks` oder `skins`).
2. Eintrag in `data/items.js` ergänzen (Felder sind oben in der Datei beschrieben).
3. Optional ein Vorschaubild unter `images/` ablegen und im Feld `image` angeben.

## Lokal testen

Statische Seite ohne Build-Schritt, z.B. mit Python:

```bash
python -m http.server 4184
```

Dann http://localhost:4184 öffnen.

---

Erstellt von [Nicolas Brand](https://n-brand.github.io/portfolio/)
