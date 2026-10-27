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
    './images/server-pack-2026.png',
    './images/server-pack-2026/decoween_candelabra.png',
    './images/server-pack-2026/decoween_crystal_ball.png',
    './images/server-pack-2026/decoween_deer_skull.png',
    './images/server-pack-2026/decoween_fortune_table.png',
    './images/server-pack-2026/decoween_gothic_throne.png',
    './images/server-pack-2026/decoween_haunted_fountain.png',
    './images/server-pack-2026/decoween_haunted_well.png',
    './images/server-pack-2026/decoween_jack_in_the_box.png',
    './images/server-pack-2026/decoween_pumpkin_cart.png',
    './images/server-pack-2026/decoween_pumpkin_pile.png',
    './images/server-pack-2026/decoween_scarecrow.png',
    './images/server-pack-2026/decoween_skull_candle.png',
    './images/server-pack-2026/decoween_startled_crow.png',
    './images/server-pack-2026/decoween_witch_broom.png',
    './images/server-pack-2026/decoween_witch_cauldron.png',
    './images/server-pack-2026/decoween_witch_hat.png',
    './images/server-pack-2026/decoween_zombie_hand.png',
    './images/server-pack-2026/funny_pumpkin_ancient_skeleton.png',
    './images/server-pack-2026/funny_pumpkin_angel_costume_chestplate.png',
    './images/server-pack-2026/funny_pumpkin_angel_costume_helmet.png',
    './images/server-pack-2026/funny_pumpkin_automaton_exoskeleton_boots.png',
    './images/server-pack-2026/funny_pumpkin_automaton_exoskeleton_chestplate.png',
    './images/server-pack-2026/funny_pumpkin_automaton_exoskeleton_helmet.png',
    './images/server-pack-2026/funny_pumpkin_automaton_exoskeleton_leggings.png',
    './images/server-pack-2026/funny_pumpkin_berry_muffin.png',
    './images/server-pack-2026/funny_pumpkin_berry_muffin_block.png',
    './images/server-pack-2026/funny_pumpkin_black_candy.png',
    './images/server-pack-2026/funny_pumpkin_blue_candy.png',
    './images/server-pack-2026/funny_pumpkin_candy_pumpkin_block.png',
    './images/server-pack-2026/funny_pumpkin_caramel_key.png',
    './images/server-pack-2026/funny_pumpkin_clown_costume_boots.png',
    './images/server-pack-2026/funny_pumpkin_clown_costume_chestplate.png',
    './images/server-pack-2026/funny_pumpkin_clown_costume_leggings.png',
    './images/server-pack-2026/funny_pumpkin_clown_nose.png',
    './images/server-pack-2026/funny_pumpkin_clown_wig.png',
    './images/server-pack-2026/funny_pumpkin_cultist_costume_chestplate.png',
    './images/server-pack-2026/funny_pumpkin_cultist_costume_helmet.png',
    './images/server-pack-2026/funny_pumpkin_cultist_costume_leggings.png',
    './images/server-pack-2026/funny_pumpkin_cyan_candy.png',
    './images/server-pack-2026/funny_pumpkin_dark_mummy_costume_boots.png',
    './images/server-pack-2026/funny_pumpkin_dark_mummy_costume_chestplate.png',
    './images/server-pack-2026/funny_pumpkin_dark_mummy_costume_helmet.png',
    './images/server-pack-2026/funny_pumpkin_dark_mummy_costume_leggings.png',
    './images/server-pack-2026/funny_pumpkin_death_costume_chestplate.png',
    './images/server-pack-2026/funny_pumpkin_death_costume_helmet.png',
    './images/server-pack-2026/funny_pumpkin_death_statue_deepslate.png',
    './images/server-pack-2026/funny_pumpkin_death_statue_nether.png',
    './images/server-pack-2026/funny_pumpkin_death_statue_stone.png',
    './images/server-pack-2026/funny_pumpkin_demon_costume_chestplate.png',
    './images/server-pack-2026/funny_pumpkin_demon_costume_helmet.png',
    './images/server-pack-2026/funny_pumpkin_depth_monster_costume_boots.png',
    './images/server-pack-2026/funny_pumpkin_depth_monster_costume_chestplate.png',
    './images/server-pack-2026/funny_pumpkin_depth_monster_costume_helmet.png',
    './images/server-pack-2026/funny_pumpkin_depth_monster_costume_leggings.png',
    './images/server-pack-2026/funny_pumpkin_drop_pumpkin_candle.png',
    './images/server-pack-2026/funny_pumpkin_gargoyle_statue_deepslate.png',
    './images/server-pack-2026/funny_pumpkin_gargoyle_statue_nether.png',
    './images/server-pack-2026/funny_pumpkin_gargoyle_statue_stone.png',
    './images/server-pack-2026/funny_pumpkin_ghost_costume_chestplate.png',
    './images/server-pack-2026/funny_pumpkin_ghost_costume_helmet.png',
    './images/server-pack-2026/funny_pumpkin_gray_candy.png',
    './images/server-pack-2026/funny_pumpkin_green_candy.png',
    './images/server-pack-2026/funny_pumpkin_hanged_corpse.png',
    './images/server-pack-2026/funny_pumpkin_hanged_torn_corpse.png',
    './images/server-pack-2026/funny_pumpkin_lay_corpse.png',
    './images/server-pack-2026/funny_pumpkin_lay_mushroom_corpse.png',
    './images/server-pack-2026/funny_pumpkin_lay_skeleton.png',
    './images/server-pack-2026/funny_pumpkin_lay_torn_corpse.png',
    './images/server-pack-2026/funny_pumpkin_light_blue_candy.png',
    './images/server-pack-2026/funny_pumpkin_light_gray_candy.png',
    './images/server-pack-2026/funny_pumpkin_lime_candy.png',
    './images/server-pack-2026/funny_pumpkin_living_bark_armor_chestplate.png',
    './images/server-pack-2026/funny_pumpkin_living_bark_armor_helmet.png',
    './images/server-pack-2026/funny_pumpkin_living_bark_armor_leggings.png',
    './images/server-pack-2026/funny_pumpkin_lollipop_pot.png',
    './images/server-pack-2026/funny_pumpkin_magenta_candy.png',
    './images/server-pack-2026/funny_pumpkin_mummy_costume_boots.png',
    './images/server-pack-2026/funny_pumpkin_mummy_costume_chestplate.png',
    './images/server-pack-2026/funny_pumpkin_mummy_costume_helmet.png',
    './images/server-pack-2026/funny_pumpkin_mummy_costume_leggings.png',
    './images/server-pack-2026/funny_pumpkin_music_disc_1.png',
    './images/server-pack-2026/funny_pumpkin_music_disc_2.png',
    './images/server-pack-2026/funny_pumpkin_music_disc_3.png',
    './images/server-pack-2026/funny_pumpkin_music_disc_4.png',
    './images/server-pack-2026/funny_pumpkin_music_disc_5.png',
    './images/server-pack-2026/funny_pumpkin_music_disc_6.png',
    './images/server-pack-2026/funny_pumpkin_nether_monster_egg.png',
    './images/server-pack-2026/funny_pumpkin_nether_monster_egg_ingredient.png',
    './images/server-pack-2026/funny_pumpkin_nightmare_costume_boots.png',
    './images/server-pack-2026/funny_pumpkin_nightmare_costume_chestplate.png',
    './images/server-pack-2026/funny_pumpkin_nightmare_costume_helmet.png',
    './images/server-pack-2026/funny_pumpkin_nightmare_costume_leggings.png',
    './images/server-pack-2026/funny_pumpkin_orange_candy.png',
    './images/server-pack-2026/funny_pumpkin_pink_candy.png',
    './images/server-pack-2026/funny_pumpkin_princess_costume_boots.png',
    './images/server-pack-2026/funny_pumpkin_princess_costume_chestplate.png',
    './images/server-pack-2026/funny_pumpkin_princess_costume_helmet.png',
    './images/server-pack-2026/funny_pumpkin_princess_costume_leggings.png',
    './images/server-pack-2026/funny_pumpkin_pumpkin_armor_boots.png',
    './images/server-pack-2026/funny_pumpkin_pumpkin_armor_chestplate.png',
    './images/server-pack-2026/funny_pumpkin_pumpkin_armor_helmet.png',
    './images/server-pack-2026/funny_pumpkin_pumpkin_candle.png',
    './images/server-pack-2026/funny_pumpkin_pumpkin_caster_cloak_chestplate.png',
    './images/server-pack-2026/funny_pumpkin_pumpkin_lollipop.png',
    './images/server-pack-2026/funny_pumpkin_pumpkin_mask_helmet.png',
    './images/server-pack-2026/funny_pumpkin_purple_candy.png',
    './images/server-pack-2026/funny_pumpkin_red_candy.png',
    './images/server-pack-2026/funny_pumpkin_scarecrow_costume_chestplate.png',
    './images/server-pack-2026/funny_pumpkin_scarecrow_costume_helmet.png',
    './images/server-pack-2026/funny_pumpkin_scarecrow_costume_leggings.png',
    './images/server-pack-2026/funny_pumpkin_scarecrow_head.png',
    './images/server-pack-2026/funny_pumpkin_seat_corpse.png',
    './images/server-pack-2026/funny_pumpkin_seat_mushroom_corpse.png',
    './images/server-pack-2026/funny_pumpkin_seat_skeleton.png',
    './images/server-pack-2026/funny_pumpkin_seat_torn_corpse.png',
    './images/server-pack-2026/funny_pumpkin_sewing_table.png',
    './images/server-pack-2026/funny_pumpkin_skeleton_grave.png',
    './images/server-pack-2026/funny_pumpkin_vampire_cloak.png',
    './images/server-pack-2026/funny_pumpkin_vampire_cloak_entity_chestplate.png',
    './images/server-pack-2026/funny_pumpkin_vampire_costume_1_boots.png',
    './images/server-pack-2026/funny_pumpkin_vampire_costume_1_chestplate.png',
    './images/server-pack-2026/funny_pumpkin_vampire_costume_1_helmet.png',
    './images/server-pack-2026/funny_pumpkin_vampire_costume_1_leggings.png',
    './images/server-pack-2026/funny_pumpkin_vampire_eyes_1.png',
    './images/server-pack-2026/funny_pumpkin_vampire_eyes_2.png',
    './images/server-pack-2026/funny_pumpkin_vampire_eyes_3.png',
    './images/server-pack-2026/funny_pumpkin_vampire_hat_eyes_1.png',
    './images/server-pack-2026/funny_pumpkin_vampire_hat_eyes_2.png',
    './images/server-pack-2026/funny_pumpkin_vampire_hat_eyes_3.png',
    './images/server-pack-2026/funny_pumpkin_white_candy.png',
    './images/server-pack-2026/funny_pumpkin_witch_costume_boots.png',
    './images/server-pack-2026/funny_pumpkin_witch_costume_chestplate.png',
    './images/server-pack-2026/funny_pumpkin_witch_costume_helmet.png',
    './images/server-pack-2026/funny_pumpkin_witch_costume_leggings.png',
    './images/server-pack-2026/funny_pumpkin_yellow_candy.png',
    './images/server-pack-2026/halloween_christmas_hat.png',
    './images/server-pack-2026/happyhallows_black_candelabra.png',
    './images/server-pack-2026/happyhallows_black_skull_candle.png',
    './images/server-pack-2026/happyhallows_blue_candelabra.png',
    './images/server-pack-2026/happyhallows_blue_skull_candle.png',
    './images/server-pack-2026/happyhallows_bride_body.png',
    './images/server-pack-2026/happyhallows_bride_boots.png',
    './images/server-pack-2026/happyhallows_bride_breeches.png',
    './images/server-pack-2026/happyhallows_bride_mask.png',
    './images/server-pack-2026/happyhallows_brown_candelabra.png',
    './images/server-pack-2026/happyhallows_brown_skull_candle.png',
    './images/server-pack-2026/happyhallows_candelabra_plain.png',
    './images/server-pack-2026/happyhallows_cyan_candelabra.png',
    './images/server-pack-2026/happyhallows_cyan_skull_candle.png',
    './images/server-pack-2026/happyhallows_frankenstein_body.png',
    './images/server-pack-2026/happyhallows_frankenstein_feet.png',
    './images/server-pack-2026/happyhallows_frankenstein_leggings.png',
    './images/server-pack-2026/happyhallows_frankenstein_mask.png',
    './images/server-pack-2026/happyhallows_gravestone_plain.png',
    './images/server-pack-2026/happyhallows_gray_candelabra.png',
    './images/server-pack-2026/happyhallows_gray_skull_candle.png',
    './images/server-pack-2026/happyhallows_green_candelabra.png',
    './images/server-pack-2026/happyhallows_green_skull_candle.png',
    './images/server-pack-2026/happyhallows_light_blue_candelabra.png',
    './images/server-pack-2026/happyhallows_light_blue_skull_candle.png',
    './images/server-pack-2026/happyhallows_light_gray_candelabra.png',
    './images/server-pack-2026/happyhallows_light_gray_skull_candle.png',
    './images/server-pack-2026/happyhallows_lime_candelabra.png',
    './images/server-pack-2026/happyhallows_lime_skull_candle.png',
    './images/server-pack-2026/happyhallows_magenta_candelabra.png',
    './images/server-pack-2026/happyhallows_magenta_skull_candle.png',
    './images/server-pack-2026/happyhallows_mermaid_mask.png',
    './images/server-pack-2026/happyhallows_mermaid_tail.png',
    './images/server-pack-2026/happyhallows_merman_body.png',
    './images/server-pack-2026/happyhallows_merman_fins.png',
    './images/server-pack-2026/happyhallows_merman_mask.png',
    './images/server-pack-2026/happyhallows_merman_tail.png',
    './images/server-pack-2026/happyhallows_mummy_body.png',
    './images/server-pack-2026/happyhallows_mummy_feet.png',
    './images/server-pack-2026/happyhallows_mummy_leggings.png',
    './images/server-pack-2026/happyhallows_mummy_mask.png',
    './images/server-pack-2026/happyhallows_orange_candelabra.png',
    './images/server-pack-2026/happyhallows_orange_skull_candle.png',
    './images/server-pack-2026/happyhallows_pink_candelabra.png',
    './images/server-pack-2026/happyhallows_pink_skull_candle.png',
    './images/server-pack-2026/happyhallows_pirate_body.png',
    './images/server-pack-2026/happyhallows_pirate_mask.png',
    './images/server-pack-2026/happyhallows_pirate_pants.png',
    './images/server-pack-2026/happyhallows_pirate_plunderers.png',
    './images/server-pack-2026/happyhallows_purple_candelabra.png',
    './images/server-pack-2026/happyhallows_purple_skull_candle.png',
    './images/server-pack-2026/happyhallows_red_candelabra.png',
    './images/server-pack-2026/happyhallows_red_skull_candle.png',
    './images/server-pack-2026/happyhallows_skull_candle.png',
    './images/server-pack-2026/happyhallows_white_candelabra.png',
    './images/server-pack-2026/happyhallows_white_skull_candle.png',
    './images/server-pack-2026/happyhallows_yellow_candelabra.png',
    './images/server-pack-2026/happyhallows_yellow_skull_candle.png',
    './images/server-pack-2026/spookify_bag_bone.png',
    './images/server-pack-2026/spookify_bag_ghost.png',
    './images/server-pack-2026/spookify_bag_halloween.png',
    './images/server-pack-2026/spookify_brain_jar.png',
    './images/server-pack-2026/spookify_broom_stick.png',
    './images/server-pack-2026/spookify_coffin.png',
    './images/server-pack-2026/spookify_kotel.png',
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
