// Crucible site: one WebGL renderer draws every 3D figure into its own panel (scissor regions), with HTML labels
// projected on top so text stays crisp in the page's fonts. Each figure is a View built from a small spec.
import * as THREE from 'three';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';

export { THREE };

export const PAL = {
  cardinal: 0x8c1515, bright: 0xb1040e, ember: 0xc8473f, blush: 0xf2dcdc,
  ink: 0x2e2d29, grey: 0x53565a, stone: 0x8a8380, rule: 0xd6d1cf, mist: 0xebe7e5,
  fog: 0xf6f4f3, white: 0xffffff, pass: 0x3f7d5c, warn: 0xb07d2b,
};

const REDUCED = matchMedia('(prefers-reduced-motion: reduce)').matches;
const MOBILE = matchMedia('(max-width: 720px)').matches;
export const ENV = { REDUCED, MOBILE };

// ---------------------------------------------------------------------------------------------------------- textures
let dotTex = null;
export function dotTexture() {
  if (dotTex) return dotTex;
  const c = document.createElement('canvas'); c.width = c.height = 64;
  const g = c.getContext('2d');
  const grd = g.createRadialGradient(32, 32, 0, 32, 32, 30);
  grd.addColorStop(0, 'rgba(255,255,255,1)'); grd.addColorStop(0.55, 'rgba(255,255,255,1)'); grd.addColorStop(1, 'rgba(255,255,255,0)');
  g.fillStyle = grd; g.beginPath(); g.arc(32, 32, 30, 0, Math.PI * 2); g.fill();
  dotTex = new THREE.CanvasTexture(c); dotTex.colorSpace = THREE.SRGBColorSpace;
  return dotTex;
}

// --------------------------------------------------------------------------------------------------------- materials
const matCache = new Map();
export function mat(kind = 'clay', color) {
  const key = kind + ':' + (color ?? '');
  if (matCache.has(key)) return matCache.get(key);
  let m;
  switch (kind) {
    case 'clay': m = new THREE.MeshStandardMaterial({ color: color ?? 0xffffff, roughness: 0.86, metalness: 0.0 }); break;
    case 'gloss': m = new THREE.MeshStandardMaterial({ color: color ?? PAL.cardinal, roughness: 0.32, metalness: 0.08 }); break;
    case 'glass': m = new THREE.MeshStandardMaterial({ color: color ?? 0xffffff, roughness: 0.15, metalness: 0, transparent: true, opacity: 0.16, depthWrite: false }); break;
    case 'flat': m = new THREE.MeshBasicMaterial({ color: color ?? PAL.cardinal }); break;
    case 'flatT': m = new THREE.MeshBasicMaterial({ color: color ?? PAL.cardinal, transparent: true, opacity: 0.35, depthWrite: false }); break;
    case 'line': m = new THREE.LineBasicMaterial({ color: color ?? PAL.rule }); break;
    case 'lineT': m = new THREE.LineBasicMaterial({ color: color ?? PAL.rule, transparent: true, opacity: 0.5 }); break;
    case 'dash': m = new THREE.LineDashedMaterial({ color: color ?? PAL.stone, dashSize: 0.12, gapSize: 0.1 }); break;
    case 'shadow': m = new THREE.ShadowMaterial({ opacity: 0.09 }); break;
    default: m = new THREE.MeshStandardMaterial({ color: color ?? 0xffffff });
  }
  matCache.set(key, m);
  return m;
}
export function freshMat(kind, color, extra = {}) {
  const base = mat(kind, color).clone();
  Object.assign(base, extra);
  return base;
}

// -------------------------------------------------------------------------------------------------------- geometry
export function edges(mesh, color = PAL.rule, threshold = 20) {
  const l = new THREE.LineSegments(new THREE.EdgesGeometry(mesh.geometry, threshold), mat('line', color));
  l.raycast = () => {};
  mesh.add(l);
  return l;
}

