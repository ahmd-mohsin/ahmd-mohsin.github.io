// Scenes, part 2: M8, M9, M10, M12, long horizons, RLM, task manager, M13, M11, M14, studio, results.
import { THREE, PAL, mat, block, cyl, sphere, line, tube, arc, points, dotGrid, fibSphere, ENV, V } from './kit.js';
import { anchor, pawn, sheetStack, terminal, flagPole, arch, ring, bars, testStack, octa, cube, dottedSphere, cart } from './parts.js';

const moveTo = (v, o, p, d = 0.9) => v.tw.to(o, 'position', V(...p), d);
const scaleTo = (v, o, s, d = 0.6) => v.tw.to(o, 'scale', V(s, s, s), d);
const show = (v, item, on = true, d = 0.45) => v.tw.to(item, 'opacity', on ? 1 : 0, d);
const own = m => { if (!m.userData._own) { m.material = m.material.clone(); m.userData._own = true; } return m.material; };

// ================================================================================================================== M8
export const m8 = () => ({
  size: 4.6, minWidth: 7.6, target: [0.2, 0.7, 0], az: 0.5, elev: 0.55,
  setup(v) {
    const s = v.s = {};
    const belt = block(7.2, 0.08, 0.5); belt.position.set(0, 0, 0); v.add(belt);
    for (let i = 0; i < 18; i++) { const r = cyl(0.04, 0.52, { edge: null, seg: 10 }); r.rotation.x = Math.PI / 2; r.position.set(-3.4 + i * 0.4, 0.05, -0.26); v.add(r); }
    const roles = ['architect', 'environment', 'solution', 'test writer', 'adversary', 'auditor'];
    s.booths = roles.map((n, i) => {
      const g = new THREE.Group(); const side = i % 2 ? 1 : -1;
      g.position.set(-2.75 + i * 1.05, 0, side * 0.95); v.add(g);
      g.add(block(0.8, 0.05, 0.7));
      [[-0.36, -0.3], [0.36, -0.3], [-0.36, 0.3], [0.36, 0.3]].forEach(([x, z]) => { const p = block(0.04, 0.8, 0.04, { edge: null }); p.position.set(x, 0.05, z); g.add(p); });
      const roof = block(0.84, 0.04, 0.74); roof.position.y = 0.85; g.add(roof);
      const frost = new THREE.Mesh(new THREE.PlaneGeometry(0.76, 0.78), mat('flatT', PAL.blush)); own(frost).opacity = 0.55; frost.material.side = THREE.DoubleSide;
      frost.position.set(0, 0.45, -side * 0.34); g.add(frost);
      const bot = pawn(i === 2 ? PAL.cardinal : 0xffffff, i === 2 ? 'gloss' : 'clay', 0.75); bot.position.set(0, 0.05, side * 0.08); g.add(bot);
      const lab = v.label(n, anchor(g, 0, 1.1, 0)); return { g, lab, frost, bot };
    });
    s.blue = new THREE.Group(); const bp = block(0.5, 0.04, 0.36, { edge: PAL.cardinal }); s.blue.add(bp);
    s.bead = sphere(0.06, { color: PAL.bright }); s.bead.position.set(0.12, 0.08, 0); s.blue.add(s.bead); s.bead.visible = false;
    s.blue.position.set(-3.4, 0.1, 0); v.add(s.blue);
    const gate = ring(0.42, 0.04, PAL.cardinal, 'gloss'); gate.rotation.set(0, Math.PI / 2, 0); gate.position.set(3.75, 0.5, 0); v.add(gate);
    s.cubes = [0, 1, 2].map(i => { const c = cube(0.24, {}); c.position.set(3.95, 0, -0.55 + i * 0.4); c.scale.setScalar(0.001); v.add(c); return c; });
    v.label('quality gate', anchor(gate, 0, 0.6, 0), { cls: 'ghost' });
    s.canaryL = v.label('hidden marker', anchor(s.bead, 0, 0.18, 0), { cls: 'red' }); s.canaryL.opacity = 0;
    s.wallL = v.label('cannot see the solution', V(0.4, 1.6, 0.95), { cls: 'code' }); s.wallL.opacity = 0;
    s.breach = v.label('marker found, so that role fails', V(2.5, 1.6, 0.95), { cls: 'red' }); s.breach.opacity = 0;
  },
  steps: (() => {
    const at = i => v => {
      const s = v.s; moveTo(v, s.blue, [-2.75 + i * 1.05, 0.1, 0], 0.9);
      s.booths.forEach((b, k) => { b.lab.el.classList.toggle('tag', k === i); v.tw.to(b.bot.position, 'y', k === i ? 0.18 : 0.05, 0.5); });
      [s.canaryL, s.wallL, s.breach].forEach(l => show(v, l, false));
      s.bead.visible = i >= 2;
      if (i === 0) s.cubes.forEach(c => scaleTo(v, c, 0.001));
    };
    return [
      { say: 'The architect makes a scenario, its rules and a trap. It uses a seed and real expert feedback.', go: at(0) },
      { say: 'The environment builder makes the data. It adds distractors and decoys.', go: at(1) },
      { say: 'The solution builder makes the solution first. The solution carries a hidden marker.', go(v) { at(2)(v); show(v, v.s.canaryL, true); } },
      { say: 'The test writer makes the checks from the rules. A wall hides the solution from the test writer.', go(v) { at(3)(v); show(v, v.s.wallL, true); } },
      { say: 'The adversary tries empty attempts, old trap answers, planted errors and other valid solutions.', go: at(4) },
      { say: 'The auditor looks for the hidden marker. If it finds the marker in the wrong place, that role fails.', go(v) { at(5)(v); show(v, v.s.breach, true); } },
      { say: 'Only tasks that pass the quality gate go into the task pool.', go(v) {
        const s = v.s; moveTo(v, s.blue, [3.55, 0.1, 0], 0.9); s.booths.forEach(b => b.lab.el.classList.remove('tag')); show(v, s.breach, false);
        s.cubes.forEach((c, i) => v.later(() => scaleTo(v, c, 1, 0.5), 700 + i * 180));
      } },
    ];
  })(),
});

