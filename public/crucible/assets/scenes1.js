// Scenes, part 1: hero, pipeline and the first eight parts.
import { THREE, PAL, mat, block, cyl, sphere, line, tube, arc, points, dotGrid, Flow, pickable, ENV, V } from './kit.js';
import { anchor, group, plate, pawn, sheetStack, terminal, flagPole, arch, ring, bars, gitGraph, bubble, dbStack, testStack, octa, cube, dottedSphere, station, cart } from './parts.js';

const lift = (v, o, y, d = 0.7) => v.tw.to(o.position, 'y', y, d);
const moveTo = (v, o, p, d = 0.9) => v.tw.to(o, 'position', V(...p), d);
const scaleTo = (v, o, s, d = 0.6) => v.tw.to(o, 'scale', V(s, s, s), d);
const show = (v, item, on = true, d = 0.45) => v.tw.to(item, 'opacity', on ? 1 : 0, d);

// ================================================================================================================ hero
export const hero = () => ({
  size: 7.6, minWidth: 10.4, target: [0.35, 1.25, 0], az: 0.52, elev: 0.36, sway: 0.1, shadowSize: 8,
  setup(v) {
    const s = v.s = {};
    v.add(dotGrid(11, 7, 0.34, { color: PAL.rule, size: 2.2 }));
    // the vessel: a dotted crucible
    const vessel = new THREE.Group(); vessel.position.set(0.2, 0.32, 0); v.add(vessel);
    const pedestal = cyl(0.95, 0.32, { seg: 64 }); pedestal.position.set(0.2, 0, 0); v.add(pedestal);
    const pos = [], rings = 26, per = ENV.MOBILE ? 44 : 64, H = 2.25;
    for (let i = 0; i < rings; i++) {
      const y = (i / (rings - 1)) * H, k = y / H;
      const r = 0.62 + 0.62 * Math.pow(k, 0.72);
      for (let j = 0; j < per; j++) { const a = (j / per) * Math.PI * 2 + i * 0.07; pos.push(Math.cos(a) * r, y, Math.sin(a) * r); }
    }
    for (let j = 0; j < 60; j++) { const a = j / 60 * Math.PI * 2, r = 0.2 + (j % 3) * 0.16; pos.push(Math.cos(a) * r, 0.02, Math.sin(a) * r); }
    vessel.add(points(pos, { color: PAL.cardinal, size: 2.6, opacity: 0.85 }));
    const rim = ring(1.24, 0.028, PAL.cardinal, 'gloss'); rim.position.y = H; vessel.add(rim);
    // molten core: a swirling disc of points and a soft red pool
    const core = new THREE.Group(); core.position.y = H - 0.42; vessel.add(core);
    const cp = []; const cc = [];
    for (let i = 0; i < 420; i++) {
      const r = Math.sqrt(Math.random()) * 1.02, a = Math.random() * Math.PI * 2;
      cp.push(Math.cos(a) * r, (Math.random() - 0.5) * 0.08, Math.sin(a) * r);
      const t = Math.random(); const c = new THREE.Color(PAL.cardinal).lerp(new THREE.Color(PAL.ember), t * 0.8);
      cc.push(c.r, c.g, c.b);
    }
    core.add(points(cp, { colors: cc, size: 3.4 }));
    const pool = new THREE.Mesh(new THREE.CircleGeometry(1.0, 64), mat('flatT', PAL.cardinal));
    pool.rotation.x = -Math.PI / 2; pool.material.opacity = 0.16; core.add(pool);
    s.core = core;
    // sources
    const srcs = [
      { o: gitGraph(), label: 'pull requests', p: [-4.2, 0, -1.9] },
      { o: bubble(), label: 'reviews', p: [-4.4, 0, -0.55] },
      { o: testStack(), label: 'test runs', p: [-4.3, 0, 0.8] },
      { o: sheetStack(3), label: 'tickets · ERP', p: [-3.6, 0, 2.0] },
      { o: terminal(0.7, 0.48, 0.44), label: 'agent sessions', p: [-2.6, 0, 2.7] },
    ];
    s.srcs = [];
    const mouth = V(0.2, H + 0.65, 0);
    srcs.forEach((d, i) => {
      const g = new THREE.Group(); g.position.set(...d.p); g.add(d.o); v.add(g);
      const top = V(d.p[0], 0.7, d.p[2]);
      const c = arc(top, mouth, 0, V((d.p[0] + 0.2) / 2, 2.9 + i * 0.12, d.p[2] / 2));
      v.add(tube(c, 0.008, PAL.rule, 'clay'));
      v.flow(c, { count: 5, speed: 0.11 + i * 0.01, r: 0.045, color: PAL.ink, offset: i * 0.13 });
      v.label(d.label, anchor(g, 0, -0.18, 0.35), { cls: '', align: 'center' });
      s.srcs.push(g);
    });
    // outputs
    const spout = V(1.35, 0.5, 0.15);
    const outs = [];
    const envCube = new THREE.Group();
    const glass = block(0.95, 0.95, 0.95, { kind: 'glass', edge: PAL.cardinal }); envCube.add(glass);
    [[-0.22, 0, -0.2, 0.32], [0.2, 0, 0.18, 0.22], [0.2, 0, -0.22, 0.42], [-0.2, 0, 0.22, 0.18]].forEach(([x, y, z, h]) => {
      const b = block(0.22, h, 0.22); b.position.set(x, 0.02, z); envCube.add(b);
    });
    outs.push({ o: envCube, label: 'environments', sub: 'a score for each step', p: [3.3, 0.36, -1.7] });
    const tasks = new THREE.Group();
    for (let i = 0; i < 4; i++) { const c = block(0.82, 0.05, 0.6); c.position.set(i * 0.02, i * 0.08, -i * 0.02); c.rotation.y = 0.08 * i; tasks.add(c); }
    const seal = cyl(0.13, 0.03, { color: PAL.cardinal, kind: 'gloss', edge: null }); seal.position.set(0.18, 0.34, 0.12); tasks.add(seal);
    outs.push({ o: tasks, label: 'verified tasks', sub: '18 checks passed', p: [3.75, 0.36, 0.25] });
    const bench = bars([0.85, 0.55, 0.7, 0.35, 0.95], { w: 0.14, gap: 0.06, hmax: 1.1 });
    outs.push({ o: bench, label: 'benchmarks', sub: 'every step scored', p: [3.2, 0.36, 2.15] });
    outs.forEach((d, i) => {
      const ped = cyl(0.62, 0.36, { seg: 48 }); ped.position.set(d.p[0], 0, d.p[2]); v.add(ped);
      d.o.position.set(...d.p); v.add(d.o);
      const c = arc(spout, V(d.p[0] - 0.4, 0.55, d.p[2]), 0, V((spout.x + d.p[0]) / 2, 0.25, (spout.z + d.p[2]) / 2));
      v.add(tube(c, 0.01, PAL.blush, 'clay'));
      v.flow(c, { count: 4, speed: 0.16, r: 0.06, color: PAL.cardinal, offset: i * 0.21 });
      v.label(`<b>${d.label}</b><br><span>${d.sub}</span>`, anchor(d.o, 0.72, 0.45, 0), { cls: 'big', html: true, align: 'left' });
    });
    v.label('raw work records', V(-4.1, 2.6, 0.2), { cls: 'ghost' });
    v.label('crucible', anchor(vessel, 0, H + 0.42, 0), { cls: 'tag' });
  },
  update(v, t) {
    v.s.core.rotation.y = t * 0.35;
    v.s.srcs.forEach((g, i) => { g.position.y = Math.sin(t * 0.9 + i * 1.3) * 0.06 + 0.06; });
  },
});

// ============================================================================================================ pipeline
// Each station says what happens there in plain words, and its model shows it.
const STATIONS = [
  { id: 'capture', name: 'Capture work', desc: 'logs, tickets, reviews', at: [-6.30, -1.3], row: 'top' },
  { id: 'feedback', name: 'Find feedback', desc: 'approvals and fixes', at: [-4.20, -1.3], row: 'top' },
  { id: 'workflow', name: 'Map workflow', desc: 'stages and milestones', at: [-2.10, -1.3], row: 'top' },
  { id: 'scores', name: 'Score steps', desc: 'progress at each step', at: [0.00, -1.3], row: 'top' },
  { id: 'checks', name: 'Check results', desc: 'hidden checks', at: [2.10, -1.3], row: 'top' },
  { id: 'builder', name: 'Build tasks', desc: 'solution first', at: [4.20, -1.3], row: 'top' },
  { id: 'gate', name: 'Approve tasks', desc: '18 quality checks', at: [6.30, -1.3], row: 'top' },
  { id: 'workplace', name: 'Simulate work', desc: 'apps, data, clock', at: [8.00, -0.55], row: 'side' },
  { id: 'people', name: 'Simulate people', desc: 'replies from records', at: [8.00, 0.85], row: 'side' },
  { id: 'runs', name: 'Run agents', desc: 'many tries, fair counts', at: [6.30, 1.5], row: 'bottom' },
  { id: 'training', name: 'Train model', desc: 'learn from scores', at: [4.20, 1.5], row: 'bottom' },
  { id: 'benchmarks', name: 'Measure', desc: 'where agents fail', at: [2.10, 1.5], row: 'bottom' },
  { id: 'replay', name: 'Export', desc: 'reward and step files', at: [-0.00, 1.5], row: 'bottom' },
  { id: 'packs', name: 'Add domains', desc: 'one pack per domain', at: [-2.10, 1.5], row: 'bottom' },
  { id: 'use', name: 'Two commands', desc: 'label and build', at: [-4.20, 1.5], row: 'bottom' },
];

