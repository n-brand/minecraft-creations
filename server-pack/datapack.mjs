// Datapack: Kostüme anziehbar machen, Deko platzierbar machen. Läuft nur auf dem Server.

const NS = "server_pack_2026";
const json = (o) => JSON.stringify(o, null, 2);
const quote = (s) => s.replace(/\\/g, "\\\\").replace(/"/g, '\\"');

export function buildDatapack({ items }) {
  const files = new Map();
  const fn = (name, lines) => files.set(`data/${NS}/function/${name}.mcfunction`, lines.join("\n") + "\n");

  files.set("pack.mcmeta", json({ pack: { description: "§6Server Pack 2026 §7(Datapack)", min_format: [107, 0], max_format: [200, 0] } }));
  files.set("data/minecraft/tags/function/load.json", json({ values: [`${NS}:load`] }));
  files.set("data/minecraft/tags/function/tick.json", json({ values: [`${NS}:tick`] }));

  fn("load", [`schedule function ${NS}:second 20t`]);
  fn("second", [`execute as @a run function ${NS}:costume/check`, `schedule function ${NS}:second 20t`]);
  fn("tick", []);

  /* --- Kostüme --- */
  const check = [];
  for (const item of items.filter((i) => i.kind === "costume")) {
    if (!item.equipment && item.slot !== "head") continue;
    const slot = `armor.${item.slot}`;
    const equippable = item.equipment ? { slot: item.slot, asset_id: item.equipment } : { slot: item.slot };
    files.set(`data/${NS}/item_modifier/costume/${item.icon}.json`, json({ function: "minecraft:set_components", components: { "minecraft:equippable": equippable, "minecraft:custom_data": { sp26: true } } }));
    check.push(`execute if items entity @s ${slot} minecraft:${item.base}[minecraft:custom_name="${quote(item.name)}"] unless items entity @s ${slot} *[minecraft:custom_data~{sp26:1b}] run item modify entity @s ${slot} ${NS}:costume/${item.icon}`);
  }
  fn("costume/check", check);

  return files;
}