// ================================================================================================================== M9
const TIERS = [
  { r: 1.2, name: 'read only', ids: ['A5', 'A7', 'A8'] },
  { r: 1.75, name: 'replay', ids: ['A1', 'A2', 'A3', 'A4', 'A9', 'A14', 'A18'] },
  { r: 2.3, name: 'sandbox', ids: ['A6', 'A11', 'A13', 'A16', 'A17'] },
  { r: 2.85, name: 'frontier test', ids: ['A10', 'A12', 'A15'] },
];
export const m9 = () => ({
  size: 5.0, target: [0, 0.6, 0], az: 0.7, elev: 0.72,
  setup(v) {
    const s = v.s = { tiles: {}, tier: [] };
    const task = cube(0.55, { color: 0xffffff, edge: PAL.cardinal }); task.position.y = 0.0; v.add(task); s.task = task;
    v.label('task', anchor(task, 0, 0.8, 0), { cls: 'tag' });
    TIERS.forEach((t, ti) => {
      const rg = ring(t.r, 0.012, PAL.rule, 'clay'); rg.position.y = 0.02; v.add(rg);
      const tg = { name: t.name, tiles: [] };
      t.ids.forEach((id, k) => {
        const a = (k / t.ids.length) * Math.PI * 2 + ti * 0.35;
        const tile = block(0.24, 0.12, 0.24, { color: 0xffffff }); tile.position.set(Math.cos(a) * t.r, 0, Math.sin(a) * t.r); v.add(tile);
        v.label(id.slice(1), anchor(tile, 0, 0.32, 0), { cls: 'mcode' });
        s.tiles[id] = tile; tg.tiles.push(tile);
      });
      s.tier.push(tg);
      v.label(t.name, V(Math.sin(0.7 + 0.5) * (t.r + 0.06), 0.02, Math.cos(0.7 + 0.5) * (t.r + 0.06)), { cls: 'ghost', align: 'left', dx: 6 });
    });
    s.mutants = Array.from({ length: 8 }, (_, i) => { const m = cube(0.13, { color: PAL.ink, kind: 'gloss' }); const a = i / 8 * Math.PI * 2; m.position.set(Math.cos(a) * 3.6, 0.4, Math.sin(a) * 3.6); v.add(m); v.setAlpha(m, 0); m.userData.a = a; return m; });
    const pool = cyl(0.65, 0.12, { seg: 48 }); pool.position.set(3.6, 0, -2.4); v.add(pool);
    v.label('task pool', anchor(pool, 0, 0.4, 0), { cls: 'ghost' });
    s.score = v.label('catch 90% of planted errors', V(0, 1.6, 0), { cls: 'red' }); s.score.opacity = 0;
    s.band = v.label('pass rate from 0.1 to 0.7', V(0, 1.6, 0), { cls: 'red' }); s.band.opacity = 0;
    s.ok = v.label('accepted', V(3.6, 1.2, -2.4), { cls: 'pass' }); s.ok.opacity = 0;
    s.attackL = v.label('32 attack attempts', V(0, 1.6, 0), { cls: 'red' }); s.attackL.opacity = 0;
  },
  update(v, t) { if (v.s.spinTask) v.s.task.rotation.y = t * 0.6; },
  steps: (() => {
    const light = (s, upto) => s.tier.forEach((tg, i) => tg.tiles.forEach(tl => own(tl).color.set(i < upto ? PAL.pass : 0xffffff)));
    const hide = (v, s) => [s.score, s.band, s.ok, s.attackL].forEach(l => show(v, l, false));
    return [
      { say: 'The gate puts the checks in order of cost. Fast checks run first. People check last.', go(v) {
        const s = v.s; light(s, 0); hide(v, s); s.spinTask = true; moveTo(v, s.task, [0, 0, 0]); s.mutants.forEach(m => v.fade(m, 0));
      } },
      { say: 'Read only checks look for leaks, coverage and grounding. They do not run anything.', go(v) { light(v.s, 1); } },
      { say: 'The solution must pass, empty attempts must score zero, and repeated runs must agree.', go(v) { light(v.s, 2); } },
      { say: 'Crucible plants errors in the work. The checks must catch 90% of them or more.', go(v) {
        const s = v.s; show(v, s.score, true);
        s.mutants.forEach((m, i) => { v.fade(m, 1); m.position.set(Math.cos(m.userData.a) * 3.6, 0.4, Math.sin(m.userData.a) * 3.6);
          moveTo(v, m, [Math.cos(m.userData.a) * 1.9, 0.3, Math.sin(m.userData.a) * 1.9], 0.8); v.later(() => v.fade(m, 0), 950 + i * 40); });
      } },
      { say: 'Crucible attacks the isolation and the checks in sandboxes. An adaptive attacker also tries to cheat.', go(v) { const s = v.s; hide(v, s); show(v, s.attackL, true); light(s, 3); } },
      { say: 'Frontier models try the task. Their pass rate must be in the target range.', go(v) { const s = v.s; hide(v, s); show(v, s.band, true); light(s, 4); } },
      { say: 'All rings are green, so the task goes into the pool. Each new error type becomes a new check.', go(v) {
        const s = v.s; hide(v, s); s.spinTask = false; moveTo(v, s.task, [3.6, 0.12, -2.4], 1.1); show(v, s.ok, true);
      } },
    ];
  })(),
});

// ================================================================================================================= M10
export const m10 = () => ({
  size: 4.8, target: [0.2, 0.6, 0], az: 0.66, elev: 0.6,
  setup(v) {
    const s = v.s = {};
    const tray = block(1.6, 0.08, 1.6); tray.position.set(-2.4, 0, -0.2); v.add(tray);
    v.label('tasks, agents, tries', anchor(tray, 0, 0.1, -1.0));
    s.pods = [];
    for (let r = 0; r < 3; r++) for (let c = 0; c < 3; c++) {
      const p = new THREE.Mesh(new THREE.CapsuleGeometry(0.09, 0.22, 6, 14), mat('gloss', 0xffffff)); own(p);
      p.rotation.z = Math.PI / 2; p.castShadow = true; p.position.set(-2.9 + c * 0.5, 0.18, -0.7 + r * 0.5);
      p.userData.home = p.position.clone(); v.add(p); s.pods.push(p);
    }
    const rail = tube(new THREE.CatmullRomCurve3([V(-1.5, 0.2, -0.2), V(-0.3, 0.2, -0.2), V(0.9, 0.2, -0.2)]), 0.02, PAL.rule);
    v.add(rail);
    const world = block(0.9, 0.7, 0.9, { kind: 'glass', edge: PAL.cardinal }); world.position.set(-0.3, 0, -0.2); v.add(world);
    v.label('world', anchor(world, 0, 1.0, 0));
    const grader = block(0.7, 0.55, 0.7); grader.position.set(0.95, 0, -0.2); v.add(grader);
    v.label('checker', anchor(grader, 0, 0.85, 0));
    const ledger = block(0.8, 0.06, 0.8); ledger.position.set(2.5, 0, -1.0); v.add(ledger);
    v.label('scored', anchor(ledger, 0, 0.75, 0), { cls: 'red' });
    const bin = block(0.8, 0.45, 0.8, { kind: 'glass', edge: PAL.stone }); bin.position.set(2.5, 0, 0.7); v.add(bin);
    v.label('system faults, not counted', anchor(bin, 0, 0.8, 0), { cls: 'code' });
    s.coins = Array.from({ length: 8 }, (_, i) => { const c = cyl(0.17, 0.05, { color: PAL.cardinal, kind: 'gloss', edge: null }); c.position.set(-2.4, 0.1 + i * 0.06, 1.35); v.add(c); return c; });
    v.label('budget, reserved then settled', V(-2.4, 0.15, 1.95), { cls: '' });
    s.journal = sheetStack(1, 0.5, 0.6); s.journal.position.set(0.9, 0, 1.35); v.add(s.journal);
    v.label('run log', anchor(s.journal, 0, 0.5, 0), { cls: 'ghost' });
    s.flag = flagPole(PAL.cardinal, 0.75); s.flag.position.set(-0.75, 0.06, 0.45); v.add(s.flag); v.setAlpha(s.flag, 0);
    s.crash = v.label('crash, then continue from the save', V(-0.5, 1.5, 0.4), { cls: 'red' }); s.crash.opacity = 0;
  },
  steps: (() => {
    const reset = (v, s) => { s.pods.forEach(p => { moveTo(v, p, p.userData.home.toArray(), 0.6); own(p).color.set(0xffffff); }); show(v, s.crash, false); v.fade(s.flag, 0); };
    return [
      { say: 'A run uses each task, each agent and each harness many times.', go(v) { const s = v.s; reset(v, s); s.coins.forEach((c, i) => v.tw.to(c.position, 'y', 0.1 + i * 0.06)); } },
      { say: 'Crucible reserves the budget before each attempt and settles it after. A crash does not lose the count.', go(v) { const s = v.s; s.coins.slice(5).forEach(c => v.tw.to(c.position, 'y', c.position.y + 0.5, 0.6)); } },
      { say: 'The harness runs the agent in a new world.', go(v) { const s = v.s; s.pods.slice(0, 3).forEach((p, i) => moveTo(v, p, [-0.5 + i * 0.2, 0.32 + i * 0.12, -0.2], 0.8)); } },
      { say: 'A fixed checker scores the final state. The agent never scores its own work.', go(v) { const s = v.s; s.pods.slice(0, 3).forEach((p, i) => moveTo(v, p, [0.8 + i * 0.15, 0.7 + i * 0.12, -0.2], 0.8)); } },
      { say: 'Crucible scores agent faults. It removes system faults from all averages.', go(v) {
        const s = v.s; const [a, b, c] = s.pods;
        moveTo(v, a, [2.4, 0.16, -1.1], 0.9); own(a).color.set(PAL.cardinal);
        moveTo(v, b, [2.6, 0.16, -0.9], 0.9); own(b).color.set(PAL.cardinal);
        moveTo(v, c, [2.5, 0.2, 0.7], 0.9); own(c).color.set(0xb7b2ae);
        s.coins.slice(5).forEach((cn, i) => v.tw.to(cn.position, 'y', 0.1 + (5 + i) * 0.06, 0.6));
      } },
      { say: 'Crucible writes down each attempt. A run that continues never repeats finished work.', go(v) { const s = v.s; v.tw.to(s.journal, 'scale', V(1, 3.2, 1), 0.8); } },
      { say: 'After a crash, the run continues from its last save point.', go(v) {
        const s = v.s; v.fade(s.flag, 1); show(v, s.crash, true); const p = s.pods[3]; moveTo(v, p, [-0.3, 0.45, -0.2], 0.7);
        v.later(() => { own(p).color.set(PAL.ember); moveTo(v, p, [-0.75, 0.3, 0.45], 0.5); }, 800);
        v.later(() => { own(p).color.set(0xffffff); moveTo(v, p, [0.9, 0.7, -0.2], 0.8); }, 1600);
      } },
    ];
  })(),
});

