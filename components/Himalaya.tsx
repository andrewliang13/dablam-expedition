'use client';
import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { film } from '@/lib/motion';
import { bakeSurface, loadKhumbu, PLACES, type Khumbu } from '@/lib/terrain';

/* Time-of-day keys, authored in sRGB: dusk (0), night (0.5), dawn (1). sunCol is linear light. */
type Key = { sun: [number, number, number]; sunCol: [number, number, number]; zen: [number, number, number]; hor: [number, number, number]; stars: number };
const KEYS: Key[] = [
  // dusk: sun setting in the west behind the camera, alpenglow on Ama Dablam's west face, slate sky ahead
  { sun: [-0.9, 0.075, 0.42], sunCol: [1.75, 0.86, 0.55], zen: [0.17, 0.23, 0.35], hor: [0.6, 0.56, 0.62], stars: 0.08 },
  // night: high moon, cold slate
  { sun: [0.28, 0.62, 0.48], sunCol: [0.3, 0.36, 0.52], zen: [0.035, 0.05, 0.085], hor: [0.13, 0.16, 0.23], stars: 1 },
  // dawn: first sun from the east, seen from Mera looking north
  { sun: [0.86, 0.075, -0.3], sunCol: [1.9, 1.12, 0.7], zen: [0.16, 0.27, 0.46], hor: [0.82, 0.66, 0.54], stars: 0 },
];
const lerp3 = (a: number[], b: number[], t: number) => a.map((v, i) => v + (b[i] - v) * t) as [number, number, number];
const lin = (c: number[]) => c.map((v) => Math.pow(v, 2.2)) as [number, number, number];
function dayKey(d: number): Key {
  const seg = d < 0.5 ? 0 : 1;
  const t = d < 0.5 ? d / 0.5 : (d - 0.5) / 0.5;
  const a = KEYS[seg], b = KEYS[seg + 1];
  const e = t * t * (3 - 2 * t);
  return { sun: lerp3(a.sun, b.sun, e), sunCol: lerp3(a.sunCol, b.sunCol, e), zen: lerp3(a.zen, b.zen, e), hor: lerp3(a.hor, b.hor, e), stars: a.stars + (b.stars - a.stars) * e };
}

type V3 = [number, number, number];
type Shot = { p: number; pos: V3; look: V3 }[];

/* Two shots joined by a cut (the canvas is hidden between them):
   A — drone over Tengboche pushing toward Ama Dablam at dusk;
   B — up the Mera glacier through the night to the summit at dawn, looking north at Everest. */
function buildShots(k: Khumbu): { a: Shot; b: Shot } {
  const ama = k.peak(PLACES.amaDablam.lat, PLACES.amaDablam.lon);
  const ev = k.peak(PLACES.everest.lat, PLACES.everest.lon);
  const mera = k.peak(PLACES.mera.lat, PLACES.mera.lon, 18);
  const ten = k.geo(PLACES.tengboche.lat, PLACES.tengboche.lon);
  const dA = new THREE.Vector2(ten.x - ama.x, ten.z - ama.z).normalize();
  const along = (d: number, alt: number): V3 => {
    const x = ama.x + dA.x * d, z = ama.z + dA.y * d;
    return [x, Math.max(k.units(alt), k.heightAt(x, z) + 8), z];
  };
  const a: Shot = [
    { p: 0, pos: along(330, 4650), look: [ama.x, ama.y - 46, ama.z] },
    { p: 0.3, pos: along(215, 5050), look: [ama.x, ama.y - 34, ama.z] },
  ];
  const dB = new THREE.Vector2(-0.62, -0.78).normalize(); // up the glacier from the north-west, past Khare
  const nearM = (d: number, alt: number): V3 => {
    const x = mera.x + dB.x * d, z = mera.z + dB.y * d;
    return [x, Math.max(k.units(alt), k.heightAt(x, z) + 6), z];
  };
  const north: V3 = [ama.x * 0.35 + ev.x * 0.65, ama.y + 20, ama.z * 0.35 + ev.z * 0.65];
  const b: Shot = [
    { p: 0.3, pos: nearM(220, 5300), look: [mera.x, mera.y + 10, mera.z] },
    { p: 0.55, pos: nearM(150, 6150), look: [mera.x, mera.y + 22, mera.z] },
    { p: 0.8, pos: nearM(28, 6420), look: [mera.x, mera.y + 4, mera.z] },
    { p: 0.92, pos: [mera.x + dB.x * 6, mera.y + 9, mera.z + dB.y * 6], look: [north[0] * 0.5 + mera.x * 0.5, mera.y + 10, north[2] * 0.5 + mera.z * 0.5] },
    { p: 1, pos: [mera.x, mera.y + 4.5, mera.z + 3], look: north },
  ];
  return { a, b };
}

