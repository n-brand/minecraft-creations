// --- 3D-Ansicht für die Detailansicht ---
// Lädt three.js (Import-Map in index.html), die Java-Modelle und Texturen aus viewer.base
// und zeigt sie drehbar: an einer Spielerfigur oder einzeln.
// Einheiten: 1 = ein Modell-Pixel, Kopf = 0..16 hoch, Mitte bei x/z = 0, Blickrichtung -z.

import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

const pixelTexture = src => {
    const tex = src instanceof HTMLCanvasElement ? new THREE.CanvasTexture(src) : new THREE.TextureLoader().load(src);
    tex.magFilter = THREE.NearestFilter;
    tex.minFilter = THREE.NearestFilter;
    tex.colorSpace = THREE.SRGBColorSpace;
    return tex;
};

const material = (tex, extra = {}) =>
    new THREE.MeshLambertMaterial({ map: tex, transparent: true, alphaTest: 0.1, ...extra });

// --- Java-Modell: Quader mit UV pro Seite (0..16) und optionaler Drehung um einen Punkt ---
const FACE_ORDER = ['east', 'west', 'up', 'down', 'south', 'north'];

const buildJavaModel = (json, tex) => {
    const group = new THREE.Group();
    const mat = material(tex);
    for (const el of json.elements) {
        const size = [0, 1, 2].map(i => el.to[i] - el.from[i]);
        const geo = new THREE.BoxGeometry(...size);
        const uvAttr = geo.attributes.uv;
        FACE_ORDER.forEach((name, f) => {
            const [u1, v1, u2, v2] = el.faces[name].uv.map(v => v / 16);
            [[u1, 1 - v1], [u2, 1 - v1], [u1, 1 - v2], [u2, 1 - v2]].forEach(([u, v], i) => uvAttr.setXY(f * 4 + i, u, v));
        });
        const center = [0, 1, 2].map(i => (el.from[i] + el.to[i]) / 2);
        const origin = el.rotation ? el.rotation.origin : center;
        const pivot = new THREE.Group();
        pivot.position.set(origin[0] - 8, origin[1], origin[2] - 8);
        if (el.rotation) pivot.rotation[el.rotation.axis] = THREE.MathUtils.degToRad(el.rotation.angle);
        const mesh = new THREE.Mesh(geo, mat);
        mesh.position.set(center[0] - origin[0], center[1] - origin[1], center[2] - origin[2]);
        pivot.add(mesh);
        group.add(pivot);
    }
    return group;
};

// --- Spielerfigur aus einem 64x64-Skin (1 Skin-Pixel = 2 Einheiten, Kopf unten bei y = 0) ---
const boxUV = (geo, u, v, w, h, d) => {
    // Bereiche im Skin: rechts, links, oben, unten, hinten, vorne (Reihenfolge wie BoxGeometry)
    const rects = [
        [u, v + d, d, h], [u + d + w, v + d, d, h],
        [u + d, v, w, d], [u + d + w, v, w, d],
        [u + 2 * d + w, v + d, w, h], [u + d, v + d, w, h]
    ];
    const uvAttr = geo.attributes.uv;
    rects.forEach(([x, y, rw, rh], f) => {
        const [u1, v1, u2, v2] = [x / 64, 1 - y / 64, (x + rw) / 64, 1 - (y + rh) / 64];
        [[u1, v1], [u2, v1], [u1, v2], [u2, v2]].forEach(([a, b], i) => uvAttr.setXY(f * 4 + i, a, b));
    });
};

const skinPart = (tex, [w, h, d], uv, pos) => {
    const geo = new THREE.BoxGeometry(w * 2, h * 2, d * 2);
    boxUV(geo, ...uv, w, h, d);
    const mesh = new THREE.Mesh(geo, material(tex));
    mesh.position.set(...pos.map(p => p * 2));
    return mesh;
};