// ================================================================================================================= M12
export const m12 = () => ({
  size: 4.8, minWidth: 7.2, target: [0, 0.8, 0], az: 0.6, elev: 0.5,
  setup(v) {
    const s = v.s = {};
    s.envs = [0, 1, 2, 3].map(i => { const b = block(0.42, 0.32, 0.42); b.position.set(-2.8, 0, -1.2 + i * 0.8); v.add(b); return b; });
    v.label('worlds', V(-2.8, 1.0, -1.5), { cls: '' });
    // inference engines as stacks of accelerator boards, each with a status light
    s.engines = [0, 1].map(i => {
      const g = new THREE.Group(); g.position.set(-0.6, 0, -0.55 + i * 1.1); v.add(g);
      for (let k = 0; k < 4; k++) {
        const b = block(0.62, 0.11, 0.62); b.position.y = 0.05 + k * 0.17; g.add(b);
        const led = sphere(0.025, { color: k === 3 ? PAL.cardinal : PAL.pass }); led.position.set(0.22, 0.1 + k * 0.17, 0.315); g.add(led);
      }
      const cap = block(0.66, 0.04, 0.66, { color: PAL.cardinal, kind: 'gloss', edge: null }); cap.position.y = 0.73; g.add(cap);
      return g;
    });
    v.label('models that act', V(-0.6, 1.2, 0), { cls: '' });
    s.trainer = new THREE.Group(); s.trainer.position.set(2.35, 0, 0); v.add(s.trainer);
    s.trainer.add(block(0.95, 0.72, 0.95));
    const band = block(0.97, 0.12, 0.97, { color: PAL.cardinal, kind: 'gloss', edge: null }); band.position.y = 0.72; s.trainer.add(band);
    [0, 1, 2].forEach(k => { const fin = block(0.8, 0.02, 0.06, { color: PAL.rule, edge: null }); fin.position.set(0, 0.2 + k * 0.16, 0.48); s.trainer.add(fin); });
    v.label('trainer', anchor(s.trainer, 0, 1.15, 0), { cls: 'tag' });
    const buf = block(0.7, 0.05, 1.5); buf.position.set(0.95, 0, 0); v.add(buf);
    v.label('collected data', anchor(buf, 0, 0.1, 0.95), { cls: 'ghost' });
    s.band = block(0.75, 0.55, 1.55, { kind: 'glass', edge: PAL.cardinal }); s.band.position.set(0.95, 0.05, 0); v.add(s.band); v.setAlpha(s.band, 0);
    s.staleL = v.label('2 versions old at most', anchor(s.band, 0, 0.8, 0), { cls: 'red' }); s.staleL.opacity = 0;
    const vcol = [PAL.cardinal, PAL.ember, 0xc9a2a2];
    s.roll = [];
    s.envs.forEach((e, i) => {
      const eng = s.engines[i % 2];
      s.roll.push(v.flow(arc(V(-2.6, 0.3, e.position.z), V(-0.85, 0.7, eng.position.z), 0.5), { count: 3, speed: 0.35, r: 0.045, color: vcol[i % 3], offset: i * 0.2 }));
      s.roll.push(v.flow(arc(V(-0.85, 0.5, eng.position.z), V(-2.6, 0.25, e.position.z), 0.3), { count: 2, speed: 0.35, r: 0.04, color: PAL.ink, offset: i * 0.3 }));
    });
    s.toBuf = s.engines.map((e, i) => v.flow(arc(V(-0.3, 0.6, e.position.z), V(0.8, 0.12, -0.4 + i * 0.8), 0.4), { count: 3, speed: 0.3, r: 0.05, color: vcol[i] }));
    s.toTrain = v.flow(arc(V(1.25, 0.12, 0), V(1.9, 0.5, 0), 0.3), { count: 3, speed: 0.35, r: 0.05 });
    s.sync = s.engines.map(e => v.flow(arc(V(2.2, 0.95, 0), V(-0.6, 0.85, e.position.z), 1.0), { count: 2, speed: 0.45, r: 0.07, color: PAL.cardinal }));
    s.sync.forEach(f => f.target = 0);
    s.syncL = v.label('new weights, version 5', V(0.9, 1.95, 0), { cls: "tag" }); s.syncL.opacity = 0;
    s.tokL = v.label('each token keeps its version', V(-1.7, 1.5, 0.9), { cls: 'code' }); s.tokL.opacity = 0;
    s.gpu = block(4.3, 0.04, 2.3, { kind: 'glass', edge: PAL.stone }); s.gpu.position.set(0.85, -0.04, 0); v.add(s.gpu); v.setAlpha(s.gpu, 0);
    s.topoL = v.label('', V(0.85, 0.1, 1.45), { cls: 'red' }); s.topoL.opacity = 0;
  },
  steps: (() => {
    const base = (v, s) => { s.sync.forEach(f => f.target = 0); [s.syncL, s.tokL, s.staleL, s.topoL].forEach(l => show(v, l, false)); v.fade(s.band, 0); v.fade(s.gpu, 0); };
    return [
      { say: 'Crucible limits the data that waits for training. Sampling never gets far ahead of learning.', go(v) { base(v, v.s); v.s.roll.forEach(f => f.target = 0.35); } },
      { say: 'Each episode runs as its own task. The models and the worlds take turns.', go(v) { v.s.roll.forEach(f => f.target = 1); } },
      { say: 'Each token keeps its ID, its probability and the model version that made it.', go(v) { show(v, v.s.tokL, true); } },
      { say: 'When a group of samples is complete, Crucible compares each sample with the group average.', go(v) { show(v, v.s.tokL, false); v.s.toBuf.forEach(f => f.target = 1); } },
      { say: 'Crucible uses only recent data. In the GPU run, data is two versions old at most.', go(v) { v.fade(v.s.band, 1); show(v, v.s.staleL, true); } },
      { say: 'Crucible corrects the weight of each token for its age. Then the trainer updates the model.', go(v) { const s = v.s; show(v, s.staleL, false); v.fade(s.band, 0); v.tw.to(s.trainer.scale, 'y', 1.15, 0.4); v.later(() => v.tw.to(s.trainer.scale, 'y', 1, 0.4), 450); } },
      { say: 'The new weights arrive in one step. The next tokens carry the next version number.', go(v) { const s = v.s; s.sync.forEach(f => f.target = 1); show(v, s.syncL, true); } },
      { say: 'One scheduler runs on one shared GPU, on partly shared GPUs, or on separate machines.', go(v) {
        const s = v.s; s.sync.forEach(f => f.target = 0); show(v, s.syncL, false); v.fade(s.gpu, 1); s.topoL.el.textContent = 'one shared GPU, the models take turns'; show(v, s.topoL, true);
      } },
    ];
  })(),
});

