// Liest die Würfel-Geometrie eines Minecraft-Entity-Modells (createBodyLayer) direkt aus dem Bytecode.
// Ergebnis: { texW, texH, parts: [{ name, parent, pose:{x,y,z,rx,ry,rz}, cubes:[{from,size,uv,inflate,mirror}] }] }

export function parseClass(buf) {
  let p = 8;
  const u1 = () => buf[p++], u2 = () => { const v = buf.readUInt16BE(p); p += 2; return v; }, u4 = () => { const v = buf.readUInt32BE(p); p += 4; return v; };
  const n = u2(), cp = [null];
  for (let i = 1; i < n; i++) {
    const tag = u1();
    switch (tag) {
      case 1: { const len = u2(); cp[i] = { tag, v: buf.toString("utf8", p, p + len) }; p += len; break; }
      case 3: cp[i] = { tag, v: buf.readInt32BE(p) }; p += 4; break;
      case 4: cp[i] = { tag, v: buf.readFloatBE(p) }; p += 4; break;
      case 5: case 6: cp[i] = { tag, v: tag === 6 ? buf.readDoubleBE(p) : Number(buf.readBigInt64BE(p)) }; p += 8; i++; break;
      case 7: case 8: case 16: case 19: case 20: cp[i] = { tag, a: u2() }; break;
      case 9: case 10: case 11: case 12: case 17: case 18: cp[i] = { tag, a: u2(), b: u2() }; break;
      case 15: cp[i] = { tag, a: u1(), b: u2() }; break;
      default: throw new Error("cp tag " + tag);
    }
  }
  const utf = (i) => cp[i].v;
  const skipAttrs = () => { const c = u2(); for (let i = 0; i < c; i++) { u2(); const len = u4(); p += len; } };
  p += 6; const ic = u2(); p += 2 * ic; // access, this, super, interfaces
  const fc = u2(); for (let i = 0; i < fc; i++) { p += 6; skipAttrs(); }
  const methods = {};
  const mc = u2();
  for (let i = 0; i < mc; i++) {
    u2(); const name = utf(u2()), desc = utf(u2());
    const ac = u2();
    for (let j = 0; j < ac; j++) {
      const an = utf(u2()), len = u4();
      if (an === "Code") methods[name + desc] = buf.subarray(p + 8, p + 8 + buf.readUInt32BE(p + 4));
      p += len;
    }
  }
  return { cp, utf, methods };
}

