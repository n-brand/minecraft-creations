// Minimal PNG read/write (RGBA) using only node:zlib.
import zlib from "node:zlib";

export function decodePng(buf) {
  let pos = 8, w, h, depth, type, palette, trns;
  const idat = [];
  while (pos < buf.length) {
    const len = buf.readUInt32BE(pos), kind = buf.toString("latin1", pos + 4, pos + 8), d = buf.subarray(pos + 8, pos + 8 + len);
    if (kind === "IHDR") { w = d.readUInt32BE(0); h = d.readUInt32BE(4); depth = d[8]; type = d[9]; if (d[12]) throw new Error("interlaced PNG"); }
    else if (kind === "PLTE") palette = d;
    else if (kind === "tRNS") trns = d;
    else if (kind === "IDAT") idat.push(d);
    else if (kind === "IEND") break;
    pos += 12 + len;
  }
  const raw = zlib.inflateSync(Buffer.concat(idat));
  const ch = { 0: 1, 2: 3, 3: 1, 4: 2, 6: 4 }[type];
  const bpp = Math.max(1, (ch * depth) / 8), stride = Math.ceil((w * ch * depth) / 8);
  const lines = Buffer.alloc(stride * h);
  let prev = Buffer.alloc(stride);
  for (let y = 0; y < h; y++) {
    const f = raw[y * (stride + 1)], src = raw.subarray(y * (stride + 1) + 1, (y + 1) * (stride + 1)), cur = lines.subarray(y * stride, (y + 1) * stride);
    for (let i = 0; i < stride; i++) {
      const a = i >= bpp ? cur[i - bpp] : 0, b = prev[i], c = i >= bpp ? prev[i - bpp] : 0;
      let v = src[i];
      if (f === 1) v += a; else if (f === 2) v += b; else if (f === 3) v += (a + b) >> 1;
      else if (f === 4) { const p = a + b - c, pa = Math.abs(p - a), pb = Math.abs(p - b), pc = Math.abs(p - c); v += pa <= pb && pa <= pc ? a : pb <= pc ? b : c; }
      cur[i] = v & 255;
    }
    prev = cur;
  }
  const out = Buffer.alloc(w * h * 4);
  const sample = (row, i) => {
    if (depth === 8) return row[i];
    if (depth === 16) return row[i * 2];
    const per = 8 / depth, byte = row[Math.floor(i / per)], shift = 8 - depth * ((i % per) + 1);
    return (byte >> shift) & ((1 << depth) - 1);
  };
  for (let y = 0; y < h; y++) {
    const row = lines.subarray(y * stride, (y + 1) * stride);
    for (let x = 0; x < w; x++) {
      const o = (y * w + x) * 4;
      if (type === 6) for (let k = 0; k < 4; k++) out[o + k] = sample(row, x * 4 + k);
      else if (type === 2) { for (let k = 0; k < 3; k++) out[o + k] = sample(row, x * 3 + k); out[o + 3] = 255; }
      else if (type === 3) { const p = sample(row, x); out[o] = palette[p * 3]; out[o + 1] = palette[p * 3 + 1]; out[o + 2] = palette[p * 3 + 2]; out[o + 3] = trns && p < trns.length ? trns[p] : 255; }
      else { const g = sample(row, x * ch) * (depth < 8 ? 255 / ((1 << depth) - 1) : 1); out[o] = out[o + 1] = out[o + 2] = g; out[o + 3] = type === 4 ? sample(row, x * 2 + 1) : 255; }
    }
  }
  return { w, h, data: out };
}

function chunk(kind, data) {
  const len = Buffer.alloc(4); len.writeUInt32BE(data.length);
  const body = Buffer.concat([Buffer.from(kind, "latin1"), data]);
  const crc = Buffer.alloc(4); crc.writeUInt32BE(zlib.crc32(body) >>> 0);
  return Buffer.concat([len, body, crc]);
}

export function encodePng({ w, h, data }) {
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(w, 0); ihdr.writeUInt32BE(h, 4); ihdr[8] = 8; ihdr[9] = 6;
  const raw = Buffer.alloc((w * 4 + 1) * h);
  for (let y = 0; y < h; y++) data.copy(raw, y * (w * 4 + 1) + 1, y * w * 4, (y + 1) * w * 4);
  return Buffer.concat([Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]), chunk("IHDR", ihdr), chunk("IDAT", zlib.deflateSync(raw)), chunk("IEND", Buffer.alloc(0))]);
}