// ========================================================================================================= long horizon
export const lh = () => ({
  size: 4.8, target: [0, 1.4, 0], az: 0.6, elev: 0.38,
  setup(v) {
    const s = v.s = {};
    const turns = 3.2, R = 1.55, Hh = 2.7;
    const pts = [];
    for (let i = 0; i <= 240; i++) { const u = i / 240, a = u * turns * Math.PI * 2; pts.push(V(Math.cos(a) * R, 0.15 + u * Hh, Math.sin(a) * R)); }
    const curve = new THREE.CatmullRomCurve3(pts); s.curve = curve;
    v.add(tube(curve, 0.022, PAL.rule, 'clay', 600));
    const prog = tube(curve, 0.034, PAL.cardinal, 'gloss', 600); s.prog = prog; s.N = prog.geometry.index.count; prog.geometry.setDrawRange(0, 0); v.add(prog);
    const col = cyl(0.12, Hh + 0.2, { edge: null, seg: 16 }); v.add(col);
    s.lens = new THREE.Mesh(new THREE.TorusGeometry(0.2, 0.025, 10, 40), mat('gloss', PAL.cardinal)); s.lens.castShadow = true; v.add(s.lens);
    s.u = 0; s.speed = 0.035; s.running = true;
    s.flags = [0.22, 0.44, 0.66, 0.88].map(u => { const f = flagPole(PAL.cardinal, 0.38); const p = curve.getPointAt(u); f.position.copy(p); v.add(f); v.setAlpha(f, 0); f.userData.u = u; return f; });
    s.gems = [0.3, 0.55, 0.78].map(u => { const o = octa(0.1); const p = curve.getPointAt(u); o.position.set(p.x * 0.55, p.y, p.z * 0.55); v.add(o); o.scale.setScalar(0.001); o.userData.u = u; return o; });
    const barBack = block(0.22, 2.2, 0.22, { kind: 'glass', edge: PAL.stone }); barBack.position.set(2.65, 0, -0.6); v.add(barBack);
    s.fill = block(0.18, 1, 0.18, { color: PAL.cardinal, kind: 'gloss', edge: null }); s.fill.position.set(2.65, 0, -0.6); s.fill.scale.y = 0.05; v.add(s.fill);
    s.fillL = v.label('context', V(2.65, 2.5, -0.6), { cls: '' });
    s.trig = line([V(2.45, 1.76, -0.6), V(2.85, 1.76, -0.6)], PAL.ink); v.add(s.trig);
    v.label('80%', V(3.05, 1.76, -0.6), { cls: 'ghost', align: 'left' });
    s.compL = v.label('summary written, new segment', V(0, 3.35, 0), { cls: 'tag' }); s.compL.opacity = 0;
    s.crashL = v.label('crash', V(0, 3.35, 0), { cls: 'red' }); s.crashL.opacity = 0;
    s.sumL = v.label('step scores add up to 1.0000', V(0, 3.35, 0), { cls: 'big' }); s.sumL.opacity = 0;
    s.bolt = line([V(-0.3, 3.0, 0.4), V(0.0, 2.6, 0.5), V(-0.15, 2.4, 0.5), V(0.2, 1.9, 0.6)], PAL.bright); v.add(s.bolt); v.setAlpha(s.bolt, 0);
  },
  update(v, t, dt) {
    const s = v.s;
    if (s.running) s.u = Math.min(0.999, s.u + dt * s.speed);
    const p = s.curve.getPointAt(s.u); s.lens.position.copy(p);
    const tng = s.curve.getTangentAt(s.u); s.lens.lookAt(p.clone().add(tng));
    s.prog.geometry.setDrawRange(0, Math.floor(s.N * s.u / 6) * 6);
    const seg = s.compactAt ?? 0;
    const fill = Math.min(1, Math.max(0.05, (s.u - seg) * 4.2));
    s.fill.scale.y = fill * 2.2;
  },
  steps: [
    { say: 'Each step goes into the record. Crucible checks again only the goals that the step touched.', go(v) {
      const s = v.s; s.u = 0.02; s.compactAt = 0; s.running = true; s.speed = 0.035; [s.compL, s.crashL, s.sumL].forEach(l => show(v, l, false));
      s.flags.forEach(f => v.fade(f, 0)); s.gems.forEach(g => scaleTo(v, g, 0.001)); v.fade(s.bolt, 0);
    } },
    { say: 'During a long shift, the context grows toward its limit.', go(v) { v.s.speed = 0.05; } },
    { say: 'At 80% of the limit, the model writes its own summary. A new segment starts.', go(v) {
      const s = v.s; show(v, s.compL, true); s.compactAt = s.u; scaleTo(v, s.gems[0], 1, 0.6);
    } },
    { say: 'Crucible saves the world, the model state and the progress together every few steps.', go(v) { const s = v.s; show(v, s.compL, false); s.flags.forEach(f => { if (f.userData.u < s.u + 0.15) v.fade(f, 1); }); } },
    { say: 'A process stops during the episode.', go(v) { const s = v.s; s.running = false; v.fade(s.bolt, 1); show(v, s.crashL, true); } },
    { say: 'The run continues from its last save. It fills one segment again, not the full history.', go(v) {
      const s = v.s; v.fade(s.bolt, 0); show(v, s.crashL, false);
      const last = s.flags.filter(f => f.userData.u <= s.u).pop(); s.u = last ? last.userData.u : 0.02; s.running = true; s.compactAt = s.u - 0.05;
    } },
    { say: 'The step scores add up to the final reward exactly. The total is 1.0000 over 1.1 million tokens.', go(v) {
      const s = v.s; s.speed = 0.25; s.gems.forEach((g, i) => v.later(() => scaleTo(v, g, 1, 0.5), i * 300)); s.flags.forEach(f => v.fade(f, 1)); show(v, s.sumL, true);
    } },
  ],
});

// ================================================================================================================= RLM
const DRAWER_Y = i => 0.78 + (4 - i) * 0.25;
export const rlm = () => ({
  size: 4.8, minWidth: 7.0, target: [0.3, 1.1, 0], az: 0.55, elev: 0.36,
  setup(v) {
    const s = v.s = {};
    v.add(dotGrid(7, 4.4, 0.32, { size: 1.8 }));
    const desk = block(1.0, 0.6, 0.7); desk.position.set(-2.6, 0, 0); v.add(desk);
    s.avatar = sphere(0.2, { color: PAL.cardinal }); s.avatar.position.set(-2.6, 0.95, 0); v.add(s.avatar);
    v.label('model', anchor(s.avatar, 0, 0.42, 0), { cls: 'tag' });
    s.scroll = block(0.5, 0.02, 0.62); s.scroll.position.set(-2.6, 0.62, 0.05); v.add(s.scroll);
    s.scrollL = v.label('short prompt', anchor(s.scroll, 0, -0.1, 0.6), { cls: 'ghost' });
    s.kernel = new THREE.Group(); s.kernel.position.set(0.4, 1.35, 0); v.add(s.kernel);
    s.kernel.add(dottedSphere(ENV.MOBILE ? 420 : 760, 1.05, PAL.cardinal, 2.6));
    const inner = new THREE.Mesh(new THREE.SphereGeometry(0.98, 40, 24), mat('glass', 0xffffff)); s.kernel.add(inner);
    const ped = cyl(0.55, 0.28, { seg: 48 }); ped.position.set(0.4, 0, 0); v.add(ped);
    v.label('sandboxed memory', V(0.4, 2.75, 0), { cls: '' });
    const drawers = ['task', 'tools', 'observations', 'messages', 'history'];
    s.drawers = drawers.map((n, i) => {
      // a cabinet of variables inside the kernel: TASK on top, HISTORY (the archive) at the bottom
      const d = block(0.78, 0.19, 0.46, { color: n === 'history' ? PAL.blush : undefined });
      d.position.set(0.4, DRAWER_Y(i), 0.12); v.add(d);
      const knob = sphere(0.022, { color: PAL.cardinal }); knob.position.set(0, 0.095, 0.235); d.add(knob);
      v.label(n, anchor(d, 0.46, 0.1, 0.1), { cls: 'code', align: 'left' });
      return d;
    });
    const world = new THREE.Group(); world.position.set(3.0, 0, 0.2); v.add(world);
    world.add(block(1.0, 0.08, 1.0)); [[-0.2, -0.2, 0.3], [0.22, 0.15, 0.2], [0.15, -0.25, 0.42]].forEach(([x, z, h]) => { const b = block(0.24, h, 0.24); b.position.set(x, 0.08, z); world.add(b); });
    v.label('world', anchor(world, 0, 0.75, 0));
    s.code = v.flow(arc(V(-2.35, 1.0, 0), V(-0.6, 1.35, 0), 0.5), { count: 4, speed: 0.35, r: 0.05 });
    s.call = v.flow(arc(V(1.4, 1.2, 0.1), V(2.8, 0.45, 0.2), 0.5), { count: 3, speed: 0.4, r: 0.055, color: PAL.ink });
    s.back = v.flow(arc(V(2.8, 0.4, 0.3), V(1.35, 1.0, 0.3), 0.2), { count: 3, speed: 0.4, r: 0.045, color: PAL.cardinal });
    s.subs = [0, 1, 2].map(i => { const o = sphere(0.12, { color: 0xffffff, kind: 'clay' }); o.position.set(-0.4 + i * 0.75, 3.1, -0.9); v.add(o); return o; });
    s.subL = v.label('helper models', V(0.35, 3.45, -0.9), { cls: 'ghost' });
    s.subF = s.subs.map((o, i) => v.flow(arc(V(0.4, 2.3, -0.2), V(-0.4 + i * 0.75, 3.0, -0.9), 0.3), { count: 2, speed: 0.45, r: 0.04, color: PAL.ember, offset: i * 0.3 }));
    s.capsule = new THREE.Mesh(new THREE.CapsuleGeometry(0.07, 0.2, 6, 12), mat('gloss', PAL.cardinal)); s.capsule.castShadow = true; v.add(s.capsule); s.capsule.visible = false;
    s.capL = v.label('kept word for word', anchor(s.capsule, 0, 0.25, 0), { cls: 'red' }); s.capL.opacity = 0;
    s.stepL = v.label('world step 1', V(2.3, 1.25, 0.4), { cls: 'code' }); s.stepL.opacity = 0; s.stepN = 0; s.stepT = 0;
    s.outL = v.label('output limit 8,192 characters', V(-1.5, 1.75, 0.2), { cls: 'code' }); s.outL.opacity = 0;
    s.doneL = v.label('final summary', V(-2.6, 1.6, 0), { cls: 'tag' }); s.doneL.opacity = 0;
  },
  update(v, t, dt) {
    const s = v.s; s.kernel.rotation.y = t * 0.15;
    if (s.counting) { s.stepT += dt; if (s.stepT > 0.9) { s.stepT = 0; s.stepN++; s.stepL.el.textContent = 'world step ' + s.stepN; } }
  },
  steps: (() => {
    const base = (v, s) => {
      s.code.target = 0; s.call.target = 0; s.back.target = 0; s.subF.forEach(f => f.target = 0); s.counting = false;
      [s.capL, s.stepL, s.outL, s.doneL].forEach(l => show(v, l, false)); s.capsule.visible = false; v.tw.to(s.scroll, 'scale', V(1, 1, 1), 0.4);
    };
    return [
      { say: 'The task, the tools, each observation and each message are variables in a sandboxed memory.', go(v) { const s = v.s; base(v, s); s.drawers.forEach((d, i) => { d.position.y = DRAWER_Y(i) + 0.5; v.tw.to(d.position, 'y', DRAWER_Y(i), 0.6 + i * 0.1); }); } },
      { say: 'The model replies with a code cell. Crucible limits the output of the cell to 8,192 characters.', go(v) { const s = v.s; base(v, s); s.code.target = 1; show(v, s.outL, true); } },
      { say: 'Each world call in a cell is one world step. Crucible records it like any other action.', go(v) { const s = v.s; s.call.target = 1; s.back.target = 1; s.counting = true; s.stepN = 1; show(v, s.stepL, true); show(v, s.outL, false); } },
      { say: 'The model sends questions to helper models. Each helper call shares the credit of the call that made it.', go(v) { const s = v.s; s.subF.forEach(f => f.target = 1); } },
      { say: 'When the prompt is full, Crucible moves old turns to the history word for word. The model can still search them.', go(v) {
        const s = v.s; s.subF.forEach(f => f.target = 0); v.tw.to(s.scroll, 'scale', V(0.12, 1, 1), 0.6);
        s.capsule.visible = true; s.capsule.position.set(-2.6, 0.75, 0.1); show(v, s.capL, true);
        const h = s.drawers[4].position; moveTo(v, s.capsule, [h.x - 0.12, h.y + 0.1, h.z + 0.3], 1.4);
      } },
      { say: 'The model ends with a summary. The memory log can rebuild its exact state.', go(v) { const s = v.s; s.call.target = 0; s.back.target = 0; s.counting = false; show(v, s.capL, false); show(v, s.doneL, true); v.tw.to(s.scroll, 'scale', V(1, 1, 1), 0.6); } },
    ];
  })(),
});