const check = (color = PAL.pass, s = 1) => {
  // a check mark made of two short bars
  const g = new THREE.Group();
  const a = block(0.05 * s, 0.05 * s, 0.14 * s, { color, kind: 'gloss', edge: null }); a.rotation.x = 0; a.position.set(-0.05 * s, 0, 0); a.rotation.y = 0.8; g.add(a);
  const b = block(0.05 * s, 0.05 * s, 0.28 * s, { color, kind: 'gloss', edge: null }); b.position.set(0.06 * s, 0, -0.04 * s); b.rotation.y = -0.75; g.add(b);
  return g;
};

function stationIcon(id) {
  const g = new THREE.Group();
  switch (id) {
    case 'capture': { // a funnel that takes in work documents
      const f = new THREE.Mesh(new THREE.CylinderGeometry(0.32, 0.08, 0.4, 32, 1, true), mat('clay')); f.material = f.material.clone(); f.material.side = THREE.DoubleSide; f.position.y = 0.34; f.castShadow = true; g.add(f);
      g.add(cyl(0.08, 0.14, {}));
      [[-0.12, 0.72, 0.02, 0.4], [0.1, 0.84, -0.05, -0.3], [0, 0.98, 0.06, 0.15]].forEach(([x, y, z, r], i) => { const d = block(0.2, 0.012, 0.26, { color: i === 1 ? PAL.blush : undefined }); d.position.set(x, y, z); d.rotation.set(0.5, r, 0.2); g.add(d); });
      return g;
    }
    case 'feedback': { // a comment bubble with a green check: feedback
      const bb = bubble(0.56, 0.32); g.add(bb);
      const c = check(PAL.pass, 1.2); c.position.set(0.12, 0.62, 0.13); c.rotation.x = Math.PI / 2; g.add(c);
      return g;
    }
    case 'workflow': { // a small flowchart: three steps joined, a flag at the milestone
      const pts = [V(-0.3, 0.06, 0.12), V(0, 0.06, -0.1), V(0.3, 0.06, 0.12)];
      pts.forEach((p, i) => { const t = block(0.18, 0.1, 0.18, { color: i === 2 ? PAL.cardinal : undefined, kind: i === 2 ? 'gloss' : 'clay' }); t.position.copy(p); g.add(t); });
      g.add(tube(new THREE.CatmullRomCurve3(pts.map(p => p.clone().setY(0.12))), 0.014, PAL.ink, 'clay', 24));
      const fl = flagPole(PAL.cardinal, 0.42); fl.position.set(0.3, 0.16, 0.12); g.add(fl);
      return g;
    }
    case 'scores': { // a staircase of scores, rising step by step
      [0.1, 0.2, 0.3, 0.42].forEach((h, i) => { const b = block(0.15, h, 0.36, { color: i === 3 ? PAL.cardinal : undefined, kind: i === 3 ? 'gloss' : 'clay' }); b.position.x = (i - 1.5) * 0.16; g.add(b); });
      return g;
    }
    case 'checks': { // a page under a glass dome, checked
      const page = block(0.36, 0.02, 0.44); page.position.y = 0.02; g.add(page);
      for (let i = 0; i < 3; i++) { const ln = block(0.22 - i * 0.04, 0.005, 0.03, { color: PAL.stone, edge: null }); ln.position.set(-0.03, 0.045, -0.12 + i * 0.09); g.add(ln); }
      const c = check(PAL.pass, 1.1); c.position.set(0.1, 0.06, 0.12); g.add(c);
      const dome = new THREE.Mesh(new THREE.SphereGeometry(0.34, 32, 16, 0, Math.PI * 2, 0, Math.PI / 2), mat('glass')); g.add(dome);
      return g;
    }
    case 'builder': { // a workbench where a new task block is made
      const b = block(0.5, 0.18, 0.3); g.add(b); const t = block(0.68, 0.06, 0.36); t.position.y = 0.18; g.add(t);
      const w = cube(0.15, { color: PAL.cardinal, kind: 'gloss' }); w.position.set(0.1, 0.24, 0); g.add(w);
      const h = block(0.04, 0.04, 0.3, { color: PAL.grey, edge: null }); h.position.set(-0.16, 0.3, 0.02); h.rotation.y = 0.5; g.add(h);
      const hd = block(0.14, 0.08, 0.08, { color: PAL.ink, kind: 'gloss', edge: null }); hd.position.set(-0.08, 0.3, -0.1); g.add(hd);
      return g;
    }
    case 'gate': { // a gate with a green light, a task waiting to pass
      const l = block(0.06, 0.5, 0.06); l.position.x = -0.24; g.add(l); const r = block(0.06, 0.5, 0.06); r.position.x = 0.24; g.add(r);
      const top = block(0.56, 0.06, 0.08); top.position.y = 0.5; g.add(top);
      const lamp = sphere(0.06, { color: PAL.pass }); lamp.position.y = 0.62; g.add(lamp);
      const c = cube(0.14, {}); c.position.set(0, 0, 0.26); g.add(c);
      return g;
    }
    case 'workplace': { // an office desk with a screen and a wall clock
      const desk = block(0.6, 0.04, 0.34); desk.position.y = 0.2; g.add(desk);
      [[-0.26, -0.13], [0.26, -0.13], [-0.26, 0.13], [0.26, 0.13]].forEach(([x, z]) => { const lg = block(0.03, 0.2, 0.03, { edge: null }); lg.position.set(x, 0, z); g.add(lg); });
      const scr = terminal(0.32, 0.22, 0.04); scr.position.set(0, 0.24, -0.08); g.add(scr);
      const clk = cyl(0.08, 0.02, { color: 0xffffff }); clk.rotation.x = Math.PI / 2; clk.position.set(0.22, 0.55, -0.16); g.add(clk);
      const hand = block(0.008, 0.06, 0.006, { color: PAL.cardinal, edge: null }); hand.position.set(0.22, 0.55, -0.145); g.add(hand);
      return g;
    }
    case 'people': { // three people, one speaking
      [-0.24, 0, 0.24].forEach((x, i) => { const p = pawn(i === 1 ? PAL.cardinal : 0xffffff, i === 1 ? 'gloss' : 'clay', 0.72); p.position.x = x; g.add(p); });
      const bb = bubble(0.3, 0.16); bb.scale.setScalar(0.8); bb.position.set(0.12, 0.5, 0); g.add(bb);
      return g;
    }
    case 'runs': { // three agents on three lanes: many tries
      [-0.14, 0, 0.14].forEach((z, i) => {
        const r = block(0.8, 0.02, 0.05); r.position.z = z; g.add(r);
        const p = new THREE.Mesh(new THREE.CapsuleGeometry(0.045, 0.14, 6, 12), mat('gloss', i === 1 ? PAL.cardinal : 0xffffff)); p.rotation.z = Math.PI / 2; p.position.set(-0.2 + i * 0.18, 0.07, z); p.castShadow = true; g.add(p);
      });
      return g;
    }
    case 'training': { // a learning curve that rises to an arrow
      const board = block(0.62, 0.03, 0.36); g.add(board);
      const pts = [V(-0.26, 0.06, 0.1), V(-0.12, 0.12, 0.05), V(0.02, 0.28, 0), V(0.16, 0.42, -0.05), V(0.26, 0.5, -0.08)];
      g.add(tube(new THREE.CatmullRomCurve3(pts), 0.02, PAL.cardinal, 'gloss', 30));
      const tip = new THREE.Mesh(new THREE.ConeGeometry(0.05, 0.12, 12), mat('gloss', PAL.cardinal)); tip.position.set(0.28, 0.55, -0.09); tip.rotation.z = -0.6; g.add(tip);
      return g;
    }
    case 'benchmarks': { // a podium chart: who got how far
      const b = bars([0.45, 0.7, 0.32], { w: 0.16, gap: 0.04, hmax: 0.8 }); g.add(b);
      const base = block(0.6, 0.03, 0.26); g.add(base);
      return g;
    }
    case 'replay': { // a sealed package with two files going out
      const box = block(0.34, 0.26, 0.34); g.add(box);
      const band = block(0.36, 0.05, 0.08, { color: PAL.cardinal, kind: 'gloss', edge: null }); band.position.y = 0.26; g.add(band);
      [0, 1].forEach(i => { const f = block(0.16, 0.012, 0.2, { color: i ? PAL.blush : undefined }); f.position.set(0.3 + i * 0.05, 0.08 + i * 0.12, 0.08 - i * 0.04); f.rotation.set(0, 0.3, 0.3); g.add(f); });
      return g;
    }
    case 'packs': { // three domain cartridges in a row
      [0, 1, 2].forEach(i => { const c = cart(0.18, 0.1, 0.26, i === 2 ? PAL.cardinal : undefined); c.position.set((i - 1) * 0.22, 0.02, 0); c.rotation.x = -0.15; g.add(c); });
      return g;
    }
    case 'use': return terminal(0.56, 0.4, 0.36);
    default: return cube(0.3);
  }
}