export function block(w, h, d, { color, kind = 'clay', edge = PAL.rule, y0 = true, radius = 0 } = {}) {
  const g = new THREE.BoxGeometry(w, h, d);
  if (y0) g.translate(0, h / 2, 0);
  const m = new THREE.Mesh(g, kind === 'clay' && color === undefined ? mat('clay') : mat(kind, color));
  m.castShadow = true; m.receiveShadow = true;
  if (edge !== null) edges(m, edge);
  return m;
}

export function cyl(r, h, { color, kind = 'clay', edge = PAL.rule, seg = 40, y0 = true, open = false } = {}) {
  const g = new THREE.CylinderGeometry(r, r, h, seg, 1, open);
  if (y0) g.translate(0, h / 2, 0);
  const m = new THREE.Mesh(g, mat(kind, color));
  m.castShadow = true; m.receiveShadow = true;
  if (edge !== null) edges(m, edge, 30);
  return m;
}

export function sphere(r, { color = PAL.cardinal, kind = 'gloss', seg = 24 } = {}) {
  const m = new THREE.Mesh(new THREE.SphereGeometry(r, seg, Math.max(8, seg * 0.6)), mat(kind, color));
  m.castShadow = true;
  return m;
}

export function line(points, color = PAL.rule, kind = 'line') {
  const g = new THREE.BufferGeometry().setFromPoints(points.map(p => (p.isVector3 ? p : new THREE.Vector3(...p))));
  const l = new THREE.Line(g, mat(kind, color));
  if (kind === 'dash') l.computeLineDistances();
  return l;
}

export function tube(curve, r = 0.02, color = PAL.rule, kind = 'clay', seg = 64) {
  const m = new THREE.Mesh(new THREE.TubeGeometry(curve, seg, r, 8, false), mat(kind, color));
  m.castShadow = false;
  return m;
}

export function arc(a, b, lift = 1, mid = null) {
  const A = a.isVector3 ? a : new THREE.Vector3(...a);
  const B = b.isVector3 ? b : new THREE.Vector3(...b);
  const M2 = mid ? (mid.isVector3 ? mid : new THREE.Vector3(...mid)) : A.clone().add(B).multiplyScalar(0.5).add(new THREE.Vector3(0, lift, 0));
  return new THREE.QuadraticBezierCurve3(A, M2, B);
}

export function points(positions, { color = PAL.cardinal, size = 3, opacity = 1, colors = null } = {}) {
  const g = new THREE.BufferGeometry();
  g.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
  if (colors) g.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));
  const m = new THREE.PointsMaterial({
    size: size * (MOBILE ? 0.85 : 1), sizeAttenuation: false, map: dotTexture(), transparent: true, opacity,
    color: colors ? 0xffffff : color, vertexColors: !!colors, depthWrite: false, alphaTest: 0.05,
  });
  const p = new THREE.Points(g, m);
  p.raycast = () => {};
  return p;
}

export function dotGrid(w, d, step = 0.25, { color = PAL.rule, size = 2, y = 0 } = {}) {
  const pos = [];
  for (let x = -w / 2; x <= w / 2 + 1e-6; x += step) for (let z = -d / 2; z <= d / 2 + 1e-6; z += step) pos.push(x, y, z);
  return points(pos, { color, size, opacity: 0.9 });
}

export function fibSphere(n, r) {
  const pos = []; const g = Math.PI * (3 - Math.sqrt(5));
  for (let i = 0; i < n; i++) {
    const y = 1 - (i / (n - 1)) * 2; const rr = Math.sqrt(1 - y * y); const th = g * i;
    pos.push(Math.cos(th) * rr * r, y * r, Math.sin(th) * rr * r);
  }
  return pos;
}

