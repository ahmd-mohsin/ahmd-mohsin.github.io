// The task synthesis diagram. Data first (bands, steps, edges, defects), then the renderer and the interaction.
// Every visible string lives here so the site copy test reads it. Coordinates are in a 1440-wide viewBox.
(() => {
  "use strict";
  const NS = "http://www.w3.org/2000/svg";
  const W = 1440;
  const GAP = 50;

  const KINDS = {
    data: { name: "Record", c: "#6b6e74", tint: "#f3f3f4" },
    write: { name: "Model writes", c: "#a0661a", tint: "#fbf3e6" },
    exec: { name: "Executed check", c: "#2f7a55", tint: "#eaf4ee" },
    trusted: { name: "Trusted code", c: "#1f1e1c", tint: "#efeeec" },
    agent: { name: "Model agent", c: "#5b4b8a", tint: "#f0edf7" },
    judge: { name: "Model judgement", c: "#8a3f72", tint: "#f7ecf3" },
    measure: { name: "Measurement", c: "#2c5d8f", tint: "#eaf1f8" },
    improve: { name: "Self improvement", c: "#8c1515", tint: "#f8eeee" },
  };

  const BANDS = [
    { id: 1, h: 370, title: "The World", say: "A domain becomes a World that can be reset, called, saved and read as typed state." },
    { id: 2, h: 270, title: "The task", say: "Separate model roles write the instruction, the solution program and the pass rules. Each artifact runs." },
    { id: 3, h: 500, title: "Falsification", say: "A population of falsifiers searches for runs that the pass rules judge wrongly." },
    { id: 4, h: 250, title: "Repair and certificate", say: "Counterexamples drive repair. A clean task receives a certificate with a measured bound." },
    { id: 5, h: 270, title: "Admission and training", say: "Certified tasks that suit the student enter the pool. Training rollouts stay under online watch." },
    { id: 6, h: 290, title: "Measurement", say: "Planted defects with known labels measure the falsifiers and calibrate every certificate." },
    { id: 7, h: 420, title: "Regularised self improvement", say: "Counterexamples become new falsifiers and design rules. Ten rules decide which updates survive." },
  ];
  let H = 0;
  const band = (id) => BANDS[id - 1];
  const G = (id, i) => band(id).y + band(id).h + i * 12.5;   // routing track i in the gap below band id

  // Frames group the falsifier classes. They take part in routing like nodes.
  const FRAMES = [
    { id: "g1", band: 3, x: 365, dy: 50, w: 620, h: 300, title: "Executed falsifiers, no model needed" },
    { id: "g2", band: 3, x: 365, dy: 370, w: 620, h: 115, title: "Model falsifiers" },
  ];

  const S = [
    // band 1
    { n: 1, band: 1, x: 90, dy: 65, w: 266, h: 290, kind: "data", title: "Request",
      line: "A domain, a target skill and a student model. The domain is an existing environment or a short keyword.",
      glyph: { t: "chips", v: ["Domain", "Target skill", "Student model", "Budget"] },
      does: ["The request names the domain, the skill to teach and the student that will train.",
        "A domain is either an existing environment or a keyword such as accounts payable.",
        "The budget caps the spend of every model role."],
      input: "A short request.", output: "The domain, skill, student and budget for every later step.",
      example: "Accounts payable. The skill is invoice exception handling. The student is the open model under training.",
      why: "Every later measure is relative to this skill and this student. A task that suits one student can be too easy for another." },
    { n: 2, band: 1, x: 395, dy: 65, w: 225, h: 110, kind: "data", title: "Existing environment",
      line: "Any App, file tree, message store or simulator enters through the same six operations.",
      does: ["An adapter wraps the environment and exposes the six operations.", "The environment itself needs no change.",
        "An environment without state access still works. Its certificate then states which checks did not apply."],
      input: "An environment and its adapter.", output: "A World with the standard interface.",
      example: "The accounts payable App with invoices, purchase orders and vendors.",
      why: "One interface makes every later step independent of the domain." },
    { n: 3, band: 1, x: 395, dy: 195, w: 225, h: 160, kind: "write", title: "World generation",
      glyph: { t: "list", v: ["Write the tool code", "Blind tests by another family", "Freeze the tests by hash", "Fix code only, never tests", "Run inside a sandbox", "Seed dense sibling rows"] },
      does: ["A model writes the tools of the new App first, with their schemas and effects.",
        "A second model family writes tests without reading the code. A hash freezes the tests.",
        "A debugger may edit the code but never the tests.",
        "Model code runs in a sandbox, after a static check and an allowlist.",
        "A seeder adds many similar rows, so each task has enough siblings for strong mutation checks."],
      input: "A domain keyword.", output: "A runnable World with tools, data and a passing test suite.",
      example: "The keyword helpdesk produced a ticket App with tickets, agents and queues.",
      why: "Dense sibling rows matter. A certificate needs at least 59 distinct mutants, and mutants need siblings to swap in." },
    { n: 4, band: 1, x: 655, dy: 65, w: 260, h: 290, kind: "trusted", title: "World interface",
      line: "Six operations make any World usable by every later step.",
      glyph: { t: "list", v: ["Reset from a seed", "List the tools", "Call a tool", "Save a snapshot", "Restore a snapshot", "Read canonical state"] },
      does: ["Reset is deterministic from the seed.",
        "Each tool states its schema, whether it only reads, and which collections it may write.",
        "Errors return as observations, so a failed call is data and not a crash.",
        "Snapshot and restore are optional. Replay from the seed replaces them."],
      input: "A World.", output: "Runs that can repeat, branch and compare.",
      why: "Every falsifier depends on repeatable runs. A run that cannot repeat cannot serve as evidence." },
    { n: 5, band: 1, x: 950, dy: 65, w: 330, h: 290, kind: "trusted", title: "Canonical state and diff",
      line: "Every value that can earn reward has an address. The difference between two states is exact.",
      glyph: { t: "kv", head: ["Address", "Change"], v: [["invoice INV-42 status", "pending to on hold"], ["invoice INV-42 reason", "empty to price variance"], ["audit log", "one row inserted"], ["updated at", "ignored"]] },
      does: ["An address is the App, the collection, the entity key and the field.",
        "Normalizers drop timestamps, key inserted rows by content, round floats and sort unordered lists.",
        "The diff lists each insert, update and delete, one change per field.",
        "A value outside canonical state is narration. It never earns reward."],
      example: "Holding invoice INV-42 changes two fields and inserts one audit row.",
      why: "Exact diffs turn questions about effects into set operations. No model judges what changed." },
    // band 2
    { n: 6, band: 2, x: 90, dy: 65, w: 266, h: 180, kind: "write", title: "Task proposer",
      line: "A writer role drafts the instruction and the intent card from one cell of the coverage grid.",
      glyph: { t: "quote", v: "Invoice INV-42 does not match its purchase order. Put it on hold with the correct reason." },
      does: ["The proposer receives a cell of the coverage grid, a slice of the World and the current design lemmas.",
        "The intent card names the skill and marks each value as given or derived.",
        "A derived value must not appear in the instruction."],
      input: "A grid cell, a World slice and the lemma bank.", output: "An instruction and an intent card.",
      example: "The invoice id is given. The hold reason must come from a comparison of the invoice with its order.",
      why: "The intent card makes the skill testable. Later checks verify that a derived value really needs derivation." },
    { n: 7, band: 2, x: 398, dy: 65, w: 266, h: 180, kind: "write", title: "Oracle program",
      line: "A writer role solves the task as a straight-line tool program. The program runs at once.",
      glyph: { t: "list", v: ["Read invoice INV-42", "Read its purchase order", "Compare the two amounts", "Hold INV-42 with that reason"] },
      does: ["Each step calls a tool with literals, values read in earlier steps, or pure functions.",
        "Branches resolve at build time, because the program serves one fixed start state.",
        "A program that fails to run ends the task at once.",
        "Value tracking records the source of every literal."],
      input: "The instruction and the intent card.", output: "An executed oracle run.",
      why: "A straight-line program can be mutated and traced by machine. That property powers most of the falsifiers." },
    { n: 8, band: 2, x: 706, dy: 65, w: 266, h: 180, kind: "trusted", title: "Contract inference",
      line: "The oracle run gives the exact change set. Each change becomes a required effect with its exact value.",
      glyph: { t: "chips", v: ["Status is on hold", "Reason is price variance", "One audit row", "Nothing else changes"] },
      does: ["The skeleton requires every observed change with its exact value.", "No other change is allowed.",
        "The oracle passes this skeleton by construction."],
      input: "The oracle run and the state diff.", output: "An exact skeleton contract.",
      why: "The usual order is reversed. No model writes a check that the oracle must happen to pass. Every later relaxation is a visible edit." },
    { n: 9, band: 2, x: 1014, dy: 65, w: 266, h: 180, kind: "write", title: "Contract writer",
      line: "A different model family only relaxes the exact contract. Each relaxation is a testable edit.",
      glyph: { t: "chips", v: ["Required effects", "Allowed effects with a reason", "Answer checks", "Trace rules", "Normalizers"] },
      does: ["Exact values may become tolerances or sets where the instruction allows it.",
        "Each allowed side effect carries a written reason.",
        "A trace rule appears only when the instruction states it, with a quote.",
        "The contract writer is never the family that wrote the oracle."],
      input: "The skeleton contract and the instruction.", output: "A candidate task, ready for falsification.",
      example: "The writer allows audit rows from any write tool, because every write tool logs.",
      why: "Relaxation is where weak checks enter. Each one widens the set of passing end states, so the falsifiers test each one." },
    // band 3
    { n: 10, band: 3, x: 90, dy: 65, w: 240, h: 135, kind: "exec", title: "Replay gate",
      line: "The oracle runs twice from one seed and once from a restored snapshot. Any difference is a defect.",
      does: ["Any difference in verdict or change set is a confirmed nondeterminism defect.",
        "This check runs first. In a noisy World every mutant looks different, and later labels would be wrong."],
      input: "The candidate task.", output: "A deterministic task, or a confirmed defect.",
      why: "Determinism is the precondition for every executed label." },
    { n: 11, band: 3, x: 380, dy: 80, w: 190, h: 125, kind: "exec", title: "Program mutants",
      line: "Edits to the oracle. A mutant that changes the outcome must fail.",
      does: ["Operators drop, repeat, truncate or reorder steps, swap the target entity, perturb values, add writes or change the answer.",
        "A mutant with the same normalised outcome is equivalent and must pass. A failure there shows an over-strict check.",
        "A surviving mutant that drops a write, swaps the target or writes elsewhere is a confirmed defect.",
        "Other survivors are suspects for the panel. Mutants count by distinct effect."],
      example: "Holding INV-43 instead of INV-42 must fail. A pass shows a contract that ignores the instruction.",
      why: "Mutants test the contract against near misses of the true solution. Their number grows with the sibling entities in the World." },
    { n: 12, band: 3, x: 585, dy: 80, w: 190, h: 125, kind: "exec", title: "Degenerate agents",
      line: "Agents that do nothing useful must fail.",
      does: ["The agents do nothing, read everything, answer only, skip the last write, write everything, use shortcut tools or call at random.",
        "A pass by doing nothing or only reading shows a vacuous check.",
        "A pass by writing everything or by a shortcut tool shows an exploitable affordance."],
      why: "These agents cost milliseconds and find free reward before any model receives payment." },
    { n: 13, band: 3, x: 790, dy: 80, w: 190, h: 125, kind: "exec", title: "Start-state check",
      line: "Each required pattern meets the start state alone.",
      does: ["A requirement that already holds at the start gives free reward.",
        "Guards that must stay true, such as an existing test suite, are exempt.",
        "An update that accepts any value is exempt, because it still needs a change."],
      example: "A rule that the invoice is not rejected already holds at the start. That rule is vacuous.",
      why: "Free reward teaches nothing and inflates pass rates." },
    { n: 14, band: 3, x: 380, dy: 220, w: 190, h: 120, kind: "exec", title: "Value tracing",
      line: "Every literal needs a source the agent can read.",
      does: ["The oracle runs again with a taint label on every value.",
        "Valid sources are the instruction, earlier observations, the given values and the tool catalogue.",
        "A value with no source is hidden information. No agent can learn it.",
        "A derived value that appears in the instruction is a leak."],
      example: "An instruction that names the price variance leaks the decision. The task would then test reading, not the skill.",
      why: "Value tracing turns two classic judge questions into executed checks." },
    { n: 15, band: 3, x: 585, dy: 220, w: 190, h: 120, kind: "exec", title: "Twin tasks",
      line: "A given value swaps to a sibling everywhere.",
      does: ["The swap goes through the instruction, the program and the contract.",
        "The original oracle must fail the twin contract, and the twin oracle must pass it.",
        "A violation shows a contract that ignores the instruction.",
        "A twin that cannot run counts as no trial."],
      example: "The twin names INV-57. Holding INV-42 must now fail.",
      why: "Twins show that the contract follows the instruction, not one fixed entity." },
    { n: 16, band: 3, x: 790, dy: 220, w: 190, h: 120, kind: "exec", title: "Perturbation",
      line: "Distractor clones, shuffled rows, renamed text.",
      does: ["The oracle must still pass, and the degenerate agents must still fail.",
        "Clones differ on a field that holds an instruction value, so a correct contract can tell them apart.",
        "Only verdict flips count."],
      why: "A check that breaks under a harmless change is over-strict or noisy." },
    { n: 17, band: 3, x: 90, dy: 225, w: 240, h: 120, kind: "exec", title: "Archive regressions",
      line: "Every counterexample stored for the domain runs again on every new version.",
      does: ["The archive acts as a regression suite for the whole domain.",
        "A repair that lets an archived counterexample pass is refused."],
      why: "Repairs must not reopen old holes. The archive only grows." },
    { n: 18, band: 3, x: 380, dy: 390, w: 292, h: 85, kind: "agent", title: "Independent solvers",
      line: "Families that built nothing in the task solve it from the instruction alone.",
      does: ["A pass is a clean trial and shows a reachable solution.",
        "A failure goes to the panel. A valid solution that fails shows an over-strict check.",
        "A pass with a suspicious trace becomes a suspect shortcut.",
        "Admission needs at least one independent pass."],
      why: "Builders share blind spots with their own tasks. Independent solvers do not." },
    { n: 19, band: 3, x: 688, dy: 390, w: 292, h: 85, kind: "agent", title: "Attackers",
      line: "Agents told to pass without the skill. They never see the contract.",
      does: ["Attackers see the instruction and a library of attack strategies.",
        "A pass is a suspect for the panel.",
        "Confirmed hacks join the archive and serve as negative examples."],
      why: "Attackers search for the shortcuts that a training policy would find later." },
    { n: 20, band: 3, x: 1020, dy: 65, w: 260, h: 135, kind: "trusted", title: "Trusted grader",
      line: "One small module. It diffs, matches patterns and fails closed. It returns reason codes only.",
      does: ["Each change can satisfy at most one required pattern.",
        "Two maximum matchings assign changes to patterns. A greedy scan is provably wrong here.",
        "Any exception, timeout or missing state is a failure.",
        "The policy never sees the contract. Builders never see the grader code."],
      input: "A run and a contract.", output: "A verdict with reason codes.",
      why: "The grader is the only trusted code. Its correctness is a property of one tested module, not of each task." },
    { n: 21, band: 3, x: 1020, dy: 225, w: 260, h: 260, kind: "trusted", title: "Outcome labels",
      glyph: { t: "outcomes", v: [["Confirmed", "Executed proof, no model needed", "#8c1515"], ["Suspect", "Goes to the panel", "#8a3f72"], ["Clean", "A trial without a defect", "#2f7a55"], ["Equivalent", "Same outcome, so it must pass", "#6b6e74"]] },
      does: ["A fixed rule gives each probe one label.",
        "Equivalence uses only stated constraints.",
        "An unstated rule that rejects an equivalent run is an over-strict defect."],
      why: "Labels come from execution wherever possible. The panel sees only the residue." },
    // band 4
    { n: 22, band: 4, x: 90, dy: 65, w: 250, h: 170, kind: "judge", title: "Adjudication panel",
      line: "Two families that built nothing in the task judge each suspect.",
      glyph: { t: "chips", v: ["Calibrated on anchors", "Unsure cases go to a person"] },
      does: ["The panel reads the task, the intent card, the trace and the reason codes.",
        "It never sees the grader code or the falsifier that made the probe.",
        "Anchor tasks with known answers calibrate its confidence threshold.",
        "Judged rates carry intervals that combine judge labels with executed anchors."],
      why: "Model judgement is the weakest evidence. It comes last, it is calibrated, and it is reported apart." },
    { n: 23, band: 4, x: 380, dy: 65, w: 270, h: 170, kind: "data", title: "Counterexample archive",
      line: "Confirmed counterexamples in a hash chain. The archive only grows.",
      glyph: { t: "chips", v: ["From falsifiers", "From the panel", "From training"] },
      does: ["Each record holds the task version, the run, the reason codes and the defect class.",
        "The hash chain makes a silent edit detectable.",
        "Three consumers read it. They are the regression suite, the repair role and the self improvement loop."],
      why: "Counterexamples are the most valuable output of the system. They are evidence, test cases and the signal for the loop." },
    { n: 24, band: 4, x: 690, dy: 65, w: 270, h: 170, kind: "write", title: "Repair",
      line: "A repair role sees only counterexamples and reason codes. It patches the instruction, program, contract or World.",
      glyph: { t: "chips", v: ["At most three rounds", "The archive must still fail"] },
      does: ["The repairer is never the family that wrote the contract.",
        "Every patched version runs through all falsifiers again.",
        "The final version is falsified once more, and its suspects reach the panel.",
        "A fourth round needs new executed information."],
      example: "A contract that let INV-43 pass gains a rule that no other invoice may change.",
      why: "Repair driven by executed counterexamples converges. Repair driven by opinion drifts." },
    { n: 25, band: 4, x: 1000, dy: 65, w: 280, h: 170, kind: "measure", title: "Certificate",
      glyph: { t: "bars", v: [["Mutants", 75, "0.04"], ["Twins", 12, "0.22"], ["Null agents", 7, "0.35"], ["Solvers", 4, "0.53"]] },
      line: "Per falsifier class, the probes, the counterexamples and an exact upper bound.",
      does: ["The bound is the exact binomial 95 percent upper limit on the counterexample rate.",
        "With zero counterexamples the bound is about three divided by the number of probes.",
        "The bound holds under each class's probe distribution, not for every possible agent.",
        "The planted-defect measure states how strong each class is."],
      example: "Seventy-five distinct mutants and no counterexample give a bound of 0.04.",
      why: "A certificate states what was tested and how hard. A yes or no filter states neither." },
    // band 5
    { n: 26, band: 5, x: 90, dy: 65, w: 210, h: 180, kind: "trusted", title: "Admission",
      glyph: { t: "outcomes", v: [["Certified", "Bound at most 0.05", "#2f7a55"], ["Provisional", "Too few probes", "#a0661a"], ["Rejected", "Defect or open suspect", "#8c1515"]] },
      does: ["Certification needs at least 59 distinct mutants, zero confirmed counterexamples and one pass from an independent family.",
        "A provisional task never counts as certified.",
        "The bound is relative to the World. A small World cannot reach 59 mutants."],
      why: "The admission rules are fixed in advance. No task is eased to pass them." },
    { n: 27, band: 5, x: 322, dy: 65, w: 230, h: 180, kind: "write", soon: true, title: "Composition and difficulty",
      line: "Certified tasks combine into longer ones. Knobs move difficulty in a declared direction.",
      glyph: { t: "chips", v: ["Sequence", "Parallel", "Dependency depth", "Distractors", "Hidden pages"] },
      does: ["In a sequence, the second task starts from the end state of the first.",
        "Dependency depth counts value chains that cross a task boundary.",
        "A knob stays only if behaviour changes and student success moves as declared.",
        "Composed tasks pass through the falsifiers again."],
      why: "Long-horizon skill needs tasks where later work depends on earlier results." },
    { n: 28, band: 5, x: 574, dy: 65, w: 290, h: 180, kind: "measure", title: "Perfect-task checks",
      glyph: { t: "outcomes", v: [["Valid", "The certificate admits it", "#2f7a55"], ["Learnable", "Success between 0.1 and 0.6", "#2c5d8f"], ["On intent", "Success needs the skill", "#2c5d8f"], ["Novel", "Behaviour the pool lacks", "#2c5d8f"]] },
      does: ["Valid means the certificate admits the task.",
        "Learnable means the student succeeds between 10 and 60 percent of the time, measured in stages of four and eight runs.",
        "On intent means success breaks when the evidence for the skill disappears.",
        "Novel means the task adds a behaviour signature that the pool lacks."],
      why: "These four properties define a perfect task. Each one is measured, not assumed." },
    { n: 29, band: 5, x: 886, dy: 65, w: 170, h: 180, kind: "data", title: "Task pool",
      line: "Perfect tasks with certificates and difficulty records.",
      glyph: { t: "chips", v: ["Training split", "Sealed benchmark"] },
      does: ["Each task carries its certificate, its intent card and a difficulty record per student.",
        "Benchmark tasks stay sealed. Their traces never shape training tasks."],
      why: "The pool is the product. Its quality is stated per task and per domain." },
    { n: 30, band: 5, x: 1078, dy: 65, w: 202, h: 180, kind: "exec", title: "Training and online watch",
      line: "Every passing rollout is one more trial for its task.",
      glyph: { t: "chips", v: ["Hack rules", "Trajectory monitor", "Quarantine"] },
      does: ["Executed hack rules and a trajectory monitor check every passing rollout.",
        "A flagged pass is a suspect. A confirmed one becomes a counterexample.",
        "A confirmed hack quarantines the task, not the policy.",
        "Student failures go to frontier targeting."],
      why: "Training is the strongest attacker. Its findings feed the archive and the real defect set." },
    // band 6
    { n: 31, band: 6, x: 90, dy: 65, w: 300, h: 210, kind: "measure", title: "Defect planter",
      line: "Plants one known defect into a certified task, with an executed witness.",
      glyph: { t: "chips", v: ["Drop a requirement", "Widen allowed effects", "Loosen a value", "Vacuous rule", "Hide information", "Leak the decision", "Shortcut tool", "Unstated rule", "Ignore the target", "Unsolvable", "Inject noise"] },
      does: ["Each operator edits a contract or a World and plants exactly one defect class.",
        "The witness is a run that passes the planted contract and fails the original, or the class's own evidence.",
        "A plant without a witness is not a defect, and the planter discards it.",
        "In the loop, the planter earns reward for defects that the current falsifiers miss.",
        "Its plants must stay close to the real defect set, and falsifiers must keep recall on all past plants."],
      why: "Planted defects give labels without human annotation. They measure how strong the falsifiers are." },
    { n: 32, band: 6, x: 420, dy: 65, w: 270, h: 210, kind: "data", title: "Three defect sets",
      glyph: { t: "outcomes", v: [["Dev set", "Read by the loop", "#6b6e74"], ["Locked set", "Reports only, sealed", "#8c1515"], ["Real set", "Found by people and in training", "#2c5d8f"]] },
      does: ["The locked set uses held-out operator variants on held-out domains.",
        "No loop ever reads the locked set.",
        "The real set calibrates planted recall. Only defects found independently of the falsifiers count."],
      why: "Defects that the falsifiers found themselves would make recall look perfect by construction." },
    { n: 33, band: 6, x: 720, dy: 65, w: 280, h: 210, kind: "measure", title: "Recall and false alarms",
      line: "Every falsifier runs on every plant. Recall per class, and false alarms on clean anchors.",
      glyph: { t: "heat" },
      does: ["Recall is the share of plants of one class that a falsifier catches with a confirmed counterexample.",
        "False alarms are confirmed counterexamples on certified anchor tasks.",
        "Every rate carries a Wilson interval."],
      why: "An always-pass checker has zero recall. An always-reject checker raises false alarms. Neither extreme can look good." },
    { n: 34, band: 6, x: 1030, dy: 65, w: 250, h: 210, kind: "measure", title: "Residual defect estimate",
      line: "Error seeding and capture and recapture estimate the defects that remain among admitted tasks.",
      glyph: { t: "quote", v: "Remaining defects are about the found defects times one minus recall, divided by recall." },
      does: ["Error seeding divides the found defects by the measured recall.",
        "Two falsifier classes with different mechanisms give an independent capture and recapture estimate.",
        "A class where planted recall and real recall disagree is reported as uncalibrated."],
      why: "This step turns a certificate into an estimate of the defects that remain, per domain and per class." },
    // band 7
    { n: 35, band: 7, x: 90, dy: 65, w: 250, h: 150, kind: "improve", title: "Counterexample clusters",
      line: "Confirmed counterexamples grouped by reason code, operator, change pattern and tools.",
      does: ["Each cluster is one recurring way that tasks fail.", "Clusters come from the archive, never from the locked set."],
      why: "A cluster is a candidate for a general falsifier rule." },
    { n: 36, band: 7, x: 370, dy: 65, w: 260, h: 150, kind: "improve", title: "Abstractor",
      line: "A family that built none of the source tasks turns clusters into candidate updates.",
      glyph: { t: "chips", v: ["Operator", "Attack", "Lemma", "Planter rule", "Prompt edit"] },
      does: ["Each candidate touches one component of the system.",
        "Operators use a small typed language, so they run and can be tested.",
        "The same gate improves the abstractor's own prompts."],
      why: "The loop improves the system that makes tasks, not only the tasks." },
    { n: 37, band: 7, x: 660, dy: 65, w: 380, h: 330, kind: "improve", title: "Acceptance gate",
      line: "Every candidate must pass all ten rules. A gain on one rule cannot buy a loss on another.",
      glyph: { t: "rules", v: ["Fresh evaluation", "Noise floor", "No regression", "Trust region", "Small edits that pay", "Leakage critic", "Gain on another domain", "Caps on judge evidence", "Equal-budget control", "Rollback"],
        obj: "Objective is perfect tasks per dollar, with residual defects at most ε" },
      does: ["Fresh evaluation means each decision uses a newly sampled view. The locked set serves reports only.",
        "The noise floor comes from repeated runs before the loop. The lower bound of the gain must clear it.",
        "No regression means archived counterexamples still fail, false alarms stay low and no class loses recall.",
        "The trust region bounds the shift of the task mix and keeps its entropy, so easy-to-certify tasks cannot take over.",
        "The edit budget anneals from three to one per round, and each operator must pay for itself.",
        "A leakage critic from another family rejects edits that encode tasks, values or planted defects.",
        "The gain must also appear on a domain that produced none of the evidence.",
        "Judge-only evidence stops after two or three rounds without new executed counterexamples.",
        "Each accepted round meets a control round at equal spend.",
        "Every update can roll back to a stored version.",
        "Student reward never enters the objective."],
      example: "A general operator for loose values passed the birth gate but missed the noise floor by 0.003. The gate refused it.",
      why: "A loop that keeps whatever scores best overfits its own evaluation. These rules make an accepted gain real." },
    { n: 38, band: 7, x: 1070, dy: 65, w: 210, h: 330, kind: "improve", title: "System state",
      line: "Five versioned components. Any version can be restored.",
      glyph: { t: "stack", v: ["Falsifiers", "Synthesizer", "Planter", "Frontier", "Abstractor"] },
      does: ["The falsifiers are the typed operators, the attack strategies and the panel prompts.",
        "The synthesizer is the role prompts, the lemma bank, the recipes and the quotas.",
        "The planter is the set of defect operators.",
        "The frontier is the targeting policy and the difficulty ladders.",
        "The abstractor is the procedure that writes candidates."],
      why: "Every improvement is data, so every improvement can be audited and undone." },
    { n: 39, band: 7, x: 370, dy: 245, w: 260, h: 150, kind: "data", title: "Ledger",
      line: "Every accepted and refused update, with its evidence and the rule that decided it.",
      does: ["Each entry holds the candidate, the views it met, each rule result and the decision."],
      why: "Refused updates are negative evidence. They are reported, not hidden." },
    { n: 40, band: 7, x: 90, dy: 245, w: 250, h: 150, kind: "improve", soon: true, title: "Frontier targeting",
      line: "Student failures, located by snapshot replay, become targeted task cells.",
      does: ["Replay from snapshots finds the step where a student trace goes wrong.",
        "Targeted variants stay below a fifth of the pool. Original tasks are never retired.",
        "Each targeted batch meets an untargeted batch at equal spend."],
      why: "The frontier keeps tasks at the edge of the student's ability." },
  ];
  for (const s of S) s.id = "s" + s.n;
  const BOX = Object.fromEntries([...S, ...FRAMES].map((o) => [o.id, o]));

  // Route ops: "id.side@t" anchors, {x} and {y} moves. kind is main, cond, loop or data.
  const edges = () => [
    { a: "s1.r@0.2", b: "s2.l", k: "main" },
    { a: "s1.r@0.7", b: "s3.l", k: "main" },
    { a: "s2.r", b: "s4.l@0.15", k: "main" },
    { a: "s3.r", b: "s4.l@0.75", k: "main" },
    { a: "s4.r", b: "s5.l", k: "main" },
    { a: "s1.b@0.5", b: "s6.t@0.5", k: "main", t: "skill and grid cell" },
    { a: "s5.b@0.5", r: [{ y: G(1, 1) }, { x: "s8.t@0.5" }], b: "s8.t@0.5", k: "data", t: "state before and after" },
    { a: "s6.r", b: "s7.l", k: "main" },
    { a: "s7.r", b: "s8.l", k: "main", t: "run" },
    { a: "s8.r", b: "s9.l", k: "main" },
    { a: "s9.b@0.5", r: [{ y: G(2, 1) }, { x: "s10.t@0.5" }], b: "s10.t@0.5", k: "main", t: "candidate task" },
    { a: "s10.r", b: "g1.l@0.11", k: "main" },
    { a: "s17.r@0.18", b: "g1.l@0.6", k: "main" },
    { a: "g1.r@0.11", b: "s20.l@0.5", k: "main" },
    { a: "g1.b@0.5", b: "g2.t@0.5", k: "cond", t: "nothing confirmed" },
    { a: "g2.r", r: [{ x: 1003 }, { y: "s20.l@0.85" }], b: "s20.l@0.85", k: "cond" },
    { a: "s20.b", b: "s21.t", k: "main" },
    { a: "s21.b@0.12", r: [{ y: G(3, 1) }, { x: "s23.t@0.66" }], b: "s23.t@0.66", k: "main", t: "confirmed" },
    { a: "s21.b@0.32", r: [{ y: G(3, 2) }, { x: "s22.t@0.5" }], b: "s22.t@0.5", k: "cond", t: "suspect" },
    { a: "s21.b@0.78", b: "s25.t@0.79", k: "main", t: "clean" },
    { a: "s23.t@0.15", r: [{ y: G(3, 1) - 6 }, { x: "s17.b@0.5" }], b: "s17.b@0.5", k: "data", t: "regression suite" },
    { a: "s22.r", b: "s23.l", k: "main" },
    { a: "s23.r", b: "s24.l", k: "main", t: "new" },
    { a: "s24.t@0.5", r: [{ y: G(3, 3) }, { x: 1352 }, { y: "s9.r@0.5" }], b: "s9.r@0.5", k: "loop", t: "patched task, next round" },
    { a: "s25.b@0.5", r: [{ y: G(4, 2) }, { x: "s26.t@0.5" }], b: "s26.t@0.5", k: "main", t: "certificate" },
    { a: "s26.r", b: "s27.l", k: "main" },
    { a: "s27.r", b: "s28.l", k: "main" },
    { a: "s28.r", b: "s29.l", k: "main" },
    { a: "s29.r", b: "s30.l", k: "main" },
    { a: "s30.t@0.5", r: [{ y: G(4, 3) }, { x: "s23.b@0.8" }], b: "s23.b@0.8", k: "loop", t: "confirmed hack" },
    { a: "s30.b@0.35", r: [{ y: G(5, 1) }, { x: "s32.t@0.5" }], b: "s32.t@0.5", k: "data", t: "real defects" },
    { a: "s30.b@0.75", r: [{ y: G(5, 2) }, { x: 46 }, { y: "s40.l@0.5" }], b: "s40.l@0.5", k: "loop", t: "student failures", li: 1 },
    { a: "s26.b@0.5", b: "s31.t@0.35", k: "main", t: "certified hosts" },
    { a: "s31.r", b: "s32.l", k: "main" },
    { a: "s32.r", b: "s33.l", k: "main" },
    { a: "s33.r", b: "s34.l", k: "main" },
    { a: "s34.r", r: [{ x: 1330 }, { y: "s25.r@0.5" }], b: "s25.r@0.5", k: "loop", t: "calibrates" },
    { a: "s23.b@0.3", r: [{ y: G(4, 1) }, { x: 30 }, { y: "s35.l@0.5" }], b: "s35.l@0.5", k: "loop", t: "archive", li: 2 },
    { a: "s35.r", b: "s36.l", k: "main" },
    { a: "s36.r", b: "s37.l@0.2", k: "main" },
    { a: "s37.r@0.2", b: "s38.l@0.2", k: "main" },
    { a: "s37.l@0.75", b: "s39.r", k: "data" },
    { a: "s38.r@0.25", r: [{ x: 1376 }, { y: G(2, 2) }, { x: "g1.t@0.75" }], b: "g1.t@0.75", k: "loop", t: "new operators" },
    { a: "s38.r@0.5", r: [{ x: 1400 }, { y: G(1, 2) }, { x: "s6.t@0.8" }], b: "s6.t@0.8", k: "loop", t: "design lemmas" },
    { a: "s38.r@0.75", r: [{ x: 1388 }, { y: G(5, 3) }, { x: "s31.t@0.75" }], b: "s31.t@0.75", k: "loop", t: "planter rules" },
    { a: "s40.b@0.5", r: [{ y: band(7).y + band(7).h - 12 }, { x: 14 }, { y: "s6.l@0.6" }], b: "s6.l@0.6", k: "loop", t: "targeted cells", li: 2 },
  ];

  const DEFECTS = [
    ["Missing requirement", "A required effect is absent from the check.", "The check tests the status but not the hold reason.", "Mutants"],
    ["Open frame", "Effects nobody asked for still pass.", "Holding three other invoices also passes.", "Mutants, attackers"],
    ["Loose value", "A value check accepts too much.", "Any amount within half of the true value passes.", "Mutants, panel"],
    ["Vacuous check", "A check already holds at the start.", "The invoice is not rejected, before any action.", "Start-state check, degenerate agents"],
    ["Hidden information", "Success needs a fact that no agent can read.", "A reason code appears in no document, tool or instruction.", "Value tracing, solvers"],
    ["Over-strict check", "A valid solution fails.", "An unstated tool order, or a stale test that misleads.", "Equivalent mutants, solvers, perturbation"],
    ["Leak", "The instruction gives the decision away.", "The instruction names the hold reason that the agent should infer.", "Value tracing, degenerate agents, attackers"],
    ["Shortcut", "A tool or file sets the result directly.", "An admin tool that writes the status field.", "Degenerate agents, attackers"],
    ["Instruction ignored", "The check accepts an entity other than the named one.", "Holding any invoice passes the request to hold INV-42.", "Twins, mutants"],
    ["Unsolvable", "No tool sequence reaches success.", "The required value is not producible.", "Twins, solvers"],
    ["Nondeterminism", "The verdict depends on run noise.", "A timestamp, a random id or a flaky test.", "Replay gate, perturbation"],
  ];

  // Which falsifier targets which defect (design, not measurement). Rows are falsifiers, columns the eleven defects.
  const HEAT = {
    rows: ["Mutants", "Null agents", "Start state", "Tracing", "Twins", "Perturb", "Replay", "Solvers", "Attackers"],
    on: [[1, 2, 3, 6, 9], [1, 4, 7, 8], [4], [5, 7], [9, 10], [6, 11], [11], [5, 6, 10], [7, 8]],
  };

  // ---------------------------------------------------------------- measurement and text
  const ctx = document.createElement("canvas").getContext("2d");
  const F = {
    title: '600 16px "Lora", Georgia, serif', body: '400 13px "Lora", Georgia, serif', quote: 'italic 400 13px "Lora", Georgia, serif',
    mono: '500 10.5px "JetBrains Mono", Menlo, monospace', monoS: '500 9.5px "JetBrains Mono", Menlo, monospace',
    band: '600 13px "JetBrains Mono", Menlo, monospace', say: 'italic 400 14.5px "Lora", Georgia, serif', edge: 'italic 500 12px "Lora", Georgia, serif',
  };
  const tw = (s, f) => { ctx.font = f; return ctx.measureText(s).width; };
  function wrap(s, f, max) {
    const out = []; let cur = "";
    for (const w of s.split(" ")) {
      const t = cur ? cur + " " + w : w;
      if (tw(t, f) > max && cur) { out.push(cur); cur = w; } else cur = t;
    }
    if (cur) out.push(cur);
    return out;
  }
  function el(tag, attrs, parent) {
    const e = document.createElementNS(NS, tag);
    for (const k in attrs || {}) e.setAttribute(k, attrs[k]);
    if (parent) parent.appendChild(e);
    return e;
  }
  function text(parent, x, y, s, f, fill, extra) {
    const t = el("text", Object.assign({ x, y, fill, style: "font:" + f }, extra || {}), parent);
    t.textContent = s;
    return t;
  }

  // ---------------------------------------------------------------- anchors and routes
  function anchor(spec) {
    if (typeof spec !== "string") return null;
    const m = spec.match(/^(\w+)\.([lrtb])(?:@([\d.]+))?$/);
    const o = BOX[m[1]], side = m[2], f = m[3] === undefined ? 0.5 : +m[3];
    const p = { l: [o.x, o.y + o.h * f], r: [o.x + o.w, o.y + o.h * f], t: [o.x + o.w * f, o.y], b: [o.x + o.w * f, o.y + o.h] }[side];
    return { x: p[0], y: p[1], side };
  }
  const coord = (v, axis) => (typeof v === "number" ? v : anchor(v)[axis]);
  function points(e) {
    const A = anchor(e.a), B = anchor(e.b);
    const pts = [[A.x, A.y]];
    for (const op of e.r || []) {
      const [x, y] = pts[pts.length - 1];
      if ("x" in op) pts.push([coord(op.x, "x"), y]); else pts.push([x, coord(op.y, "y")]);
    }
    let [x, y] = pts[pts.length - 1];
    const o = BOX[e.b.split(".")[0]];
    const near = (d) => !e.r || Math.abs(d) < 30;   // a direct edge runs straight whenever the target's side allows it
    if ((B.side === "t" || B.side === "b") && near(x - B.x) && x > o.x + 8 && x < o.x + o.w - 8) B.x = x;
    if ((B.side === "l" || B.side === "r") && near(y - B.y) && y > o.y + 8 && y < o.y + o.h - 8) B.y = y;
    if (x !== B.x && y !== B.y) {
      if (B.side === "t" || B.side === "b") {
        if (A.side === "b" || A.side === "t") { const my = (y + B.y) / 2; pts.push([x, my], [B.x, my]); } else pts.push([B.x, y]);
      } else if (A.side === "r" || A.side === "l") { const mx = (x + B.x) / 2; pts.push([mx, y], [mx, B.y]); } else pts.push([x, B.y]);
    }
    pts.push([B.x, B.y]);
    return pts.filter((p, i) => i === 0 || p[0] !== pts[i - 1][0] || p[1] !== pts[i - 1][1]);
  }
  function pathD(pts, r) {
    let d = `M${pts[0][0]},${pts[0][1]}`;
    for (let i = 1; i < pts.length - 1; i++) {
      const [x0, y0] = pts[i - 1], [x1, y1] = pts[i], [x2, y2] = pts[i + 1];
      const l1 = Math.hypot(x1 - x0, y1 - y0), l2 = Math.hypot(x2 - x1, y2 - y1), rr = Math.min(r, l1 / 2, l2 / 2);
      const ax = x1 - ((x1 - x0) / l1) * rr, ay = y1 - ((y1 - y0) / l1) * rr, bx = x1 + ((x2 - x1) / l2) * rr, by = y1 + ((y2 - y1) / l2) * rr;
      d += ` L${ax},${ay} Q${x1},${y1} ${bx},${by}`;
    }
    const [lx, ly] = pts[pts.length - 1];
    return d + ` L${lx},${ly}`;
  }

  // ---------------------------------------------------------------- glyphs
  const INK2 = "#3b3a37", RULE = "#e3ddd9", MUTED = "#5d6066";
  function chips(g, x, y, w, items, k) {
    let cx = x, cy = y;
    for (const s of items) {
      const cw = tw(s, F.mono) + 14;
      if (cx + cw > x + w && cx > x) { cx = x; cy += 25; }
      el("rect", { x: cx, y: cy, width: cw, height: 20, fill: KINDS[k].tint, stroke: RULE }, g);
      text(g, cx + 7, cy + 14, s, F.mono, INK2);
      cx += cw + 5;
    }
    return cy + 20;
  }
  function glyph(g, s, x, y, w) {
    const gl = s.glyph, k = s.kind, c = KINDS[k].c;
    if (gl.t === "chips") return chips(g, x, y, w, gl.v, k);
    if (gl.t === "list") {
      gl.v.forEach((v, i) => {
        text(g, x, y + 13 + i * 18, String(i + 1).padStart(2, "0"), F.monoS, c);
        text(g, x + 22, y + 13 + i * 18, v, F.mono, INK2);
      });
      return y + gl.v.length * 18;
    }
    if (gl.t === "kv") {
      const cw = w * 0.5;
      text(g, x, y + 11, gl.head[0].toUpperCase(), F.monoS, MUTED, { "letter-spacing": ".08em" });
      text(g, x + cw, y + 11, gl.head[1].toUpperCase(), F.monoS, MUTED, { "letter-spacing": ".08em" });
      gl.v.forEach((r, i) => {
        const ry = y + 20 + i * 24;
        el("line", { x1: x, x2: x + w, y1: ry, y2: ry, stroke: RULE }, g);
        text(g, x, ry + 16, r[0], F.mono, INK2);
        text(g, x + cw, ry + 16, r[1], F.mono, r[1] === "ignored" ? MUTED : c);
      });
      return y + 20 + gl.v.length * 24;
    }
    if (gl.t === "quote") {
      const lines = wrap(gl.v, F.quote, w - 20);
      el("rect", { x, y, width: w, height: lines.length * 17 + 14, fill: "#f8eeee" }, g);
      el("rect", { x, y, width: 3, height: lines.length * 17 + 14, fill: "#8c1515" }, g);
      lines.forEach((l, i) => text(g, x + 12, y + 19 + i * 17, l, F.quote, "#1f1e1c"));
      return y + lines.length * 17 + 14;
    }
    if (gl.t === "outcomes") {
      gl.v.forEach((r, i) => {
        const ry = y + i * 42;
        el("rect", { x, y: ry, width: w, height: 36, fill: "#fff", stroke: RULE }, g);
        el("rect", { x, y: ry, width: 4, height: 36, fill: r[2] }, g);
        text(g, x + 14, ry + 15, r[0].toUpperCase(), F.monoS, r[2], { "letter-spacing": ".07em", "font-weight": 600 });
        text(g, x + 14, ry + 29, r[1], F.body, INK2);
      });
      return y + gl.v.length * 42 - 6;
    }
    if (gl.t === "bars") {
      text(g, x, y + 10, "EXAMPLE, PROBES AND BOUND", F.monoS, MUTED, { "letter-spacing": ".08em" });
      gl.v.forEach((r, i) => {
        const ry = y + 22 + i * 22, bx = x + 82, bw = w - 82 - 46;
        text(g, x, ry + 11, r[0], F.mono, INK2);
        el("rect", { x: bx, y: ry + 3, width: bw, height: 9, fill: "#eef2f7" }, g);
        el("rect", { x: bx, y: ry + 3, width: bw * Math.min(1, r[1] / 80), height: 9, fill: c, opacity: 0.85 }, g);
        text(g, bx + bw + 6, ry + 11, r[2], F.mono, c);
      });
      return y + 22 + gl.v.length * 22;
    }
    if (gl.t === "heat") {
      const lw = 70, cs = Math.min(15, (w - lw) / 11);
      for (let j = 0; j < 11; j++) text(g, x + lw + j * cs + cs / 2, y + 9, String(j + 1), F.monoS, MUTED, { "text-anchor": "middle" });
      HEAT.rows.forEach((r, i) => {
        const ry = y + 14 + i * (cs + 1);
        text(g, x, ry + cs - 4, r, F.monoS, INK2);
        for (let j = 0; j < 11; j++) {
          const on = HEAT.on[i].includes(j + 1);
          el("rect", { x: x + lw + j * cs, y: ry, width: cs - 2, height: cs - 2, fill: on ? c : "#eef2f7", opacity: on ? 0.9 : 1 }, g);
        }
      });
      const hy = y + 14 + HEAT.rows.length * (cs + 1);
      text(g, x, hy + 12, "Columns are the eleven defects", F.monoS, MUTED);
      return hy + 12;
    }
    if (gl.t === "rules") {
      const cw = (w - 8) / 2;
      gl.v.forEach((r, i) => {
        const cx = x + (i % 2) * (cw + 8), cy = y + Math.floor(i / 2) * 31;
        el("rect", { x: cx, y: cy, width: cw, height: 25, fill: "#fff", stroke: RULE }, g);
        text(g, cx + 8, cy + 16.5, String(i + 1).padStart(2, "0"), F.monoS, c, { "font-weight": 600 });
        text(g, cx + 30, cy + 16.5, r, F.mono, INK2);
      });
      const oy = y + 5 * 31 + 4;
      const ol = wrap(gl.obj, F.body, w - 24);
      el("rect", { x, y: oy, width: w, height: ol.length * 17 + 14, fill: "#8c1515" }, g);
      ol.forEach((l, i) => text(g, x + 12, oy + 19 + i * 17, l, F.body, "#fff"));
      return oy + ol.length * 17 + 14;
    }
    if (gl.t === "stack") {
      gl.v.forEach((r, i) => {
        const ry = y + i * 36;
        el("rect", { x, y: ry, width: w, height: 30, fill: i % 2 ? "#fff" : "#f8eeee", stroke: "#e8cfcf" }, g);
        text(g, x + 10, ry + 19, r, F.mono, "#6c1010");
      });
      return y + gl.v.length * 36 - 6;
    }
    return y;
  }

  // ---------------------------------------------------------------- layout
  // Columns per band. Items in one column stack; the last item of each column stretches to the row height.
  const COLS = {
    1: [["s1"], ["s2", "s3"], ["s4"], ["s5"]], 2: [["s6"], ["s7"], ["s8"], ["s9"]], 3: [["s10", "s17"], "F", ["s20", "s21"]],
    4: [["s22"], ["s23"], ["s24"], ["s25"]], 5: [["s26"], ["s27"], ["s28"], ["s29"], ["s30"]], 6: [["s31"], ["s32"], ["s33"], ["s34"]],
    7: [["s35", "s40"], ["s36", "s39"], ["s37"], ["s38"]],
  };
  function falsifiers(top, need) {
    const [g1, g2] = FRAMES, B = (ids) => Math.max(...ids.map((i) => need[i]));
    const r1 = B(["s11", "s12", "s13"]), r2 = B(["s14", "s15", "s16"]), r3 = B(["s18", "s19"]);
    g1.y = top - 12;
    for (const i of ["s11", "s12", "s13"]) Object.assign(BOX[i], { y: top + 18, h: r1 });
    for (const i of ["s14", "s15", "s16"]) Object.assign(BOX[i], { y: top + 18 + r1 + 15, h: r2 });
    g1.h = top + 18 + r1 + 15 + r2 + 15 - g1.y;
    g2.y = g1.y + g1.h + 24;
    for (const i of ["s18", "s19"]) Object.assign(BOX[i], { y: g2.y + 18, h: r3 });
    g2.h = 18 + r3 + 15;
    return g2.y + g2.h - top;
  }
  function layout() {
    const tmp = document.createElementNS(NS, "g"), need = {};
    for (const s of S) { s.y = 0; s.h = 0; need[s.id] = Math.ceil(card(tmp, s) + 18); }
    let y = 20;
    for (const b of BANDS) {
      b.y = y;
      const top = y + 66, cols = COLS[b.id];
      const nat = cols.map((c) => (c === "F" ? falsifiers(top, need) : c.reduce((a, id, i) => a + need[id] + (i ? 20 : 0), 0)));
      const rowH = Math.max(...nat);
      for (const c of cols) {
        if (c === "F") { FRAMES[1].h = top + rowH - FRAMES[1].y; continue; }
        let yy = top;
        c.forEach((id, i) => { const s = BOX[id]; s.y = yy; s.h = i === c.length - 1 ? top + rowH - yy : need[id]; yy += s.h + 20; });
      }
      b.h = 66 + rowH + 26;
      y += b.h + GAP;
    }
    H = y - GAP + 20;
  }

  // ---------------------------------------------------------------- render
  const overflow = [];
  function card(root, s) {
    const K = KINDS[s.kind];
    const g = el("g", { class: "node", id: "node-" + s.id, tabindex: 0, role: "button", "data-id": s.id, "aria-label": "Step " + s.n + ", " + s.title }, root);
    el("rect", { x: s.x, y: s.y, width: s.w, height: s.h, class: "plate", fill: s.kind === "trusted" && s.n === 20 ? "#1f1e1c" : "#fff", stroke: RULE, filter: "url(#lift)" }, g);
    el("rect", { x: s.x, y: s.y, width: s.w, height: 3, fill: K.c }, g);
    const dark = s.n === 20, ink = dark ? "#fff" : "#1f1e1c", body = dark ? "#e9e6e3" : INK2;
    el("circle", { cx: s.x + 22, cy: s.y + 22, r: 11.5, fill: dark ? "#fff" : "#8c1515" }, g);
    text(g, s.x + 22, s.y + 25.5, String(s.n), '600 10.5px "JetBrains Mono", Menlo, monospace', dark ? "#1f1e1c" : "#fff", { "text-anchor": "middle" });
    const tag = (s.soon ? "Next stage" : K.name).toUpperCase();
    text(g, s.x + s.w - 12, s.y + 25, tag, F.monoS, s.soon ? "#a0661a" : dark ? "#cfcac6" : K.c, { "text-anchor": "end", "letter-spacing": ".08em" });
    let y = s.y + 52;
    const tl = wrap(s.title, F.title, s.w - 28);
    tl.forEach((l, i) => text(g, s.x + 14, y + i * 20, l, F.title, ink));
    y += (tl.length - 1) * 20;
    if (s.line) {
      y += 6;
      for (const l of wrap(s.line, F.body, s.w - 28)) { y += 17.5; text(g, s.x + 14, y, l, F.body, body); }
    }
    if (s.glyph) y = glyph(g, s, s.x + 14, y + (s.line ? 13 : 18), s.w - 28);
    if (s.h && y > s.y + s.h - 8) overflow.push(s.n + ":" + Math.round(y - (s.y + s.h - 8)));
    return y - s.y;
  }
  function frame(root, f) {
    const g = el("g", { class: "frame", id: "node-" + f.id }, root);
    el("rect", { x: f.x, y: f.y, width: f.w, height: f.h, fill: "rgba(47,122,85,.035)", stroke: f.id === "g1" ? "#2f7a55" : "#5b4b8a", "stroke-dasharray": "4 4" }, g);
    const tw0 = tw(f.title.toUpperCase(), F.monoS) + f.title.length * 0.76 + 16;
    el("rect", { x: f.x + 14, y: f.y - 9, width: tw0, height: 18, fill: "#fff" }, g);
    text(g, f.x + 22, f.y + 4, f.title.toUpperCase(), F.monoS, f.id === "g1" ? "#2f7a55" : "#5b4b8a", { "letter-spacing": ".08em" });
  }
  const EC = { main: "#3b3a37", cond: "#8a8d93", loop: "#8c1515", data: "#8a8d93" };
  function edge(root, e, i) {
    const pts = points(e), d = pathD(pts, 9);
    const g = el("g", { class: "edge k-" + e.k, "data-a": e.a.split(".")[0], "data-b": e.b.split(".")[0], id: "edge-" + i }, root);
    el("path", { d, fill: "none", stroke: "#fff", "stroke-width": 7, class: "halo" }, g);
    el("path", { d, fill: "none", stroke: EC[e.k], "stroke-width": e.k === "loop" ? 1.8 : 1.5, "stroke-dasharray": e.k === "cond" ? "5 4" : e.k === "loop" ? "7 5" : "none", "marker-end": `url(#ar-${e.k})`, class: "wire" }, g);
    e.pts = pts;
    return g;
  }
  function edgeLabel(root, e) {
    if (!e.t) return;
    let best = 0, bi = 0;
    for (let i = 1; i < e.pts.length; i++) {
      const L = Math.hypot(e.pts[i][0] - e.pts[i - 1][0], e.pts[i][1] - e.pts[i - 1][1]);
      if (L > best) { best = L; bi = i; }
    }
    if (e.li) bi = e.li;
    const [x0, y0] = e.pts[bi - 1], [x1, y1] = e.pts[bi];
    const cx = (x0 + x1) / 2, cy = (y0 + y1) / 2, w = tw(e.t, F.edge) + 12;
    const g = el("g", { class: "elabel k-" + e.k, "data-a": e.a.split(".")[0], "data-b": e.b.split(".")[0] }, root);
    el("rect", { x: cx - w / 2, y: cy - 9, width: w, height: 18, fill: e.k === "loop" ? "#f8eeee" : "#fff", stroke: e.k === "loop" ? "#ecd3d3" : "#ece7e4" }, g);
    text(g, cx, cy + 4, e.t, F.edge, e.k === "loop" ? "#6c1010" : "#3b3a37", { "text-anchor": "middle" });
  }

  let E = [];
  function render() {
    layout();
    E = edges();
    const host = document.getElementById("diagram");
    const svg = el("svg", { viewBox: `0 0 ${W} ${H}`, width: "100%", role: "img", "aria-labelledby": "dg-title" });
    const title = el("title", { id: "dg-title" }, svg);
    title.textContent = "Task synthesis from a request to a certified task, with measurement and the self improvement loop";
    const defs = el("defs", {}, svg);
    const flt = el("filter", { id: "lift", x: "-10%", y: "-10%", width: "120%", height: "130%" }, defs);
    el("feDropShadow", { dx: 0, dy: 6, stdDeviation: 7, "flood-color": "#8c1515", "flood-opacity": 0.07 }, flt);
    for (const k in EC) {
      const m = el("marker", { id: "ar-" + k, viewBox: "0 0 10 10", refX: 9, refY: 5, markerWidth: 7, markerHeight: 7, orient: "auto-start-reverse" }, defs);
      el("path", { d: "M0,0 L10,5 L0,10 z", fill: EC[k] }, m);
    }
    for (const b of BANDS) {
      const g = el("g", { class: "band" }, svg);
      el("rect", { x: 60, y: b.y, width: 1250, height: b.h, fill: "#fbfaf9", stroke: "#efebe9" }, g);
      el("rect", { x: 60, y: b.y, width: 4, height: b.h, fill: "#8c1515" }, g);
    }
    const lanes = el("g", { class: "lanes" }, svg);
    text(lanes, 1418, 30, "LOOPS", F.monoS, "#8c1515", { "text-anchor": "end", "letter-spacing": ".08em" });
    for (const f of FRAMES) frame(svg, f);
    const eg = el("g", { class: "edges" }, svg);
    E.forEach((e, i) => edge(eg, e, i));
    const hg = el("g", { class: "bandhead" }, svg);
    for (const b of BANDS) {
      const label = String(b.id).padStart(2, "0") + "  " + b.title.toUpperCase();
      const lw = tw(label, F.band) + 24 + tw(b.say, F.say);
      el("rect", { x: 82, y: b.y + 14, width: lw + 16, height: 28, fill: "#fbfaf9" }, hg);
      text(hg, 90, b.y + 33, label, F.band, "#8c1515", { "letter-spacing": ".06em" });
      text(hg, 90 + tw(label, F.band) + 24, b.y + 33, b.say, F.say, "#5d6066");
    }
    const ng = el("g", { class: "nodes" }, svg);
    for (const s of S) card(ng, s);
    const lg = el("g", { class: "elabels" }, svg);
    for (const e of E) edgeLabel(lg, e);
    host.innerHTML = "";
    host.appendChild(svg);
    document.body.dataset.overflow = overflow.join(",");
    return svg;
  }

  // ---------------------------------------------------------------- drawer, tour, text version
  const ORDER = S.map((s) => s.id);
  let cur = -1;
  const $ = (q) => document.querySelector(q);
  function bandOf(s) { return band(s.band); }
  function fill(s) {
    const K = KINDS[s.kind];
    $("#dr-k").textContent = "Step " + s.n + " of " + S.length + " · " + (s.soon ? "Next stage" : K.name);
    $("#dr-k").style.color = s.soon ? "#a0661a" : K.c;
    $("#dr-band").textContent = String(s.band).padStart(2, "0") + "  " + bandOf(s).title;
    $("#dr-h").textContent = s.title;
    $("#dr-short").textContent = s.line || "";
    $("#dr-short").hidden = !s.line;
    const ul = $("#dr-does"); ul.innerHTML = "";
    for (const d of s.does) { const li = document.createElement("li"); li.textContent = d; ul.appendChild(li); }
    for (const [k, v] of [["in", s.input], ["out", s.output], ["ex", s.example], ["why", s.why]]) {
      const box = $("#dr-" + k); box.hidden = !v;
      if (v) box.querySelector("p").textContent = v;
    }
  }
  function neighbours(id) {
    const ids = new Set([id]);
    for (const e of edges()) {
      const a = e.a.split(".")[0], b = e.b.split(".")[0];
      if (a === id) ids.add(b);
      if (b === id) ids.add(a);
    }
    return ids;
  }
  function focus(id, scroll) {
    const svg = $("#diagram svg");
    svg.classList.add("focus");
    svg.classList.remove("loops");
    const nb = neighbours(id);
    for (const s of S) {
      const n = document.getElementById("node-" + s.id);
      n.classList.toggle("sel", s.id === id);
      n.classList.toggle("near", nb.has(s.id) && s.id !== id);
    }
    for (const g of svg.querySelectorAll(".edge, .elabel")) g.classList.toggle("lit", g.dataset.a === id || g.dataset.b === id);
    const s = BOX[id];
    fill(s);
    $("#drawer").hidden = false;
    document.body.classList.add("drawer-open");
    cur = ORDER.indexOf(id);
    $("#tour-count").textContent = "Step " + (cur + 1) + " of " + S.length;
    $("#tour-title").textContent = s.title;
    if (scroll) {
      const n = document.getElementById("node-" + id).getBoundingClientRect();
      const top = window.scrollY + n.top - (window.innerHeight - n.height) / 2 + 30;
      window.scrollTo({ top: Math.max(0, top), behavior: matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth" });
      const wrapEl = $("#diagram");
      if (wrapEl.scrollWidth > wrapEl.clientWidth) wrapEl.scrollLeft = Math.max(0, wrapEl.scrollLeft + n.left - wrapEl.getBoundingClientRect().left - 40);
    }
  }
  function clear() {
    const svg = $("#diagram svg");
    svg.classList.remove("focus");
    for (const n of svg.querySelectorAll(".sel, .near, .lit")) n.classList.remove("sel", "near", "lit");
    $("#drawer").hidden = true;
    document.body.classList.remove("drawer-open");
    cur = -1;
    $("#tour-count").textContent = "Step through";
    $("#tour-title").textContent = "Forty steps, one task";
  }
  function step(d) { const i = cur < 0 ? (d > 0 ? 0 : S.length - 1) : (cur + d + S.length) % S.length; focus(ORDER[i], true); }
  function loops() {
    const svg = $("#diagram svg");
    const on = !svg.classList.contains("loops");
    clear();
    svg.classList.toggle("loops", on);
    $("#b-loops").classList.toggle("on", on);
  }

  function textVersion() {
    const host = $("#steps");
    for (const b of BANDS) {
      const sec = document.createElement("section");
      sec.className = "tv-band";
      const h = document.createElement("h3");
      h.textContent = String(b.id).padStart(2, "0") + "  " + b.title;
      const p = document.createElement("p"); p.className = "tv-say"; p.textContent = b.say;
      const ol = document.createElement("ol");
      for (const s of S.filter((x) => x.band === b.id)) {
        const li = document.createElement("li"); li.value = s.n;
        const t = document.createElement("b"); t.textContent = s.title;
        const k = document.createElement("span"); k.className = "tv-k"; k.textContent = s.soon ? "Next stage" : KINDS[s.kind].name; k.style.color = s.soon ? "#a0661a" : KINDS[s.kind].c;
        li.append(t, k);
        if (s.line) { const q = document.createElement("p"); q.textContent = s.line; li.append(q); }
        const ul = document.createElement("ul");
        for (const d of s.does) { const x = document.createElement("li"); x.textContent = d; ul.append(x); }
        li.append(ul);
        const w = document.createElement("p"); w.className = "tv-why"; w.textContent = s.why; li.append(w);
        ol.append(li);
      }
      sec.append(h, p, ol);
      host.append(sec);
    }
    const dg = $("#defects");
    DEFECTS.forEach((d, i) => {
      const c = document.createElement("div"); c.className = "defect";
      const n = document.createElement("span"); n.className = "dn"; n.textContent = String(i + 1).padStart(2, "0");
      const h = document.createElement("h4"); h.textContent = d[0];
      const p = document.createElement("p"); p.textContent = d[1];
      const ex = document.createElement("p"); ex.className = "dex"; ex.textContent = d[2];
      const by = document.createElement("p"); by.className = "dby"; by.textContent = "Found by " + d[3].toLowerCase();
      c.append(n, h, p, ex, by);
      dg.append(c);
    });
    const lg = $("#legend");
    for (const k in KINDS) {
      const s = document.createElement("span"); s.className = "key";
      const i = document.createElement("i"); i.style.background = KINDS[k].c;
      s.append(i, KINDS[k].name);
      lg.append(s);
    }
    for (const [cls, name] of [["main", "Main flow"], ["cond", "Conditional flow"], ["loop", "Feedback loop"]]) {
      const s = document.createElement("span"); s.className = "key line " + cls;
      const i = document.createElement("i"); s.append(i, name); lg.append(s);
    }
  }

  async function start() {
    try { await Promise.race([document.fonts.ready, new Promise((r) => setTimeout(r, 2500))]); } catch (_) { /* fonts optional */ }
    textVersion();
    const svg = render();
    svg.addEventListener("click", (ev) => {
      const n = ev.target.closest(".node");
      if (n) focus(n.dataset.id, false); else clear();
    });
    svg.addEventListener("keydown", (ev) => {
      const n = ev.target.closest(".node");
      if (n && (ev.key === "Enter" || ev.key === " ")) { ev.preventDefault(); focus(n.dataset.id, false); }
    });
    $("#b-next").addEventListener("click", () => step(1));
    $("#b-prev").addEventListener("click", () => step(-1));
    $("#dr-next").addEventListener("click", () => step(1));
    $("#dr-prev").addEventListener("click", () => step(-1));
    $("#dr-x").addEventListener("click", clear);
    $("#b-loops").addEventListener("click", loops);
    document.addEventListener("keydown", (ev) => {
      if (ev.target.closest && ev.target.closest("input, textarea")) return;
      if (ev.key === "ArrowRight") step(1);
      else if (ev.key === "ArrowLeft") step(-1);
      else if (ev.key === "Escape") clear();
    });
    const q = new URLSearchParams(location.search).get("step");
    if (q && BOX["s" + q]) requestAnimationFrame(() => focus("s" + q, true));
  }
  start();
})();