export const pipeline = () => ({
  size: 6.2, minWidth: 13.4, target: [0, 0.3, 0.15], az: 0.12, elev: 0.72, sway: 0.04, shadowSize: 11, interval: 4.6,
  setup(v) {
    const s = v.s = { st: [] };
    const slab = block(17.6, 0.16, 5.0); slab.position.set(0.85, -0.16, 0.1); v.add(slab);
    v.label('One shared record format sits under every station', V(-7.9, -0.16, 2.6), { cls: 'code', align: 'left', dy: 30 });
    const pts = STATIONS.map(d => V(d.at[0], 0.14, d.at[1]));
    const curve = new THREE.CatmullRomCurve3(pts, false, 'catmullrom', 0.25);
    v.add(tube(curve, 0.02, PAL.rule, 'clay', 400));
    const prog = tube(curve, 0.034, PAL.cardinal, 'gloss', 400);
    s.prog = prog; s.progN = prog.geometry.index.count; prog.geometry.setDrawRange(0, 0); v.add(prog);
    s.curve = curve; s.u = 0; s.uTo = 0;
    s.packet = sphere(0.13, { color: PAL.cardinal, kind: 'gloss' }); v.add(s.packet);
    STATIONS.forEach((d, i) => {
      const icon = stationIcon(d.id); icon.scale.setScalar(1.25);
      const g = station(icon);
      g.position.set(d.at[0], 0, d.at[1]);
      pickable(g, { href: '#' + d.id, i });
      v.add(g); v.pick.push(g);
      // back row labels sit above their stations, front row labels below, side labels to the right
      const at = d.row === 'top' ? anchor(g, 0, 1.35, -0.25) : d.row === 'bottom' ? anchor(g, 0, -0.05, 0.72) : anchor(g, 0.7, 0.25, 0);
      const name = v.label(`<b>${d.name}</b><span>${d.desc}</span>`, at, { cls: 'station', html: true, align: d.row === 'side' ? 'left' : 'center' });
      s.st.push({ g, icon, name, d });
    });
    s.flowIn = v.flow(arc(V(-8.2, 0.5, -1.3), V(-6.3, 0.4, -1.3), 0.5), { count: 4, speed: 0.22, r: 0.05, color: PAL.ink });
  },
  update(v, t, dt) {
    const s = v.s;
    s.u += (s.uTo - s.u) * Math.min(1, dt * 1.8);
    s.prog.geometry.setDrawRange(0, Math.floor(s.progN * s.u / 6) * 6);
    s.curve.getPointAt(Math.min(0.9999, Math.max(0, s.u)), s.packet.position);
    s.packet.position.y += 0.12 + Math.sin(t * 4) * 0.02;
    s.st.forEach((st, i) => { const on = s.active?.includes(i) || v.hover === st.g; st.icon.position.y += ((on ? 0.22 : 0.06) - st.icon.position.y) * Math.min(1, dt * 6); });
  },
  onHover(v, o) { v.s.st.forEach(st => st.name.el.classList.toggle('hover', st.g === o)); },
  onClick(v, o) { const el = document.querySelector(o.userData.href); el?.scrollIntoView({ behavior: ENV.REDUCED ? 'auto' : 'smooth', block: 'start' }); },
  steps: (() => {
    const seg = (a, b) => (v) => {
      const n = STATIONS.length - 1;
      v.s.active = Array.from({ length: b - a + 1 }, (_, k) => a + k);
      v.s.uTo = b / n;
      v.s.st.forEach((st, i) => st.name.el.classList.toggle('on', v.s.active.includes(i)));
    };
    return [
      { say: 'Crucible records real work and removes secrets. It reads pull requests, reviews, test runs, tickets and agent sessions.', go: seg(0, 0) },
      { say: 'Crucible finds the expert feedback in the records. It links each item to the step that it judges.', go: seg(1, 1) },
      { say: 'Crucible learns the stages and milestones of the work. It gives each step a progress value.', go: seg(2, 2) },
      { say: 'Crucible turns progress into a score for each step. Hidden checks decide the result.', go: seg(3, 4) },
      { say: 'Crucible builds new tasks from the solution first. Each task must pass eighteen quality checks.', go: seg(5, 6) },
      { say: 'Agents work in a simulated workplace with simulated people. Crucible records each model call and each step.', go: seg(7, 9) },
      { say: 'Crucible trains the model on the exact tokens. Benchmarks show where agents fail.', go: seg(10, 11) },
      { say: 'Crucible exports each run with its exact reward. New domains plug in as packs. Two commands do all of this.', go: seg(12, 14) },
    ];
  })(),
});

// ================================================================================================================== shared records
export const records = () => ({
  size: 4.6, target: [0.2, 0.75, 0], az: 0.72, elev: 0.5,
  setup(v) {
    const s = v.s = {};
    const slab = block(3.9, 0.12, 2.5); slab.position.set(-0.35, 0, 0); v.add(slab);
    const names = ['World', 'Record', 'Feedback', 'Milestone', 'Reward', 'Task', 'Run', 'Report'];
    s.home = []; s.tiles = []; s.stamps = [];
    names.forEach((n, i) => {
      const t = new THREE.Group();
      t.add(block(0.78, 0.05, 0.52));
      const st = cyl(0.07, 0.025, { color: PAL.cardinal, kind: 'gloss', edge: null }); st.position.set(0.26, 0.05, 0.14); st.scale.setScalar(0.001); t.add(st);
      s.stamps.push(st);
      const home = V(-1.95 + (i % 4) * 0.92, 1.35 + Math.floor(i / 4) * 0.02, -0.42 + Math.floor(i / 4) * 0.82);
      t.position.set(home.x + (Math.random() - 0.5) * 3, 2.6 + Math.random(), home.z + (Math.random() - 0.5) * 2);
      t.rotation.set(Math.random() * 0.6, Math.random() * 1.2, Math.random() * 0.4);
      v.add(t); s.tiles.push(t); s.home.push(home);
      v.label(n, anchor(t, 0, 0.12, 0), { cls: 'code' });
    });
    const bad = new THREE.Group(); bad.add(block(0.78, 0.05, 0.52, { edge: PAL.cardinal }));
    bad.position.set(-3.6, 1.35, 1.6); v.add(bad); s.bad = bad;
    s.badLabel = v.label('unknown field, rejected', anchor(bad, 0, 0.32, 0), { cls: 'red' }); s.badLabel.opacity = 0;
    const vault = new THREE.Group(); vault.position.set(2.3, 0, -0.1); v.add(vault);
    const cab = block(1.05, 1.5, 0.95); vault.add(cab);
    for (let r = 0; r < 4; r++) for (let c = 0; c < 2; c++) {
      const dr = new THREE.Mesh(new THREE.PlaneGeometry(0.44, 0.3), mat('clay')); dr.material = dr.material.clone(); dr.material.color.set(0xfaf8f7);
      dr.position.set(-0.24 + c * 0.48, 0.24 + r * 0.34, 0.476); vault.add(dr);
      const knob = sphere(0.025, { color: PAL.cardinal }); knob.position.set(-0.24 + c * 0.48, 0.24 + r * 0.34, 0.49); vault.add(knob);
    }
    s.vaultSlots = Array.from({ length: 8 }, (_, i) => V(2.3 - 0.24 + (i % 2) * 0.48, 0.24 + Math.floor(i / 2) * 0.34, 0.55));
    v.label('record store', anchor(vault, 0, 1.75, 0), { cls: '' });
    s.carts = ['coding', 'accounts payable', 'a new domain'].map((n, i) => {
      const c = cart(0.5, 0.12, 0.62, i === 2 ? PAL.cardinal : undefined); c.position.set(-1.6 + i * 0.9, 0.12, 2.3); v.add(c);
      const lb = v.label(n, anchor(c, 0, 0.3, 0), { cls: 'code' }); lb.opacity = 0;
      return { c, lb };
    });
    s.regLabel = v.label('pack registry', V(-0.35, 0.12, 1.25), { cls: 'ghost' });
    s.hash = v.label('standard form, content hash', V(-0.5, 2.25, 0.2), { cls: 'red' }); s.hash.opacity = 0;
  },
  update(v, t) { v.s.stamps.forEach((st, i) => { st.rotation.y = t + i; }); },
  steps: [
    { say: 'Each record type has a versioned format. Worlds, records, feedback, milestones, rewards, tasks and runs all use one.', go(v) {
      const s = v.s; s.tiles.forEach((t, i) => { moveTo(v, t, s.home[i].toArray(), 1.1); v.tw.to(t, 'rotation', V(0, 0, 0), 1.1); scaleTo(v, t, 1); });
      s.stamps.forEach(st => scaleTo(v, st, 0.001)); moveTo(v, s.bad, [-3.6, 1.35, 1.6]); show(v, s.badLabel, false); show(v, s.hash, false);
      s.carts.forEach(({ c, lb }, i) => { moveTo(v, c, [-1.6 + i * 0.9, 0.12, 2.3]); show(v, lb, false); });
    } },
    { say: 'Crucible rejects a record with an unknown field or the wrong version.', go(v) {
      const s = v.s; moveTo(v, s.bad, [-2.4, 1.35, 0.6], 0.7); show(v, s.badLabel, true);
      v.later(() => moveTo(v, s.bad, [-3.9, 1.0, 1.9], 0.8), 750);
    } },
    { say: 'Crucible writes each accepted record in one standard form and gives it a content hash.', go(v) {
      const s = v.s; s.stamps.forEach(st => scaleTo(v, st, 1, 0.5)); show(v, s.hash, true); show(v, s.badLabel, false);
    } },
    { say: 'Crucible stores the records by their hash. It finds damaged records when it reads them.', go(v) {
      const s = v.s; s.tiles.forEach((t, i) => { moveTo(v, t, s.vaultSlots[i].toArray(), 1.0 + i * 0.05); scaleTo(v, t, 0.42, 1.0); }); show(v, s.hash, false);
    } },
    { say: 'Domain packs add themselves to the registry. The base does not depend on them.', go(v) {
      const s = v.s; s.carts.forEach(({ c, lb }, i) => { moveTo(v, c, [-1.6 + i * 0.9, 0.12, 0.95], 0.9 + i * 0.15); show(v, lb, true); });
    } },
  ],
});

