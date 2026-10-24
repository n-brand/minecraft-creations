// --- Offline-Liste für den Service Worker schreiben ---
// Nimmt alle Dateien der Seite (HTML, Styles, Skripte, Daten, Bilder) in sw.js auf, aber nicht downloads/.
// Nach jedem neuen Eintrag oder Bild ausführen: node tools/build-sw.mjs

import { readFileSync, writeFileSync, readdirSync } from 'node:fs';
import { dirname, join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const FOLDERS = ['css', 'javascript', 'data', 'images'];

const walk = dir => readdirSync(dir, { withFileTypes: true }).flatMap(entry => {
    const full = join(dir, entry.name);
    return entry.isDirectory() ? walk(full) : [full];
});

const files = [
    './',
    './index.html',
    './manifest.webmanifest',
    ...FOLDERS.flatMap(folder => walk(join(ROOT, folder)))
        .map(file => './' + relative(ROOT, file).split('\\').join('/'))
        .sort()
];

const swPath = join(ROOT, 'sw.js');
const sw = readFileSync(swPath, 'utf8');
const list = 'const PRECACHE = [\n' + files.map(file => `    '${file}',`).join('\n') + '\n];';
writeFileSync(swPath, sw.replace(/(\/\/ PRECACHE-START[^\n]*\n)[\s\S]*?(\n\/\/ PRECACHE-END)/, `$1${list}$2`));
console.log(`${files.length} Dateien in sw.js eingetragen`);