// ======================================================================================================= task manager
export const fsm = () => ({
  size: 4.4, target: [0, 0.6, 0], az: 0.7, elev: 0.62,
  setup(v) {
    const s = v.s = {};
    const R = 1.75;
    const names = ['planner', 'editor', 'reviewer', 'checker'];
    const icons = [
      () => sheetStack(2, 0.42, 0.52),
      () => { const g = new THREE.Group(); const h = block(0.12, 0.5, 0.12); g.add(h); const hd = block(0.42, 0.16, 0.18, { color: PAL.cardinal, kind: 'gloss' }); hd.position.y = 0.48; g.add(hd); return g; },
      () => { const g = new THREE.Group(); const r = ring(0.2, 0.035, PAL.ink, 'gloss'); r.rotation.x = 0; r.position.y = 0.42; g.add(r); const h = cyl(0.03, 0.26, { edge: null, color: PAL.ink, kind: 'gloss' }); g.add(h); return g; },
      () => { const g = new THREE.Group(); for (let i = 0; i < 3; i++) for (let j = 0; j < 2; j++) { const t = block(0.14, 0.06, 0.14, { color: PAL.pass, kind: 'gloss', edge: null }); t.position.set(-0.1 + j * 0.2, i * 0.1, 0); g.add(t); } return g; },
    ];
    s.st = names.map((n, i) => {
      const a = -Math.PI / 2 + i * Math.PI / 2;
      const g = new THREE.Group(); g.position.set(Math.cos(a) * R, 0, Math.sin(a) * R); v.add(g);
      g.add(cyl(0.45, 0.16, { seg: 40 })); const ic = icons[i](); ic.position.y = 0.16; g.add(ic);
      const lab = v.label(n, anchor(g, 0, 1.0, 0)); return { g, lab, a };
    });
    const loop = []; for (let i = 0; i <= 120; i++) { const a = -Math.PI / 2 + i / 120 * Math.PI * 2; loop.push(V(Math.cos(a) * R, 0.2, Math.sin(a) * R)); }
    v.add(tube(new THREE.CatmullRomCurve3(loop, true), 0.016, PAL.rule, 'clay', 240));
    s.cube = cube(0.3, { color: 0xffffff, edge: PAL.cardinal }); v.add(s.cube); s.ca = -Math.PI / 2; s.caTo = s.ca;
    const vault = block(0.7, 0.55, 0.7, { color: PAL.cardinal, kind: 'gloss' }); vault.position.set(0, 0, 0); v.add(vault);
    v.label('saved', anchor(vault, 0, 0.85, 0), { cls: 'tag' });
    s.find = v.flow(arc(V(Math.cos(Math.PI / 2) * R, 0.4, Math.sin(Math.PI / 2) * R), V(0, 0.4, -R), 1.2, V(-1.4, 1.4, 0)), { count: 3, speed: 0.4, r: 0.06, color: PAL.warn });
    s.find.target = 0;
    s.findL = v.label('findings go back', V(-1.5, 1.6, 0), { cls: 'code' }); s.findL.opacity = 0;
    s.okL = v.label('review passed, checks passed', V(0, 1.55, 0), { cls: 'pass' }); s.okL.opacity = 0;
  },
  update(v, t, dt) {
    const s = v.s; s.ca += (s.caTo - s.ca) * Math.min(1, dt * 2.2);
    if (s.toVault) { s.cube.position.lerp(V(0, 0.62, 0), Math.min(1, dt * 2)); return; }
    s.cube.position.set(Math.cos(s.ca) * 1.75, 0.45 + Math.sin(t * 3) * 0.03, Math.sin(s.ca) * 1.75);
  },
  steps: (() => {
    const go = i => v => { const s = v.s; s.toVault = false; let target = -Math.PI / 2 + i * Math.PI / 2; while (target < s.ca - 0.01) target += Math.PI * 2; s.caTo = target; s.st.forEach((st, k) => st.lab.el.classList.toggle('tag', k === i)); s.find.target = 0; show(v, s.findL, false); show(v, s.okL, false); };
    return [
      { say: 'The planner reads the report from the quality gate and writes a plan.', go: go(0) },
      { say: 'A helper agent changes a copy of the task.', go: go(1) },
      { say: 'A different model reviews the change and looks for real errors.', go: go(2) },
      { say: 'The quality gate runs its checks. No model decides this step.', go: go(3) },
      { say: 'If a step rejects the change, the findings go back to the planner.', go(v) { go(4)(v); v.s.find.target = 1; show(v, v.s.findL, true); } },
      { say: 'Crucible saves the new version only when the review and the checks both pass.', go(v) { const s = v.s; s.st.forEach(st => st.lab.el.classList.remove('tag')); s.toVault = true; show(v, s.okL, true); } },
    ];
  })(),
});