function camAt(shots: { a: Shot; b: Shot }, p: number) {
  const s = p <= 0.3 ? shots.a : shots.b;
  let i = 0;
  while (i < s.length - 2 && p > s[i + 1].p) i++;
  const A = s[i], B = s[i + 1];
  const t = Math.min(1, Math.max(0, (p - A.p) / (B.p - A.p)));
  const e = t * t * (3 - 2 * t);
  return { pos: lerp3(A.pos, B.pos, e), look: lerp3(A.look, B.look, e) };
}

const terrainVert = /* glsl */ `
  uniform vec2 uSize;
  varying vec3 vPos; varying vec2 vUv;
  void main(){
    vec4 w = modelMatrix * vec4(position, 1.0);
    vPos = w.xyz;
    vUv = vec2(w.x / uSize.x + 0.5, w.z / uSize.y + 0.5);
    gl_Position = projectionMatrix * viewMatrix * w;
  }`;

const terrainFrag = /* glsl */ `
  precision highp float;
  uniform sampler2D uHeight; uniform sampler2D uSurf; uniform vec2 uSize; uniform float uMpp;
  uniform vec3 uSun; uniform vec3 uSunCol; uniform vec3 uZen; uniform vec3 uHor; uniform vec3 uCam;
  varying vec3 vPos; varying vec2 vUv;

  float hash(vec2 p){ return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
  float vnoise(vec2 p){
    vec2 i = floor(p), f = fract(p); f = f * f * (3.0 - 2.0 * f);
    return mix(mix(hash(i), hash(i + vec2(1.0, 0.0)), f.x), mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), f.x), f.y);
  }
  float fbm(vec2 p){ float s = 0.0, a = 0.5; for (int i = 0; i < 5; i++){ s += a * vnoise(p); p = p * 2.03 + 17.1; a *= 0.5; } return s; }

  float hAt(vec2 xz){ return texture2D(uHeight, vec2(xz.x / uSize.x + 0.5, xz.y / uSize.y + 0.5)).r; }

  // soft shadows cast by real ridgelines, marched through the height field toward the sun
  float shadow(vec3 p, vec3 L){
    if (L.y < 0.0) return 0.0;
    float res = 1.0, t = 1.6;
    for (int i = 0; i < SHADOW_STEPS; i++){
      vec3 q = p + L * t;
      float d = q.y - hAt(q.xz);
      res = min(res, 10.0 * d / t);
      if (res < 0.0) break;
      t *= 1.22;
      if (t > 420.0) break;
    }
    return clamp(res, 0.0, 1.0);
  }

  void main(){
    vec4 s = texture2D(uSurf, vUv);
    vec3 n = normalize(s.xyz * 2.0 - 1.0);
    // micro relief so close slopes do not read as smooth clay
    vec2 e = vec2(0.35, 0.0);
    float b0 = fbm(vPos.xz * 0.9);
    vec2 g = vec2(fbm((vPos.xz + e.xy) * 0.9) - b0, fbm((vPos.xz + e.yx) * 0.9) - b0) / e.x;
    n = normalize(n + vec3(-g.x, 0.0, -g.y) * 0.07);
    float cav = s.a * 2.0 - 1.0;              // + ridge, - gully
    float m = vPos.y * uMpp + 1800.0;         // metres above sea level
    float slope = 1.0 - n.y;
    vec3 L = normalize(uSun);
    vec3 V = normalize(uCam - vPos);

    float big = fbm(vPos.xz * 0.035);
    float fine = fbm(vPos.xz * 0.6 + n.xz * 4.0);
    // streaks running down the fall line: flutings on the faces
    vec2 fall = normalize(n.xz + 1e-4);
    float flute = fbm(vec2(dot(vPos.xz, vec2(-fall.y, fall.x)) * 1.6, dot(vPos.xz, fall) * 0.12));

    // snow line ~5,000 m, lower on north-facing slopes, broken up by terrain noise
    float snowLine = 5050.0 + (big - 0.5) * 600.0 + n.z * 320.0 - cav * 140.0;
    float alt = smoothstep(snowLine - 120.0, snowLine + 160.0, m + (fine - 0.5) * 220.0);
    float hold = 1.0 - smoothstep(0.5 + flute * 0.28, 0.82 + flute * 0.1, slope);
    float snow = alt * hold;
    // glaciers fill the high, gentle, concave ground
    float glacier = smoothstep(4500.0, 4900.0, m) * (1.0 - smoothstep(0.12, 0.3, slope)) * smoothstep(0.15, -0.35, cav);
    snow = max(snow, glacier);
    // above ~5,700 m almost everything that is not a rock wall holds snow
    snow = max(snow, smoothstep(5500.0, 5900.0, m) * (1.0 - smoothstep(0.72, 0.9, slope)));
    // seasonal dusting above 4,400 m on flats
    snow = max(snow, smoothstep(4400.0, 4800.0, m) * (1.0 - smoothstep(0.08, 0.2, slope)) * smoothstep(0.45, 0.7, fine) * 0.8);

    vec3 forest = vec3(0.13, 0.16, 0.1);
    vec3 scrub = vec3(0.36, 0.31, 0.22);
    vec3 rock = mix(vec3(0.16, 0.15, 0.15), vec3(0.33, 0.31, 0.29), fine);
    rock = mix(rock, vec3(0.24, 0.2, 0.17), smoothstep(0.55, 0.8, big) * 0.6);
    vec3 ground = mix(forest, scrub, smoothstep(3300.0, 3900.0, m + (big - 0.5) * 400.0));
    ground = mix(ground, rock, max(smoothstep(4100.0, 4800.0, m), smoothstep(0.45, 0.65, slope)));
    vec3 snowC = mix(vec3(0.8, 0.85, 0.93), vec3(0.95, 0.96, 0.99), fine);
    // wind-carved sastrugi: fine bands across the prevailing westerly, broken up by noise
    float dist0 = length(uCam - vPos);
    float near = 1.0 - smoothstep(40.0, 160.0, dist0);
    float sast = sin(vPos.x * 5.5 + vPos.z * 1.7 + fbm(vPos.xz * 0.8) * 6.0);
    snowC *= 1.0 - near * 0.07 * smoothstep(0.2, 1.0, sast);
    // crevasses: thin dark lines across the fall line on moderately steep glacier ice
    float across = dot(vPos.xz, fall) * 2.2 + fbm(vPos.xz * 0.25) * 5.0;
    float crev = smoothstep(0.93, 0.995, abs(sin(across))) * smoothstep(0.12, 0.22, slope) * (1.0 - smoothstep(0.38, 0.5, slope));
    crev *= smoothstep(0.45, 0.6, fbm(vPos.xz * 0.12 + 3.0)) * smoothstep(4900.0, 5300.0, m);
    snowC = mix(snowC, vec3(0.32, 0.4, 0.52), crev * 0.75 * near);
    vec3 albedo = pow(mix(ground, snowC, snow), vec3(2.2));

    float sh = shadow(vPos + n * 1.2 + vec3(0.0, 0.6, 0.0), L);
    float diff = max(dot(n, L), 0.0) * sh;
    float ao = clamp(0.62 + cav * 0.45, 0.25, 1.0);
    vec3 skyL = mix(uHor, uZen, 0.5 + 0.5 * n.y);
    // snow scatters light into its own shadows, so shadowed snow stays luminous instead of smearing to black
    vec3 col = albedo * (uSunCol * diff * 1.55 + skyL * (0.72 + snow * 0.55) * ao + uSunCol * snow * 0.08 * (1.0 - sh));
    vec3 H = normalize(L + V);
    col += snow * uSunCol * pow(max(dot(n, H), 0.0), 40.0) * 0.22 * sh;

    // aerial perspective: blue distance, sun-side warmth, valley haze
    float dist = length(uCam - vPos);
    float thin = 1.0 - smoothstep(110.0, 160.0, uCam.y) * 0.5;   // the air clears with altitude
    float fog = 1.0 - exp(-dist * 0.00135 * thin);
    float haze = exp(-max(m - 2600.0, 0.0) / 900.0) * (1.0 - exp(-dist * 0.01)) * 0.55;
    fog = clamp(fog + haze, 0.0, 0.96);
    float sunAmt = pow(max(dot(-V, L), 0.0), 5.0);
    vec3 fogC = mix(mix(uZen, uHor, 0.5), uSunCol * 0.45, sunAmt * 0.35);
    float edge = smoothstep(0.0, 0.08, min(min(vUv.x, 1.0 - vUv.x), min(vUv.y, 1.0 - vUv.y)));
    fog = mix(1.0, fog, edge);
    gl_FragColor = vec4(mix(col, fogC, fog), 1.0);
    #include <tonemapping_fragment>
    #include <colorspace_fragment>
  }`;

