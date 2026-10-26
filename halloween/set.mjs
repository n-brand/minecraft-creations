// --- Inhalt des Halloween-Packs ---
// Ein Eintrag = ein Item, das per Umbenennen im Amboss zu etwas Neuem wird.
// kind: "head" = auf dem Kopf (Datapack nimmt die Rüstungsoptik weg),
//       "wings" = eigene Flügel beim Tragen (Datapack schaltet um),
//       "hand" = nur eigenes Modell in Hand und Inventar.
// Neues Halloween-Item: Eintrag ergänzen, Modell in models.mjs, dann node halloween/build.mjs

export const SET = [
    {
        key: 'teufelshoerner',
        title: 'Teufelshörner',
        item: 'leather_helmet',
        itemDe: 'Lederkappe',
        itemEn: 'Leather Cap',
        names: ['Teufelshörner', 'Teufelshoerner'],
        kind: 'head'
    },
    {
        key: 'teufelsfluegel',
        title: 'Teufelsflügel',
        item: 'elytra',
        itemDe: 'Elytren',
        itemEn: 'Elytra',
        names: ['Teufelsflügel', 'Teufelsfluegel'],
        kind: 'wings'
    },
    {
        key: 'teufelsdreizack',
        title: 'Teufelsdreizack',
        item: 'trident',
        itemDe: 'Dreizack',
        itemEn: 'Trident',
        names: ['Teufelsdreizack'],
        kind: 'hand'
    }
];
