// Small architectural-model parts shared by the scenes: white clay, hairline edges, cardinal accents.
import { THREE, PAL, mat, edges, block, cyl, sphere, line, tube, arc, points, fibSphere, V } from './kit.js';

export function anchor(parent, x = 0, y = 0, z = 0) {
  const a = new THREE.Object3D(); a.position.set(x, y, z); parent.add(a); return a;
}

export function group(...children) { const g = new THREE.Group(); children.forEach(c => g.add(c)); return g; }

export function plate(w, d, h = 0.06, opts = {}) { return block(w, h, d, opts); }

export function pawn(color = 0xffffff, kind = 'clay', s = 1) {
  const g = new THREE.Group();
  const body = cyl(0.13 * s, 0.34 * s, { color, kind, seg: 28 });
  const head = sphere(0.11 * s, { color, kind: kind === 'clay' ? 'clay' : kind });
  head.position.y = 0.47 * s;
  const base = cyl(0.18 * s, 0.04 * s, { color, kind, seg: 28 });
  g.add(base, body, head);
  return g;
}

export function sheetStack(n = 3, w = 0.55, d = 0.72, gap = 0.05, color) {
  const g = new THREE.Group();
  for (let i = 0; i < n; i++) {
    const s = block(w, 0.025, d, { color });
    s.position.set(i * 0.025, i * gap, -i * 0.02);
    s.rotation.y = (i - n / 2) * 0.05;
    g.add(s);
  }
  return g;
}

export function terminal(w = 0.8, h = 0.55, d = 0.5) {
  const g = new THREE.Group();
  const b = block(w, h, d); g.add(b);
  const screen = new THREE.Mesh(new THREE.PlaneGeometry(w * 0.84, h * 0.7), mat('flat', PAL.ink));
  screen.position.set(0, h * 0.52, d / 2 + 0.002); g.add(screen);
  const cursor = new THREE.Mesh(new THREE.PlaneGeometry(w * 0.07, h * 0.08), mat('flat', PAL.ember));
  cursor.position.set(-w * 0.3, h * 0.42, d / 2 + 0.004); g.add(cursor);
  g.userData.cursor = cursor;
  for (let i = 0; i < 3; i++) {
    const ln = new THREE.Mesh(new THREE.PlaneGeometry(w * (0.5 - i * 0.12), h * 0.035), mat('flat', 0x8f8a84));
    ln.position.set(-w * 0.12 - i * w * 0.06, h * (0.72 - i * 0.1), d / 2 + 0.004); g.add(ln);
  }
  return g;
}

export function flagPole(color = PAL.cardinal, h = 0.9) {
  const g = new THREE.Group();
  const pole = cyl(0.012, h, { color: PAL.grey, kind: 'clay', edge: null, seg: 8 }); g.add(pole);
  const shape = new THREE.Shape(); shape.moveTo(0, 0); shape.lineTo(0.32, -0.1); shape.lineTo(0, -0.2);
  const f = new THREE.Mesh(new THREE.ShapeGeometry(shape), mat('flat', color));
  f.material.side = THREE.DoubleSide; f.position.y = h; g.add(f);
  g.userData.flag = f;
  return g;
}

export function arch(w = 1.2, h = 1.1, t = 0.12, color, kind = 'clay') {
  const g = new THREE.Group();
  const l = block(t, h, t, { color, kind }); l.position.x = -w / 2;
  const r = block(t, h, t, { color, kind }); r.position.x = w / 2;
  const top = block(w + t, t, t, { color, kind }); top.position.y = h;
  g.add(l, r, top);
  return g;
}

export function ring(r = 1, t = 0.02, color = PAL.rule, kind = 'clay', arcLen = Math.PI * 2) {
  const m = new THREE.Mesh(new THREE.TorusGeometry(r, t, 10, 96, arcLen), mat(kind, color));
  m.rotation.x = Math.PI / 2;
  return m;
}