// ================================================================================================================= M13
const SCORES = { 'agent A': [0, 1, 0, 1, 1, 1, 1], 'agent B': [0, 0.67, 1, 0.5, 1, 0.5, 1], 'agent C': [0, 0.67, 1, 0, 1, 0, 1] };
const TASKS = ['task 1', 'task 2', 'task 3', 'task 4', 'task 5', 'task 6', 'task 7'];
export const m13 = () => ({
  size: 4.8, minWidth: 6.8, target: [0, 0.7, 0], az: 0.62, elev: 0.55,
  setup(v) {
    const s = v.s = { bars: [] };
    const floor = block(5.4, 0.06, 3.0); v.add(floor);
    Object.entries(SCORES).forEach(([m, row], r) => {
      row.forEach((val, c) => {
        const b = block(0.42, 1, 0.42, { color: 0xffffff }); b.position.set(-2.1 + c * 0.7, 0.06, -0.85 + r * 0.85); b.scale.y = 0.02; v.add(b);
        b.userData = { val, r, c, anchor: c < 2 }; s.bars.push(b);
      });
      v.label(m, V(-2.75, 0.1, -0.85 + r * 0.85), { cls: r === 2 ? 'code' : 'red', align: 'right' });
    });
    TASKS.forEach((n, c) => v.label(n, V(-2.1 + c * 0.7, 0.06, 1.55), { cls: 'ghost' }));
    s.env = block(0.8, 0.06, 0.55, { edge: PAL.cardinal }); s.env.position.set(0, 2.2, 0); v.add(s.env);
    s.seal = cyl(0.11, 0.03, { color: PAL.cardinal, kind: 'gloss', edge: null }); s.seal.position.set(0, 2.29, 0); v.add(s.seal);
    s.sealL = v.label('sealed test items', anchor(s.env, 0, 0.35, 0), { cls: 'red' });
    const ruler = block(5.0, 0.04, 0.08); ruler.position.set(0, 2.55, -1.3); v.add(ruler); s.ruler = ruler; v.setAlpha(ruler, 0);
    s.marks = [['A +0.60', 0.6], ['B −0.01', -0.01], ['C −0.59', -0.59]].map(([n, th], i) => {
      const m = sphere(0.09, { color: i === 2 ? PAL.grey : PAL.cardinal }); m.position.set(th * 2.6, 2.62, -1.3); v.add(m); v.setAlpha(m, 0);
      const l = v.label(n, anchor(m, 0, 0.28, 0), { cls: 'code' }); l.opacity = 0; return { m, l };
    });
    s.rulerL = v.label('one shared scale', V(-2.0, 2.95, -1.3), { cls: '' }); s.rulerL.opacity = 0;
    s.digest = v.label('identical report on each run', V(0, 2.4, 0.4), { cls: 'tag' }); s.digest.opacity = 0;
    s.valid = v.label('solution passes, empty attempt fails', V(0, 2.4, 0.4), { cls: 'pass' }); s.valid.opacity = 0;
  },
  steps: (() => {
    const heights = (v, s, mode) => s.bars.forEach(b => {
      const u = b.userData; const m = own(b);
      if (mode === 'zero') { v.tw.to(b.scale, 'y', 0.02, 0.6); m.color.set(0xffffff); }
      else if (mode === "items") { v.tw.to(b.scale, "y", u.r === 0 ? (u.anchor ? 0.8 : 0.6) : 0.02, 0.8); m.color.set(u.anchor ? 0xd8d2cf : PAL.blush); }
      else { v.tw.to(b.scale, 'y', Math.max(0.03, u.val * 1.1), 0.9 + u.c * 0.06); m.color.set(new THREE.Color(0xffffff).lerp(new THREE.Color(PAL.cardinal), u.val)); }
    });
    const hideAll = (v, s) => { [s.digest, s.valid, s.rulerL].forEach(l => show(v, l, false)); v.fade(s.ruler, 0); s.marks.forEach(k => { v.fade(k.m, 0); show(v, k.l, false); }); };
    return [
      { say: 'Crucible divides the items by their source and seals the test items before anyone sees them.', go(v) { const s = v.s; hideAll(v, s); heights(v, s, 'zero'); v.fade(s.env, 1); v.fade(s.seal, 1); show(v, s.sealL, true); } },
      { say: 'The benchmark uses fixed items and new items from secret seeds.', go(v) { const s = v.s; heights(v, s, 'items'); show(v, s.sealL, false); v.fade(s.env, 0); v.fade(s.seal, 0); } },
      { say: 'The solution must solve each new item. An empty attempt must fail it.', go(v) { show(v, v.s.valid, true); } },
      { say: 'The agents run and Crucible measures each step. Removed runs do not count.', go(v) { const s = v.s; show(v, s.valid, false); heights(v, s, 'scores'); } },
      { say: 'A statistical model puts the models and the items on one scale.', go(v) { const s = v.s; v.fade(s.ruler, 1); show(v, s.rulerL, true); s.marks.forEach((k, i) => v.later(() => { v.fade(k.m, 1); show(v, k.l, true); }, i * 200)); } },
      { say: 'Crucible writes one report. The report is identical each time you run it.', go(v) { const s = v.s; show(v, s.rulerL, false); show(v, s.digest, true); } },
    ];
  })(),
});

// ================================================================================================================= M11
export const m11 = () => ({
  size: 4.8, minWidth: 7.0, target: [0.4, 0.9, 0], az: 0.55, elev: 0.48,
  setup(v) {
    const s = v.s = {};
    v.add(dotGrid(7, 4.6, 0.32, { size: 1.8 }));
    // recorded episodes arrive as capsules; each is normalized, replayed in a fresh world and graded once
    const tray = block(1.1, 0.06, 1.3); tray.position.set(-2.7, 0, 0.1); v.add(tray);
    v.label('recorded episodes', anchor(tray, 0, 0.1, 0.85), { cls: '' });
    s.caps = [0, 1, 2].map(i => {
      const c = new THREE.Mesh(new THREE.CapsuleGeometry(0.08, 0.26, 6, 14), mat('gloss', i === 1 ? PAL.cardinal : 0xffffff)); own(c);
      c.rotation.z = Math.PI / 2; c.castShadow = true; c.position.set(-2.7, 0.16, -0.35 + i * 0.35); c.userData.home = c.position.clone(); v.add(c); return c;
    });
    const norm = arch(0.7, 0.62, 0.06); norm.rotation.y = Math.PI / 2; norm.position.set(-1.5, 0, 0.1); v.add(norm);
    v.label('standard actions', anchor(norm, 0, 0.85, 0), { cls: 'code' });
    s.ids = v.label('own action IDs', anchor(norm, 0, 1.15, 0), { cls: 'red' }); s.ids.opacity = 0;
    s.world = block(0.9, 0.7, 0.9, { kind: 'glass', edge: PAL.cardinal }); s.world.position.set(-0.2, 0, 0.1); v.add(s.world);
    [[-0.2, -0.18, 0.3], [0.18, 0.2, 0.2], [0.2, -0.2, 0.42]].forEach(([x, z, h]) => { const b = block(0.2, h, 0.2); b.position.set(-0.2 + x, 0.02, 0.1 + z); v.add(b); });
    v.label('fresh world', anchor(s.world, 0, 1.0, 0));
    s.ico = new THREE.Mesh(new THREE.IcosahedronGeometry(0.36, 0), mat('gloss', PAL.cardinal)); s.ico.castShadow = true; s.ico.position.set(1.25, 1.05, 0.1); v.add(s.ico);
    const ped = cyl(0.45, 0.45, { seg: 40 }); ped.position.set(1.25, 0, 0.1); v.add(ped);
    v.label('one scorer', anchor(s.ico, 0, 0.7, 0), { cls: 'tag' });
    const names = ['reward file', 'step file', 'training rows'];
    s.outs = names.map((n, i) => {
      const st = sheetStack(1, 0.42, 0.52); st.position.set(2.9, 0, -0.95 + i * 0.95); v.add(st);
      const l = v.label(n, V(2.9, 0.05, -0.95 + i * 0.95), { cls: 'code', align: 'left', dx: 34 });
      const f = v.flow(arc(V(1.55, 0.9, 0.1), V(2.75, 0.2, -0.95 + i * 0.95), 0.4), { count: 3, speed: 0.32, r: 0.045, offset: i * 0.2 }); f.target = 0;
      return { st, l, f };
    });
    s.inF = v.flow(arc(V(-2.5, 0.3, 0.1), V(-0.55, 0.45, 0.1), 0.5), { count: 3, speed: 0.3, r: 0.05, color: PAL.ink }); s.inF.target = 0;
    s.toG = v.flow(arc(V(0.2, 0.6, 0.1), V(0.95, 0.9, 0.1), 0.3), { count: 3, speed: 0.35, r: 0.05 }); s.toG.target = 0;
    s.same = v.label('identical on every replay', V(2.9, 1.25, 0), { cls: 'pass' }); s.same.opacity = 0;
    s.mask = v.label('system fault, never written as 0', V(-1.5, 1.45, 0.1), { cls: 'code' }); s.mask.opacity = 0;
  },
  update(v, t) { v.s.ico.rotation.y = t * 0.4; v.s.ico.rotation.x = t * 0.2; },
  steps: (() => {
    const base = (v, s) => { s.outs.forEach(o => { o.f.target = 0; v.tw.to(o.st, 'scale', V(1, 1, 1), 0.4); }); [s.same, s.ids, s.mask].forEach(l => show(v, l, false)); s.inF.target = 0; s.toG.target = 0; };
    return [
      { say: 'A recorded run arrives as a list of actions.', go(v) { const s = v.s; base(v, s); s.caps.forEach(c => { moveTo(v, c, c.userData.home.toArray(), 0.6); own(c).color.set(c === s.caps[1] ? PAL.cardinal : 0xffffff); }); } },
      { say: 'Crucible turns the list into standard actions. It makes its own action IDs and does not trust the record.', go(v) { const s = v.s; s.inF.target = 1; show(v, s.ids, true); moveTo(v, s.caps[1], [-1.5, 0.3, 0.1], 0.8); } },
      { say: 'The actions run again in a new world, not against a saved answer.', go(v) { const s = v.s; show(v, s.ids, false); moveTo(v, s.caps[1], [-0.2, 0.85, 0.1], 0.8); } },
      { say: 'One scorer scores the replay and each step.', go(v) { const s = v.s; s.inF.target = 0; s.toG.target = 1; v.tw.to(s.ico.scale, 'x', 1.25, 0.4); v.later(() => v.tw.to(s.ico.scale, 'x', 1, 0.4), 450); } },
      { say: 'Each run gives a reward file and a step file. The files are identical on each replay.', go(v) { const s = v.s; s.outs.slice(0, 2).forEach(o => { o.f.target = 1; v.tw.to(o.st, 'scale', V(1, 2.6, 1), 0.6); }); show(v, s.same, true); } },
      { say: 'The same scored steps become training rows with their scores.', go(v) { const s = v.s; show(v, s.same, false); s.outs[2].f.target = 1; v.tw.to(s.outs[2].st, 'scale', V(1, 2.6, 1), 0.6); } },
      { say: 'If the system broke a run, Crucible marks it. It never writes that run as zero.', go(v) { const s = v.s; s.toG.target = 0; s.outs.forEach(o => o.f.target = 0); own(s.caps[2]).color.set(0xb7b2ae); moveTo(v, s.caps[2], [-1.5, 0.3, 0.1], 0.8); show(v, s.mask, true); } },
    ];
  })(),
});

