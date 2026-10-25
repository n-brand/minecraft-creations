# Server Pack 2026 – Generator & Datapack Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Move the Server Pack 2026 generator from the scratchpad spike into the repo and extend it with a server datapack that makes renamed costumes look right when worn and renamed deco placeable/breakable as 3D models.

**Architecture:** One Node generator in `server-pack/` (no npm packages) reads the mod jars directly, builds the resource pack, the datapack, the command list and the site entry from one shared item list, so names can never drift apart. Pure functions (naming, base items, pack/datapack file maps) are unit-tested with `node --test`; the CLI only does I/O.

**Tech Stack:** Node 24 ESM (`.mjs`), `node:zlib`, `node:test`, Minecraft Java 26.3 resource pack + data pack (mcfunction, advancements, item modifiers).

**Spec:** `docs/superpowers/specs/2026-10-25-server-pack-2026-design.md`

## Global Constraints

- No npm dependencies; only Node built-ins (`node:fs`, `node:path`, `node:zlib`, `node:test`, `node:assert`).
- Mod jars and generated packs never go into the repo. Output folder `server-pack/out/` is in `.gitignore`.
- Resource pack `pack.mcmeta`: `min_format [55,0]`, `max_format [99,0]`, `pack_format 55`, `supported_formats [55,99]`.
- Data pack `pack.mcmeta`: `min_format [107,0]`, `max_format [200,0]` (26.2 = data 107; 26.3 is newer).
- Data pack namespace `server_pack_2026`; resource-pack namespace for own assets `halloween`; folder names singular (`function`, `advancement`, `item_modifier`, `tags/function`).
- Resource pack zip target: `C:\Users\nicol\AppData\Roaming\.minecraft\resourcepacks\Server Pack 2026.zip`. Data pack zip target: `C:\Source\Minecraft\Server Pack 2026 Datapack.zip`.
- Names: English mod name from `en_us.json`, `§x` codes stripped, duplicates replaced by Title Case of the item id.
- Base items exactly as in the spec table (pressure plate, skeleton skull, bread, elytra, turtle egg, bundle, music disc 13, leather pieces, carved pumpkin, paper).
- Equipment sets with real textures: `hh_bride, hh_frankenstein, hh_mermaid, hh_merman, hh_mummy, hh_pirate, fp_pumpkin, fp_living_bark`.
- Commits: author `Nicolas Brand <227780975+n-brand@users.noreply.github.com>`, German messages, no mention of Claude. Never push.
- Site texts German; code identifiers English; comments only structural.

## Review Focus

- A renamed pressure plate placed while the player looks at a different spot (e.g. placing against a wall far away) → the raycast must find the newly placed plate or do nothing; it must never turn an unrelated plate into deco. Pinned in Task 5 (`placeFunction` only converts a plate without an existing `sp26.deco` interaction within 0.5 blocks).
- Breaking deco in creative vs. survival → item drops only in survival/adventure. Pinned in Task 5.
- A costume piece renamed with wrong capitalization ("bride mask") → no change, stays leather. Pinned in Task 4 (exact-match predicate).
- Two pressure plates stacked/adjacent → breaking one removes only its own display. Pinned in Task 5 (`distance=..0.5` selectors).
- A stack of renamed pressure plates (count > 1) → each placement still triggers (advancement is revoked in the reward). Pinned in Task 5.

---

### Task 1: Archive and image helpers

**Files:**
- Create: `server-pack/lib/zip.mjs`, `server-pack/lib/png.mjs`
- Test: `server-pack/test/lib.test.mjs`

**Interfaces:**
- Produces:
  - `readZip(buffer) -> Map<string, Buffer>` (entries by path; supports stored + deflate; skips directories)
  - `writeZip(files: Map<string, Buffer|string>) -> Buffer` (deflate, forward slashes)
  - `decodePng(buffer) -> {w, h, data: Buffer /*RGBA*/}`, `encodePng({w, h, data}) -> Buffer`

