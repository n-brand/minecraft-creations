// --- Modelle und Texturen des Teufels-Sets ---
// Einheiten wie in Blockbench: 16 = ein Block, Spielerkopf = 0..16, vorne = Norden (-z).
// Java-Grenzen: Koordinaten -16..32, Drehung nur um eine Achse in 22.5-Grad-Schritten.

import { randomUUID } from 'node:crypto';
import { canvas, pngBytes } from './lib/png.mjs';

// --- Farben und Zufall ---

const clamp = v => Math.max(0, Math.min(255, Math.round(v)));
const shade = (rgb, n) => [clamp(rgb[0] + n), clamp(rgb[1] + n), clamp(rgb[2] + n), 255];

// Fester Zufall, damit jeder Bau die gleichen Pixel ergibt
const random = seed => () => {
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
};
const noise = (rnd, spread) => Math.round((rnd() * 2 - 1) * spread);

// --- Gemeinsame Textur halloween:item/teufel (32x32, Bereiche à 8x8) ---

const TEX = 32;
const REGIONS = {
    horn: [8, 8, [186, 26, 30]],
    horn_dark: [16, 8, [120, 14, 18]],
    horn_tip: [24, 8, [36, 20, 20]],
    shaft: [0, 16, [34, 26, 30]],
    shaft_light: [8, 16, [70, 52, 56]],
    prong: [16, 16, [178, 22, 20]],
    prong_glow: [24, 16, [255, 120, 36]]
};

const devilTexture = () => {
    const rnd = random(7);
    const px = canvas(TEX, TEX);
    for (const [name, [x0, y0, color]] of Object.entries(REGIONS)) {
        for (let y = y0; y < y0 + 8; y++) {
            for (let x = x0; x < x0 + 8; x++) {
                // Glühende Spitzen: unten heiss, oben fast weiss
                const glow = name === 'prong_glow' ? (7 - (y - y0)) * 4 : 0;
                px[y][x] = shade(color, noise(rnd, 8) + glow);
            }
        }
    }
    return px;
};

const uv = region => {
    const [x, y] = REGIONS[region];
    const s = 16 / TEX;
    return [x * s, y * s, (x + 8) * s, (y + 8) * s];
};

// --- Elemente ---

const FACES = ['north', 'east', 'south', 'west', 'up', 'down'];

// [Name, von, bis, [Seiten, oben, unten], Drehung [Achse, Winkel, Drehpunkt] oder null]
const mirror = elements => elements.map(([name, a, b, mat, rot]) => [
    name.replace('links', 'rechts'),
    [16 - b[0], a[1], a[2]],
    [16 - a[0], b[1], b[2]],
    mat,
    rot ? [rot[0], -rot[1], [16 - rot[2][0], rot[2][1], rot[2][2]]] : null
]);

const HORN = ['horn', 'horn', 'horn_dark'];
const TIP = ['horn_tip', 'horn_tip', 'horn_tip'];
// Hörner wie im Halloween-Pack von random: links bauen, rechts spiegeln; Spitzen biegen nach aussen
const HORNS_LEFT = [
    ['Horn Basis links', [1, 15.5, 5.5], [4.5, 19, 9], HORN, null],
    ['Horn Mitte links', [1.25, 18.5, 5.75], [4.25, 22, 8.75], HORN, ['z', 22.5, [2.75, 18.5, 7.25]]],
    ['Horn Spitze links', [0.4, 21.5, 6.25], [2.4, 25, 8.25], TIP, ['z', 45, [1.4, 21.5, 7.25]]]
];

const SHAFT = ['shaft', 'shaft_light', 'shaft_light'];
const GRIP = ['shaft_light', 'shaft_light', 'shaft_light'];
const PRONG = ['prong', 'prong_glow', 'prong'];
const GLOW = ['prong_glow', 'prong_glow', 'prong_glow'];
// Dreizack senkrecht, Mitte bei x/z = 8; Griff liegt bei y 0..4
const TRIDENT_LEFT = [
    ['Zacke links', [3.5, 21.5, 7.5], [5, 26, 8.5], PRONG, null],
    ['Spitze links', [3.8, 26, 7.6], [4.6, 28.5, 8.4], GLOW, null],
    ['Widerhaken links', [5, 23, 7.6], [6, 24.5, 8.4], PRONG, null],
    ['Widerhaken Mitte links', [6.5, 25, 7.6], [7.25, 26.5, 8.4], PRONG, null]
];
const TRIDENT = [
    ['Stiel', [7.5, -14, 7.5], [8.5, 20, 8.5], SHAFT, null],
    ['Griff', [7.25, -2, 7.25], [8.75, 4, 8.75], GRIP, null],
    ['Knauf', [7.25, -15, 7.25], [8.75, -13, 8.75], PRONG, null],
    ['Querstück', [3.5, 20, 7.25], [12.5, 21.5, 8.75], SHAFT, null],
    ['Zacke Mitte', [7.25, 21.5, 7.5], [8.75, 28, 8.5], PRONG, null],
    ['Spitze Mitte', [7.6, 28, 7.6], [8.4, 31, 8.4], GLOW, null],
    ...TRIDENT_LEFT,
    ...mirror(TRIDENT_LEFT)
];