const skyVert = /* glsl */ `
  varying vec3 vDir;
  void main(){ vDir = normalize(position); gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }`;
const skyFrag = /* glsl */ `
  uniform vec3 uSun; uniform vec3 uSunCol; uniform vec3 uZen; uniform vec3 uHor;
  varying vec3 vDir;
  void main(){
    vec3 d = normalize(vDir);
    float h = max(d.y, 0.0);
    vec3 col = mix(uHor, uZen, smoothstep(0.0, 0.38, h));
    col = mix(col, uZen * 0.55, smoothstep(0.35, 1.0, h));
    float s = max(dot(d, normalize(uSun)), 0.0);
    col += uSunCol * (pow(s, 1600.0) * 2.5 + pow(s, 22.0) * 0.18 + pow(s, 4.0) * 0.06) * (1.0 - smoothstep(0.0, 0.5, h) * 0.7);
    gl_FragColor = vec4(col, 1.0);
    #include <tonemapping_fragment>
    #include <colorspace_fragment>
  }`;

const snowVert = /* glsl */ `
  uniform float uTime; uniform float uWind; uniform vec3 uCam; uniform float uPx;
  attribute float aSeed; varying float vA;
  void main(){
    vec3 box = vec3(60.0, 36.0, 60.0);
    vec3 p = position;
    p.x += uTime * (0.8 + uWind * 9.0) + sin(uTime * 0.7 + aSeed * 6.28) * 1.0;
    p.y -= uTime * (1.2 + aSeed * 0.8);
    p.z += uTime * uWind * 2.5;
    p = mod(p - uCam + box * 0.5, box) - box * 0.5 + uCam;
    vec4 mv = viewMatrix * vec4(p, 1.0);
    gl_PointSize = uPx * (0.6 + aSeed) * (30.0 / -mv.z);
    vA = smoothstep(45.0, 4.0, -mv.z) * 0.8;
    gl_Position = projectionMatrix * mv;
  }`;