- [ ] **Step 1: Write failing tests:** `writeZip` → `readZip` round-trip of `{"a.txt":"hi","dir/b.json":"{}"}` returns equal contents; `readZip` of a real jar (`C:\Users\nicol\Downloads\happyhallows-1.21.1-4.jar`, skip test if missing) contains `assets/happyhallows/lang/en_us.json`; `encodePng`→`decodePng` round-trip of a 2×2 RGBA image; decoding a palette PNG fixture (create with `encodePng` is not possible → use `assets/happyhallows/textures/block/candelabra_red.png` from the jar when present) yields `w>0`.
- [ ] **Step 2:** Run `node --test server-pack/test/` → FAIL (modules missing).
- [ ] **Step 3:** Implement. PNG: port `png.js` from the spike (`scratchpad/tools/png.js`) to ESM. Zip: parse End-Of-Central-Directory, central directory, local headers; `zlib.inflateRawSync` for method 8; write with `zlib.deflateRawSync`, CRC via `zlib.crc32`.
- [ ] **Step 4:** Run tests → PASS.
- [ ] **Step 5:** Commit `Server Pack 2026: Zip- und PNG-Helfer fuer den Generator`.

### Task 2: Item list (selection, names, base items)

**Files:**
- Create: `server-pack/auswahl.txt` (copy of the spike's `auswahl.txt`, 198 lines), `server-pack/quellen.json`, `server-pack/items.mjs`
- Test: `server-pack/test/items.test.mjs`

**Interfaces:**
- Consumes: `readZip` (Task 1).
- Produces:
  - `quellen.json`: `{ "mods": { "decoween-neoforge": "<jar path>", "happyhallows": "...", "funny_pumpkin": "...", "spookify": "..." }, "hats": "<zip path>", "vanillaJar": "C:\\Users\\nicol\\AppData\\Roaming\\.minecraft\\versions\\26.2\\26.2.jar", "resourcepackOut": "...", "datapackOut": "..." }` (paths from Global Constraints and spec table).
  - `NAMESPACE = { "decoween-neoforge": "decoween", happyhallows: "happyhallows", funny_pumpkin: "funny_pumpkin", spookify: "spookify" }`
  - `slotOf(id) -> "head"|"chest"|"legs"|"feet"|null` (port spike regexes incl. `clown_(nose|wig)`)
  - `baseFor({mod, id, name, is3d}) -> string` (vanilla item id)
  - `buildItemList({selection: string[], lang: {[mod]: object}, is3d: (mod,id)=>boolean}) -> Item[]` where `Item = {key, mod, ns, id, name, base, slot, equipment: string|null, kind: "costume"|"deco"|"food"|"other", model: "<ns>:item/<id>", icon: "<ns>_<id>"}`
  - `giveCommand(item) -> string`

- [ ] **Step 1: Write failing tests** (pure, no jars):
  - `baseFor` returns: `oak_pressure_plate` for `{mod:"decoween-neoforge",id:"haunted_fountain",is3d:true}`; `skeleton_skull` for `happyhallows/red_skull_candle`; `bread` for `funny_pumpkin/red_candy`, `berry_muffin`, `pumpkin_lollipop`, `caramel_key`; `elytra` for name `"Demonic Wings"`; `turtle_egg` for `nether_monster_egg` and `nether_monster_egg_ingredient`; `bundle` for `spookify/bag_ghost`; `music_disc_13` for `music_disc_3`; `leather_helmet` for `happyhallows/bride_mask`; `paper` for a flat non-food item like `funny_pumpkin/demonic_cloth`.
  - `buildItemList` strips `§e` ("§eNether Monster Egg" → after dedupe "Nether Monster Egg"/"Nether Monster Egg Ingredient"), dedupes three "Corpse" into Title Case ids, uses disc desc titles ("Witch Dance").
  - `equipment` is `"halloween:hh_bride"` for `bride_mask`, `"halloween:fp_pumpkin"` for `pumpkin_armor_helmet`, `null` for `witch_costume_helmet` and for `pumpkin_mask_helmet`.
  - `giveCommand` for bride mask equals `/give @s leather_helmet[custom_name="Bride Mask",equippable={slot:"head",asset_id:"halloween:hh_bride"}]`; for Haunted Fountain equals `/give @s oak_pressure_plate[custom_name="Haunted Fountain"]`.
- [ ] **Step 2:** Run → FAIL.
- [ ] **Step 3:** Implement by porting the rules from `scratchpad/tools/spike-pack.js` (entries/names/base section). Christmas Hat is added by Task 3, not here.
- [ ] **Step 4:** Run → PASS.
- [ ] **Step 5:** Commit `Server Pack 2026: Item-Liste mit Namen und Grund-Items`.

### Task 3: Resource pack builder and load check

**Files:**
- Create: `server-pack/resourcepack.mjs`, `server-pack/check.mjs`
- Test: `server-pack/test/resourcepack.test.mjs`

**Interfaces:**
- Consumes: `Item[]`, `readZip`.
- Produces:
  - `buildResourcePack({items, modFiles: {[mod]: Map}, vanillaFiles: Map, hatFiles: Map}) -> {files: Map<string, Buffer|string>, items: Item[] /* incl. Christmas Hat */}`
  - `checkPack(files: Map) -> string[]` (problems; empty = ok)

- [ ] **Step 1: Write failing tests** with an in-memory fixture (two fake mods: one flat item with `layer0` in `textures/block/x`, one element model whose parent template uses `"particle": "block/anvil"` and a face with undefined `#missing`):
  - flat texture lands at `assets/<ns>/textures/item/hx/block/x.png` and the model points to `<ns>:item/hx/block/x`;
  - `block/anvil` is copied to `assets/halloween/textures/item/hx/vanilla/block/anvil.png`;
  - the `#missing` face is removed;
  - `assets/minecraft/items/oak_pressure_plate.json` is a `select` on `minecraft:custom_name` with the vanilla definition as `fallback`;
  - `checkPack` returns `[]` for the built fixture and reports `mehrere Atlanten` when a model mixes `ns:item/...` and `block/anvil`.
- [ ] **Step 2:** Run → FAIL.
- [ ] **Step 3:** Port `copyModel`/`copyTexture`/`fixFaces`/equipment/hat/pumpkinblur/pack.png logic from `spike-pack.js` and `check-pack.js`, reading from the zip maps instead of extracted folders. `pack.mcmeta` description `§6Server Pack 2026`.
- [ ] **Step 4:** Run → PASS.
- [ ] **Step 5:** Commit `Server Pack 2026: Resource-Pack-Bau und Lade-Check`.

### Task 4: Datapack – costumes

**Files:**
- Create: `server-pack/datapack.mjs`
- Test: `server-pack/test/datapack.test.mjs`

**Interfaces:**
- Consumes: `Item[]` (only `kind === "costume"`).
- Produces: `buildDatapack({items}) -> Map<string, string>` (this task fills the costume part; Task 5 adds deco to the same function).

Files the builder must emit:
- `pack.mcmeta` (Global Constraints).
- `data/minecraft/tags/function/load.json` → `server_pack_2026:load`; `.../tick.json` → `server_pack_2026:tick`.
- `server_pack_2026:load` schedules `server_pack_2026:second` (`schedule function server_pack_2026:second 20t`); `second` runs `execute as @a run function server_pack_2026:costume/check` and reschedules itself.
- `costume/check`: one line per costume item and its slot:
  `execute if items entity @s armor.<slot> minecraft:<base>[minecraft:custom_name="<Name>"] unless items entity @s armor.<slot> *[minecraft:custom_data~{sp26:1b}] run item modify entity @s armor.<slot> server_pack_2026:costume/<icon>`
  (`armor.head|chest|legs|feet` from `slot`).
- `item_modifier/costume/<icon>.json`: `{"function":"minecraft:set_components","components":{"minecraft:equippable":{"slot":"<slot>", "asset_id":"<equipment>"}, "minecraft:custom_data":{"sp26":true}}}` — omit `asset_id` when `equipment` is null and slot is `head`; for null equipment on other slots emit no line and no modifier.

- [ ] **Step 1: Write failing tests:** the map contains `pack.mcmeta` with `min_format` `[107,0]`; `costume/check.mcfunction` contains the exact line for Bride Mask (`armor.head`, `leather_helmet`, modifier `server_pack_2026:costume/happyhallows_bride_mask`); the Bride Mask modifier has `asset_id` `halloween:hh_bride`; Witch Hat (funny_pumpkin, head, no equipment) has a modifier without `asset_id`; Witch Robe (chest, no equipment) has neither line nor modifier; every `run item modify … server_pack_2026:costume/X` has a matching `data/server_pack_2026/item_modifier/costume/X.json`.
- [ ] **Step 2:** Run → FAIL. **Step 3:** Implement. **Step 4:** Run → PASS.
- [ ] **Step 5:** Commit `Server Pack 2026: Datapack fuer Kostueme`.

### Task 5: Datapack – placeable deco

**Files:**
- Modify: `server-pack/datapack.mjs`
- Test: `server-pack/test/datapack.test.mjs`

**Interfaces:**
- Consumes: `Item[]` with `base === "oak_pressure_plate"`.
- Produces (inside `buildDatapack`):
  - `advancement/deco/<icon>.json`: criterion `placed` with `trigger: "minecraft:placed_block"`, `conditions.location`: `[{"condition":"minecraft:block_state_property","block":"minecraft:oak_pressure_plate"},{"condition":"minecraft:match_tool","predicate":{"items":"minecraft:oak_pressure_plate","components":{"minecraft:custom_name":"<Name>"}}}]`; `rewards.function: "server_pack_2026:deco/placed/<icon>"`.
  - `function/deco/placed/<icon>.mcfunction`: `advancement revoke @s only server_pack_2026:deco/<icon>` then `function server_pack_2026:deco/place {name:"<Name>"}`.
  - `deco/place` (macro): stores the name in storage `server_pack_2026:tmp`, starts a raycast `execute anchored eyes positioned ^ ^ ^ run function server_pack_2026:deco/ray` with a step counter (score `#steps sp26` up to 60 steps of `^ ^ ^0.1`).
  - `deco/ray`: if `block ~ ~ ~ minecraft:oak_pressure_plate` and no `@e[type=interaction,tag=sp26.deco,distance=..0.5]` at the aligned block centre → `execute align xyz positioned ~0.5 ~0.5 ~0.5 run function server_pack_2026:deco/spawn with storage server_pack_2026:tmp`; else recurse until steps run out.
  - `deco/spawn` (macro): `setblock ~ ~-0.5 ~ air` (plate position = aligned block), `summon item_display ~ ~ ~ {Tags:["sp26.deco"],item_display:"none",item:{id:"minecraft:oak_pressure_plate",count:1,components:{"minecraft:custom_name":"$(name)"}}}`, rotate it to the player's yaw snapped to 90°, `summon interaction ~ ~-0.5 ~ {Tags:["sp26.deco"],width:1f,height:1f}`.
  - `tick`: `execute as @e[type=interaction,tag=sp26.deco] if data entity @s attack at @s run function server_pack_2026:deco/break`.
  - `deco/break`: `execute positioned ~ ~0.5 ~` → for the `item_display` with tag `sp26.deco` at `distance=..0.5`: if the attacker (`execute on attacker`) is not in creative, `summon item` with `Item` copied from the display's `item`; then kill the display and the interaction (both `distance=..0.5` from their own positions).
- Item frame / armor stand use stays untouched (no selectors on those).

- [ ] **Step 1: Write failing tests:** one advancement per pressure-plate item (57 for the real list; in the unit fixture: 2), each with the exact `match_tool` predicate and reward function; `deco/placed/<icon>` revokes exactly its own advancement; `tick.mcfunction` contains the interaction attack line; `deco/break` contains `gamemode=!creative` and `distance=..0.5`; `deco/ray` checks `minecraft:oak_pressure_plate` and the `sp26.deco` interaction guard; every `function server_pack_2026:X` reference in any `.mcfunction` or advancement resolves to an emitted file.
- [ ] **Step 2:** Run → FAIL. **Step 3:** Implement. **Step 4:** Run → PASS.
- [ ] **Step 5:** Commit `Server Pack 2026: Datapack fuer platzierbare Deko`.

### Task 6: Site outputs (icons, entry) and CLI

**Files:**
- Create: `server-pack/icons.mjs`, `server-pack/site-entry.mjs`, `server-pack/build.mjs`
- Modify: `.gitignore` (add `server-pack/out/`), `data/items.js` (regenerated), `images/server-pack-2026/*` (regenerated), `sw.js` (via `node tools/build-sw.mjs`), `CLAUDE.md` (Stand), `package.json` only if one exists — otherwise none.
- Test: `server-pack/test/site.test.mjs`

**Interfaces:**
- Consumes: everything above; `decodePng`/`encodePng`.
- Produces:
  - `renderIcon(model, files, size=64) -> Buffer|null` (port `render-icons.js`).
  - `entrySource(items) -> string` (port `make-entry.js`, BASES incl. `skeleton_skull`, `bundle`, `turtle_egg`, `elytra`, `oak_pressure_plate`, `bread`; texts updated: deco can be placed and broken with left click, costumes just need to be worn; /give remains for admins).
  - `node server-pack/build.mjs` writes: resource pack zip and datapack zip to the `quellen.json` targets, `server-pack/out/BEFEHLE.md` and `befehle.json`, icons to `images/server-pack-2026/`, entry into `data/items.js`; exits non-zero if `checkPack` reports problems; prints counts.

- [ ] **Step 1: Write failing tests:** `entrySource` for a 2-item list contains `id: "server-pack-2026"`, `serverOnly: true`, the costume give command with `equippable`, and the feature line mentioning `Linksklick`; `renderIcon` returns a 64×64 PNG for a one-cube model fixture.
- [ ] **Step 2:** Run → FAIL. **Step 3:** Implement. **Step 4:** Run → PASS.
- [ ] **Step 5:** Run `node server-pack/build.mjs` → prints `199 Item-Modelle geprüft, 0 Probleme`, writes both zips; then `node tools/build-sw.mjs`; open `http://localhost:4185/#server-pack-2026` and confirm 199 chips, no broken images, no console errors.
- [ ] **Step 6:** Update `CLAUDE.md` (Generator in `server-pack/`, Datapack-Ziel, Befehl `node server-pack/build.mjs`). Commit `Server Pack 2026: Generator im Repo, Seite aus Generator`.

### Task 7: In-game verification handoff

- [ ] **Step 1:** Ask Nicolas for the name of a test world, copy `Server Pack 2026 Datapack.zip` into `C:\Users\nicol\AppData\Roaming\.minecraft\saves\<Welt>\datapacks\` (only after he names the world).
- [ ] **Step 2:** Give him a short checklist: `/reload`; put on renamed Bride Mask (should look like the mod), Witch Hat (3D on head?), Witch Robe (stays leather); place renamed Haunted Fountain (model appears, plate gone), left-click it in survival (item drops) and in creative (no drop); place an unnamed pressure plate (stays normal).
- [ ] **Step 3:** Fix whatever he reports (each fix = test + commit). Report the result; give the push command, never push.