// A stream of packets travelling along a curve (instanced spheres).
export class Flow {
  constructor(curve, { count = 6, speed = 0.18, r = 0.05, color = PAL.cardinal, kind = 'gloss', offset = 0 } = {}) {
    this.curve = curve; this.count = count; this.speed = speed; this.offset = offset; this.on = 1; this.target = 1;
    this.mesh = new THREE.InstancedMesh(new THREE.SphereGeometry(r, 14, 10), mat(kind, color), count);
    this.mesh.castShadow = false; this.mesh.frustumCulled = false;
    this._m = new THREE.Matrix4(); this._p = new THREE.Vector3(); this._s = new THREE.Vector3();
    this._q = new THREE.Quaternion();
    this.update(0);
  }
  update(t, dt = 0.016) {
    this.on += (this.target - this.on) * Math.min(1, dt * 4);
    for (let i = 0; i < this.count; i++) {
      const u = (((t * this.speed + i / this.count + this.offset) % 1) + 1) % 1;
      this.curve.getPointAt(u, this._p);
      const fade = Math.sin(Math.PI * u);
      const s = Math.max(0.0001, Math.min(1, fade * 2.2) * this.on);
      this._s.set(s, s, s);
      this._m.compose(this._p, this._q, this._s);
      this.mesh.setMatrixAt(i, this._m);
    }
    this.mesh.instanceMatrix.needsUpdate = true;
  }
}

// ----------------------------------------------------------------------------------------------------------- tweens
const ease = { inOut: t => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2), out: t => 1 - Math.pow(1 - t, 3) };
export class Tweens {
  constructor() { this.list = []; }
  to(obj, key, to, dur = 0.8, kind = 'inOut') {
    const cur = obj[key];
    this.list = this.list.filter(tw => !(tw.obj === obj && tw.key === key));
    if (cur && cur.isVector3) this.list.push({ obj, key, from: cur.clone(), to: to.isVector3 ? to.clone() : new THREE.Vector3(...to), t: 0, dur, e: ease[kind], vec: true });
    else if (cur && cur.isEuler) this.list.push({ obj, key, from: new THREE.Vector3(cur.x, cur.y, cur.z), to: to.isVector3 ? to.clone() : new THREE.Vector3(...to), t: 0, dur, e: ease[kind], eul: true, _v: new THREE.Vector3() });
    else if (cur && cur.isColor) this.list.push({ obj, key, from: cur.clone(), to: new THREE.Color(to), t: 0, dur, e: ease[kind], col: true });
    else this.list.push({ obj, key, from: cur, to, t: 0, dur, e: ease[kind] });
  }
  step(dt) {
    for (const tw of this.list) {
      tw.t = Math.min(1, tw.t + dt / tw.dur);
      const k = tw.e(tw.t);
      if (tw.vec) tw.obj[tw.key].lerpVectors(tw.from, tw.to, k);
      else if (tw.eul) { tw._v.lerpVectors(tw.from, tw.to, k); tw.obj[tw.key].set(tw._v.x, tw._v.y, tw._v.z); }
      else if (tw.col) tw.obj[tw.key].copy(tw.from).lerp(tw.to, k);
      else tw.obj[tw.key] = tw.from + (tw.to - tw.from) * k;
    }
    this.list = this.list.filter(tw => tw.t < 1);
  }
}

// ----------------------------------------------------------------------------------------------------------- labels
class Labels {
  constructor(view, overlay) {
    this.view = view; this.items = [];
    this.layer = document.createElement('div');
    this.layer.className = 'v-labels';
    overlay.appendChild(this.layer);
    this._v = new THREE.Vector3();
  }
  add(text, anchor, { cls = '', dx = 0, dy = 0, html = false, align = 'center' } = {}) {
    const el = document.createElement('div');
    el.className = 'v-label ' + cls + ' a-' + align;
    if (html) el.innerHTML = text; else el.textContent = text;
    this.layer.appendChild(el);
    const item = { el, anchor, dx, dy, opacity: 1, show: true };
    this.items.push(item);
    return item;
  }
  sync(rect, top, bottom, cam) {
    const L = this.layer.style;
    L.left = rect.left + 'px'; L.top = rect.top + 'px'; L.width = rect.width + 'px'; L.height = rect.height + 'px';
    L.clipPath = `inset(${Math.max(0, top - rect.top)}px 0 ${Math.max(0, rect.bottom - bottom)}px 0)`;
    for (const it of this.items) {
      const a = it.anchor;
      if (a.isObject3D) a.getWorldPosition(this._v); else this._v.copy(a);
      this._v.project(cam);
      const x = (this._v.x * 0.5 + 0.5) * rect.width + it.dx;
      const y = (-this._v.y * 0.5 + 0.5) * rect.height + it.dy;
      const vis = it.show && this._v.z < 1 && it.opacity > 0.01;
      it.el.style.transform = `translate3d(${x.toFixed(1)}px, ${y.toFixed(1)}px, 0)`;
      it.el.style.opacity = vis ? it.opacity : 0;
    }
  }
  hide(on) { this.layer.style.display = on ? 'none' : ''; }
}