const snowFrag = /* glsl */ `
  varying float vA;
  void main(){ float d = length(gl_PointCoord - 0.5); if (d > 0.5) discard; gl_FragColor = vec4(vec3(0.93, 0.95, 0.98), vA * smoothstep(0.5, 0.0, d)); }`;

const starVert = /* glsl */ `
  uniform float uPx; attribute float aSeed; varying float vS;
  void main(){ vS = aSeed; gl_PointSize = uPx * (0.8 + aSeed * 1.5); gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }`;
const starFrag = /* glsl */ `
  uniform float uStars; uniform float uTime; varying float vS;
  void main(){ float d = length(gl_PointCoord - 0.5); if (d > 0.5) discard; float tw = 0.65 + 0.35 * sin(uTime * (1.0 + vS * 3.0) + vS * 40.0); gl_FragColor = vec4(vec3(0.9, 0.92, 1.0), uStars * tw * smoothstep(0.5, 0.0, d)); }`;

export default function Himalaya() {
  const host = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = host.current;
    if (!el) return;
    let disposed = false;
    let cleanup = () => {};

    const start = async () => {
      let k: Khumbu;
      try {
        k = await loadKhumbu();
      } catch {
        el.classList.add('himalaya--fallback');
        return;
      }
      if (disposed) return;
      let renderer: THREE.WebGLRenderer;
      try {
        renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: 'high-performance' });
      } catch {
        el.classList.add('himalaya--fallback');
        return;
      }
      const small = window.innerWidth < 760;
      const dpr = Math.min(window.devicePixelRatio, small ? 1.3 : 1.5);
      renderer.setPixelRatio(dpr);
      renderer.setSize(window.innerWidth, window.innerHeight);
      renderer.toneMapping = THREE.ACESFilmicToneMapping;
      renderer.toneMappingExposure = small ? 1.18 : 1.05;
      renderer.outputColorSpace = THREE.SRGBColorSpace;
      el.appendChild(renderer.domElement);

      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(small ? 56 : 44, window.innerWidth / window.innerHeight, 0.3, 4000);
      const shots = buildShots(k);

      const half = new Uint16Array(k.heights.length);
      for (let i = 0; i < half.length; i++) half[i] = THREE.DataUtils.toHalfFloat(k.heights[i]);
      const heightTex = new THREE.DataTexture(half, k.w, k.h, THREE.RedFormat, THREE.HalfFloatType);
      heightTex.magFilter = THREE.LinearFilter;
      heightTex.minFilter = THREE.LinearFilter;
      heightTex.needsUpdate = true;
      const surfTex = new THREE.DataTexture(bakeSurface(k), k.w, k.h, THREE.RGBAFormat, THREE.UnsignedByteType);
      surfTex.magFilter = THREE.LinearFilter;
      surfTex.minFilter = THREE.LinearMipmapLinearFilter;
      surfTex.generateMipmaps = true;
      surfTex.anisotropy = renderer.capabilities.getMaxAnisotropy();
      surfTex.needsUpdate = true;

      const shared = {
        uSun: { value: new THREE.Vector3() },
        uSunCol: { value: new THREE.Vector3() },
        uZen: { value: new THREE.Vector3() },
        uHor: { value: new THREE.Vector3() },
        uCam: { value: new THREE.Vector3() },
      };

      // terrain mesh, one vertex every `step` samples; shading reads the full-resolution textures
      const step = small ? 3 : 2;
      const segX = Math.floor((k.w - 1) / step), segZ = Math.floor((k.h - 1) / step);
      const geo = new THREE.PlaneGeometry(k.w - 1, k.h - 1, segX, segZ);
      geo.rotateX(-Math.PI / 2);
      const pos = geo.attributes.position as THREE.BufferAttribute;
      for (let i = 0; i < pos.count; i++) {
        const x = pos.getX(i), z = pos.getZ(i);
        const edge = Math.min(x + k.w / 2, k.w / 2 - x, z + k.h / 2, k.h / 2 - z);
        pos.setY(i, k.heightAt(x, z) - (edge < 2 ? 40 : 0));
      }
      geo.computeBoundingSphere();
      const terrainMat = new THREE.ShaderMaterial({
        uniforms: { ...shared, uHeight: { value: heightTex }, uSurf: { value: surfTex }, uSize: { value: new THREE.Vector2(k.w, k.h) }, uMpp: { value: k.mpp } },
        vertexShader: terrainVert,
        fragmentShader: terrainFrag,
        defines: { SHADOW_STEPS: small ? 18 : 30 },
      });
      const terrain = new THREE.Mesh(geo, terrainMat);
      scene.add(terrain);

      const sky = new THREE.Mesh(
        new THREE.SphereGeometry(3000, 48, 24),
        new THREE.ShaderMaterial({ uniforms: shared, vertexShader: skyVert, fragmentShader: skyFrag, side: THREE.BackSide, depthWrite: false })
      );
      sky.renderOrder = -1;
      scene.add(sky);

      const STARS = 1600;
      const sp = new Float32Array(STARS * 3), ss = new Float32Array(STARS);
      for (let i = 0; i < STARS; i++) {
        const th = Math.random() * Math.PI * 2, ph = Math.acos(Math.random() * 0.92);
        sp.set([Math.sin(ph) * Math.cos(th) * 2600, Math.cos(ph) * 2600 + 60, Math.sin(ph) * Math.sin(th) * 2600], i * 3);
        ss[i] = Math.random();
      }
      const sg = new THREE.BufferGeometry();
      sg.setAttribute('position', new THREE.BufferAttribute(sp, 3));
      sg.setAttribute('aSeed', new THREE.BufferAttribute(ss, 1));
      const starU = { uStars: { value: 0 }, uTime: { value: 0 }, uPx: { value: dpr } };
      const stars = new THREE.Points(sg, new THREE.ShaderMaterial({ uniforms: starU, vertexShader: starVert, fragmentShader: starFrag, transparent: true, depthWrite: false }));
      scene.add(stars);

      const FLAKES = small ? 700 : 1800;
      const fp = new Float32Array(FLAKES * 3), fs = new Float32Array(FLAKES);
      for (let i = 0; i < FLAKES; i++) {
        fp.set([(Math.random() - 0.5) * 60, (Math.random() - 0.5) * 36, (Math.random() - 0.5) * 60], i * 3);
        fs[i] = Math.random();
      }
      const fg = new THREE.BufferGeometry();
      fg.setAttribute('position', new THREE.BufferAttribute(fp, 3));
      fg.setAttribute('aSeed', new THREE.BufferAttribute(fs, 1));
      const snowU = { uTime: { value: 0 }, uWind: { value: 0 }, uCam: shared.uCam, uPx: { value: dpr * 2 } };
      const snow = new THREE.Points(fg, new THREE.ShaderMaterial({ uniforms: snowU, vertexShader: snowVert, fragmentShader: snowFrag, transparent: true, depthWrite: false }));
      snow.frustumCulled = false;
      scene.add(snow);

      const pointer = { x: 0, y: 0, sx: 0, sy: 0 };
      const onMove = (e: PointerEvent) => {
        pointer.x = e.clientX / window.innerWidth - 0.5;
        pointer.y = e.clientY / window.innerHeight - 0.5;
      };
      const onResize = () => {
        renderer.setSize(window.innerWidth, window.innerHeight);
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
      };
      window.addEventListener('pointermove', onMove, { passive: true });
      window.addEventListener('resize', onResize);

      const smoothP = { p: film.p, day: film.day, wind: film.wind };
      const look = new THREE.Vector3();
      const clock = new THREE.Clock();
      let raf = 0;
      let shown = 0;

      const frame = () => {
        raf = requestAnimationFrame(frame);
        const dt = Math.min(clock.getDelta(), 0.05);
        shown += ((film.visible ? 1 : 0) - shown) * Math.min(1, dt * 5);
        el.style.opacity = String(shown);
        if (shown < 0.01) return;

        const kk = 1 - Math.pow(0.002, dt);
        // a cut, not a flight, between the two shots
        if (film.p > 0.3 !== smoothP.p > 0.3) smoothP.p = film.p;
        smoothP.p += (film.p - smoothP.p) * kk;
        smoothP.day += (film.day - smoothP.day) * kk;
        smoothP.wind += (film.wind - smoothP.wind) * kk;

        const t = clock.elapsedTime;
        const { pos: cp, look: lp } = camAt(shots, smoothP.p);
        pointer.sx += (pointer.x - pointer.sx) * dt * 2;
        pointer.sy += (pointer.y - pointer.sy) * dt * 2;
        const x = cp[0] + pointer.sx * 3;
        const z = cp[2];
        const bob = Math.sin(t * 0.35) * 0.25;
        camera.position.set(x, Math.max(cp[1] + bob - pointer.sy * 1.5, k.heightAt(x, z) + 2.5), z);
        look.set(lp[0] + pointer.sx * 10, lp[1] - pointer.sy * 5, lp[2]);
        camera.lookAt(look);

        const key = dayKey(smoothP.day);
        shared.uSun.value.set(...key.sun).normalize();
        shared.uSunCol.value.set(...key.sunCol);
        shared.uZen.value.set(...lin(key.zen));
        shared.uHor.value.set(...lin(key.hor));
        shared.uCam.value.copy(camera.position);
        sky.position.copy(camera.position);
        stars.position.copy(camera.position);
        starU.uStars.value = key.stars;
        starU.uTime.value = t;
        snowU.uTime.value = t;
        snowU.uWind.value = smoothP.wind;

        renderer.render(scene, camera);
      };
      frame();
      el.dataset.ready = 'true';
      if (process.env.NODE_ENV !== 'production') Object.assign(window, { __cam: camera, __film: film, __smooth: smoothP });

      cleanup = () => {
        cancelAnimationFrame(raf);
        window.removeEventListener('pointermove', onMove);
        window.removeEventListener('resize', onResize);
        renderer.dispose();
        geo.dispose();
        sg.dispose();
        fg.dispose();
        heightTex.dispose();
        surfTex.dispose();
        renderer.domElement.remove();
      };
    };
    start();
    return () => {
      disposed = true;
      cleanup();
    };
  }, []);

  return <div ref={host} className="himalaya" aria-hidden="true" />;
}