// ================================================================================================================== simulated workplace
export const workplace = () => ({
  size: 5.0, target: [0, 0.8, 0], az: 0.78, elev: 0.52,
  setup(v) {
    const s = v.s = {};
    const plat = cyl(2.15, 0.12, { seg: 80 }); v.add(plat);
    const apps = new THREE.Group(); apps.position.y = 0.12; v.add(apps); s.apps = apps;
    const db = dbStack(0.3, 3); db.position.set(-1.0, 0, -0.55);
    const docs = sheetStack(3, 0.55, 0.7); docs.position.set(0.95, 0, -0.75);
    const mail = new THREE.Group(); const mb = block(0.62, 0.42, 0.46); mail.add(mb); const slot = new THREE.Mesh(new THREE.PlaneGeometry(0.36, 0.04), mat('flat', PAL.ink)); slot.position.set(0, 0.32, 0.232); mail.add(slot); mail.position.set(1.0, 0, 0.75);
    const ws = terminal(0.72, 0.5, 0.45); ws.position.set(-0.95, 0, 0.8);
    const router = cyl(0.2, 0.32, { color: PAL.cardinal, kind: 'gloss' });
    s.appList = [db, docs, mail, ws]; s.homes = s.appList.map(a => a.position.clone());
    apps.add(db, docs, mail, ws, router);
    [[db, 'database'], [docs, 'documents'], [mail, 'inbox'], [ws, 'workspace']].forEach(([o, n]) => v.label(n, anchor(o, 0, 0.95, 0)));
    s.routerLabel = v.label('one gate for actions', anchor(router, 0, 0.7, 0), { cls: 'red' });
    [db, docs, mail, ws].forEach(o => v.add(tube(arc(V(0, 0.3, 0), V(o.position.x, 0.25, o.position.z), 0.25), 0.01, PAL.rule)));
    // clock
    const clock = ring(2.45, 0.016, PAL.stone, 'clay'); clock.position.y = 0.06; v.add(clock);
    for (let i = 0; i < 24; i++) { const a = i / 24 * Math.PI * 2; const tk = block(0.03, 0.05 + (i % 6 ? 0 : 0.06), 0.1, { edge: null }); tk.position.set(Math.cos(a) * 2.45, 0.04, Math.sin(a) * 2.45); tk.rotation.y = -a; v.add(tk); }
    s.hand = sphere(0.07, { color: PAL.cardinal }); v.add(s.hand); s.handA = 0; s.handSpeed = 0.25;
    s.clockLabel = v.label('world clock 9.30', anchor(s.hand, 0, 0.3, 0), { cls: '' }); s.clockLabel.opacity = 0;
    // actors + policy
    s.agent = sphere(0.16, { color: PAL.cardinal }); s.agent.position.set(-2.9, 0.3, 1.6); v.add(s.agent);
    v.label('agent', anchor(s.agent, 0, 0.4, 0), { cls: 'tag' });
    s.actors = [pawn(0xffffff, 'clay', 0.85), pawn(0xffffff, 'clay', 0.85)];
    s.actors.forEach(a => v.add(a));
    v.label('customer', anchor(s.actors[0], 0, 0.75, 0)); v.label('supervisor', anchor(s.actors[1], 0, 0.75, 0));
    s.callFlow = v.flow(arc(V(-2.8, 0.35, 1.5), V(0, 0.5, 0), 0.9), { count: 4, speed: 0.3, r: 0.05 });
    s.dbFlow = v.flow(arc(V(0, 0.5, 0), V(-1.0, 0.75, -0.55), 0.5), { count: 3, speed: 0.4, r: 0.045 });
    s.eventFlow = v.flow(arc(V(2.2, 0.2, 1.1), V(1.0, 0.6, 0.75), 0.6), { count: 3, speed: 0.35, r: 0.05, color: PAL.ink }); s.eventFlow.target = 0;
    s.callLabel = v.label('format, permission, time limit', V(-1.5, 1.45, 0.8), { cls: 'code' }); s.callLabel.opacity = 0;
    // snapshot ghost
    const ghost = new THREE.Group(); ghost.position.y = 0.12;
    [db, docs, mail, ws].forEach(o => { const c = o.clone(true); c.traverse(m => { if (m.isMesh) m.material = mat('glass', PAL.cardinal); }); ghost.add(c); });
    v.add(ghost); s.ghost = ghost; v.setAlpha(ghost, 0);
    s.fp = v.label('fingerprint saved', V(0, 2.95, 0), { cls: 'red' }); s.fp.opacity = 0;
    s.ok = v.label('fingerprints match', V(0, 2.95, 0), { cls: 'pass' }); s.ok.opacity = 0;
    // membrane
    const dome = new THREE.Mesh(new THREE.SphereGeometry(2.75, 48, 24, 0, Math.PI * 2, 0, Math.PI / 2), mat('glass', 0xffffff));
    dome.material = dome.material.clone(); dome.material.opacity = 0.14; dome.material.side = THREE.DoubleSide;
    v.add(dome); s.dome = dome; v.setAlpha(dome, 0);
    const probeC = arc(V(-0.95, 0.75, 0.8), V(-2.0, 1.75, 1.6), 0.5);
    s.probe = v.flow(probeC, { count: 3, speed: 0.5, r: 0.05, color: PAL.ink }); s.probe.target = 0;
    s.egress = v.label('no network access', V(-2.15, 2.05, 1.7), { cls: 'red' }); s.egress.opacity = 0;
  },
  update(v, t, dt) {
    const s = v.s;
    s.handA += dt * s.handSpeed; s.hand.position.set(Math.cos(s.handA) * 2.45, 0.08, Math.sin(s.handA) * 2.45);
    s.actors[0].position.set(Math.cos(t * 0.18 + 2) * 2.8, 0, Math.sin(t * 0.18 + 2) * 2.8);
    s.actors[1].position.set(Math.cos(t * 0.18 + 4.3) * 2.8, 0, Math.sin(t * 0.18 + 4.3) * 2.8);
  },
  steps: [
    { say: 'Crucible makes a live workplace from a spec. It has apps with data and tools, people and a clock.', go(v) {
      const s = v.s; s.handSpeed = 0.25; s.eventFlow.target = 0; s.probe.target = 0; v.fade(s.ghost, 0); v.fade(s.dome, 0);
      [s.fp, s.ok, s.egress, s.clockLabel, s.callLabel].forEach(l => show(v, l, false));
      s.appList.forEach((a, i) => { moveTo(v, a, s.homes[i].toArray()); v.tw.to(a, 'rotation', V(0, 0, 0)); });
    } },
    { say: 'Each tool call goes through one gate. The gate checks the format, the permission, the time and the output size.', go(v) { show(v, v.s.callLabel, true); } },
    { say: 'Events occur on world time. A reply arrives. A rule changes during the shift.', go(v) { const s = v.s; s.handSpeed = 1.4; s.eventFlow.target = 1; show(v, s.clockLabel, true); show(v, s.callLabel, false); } },
    { say: 'A snapshot records a fingerprint of each app, the clock and each inbox.', go(v) {
      const s = v.s; s.handSpeed = 0.25; s.eventFlow.target = 0; show(v, s.clockLabel, false);
      v.fade(s.ghost, 1); v.tw.to(s.ghost.position, 'y', 1.95, 1.0); show(v, s.fp, true);
    } },
    { say: 'The agent continues to change the world.', go(v) {
      const s = v.s; s.appList.forEach((a, i) => { moveTo(v, a, [s.homes[i].x * 0.6 + (i % 2 ? 0.5 : -0.4), 0, s.homes[i].z * 1.1 + (i < 2 ? 0.3 : -0.25)]); v.tw.to(a, 'rotation', V(0, (i - 1.5) * 0.7, 0)); });
    } },
    { say: 'A restore puts each app back exactly. Matching fingerprints prove it.', go(v) {
      const s = v.s; s.appList.forEach((a, i) => { moveTo(v, a, s.homes[i].toArray(), 1.1); v.tw.to(a, 'rotation', V(0, 0, 0), 1.1); });
      v.tw.to(s.ghost.position, 'y', 0.12, 1.1); v.later(() => v.fade(s.ghost, 0), 900); show(v, s.fp, false); show(v, s.ok, true);
    } },
    { say: 'The agent runs as a user with few permissions. It cannot get out to the network.', go(v) {
      const s = v.s; show(v, s.ok, false); v.fade(s.dome, 1); s.probe.target = 1; show(v, s.egress, true);
    } },
  ],
});

