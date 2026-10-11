// Wires the page: one Stage, one View per [data-scene] panel, steppers, the studio terminal, copy buttons, nav state.
import { Stage, View, ENV } from './kit.js';
import * as S1 from './scenes1.js';
import * as S2 from './scenes2.js';
import * as S3 from './scenes3.js';

const SCENES = { ...S1, ...S2, ...S3 };

// What each figure shows, so a reader can name every shape.
const KEYS = {
  hero: [['Red dotted vessel', 'Crucible'], ['Black balls', 'records of real work'], ['Red balls', 'environments, tasks and benchmarks that come out']],
  pipeline: [['Stations', 'the steps of the work'], ['Red line', 'the path of one record so far'], ['Red ball', 'the record'], ['Base', 'one shared record format']],
  world: [['Floor', 'the workplace'], ['Models on the floor', 'apps that hold data and tools'], ['White figures', 'simulated people'], ['Red ball and red gate', 'the agent and its one gate'], ['Glass box', 'the sandbox']],
  infra: [['Glass layers', 'worlds, models, data, training'], ['Small glass cubes', 'worlds in sandboxes'], ['Stacks with lights', 'inference engines'], ['Cards', 'records of finished episodes'], ['Red balls from the top', 'new weights']],
  lhbuild: [['Small cards', 'the cases of one shift'], ['Red arc', 'a case that must wait'], ['Red wall', 'a rule change'], ['Black arcs', 'links to earlier cases'], ['Flags and bar', 'milestones and progress']],
  m0: [['Flat tiles', 'record types'], ['Tile with red edges', 'a bad record'], ['Cabinet', 'the record store'], ['Blocks in front', 'domain packs']],
  m1: [['Round platform', 'the workplace'], ['Red ball', 'the agent'], ['White figures', 'simulated people'], ['Red cylinder', 'the one gate for actions']],
  m2: [['Red ball', 'the agent'], ['White figures', 'simulated people'], ['Sheet stacks', 'their real records'], ['Quote', 'a reply built only from records']],
  m3: [['Left side', 'places where work happens'], ['Red wall', 'the secret filter'], ['Black balls', 'events'], ['Glass box', 'the record store']],
  m4: [['Blocks', 'the steps of one piece of work'], ['Green ball', 'approval or passed check'], ['Red ball', 'correction'], ['Amber ball', 'rejection, low trust'], ['Thread', 'link to the step that changed the item']],
  m5: [['Dotted lines', 'recorded attempts'], ['Red line', 'one attempt'], ['Posts with red caps', 'milestones'], ['Glass bands', 'stages'], ['Red ball', 'an agent on the way']],
  m6: [['Columns', 'progress after each step'], ['Pink column', 'a step back'], ['Red ball', 'the agent'], ['Red gate', 'a hard rule']],
  m7: [['Glass box', 'the sandbox of the attempt'], ['Dark cube', 'the result of the attempt'], ['Red sheets', 'fake results'], ['Gems on the table', 'hidden references'], ['Row of dots', 'checks, green pass, red fail']],
  m8: [['Booths', 'AI roles'], ['Red figure', 'the solution builder'], ['Pink walls', 'walls between roles'], ['Red bead', 'the hidden marker'], ['Red ring', 'the quality gate']],
  m9: [['Centre cube', 'the task'], ['Rings', 'groups of checks, low cost first'], ['Green tiles', 'passed checks'], ['Dark cubes', 'planted errors'], ['Round pool', 'accepted tasks']],
  m10: [['Capsules', 'attempts'], ['Glass box', 'the world'], ['White box', 'the checker'], ['Red stack', 'the budget'], ['Glass bin', 'system faults, not counted']],
  m12: [['White cubes', 'worlds'], ['Stacks with lights', 'models that act'], ['Balls', 'data, coloured by model version'], ['Red topped block', 'the trainer']],
  lh: [['Spiral', 'one long task over time'], ['Red part', 'steps done'], ['Red ring', 'the context window'], ['Bar', 'context used'], ['Flags and gems', 'save points and summaries']],
  rlm: [['Red ball', 'the model'], ['Dotted sphere', 'the sandboxed memory'], ['Drawers', 'task, tools, observations, messages, history'], ['White balls', 'helper models'], ['Blocks on the right', 'the world']],
  fsm: [['Four stations', 'planner, editor, reviewer, checker'], ['White cube', 'the task'], ['Amber balls', 'findings'], ['Red block', 'the saved version']],
  m13: [['Columns', 'score of each agent on each task'], ['Taller and redder', 'better'], ['Bar above', 'one shared scale']],
  m11: [['Capsules', 'recorded runs'], ['Arch', 'standard actions'], ['Glass box', 'a new world'], ['Red gem', 'the scorer'], ['Sheets', 'output files']],
  m14: [['Long block', 'the shared base'], ['Cartridges', 'domain packs'], ['Red beam', 'a check level'], ['Three gates', 'order, receipt and invoice']],
  studio: [['Sheets', 'workflow logs'], ['Back belt', 'the label path'], ['Front belt', 'the build path'], ['Balls', 'data that moves']],
  results: [['Columns', 'measured results'], ['Red column', 'the first result in each set']],
};
function addKey(el, id) {
  const k = KEYS[id]; if (!k) return;
  const div = document.createElement('div'); div.className = 'key'; div.setAttribute('aria-label', 'What the figure shows');
  div.innerHTML = k.map(([a, b]) => `<span><b>${a}</b> ${b}</span>`).join('');
  const host = el.closest('.fig') || el.parentElement;
  if (el.dataset.scene === 'hero') el.after(div); else host.appendChild(div);
}
const $ = (q, el = document) => el.querySelector(q);
const $$ = (q, el = document) => [...el.querySelectorAll(q)];

