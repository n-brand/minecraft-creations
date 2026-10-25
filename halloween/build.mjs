// --- Halloween-Pack bauen ---
// Aufruf: node halloween/build.mjs (keine Zusatzpakete)
// Schreibt beide Zips nach downloads/texturepacks/, die Dateien für Anleitung und 3D-Ansicht nach
// images/halloween-pack/, die Blockbench-Projekte nach halloween/ und Grösse/SHA-1 nach data/halloween-pack.js.
// Danach: node tools/build-sw.mjs

import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { SET } from './set.mjs';
import { buildAssets } from './models.mjs';
import { resourcePackFiles } from './resourcepack.mjs';
import { datapackFiles } from './datapack.mjs';
import { zipBytes, sha1 } from './lib/zip.mjs';
import { scalePng } from './lib/png.mjs';

const HERE = dirname(fileURLToPath(import.meta.url));
const PACK_URL = 'https://n-brand.github.io/minecraft-creations/downloads/texturepacks/halloween-pack.zip';

const kb = buf => `${Math.max(1, Math.round(buf.length / 1024))} KB`;

const write = (path, data) => {
    mkdirSync(dirname(path), { recursive: true });
    writeFileSync(path, data);
};

export const build = ({ root = join(HERE, '..'), quiet = false } = {}) => {
    const assets = buildAssets();
    const pack = zipBytes(resourcePackFiles(assets));
    const datapack = zipBytes(datapackFiles());

    write(join(root, 'downloads/texturepacks/halloween-pack.zip'), pack);
    write(join(root, 'downloads/texturepacks/halloween-datapack.zip'), datapack);

    const images = join(root, 'images/halloween-pack');
    // Icons 16x16 wie bei Mein Pack; die Anleitung vergrössert sie pixelgenau
    for (const entry of SET) write(join(images, `${entry.key}.png`), assets.icons[entry.key]);
    for (const [key, model] of Object.entries(assets.models)) {
        if (model.elements) write(join(images, `${key}.json`), JSON.stringify(model));
    }
    write(join(images, 'teufel.png'), assets.textures['item/teufel.png']);
    write(join(images, 'wings.png'), assets.wings);
    write(join(images, 'skin.png'), assets.skin);
    write(join(root, 'images/halloween-pack.png'), scalePng(assets.packIcon, 4));

    for (const [key, project] of Object.entries(assets.bbmodels)) {
        write(join(root, 'halloween', `${key}.bbmodel`), JSON.stringify(project, null, 2));
    }

    const info = {
        'halloween-pack': { size: kb(pack), sha1: sha1(pack), url: PACK_URL },
        'halloween-datapack': { size: kb(datapack) }
    };
    write(join(root, 'data/halloween-pack.js'),
        '// Wird von halloween/build.mjs geschrieben – nicht von Hand ändern.\n' +
        `window.PACK_INFO = ${JSON.stringify(info, null, 4)};\n`);

    if (!quiet) {
        console.log(`Resource Pack: ${info['halloween-pack'].size}, SHA-1 ${info['halloween-pack'].sha1}`);
        console.log(`Datapack: ${info['halloween-datapack'].size}`);
    }
    return info;
};

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) build();