// ================================================================================================================== simulated people
export const people = () => ({
  size: 4.7, target: [0, 0.7, 0], az: 0.7, elev: 0.5,
  setup(v) {
    const s = v.s = {};
    v.add(dotGrid(6, 5, 0.3, { size: 1.8 }));
    const ped = cyl(0.42, 0.14, { seg: 48 }); v.add(ped);
    s.agent = sphere(0.24, { color: PAL.cardinal }); s.agent.position.y = 0.42; v.add(s.agent);
    v.label('agent', anchor(s.agent, 0, 0.45, 0), { cls: 'tag' });
    const defs = [['customer', [-1.75, 0, 0.55]], ['supervisor', [1.6, 0, 0.75]], ['reviewer', [0.15, 0, -1.75]]];
    s.people = defs.map(([n, p]) => {
      const g = new THREE.Group(); g.position.set(...p); v.add(g);
      g.add(pawn(0xffffff, 'clay', 1.1));
      const cab = new THREE.Group(); cab.position.set(p[0] > 0 ? 0.6 : -0.6, 0, -0.35); g.add(cab);
      const cards = [];
      for (let i = 0; i < 6; i++) { const c = block(0.42, 0.03, 0.3, { color: i < 4 ? undefined : 0xeeeae8 }); c.position.y = i * 0.07; cab.add(c); cards.push(c); }
      v.label(n, anchor(g, 0, 0.95, 0));
      return { g, cab, cards, n };
    });
    const people = s.people;
    s.ask = v.flow(arc(V(0, 0.55, 0), V(-1.75, 0.55, 0.55), 0.7), { count: 3, speed: 0.4, r: 0.05, color: PAL.ink }); s.ask.target = 0;
    s.reply = v.flow(arc(V(-1.75, 0.6, 0.55), V(0, 0.6, 0), 0.9), { count: 3, speed: 0.4, r: 0.055 }); s.reply.target = 0;
    s.ask2 = v.flow(arc(V(0, 0.55, 0), V(1.6, 0.55, 0.75), 0.7), { count: 3, speed: 0.4, r: 0.05, color: PAL.ink }); s.ask2.target = 0;
    s.rev = v.flow(arc(V(0.15, 0.6, -1.75), V(1.7, 0.4, -1.4), 0.5), { count: 3, speed: 0.4, r: 0.05 }); s.rev.target = 0;
    const code = terminal(0.7, 0.45, 0.4); code.position.set(1.85, 0, -1.55); code.rotation.y = -0.6; v.add(code);
    v.label('code under review', anchor(code, 0, 0.8, 0), { cls: 'ghost' });
    s.future = v.label('hidden until 10.40', anchor(people[0].cab, 0, 0.62, 0), { cls: 'code' }); s.future.opacity = 0;
    s.quote = v.label('“Charged twice for order 5521.” <span style="color:#8c1515">[rec 1001]</span>', V(-0.9, 1.75, 0.3), { cls: 'serif', html: true }); s.quote.opacity = 0;
    s.none = v.label('“I have no record of that.”', V(1.4, 1.75, 0.6), { cls: 'serif' }); s.none.opacity = 0;
    s.revL = v.label('replays a real comment at line 212', V(1.2, 1.5, -1.6), { cls: 'code' }); s.revL.opacity = 0;
    s.cite = [];
    for (let i = 0; i < 2; i++) { const l = line([V(-2.35, 0.1 + i * 0.07, 0.2), V(-0.9, 1.6, 0.3)], PAL.cardinal, 'lineT'); v.add(l); v.setAlpha(l, 0); s.cite.push(l); }
  },
  update(v, t) { v.s.agent.position.y = 0.42 + Math.sin(t * 2) * 0.03; },
  steps: [
    { say: 'All people other than the agent live inside the world. These are customers, approvers and reviewers.', go(v) {
      const s = v.s; [s.ask, s.reply, s.ask2, s.rev].forEach(f => f.target = 0); [s.future, s.quote, s.none, s.revL].forEach(l => show(v, l, false));
      s.cite.forEach(l => v.fade(l, 0)); s.people[0].cards.forEach((c, i) => { v.tw.to(c.position, 'y', i * 0.07); v.fade(c, 1); });
    } },
    { say: 'The agent asks a customer a question.', go(v) { v.s.ask.target = 1; } },
    { say: 'The simulated person sees only the records written before the current world time.', go(v) {
      const s = v.s; s.people[0].cards.forEach((c, i) => { if (i >= 4) v.fade(c, 0.12); else v.tw.to(c.position, 'y', i * 0.07 + (i >= 2 ? 0.35 : 0)); }); show(v, s.future, true);
    } },
    { say: 'Crucible builds the reply from quoted records. Each sentence shows its source.', go(v) {
      const s = v.s; s.ask.target = 0; s.reply.target = 1; show(v, s.quote, true); s.cite.forEach(l => v.fade(l, 1)); show(v, s.future, false);
    } },
    { say: 'If no record answers the question, the person says “I have no record of that.”', go(v) {
      const s = v.s; s.reply.target = 0; s.ask2.target = 1; show(v, s.quote, false); s.cite.forEach(l => v.fade(l, 0)); show(v, s.none, true);
    } },
    { say: 'The reviewer replays real review comments at the matching lines of code.', go(v) {
      const s = v.s; s.ask2.target = 0; s.rev.target = 1; show(v, s.none, false); show(v, s.revL, true);
    } },
  ],
});

