// Real Khumbu elevation (AWS Terrain Tiles, Terrarium z12), cropped to 86.70–87.02°E, 27.64–28.01°N.
// One scene unit = one sample (~33.8 m). Heights are in the same units above BASE_M.

export const BASE_M = 1800;

export type Khumbu = {
  w: number;
  h: number;
  mpp: number;
  /** heights in scene units, row 0 = north */
  heights: Float32Array;
  heightAt: (x: number, z: number) => number;
  geo: (lat: number, lon: number) => { x: number; z: number };
  units: (metres: number) => number;
  /** snaps to the highest sample within r samples of (lat, lon) */
  peak: (lat: number, lon: number, r?: number) => { x: number; y: number; z: number };
};

type Meta = { w: number; h: number; metresPerPixel: number; west: number; east: number; north: number; south: number };

let cache: Promise<Khumbu> | null = null;

export function loadKhumbu(): Promise<Khumbu> {
  if (cache) return cache;
  cache = (async () => {
    const [meta, buf] = await Promise.all([
      fetch('/terrain/khumbu.json').then((r) => r.json() as Promise<Meta>),
      fetch('/terrain/khumbu.bin').then((r) => {
        if (!r.ok) throw new Error('terrain ' + r.status);
        return r.arrayBuffer();
      }),
    ]);
    const { w, h, metresPerPixel: mpp } = meta;
    const raw = new Int16Array(buf);
    const heights = new Float32Array(w * h);
    for (let i = 0; i < raw.length; i++) heights[i] = (raw[i] - BASE_M) / mpp;

    const sample = (i: number, j: number) => heights[Math.min(h - 1, Math.max(0, j)) * w + Math.min(w - 1, Math.max(0, i))];
    const heightAt = (x: number, z: number) => {
      const fx = x + w / 2, fz = z + h / 2;
      const i = Math.floor(fx), j = Math.floor(fz);
      const tx = fx - i, tz = fz - j;
      const a = sample(i, j), b = sample(i + 1, j), c = sample(i, j + 1), d = sample(i + 1, j + 1);
      return (a * (1 - tx) + b * tx) * (1 - tz) + (c * (1 - tx) + d * tx) * tz;
    };
    const merc = (lat: number) => Math.log(Math.tan(Math.PI / 4 + (lat * Math.PI) / 360));
    const geo = (lat: number, lon: number) => ({
      x: ((lon - meta.west) / (meta.east - meta.west)) * w - w / 2,
      z: ((merc(meta.north) - merc(lat)) / (merc(meta.north) - merc(meta.south))) * h - h / 2,
    });
    const units = (m: number) => (m - BASE_M) / mpp;
    const peak = (lat: number, lon: number, r = 14) => {
      const g = geo(lat, lon);
      const ci = Math.round(g.x + w / 2), cj = Math.round(g.z + h / 2);
      let best = -1e9, bi = ci, bj = cj;
      for (let j = cj - r; j <= cj + r; j++)
        for (let i = ci - r; i <= ci + r; i++) {
          const v = sample(i, j);
          if (v > best) { best = v; bi = i; bj = j; }
        }
      return { x: bi - w / 2, y: best, z: bj - h / 2 };
    };
    return { w, h, mpp, heights, heightAt, geo, units, peak };
  })();
  return cache;
}

/** Normals (rgb) + ridge/valley cavity (a) at full resolution, packed for an RGBA8 texture. */
export function bakeSurface(k: Khumbu) {
  const { w, h, heights } = k;
  const out = new Uint8Array(w * h * 4);
  const at = (i: number, j: number) => heights[Math.min(h - 1, Math.max(0, j)) * w + Math.min(w - 1, Math.max(0, i))];
  const R = 8;
  const tmp = new Float32Array(w * h), blur = new Float32Array(w * h);
  for (let j = 0; j < h; j++) {
    let s = 0;
    for (let i = -R; i <= R; i++) s += at(i, j);
    for (let i = 0; i < w; i++) {
      tmp[j * w + i] = s / (2 * R + 1);
      s += at(i + R + 1, j) - at(i - R, j);
    }
  }
  const tAt = (i: number, j: number) => tmp[Math.min(h - 1, Math.max(0, j)) * w + i];
  for (let i = 0; i < w; i++) {
    let s = 0;
    for (let j = -R; j <= R; j++) s += tAt(i, j);
    for (let j = 0; j < h; j++) {
      blur[j * w + i] = s / (2 * R + 1);
      s += tAt(i, j + R + 1) - tAt(i, j - R);
    }
  }
  for (let j = 0; j < h; j++)
    for (let i = 0; i < w; i++) {
      const dx = (at(i + 1, j) - at(i - 1, j)) / 2;
      const dz = (at(i, j + 1) - at(i, j - 1)) / 2;
      let nx = -dx, ny = 1, nz = -dz;
      const l = Math.hypot(nx, ny, nz);
      nx /= l; ny /= l; nz /= l;
      const cav = Math.max(-1, Math.min(1, (heights[j * w + i] - blur[j * w + i]) / 6));
      const o = (j * w + i) * 4;
      out[o] = (nx * 0.5 + 0.5) * 255;
      out[o + 1] = (ny * 0.5 + 0.5) * 255;
      out[o + 2] = (nz * 0.5 + 0.5) * 255;
      out[o + 3] = (cav * 0.5 + 0.5) * 255;
    }
  return out;
}

export const PLACES = {
  amaDablam: { lat: 27.8617, lon: 86.8614 },
  everest: { lat: 27.9881, lon: 86.925 },
  mera: { lat: 27.7066, lon: 86.8737 },
  tengboche: { lat: 27.8362, lon: 86.7646 },
};