function ref(cls, i) {
  const r = cls.cp[i], nt = cls.cp[r.b];
  return { owner: cls.utf(cls.cp[r.a].a).split("/").pop(), name: cls.utf(nt.a), desc: cls.utf(nt.b) };
}
const argCount = (desc) => (desc.slice(1, desc.indexOf(")")).match(/\[*(L[^;]+;|[ZBCSIFJD])/g) || []).length;

export function readModel(buf) {
  const cls = parseClass(buf);
  const key = Object.keys(cls.methods).find((k) => k.startsWith("createBodyLayer"));
  if (!key) throw new Error("no createBodyLayer");
  const code = cls.methods[key];
  const stack = [], locals = [], parts = [];
  let result = null, pc = 0;
  const cst = (i) => { const c = cls.cp[i]; return c.tag === 8 ? cls.utf(c.a) : c.v; };
  while (pc < code.length) {
    const op = code[pc];
    if (op >= 0x02 && op <= 0x08) { stack.push(op - 3); pc++; continue; }
    if (op >= 0x0b && op <= 0x0d) { stack.push(op - 0x0b); pc++; continue; }
    if (op >= 0x1a && op <= 0x2d) { stack.push(locals[(op - 0x1a) % 4]); pc++; continue; }
    if (op >= 0x3b && op <= 0x4e) { locals[(op - 0x3b) % 4] = stack.pop(); pc++; continue; }
    switch (op) {
      case 0x01: stack.push(null); pc++; break;
      case 0x10: stack.push(code.readInt8(pc + 1)); pc += 2; break;
      case 0x11: stack.push(code.readInt16BE(pc + 1)); pc += 3; break;
      case 0x12: stack.push(cst(code[pc + 1])); pc += 2; break;
      case 0x13: stack.push(cst(code.readUInt16BE(pc + 1))); pc += 3; break;
      case 0x15: case 0x17: case 0x19: stack.push(locals[code[pc + 1]]); pc += 2; break;
      case 0x36: case 0x38: case 0x3a: locals[code[pc + 1]] = stack.pop(); pc += 2; break;
      case 0x57: stack.pop(); pc++; break;
      case 0x59: stack.push(stack[stack.length - 1]); pc++; break;
      case 0x76: stack.push(-stack.pop()); pc++; break;
      case 0x86: pc++; break;
      case 0xbb: stack.push({ kind: "new", cls: cls.utf(cls.cp[code.readUInt16BE(pc + 1)].a).split("/").pop() }); pc += 3; break;
      case 0xb2: { const r = ref(cls, code.readUInt16BE(pc + 1)); stack.push(r.owner === "CubeDeformation" ? { kind: "deform", inflate: 0 } : { kind: "static", ...r }); pc += 3; break; }
      case 0xc0: pc += 3; break;
      case 0xb0: result = stack.pop(); pc = code.length; break;
      case 0xb1: pc = code.length; break;
      case 0xb6: case 0xb7: case 0xb8: case 0xb9: {
        const r = ref(cls, code.readUInt16BE(pc + 1));
        const args = stack.splice(stack.length - argCount(r.desc), argCount(r.desc));
        const self = op === 0xb8 ? null : stack.pop();
        pc += op === 0xb9 ? 5 : 3;
        let ret;
        if (r.name === "<init>") {
          if (self.cls === "CubeDeformation") Object.assign(self, { kind: "deform", inflate: args[0] });
          if (self.cls === "MeshDefinition") Object.assign(self, { kind: "mesh" });
          continue;
        }
        const sig = r.owner + "." + r.desc;
        if (r.name === "getRoot" || sig === "MeshDefinition.()Lnet/minecraft/client/model/geom/builders/PartDefinition;") ret = { kind: "part", name: "root", parent: null };
        else if (false) ret = { kind: "part", name: "root", parent: null };
        else if (r.owner === "CubeListBuilder" && op === 0xb8) ret = { kind: "builder", cubes: [], uv: [0, 0], mirror: false };
        else if (r.owner === "CubeListBuilder" && r.desc.startsWith("(II)")) { self.uv = [args[0], args[1]]; ret = self; }
        else if (r.owner === "CubeListBuilder" && (r.desc.startsWith("()") || r.desc.startsWith("(Z)"))) { self.mirror = args.length ? Boolean(args[0]) : true; ret = self; }
        else if (r.owner === "CubeListBuilder" && /^\((Ljava\/lang\/String;)?FFFFFF/.test(r.desc)) {
          const nums = args.filter((a) => typeof a === "number");
          const deform = args.find((a) => a && a.kind === "deform");
          const [x, y, z, w, h, d] = nums.slice(0, 6);
          self.cubes.push({ from: [x, y, z], size: [w, h, d], uv: [...self.uv], inflate: deform ? deform.inflate : 0, mirror: self.mirror });
          ret = self;
        } else if (r.owner === "PartPose" && op === 0xb8) {
          const [x = 0, y = 0, z = 0, rx = 0, ry = 0, rz = 0] = args;
          ret = { kind: "pose", x, y, z, rx, ry, rz };
        } else if (r.owner === "PartDefinition" && r.desc.startsWith("(Ljava/lang/String;")) {
          const [name, builder, pose] = args;
          ret = { kind: "part", name, parent: self.name, pose: pose && pose.kind === "pose" ? pose : { x: 0, y: 0, z: 0, rx: 0, ry: 0, rz: 0 }, cubes: builder && builder.cubes ? builder.cubes : [] };
          parts.push(ret);
        } else if (r.owner === "LayerDefinition" && op === 0xb8) ret = { kind: "layer", texW: args[1], texH: args[2] };
        else ret = { kind: "unknown", ...r };
        if (!r.desc.endsWith(")V")) stack.push(ret);
        break;
      }
      default: throw new Error(`opcode 0x${op.toString(16)} at ${pc}`);
    }
  }
  return { texW: result?.texW, texH: result?.texH, parts: parts.map(({ kind, pose: { kind: _k, ...pose }, ...p }) => ({ ...p, pose })) };
}