// ================================================================================================================== work capture
export const capture = () => ({
  size: 4.8, target: [0, 0.7, 0], az: 0.62, elev: 0.48,
  setup(v) {
    const s = v.s = {};
    const srcs = [
      ['logs', sheetStack(3, 0.46, 0.56)], ['audit table', dbStack(0.24, 3)], ['chat traffic', bubble(0.5, 0.3)],
      ['code history', gitGraph()], ['test reports', testStack()],
    ];
    s.src = srcs.map(([n, o], i) => {
      const g = new THREE.Group(); g.position.set(-2.55, 0, -1.7 + i * 0.85); g.add(o); v.add(g);
      v.label(n, anchor(g, -0.55, 0.25, 0), { align: 'right' });
      return g;
    });
    const gate = arch(1.1, 1.25, 0.12); gate.position.set(-0.2, 0, 0); gate.rotation.y = Math.PI / 2; v.add(gate);
    const laser = new THREE.Mesh(new THREE.PlaneGeometry(1.0, 1.1), mat('flatT', PAL.cardinal));
    laser.material = laser.material.clone(); laser.material.opacity = 0.1; laser.material.side = THREE.DoubleSide;
    laser.rotation.y = Math.PI / 2; laser.position.set(-0.2, 0.62, 0); v.add(laser); s.laser = laser;
    const scan = new THREE.Mesh(new THREE.BoxGeometry(0.02, 0.02, 1.0), mat('flat', PAL.bright)); scan.position.set(-0.2, 0.6, 0); v.add(scan); s.scan = scan;
    v.label('remove secrets', anchor(gate, 0, 1.5, 0), { cls: 'tag' });
    s.pre = s.src.map((g, i) => v.flow(arc(V(-2.2, 0.5, g.position.z), V(-0.35, 0.6, 0), 0.4), { count: 3, speed: 0.22, r: 0.045, color: PAL.cardinal, offset: i * 0.2 }));
    const track = block(2.0, 0.04, 0.3); track.position.set(1.05, 0, 0); v.add(track);
    s.post = v.flow(arc(V(-0.05, 0.25, 0), V(2.0, 0.25, 0), 0.08), { count: 5, speed: 0.25, r: 0.05, color: PAL.ink });
    const rack = new THREE.Group(); rack.position.set(2.6, 0, 0); v.add(rack);
    const frame = block(0.7, 1.6, 1.3, { kind: 'glass', edge: PAL.stone }); rack.add(frame);
    s.slots = [];
    for (let r = 0; r < 4; r++) for (let c = 0; c < 2; c++) s.slots.push(V(2.6, 0.18 + r * 0.38, -0.3 + c * 0.6));
    s.carts = s.slots.map(p => { const c = block(0.42, 0.2, 0.42, { color: PAL.cardinal, kind: 'gloss' }); c.position.copy(p); c.position.y += 2.2; v.add(c); v.setAlpha(c, 0); return c; });
    s.dup = block(0.42, 0.2, 0.42, { color: PAL.cardinal, kind: 'gloss' }); s.dup.position.set(1.0, 1.9, 0.3); v.add(s.dup); v.setAlpha(s.dup, 0);
    v.label('record store', anchor(rack, 0, 1.9, 0));
    s.sec = v.label('secret key becomes an alias', V(-0.3, 1.75, 0.2), { cls: 'code', html: true }); s.sec.opacity = 0;
    s.hash = v.label('content hash', V(2.6, 2.2, 0.6), { cls: 'red' }); s.hash.opacity = 0;
    s.same = v.label('same content, same hash', V(1.3, 2.5, 0.3), { cls: 'pass' }); s.same.opacity = 0;
  },
  update(v, t) { v.s.scan.position.y = 0.15 + (Math.sin(t * 2.4) * 0.5 + 0.5) * 1.0; },
  steps: [
    { say: 'Connectors find cases, sessions, pull requests, audit rows and logs.', go(v) {
      const s = v.s; s.pre.forEach(f => f.target = 0); s.post.target = 0; [s.sec, s.hash, s.same].forEach(l => show(v, l, false));
      s.carts.forEach(c => { v.fade(c, 0); v.tw.to(c.position, 'y', c.position.y < 2 ? c.position.y + 2.2 : c.position.y, 0.4); }); v.fade(s.dup, 0);
      s.src.forEach((g, i) => { v.tw.to(g.position, 'y', 0.25, 0.4); v.later(() => v.tw.to(g.position, 'y', 0, 0.5), 500 + i * 80); });
    } },
    { say: 'Crucible turns each item into events. Each event shows who did what, and when.', go(v) { v.s.pre.forEach(f => f.target = 1); } },
    { say: 'Crucible removes secrets, keys and personal IDs before it stores anything. Each secret becomes a stable alias.', go(v) { v.s.post.target = 1; show(v, v.s.sec, true); v.s.laser.material.opacity = 0.22; } },
    { say: 'Crucible stores the records by their hash and checks their format.', go(v) {
      const s = v.s; show(v, s.sec, false); s.laser.material.opacity = 0.1; show(v, s.hash, true);
      s.carts.forEach((c, i) => v.later(() => { v.fade(c, 1); v.tw.to(c.position, 'y', s.slots[i].y, 0.7); }, i * 140));
    } },
    { say: 'A second import of the same source gives the same hash. Crucible does not store anything twice.', go(v) {
      const s = v.s; show(v, s.hash, false); v.fade(s.dup, 1); s.dup.position.set(1.0, 1.9, 0.3); moveTo(v, s.dup, [s.slots[7].x, s.slots[7].y + 0.02, s.slots[7].z], 1.2); show(v, s.same, true);
      v.later(() => v.fade(s.dup, 0), 1300);
    } },
  ],
});

// ================================================================================================================== expert feedback
export const feedback = () => ({
  size: 4.6, target: [0, 0.8, 0], az: 0.55, elev: 0.5,
  setup(v) {
    const s = v.s = {};
    const base = block(6.6, 0.06, 1.2); base.position.set(0, 0, 0); v.add(base);
    const names = ['read', 'edit', 'test', 'edit', 'submit', 'review', 'fix', 'merge'];
    s.blocks = names.map((n, i) => {
      const b = block(0.5, 0.28, 0.5, { color: n === 'fix' ? PAL.blush : undefined }); b.position.set(-2.8 + i * 0.8, 0.06, 0); v.add(b);
      v.label(n, anchor(b, 0, -0.02, 0.55), { cls: 'ghost' });
      return b;
    });
    const sig = [
      { at: 5, writer: 3, color: PAL.cardinal, name: 'correction −', rel: 0.987 },
      { at: 2, writer: 1, color: PAL.pass, name: 'check result +', rel: 0.96 },
      { at: 7, writer: 6, color: PAL.pass, name: 'approval +', rel: 0.952 },
      { at: 5, writer: 4, color: PAL.warn, name: 'rejection −', rel: 0.043 },
    ];
    s.sig = sig.map((d, k) => {
      const f = sphere(0.11, { color: d.color, kind: 'gloss' });
      const x = -2.8 + d.at * 0.8 + (k === 3 ? 0.28 : 0);
      f.position.set(x, 3.4, k === 3 ? 0.2 : -0.1); v.add(f);
      const lab = v.label(d.name, anchor(f, 0, 0.28, 0), { cls: 'code' }); lab.opacity = 0;
      const rel = v.label(d.rel.toFixed(3), anchor(f, 0.32, 0, 0), { cls: 'red', align: 'left' }); rel.opacity = 0;
      const thread = tube(arc(V(x, 0.6, f.position.z), V(-2.8 + d.writer * 0.8, 0.36, 0), 0.9), 0.012, d.color, 'gloss');
      v.add(thread); v.setAlpha(thread, 0);
      return { f, lab, rel, thread, d, x };
    });
    const ghost = block(0.5, 0.28, 0.5, { kind: 'glass', edge: PAL.cardinal }); ghost.position.set(-2.8 + 3 * 0.8, 0.06, 0); v.add(ghost); s.ghost = ghost; v.setAlpha(ghost, 0);
    s.pair = v.label('wrong step and its fix', V(-0.4, 1.35, -1.0), { cls: 'code', html: true }); s.pair.opacity = 0;
    s.lw = v.label('linked to the last change', V(0.2, 2.1, 0.2), { cls: 'red' }); s.lw.opacity = 0;
  },
  steps: [
    { say: 'Each pack maps its raw events onto thirteen standard feedback types.', go(v) {
      const s = v.s; s.sig.forEach((g, k) => { v.tw.to(g.f.position, 'y', 2.3 + (k % 2) * 0.3, 0.9); show(v, g.lab, false); show(v, g.rel, false); v.fade(g.thread, 0); scaleTo(v, g.f, 1); v.fade(g.f, 1); });
      v.fade(s.ghost, 0); show(v, s.pair, false); show(v, s.lw, false); v.tw.to(s.blocks[3].position, 'z', 0);
    } },
    { say: 'Each feedback item gets a type and a sign. Corrections and rejections are negative. Approvals are positive.', go(v) { v.s.sig.forEach(g => show(v, g.lab, true)); } },
    { say: 'Crucible links each item to the last step that changed the object it judges.', go(v) {
      const s = v.s; s.sig.forEach(g => { v.fade(g.thread, 1); v.tw.to(g.f.position, 'y', 0.75, 0.9); }); show(v, s.lw, true);
    } },
    { say: 'Crucible learns how much to trust each type from what happened next. Weak feedback has less effect on the reward.', go(v) {
      const s = v.s; show(v, s.lw, false); s.sig.forEach(g => { show(v, g.rel, true); if (g.d.rel < 0.5) { v.fade(g.f, 0.25); v.fade(g.thread, 0.15); scaleTo(v, g.f, 0.6); } });
    } },
    { say: 'Each corrected error becomes a training pair. The pair shows the wrong step and its fix.', go(v) {
      const s = v.s; v.fade(s.ghost, 1); v.tw.to(s.ghost.position, 'z', -0.85, 0.9); show(v, s.pair, true);
    } },
  ],
});