const MODELS = {
    teufelshoerner: {
        title: 'Teufelshörner',
        elements: [...HORNS_LEFT, ...mirror(HORNS_LEFT)],
        display: {
            // Kopf = 16 Einheiten; Minecraft zeigt 16 Einheiten auf dem Kopf etwas grösser als den Kopf
            head: { translation: [0, 0, 0], scale: [0.8, 0.8, 0.8] },
            gui: { rotation: [25, -135, 0], translation: [0, -6, 0], scale: [0.6, 0.6, 0.6] },
            ground: { translation: [0, -2, 0], scale: [0.4, 0.4, 0.4] },
            fixed: { translation: [0, -6, 0], scale: [0.7, 0.7, 0.7] },
            thirdperson_righthand: { translation: [0, -4, 1], scale: [0.45, 0.45, 0.45] },
            firstperson_righthand: { rotation: [0, -90, 0], translation: [0, -2, 0], scale: [0.4, 0.4, 0.4] }
        }
    },
    teufelsdreizack: {
        title: 'Teufelsdreizack',
        elements: TRIDENT,
        display: {
            // Griff (y 0..4) liegt in der Hand: Modell um 7 Einheiten anheben
            thirdperson_righthand: { rotation: [0, 90, 0], translation: [0, 6, 0.5], scale: [0.9, 0.9, 0.9] },
            firstperson_righthand: { rotation: [0, -90, 25], translation: [1.13, 5, 1.13], scale: [0.68, 0.68, 0.68] },
            gui: { rotation: [0, 0, -45], scale: [0.42, 0.42, 0.42] },
            ground: { translation: [0, 2, 0], scale: [0.35, 0.35, 0.35] },
            fixed: { rotation: [0, 0, -45], scale: [0.5, 0.5, 0.5] }
        }
    }
};

const facesFor = (mat, java) => {
    const [side, top, under] = mat;
    return Object.fromEntries(FACES.map(face => [face, {
        uv: uv(face === 'up' ? top : face === 'down' ? under : side),
        texture: java ? '#0' : 0
    }]));
};

const javaModel = model => ({
    credit: `${model.title} von Nicolas Brand`,
    texture_size: [TEX, TEX],
    textures: { 0: 'halloween:item/teufel', particle: 'halloween:item/teufel' },
    elements: model.elements.map(([name, from, to, mat, rot]) => ({
        name, from, to,
        ...(rot ? { rotation: { angle: rot[1], axis: rot[0], origin: rot[2] } } : {}),
        faces: facesFor(mat, true)
    })),
    display: model.display
});

const bbmodel = (model, png) => {
    const elements = model.elements.map(([name, from, to, mat, rot]) => {
        const rotation = [0, 0, 0];
        if (rot) rotation['xyz'.indexOf(rot[0])] = rot[1];
        return {
            name, box_uv: false, rescale: false, locked: false, render_order: 'default',
            allow_mirror_modeling: true, from, to, autouv: 0, color: 0,
            origin: rot ? rot[2] : from.map((v, i) => (v + to[i]) / 2), rotation,
            faces: facesFor(mat, false), type: 'cube', uuid: randomUUID()
        };
    });
    return {
        meta: { format_version: '4.10', model_format: 'java_block', box_uv: false },
        name: model.title, parent: '', ambientocclusion: true, front_gui_light: false,
        visible_box: [1, 1, 0], resolution: { width: 16, height: 16 },
        elements, outliner: elements.map(e => e.uuid),
        textures: [{
            path: '', name: 'teufel.png', folder: 'item', namespace: 'halloween', id: '0',
            width: TEX, height: TEX, uv_width: 16, uv_height: 16, particle: false,
            render_mode: 'default', render_sides: 'auto', frame_time: 1, visible: true,
            internal: true, saved: false, uuid: randomUUID(),
            source: 'data:image/png;base64,' + png.toString('base64')
        }],
        display: model.display
    };
};