// ------------------------------------------------------------------------------------------------------------ stage
export class Stage {
  constructor({ clipEl = null } = {}) {
    this.canvas = document.createElement('canvas');
    this.canvas.className = 'stage-canvas';
    document.body.appendChild(this.canvas);
    this.overlay = document.createElement('div');
    this.overlay.className = 'stage-overlay';
    document.body.appendChild(this.overlay);
    this.clipEl = clipEl;
    let r;
    try {
      r = new THREE.WebGLRenderer({ canvas: this.canvas, antialias: true, alpha: true, powerPreference: 'high-performance' });
    } catch (e) { this.failed = true; document.documentElement.classList.add('no-3d'); return; }
    this.r = r;
    r.setPixelRatio(Math.min(devicePixelRatio || 1, MOBILE ? 1.6 : 2));
    r.outputColorSpace = THREE.SRGBColorSpace;
    r.toneMapping = THREE.NeutralToneMapping;
    r.toneMappingExposure = 1.0;
    r.shadowMap.enabled = true;
    r.shadowMap.type = THREE.PCFSoftShadowMap;
    r.autoClear = false;
    const pm = new THREE.PMREMGenerator(r);
    this.env = pm.fromScene(new RoomEnvironment(), 0.04).texture;
    this.views = [];
    this.clock = new THREE.Clock();
    this.t = 0;
    this.visibleCount = 0;
    document.addEventListener('visibilitychange', () => { this.hidden = document.hidden; });
    const loop = () => { requestAnimationFrame(loop); this.frame(); };
    requestAnimationFrame(loop);
  }
  add(view) {
    view.stage = this;
    view.labels = new Labels(view, this.overlay);
    this.views.push(view);
    return view;
  }
  frame() {
    if (this.failed || this.hidden) return;
    const dt = Math.min(0.05, this.clock.getDelta());
    this.t += REDUCED ? dt * 0.35 : dt;
    const W = innerWidth, H = innerHeight;
    const r = this.r;
    const size = r.getSize(new THREE.Vector2());
    if (size.x !== W || size.y !== H) r.setSize(W, H, false);
    r.setScissorTest(false);
    r.setClearColor(0x000000, 0);
    r.clear(true, true, true);
    r.setScissorTest(true);
    const clipTop = this.clipEl ? Math.max(0, this.clipEl.getBoundingClientRect().bottom) : 0;
    for (const v of this.views) {
      const rect = v.el.getBoundingClientRect();
      const top = Math.max(rect.top, clipTop), bottom = Math.min(rect.bottom, H);
      const vis = bottom > top + 1 && rect.right > 0 && rect.left < W && rect.width > 2;
      if (vis !== v.visible) { v.visible = vis; v.labels.hide(!vis); v.onVisible?.(vis); }
      if (!vis) continue;
      // one broken figure must never blank the others
      try {
        if (!v.ready) v.build(this);
        v.tick(this.t, dt, rect);
        r.setViewport(rect.left, H - rect.bottom, rect.width, rect.height);
        r.setScissor(rect.left, H - bottom, rect.width, bottom - top);
        r.setClearColor(v.bg, v.bgAlpha);
        r.clear(true, true, true);
        r.render(v.scene, v.camera);
        v.labels.sync(rect, top, bottom, v.camera);
      } catch (e) {
        if (!v.errored) { v.errored = true; console.error('[crucible] figure', v.el.dataset.scene, e); }
      }
    }
  }
}