// ================================================================================================================== workflow map
export const workflow = () => ({
  size: 4.6, target: [0, 0.8, 0], az: 0.62, elev: 0.55,
  setup(v) {
    const s = v.s = {};
    v.add(dotGrid(7, 4, 0.3, { size: 1.8 }));
    s.ribbons = [];
    for (let k = 0; k < 5; k++) {
      const pts = [], tidy = [];
      for (let i = 0; i <= 12; i++) {
        const x = -3 + i * 0.5;
        pts.push(V(x, 0.15 + Math.random() * 0.5, -1.2 + k * 0.6 + (Math.random() - 0.5) * 0.7));
        tidy.push(V(x, 0.12, -1.2 + k * 0.6));
      }
      const geo = new THREE.BufferGeometry().setFromPoints(pts);
      const l = new THREE.Line(geo, mat('line', k === 2 ? PAL.cardinal : PAL.stone)); v.add(l);
      const dots = points(pts.flatMap(p => [p.x, p.y, p.z]), { color: k === 2 ? PAL.cardinal : PAL.grey, size: 3.2 });
      v.add(dots);
      s.ribbons.push({ l, dots, pts, tidy, cur: pts.map(p => p.clone()), k: 0 });
    }
    s.tidyK = 0; s.tidyTo = 0;
    const xs = [-2.3, -1.5, -0.4, 0.5, 1.5, 2.4];
    s.beacons = xs.map((x, i) => {
      const g = new THREE.Group(); g.position.set(x, 0, 1.75); v.add(g);
      const post = cyl(0.035, 1.0, { edge: null, seg: 10 }); g.add(post);
      const cap = sphere(0.09, { color: PAL.cardinal }); cap.position.y = 1.05; g.add(cap);
      g.scale.set(1, 0.001, 1);
      return { g, cap, drop: i === 1 || i === 4 };
    });
    s.bands = [[-2.3, -0.4], [0.5, 1.5], [2.4, 2.4]].map(([a, b], i) => {
      const w = b - a + 0.7; const m = block(w, 1.2, 0.5, { kind: 'glass', edge: PAL.cardinal });
      m.position.set((a + b) / 2, 0, 1.75); v.add(m); v.setAlpha(m, 0);
      const lab = v.label(['understand', 'change', 'verify'][i], anchor(m, 0, 1.45, 0), { cls: 'red' }); lab.opacity = 0;
      return { m, lab };
    });
    s.token = sphere(0.12, { color: PAL.cardinal }); s.token.position.set(-3, 0.3, 1.75); v.add(s.token); s.token.visible = false;
    s.tokX = -3; s.here = v.label('current position', anchor(s.token, 0, 0.4, 0), { cls: 'tag' }); s.here.opacity = 0;
    s.rep = v.label('rebuilt state matches the record', V(0, 1.4, -0.2), { cls: 'pass' }); s.rep.opacity = 0;
    s.drop = v.label('dropped, true at the start', V(1.5, 1.7, 1.75), { cls: 'code' }); s.drop.opacity = 0;
  },
  update(v, t, dt) {
    const s = v.s;
    s.tidyK += (s.tidyTo - s.tidyK) * Math.min(1, dt * 2);
    s.ribbons.forEach(r => {
      const a = r.l.geometry.attributes.position, b = r.dots.geometry.attributes.position;
      r.pts.forEach((p, i) => { const q = r.cur[i].lerpVectors(p, r.tidy[i], s.tidyK); a.setXYZ(i, q.x, q.y, q.z); b.setXYZ(i, q.x, q.y, q.z); });
      a.needsUpdate = true; b.needsUpdate = true;
    });
    if (s.token.visible) {
      s.tokX += dt * 0.7; if (s.tokX > 2.9) s.tokX = -3;
      s.token.position.x = s.tokX;
      s.beacons.forEach(b => { if (b.g.scale.y > 0.5) b.cap.scale.setScalar(s.tokX > b.g.position.x ? 1.35 : 1); });
    }
  },
  steps: [
    { say: 'Crucible cuts each record into steps. Each step is one change of state.', go(v) {
      const s = v.s; s.tidyTo = 0; s.beacons.forEach(b => v.tw.to(b.g, 'scale', V(1, 0.001, 1), 0.5)); s.bands.forEach(b => { v.fade(b.m, 0); show(v, b.lab, false); });
      s.token.visible = false; [s.here, s.rep, s.drop].forEach(l => show(v, l, false));
    } },
    { say: 'Crucible rebuilds the state after each step. The state must match the record.', go(v) { v.s.tidyTo = 1; show(v, v.s.rep, true); } },
    { say: 'Crucible finds milestones in changes, test results and reviews. A milestone is a fact about the state that Crucible can check.', go(v) {
      const s = v.s; show(v, s.rep, false); s.beacons.forEach((b, i) => v.later(() => v.tw.to(b.g, 'scale', V(1, 1, 1), 0.7), i * 120));
    } },
    { say: 'Crucible keeps only real milestones. Each one must not be trivial, must not go back, and must predict success.', go(v) {
      const s = v.s; s.beacons.forEach(b => { if (b.drop) v.tw.to(b.g, 'scale', V(1, 0.001, 1), 0.8); }); show(v, s.drop, true);
    } },
    { say: 'Crucible finds the stages from the order of milestones. One milestone must come before the other in 90% of records.', go(v) {
      const s = v.s; show(v, s.drop, false); s.bands.forEach((b, i) => v.later(() => { v.fade(b.m, 1); show(v, b.lab, true); }, i * 200));
    } },
    { say: 'One tracker tells each agent how far it is in the work.', go(v) { const s = v.s; s.token.visible = true; s.tokX = -3; show(v, s.here, true); } },
  ],
});

