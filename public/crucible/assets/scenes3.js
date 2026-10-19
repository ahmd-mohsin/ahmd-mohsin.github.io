// Scenes, part 3: the Crucible world and its sandbox, the RL infrastructure, and how long tasks are built.
import { THREE, PAL, mat, block, cyl, sphere, line, tube, arc, dotGrid, V } from './kit.js';
import { anchor, pawn, sheetStack, terminal, arch, ring, gitGraph, bubble, dbStack, cube, flagPole } from './parts.js';

const moveTo = (v, o, p, d = 0.9) => v.tw.to(o, 'position', V(...p), d);
const scaleTo = (v, o, s, d = 0.6) => v.tw.to(o, 'scale', V(s, s, s), d);
const show = (v, item, on = true, d = 0.45) => v.tw.to(item, 'opacity', on ? 1 : 0, d);
const own = m => { if (!m.userData._own) { m.material = m.material.clone(); m.userData._own = true; } return m.material; };
const tag = (l, on) => { l.el.classList.toggle('tag', on); };

// ============================================================================================================= world
export const world = () => ({
  size: 5, target: [0.6, 0.8, 0], az: 0.42, elev: 0.6,
  setup(v) {
    const s = v.s = { apps: [] };
    v.add(dotGrid(12, 7, 0.34, { size: 1.8 }));
    const floor = block(9.2, 0.12, 5.4); floor.position.set(0, 0, 0); v.add(floor);
    const mk = (obj, x, z, name) => {
      const g = new THREE.Group(); g.position.set(x, 0.12, z); g.add(obj); v.add(g);
      const l = v.label(name, anchor(g, 0, -0.05, 0.62), { cls: '' });
      s.apps.push({ g, l }); return g;
    };
    // apps: each one holds state and tools
    mk(dbStack(0.3, 3), -3.4, -1.6, 'database');
    mk(sheetStack(4, 0.5, 0.64), -1.75, -1.7, 'documents');
    const inbox = new THREE.Group(); inbox.add(block(0.66, 0.12, 0.5));
    [0, 1, 2].forEach(i => { const e = block(0.5, 0.02, 0.34, { color: i === 2 ? PAL.blush : undefined }); e.position.set(0, 0.13 + i * 0.04, 0); e.rotation.y = (i - 1) * 0.12; inbox.add(e); });
    mk(inbox, -0.1, -1.7, 'inbox');
    mk(gitGraph(), 1.55, -1.7, 'code and its history');
    mk(terminal(0.72, 0.5, 0.36), 3.2, -1.55, 'website and browser');
    const ci = new THREE.Group(); ci.add(block(0.62, 0.5, 0.5)); const lock = cube(0.16, { color: PAL.cardinal, kind: 'gloss' }); lock.position.set(0, 0.5, 0); ci.add(lock);
    mk(ci, 3.4, 0.35, 'hidden check runner');
    const gpu = new THREE.Group(); gpu.add(block(0.78, 0.08, 0.5)); for (let i = 0; i < 5; i++) { const f = block(0.06, 0.18, 0.44, { edge: null, color: PAL.rule }); f.position.set(-0.28 + i * 0.14, 0.08, 0); gpu.add(f); }
    const chip = block(0.2, 0.05, 0.2, { color: PAL.ink, kind: 'gloss', edge: null }); chip.position.set(0.18, 0.26, 0); gpu.add(chip);
    mk(gpu, 3.3, 1.9, 'GPU');
    const plug = new THREE.Group(); plug.add(cyl(0.2, 0.3, {})); [-0.07, 0.07].forEach(x => { const p = block(0.04, 0.18, 0.04, { color: PAL.grey, edge: null }); p.position.set(x, 0.3, 0); plug.add(p); });
    mk(plug, -3.4, 1.9, 'any tool server');
    // people and the clock
    s.people = [-0.55, 0, 0.55].map((dx, i) => { const p = pawn(0xffffff, 'clay', 0.9); p.position.set(-1.9 + dx, 0.12, 0.35 + (i === 1 ? -0.2 : 0)); v.add(p); return p; });
    s.peopleL = v.label('simulated people', V(-1.9, 0.12, 1.05), { cls: '' });
    const clk = new THREE.Group(); clk.position.set(-1.3, 0.12, 2.0); v.add(clk);
    const face = cyl(0.36, 0.06, { color: 0xffffff }); face.rotation.x = Math.PI / 2; face.position.y = 0.5; clk.add(face);
    const stand = block(0.06, 0.14, 0.06, { edge: null }); clk.add(stand);
    s.hand = block(0.03, 0.26, 0.02, { color: PAL.cardinal, kind: 'gloss', edge: null, y0: false }); s.hand.geometry.translate(0, 0.13, 0); s.hand.position.set(0, 0.5, 0.04); clk.add(s.hand);
    s.clockL = v.label('world clock', anchor(clk, 0, 0.0, 0.5), { cls: '' });
    s.event = v.label('a reply arrives at 10.40', anchor(clk, 0, 1.15, 0), { cls: 'red' }); s.event.opacity = 0;
    // the agent and the one gate
    s.agent = sphere(0.22, { color: PAL.cardinal }); s.agent.position.set(1.2, 0.6, 4.0); v.add(s.agent);
    s.agentL = v.label('the agent', anchor(s.agent, 0, 0.45, 0), { cls: 'tag' });
    s.gate = arch(0.9, 0.9, 0.08, PAL.cardinal, 'gloss'); s.gate.position.set(1.2, 0.12, 2.7); v.add(s.gate);
    s.gateL = v.label('one gate for each action', anchor(s.agent, 0.45, 0.05, 0), { cls: 'code', align: 'left' }); s.gateL.opacity = 0;
    s.checksL = v.label('checks name · permission · inputs · time · output size', anchor(s.agent, 0.45, -0.3, 0), { cls: 'ghost', align: 'left' }); s.checksL.opacity = 0;
    s.calls = [[-0.1, -1.7], [1.55, -1.7], [3.2, -1.55]].map(([x, z], i) => { const f = v.flow(arc(V(1.2, 0.6, 3.8), V(x, 0.5, z), 1.2, V((1.2 + x) / 2, 1.6, 1.4)), { count: 3, speed: 0.35, r: 0.05, offset: i * 0.25 }); f.target = 0; return f; });
    // the sandbox and the blocked network
    s.box = block(9.4, 2.4, 5.6, { kind: 'glass', edge: PAL.cardinal }); s.box.position.set(0, 0.02, 0); s.box.castShadow = false; s.box.userData.fit = true; v.add(s.box); v.setAlpha(s.box, 0);
    s.boxL = v.label('sandbox · new account · few permissions', V(-4.6, 2.55, -2.8), { cls: 'red', align: 'left' }); s.boxL.opacity = 0;
    s.net = new THREE.Group(); s.net.position.set(4.6, 1.2, -1.0); s.net.userData.fit = true; v.add(s.net);
    s.net.add(tube(new THREE.CatmullRomCurve3([V(0, 0, 0), V(0.8, 0.1, 0), V(1.6, 0.3, 0)]), 0.02, PAL.stone, 'clay', 20));
    [0.6, -0.6].forEach(r => { const b = block(0.07, 0.5, 0.07, { color: PAL.bright, kind: 'gloss', edge: null, y0: false }); b.rotation.z = r; b.position.set(0.9, 0.12, 0); s.net.add(b); });
    v.setAlpha(s.net, 0);
    s.netL = v.label('no network', V(5.4, 1.85, -1.0), { cls: 'red' }); s.netL.opacity = 0;
    // snapshot camera
    s.cam = new THREE.Group(); s.cam.position.set(-0.2, 2.9, -0.2); s.cam.userData.fit = true; v.add(s.cam);
    s.cam.add(block(0.6, 0.36, 0.36)); const lens = cyl(0.12, 0.16, { color: PAL.ink, kind: 'gloss' }); lens.rotation.x = Math.PI / 2; lens.position.set(0, 0.18, 0.24); s.cam.add(lens);
    v.setAlpha(s.cam, 0);
    s.snapL = v.label('snapshot of every app', anchor(s.cam, 0, 0.62, 0), { cls: 'code' }); s.snapL.opacity = 0;
    s.fpL = v.label('fingerprints match after restore', V(-0.2, 2.9, 1.2), { cls: 'pass' }); s.fpL.opacity = 0;
    // where a world can run
    const where = ['this machine', 'container', 'remote GPU host', 'cloud sandbox'];
    s.where = where.map((n, i) => {
      const t = block(1.1, 0.1, 0.8, { color: i === 2 ? PAL.blush : undefined }); t.position.set(5.75, 0, -2.1 + i * 1.4); t.userData.fit = true; v.add(t); v.setAlpha(t, 0);
      const l = v.label(n, anchor(t, 0, 0.12, 0.5), { cls: 'code' }); l.opacity = 0; return { t, l };
    });
    s.mini = cube(0.36, { kind: 'glass', edge: PAL.cardinal }); s.mini.position.set(5.75, 0.1, -2.1); v.add(s.mini); v.setAlpha(s.mini, 0);
  },
  update(v, t, dt) {
    const s = v.s;
    s.hand.rotation.z = -t * (s.fast ? 2.2 : 0.4);
    s.people.forEach((p, i) => { p.position.y = 0.12 + (s.talk ? Math.max(0, Math.sin(t * 3 + i * 2)) * 0.08 : 0); });
    if (s.hop) { const k = Math.floor(t / 1.1) % 4; s.mini.position.lerp(V(5.75, 0.32, -2.1 + k * 1.4), Math.min(1, dt * 5)); s.where.forEach((w, i) => tag(w.l, i === k)); }
  },
  steps: (() => {
    const reset = (v, s) => {
      s.fast = false; s.talk = false; s.hop = false; s.calls.forEach(f => f.target = 0);
      [s.event, s.gateL, s.checksL, s.boxL, s.netL, s.snapL, s.fpL].forEach(l => show(v, l, false));
      s.apps.forEach(a => tag(a.l, false)); v.fade(s.box, 0); v.fade(s.net, 0); v.fade(s.cam, 0);
      s.where.forEach(w => { v.fade(w.t, 0); show(v, w.l, false); }); v.fade(s.mini, 0);
    };
    return [
      { say: 'A spec describes the world. Crucible builds the world from the spec.', go(v) {
        const s = v.s; reset(v, s); s.apps.forEach((a, i) => { a.g.scale.set(1, 0.01, 1); v.later(() => v.tw.to(a.g, 'scale', V(1, 1, 1), 0.6), i * 90); });
      } },
      { say: 'Apps hold the state and the tools. A world can hold databases, documents, inboxes, code, websites, browsers, GPUs and any tool server.', go(v) {
        const s = v.s; s.apps.forEach((a, i) => v.later(() => { s.apps.forEach(b => tag(b.l, b === a)); v.tw.to(a.g.position, 'y', 0.35, 0.3); v.later(() => v.tw.to(a.g.position, 'y', 0.12, 0.3), 320); }, i * 420));
      } },
      { say: 'Simulated people and a world clock live inside the world. Events occur on world time, not on wall time.', go(v) {
        const s = v.s; s.apps.forEach(b => tag(b.l, false)); s.talk = true; s.fast = true; show(v, s.event, true);
      } },
      { say: 'The agent acts only through one gate. The gate checks the name, the permission, the inputs, the time limit and the output size.', go(v) {
        const s = v.s; s.talk = false; s.fast = false; show(v, s.event, false); s.calls.forEach(f => f.target = 1); show(v, s.gateL, true); show(v, s.checksL, true);
      } },
      { say: 'A sandbox surrounds the world. The agent gets a new account with few permissions, and the sandbox closes the network.', go(v) {
        const s = v.s; s.calls.forEach(f => f.target = 0.4); v.fade(s.box, 1); v.fade(s.net, 1); show(v, s.boxL, true); show(v, s.netL, true); show(v, s.checksL, false);
      } },
      { say: 'A snapshot saves each app. A restore puts all apps back exactly, and fingerprints prove it.', go(v) {
        const s = v.s; show(v, s.netL, false); v.fade(s.cam, 1); show(v, s.snapL, true);
        v.later(() => { s.apps.forEach(a => v.tw.to(a.g, 'scale', V(1, 0.6, 1), 0.3)); }, 700);
        v.later(() => { s.apps.forEach(a => v.tw.to(a.g, 'scale', V(1, 1, 1), 0.4)); show(v, s.fpL, true); }, 1300);
      } },
      { say: 'The same world runs on this machine, in a container, on a remote GPU host or in a cloud sandbox.', go(v) {
        const s = v.s; [s.snapL, s.fpL, s.boxL, s.gateL].forEach(l => show(v, l, false)); v.fade(s.cam, 0); s.where.forEach(w => { v.fade(w.t, 1); show(v, w.l, true); }); v.fade(s.mini, 1); s.hop = true;
      } },
    ];
  })(),
});