const buildPlayer = tex => {
    // Positionen in Skin-Pixeln (Mitte des Teils), rechte Seite +x
    const player = new THREE.Group();
    player.add(skinPart(tex, [8, 8, 8], [0, 0], [0, 4, 0]));
    player.add(skinPart(tex, [8, 12, 4], [16, 16], [0, -6, 0]));
    player.add(skinPart(tex, [4, 12, 4], [40, 16], [6, -6, 0]));
    player.add(skinPart(tex, [4, 12, 4], [32, 48], [-6, -6, 0]));
    player.add(skinPart(tex, [4, 12, 4], [0, 16], [2, -18, 0]));
    player.add(skinPart(tex, [4, 12, 4], [16, 48], [-2, -18, 0]));
    return player;
};

// --- Minecraft-Quader mit Box-UV (wie ModelPart.Cube), für die Elytra ---
const mcBox = ([x0, y0, z0], [w, h, d], [u, v], [texW, texH], mirror) => {
    let [xa, xb] = [x0, x0 + w];
    if (mirror) [xa, xb] = [xb, xa];
    const [y1, z1] = [y0 + h, z0 + d];
    const p = [
        [xa, y0, z0], [xb, y0, z0], [xb, y1, z0], [xa, y1, z0],
        [xa, y0, z1], [xb, y0, z1], [xb, y1, z1], [xa, y1, z1]
    ];
    const U = [u, u + d, u + d + w, u + d + w + w, u + d + w + d, u + d + w + d + w];
    const V = [v, v + d, v + d + h];
    const quads = [
        [[5, 4, 0, 1], U[1], V[0], U[2], V[1]],
        [[2, 3, 7, 6], U[2], V[1], U[3], V[0]],
        [[0, 4, 7, 3], U[0], V[1], U[1], V[2]],
        [[1, 0, 3, 2], U[1], V[1], U[2], V[2]],
        [[5, 1, 2, 6], U[2], V[1], U[4], V[2]],
        [[4, 5, 6, 7], U[4], V[1], U[5], V[2]]
    ];
    const positions = [];
    const uvs = [];
    for (const [idx, u0, v0, u1, v1] of quads) {
        const corner = [[u1, v0], [u0, v0], [u0, v1], [u1, v1]];
        for (const i of [0, 1, 2, 0, 2, 3]) {
            positions.push(...p[idx[i]]);
            uvs.push(corner[i][0] / texW, 1 - corner[i][1] / texH);
        }
    }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
    geo.setAttribute('uv', new THREE.Float32BufferAttribute(uvs, 2));
    geo.computeVertexNormals();
    return geo;
};

// Elytra wie Vanilla: in Entity-Einheiten gebaut (y nach unten), dann gespiegelt und verdoppelt
const buildWings = tex => {
    const mat = material(tex, { side: THREE.DoubleSide });
    const wings = new THREE.Group();
    wings.scale.set(-2, -2, 2);
    for (const [side, mirror] of [[1, false], [-1, true]]) {
        const pivot = new THREE.Group();
        pivot.position.set(5 * side, 0, 2);
        pivot.rotation.set(0.2618, 0, -0.2618 * side, 'ZYX');
        pivot.add(new THREE.Mesh(mcBox([mirror ? 0 : -10, 0, 0], [10, 20, 2], [22, 0], [64, 32], mirror), mat));
        wings.add(pivot);
    }
    return wings;
};

// Hörner: Kopf 0..16, display.head skaliert um die Kopfmitte
const placeOnHead = (model, display) => {
    const s = display?.scale?.[0] ?? 1;
    const holder = new THREE.Group();
    holder.position.y = 8;
    model.position.y = -8;
    holder.scale.setScalar(s);
    holder.add(model);
    return holder;
};