// ================================================================================================================== step scores
export const scores = () => ({
  size: 4.6, target: [0, 1.0, 0], az: 0.5, elev: 0.38,
  setup(v) {
    const s = v.s = {};
    const phi = [0.0, 0.12, 0.25, 0.4, 0.6, 0.45, 0.6, 0.8, 1.0];
    s.phi = phi; s.H = 2.2;
    s.cols = phi.map((p, i) => {
      const c = block(0.5, 1, 0.6, { color: i === 5 ? PAL.blush : undefined }); c.position.set(-2.6 + i * 0.6, 0, 0); c.scale.y = 0.02; v.add(c); return c;
    });
    s.dbars = phi.map((p, i) => {
      const d = i ? p - phi[i - 1] : 0;
      const b = block(0.12, 1, 0.12, { color: d >= 0 ? PAL.cardinal : PAL.ink, kind: 'gloss', edge: null });
      b.position.set(-2.6 + i * 0.6, 0, 0.6); b.scale.y = 0.001; v.add(b); b.userData.d = d; return b;
    });
    s.climber = sphere(0.13, { color: PAL.cardinal }); v.add(s.climber); s.cu = 0; s.climbing = false;
    const gate = arch(0.9, 1.4, 0.1, PAL.cardinal, 'gloss'); gate.position.set(3.05, 0, 0); gate.rotation.y = Math.PI / 2; v.add(gate);
    const barG = block(0.06, 0.06, 0.9, { color: PAL.cardinal, kind: 'gloss', edge: null }); barG.position.set(3.05, 0.7, 0); v.add(barG); s.bar = barG; v.setAlpha(barG, 0);
    s.ingot = block(0.4, 0.22, 0.28, { color: PAL.cardinal, kind: 'gloss' }); s.ingot.position.set(3.05, 3.2, 0); v.add(s.ingot); v.setAlpha(s.ingot, 0);
    const cap = line([V(-2.9, 0.3 * s.H + 0.02, -0.4), V(2.6, 0.3 * s.H + 0.02, -0.4)], PAL.stone, 'dash'); v.add(cap); s.cap = cap; v.setAlpha(cap, 0);
    s.capL = v.label('partial work stays below success', V(-2.4, 0.3 * s.H + 0.25, -0.4), { cls: 'code', html: true, align: 'left' }); s.capL.opacity = 0;
    s.phiL = v.label('progress is the share of milestones met', V(-1.0, 2.75, 0), { cls: 'red' }); s.phiL.opacity = 0;
    s.loop = v.label('minus 0.15, then plus 0.15, net 0', V(0.5, 2.0, 0.5), { cls: 'code' }); s.loop.opacity = 0;
    s.zero = v.label('rule broken, score 0', V(1.6, 1.4, 0), { cls: 'red' }); s.zero.opacity = 0;
    s.full = v.label('success, score 1', V(3.05, 2.2, 0), { cls: 'tag' }); s.full.opacity = 0;
    v.label('rule gate', anchor(gate, 0, 1.75, 0), { cls: 'ghost' });
  },
  update(v, t, dt) {
    const s = v.s;
    if (s.climbing) { s.cu = (s.cu + dt * 0.5) % 1; }
    const f = s.cu * (s.cols.length - 1), i = Math.floor(f), k = f - i;
    const a = s.cols[i], b = s.cols[Math.min(i + 1, s.cols.length - 1)];
    const ya = a.scale.y, yb = b.scale.y;
    s.climber.position.set(a.position.x + (b.position.x - a.position.x) * k, ya + (yb - ya) * k + 0.14 + Math.sin(k * Math.PI) * 0.2, 0);
  },
  steps: [
    { say: 'Crucible checks the milestones at each step. Each check stays in its cost limit.', go(v) {
      const s = v.s; s.climbing = false; s.cu = 0; s.cols.forEach(c => v.tw.to(c.scale, 'y', 0.02)); s.dbars.forEach(b => v.tw.to(b.scale, 'y', 0.001));
      [s.capL, s.phiL, s.loop, s.zero, s.full].forEach(l => show(v, l, false)); v.fade(s.bar, 0); v.fade(s.ingot, 0); v.fade(s.cap, 0);
    } },
    { say: 'Progress is the weighted share of complete milestones. A milestone counts only when its earlier milestones are complete.', go(v) {
      const s = v.s; s.cols.forEach((c, i) => v.tw.to(c.scale, 'y', Math.max(0.02, s.phi[i] * s.H), 0.8 + i * 0.05)); show(v, s.phiL, true);
    } },
    { say: 'Each step earns its change in progress. The sum of the step scores equals the final progress.', go(v) {
      const s = v.s; show(v, s.phiL, false); s.climbing = true; s.dbars.forEach(b => v.tw.to(b.scale, 'y', Math.max(0.001, Math.abs(b.userData.d) * s.H * 1.4), 0.7));
    } },
    { say: 'An action that the agent undoes and then repeats produces two scores that cancel. Cycles yield zero net reward.', go(v) { show(v, v.s.loop, true); } },
    { say: 'A violation of a hard constraint sets the episode reward to zero.', go(v) {
      const s = v.s; show(v, s.loop, false); v.fade(s.bar, 1); s.cols.forEach(c => v.tw.to(c.scale, 'y', 0.02, 0.8)); s.dbars.forEach(b => v.tw.to(b.scale, 'y', 0.001)); show(v, s.zero, true); s.climbing = false;
    } },
    { say: 'Partial completion remains below success. Only a completed task receives the full reward.', go(v) {
      const s = v.s; show(v, s.zero, false); v.fade(s.bar, 0); s.cols.forEach((c, i) => v.tw.to(c.scale, 'y', Math.max(0.02, s.phi[i] * s.H), 0.8));
      v.fade(s.cap, 1); show(v, s.capL, true); v.fade(s.ingot, 1); s.ingot.position.y = 3.2; v.tw.to(s.ingot.position, 'y', 0.02, 1.0, 'out'); show(v, s.full, true); s.climbing = true;
    } },
  ],
});

// ================================================================================================================== result checks
export const checks = () => ({
  size: 4.6, target: [0, 0.8, 0], az: 0.68, elev: 0.48,
  setup(v) {
    const s = v.s = {};
    const floor = block(6, 0.06, 2.8); v.add(floor);
    const wall = block(0.06, 1.9, 2.6, { kind: 'glass', edge: PAL.stone }); wall.position.set(0, 0.06, 0); v.add(wall);
    v.label('one-way glass', anchor(wall, 0, 2.15, 0), { cls: 'ghost' });
    const cell = block(2.1, 1.4, 2.0, { kind: 'glass', edge: PAL.ink }); cell.position.set(-1.6, 0.06, 0); v.add(cell);
    s.cand = cube(0.42, { color: PAL.ink, kind: 'gloss' }); s.cand.position.set(-1.7, 0.06, 0); v.add(s.cand);
    v.label('attempt, few permissions', anchor(cell, 0, 1.7, 0));
    s.boxes = [0, 1, 2].map(i => { const b = cube(0.18, {}); b.position.set(-1.2, 0.08, -0.5 + i * 0.5); v.add(b); return b; });
    s.boxT = 0; s.moving = false;
    const ped = cyl(0.75, 0.35, { seg: 48 }); ped.position.set(1.8, 0.06, -0.35); v.add(ped);
    s.crystals = [0, 1, 2].map(i => { const o = octa(0.17, i === 1 ? PAL.cardinal : 0xffffff, i === 1 ? 'gloss' : 'clay'); o.position.set(1.5 + i * 0.3, 0.75, -0.35); v.add(o); return o; });
    v.label('hidden references', anchor(ped, 0, 1.25, 0));
    const names = ['rules', 'build', 'tests', 'compare', 'speed', 'isolation'];
    s.stamps = names.map((n, i) => {
      const d = cyl(0.11, 0.05, { color: 0xffffff, edge: PAL.rule }); d.position.set(0.75 + i * 0.4, 0.06, 0.95); v.add(d);
      v.label(n, anchor(d, 0, -0.02, 0.32), { cls: 'ghost' });
      return d;
    });
    s.cheats = [0, 1].map(i => { const c = block(0.36, 0.02, 0.26, { color: PAL.cardinal, kind: 'gloss', edge: null }); c.position.set(-1.2, 1.0 + i * 0.3, 0.6 - i * 0.8); c.rotation.x = 0.4; v.add(c); v.setAlpha(c, 0); return c; });
    s.cheatL = v.label('fabricated reward file, forged pass', V(-0.9, 1.9, 0.2), { cls: 'red' }); s.cheatL.opacity = 0;
    s.verdict = v.label('reward and check results', V(2.0, 1.6, 0.95), { cls: 'tag' }); s.verdict.opacity = 0;
    s.beams = s.boxes.map((b, i) => { const l = line([V(0.6, 0.2, -0.5 + i * 0.5), V(1.5 + i * 0.3, 0.75, -0.35)], PAL.cardinal, 'lineT'); v.add(l); v.setAlpha(l, 0); return l; });
  },
  update(v, t, dt) {
    const s = v.s;
    if (s.moving) { s.boxT = Math.min(1, s.boxT + dt * 0.6); }
    s.boxes.forEach((b, i) => { b.position.x = -1.2 + s.boxT * 1.8; b.position.y = 0.08 + Math.sin(s.boxT * Math.PI) * 0.05; });
    s.cand.rotation.y = t * (s.busy ? 2 : 0.2);
  },
  steps: [
    { say: 'Crucible collects the final state of the attempt and sends it to a separate checker.', go(v) {
      const s = v.s; s.boxT = 0; s.moving = true; s.busy = false; resetStamps(s);
      s.beams.forEach(l => v.fade(l, 0)); s.cheats.forEach(c => v.fade(c, 0)); [s.cheatL, s.verdict].forEach(l => show(v, l, false));
    } },
    { say: 'Crucible puts a trusted runtime into a check container with no network.', go(v) { v.s.crystals.forEach((o, i) => v.tw.to(o.position, 'y', 0.95, 0.6 + i * 0.1)); } },
    { say: 'Static rules check the exact files that Crucible will build.', go(v) { stamp(v.s, 0, true); } },
    { say: 'The attempt runs with few permissions. Crucible stops all its processes after the run.', go(v) { v.s.busy = true; stamp(v.s, 1, true); stamp(v.s, 2, true); } },
    { say: 'Crucible compares the results with hidden references and new random inputs.', go(v) {
      const s = v.s; s.busy = false; s.beams.forEach(l => v.fade(l, 1)); stamp(s, 3, true); stamp(s, 4, false); stamp(s, 5, true);
    } },
    { say: 'Forged results and fabricated reward files have no effect. All known attacks score zero.', go(v) {
      const s = v.s; s.beams.forEach(l => v.fade(l, 0)); show(v, s.cheatL, true);
      s.cheats.forEach((c, i) => { v.fade(c, 1); c.position.x = -1.2; v.tw.to(c.position, 'x', -0.12, 0.5); v.later(() => { v.tw.to(c.position, 'x', -1.4, 0.7); v.fade(c, 0); }, 600 + i * 120); });
    } },
    { say: 'Each check gives pass, fail, mask or skip. Crucible never writes a masked result as zero.', go(v) { show(v, v.s.cheatL, false); show(v, v.s.verdict, true); } },
  ],
});
function tintOf(d) { if (!d.userData._own) { d.material = d.material.clone(); d.userData._own = true; } return d.material.color; }
function resetStamps(s) { s.stamps.forEach(d => tintOf(d).set(0xffffff)); }
function stamp(s, i, ok) { tintOf(s.stamps[i]).set(ok ? PAL.pass : PAL.cardinal); }