// --- Flügel (Elytra-Layout 64x32) ---
// Vanilla-Elytra: je Flügel eine Box 10x20x2 ab Texturpunkt (22,0). Rückseite (Süden) liegt bei
// x 36..46, Vorderseite (Norden) bei x 24..34, jeweils y 2..22. Aussenkante des Flügels:
// hinten links (x 36), vorne rechts (x 33).

const WING_SKIN = [150, 22, 30];
const WING_BONE = [26, 8, 10];
const CLAW = [222, 206, 186];

// Ein Flügel als 10x20-Bild, Spalte 0 = aussen, Spalte 9 = am Körper.
// Drei Fingerknochen laufen vom Handgelenk (oben aussen) zu den Spitzen; dazwischen hängt die Haut in Bögen.
const WING_TIPS = [[0, 17], [4, 19], [9, 13]];

const wingShape = () => {
    const shape = Array.from({ length: 20 }, () => Array(10).fill(null));
    for (let x = 0; x < 10; x++) {
        const i = x < WING_TIPS[1][0] ? 0 : 1;
        const [[ax, ay], [bx, by]] = [WING_TIPS[i], WING_TIPS[i + 1]];
        const t = (x - ax) / (bx - ax);
        const bottom = ay + (by - ay) * t - 3.2 * Math.sin(Math.PI * t);
        for (let y = 0; y <= Math.round(bottom); y++) shape[y][x] = 'skin';
    }
    // Knochen: Linie vom Handgelenk (0,0) zu jeder Spitze, dazu der Armknochen oben
    for (const [tx, ty] of WING_TIPS) {
        const steps = Math.max(tx, ty);
        for (let s = 0; s <= steps; s++) shape[Math.round(ty * s / steps)][Math.round(tx * s / steps)] = 'bone';
    }
    for (let x = 0; x < 10; x++) shape[0][x] = 'bone';
    shape[0][0] = 'claw';
    return shape;
};

const wingsTexture = () => {
    const rnd = random(11);
    const px = canvas(64, 32);
    const shape = wingShape();
    const colors = { bone: WING_BONE, claw: CLAW };
    // flip = false: Spalte 0 links (Rückseite), flip = true: aussen rechts (Vorderseite)
    const paint = (x0, flip) => {
        for (let y = 0; y < 20; y++) {
            for (let i = 0; i < 10; i++) {
                const kind = shape[y][flip ? 9 - i : i];
                if (!kind) continue;
                const color = kind === 'skin' ? shade(WING_SKIN, noise(rnd, 10) - y * 1.5) : shade(colors[kind], noise(rnd, 6));
                px[y + 2][x0 + i] = color;
            }
        }
    };
    paint(36, false);
    paint(24, true);
    // Oberkante (Armknochen) von oben und unten sichtbar; schmale Seiten bleiben durchsichtig
    for (let y = 0; y < 2; y++) {
        for (let x = 24; x < 44; x++) px[y][x] = shade(WING_BONE, noise(rnd, 6));
    }
    return px;
};

// --- Inventar-Icons (16x16) ---

const ICONS = {
    teufelshoerner: [
        '................',
        '.x............x.',
        '.xr..........rx.',
        '..rr........rr..',
        '..rR........Rr..',
        '..rR........Rr..',
        '..rrR......Rrr..',
        '...rrR....Rrr...',
        '....rrR..Rrr....',
        '.....rr..rr.....',
        '................',
        '................',
        '................',
        '................',
        '................',
        '................'
    ],
    teufelsfluegel: [
        '................',
        '.cbbbbb..bbbbbc.',
        '.bsssssb.bsssssb',
        'bsssbssbbssbsssb',
        'bssbsssb.bsssbsb',
        'bsbssssb.bssssbs',
        'bsbsssb...bsssbs',
        'bbssssb...bssssb',
        'b.bssb.....bssb.',
        '..bsb.......bsb.',
        '...b.........b..',
        '................',
        '................',
        '................',
        '................',
        '................'
    ],
    teufelsdreizack: [
        '...........g.g.g',
        '...........r.r.r',
        '..........rr.rrr',
        '..........rrrrr.',
        '...........rrr..',
        '..........rkr...',
        '.........kk.....',
        '........kk......',
        '.......kk.......',
        '......kl........',
        '.....lk.........',
        '....kk..........',
        '...kk...........',
        '..kk............',
        '.rk.............',
        '.r..............'
    ]
};
const ICON_COLORS = {
    x: [36, 20, 20], r: [186, 26, 30], R: [120, 14, 18],
    b: WING_BONE, s: WING_SKIN, c: CLAW,
    k: [34, 26, 30], l: [70, 52, 56], g: [255, 170, 60]
};

