// --- Service Worker: Seite offline verfügbar ---
// Eigene Dateien kommen zuerst aus dem Netz (immer aktuell), ohne Netz oder nach 4 s aus dem Speicher.
// Schriften von Google Fonts und three.js (unpkg, fest versioniert) kommen aus dem Speicher. Downloads (downloads/) werden nie gespeichert.
// VERSION erhöhen, wenn sich die Logik hier ändert.

const VERSION = 'v2';
const CACHE = `minecraft-creations-${VERSION}`;

// PRECACHE-START (wird von tools/build-sw.mjs geschrieben)
const PRECACHE = [
    './',
    './index.html',
    './manifest.webmanifest',
    './css/styles.css',
    './data/halloween-pack.js',
    './data/items.js',
    './images/grass-block.png',
    './images/halloween-pack.png',
    './images/halloween-pack/skin.png',
    './images/halloween-pack/teufel.png',
    './images/halloween-pack/teufelsdreizack.json',
    './images/halloween-pack/teufelsdreizack.png',
    './images/halloween-pack/teufelsfluegel.png',
    './images/halloween-pack/teufelshoerner.json',
    './images/halloween-pack/teufelshoerner.png',
    './images/halloween-pack/wings.png',
    './images/icons/apple-touch-icon.png',
    './images/icons/icon-192.png',
    './images/icons/icon-32.png',
    './images/icons/icon-512.png',
    './images/icons/icon-maskable-512.png',
    './images/icons/icon.svg',
    './images/mein-pack.png',
    './images/mein-pack/apple_ice_cream.png',
    './images/mein-pack/banana.png',
    './images/mein-pack/big_mac.png',
    './images/mein-pack/black_berries.png',
    './images/mein-pack/blueberries.png',
    './images/mein-pack/brownie.png',
    './images/mein-pack/cake_ice_cream.png',
    './images/mein-pack/candycane.png',
    './images/mein-pack/cereal.png',
    './images/mein-pack/cheese.png',
    './images/mein-pack/cheese_burger.png',
    './images/mein-pack/chicken_nuggets.png',
    './images/mein-pack/choc_chip_muffin.png',
    './images/mein-pack/chorus_ice_cream.png',
    './images/mein-pack/coca_cola.png',
    './images/mein-pack/coldsoup.png',
    './images/mein-pack/cooked_bacon.png',
    './images/mein-pack/cookie_ice_cream.png',
    './images/mein-pack/eggchan.png',
    './images/mein-pack/fanta.png',
    './images/mein-pack/fish.png',
    './images/mein-pack/gold_coin.png',
    './images/mein-pack/gummy_bear.png',
    './images/mein-pack/happy_meal.png',
    './images/mein-pack/hot_chocolate.png',
    './images/mein-pack/ice_cream.png',
    './images/mein-pack/kebab.png',
    './images/mein-pack/lemonade.png',
    './images/mein-pack/lipton_ice_tea_peach.png',
    './images/mein-pack/mcflurry.png',
    './images/mein-pack/mcflurry_chocolate.png',
    './images/mein-pack/mcfries.png',
    './images/mein-pack/melon_popsicle.png',
    './images/mein-pack/pancake.png',
    './images/mein-pack/pear.png',
    './images/mein-pack/pill.png',
    './images/mein-pack/ramen.png',
    './images/mein-pack/raspberry.png',
    './images/mein-pack/raw_bacon.png',
    './images/mein-pack/salad.png',
    './images/mein-pack/silver_coin.png',
    './images/mein-pack/smashedpotato.png',
    './images/mein-pack/sprite.png',
    './images/mein-pack/strawberry.png',
    './images/mein-pack/strawberrysoup.png',
    './images/mein-pack/sweet_berries_ice_cream.png',
    './images/mein-pack/water_ice_cream.png',
    './images/mein-pack/yellowraspberry.png',
    './javascript/main.js',
    './javascript/viewer3d.js',
];
// PRECACHE-END

self.addEventListener('install', event => {
    event.waitUntil(caches.open(CACHE).then(cache => cache.addAll(PRECACHE)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', event => {
    event.waitUntil(
        caches.keys()
            .then(keys => Promise.all(keys.filter(key => key !== CACHE).map(key => caches.delete(key))))
            .then(() => self.clients.claim())
    );
});

const fromNetwork = (request, timeout) => new Promise((resolve, reject) => {
    const timer = setTimeout(reject, timeout);
    fetch(request).then(response => {
        clearTimeout(timer);
        if (response.ok) {
            const copy = response.clone();
            caches.open(CACHE).then(cache => cache.put(request, copy));
        }
        resolve(response);
    }, error => {
        clearTimeout(timer);
        reject(error);
    });
});

const fromCache = async request => {
    const cached = await caches.match(request, { ignoreSearch: true });
    if (cached) {
        return cached;
    }
    if (request.mode === 'navigate') {
        return caches.match('./index.html');
    }
    return Response.error();
};

self.addEventListener('fetch', event => {
    const { request } = event;
    if (request.method !== 'GET') {
        return;
    }
    const url = new URL(request.url);

    if (url.hostname === 'fonts.googleapis.com' || url.hostname === 'fonts.gstatic.com' || url.href.startsWith('https://unpkg.com/three@0.160.0/')) {
        event.respondWith(caches.match(request).then(cached => cached || fromNetwork(request, 10000)));
        return;
    }

    if (url.origin !== self.location.origin || url.pathname.includes('/downloads/')) {
        return;
    }

    event.respondWith(fromNetwork(request, 4000).catch(() => fromCache(request)));
});