// ============================================================================================================= infra
export const infra = () => ({
  size: 5, target: [0, 1.8, 0], az: 0.62, elev: 0.36,
  setup(v) {
    const s = v.s = {};
    const plane = (y, w, d, name, color) => {
      const p = block(w, 0.05, d, { kind: 'glass', edge: color ?? PAL.stone }); p.position.set(0, y, 0); p.castShadow = false; v.add(p);
      const l = v.label(name, V(-w / 2 - 0.1, y + 0.05, d / 2), { cls: 'ghost', align: 'right' });
      return { p, l };
    };
    s.planes = [plane(0, 7, 3.2, 'worlds'), plane(1.35, 7, 3.2, 'models'), plane(2.7, 7, 3.2, 'data'), plane(4.05, 7, 3.2, 'training', PAL.cardinal)];
    // worlds: sandboxes on many machines
    s.worlds = [];
    for (let r = 0; r < 2; r++) for (let c = 0; c < 5; c++) { const w = cube(0.34, { kind: 'glass', edge: PAL.cardinal }); w.position.set(-2.6 + c * 1.3, 0.05, -0.6 + r * 1.1); v.add(w); const b = block(0.14, 0.18, 0.14); b.position.copy(w.position); v.add(b); s.worlds.push(w); }
    s.worldL = v.label('worlds in sandboxes, on many machines', V(0, 0.05, 1.9), { cls: '' });
    // models: inference engines behind one gateway
    s.engines = [-2.2, -0.75, 0.75, 2.2].map(x => {
      const g = new THREE.Group(); g.position.set(x, 1.4, -0.3); v.add(g);
      for (let k = 0; k < 3; k++) { const b = block(0.6, 0.1, 0.6); b.position.y = k * 0.15; g.add(b); const led = sphere(0.022, { color: k === 2 ? PAL.cardinal : PAL.pass }); led.position.set(0.22, 0.05 + k * 0.15, 0.305); g.add(led); }
      return g;
    });
    s.gw = block(5.2, 0.12, 0.3, { color: PAL.blush }); s.gw.position.set(0, 1.4, 0.75); v.add(s.gw);
    s.engL = v.label('inference engines behind one gateway', V(0, 1.95, -0.3), { cls: '' });
    // data: the record pool and the scheduler
    s.pool = new THREE.Group(); s.pool.position.set(-0.9, 2.75, 0); v.add(s.pool);
    s.cards = Array.from({ length: 12 }, (_, i) => { const c = block(0.46, 0.03, 0.32, { color: i % 4 === 0 ? PAL.blush : undefined }); c.position.set((i % 6) * 0.52 - 1.3, Math.floor(i / 6) * 0.06, (Math.floor(i / 6)) * 0.42 - 0.2); s.pool.add(c); return c; });
    s.poolL = v.label('records with exact tokens, versions and step scores', V(-0.9, 3.1, 0.9), { cls: '' });
    s.sched = new THREE.Group(); s.sched.position.set(2.5, 2.75, 0.2); v.add(s.sched);
    s.sched.add(block(0.8, 0.36, 0.6)); const dial = cyl(0.14, 0.04, { color: PAL.cardinal, kind: 'gloss', edge: null }); dial.rotation.x = Math.PI / 2; dial.position.set(0, 0.2, 0.31); s.sched.add(dial);
    s.schedL = v.label('scheduler', anchor(s.sched, 0, 0.6, 0), { cls: '' });
    s.oldL = v.label('too old · dropped', V(-2.4, 3.35, -0.4), { cls: 'red' }); s.oldL.opacity = 0;
    // training
    s.trainer = new THREE.Group(); s.trainer.position.set(0, 4.1, 0); v.add(s.trainer);
    s.trainer.add(block(1.6, 0.6, 1.0)); const band = block(1.62, 0.1, 1.02, { color: PAL.cardinal, kind: 'gloss', edge: null }); band.position.y = 0.6; s.trainer.add(band);
    s.trainL = v.label('trainer', anchor(s.trainer, 0, 1.0, 0), { cls: 'tag' });
    // token strip: dense credit on the tokens of each turn
    s.tokens = Array.from({ length: 16 }, (_, i) => { const t = block(0.16, 0.16, 0.16, { color: 0xffffff }); t.position.set(-1.5 + i * 0.2, 3.1, -1.25); v.add(t); return t; });
    s.tokL = v.label('each token gets the score of its turn', V(0.1, 3.5, -1.3), { cls: 'code' }); s.tokL.opacity = 0;
    // flows
    s.up1 = v.flow(arc(V(-1.3, 0.3, 0.2), V(-1.3, 1.4, 0.2), 0.3), { count: 3, speed: 0.4, r: 0.05, color: PAL.ink }); s.up1.target = 0;
    s.down1 = v.flow(arc(V(1.3, 1.4, 0.2), V(1.3, 0.3, 0.2), 0.3), { count: 3, speed: 0.4, r: 0.05 }); s.down1.target = 0;
    s.toPool = v.flow(arc(V(0, 1.6, 0.8), V(-0.9, 2.8, 0.4), 0.5), { count: 4, speed: 0.35, r: 0.05 }); s.toPool.target = 0;
    s.toTrain = v.flow(arc(V(-0.4, 2.85, 0), V(-0.2, 4.1, 0), 0.4), { count: 3, speed: 0.4, r: 0.055 }); s.toTrain.target = 0;
    s.publish = v.flow(arc(V(0.8, 4.4, 0.2), V(2.2, 1.85, -0.3), 1.2), { count: 3, speed: 0.45, r: 0.07, color: PAL.cardinal }); s.publish.target = 0;
    s.pubL = v.label('new weights, next version', V(2.4, 4.2, 0), { cls: 'tag' }); s.pubL.opacity = 0;
    // hack defence at the world plane
    s.shield = new THREE.Mesh(new THREE.CylinderGeometry(0.42, 0.42, 0.06, 6), mat('gloss', PAL.cardinal)); s.shield.rotation.x = Math.PI / 2; s.shield.position.set(2.6, 0.6, 1.3); s.shield.castShadow = true; s.shield.userData.fit = true; v.add(s.shield); v.setAlpha(s.shield, 0);
    s.shieldL = v.label('hack check · stop the call, flag the episode', V(2.6, 1.15, 1.3), { cls: 'red' }); s.shieldL.opacity = 0;
  },
  update(v, t) {
    const s = v.s;
    if (s.pulse) s.trainer.scale.y = 1 + Math.max(0, Math.sin(t * 5)) * 0.08; else s.trainer.scale.y = 1;
    if (s.dense) s.tokens.forEach((tk, i) => { const turn = Math.floor(i / 4); own(tk).color.set([0xf2dcdc, 0xe6b3b0, 0xc8473f, 0x8c1515][turn]); });
    else s.tokens.forEach(tk => own(tk).color.set(0xffffff));
  },
  steps: (() => {
    const hi = (v, s, k) => s.planes.forEach((p, i) => tag(p.l, i === k));
    const off = (v, s) => { [s.up1, s.down1, s.toPool, s.toTrain, s.publish].forEach(f => f.target = 0); [s.oldL, s.tokL, s.pubL, s.shieldL].forEach(l => show(v, l, false)); s.pulse = false; s.dense = false; v.fade(s.shield, 0); };
    return [
      { say: 'Worlds run in sandboxes on many machines. Each episode runs as its own task, so a slow world never blocks the others.', go(v) { const s = v.s; off(v, s); hi(v, s, 0); s.worlds.forEach((w, i) => { w.position.y = 0.6; v.tw.to(w.position, 'y', 0.05, 0.5 + i * 0.05); }); } },
      { say: 'Inference engines serve the model behind one gateway. Each episode stays on the same engine, and the agent and the world take turns.', go(v) { const s = v.s; off(v, s); hi(v, s, 1); s.up1.target = 1; s.down1.target = 1; } },
      { say: 'Each finished episode becomes a record. The record keeps the exact tokens, their probabilities, the model version and the step scores.', go(v) { const s = v.s; hi(v, s, 2); s.toPool.target = 1; } },
      { say: 'The scheduler admits new work, picks the next batch and drops data that is too old.', go(v) { const s = v.s; s.toPool.target = 0.4; show(v, s.oldL, true); v.tw.to(s.cards[0].position, 'x', -2.6, 0.8); v.fade(s.cards[0], 0.2); } },
      { say: 'Dense reward. The step scores go onto the tokens of each turn, and each group of tries gives the baseline for its advantage.', go(v) { const s = v.s; show(v, s.oldL, false); v.fade(s.cards[0], 1); v.tw.to(s.cards[0].position, 'x', -1.3, 0.5); s.dense = true; show(v, s.tokL, true); } },
      { say: 'The trainer updates the model. It corrects each token for the age of its data.', go(v) { const s = v.s; hi(v, s, 3); s.toTrain.target = 1; s.pulse = true; } },
      { say: 'New weights go to all engines in one step. The next tokens carry the new version number.', go(v) { const s = v.s; s.pulse = false; s.toTrain.target = 0; s.publish.target = 1; show(v, s.pubL, true); } },
      { say: 'A hack check stops dangerous calls before they run. It flags suspect episodes, and a judge confirms them before they affect training.', go(v) { const s = v.s; s.publish.target = 0; show(v, s.pubL, false); hi(v, s, 0); v.fade(s.shield, 1); show(v, s.shieldL, true); } },
    ];
  })(),
});