// ================================================================================================================= M14
export const m14 = () => ({
  size: 4.8, minWidth: 6.8, target: [0, 0.6, 0], az: 0.62, elev: 0.6,
  setup(v) {
    const s = v.s = {};
    const con = block(4.6, 0.3, 1.5); con.position.set(-0.4, 0, -0.9); v.add(con);
    v.label('shared base', anchor(con, -1.9, 0.45, 0.8), { cls: 'ghost', align: 'left' });
    const names = ['template', 'coding', 'accounts payable', 'your domain'];
    s.carts = names.map((n, i) => {
      const c = cart(0.62, 0.16, 0.8, i === 3 ? PAL.cardinal : undefined); c.position.set(-2.0 + i * 1.07, 1.6, 0.6); v.add(c);
      const l = v.label(n, anchor(c, 0, 0.32, 0), { cls: 'code' }); c.userData.slot = V(-2.0 + i * 1.07, 0.3, -0.9);
      return { c, l };
    });
    s.beam = new THREE.Mesh(new THREE.PlaneGeometry(4.6, 0.9), mat('flatT', PAL.cardinal)); own(s.beam).opacity = 0.12; s.beam.material.side = THREE.DoubleSide;
    s.beam.rotation.x = -Math.PI / 2; s.beam.position.set(-0.4, 0.55, -0.9); v.add(s.beam); v.setAlpha(s.beam, 0);
    s.lvl = v.label('', V(-0.4, 1.35, -0.9), { cls: 'tag' }); s.lvl.opacity = 0;
    // accounts payable: invoices through a three-way match
    const ap = new THREE.Group(); ap.position.set(0.3, 0, 1.25); ap.userData.fit = true; v.add(ap); s.ap = ap; v.setAlpha(ap, 0);
    const track = block(3.6, 0.04, 0.4); ap.add(track);
    ['order', 'receipt', 'invoice'].forEach((n, i) => { const a = arch(0.5, 0.5, 0.05); a.position.x = -1.0 + i * 0.9; a.rotation.y = Math.PI / 2; ap.add(a); s['apL' + i] = v.label(n, anchor(a, 0, 0.7, 0), { cls: 'ghost' }); s['apL' + i].opacity = 0; });
    s.inv = [0, 1, 2].map(i => { const c = block(0.3, 0.02, 0.22, { color: i === 1 ? 0xffffff : 0xffffff }); c.position.set(-1.7 - i * 0.45, 0.06, 0); ap.add(c); return c; });
    s.score = v.label('duplicate approved, score 0.0', V(1.6, 1.25, 1.25), { cls: 'red' }); s.score.opacity = 0;
  },
  update(v, t, dt) {
    const s = v.s;
    if (s.apOn) s.inv.forEach((c, i) => { c.position.x += dt * 0.6; if (c.position.x > 1.7) c.position.x = -1.7; });
  },
  steps: (() => {
    const lvl = (v, s, text) => { s.lvl.el.textContent = text; show(v, s.lvl, true); v.fade(s.beam, 1); s.beam.position.z = -1.6; v.tw.to(s.beam.position, 'z', -0.2, 1.4); };
    const apOff = (v, s) => { s.apOn = false; v.fade(s.ap, 0); [0, 1, 2].forEach(i => show(v, s['apL' + i], false)); show(v, s.score, false); };
    return [
      { say: 'One command makes a new pack that passes all checks.', go(v) { const s = v.s; apOff(v, s); show(v, s.lvl, false); v.fade(s.beam, 0); s.carts.forEach(({ c }, i) => moveTo(v, c, [-2.0 + i * 1.07, 1.6, 0.6], 0.6)); } },
      { say: 'One file names the hooks, the data sources, the reward range and the needs of live tasks.', go(v) { const s = v.s; s.carts.forEach(({ c }, i) => v.later(() => moveTo(v, c, c.userData.slot.toArray(), 0.8), i * 150)); } },
      { say: 'The structure check reads the manifest, license, layout, entry point and hooks.', go(v) { lvl(v, v.s, 'structure'); } },
      { say: 'Designed test cases get exactly the expected score. Some are correct and some are near misses.', go(v) { lvl(v, v.s, 'test cases'); } },
      { say: 'The solution gets the top score. The untouched task stays below it.', go(v) { lvl(v, v.s, 'meaning'); } },
      { say: 'In accounts payable, each invoice needs a three-way match. It compares the purchase order, the goods receipt and the invoice.', go(v) {
        const s = v.s; show(v, s.lvl, false); v.fade(s.beam, 0); v.fade(s.ap, 1); s.apOn = true; [0, 1, 2].forEach(i => show(v, s['apL' + i], true)); s.inv.forEach(c => own(c).color.set(0xffffff));
      } },
      { say: 'If the agent approves a duplicate or a blocked vendor, the controls give zero for the full episode.', go(v) { const s = v.s; own(s.inv[1]).color.set(PAL.cardinal); show(v, s.score, true); } },
    ];
  })(),
});