export function bars(values, { w = 0.22, gap = 0.12, hmax = 1.6, color = PAL.cardinal, alt = 0xffffff } = {}) {
  const g = new THREE.Group();
  values.forEach((v, i) => {
    const b = block(w, Math.max(0.02, v * hmax), w, { color: i % 2 ? alt : color, kind: i % 2 ? 'clay' : 'gloss' });
    b.position.x = (i - (values.length - 1) / 2) * (w + gap);
    g.add(b);
  });
  return g;
}

export function gitGraph() {
  const g = new THREE.Group();
  const pts = [V(-0.25, 0.25, 0), V(0, 0.45, 0), V(0.25, 0.25, 0), V(0, 0.7, 0)];
  pts.forEach((p, i) => { const s = sphere(0.07, { color: i === 3 ? PAL.cardinal : PAL.ink, kind: 'gloss' }); s.position.copy(p); g.add(s); });
  g.add(line([pts[0], pts[1], pts[3]], PAL.grey));
  g.add(line([pts[2], pts[1]], PAL.grey));
  const base = block(0.7, 0.05, 0.36); g.add(base);
  return g;
}

export function bubble(w = 0.62, h = 0.36) {
  const g = new THREE.Group();
  const b = block(w, h, 0.22); b.position.y = 0.16; g.add(b);
  const tail = new THREE.Mesh(new THREE.ConeGeometry(0.07, 0.16, 4), mat('clay'));
  tail.position.set(-w * 0.28, 0.12, 0); tail.rotation.z = Math.PI * 0.85; g.add(tail);
  for (let i = 0; i < 2; i++) {
    const ln = new THREE.Mesh(new THREE.PlaneGeometry(w * (0.64 - i * 0.2), 0.035), mat('flat', i ? 0xb9b3ae : PAL.cardinal));
    ln.position.set(-w * 0.05 - i * 0.05, 0.16 + h * (0.68 - i * 0.28), 0.111); g.add(ln);
  }
  return g;
}

export function dbStack(r = 0.3, n = 3) {
  const g = new THREE.Group();
  for (let i = 0; i < n; i++) { const c = cyl(r, 0.16, {}); c.position.y = i * 0.19; g.add(c); }
  return g;
}

export function testStack() {
  const g = new THREE.Group();
  for (let i = 0; i < 4; i++) {
    const p = block(0.56, 0.05, 0.42, { color: i === 2 ? PAL.cardinal : undefined, kind: i === 2 ? 'gloss' : 'clay' });
    p.position.y = i * 0.09; g.add(p);
  }
  return g;
}

export function octa(r = 0.18, color = PAL.cardinal, kind = 'gloss') {
  const m = new THREE.Mesh(new THREE.OctahedronGeometry(r, 0), mat(kind, color));
  m.castShadow = true; edges(m, kind === 'gloss' ? PAL.cardinal : PAL.rule);
  return m;
}

export function cube(s = 0.3, opts = {}) { return block(s, s, s, opts); }

export function dottedSphere(n, r, color = PAL.cardinal, size = 3) { return points(fibSphere(n, r), { color, size }); }

export function station(icon, { w = 0.95, d = 0.95 } = {}) {
  const g = new THREE.Group();
  const base = block(w, 0.06, d); g.add(base);
  icon.position.y = 0.06; g.add(icon);
  return g;
}

export function cart(w = 0.62, h = 0.18, d = 0.8, color) {
  const g = new THREE.Group();
  const b = block(w, h, d, { color, kind: color ? 'gloss' : 'clay' }); g.add(b);
  for (let i = 0; i < 4; i++) {
    const pin = block(0.05, 0.03, 0.08, { color: PAL.cardinal, kind: 'gloss', edge: null });
    pin.position.set((i - 1.5) * 0.12, 0.02, -d / 2 - 0.03); g.add(pin);
  }
  return g;
}

export { THREE, PAL, mat, edges, block, cyl, sphere, line, tube, arc, points, fibSphere, V };