const icon = rows => {
    const rnd = random(3);
    const px = canvas(16, 16);
    rows.forEach((row, y) => [...row].forEach((ch, x) => {
        if (ICON_COLORS[ch]) px[y][x] = shade(ICON_COLORS[ch], noise(rnd, 6));
    }));
    return px;
};

// --- Pack-Bild (64x64): Hörner und Dreizack auf dunkelviolettem Grund ---

const packIcon = () => {
    const px = canvas(64, 64, [36, 14, 30, 255]);
    const stamp = (rows, x0, y0, scale) => rows.forEach((row, y) => [...row].forEach((ch, x) => {
        if (!ICON_COLORS[ch]) return;
        for (let dy = 0; dy < scale; dy++) {
            for (let dx = 0; dx < scale; dx++) px[y0 + y * scale + dy][x0 + x * scale + dx] = [...ICON_COLORS[ch], 255];
        }
    }));
    stamp(ICONS.teufelshoerner, 0, 2, 4);
    stamp(ICONS.teufelsdreizack, 32, 32, 2);
    return px;
};

// --- Eigener Standard-Skin (64x64, breite Arme) für die 3D-Ansicht ---

const SKIN = [214, 164, 128];
const HAIR = [58, 36, 24];
const SHIRT = [40, 40, 52];
const PANTS = [52, 64, 110];
const SHOES = [30, 30, 34];

// Box-UV wie Minecraft: Breite w, Höhe h, Tiefe d ab (u, v)
const paintBox = (px, rnd, u, v, w, h, d, colorAt) => {
    for (let y = v; y < v + d + h; y++) {
        for (let x = u; x < u + 2 * (d + w); x++) {
            if (y < v + d && (x < u + d || x >= u + d + 2 * w)) continue;
            px[y][x] = shade(colorAt(x - u, y - v - d), noise(rnd, 6));
        }
    }
};

const skinTexture = () => {
    const rnd = random(5);
    const px = canvas(64, 64);
    // Kopf: Haare oben und am Hinterkopf, Gesicht vorne (Vorderseite x 8..16)
    paintBox(px, rnd, 0, 0, 8, 8, 8, (x, y) => (y < 2 || y < 0 || x >= 24 || (x < 8 && y < 5) || (x >= 16 && x < 24 && y < 5)) ? HAIR : SKIN);
    for (const [x, y, c] of [[9, 12, [255, 255, 255]], [10, 12, [60, 90, 160]], [13, 12, [60, 90, 160]], [14, 12, [255, 255, 255]], [11, 14, [150, 90, 70]], [12, 14, [150, 90, 70]]]) {
        px[y][x] = [...c, 255];
    }
    paintBox(px, rnd, 16, 16, 8, 12, 4, () => SHIRT);
    paintBox(px, rnd, 40, 16, 4, 12, 4, (x, y) => y < 4 ? SHIRT : SKIN);
    paintBox(px, rnd, 32, 48, 4, 12, 4, (x, y) => y < 4 ? SHIRT : SKIN);
    paintBox(px, rnd, 0, 16, 4, 12, 4, (x, y) => y >= 10 ? SHOES : PANTS);
    paintBox(px, rnd, 16, 48, 4, 12, 4, (x, y) => y >= 10 ? SHOES : PANTS);
    return px;
};

// --- Alles zusammen ---

export const buildAssets = () => {
    const devilPng = pngBytes(devilTexture());
    const models = Object.fromEntries(Object.entries(MODELS).map(([key, model]) => [key, javaModel(model)]));
    // Elytra im Inventar: flaches Icon
    models.teufelsfluegel = { parent: 'minecraft:item/generated', textures: { layer0: 'halloween:item/teufelsfluegel' } };
    const icons = Object.fromEntries(Object.entries(ICONS).map(([key, rows]) => [key, pngBytes(icon(rows))]));
    return {
        textures: {
            'item/teufel.png': devilPng,
            'item/teufelsfluegel.png': icons.teufelsfluegel
        },
        models,
        bbmodels: Object.fromEntries(Object.entries(MODELS).map(([key, model]) => [key, bbmodel(model, devilPng)])),
        icons,
        wings: pngBytes(wingsTexture()),
        packIcon: pngBytes(packIcon()),
        skin: pngBytes(skinTexture())
    };
};