// ============================================================================================================= studio
export const studio = () => ({
  size: 5.0, minWidth: 7.2, target: [0.2, 0.55, 0], az: 0.5, elev: 0.6,
  setup(v) {
    const s = v.s = {};
    const logs = sheetStack(5, 0.7, 0.85); logs.position.set(-3.0, 0, 0); v.add(logs);
    v.label('workflow logs', anchor(logs, 0, 0.6, 0));
    const beltA = block(5.2, 0.05, 0.36); beltA.position.set(0.3, 0, -0.95); v.add(beltA);
    const beltB = block(5.2, 0.05, 0.36); beltB.position.set(0.3, 0, 0.95); v.add(beltB);
    v.label('label', V(-2.0, 0.05, -1.5), { cls: 'tag' }); v.label('build', V(-2.0, 0.05, 1.5), { cls: 'tag' });
    const mk = (o, x, z, n) => { o.position.set(x, 0.05, z); v.add(o); const l = v.label(n, anchor(o, 0, 0.85, 0), { cls: 'code' }); return { o, l }; };
    s.A = [
      mk(flagPole(PAL.cardinal, 0.55), -1.1, -0.95, 'feedback'),
      mk((() => { const g = new THREE.Group(); [0.1, 0.2, 0.32, 0.46].forEach((h, i) => { const b = block(0.12, h, 0.3); b.position.x = (i - 1.5) * 0.13; g.add(b); }); return g; })(), 0.2, -0.95, 'step scores'),
      mk((() => { const g = new THREE.Group(); ['SFT', 'DPO', 'KTO'].forEach((n, i) => { const j = cyl(0.13, 0.42, { kind: 'glass', edge: PAL.cardinal }); j.position.x = (i - 1) * 0.32; g.add(j); const f = cyl(0.11, 0.28 - i * 0.06, { color: PAL.cardinal, kind: 'gloss', edge: null }); f.position.x = (i - 1) * 0.32; g.add(f); }); return g; })(), 1.9, -0.95, 'training data'),
    ];
    s.B = [
      mk((() => { const g = new THREE.Group(); g.add(block(0.4, 0.16, 0.26)); const t = block(0.56, 0.08, 0.3); t.position.y = 0.16; g.add(t); return g; })(), -1.25, 0.95, 'build tasks'),
      mk((() => { const g = new THREE.Group(); [0.14, 0.24, 0.34].forEach(r => { const rg = ring(r, 0.014, PAL.pass, 'gloss'); rg.position.y = 0.05; g.add(rg); }); return g; })(), -0.2, 0.95, 'quality gate'),
      mk((() => { const r = new THREE.Mesh(new THREE.TorusGeometry(0.24, 0.035, 10, 40), mat('clay')); r.castShadow = true; r.position.y = 0.3; const g = new THREE.Group(); g.add(r); return g; })(), 0.85, 0.95, 'export'),
      mk(bars([0.6, 0.35, 0.8, 0.5], { w: 0.1, gap: 0.04, hmax: 0.7 }), 1.95, 0.95, 'report'),
    ];
    s.fa = v.flow(arc(V(-2.6, 0.35, -0.3), V(2.4, 0.15, -0.95), 0.4, V(-0.4, 0.5, -1.15)), { count: 6, speed: 0.22, r: 0.05 }); s.fa.target = 0;
    s.fb = v.flow(arc(V(-2.6, 0.35, 0.3), V(2.4, 0.15, 0.95), 0.4, V(-0.4, 0.5, 1.15)), { count: 6, speed: 0.22, r: 0.05, color: PAL.ink }); s.fb.target = 0;
  },
  onStep(v, i) { window.__studioTerm?.(i); },
  steps: (() => {
    const hi = (v, s, list) => { [...s.A, ...s.B].forEach(x => { const on = list.includes(x); x.l.el.classList.toggle('tag', on); v.tw.to(x.o.position, 'y', on ? 0.22 : 0.05, 0.5); }); };
    return [
      { say: 'Start with the workflow logs of your domain. Crucible checks the pack at all levels.', go(v) { const s = v.s; s.fa.target = 0; s.fb.target = 0; hi(v, s, []); } },
      { say: 'The label command reads the logs, removes secrets and finds the expert feedback.', go(v) { const s = v.s; s.fa.target = 1; s.fb.target = 0; hi(v, s, [s.A[0]]); } },
      { say: 'Milestones and progress give each agent turn its step score.', go(v) { const s = v.s; hi(v, s, [s.A[1]]); } },
      { say: 'It writes training rows with their scores, preference pairs and good or bad examples.', go(v) { const s = v.s; hi(v, s, [s.A[2]]); } },
      { say: 'The build command makes new tasks from the same logs. It does not use paid models.', go(v) { const s = v.s; s.fa.target = 0; s.fb.target = 1; hi(v, s, [s.B[0]]); } },
      { say: 'Each new task must pass the quality checks. No model takes part in them.', go(v) { const s = v.s; hi(v, s, [s.B[1]]); } },
      { say: 'The export step replays each solution into a reward file and a step file.', go(v) { const s = v.s; hi(v, s, [s.B[2]]); } },
      { say: 'The benchmark runs the accepted tasks and writes a full report.', go(v) { const s = v.s; hi(v, s, [s.B[3]]); } },
    ];
  })(),
});

// ============================================================================================================ results
const DATASETS = [
  { say: 'Two frontier models and one open model tried seven tasks. The bars show the first try pass rate.', vals: [0.71, 0.57, 0.43], names: ['frontier A', 'frontier B', 'open model'], fmt: x => x.toFixed(2) },
  { say: 'A statistical model puts the same three models on one scale, at +0.60, −0.01 and −0.59.', vals: [0.8, 0.5, 0.2], names: ['+0.60', '−0.01', '−0.59'], fmt: (x, i) => ['+0.60', '−0.01', '−0.59'][i] },
  { say: 'The same model solved the same backlog of 12 tickets. It scored 1.00 as a memory agent and 0.67 in a simple tool loop.', vals: [1, 0.67], names: ['memory agent', 'simple tool loop'], fmt: x => x.toFixed(2) },
  { say: 'In accounts payable, a correct clerk scores 1.00. An agent that approves all or does nothing scores 0.', vals: [1, 0, 0], names: ['correct clerk', 'approve all', 'do nothing'], fmt: x => x.toFixed(2) },
  { say: 'Crucible scored recorded coding runs on four seed tasks again. The bars show the mean reward and the sample count of each model.', vals: [1, 0.5, 0.14], names: ['model C · n=1', 'model D · n=2', 'model E · n=7'], fmt: x => x.toFixed(2) },
];
export const results = () => ({
  size: 4.4, target: [0, 1.0, 0], az: 0.58, elev: 0.42,
  setup(v) {
    const s = v.s = {};
    v.add(dotGrid(5, 3.4, 0.3, { size: 1.8 }));
    s.cols = [0, 1, 2].map(i => {
      const b = block(0.5, 1, 0.5, { color: i === 0 ? PAL.cardinal : 0xffffff, kind: i === 0 ? 'gloss' : 'clay' }); b.position.set((i - 1) * 1.2, 0.06, 0); b.scale.y = 0.02; v.add(b);
      const ped = block(0.8, 0.06, 0.8); ped.position.set((i - 1) * 1.2, 0, 0); v.add(ped);
      const top = anchor(b, 0, 1.0, 0);
      const val = v.label('', V((i - 1) * 1.2, 0.3, 0), { cls: 'big' });
      const name = v.label('', V((i - 1) * 1.2, 0.0, 0.62), { cls: 'code' });
      return { b, top, val, name };
    });
    s.H = 1.7;
    // an invisible frame at full height, so the figure is framed for the tallest column any step can show
    const frame = block(3.2, s.H + 0.4, 0.8, { edge: null }); frame.visible = false; frame.userData.fit = true; v.add(frame);
  },
  update(v) { v.s.cols.forEach(c => { c.val.anchor.y = c.b.scale.y + 0.32; }); },
  steps: DATASETS.map(d => ({
    say: d.say, dur: 4.6,
    go(v) {
      v.s.cols.forEach((c, i) => {
        const on = i < d.vals.length;
        v.tw.to(c.b.scale, 'y', on ? Math.max(0.02, d.vals[i] * v.s.H) : 0.001, 0.9);
        v.fade(c.b, on ? 1 : 0);
        c.val.el.textContent = on ? d.fmt(d.vals[i], i) : ''; c.name.el.textContent = on ? d.names[i] : '';
        c.val.opacity = on ? 1 : 0; c.name.opacity = on ? 1 : 0;
        const m = own(c.b); m.color.set(i === 0 ? PAL.cardinal : (d.vals[i] === 0 ? 0xe9e4e1 : 0xffffff));
      });
    },
  })),
});