// ============================================================================================================ lhbuild
export const lhbuild = () => ({
  size: 4.6, minWidth: 8.4, target: [0, 0.8, 0], az: 0.36, elev: 0.5,
  setup(v) {
    const s = v.s = {};
    const track = block(9.6, 0.08, 1.2); track.position.set(0, 0, 0); v.add(track);
    v.label('start of the shift', V(-4.7, 0.05, 0.9), { cls: 'ghost', align: 'left' });
    v.label('end of the shift', V(4.7, 0.05, 0.9), { cls: 'ghost', align: 'right' });
    // world time ruler
    for (let i = 0; i <= 8; i++) { const t = block(0.02, 0.18, 0.02, { color: PAL.stone, edge: null }); t.position.set(-4.6 + i * 1.15, 0, -0.75); v.add(t); }
    s.timeL = v.label('world time', V(-4.6, 0.3, -0.75), { cls: 'ghost', align: 'left' });
    // one real case, then a shift of cases
    s.seed = block(0.5, 0.06, 0.36, { color: PAL.cardinal, kind: 'gloss' }); s.seed.position.set(0, 0.08, 0); v.add(s.seed);
    s.seedL = v.label('one real case', anchor(s.seed, 0, 0.4, 0), { cls: 'tag' });
    s.cards = Array.from({ length: 28 }, (_, i) => { const c = block(0.26, 0.05, 0.36); c.position.set(-4.4 + i * 0.326, 0.08, 0); c.scale.setScalar(0.001); v.add(c); return c; });
    // a reply that comes back hours later
    s.wait = tube(arc(V(-3.4, 0.2, 0.15), V(0.5, 0.2, 0.15), 1.4), 0.018, PAL.cardinal, 'gloss'); v.add(s.wait); v.setAlpha(s.wait, 0);
    s.bub = bubble(0.4, 0.22); s.bub.position.set(0.5, 0.15, 0.3); v.add(s.bub); v.setAlpha(s.bub, 0);
    s.waitL = v.label('the customer replies hours later', V(-1.4, 1.75, 0.15), { cls: 'red' }); s.waitL.opacity = 0;
    // a rule that changes mid-shift
    s.rule = block(0.04, 1.4, 1.5, { color: PAL.bright, kind: 'flatT', edge: PAL.cardinal }); s.rule.position.set(1.4, 0, 0); s.rule.castShadow = false; v.add(s.rule); v.setAlpha(s.rule, 0);
    s.ruleL = v.label('the approval rule changes here', V(1.4, 1.6, 0), { cls: 'red' }); s.ruleL.opacity = 0;
    // later cases that refer to earlier ones
    s.links = [[3.6, -2.6], [2.6, -0.9], [4.2, 0.9]].map(([a, b]) => { const t = tube(arc(V(a, 0.12, -0.15), V(b, 0.12, -0.15), 0.9), 0.014, PAL.ink); v.add(t); v.setAlpha(t, 0); return t; });
    s.linkL = v.label('the same order as an earlier case', V(1.4, 1.2, -0.3), { cls: 'code' }); s.linkL.opacity = 0;
    // context: threads and a knowledge base
    s.shelf = new THREE.Group(); s.shelf.position.set(-2.2, 0, -1.6); s.shelf.userData.fit = true; v.add(s.shelf);
    s.shelf.add(block(3.4, 0.06, 0.5));
    for (let i = 0; i < 14; i++) { const b = block(0.16, 0.36 + (i % 3) * 0.06, 0.34, { color: i % 5 === 0 ? PAL.blush : undefined }); b.position.set(-1.5 + i * 0.23, 0.06, 0); s.shelf.add(b); }
    v.setAlpha(s.shelf, 0);
    s.shelfL = v.label('threads and knowledge base documents', V(-2.2, 0.75, -1.6), { cls: '' }); s.shelfL.opacity = 0;
    // milestones and progress
    s.flags = Array.from({ length: 7 }, (_, i) => { const f = flagPole(PAL.cardinal, 0.5); f.position.set(-3.9 + i * 1.3, 0.08, 0.35); v.add(f); v.setAlpha(f, 0); return f; });
    const back = block(0.22, 2.0, 0.22, { kind: 'glass', edge: PAL.stone }); back.position.set(5.3, 0, -0.2); v.add(back);
    s.fill = block(0.18, 1, 0.18, { color: PAL.cardinal, kind: 'gloss', edge: null }); s.fill.position.set(5.3, 0, -0.2); s.fill.scale.y = 0.02; v.add(s.fill);
    s.fillL = v.label('progress', V(5.3, 2.3, -0.2), { cls: '' });
    s.sumL = v.label('step scores add up to the final reward', V(2.4, 1.9, 0.4), { cls: 'pass' }); s.sumL.opacity = 0;
  },
  steps: (() => {
    const clear = (v, s) => { [s.wait, s.bub, s.rule, s.shelf, ...s.links, ...s.flags].forEach(o => v.fade(o, 0)); [s.waitL, s.ruleL, s.linkL, s.shelfL, s.sumL].forEach(l => show(v, l, false)); v.tw.to(s.fill.scale, 'y', 0.02, 0.5); };
    return [
      { say: 'Start from one real case in a workflow, for example a support ticket with its thread and its result.', go(v) { const s = v.s; clear(v, s); v.fade(s.seed, 1); show(v, s.seedL, true); s.cards.forEach(c => scaleTo(v, c, 0.001, 0.3)); } },
      { say: 'Crucible grows the case into a full shift. It adds many cases, each with its own data, people and correct result.', go(v) { const s = v.s; v.fade(s.seed, 0); show(v, s.seedL, false); s.cards.forEach((c, i) => v.later(() => scaleTo(v, c, 1, 0.3), i * 40)); } },
      { say: 'Some cases must wait. A customer replies hours later in world time, and the agent must come back to the case.', go(v) { const s = v.s; v.fade(s.wait, 1); v.fade(s.bub, 1); show(v, s.waitL, true); } },
      { say: 'A rule changes during the shift. The checks score each action by the rule in force at that moment.', go(v) { const s = v.s; show(v, s.waitL, false); v.fade(s.rule, 1); show(v, s.ruleL, true); } },
      { say: 'Later cases refer to earlier cases. The agent must stay consistent across hundreds of steps.', go(v) { const s = v.s; show(v, s.ruleL, false); s.links.forEach(l => v.fade(l, 1)); show(v, s.linkL, true); } },
      { say: 'Each case brings context, such as message threads and knowledge base documents. The context grows until the model must summarize.', go(v) { const s = v.s; show(v, s.linkL, false); v.fade(s.shelf, 1); show(v, s.shelfL, true); } },
      { say: 'Each case also brings milestones. The step scores add up across the full shift, so the reward stays dense and exact.', go(v) {
        const s = v.s; show(v, s.shelfL, false); s.flags.forEach((f, i) => v.later(() => v.fade(f, 1), i * 160)); v.tw.to(s.fill.scale, 'y', 2.0, 1.4); show(v, s.sumL, true);
      } },
    ];
  })(),
});