export const mountViewer = async (stage, viewer, section) => {
    const base = viewer.base;
    const [horns, trident] = await Promise.all(
        ['teufelshoerner', 'teufelsdreizack'].map(name => fetch(`${base}${name}.json`).then(r => {
            if (!r.ok) throw new Error(`${name}.json fehlt`);
            return r.json();
        }))
    );

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;

    const scene = new THREE.Scene();
    scene.add(new THREE.AmbientLight(0xffffff, 1.6));
    const sun = new THREE.DirectionalLight(0xffffff, 1.4);
    sun.position.set(2, 4, -3);
    scene.add(sun);

    const camera = new THREE.PerspectiveCamera(35, 1, 0.1, 200);
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.autoRotate = true;
    controls.autoRotateSpeed = 1.5;
    controls.enablePan = false;

    // 1 Modell-Pixel = 1/16 in der Szene
    const world = new THREE.Group();
    world.scale.setScalar(1 / 16);
    scene.add(world);

    const devil = pixelTexture(`${base}teufel.png`);
    const parts = {
        player: buildPlayer(pixelTexture(`${base}skin.png`)),
        teufelshoerner: placeOnHead(buildJavaModel(horns, devil), horns.display.head),
        teufelsfluegel: buildWings(pixelTexture(`${base}wings.png`)),
        teufelsdreizack: buildJavaModel(trident, devil)
    };
    // Dreizack senkrecht in der rechten Hand: Griff (y 0..4) an der Hand
    const hand = new THREE.Group();
    hand.position.set(12, -22, -5);
    hand.add(parts.teufelsdreizack);
    parts.teufelsdreizack.position.y = -2;
    world.add(parts.player, parts.teufelshoerner, parts.teufelsfluegel, hand);

    // Einzelansicht: Teil in die Mitte, Spieler aus
    const LAYOUT = {
        all: { show: ['player', 'teufelshoerner', 'teufelsfluegel', 'teufelsdreizack'] },
        teufelshoerner: { show: ['teufelshoerner'] },
        teufelsfluegel: { show: ['teufelsfluegel'] },
        teufelsdreizack: { show: ['teufelsdreizack'] }
    };

    // Kamera auf die sichtbaren Teile ausrichten (Box3.setFromObject zählt auch ausgeblendete mit)
    const fit = () => {
        world.updateMatrixWorld(true);
        const box = new THREE.Box3();
        world.children.filter(node => node.visible).forEach(node => box.expandByObject(node));
        const center = box.getCenter(new THREE.Vector3());
        const radius = box.getSize(new THREE.Vector3()).length() / 2;
        const distance = radius / Math.sin(THREE.MathUtils.degToRad(camera.fov / 2)) * Math.max(1, 1 / camera.aspect) * 0.9;
        controls.target.copy(center);
        camera.position.copy(center).add(new THREE.Vector3(0.55, 0.35, -0.75).normalize().multiplyScalar(distance));
        controls.minDistance = distance * 0.4;
        controls.maxDistance = distance * 3;
        controls.update();
    };

    const bar = document.createElement('div');
    bar.className = 'viewer3d-parts';
    const show = id => {
        const visible = new Set(LAYOUT[id].show);
        for (const [key, part] of Object.entries(parts)) {
            const node = key === 'teufelsdreizack' ? hand : part;
            node.visible = visible.has(key);
        }
        bar.querySelectorAll('button').forEach(b => b.setAttribute('aria-pressed', String(b.dataset.part === id)));
        fit();
    };
    for (const part of viewer.parts) {
        const button = document.createElement('button');
        button.type = 'button';
        button.dataset.part = part.id;
        button.textContent = part.label;
        button.addEventListener('click', () => show(part.id));
        bar.appendChild(button);
    }
    stage.replaceChildren(renderer.domElement);
    section.appendChild(bar);

    const resize = () => {
        const { clientWidth: w, clientHeight: h } = stage;
        if (!w || !h) return;
        renderer.setSize(w, h, false);
        camera.aspect = w / h;
        camera.updateProjectionMatrix();
    };
    const observer = new ResizeObserver(resize);
    observer.observe(stage);
    resize();
    show('all');

    const clock = new THREE.Clock();
    renderer.setAnimationLoop(() => {
        controls.update(Math.min(clock.getDelta(), 0.05));
        renderer.render(scene, camera);
    });

    return {
        dispose() {
            renderer.setAnimationLoop(null);
            observer.disconnect();
            controls.dispose();
            scene.traverse(node => {
                node.geometry?.dispose();
                node.material?.map?.dispose();
                node.material?.dispose();
            });
            renderer.dispose();
            renderer.forceContextLoss();
            renderer.domElement.remove();
            bar.remove();
        }
    };
};