// ------------------------------------------------------------------------------------------------------------- view
// spec: { size, az, elev, target, bg, setup(v), update(v, t, dt), steps: [{ say, go(v) }], interval, drag, persp }
export class View {
  constructor(el, spec) {
    this.el = el; this.spec = spec;
    this.bg = spec.bg ?? 0xffffff; this.bgAlpha = spec.bgAlpha ?? 1;
    this.visible = false; this.ready = false;
    this.tw = new Tweens();
    this.flows = [];
    this.pick = [];
    this.az = spec.az ?? 0.78; this.elev = spec.elev ?? 0.55; this.userAz = 0; this.userElev = 0;
    this.size = spec.size ?? 6;
    this.target = new THREE.Vector3(...(spec.target ?? [0, 0.6, 0]));
    this.step = 0; this.playing = !REDUCED; this.stepT = 0;
  }
  build(stage) {
    this.ready = true;
    const s = this.scene = new THREE.Scene();
    s.environment = stage.env;
    if (this.spec.persp) this.camera = new THREE.PerspectiveCamera(this.spec.fov ?? 32, 1, 0.1, 200);
    else this.camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0.1, 200);
    const hemi = new THREE.HemisphereLight(0xffffff, 0xefe9e6, 0.95);
    s.add(hemi);
    const sun = this.sun = new THREE.DirectionalLight(0xffffff, 1.25);
    sun.position.set(5, 9, 4);
    sun.castShadow = true;
    sun.shadow.mapSize.set(MOBILE ? 1024 : 2048, MOBILE ? 1024 : 2048);
    const sc = this.spec.shadowSize ?? 9;
    Object.assign(sun.shadow.camera, { left: -sc, right: sc, top: sc, bottom: -sc, near: 0.5, far: 40 });
    sun.shadow.bias = -0.0004; sun.shadow.radius = 5;
    s.add(sun); s.add(sun.target);
    if (this.spec.ground !== false) {
      const gp = new THREE.Mesh(new THREE.PlaneGeometry(60, 60), mat('shadow'));
      gp.rotation.x = -Math.PI / 2; gp.position.y = this.spec.groundY ?? 0; gp.receiveShadow = true;
      gp.raycast = () => {};
      s.add(gp);
    }
    this.root = new THREE.Group(); s.add(this.root);
    this.spec.setup?.(this);
    if (this.spec.fit !== false) {
      // frame the settled first step (objects may start scattered for an intro), then put everything back
      const snap = []; this.root.traverse(o => snap.push([o, o.position.clone(), o.quaternion.clone(), o.scale.clone()]));
      const lab = this.labels.items.map(it => it.opacity);
      const first = this.spec.steps?.[0];
      if (first?.go) { first.go(this); this.tw.step(1e3); }
      this.fit();
      for (const [o, p, q, sc] of snap) { o.position.copy(p); o.quaternion.copy(q); o.scale.copy(sc); }
      this.labels.items.forEach((it, i) => { it.opacity = lab[i]; });
      this.tw.list = [];
    }
    this.attachInput();
    if (this.spec.steps?.length) this.goStep(0, true);
  }
  add(o) { this.root.add(o); return o; }
  flow(curve, opts) { const f = new Flow(curve, opts); this.flows.push(f); this.root.add(f.mesh); return f; }
  // fade a whole group (materials are cloned once per mesh so groups fade independently)
  fade(obj, to, speed = 4) {
    if (obj.userData.alpha === undefined) {
      obj.userData.alpha = 1;
      obj.traverse(o => {
        if (!o.material) return;
        if (!o.userData._own) { o.material = o.material.clone(); o.userData._own = true; }
        o.userData.baseOp = o.material.opacity ?? 1;
        o.userData.baseT = !!o.material.transparent;
        o.userData.baseDW = o.material.depthWrite;
      });
    }
    obj.userData.alphaTo = to; obj.userData.alphaSpeed = speed;
    (this.fading ??= new Set()).add(obj);
  }
  setAlpha(obj, a) { this.fade(obj, a); obj.userData.alpha = a + 1e-3; this._applyAlpha(obj, a); }
  _applyAlpha(obj, a) {
    obj.visible = a > 0.01;
    obj.traverse(o => {
      if (!o.material) return;
      o.material.opacity = (o.userData.baseOp ?? 1) * a;
      o.material.transparent = a < 0.999 || o.userData.baseT;
      o.material.depthWrite = a > 0.95 ? (o.userData.baseDW ?? true) : false;
    });
  }
  label(text, anchor, opts) { return this.labels.add(text, anchor, opts); }

  // Frame the figure: project everything visible (plus flow paths and label anchors) onto the camera plane and size
  // the orthographic view so it fits with a margin at any aspect ratio. Flat dot grids are decoration and ignored.
  fit() {
    if (this._fit) return this._solveFit();
    const az = this.az, el = this.elev;
    const fwd = new THREE.Vector3(-Math.sin(az) * Math.cos(el), -Math.sin(el), -Math.cos(az) * Math.cos(el));
    const R = new THREE.Vector3().crossVectors(fwd, new THREE.Vector3(0, 1, 0)).normalize();
    const U = new THREE.Vector3().crossVectors(R, fwd).normalize();
    const pts = [];
    this.root.updateMatrixWorld(true);
    const box = new THREE.Box3();
    const visible = o => { for (let q = o; q; q = q.parent) { if (q.userData.fit) return true; if (!q.visible) return false; } return true; };
    this.root.traverse(o => {
      if (!(o.isMesh || o.isPoints) || o.isInstancedMesh || o.userData.nofit || !visible(o)) return;
      if (!o.geometry.boundingBox) o.geometry.computeBoundingBox();
      box.copy(o.geometry.boundingBox).applyMatrix4(o.matrixWorld);
      if (o.isPoints && box.max.y - box.min.y < 0.02) return;
      if (box.isEmpty() || box.max.distanceTo(box.min) < 0.03) return;
      for (let i = 0; i < 8; i++) pts.push(new THREE.Vector3(i & 1 ? box.max.x : box.min.x, i & 2 ? box.max.y : box.min.y, i & 4 ? box.max.z : box.min.z));
    });
    for (const f of this.flows) for (let i = 0; i <= 12; i++) pts.push(f.curve.getPointAt(i / 12, new THREE.Vector3()));
    if (!pts.length) return;
    // label boxes, measured in pixels and converted with the current scale (iterated: the scale depends on the fit)
    // on phones labels are small and may clip at the edge; framing for them would shrink the model too much
    const labs = (MOBILE ? [] : this.labels.items).filter(it => it.el.textContent.trim() && it.el.offsetWidth).map(it => {
      const p = it.anchor.isObject3D ? it.anchor.getWorldPosition(new THREE.Vector3()) : it.anchor.clone();
      const w = it.el.offsetWidth, h = it.el.offsetHeight, al = it.el.className.match(/a-(\w+)/)?.[1] ?? 'center';
      const bx = al === 'left' ? [0, w] : al === 'right' ? [-w, 0] : [-w / 2, w / 2];
      const by = al === 'above' ? [-h, 0] : [-h / 2, h / 2];
      return { x: p.dot(R), y: p.dot(U), bx: [bx[0] + it.dx, bx[1] + it.dx], by: [by[0] + it.dy, by[1] + it.dy] };
    });
    this._fit = { R, U, pts, labs };
    this._solveFit();
  }
  _solveFit() {
    const { R, U, pts, labs } = this._fit;
    const rect = this.el.getBoundingClientRect(); const aspect = rect.width / Math.max(1, rect.height);
    this._fw = rect.width; this._fh = rect.height;
    const pad = this.spec.fitPad ?? 0.07;
    let k = 0, cx = 0, cy = 0, w = 1, h = 1;
    for (let pass = 0; pass < 3; pass++) {
      let x0 = Infinity, x1 = -Infinity, y0 = Infinity, y1 = -Infinity;
      for (const p of pts) { const x = p.dot(R), y = p.dot(U); x0 = Math.min(x0, x); x1 = Math.max(x1, x); y0 = Math.min(y0, y); y1 = Math.max(y1, y); }
      for (const l of labs) {
        const sx = k ? 1 / k : 0;
        x0 = Math.min(x0, l.x + l.bx[0] * sx); x1 = Math.max(x1, l.x + l.bx[1] * sx);
        y0 = Math.min(y0, l.y - l.by[1] * sx); y1 = Math.max(y1, l.y - l.by[0] * sx);
      }
      w = (x1 - x0) * (1 + pad * 2); h = (y1 - y0) * (1 + pad * 2);
      cx = (x0 + x1) / 2; cy = (y0 + y1) / 2;
      const hh = Math.max(h, w / aspect) / 2;
      k = rect.width / (2 * hh * aspect);
      if (!labs.length) break;
    }
    this.target.copy(R).multiplyScalar(cx).addScaledVector(U, cy);
    if (this.spec.fitShift) this.target.add(new THREE.Vector3(...this.spec.fitShift));
    this.size = h; this.spec.minWidth = w;
  }


  attachInput() {
    const el = this.el; let drag = null;
    const ray = new THREE.Raycaster(); const ndc = new THREE.Vector2();
    el.addEventListener('pointerdown', e => {
      if (this.spec.drag === false) return;
      drag = { x: e.clientX, y: e.clientY, az: this.userAz, el: this.userElev, moved: false };
      el.setPointerCapture?.(e.pointerId);
    });
    el.addEventListener('pointermove', e => {
      const rc = el.getBoundingClientRect();
      if (drag) {
        const dx = (e.clientX - drag.x) / rc.width, dy = (e.clientY - drag.y) / rc.height;
        if (Math.abs(dx) + Math.abs(dy) > 0.01) drag.moved = true;
        this.userAz = drag.az - dx * 3.2;
        this.userElev = Math.max(-0.35, Math.min(0.5, drag.el + dy * 1.6));
        el.classList.add('dragging');
        return;
      }
      if (!this.pick.length || !this.camera) return;
      ndc.set(((e.clientX - rc.left) / rc.width) * 2 - 1, -((e.clientY - rc.top) / rc.height) * 2 + 1);
      ray.setFromCamera(ndc, this.camera);
      const hit = ray.intersectObjects(this.pick, true)[0];
      let o = hit?.object; while (o && !o.userData.pick) o = o.parent;
      if (o !== this.hover) { this.hover = o; this.spec.onHover?.(this, o || null); el.style.cursor = o ? 'pointer' : ''; }
    });
    const end = e => {
      if (drag && !drag.moved && this.hover) this.spec.onClick?.(this, this.hover);
      drag = null; el.classList.remove('dragging');
    };
    el.addEventListener('pointerup', end);
    el.addEventListener('pointercancel', end);
    el.addEventListener('pointerleave', () => { if (!drag && this.hover) { this.hover = null; this.spec.onHover?.(this, null); el.style.cursor = ''; } });
  }

  // stepper
  bindStepper(root) {
    if (!root || !this.spec.steps?.length) return;
    this.ui = {
      root, say: root.querySelector('.st-say'), count: root.querySelector('.st-count'),
      play: root.querySelector('.st-play'), dots: root.querySelector('.st-dots'),
    };
    const n = this.spec.steps.length;
    if (this.ui.dots) this.ui.dots.innerHTML = Array.from({ length: n }, (_, i) => `<i data-i="${i}"></i>`).join('');
    root.querySelector('.st-prev')?.addEventListener('click', () => { this.playing = false; this.goStep(this.step - 1); });
    root.querySelector('.st-next')?.addEventListener('click', () => { this.playing = false; this.goStep(this.step + 1); });
    this.ui.play?.addEventListener('click', () => { this.playing = !this.playing; this.stepT = 0; this.paintUI(); });
    this.ui.dots?.addEventListener('click', e => { const i = e.target?.dataset?.i; if (i !== undefined) { this.playing = false; this.goStep(+i); } });
    this.paintUI();
  }
  // a timer owned by the current step: cancelled when the step changes, run at once while replaying
  later(fn, ms) {
    if (this._replaying) { fn(); return; }
    (this._timers ??= []).push(setTimeout(fn, ms));
  }
  _settle() {
    this.tw.step(1e3);
    if (this.fading) for (const o of this.fading) { o.userData.alpha = o.userData.alphaTo; this._applyAlpha(o, o.userData.alpha); }
    this.fading?.clear();
  }
  goStep(i, silent = false) {
    const steps = this.spec.steps; if (!steps?.length) return;
    const n = steps.length, prev = this.step, next = ((i % n) + n) % n;
    this._timers?.forEach(clearTimeout); this._timers = [];
    this.step = next; this.stepT = 0;
    if (this.ready) {
      // a jump (dots, back) replays the earlier steps instantly so the figure is in the state the story reached
      if (!silent && next !== 0 && next !== (prev + 1) % n) {
        this._replaying = true;
        try { for (let k = 0; k < next; k++) { steps[k].go?.(this); this._settle(); } } finally { this._replaying = false; }
      }
      steps[next].go?.(this); this.spec.onStep?.(this, next);
    }
    this.paintUI();
  }
  paintUI() {
    const u = this.ui; if (!u) return;
    const steps = this.spec.steps;
    if (u.say) u.say.textContent = steps[this.step].say;
    if (u.count) u.count.textContent = `${this.step + 1} / ${steps.length}`;
    if (u.play) { u.play.textContent = this.playing ? 'Pause' : 'Play'; u.play.setAttribute('aria-pressed', String(!this.playing)); }
    u.dots?.querySelectorAll('i').forEach((d, k) => d.classList.toggle('on', k === this.step));
  }

  tick(t, dt, rect) {
    if (this._fit && (Math.abs(rect.width - this._fw) > 3 || Math.abs(rect.height - this._fh) > 3)) this._solveFit();
    const aspect = rect.width / Math.max(1, rect.height);
    const cam = this.camera;
    const idle = REDUCED ? 0 : Math.sin(t * 0.17 + (this.spec.phase ?? 0)) * (this.spec.sway ?? 0.07);
    const az = this.az + this.userAz + idle, el = Math.max(0.05, Math.min(1.35, this.elev + this.userElev));
    const dist = this.spec.dist ?? 30;
    cam.position.set(
      this.target.x + Math.sin(az) * Math.cos(el) * dist,
      this.target.y + Math.sin(el) * dist,
      this.target.z + Math.cos(az) * Math.cos(el) * dist,
    );
    cam.lookAt(this.target);
    if (cam.isOrthographicCamera) {
      const minW = this.spec.minWidth ?? this.size * 1.25;
      const hh = Math.max(this.size, minW / aspect) / 2;
      cam.left = -hh * aspect; cam.right = hh * aspect; cam.top = hh; cam.bottom = -hh;
    } else cam.aspect = aspect;
    cam.updateProjectionMatrix();
    this.tw.step(dt);
    if (this.fading) for (const o of this.fading) {
      const ud = o.userData, k = Math.min(1, dt * ud.alphaSpeed);
      const next = ud.alpha + (ud.alphaTo - ud.alpha) * k;
      if (Math.abs(next - ud.alphaTo) < 0.004) { ud.alpha = ud.alphaTo; this.fading.delete(o); } else ud.alpha = next;
      this._applyAlpha(o, ud.alpha);
    }
    for (const f of this.flows) f.update(t, dt);
    this.spec.update?.(this, t, dt);
    const steps = this.spec.steps;
    if (steps?.length && this.playing && this.visible) {
      this.stepT += dt;
      const dur = steps[this.step].dur ?? this.spec.interval ?? 4.2;
      if (this.stepT > dur) this.goStep(this.step + 1);
    }
  }
}

// ---------------------------------------------------------------------------------------------------------- helpers
export function pickable(obj, data = {}) { obj.userData.pick = true; Object.assign(obj.userData, data); return obj; }
export function setOpacity(obj, a) {
  obj.traverse(o => {
    if (o.material) {
      if (!o.userData._own) { o.material = o.material.clone(); o.userData._own = true; }
      o.material.transparent = true; o.material.opacity = a; o.material.depthWrite = a > 0.6;
    }
  });
}
export function tint(mesh, color) {
  if (!mesh.userData._own) { mesh.material = mesh.material.clone(); mesh.userData._own = true; }
  return mesh.material.color;
}
export const V = (x, y, z) => new THREE.Vector3(x, y, z);
