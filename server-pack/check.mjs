// Lade-Check: simuliert, was Minecraft 26.x beim Laden der Item-Modelle prüft.

const split = (id) => (id.includes(":") ? id.split(":") : ["minecraft", id]);
const atlasOf = (texId) => (split(texId)[1].startsWith("item/") ? "items" : "blocks");

export function checkPack(files) {
  const problems = [];
  const read = (p) => JSON.parse(files.get(p).toString());

  function chain(id) {
    const out = [];
    for (let cur = id, n = 0; cur && n < 12; n++) {
      const [ns, p] = split(cur);
      if (ns === "minecraft") { out.push({ vanilla: "minecraft:" + p }); break; }
      const path = `assets/${ns}/models/${p}.json`;
      if (!files.has(path)) { problems.push(`${id}: Modell ${cur} fehlt`); break; }
      const j = read(path);
      out.push({ j });
      cur = j.parent;
    }
    return out;
  }

  for (const path of [...files.keys()].filter((p) => p.startsWith("assets/minecraft/items/"))) {
    const names = new Set(); // derselbe Name darf auf mehreren Grund-Items liegen (z.B. Leder- und Diamanthelm)
    for (const c of read(path).model.cases || []) {
      if (names.has(c.when)) problems.push(`${c.when}: Name doppelt`);
      names.add(c.when);
      // verschachtelte Auswahl (z.B. 3D-Hut nur auf dem Kopf): jedes Modell einzeln prüfen
      const ids = [];
      const collect = (m) => { if (!m) return; if (m.model) ids.push(m.model); (m.cases || []).forEach((x) => collect(x.model)); collect(m.fallback); };
      collect(c.model);
      for (const id of ids) checkModel(c.when, id);
    }
  }
  return problems;

  function checkModel(when, id) {
    {
      const c = { when, model: { model: id } };
      const ch = chain(c.model.model);
      const tex = Object.assign({}, ...ch.slice().reverse().map((x) => x.j?.textures || {}));
      const resolve = (k, n = 0) => { let v = tex[k]; while (v && v.startsWith("#") && n++ < 10) v = tex[v.slice(1)]; return v && !v.startsWith("#") ? v : null; };
      const elements = ch.find((x) => x.j?.elements)?.j.elements;
      const generated = !elements && ch.some((x) => /item\/(generated|handheld)/.test(x.vanilla || ""));
      const used = new Set();
      if (generated) {
        const v = resolve("layer0");
        if (v) used.add(v); else problems.push(`${c.when}: layer0 fehlt`);
      } else if (elements) {
        for (const e of elements) for (const f of Object.values(e.faces || {})) {
          const v = resolve((f.texture || "").replace(/^#/, ""));
          if (v) used.add(v); else problems.push(`${c.when}: ${f.texture} undefiniert`);
        }
      } else problems.push(`${c.when}: weder Elemente noch generated`);
      const particle = resolve("particle");
      if (particle) used.add(particle);
      for (const v of used) {
        const [ns, p] = split(v);
        if (ns !== "minecraft" && !files.has(`assets/${ns}/textures/${p}.png`)) problems.push(`${c.when}: Textur ${v} fehlt`);
      }
      if (new Set([...used].map(atlasOf)).size > 1) problems.push(`${c.when}: mehrere Atlanten: ${[...used].join(", ")}`);
    }
  }
  return problems;
}