// ------------------------------------------------------------------------------------------------- studio terminal
// Real output of the CLI on the accounts payable and coding packs (CPU only, no model calls).
const SESSION = [
  [['$', 'crucible pack check finance_ap --level semantic'],
    ['o', '  pass  static.hooks       tasks, generator, stages, policies, fixtures'], ['o', '  pass  fixture.cases      9 case(s) graded exactly as expected'],
    ['g', '  pass  semantic.gold      2 task(s): gold reaches 1.0'], ['g', '  pass  semantic.noop      2 task(s): no-op stays below 1.0']],
  [['$', 'crucible label --pack coding --out label'], ['k', 'labelled 66 traces -> label']],
  [['o', "  outcomes {'good': 49, 'bad': 13, 'unknown': 4}  signals 28  credited 11"]],
  [['o', '  sft 3  dpo 0 (best_vs_worst 0, correction_pivot 0)  kto 62']],
  [['$', 'crucible export --to canonical --pack finance_ap --out export'], ['o', '  "finance_ap/invoices/s1-n7@1": {']],
  [['g', '    "reward": 1.0,'], ['o', '    "steps": 44,']],
  [['o', '  "finance_ap/invoices/s2-n7@1": {'], ['g', '    "reward": 1.0,'], ['o', '    "steps": 44,']],
  [['$', 'crucible bench run finance_ap --out runs'], ['o', 'scripted:approve_all: mean 0.0 pass@1 0.0'], ['o', 'scripted:noop: mean 0.0 pass@1 0.0'], ['g', 'scripted:oracle: mean 1.0 pass@1 1.0'], ['c', 'report runs/bench-finance_ap-bench/bench/report.html']],
];
const esc = s => s.replace(/[&<>]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;' }[c]));
const term = $('#term-out');
let typing = null;
function renderTerm(step) {
  if (!term) return;
  clearInterval(typing);
  const lines = SESSION.slice(0, step + 1).flat();
  const fresh = SESSION[step];
  const old = lines.slice(0, lines.length - fresh.length);
  const fmt = ([k, t]) => k === '$' ? `<span class="p">$ </span><span class="k">${esc(t)}</span>` : `<span class="${k === 'c' ? 'o' : k}">${esc(t)}</span>`;
  const head = old.map(fmt).join('\n');
  // keep the window to the most recent lines, like a real terminal
  const tail = () => { const n = term.innerHTML.split('\n'); if (n.length > 13) term.innerHTML = n.slice(-13).join('\n'); };
  if (ENV.REDUCED) { term.innerHTML = lines.map(fmt).join('\n'); tail(); return; }
  let i = 0, ch = 0; const out = [];
  term.innerHTML = head; tail();
  typing = setInterval(() => {
    const ln = fresh[i]; if (!ln) { clearInterval(typing); return; }
    if (ln[0] === '$') {
      ch = Math.min(ln[1].length, ch + 2);
      const partial = `<span class="p">$ </span><span class="k">${esc(ln[1].slice(0, ch))}</span><span class="cur"></span>`;
      term.innerHTML = [head, ...out, partial].filter(Boolean).join('\n'); tail();
      if (ch >= ln[1].length) { out.push(fmt(ln)); i++; ch = 0; }
    } else { out.push(fmt(ln)); i++; term.innerHTML = [head, ...out].filter(Boolean).join('\n'); tail(); }
  }, 28);
}
window.__studioTerm = renderTerm;
// complete at rest: the whole session is on screen before the studio figure starts replaying it
if (term) { const prev = ENV.REDUCED; ENV.REDUCED = true; renderTerm(SESSION.length - 1); ENV.REDUCED = prev; }

// ------------------------------------------------------------------------------------------------------------ stage
const stage = new Stage({ clipEl: $('header.top') });
if (!stage.failed) {
  for (const el of $$('.view[data-scene]')) {
    const make = SCENES[el.dataset.scene];
    if (!make) continue;
    const v = stage.add(new View(el, make()));
    addKey(el, el.dataset.scene);
    const st = el.dataset.scene === 'studio' ? $('#studio-stepper') : el.closest('.fig')?.querySelector('.stepper');
    if (st && v.spec.steps?.length) v.bindStepper(st); else st?.remove();
  }
  window.crucible = { stage, views: Object.fromEntries(stage.views.map(v => [v.el.dataset.scene, v])) };
} else {
  $$('.stepper').forEach(s => s.remove());
  renderTerm(SESSION.length - 1);
}

// ---------------------------------------------------------------------------------------------------- copy buttons
// when the clipboard is refused, select the commands so the reader can copy them by hand
function selectText(el) { const r = document.createRange(); r.selectNodeContents(el); const sel = getSelection(); sel.removeAllRanges(); sel.addRange(r); }
for (const btn of $$('.copy')) {
  btn.addEventListener('click', () => {
    const pre = btn.parentElement.querySelector('pre');
    const text = pre.innerText.split('\n').filter(l => l.trim() && !l.trim().startsWith('#')).map(l => l.replace(/^\$\s?/, '')).join('\n');
    const done = label => { btn.textContent = label; setTimeout(() => (btn.textContent = 'Copy'), 1600); };
    if (!navigator.clipboard?.writeText) { selectText(pre); done('Selected'); return; }
    navigator.clipboard.writeText(text).then(() => done('Copied'), () => { selectText(pre); done('Selected'); });
  });
}

// ------------------------------------------------------------------------------------------------------- nav state
const navLinks = $$('header .nav a[href^="#"]');
const modLinks = $$('.mod-index a[href^="#"]');
const watch = (links, rootMargin) => {
  const map = new Map(links.map(a => [a.getAttribute('href').slice(1), a]));
  const targets = [...map.keys()].map(id => document.getElementById(id)).filter(Boolean);
  const io = new IntersectionObserver(entries => {
    for (const e of entries) if (e.isIntersecting) { links.forEach(a => a.classList.remove('on')); map.get(e.target.id)?.classList.add('on'); }
  }, { rootMargin });
  targets.forEach(t => io.observe(t));
};
watch(navLinks, '-45% 0px -50% 0px');
watch(modLinks, '-35% 0px -60% 0px');
