"use client";

import { ReactNode } from "react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  LabelList,
  ReferenceLine,
  Cell,
} from "recharts";
import { Fig, R } from "@/components/papers/charts";

/*
 * Figures for the PLVR write-up (arXiv 2610.19148v3).
 * Every number is from the paper. No figure uses made-up values.
 */

const tooltipStyle = {
  background: "#ffffff",
  border: "1px solid #d9d9d9",
  borderRadius: 0,
  color: "#1a1a1a",
  fontFamily: "monospace",
  fontSize: 12,
};
const legendStyle = { fontSize: 11, color: R.ink, fontFamily: "monospace" };
const tick = { fill: R.axis, fontSize: 11 };
// Legend text in ink, whatever the series colour, so pale series stay readable.
const legendText = (value: string) => <span style={{ color: R.ink }}>{value}</span>;
// Bar labels always carry one decimal, as in the paper's tables.
const f1 = (v: number) => (v == null ? "" : v.toFixed(1));

// One colour per arm, PLVR always cardinal.
const ARM = {
  vanilla: "#d4d4d4",
  sft: "#9a9a9a",
  gepa: "#5f5f5f",
  react: "#E7C6CB",
  sj: "#C98A93",
  plvr: R.red,
};

// One colour per student.
const STUDENT = {
  lightning: R.red,
  nano: R.red2,
  super: R.redSoft,
  granite: R.ink,
};

function Title({ children }: { children: ReactNode }) {
  return <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#8C1515] mb-3">{children}</p>;
}

function Mono({ children }: { children: ReactNode }) {
  return <span className="font-mono text-[12px]">{children}</span>;
}

/* ------------------------------------------------------------------ */
/* M1. The test, with the real Nemotron numbers (Table 2)            */
/* ------------------------------------------------------------------ */

// τ² Telecom, where the gap closes.
const testProcedure = [
  { stage: "alone", a: 47.4, b: 36.8, c: 51.8 },
  { stage: "under the program", a: 94.4, b: 93.3, c: 93.3 },
];
// LiveMCPBench, where the gap stays.
const testCapability = [
  { stage: "alone", a: 42.1, b: 45.3, c: 33.7 },
  { stage: "under the program", a: 50.5, b: 45.3, c: 54.7 },
];

const testModels = [
  { key: "a", label: "Nemotron 3.5 Lightning", color: STUDENT.lightning },
  { key: "b", label: "Nemotron 3 Nano", color: STUDENT.nano },
  { key: "c", label: "Nemotron 3 Super", color: STUDENT.super },
];

// Best minus worst model at each stage, shown under the panel title.
function gapAt(row: Record<string, number | string>) {
  const v = testModels.map((m) => row[m.key] as number);
  return (Math.max(...v) - Math.min(...v)).toFixed(1);
}

function TwoBars({ data, title }: { data: Record<string, number | string>[]; title: string }) {
  return (
    <div>
      <Title>{title}</Title>
      <p className="font-mono text-[11px] text-neutral-600 -mt-1 mb-2">
        gap between models: {gapAt(data[0])} → <span className="text-[#8C1515] font-semibold">{gapAt(data[1])}</span> points
      </p>
      <ResponsiveContainer width="100%" height={230}>
        <BarChart data={data} margin={{ top: 18, right: 8, bottom: 4, left: 0 }} barGap={2}>
          <CartesianGrid stroke={R.grid} vertical={false} />
          <XAxis dataKey="stage" stroke={R.axis} tick={tick} />
          <YAxis domain={[0, 100]} stroke={R.axis} tick={tick} width={34} />
          {testModels.map((m) => (
            <Bar key={m.key} dataKey={m.key} name={m.label} fill={m.color} isAnimationActive={false}>
              <LabelList dataKey={m.key} position="top" formatter={f1} style={{ fontSize: 10, fill: R.axis, fontFamily: "monospace" }} />
            </Bar>
          ))}
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export function FigTheTest() {
  return (
    <Fig
      caption={
        <>
          The test with the real results (Table 2). We put the same program in front of three Nemotron models.
          The models climb to the same height on τ² Telecom, and the gap between them goes from 15.0 to 1.1 points
          (left). That gap is procedure. The program helps on LiveMCPBench, but the gap goes from 11.6 to 9.4
          points (right). That gap is capability.
        </>
      }
    >
      <div className="flex flex-wrap gap-x-4 gap-y-1 mb-4 font-mono text-[11px] text-neutral-700">
        {testModels.map((m) => (
          <span key={m.key} className="flex items-center gap-1.5">
            <span className="inline-block w-3 h-3" style={{ background: m.color }} />
            {m.label}
          </span>
        ))}
      </div>
      <div className="grid md:grid-cols-2 gap-6">
        <TwoBars data={testProcedure} title="τ² Telecom · the gap closes" />
        <TwoBars data={testCapability} title="LiveMCPBench · the gap stays" />
      </div>
    </Fig>
  );
}

/* ------------------------------------------------------------------ */
/* M2. A trace cut into typed segments (Figure 1A, verbatim)          */
/* ------------------------------------------------------------------ */

const SEG = {
  reason: { bg: "bg-[#eef0fb]", border: "border-[#b9bfe8]", label: "reason" },
  call: { bg: "bg-[#fdf1e4]", border: "border-[#f0c99c]", label: "call" },
  message: { bg: "bg-[#eaf6ec]", border: "border-[#a9d8b2]", label: "message" },
  question: { bg: "bg-[#fbecef]", border: "border-[#eab3bf]", label: "question" },
};

function Segment({ kind, children }: { kind: keyof typeof SEG; children: ReactNode }) {
  const s = SEG[kind];
  return (
    <div className={`border ${s.border} ${s.bg} px-3 py-2 text-[13px] leading-snug text-neutral-800`}>
      <span className="font-mono text-[10px] uppercase tracking-[0.15em] text-neutral-500 mr-2">{s.label}</span>
      {children}
    </div>
  );
}

const segmentsByKind = [
  { kind: "reason", segments: 876, clusters: 15 },
  { kind: "call", segments: 1064, clusters: 8 },
  { kind: "message", segments: 1159, clusters: 9 },
  { kind: "question", segments: 42, clusters: 3 },
];

export function FigTraceToSegments() {
  return (
    <Fig
      caption={
        <>
          Step 1. We cut each teacher trace into pieces, one piece for each thing the agent emits, and we give
          each piece a type. The left side shows one retail turn from Figure 1 of the paper. The 539 kept traces
          give 3,141 pieces. We embed the pieces, cluster each type with k-means, and get 35 clusters. No language
          model takes part in this step.
        </>
      }
    >
      <div className="grid md:grid-cols-[1fr_1fr] gap-6 items-start">
        <div>
          <Title>One teacher turn, four pieces</Title>
          <div className="space-y-2">
            <Segment kind="reason">
              &ldquo;order #W12 is <em>delivered</em>; exchange is allowed&rdquo;
            </Segment>
            <Segment kind="call">
              <Mono>exchange_items(&#123;order: #W12, old: [i1], new: [i2], payment: gc_7&#125;)</Mono>
            </Segment>
            <Segment kind="message">
              &ldquo;Done. The difference of $12.50 was charged to your gift card.&rdquo;
            </Segment>
            <Segment kind="question">&ldquo;Which payment method would you like to use?&rdquo;</Segment>
          </div>
        </div>
        <div>
          <Title>3,141 pieces → 35 clusters</Title>
          <ResponsiveContainer width="100%" height={210}>
            <BarChart data={segmentsByKind} layout="vertical" margin={{ top: 0, right: 96, bottom: 0, left: 10 }}>
              <CartesianGrid stroke={R.grid} horizontal={false} />
              <XAxis type="number" stroke={R.axis} tick={tick} />
              <YAxis type="category" dataKey="kind" stroke={R.axis} tick={tick} width={64} />
              <Tooltip contentStyle={tooltipStyle} cursor={{ fill: "rgba(140,21,21,0.06)" }} />
              <Bar dataKey="segments" name="pieces" isAnimationActive={false}>
                {segmentsByKind.map((d) => (
                  <Cell key={d.kind} fill={d.kind === "reason" ? "#b9bfe8" : d.kind === "call" ? "#f0c99c" : d.kind === "message" ? "#a9d8b2" : "#eab3bf"} />
                ))}
                <LabelList
                  dataKey="clusters"
                  content={(p: { x?: number | string; y?: number | string; width?: number | string; height?: number | string; value?: number | string }) => (
                    <text
                      x={Number(p.x) + Number(p.width) + 6}
                      y={Number(p.y) + Number(p.height) / 2}
                      dominantBaseline="middle"
                      style={{ fontSize: 11, fill: R.axis, fontFamily: "monospace" }}
                    >
                      {`${p.value} clusters`}
                    </text>
                  )}
                />
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </Fig>
  );
}

/* ------------------------------------------------------------------ */
/* M3. The 37 primitives, by job (Tables 12-17, names verbatim)       */
/* ------------------------------------------------------------------ */

const primitiveGroups: { group: string; items: string[] }[] = [
  {
    group: "Understand the message",
    items: ["Split into requests", "Classify one request", "Order requests", "Route a reply", "Device reply", "Check a claim", "Parts"],
  },
  {
    group: "Find the tools",
    items: ["Servers for the task", "Search phrases", "Widen tools", "Pick the function", "Plan steps"],
  },
  {
    group: "Build the call",
    items: [
      "Fill the parameters",
      "Where a value comes from",
      "How to get a missing parameter",
      "Question for a missing parameter",
      "Device action arguments",
      "Requests covered by the same call",
      "Price terms",
      "Which arguments failed",
    ],
  },
  {
    group: "Check the policy",
    items: [
      "Functions a policy section governs",
      "Is the rule a condition",
      "Is the rule about this action",
      "Is the condition met",
      "User's own premise or condition",
      "Alternatives when blocked",
      "Reply to a confirmation",
    ],
  },
  {
    group: "Troubleshoot",
    items: [
      "Copy the rule's condition",
      "Does one reading show the condition",
      "Does the condition hold now",
      "Is the condition true by the quote alone",
      "Is the setting already as wanted",
      "Is the problem fixed",
    ],
  },
  {
    group: "Finish",
    items: ["Is the request achieved", "Audit", "Can the question be answered", "Write the reply"],
  },
];

export function FigPrimitiveLibrary() {
  return (
    <Fig
      caption={
        <>
          Step 2. Claude 5 Opus reads the clusters and writes each operation as a primitive. There are 37
          primitives in six groups. The names come from the appendix of the paper. Each primitive is a small
          question that you can give to a junior colleague.
        </>
      }
    >
      <Title>37 primitives, six jobs</Title>
      <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
        {primitiveGroups.map((g) => (
          <div key={g.group} className="border border-black/10 p-3">
            <div className="flex items-baseline justify-between mb-2">
              <span className="text-[13px] font-semibold text-[#8C1515]">{g.group}</span>
              <span className="font-mono text-[11px] text-neutral-500">{g.items.length}</span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {g.items.map((it) => (
                <span key={it} className="text-[11px] leading-tight border border-black/10 bg-neutral-50 px-1.5 py-0.5 text-neutral-700">
                  {it}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </Fig>
  );
}

/* ------------------------------------------------------------------ */
/* M4. Anatomy of one primitive (Figure 1B spec, verbatim)            */
/* ------------------------------------------------------------------ */

function Box({ label, children, tone = "plain" }: { label: string; children: ReactNode; tone?: "plain" | "red" | "ok" | "bad" }) {
  const toneCls =
    tone === "red"
      ? "border-[#8C1515] bg-[#8C1515] text-white"
      : tone === "ok"
      ? "border-[#a9d8b2] bg-[#eaf6ec]"
      : tone === "bad"
      ? "border-[#eab3bf] bg-[#fbecef]"
      : "border-black/15 bg-white";
  return (
    <div className={`border ${toneCls} px-3 py-2`}>
      <div className={`font-mono text-[10px] uppercase tracking-[0.15em] mb-1 ${tone === "red" ? "text-white/80" : "text-neutral-500"}`}>{label}</div>
      <div className="text-[12.5px] leading-snug">{children}</div>
    </div>
  );
}

function Arrow({ label }: { label?: string }) {
  return (
    <div className="flex items-center justify-center text-neutral-400 text-[11px] font-mono py-1">
      ↓{label && <span className="ml-2">{label}</span>}
    </div>
  );
}

export function FigPrimitiveAnatomy() {
  return (
    <Fig
      caption={
        <>
          One primitive. The spec on the left is the &ldquo;Pick the function&rdquo; primitive from Figure 1 of
          the paper. The flow on the right is what every primitive does (Section 3.2). The program never uses the
          raw answer of the small model. The answer passes a deterministic check, or the primitive returns its
          fallback.
        </>
      }
    >
      <div className="grid md:grid-cols-[1fr_1.1fr] gap-6 items-start">
        <div className="border border-black/15 p-4 font-mono text-[12px] leading-relaxed bg-neutral-50">
          <div className="text-[#8C1515] font-semibold mb-2">primitive: Pick the function</div>
          <div><span className="text-neutral-500">in:</span> REQUEST, FUNCTIONS, RECORD_STATUS?</div>
          <div><span className="text-neutral-500">out:</span> &#123;&quot;func&quot;: &lt;name&gt;|&quot;none&quot;, &quot;alternates&quot;: []&#125;</div>
          <div><span className="text-neutral-500">prompt:</span> &ldquo;Pick the function whose effect is what the request asks for …&rdquo;</div>
          <div><span className="text-neutral-500">verifier:</span> func ∈ FUNCTIONS</div>
          <div><span className="text-neutral-500">fallback:</span> &quot;none&quot;</div>
          <div className="mt-2 text-neutral-500 italic">one call to frozen Granite-4.2-8B</div>
        </div>
        <div>
          <Box label="inputs">REQUEST + the list of FUNCTIONS the agent actually has</Box>
          <Arrow />
          <Box label="one call" tone="red">Granite-4.2-8B, frozen, under this primitive&apos;s own prompt</Box>
          <Arrow label="JSON out" />
          <Box label="verifier">func ∈ FUNCTIONS</Box>
          <Arrow />
          <div className="grid grid-cols-2 gap-3">
            <Box label="check passes" tone="ok">the program uses the answer</Box>
            <Box label="check fails" tone="bad">the primitive returns the fallback &quot;none&quot;</Box>
          </div>
        </div>
      </div>
    </Fig>
  );
}

/* ------------------------------------------------------------------ */
/* M5. Two ways to run the program (§1 and Appendix B.2 headings)     */
/* ------------------------------------------------------------------ */

const guardChecks = [
  ["validity", "the action must exist and its arguments must be well-formed"],
  ["grounding", "every value in a state change comes from an observed record or the user"],
  ["permission", "user identified, owns the target, rules allow it"],
  ["consent", "a state change goes out only after the user agrees to its exact values"],
  ["ordering", "agreed change first, irreversible last"],
  ["restraint", "a change already made is not repeated"],
];

export function FigTwoModes() {
  return (
    <Fig
      caption={
        <>
          One program with two jobs. The planner mode is for troubleshooting and tool search. The program writes
          the chain of thought and the student acts on it. The guard mode is for retail. The student proposes each
          action and the program checks the action before it goes out. The six check groups are the section
          headings of the final retail block (Appendix B.2). The weights of the student never change.
        </>
      }
    >
      <div className="grid md:grid-cols-2 gap-8">
        <div>
          <Title>Planner · telecom, tool search</Title>
          <Box label="task">the user&apos;s message and the tools</Box>
          <Arrow />
          <Box label="program" tone="red">runs its primitives on Granite-4.2-8B and writes the plan</Box>
          <Arrow label="replaces the student's own reasoning" />
          <Box label="student">reads the plan, makes the tool calls</Box>
        </div>
        <div>
          <Title>Guard · retail</Title>
          <Box label="student">proposes the next action (a lookup, a message, or a change)</Box>
          <Arrow />
          <div className="border border-[#8C1515] p-3">
            <div className="font-mono text-[10px] uppercase tracking-[0.15em] text-[#8C1515] mb-2">program checks</div>
            <div className="space-y-1">
              {guardChecks.map(([k, v]) => (
                <div key={k} className="text-[12px] leading-snug">
                  <span className="font-mono text-[#8C1515] mr-2">{k}</span>
                  <span className="text-neutral-700">{v}</span>
                </div>
              ))}
            </div>
          </div>
          <Arrow />
          <div className="grid grid-cols-3 gap-2">
            <Box label="pass" tone="ok">goes out unchanged</Box>
            <Box label="repair">fixed from the records</Box>
            <Box label="send back" tone="bad">student proposes again</Box>
          </div>
        </div>
      </div>
    </Fig>
  );
}

/* ------------------------------------------------------------------ */
/* M6. Process distance, the scoring rule of Section 3.3              */
/* ------------------------------------------------------------------ */

const expert = ["get_line", "set_apn", "restart_device"];

const penalties: [string, string][] = [
  ["an expert action is missing or has wrong arguments", "1.0"],
  ["an action is out of order", "0.5"],
  ["the program takes an extra state-changing action", "0.5"],
  ["the conversation ends abnormally", "1.0"],
];

export function FigProcessDistance() {
  return (
    <Fig
      caption={
        <>
          How the search scores a program (Section 3.3). The reference is the state-changing actions of the
          teacher. The example is the telecom reference from Figure 1C of the paper. Each mismatch has a cost. We
          divide the sum by the number of expert actions and add the end-state checks of the task. The search
          minimises f = |P| + 100·d, so the shorter of two programs with the same distance wins. No model judges
          anything.
        </>
      }
    >
      <Title>Reference · what the teacher did (Figure 1C)</Title>
      <div className="flex flex-wrap items-center gap-2 mb-5">
        {expert.map((name, i) => (
          <span key={name} className="flex items-center gap-2">
            <span className="font-mono text-[11.5px] border border-[#8C1515] bg-[#8C1515] text-white px-2 py-0.5">{name}</span>
            {i < expert.length - 1 && <span className="text-neutral-400">→</span>}
          </span>
        ))}
      </div>
      <Title>Cost of each mismatch</Title>
      <table className="w-full text-[12.5px] border-collapse">
        <tbody>
          {penalties.map(([what, cost]) => (
            <tr key={what} className="border-t border-black/10">
              <td className="py-2 pr-3 text-neutral-700">{what}</td>
              <td className="py-2 font-mono text-right text-[#8C1515]">{cost}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </Fig>
  );
}

/* ------------------------------------------------------------------ */
/* M7. Seed vs final telecom program (Appendix B.1, verbatim)         */
/* ------------------------------------------------------------------ */

// [indent, text, added?]
const telecomFinal: [number, string, boolean][] = [
  [0, "split the message into requests", false],
  [0, "for each request that reports a problem:", false],
  [1, "identify first: looks up the user before anything else", true],
  [1, "find the right record: reads all records to match the user's identifier", true],
  [1, "go through the rules' diagnostic steps in their written order", false],
  [1, "one step at a time: executes a procedure written as a list of steps one step at a time", true],
  [1, "for each rule of the form \"if <condition>, apply <fix>\":", false],
  [2, "check the problem early: confirms the reported problem before attempting fixes", true],
  [2, "customer acts on their device: never calls user-side tools directly", true],
  [2, "read the current state", false],
  [2, "read before changing a record: never changes settings without reading them first", true],
  [2, "skip a fix whose effect is already in place", false],
  [2, "argument names the target: an identifying argument names the target, not the change to make", true],
  [2, "refusal cites the rule: a refusal cites a value the rule's text mentions", true],
  [1, "before a state-changing action:", true],
  [2, "quantities from records: every quantity is user-stated or computed from records", true],
  [2, "target in the named state: when the request names a state, the target chosen is in that state", true],
  [2, "verify payment: confirms the bill shows as paid before proceeding", true],
  [1, "after a state-changing action, request the follow-up step at once:", true],
  [2, "restart after a settings reset, restart after resuming, toggle on the device after the account", true],
  [1, "escalate after a failed attempt: escalates only after the action was attempted and refused or failed", true],
  [1, "dates computed in code: computes time conditions in code against the date the rules give", true],
  [1, "ended contract to a human: transfers without trying to resume service", true],
  [1, "re-run the rules' success check; stop when it passes", false],
  [0, "remove duplicate actions", false],
];

export function FigSeedToFinal() {
  const added = telecomFinal.filter((l) => l[2]).length;
  return (
    <Fig
      caption={
        <>
          Step 3. The program you can read. This is the telecom block after the search, as an English summary of
          the executable code (Appendix B.1). Grey lines come from the seed that we wrote by hand. The {added} red
          lines are rules that the search added from the library it mined out of the teacher traces. This block
          takes Nemotron 3.5 Lightning from 68.4% to 94.4% on Telecom.
        </>
      }
    >
      <Title>Telecom block · seed (grey) + what the search added (red)</Title>
      <div className="font-mono text-[11.5px] leading-[1.6] bg-neutral-50 border border-black/10 p-3 overflow-x-auto">
        {telecomFinal.map(([indent, text, add], i) => (
          <div key={i} className={add ? "text-[#8C1515]" : "text-neutral-500"} style={{ paddingLeft: `${indent * 1.4}em` }}>
            <span className="inline-block w-4 -ml-4">{add ? "+" : ""}</span>
            {text}
          </div>
        ))}
      </div>
    </Fig>
  );
}

/* ------------------------------------------------------------------ */
/* R1. Every arm, every student, per suite (Table 2)                  */
/* ------------------------------------------------------------------ */

type ArmRow = { student: string; vanilla: number; sft: number; gepa: number; react: number; sj: number | null; plvr: number };

const table2: Record<"retail" | "telecom" | "live", ArmRow[]> = {
  retail: [
    { student: "Lightning", vanilla: 75.4, sft: 72.8, gepa: 79.8, react: 71.9, sj: 82.5, plvr: 82.5 },
    { student: "Nano", vanilla: 64.0, sft: 76.3, gepa: 71.9, react: 64.0, sj: null, plvr: 83.3 },
    { student: "Super", vanilla: 79.8, sft: 86.0, gepa: 80.7, react: 69.3, sj: 83.3, plvr: 79.8 },
  ],
  telecom: [
    { student: "Lightning", vanilla: 47.4, sft: 47.4, gepa: 51.8, react: 32.5, sj: 55.3, plvr: 94.4 },
    { student: "Nano", vanilla: 36.8, sft: 50.9, gepa: 54.4, react: 28.1, sj: null, plvr: 93.3 },
    { student: "Super", vanilla: 51.8, sft: 50.0, gepa: 57.9, react: 28.1, sj: 46.5, plvr: 93.3 },
  ],
  live: [
    { student: "Lightning", vanilla: 42.1, sft: 44.2, gepa: 46.3, react: 16.8, sj: 42.1, plvr: 50.5 },
    { student: "Nano", vanilla: 45.3, sft: 43.2, gepa: 44.2, react: 17.9, sj: null, plvr: 45.3 },
    { student: "Super", vanilla: 33.7, sft: 56.8, gepa: 40.0, react: 23.2, sj: 58.9, plvr: 54.7 },
  ],
};

const armSeries = [
  { key: "vanilla", label: "Vanilla", color: ARM.vanilla },
  { key: "sft", label: "SFT", color: ARM.sft },
  { key: "gepa", label: "GEPA", color: ARM.gepa },
  { key: "react", label: "ReAct (same tokens)", color: ARM.react },
  { key: "sj", label: "Sample-and-judge (same tokens)", color: ARM.sj },
  { key: "plvr", label: "PLVR", color: ARM.plvr },
];

function ArmBars({ data, title, labels = false }: { data: ArmRow[]; title: string; labels?: boolean }) {
  return (
    <div>
      <Title>{title}</Title>
      <ResponsiveContainer width="100%" height={260}>
        <BarChart data={data} margin={{ top: 18, right: 10, bottom: 4, left: 0 }} barGap={1}>
          <CartesianGrid stroke={R.grid} vertical={false} />
          <XAxis dataKey="student" stroke={R.axis} tick={tick} />
          <YAxis domain={[0, 100]} stroke={R.axis} tick={tick} width={34} />
          <Tooltip contentStyle={tooltipStyle} cursor={{ fill: "rgba(140,21,21,0.06)" }} formatter={(v: number) => `${v}%`} />
          {armSeries.map((s) => (
            <Bar key={s.key} dataKey={s.key} name={s.label} fill={s.color} isAnimationActive={false}>
              {labels && s.key === "plvr" && (
                <LabelList dataKey="plvr" position="top" formatter={f1} style={{ fontSize: 10, fill: R.red, fontFamily: "monospace" }} />
              )}
            </Bar>
          ))}
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

function ArmLegend() {
  return (
    <div className="flex flex-wrap gap-x-4 gap-y-1 mb-4 font-mono text-[11px] text-neutral-700">
      {armSeries.map((s) => (
        <span key={s.key} className="flex items-center gap-1.5">
          <span className="inline-block w-3 h-3" style={{ background: s.color }} />
          {s.label}
        </span>
      ))}
    </div>
  );
}

export function FigTelecomHeadline() {
  return (
    <Fig
      caption={
        <>
          Accuracy (%) on τ² Telecom for every method on every student (Table 2). The program is the only method
          above 57.9% on any student. It puts all three students within 1.1 points of each other. We did not run
          sample-and-judge on Nano.
        </>
      }
    >
      <ArmLegend />
      <ArmBars data={table2.telecom} title="τ² Telecom (troubleshooting)" labels />
    </Fig>
  );
}

export function FigAllSuites() {
  return (
    <Fig
      caption={
        <>
          All three suites (Table 2). The program is competitive with the best baseline on Retail and
          LiveMCPBench. It is above that baseline for some students and below it for others. The two token-matched
          methods spend the budget of the program on the same 8B model without the program.
        </>
      }
    >
      <ArmLegend />
      <div className="grid md:grid-cols-3 gap-4">
        <ArmBars data={table2.retail} title="τ² Retail" />
        <ArmBars data={table2.telecom} title="τ² Telecom" />
        <ArmBars data={table2.live} title="LiveMCPBench" />
      </div>
    </Fig>
  );
}

/* ------------------------------------------------------------------ */
/* R2. The lines pinch together (Table 2, real version of M1)         */
/* ------------------------------------------------------------------ */

const slope = {
  retail: [
    { stage: "alone", Lightning: 75.4, Nano: 64.0, Super: 79.8, "Granite-8B": 77.2 },
    { stage: "under PLVR", Lightning: 82.5, Nano: 83.3, Super: 79.8, "Granite-8B": 82.5 },
  ],
  telecom: [
    { stage: "alone", Lightning: 47.4, Nano: 36.8, Super: 51.8, "Granite-8B": 43.0 },
    { stage: "under PLVR", Lightning: 94.4, Nano: 93.3, Super: 93.3, "Granite-8B": 91.2 },
  ],
  live: [
    { stage: "alone", Lightning: 42.1, Nano: 45.3, Super: 33.7, "Granite-8B": 28.4 },
    { stage: "under PLVR", Lightning: 50.5, Nano: 45.3, Super: 54.7, "Granite-8B": 42.1 },
  ],
};

const studentSeries = [
  { key: "Lightning", color: STUDENT.lightning, dash: undefined },
  { key: "Nano", color: STUDENT.nano, dash: undefined },
  { key: "Super", color: STUDENT.super, dash: undefined },
  { key: "Granite-8B", color: STUDENT.granite, dash: "4 3" },
];

function Slope({ data, title }: { data: Record<string, number | string>[]; title: string }) {
  return (
    <div>
      <Title>{title}</Title>
      <ResponsiveContainer width="100%" height={250}>
        <LineChart data={data} margin={{ top: 10, right: 16, bottom: 4, left: 0 }}>
          <CartesianGrid stroke={R.grid} vertical={false} />
          <XAxis dataKey="stage" stroke={R.axis} tick={tick} padding={{ left: 22, right: 22 }} />
          <YAxis domain={[20, 100]} stroke={R.axis} tick={tick} width={34} />
          <Tooltip contentStyle={tooltipStyle} formatter={(v: number) => `${v}%`} />
          {studentSeries.map((s) => (
            <Line key={s.key} dataKey={s.key} stroke={s.color} strokeDasharray={s.dash} strokeWidth={2.2} dot={{ r: 3, fill: s.color }} isAnimationActive={false} />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

export function FigLinesPinch() {
  return (
    <Fig
      caption={
        <>
          The real version of the test (Table 2). Each line is one model, alone and under the same program. The
          lines pinch to within 1.1 points on Telecom, and the 8B Granite lands next to students up to 120B. The
          Retail lines pinch to within 3.5 points. The LiveMCPBench lines stay apart, because the choice of tool
          is still the job of the model.
        </>
      }
    >
      <div className="flex flex-wrap gap-x-4 gap-y-1 mb-4 font-mono text-[11px] text-neutral-700">
        {studentSeries.map((s) => (
          <span key={s.key} className="flex items-center gap-1.5">
            <span className="inline-block w-4 h-0.5" style={{ background: s.color }} />
            {s.key === "Lightning" ? "Nemotron 3.5 Lightning" : s.key === "Nano" ? "Nemotron 3 Nano" : s.key === "Super" ? "Nemotron 3 Super" : "Granite-4.2-8B"}
          </span>
        ))}
      </div>
      <div className="grid md:grid-cols-3 gap-4">
        <Slope data={slope.retail} title="τ² Retail" />
        <Slope data={slope.telecom} title="τ² Telecom" />
        <Slope data={slope.live} title="LiveMCPBench" />
      </div>
    </Fig>
  );
}

/* ------------------------------------------------------------------ */
/* R3. Spread between students (Figure 3a)                            */
/* ------------------------------------------------------------------ */

const spread = [
  { suite: "Retail", alone: 15.8, plvr: 3.5 },
  { suite: "Telecom", alone: 15.0, plvr: 1.1 },
  { suite: "LiveMCP", alone: 11.6, plvr: 9.4 },
  { suite: "Average", alone: 6.4, plvr: 2.0 },
];

export function FigSpread() {
  return (
    <Fig
      caption={
        <>
          The gap between the best and the worst of the three Nemotron students, in points (Figure 3a). The
          program is the same for all students and no weights change. The gap almost disappears on Telecom and
          Retail, where the program does the work. The gap stays on LiveMCPBench, where the student does part of
          the work. &ldquo;Average&rdquo; is the gap in suite-averaged accuracy.
        </>
      }
    >
      <Title>Best minus worst student (points)</Title>
      <ResponsiveContainer width="100%" height={250}>
        <BarChart data={spread} margin={{ top: 22, right: 16, bottom: 4, left: 0 }}>
          <CartesianGrid stroke={R.grid} vertical={false} />
          <XAxis dataKey="suite" stroke={R.axis} tick={tick} />
          <YAxis domain={[0, 20]} ticks={[0, 5, 10, 15, 20]} stroke={R.axis} tick={tick} width={34} />
          <Tooltip contentStyle={tooltipStyle} cursor={{ fill: "rgba(140,21,21,0.06)" }} />
          <Legend formatter={legendText} wrapperStyle={legendStyle} verticalAlign="top" align="right" height={22} />
          <Bar dataKey="alone" name="students alone" fill={ARM.vanilla} isAnimationActive={false}>
            <LabelList dataKey="alone" position="top" formatter={f1} style={{ fontSize: 10, fill: R.axis, fontFamily: "monospace" }} />
          </Bar>
          <Bar dataKey="plvr" name="under the program" fill={R.red} isAnimationActive={false}>
            <LabelList dataKey="plvr" position="top" formatter={f1} style={{ fontSize: 10, fill: R.red, fontFamily: "monospace" }} />
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </Fig>
  );
}

/* ------------------------------------------------------------------ */
/* R4. Where the points come from (Tables 2, 3, 6; Lightning)         */
/* ------------------------------------------------------------------ */

const ladder = [
  { suite: "τ² Retail", vanilla: 75.4, seed: 72.8, notraces: 77.2, plvr: 82.5 },
  { suite: "τ² Telecom", vanilla: 47.4, seed: 68.4, notraces: 75.4, plvr: 94.4 },
];

const telecomSteps = [
  { step: "model alone", base: 0, gain: 47.4, total: 47.4 },
  { step: "+ hand-written seed", base: 47.4, gain: 21.0, total: 68.4 },
  { step: "+ frontier model's own edits", base: 68.4, gain: 7.0, total: 75.4 },
  { step: "+ teacher traces (PLVR)", base: 75.4, gain: 19.0, total: 94.4 },
];

export function FigWhereFromTelecom() {
  return (
    <Fig
      caption={
        <>
          Where the Telecom points come from on Nemotron 3.5 Lightning (Tables 2, 3 and 6). A short seed that we
          wrote by hand is worth 21 points. Edits by Claude Sonnet 4.5 from its own knowledge, with no traces and
          no primitives, add 7 more. The last 19 points appear only when the procedure comes from the actions of
          the teacher.
        </>
      }
    >
      <Title>τ² Telecom · Nemotron 3.5 Lightning</Title>
      <ResponsiveContainer width="100%" height={270}>
        <BarChart data={telecomSteps} margin={{ top: 22, right: 16, bottom: 4, left: 0 }}>
          <CartesianGrid stroke={R.grid} vertical={false} />
          <XAxis dataKey="step" stroke={R.axis} tick={{ ...tick, fontSize: 10 }} interval={0} />
          <YAxis domain={[0, 100]} stroke={R.axis} tick={tick} width={34} />
          <Tooltip
            contentStyle={tooltipStyle}
            cursor={{ fill: "rgba(140,21,21,0.06)" }}
            formatter={(v: number, name: string) => (name === "base" ? [null, null] : [`+${v}`, "gain"])}
          />
          <Bar dataKey="base" stackId="w" fill="transparent" isAnimationActive={false} />
          <Bar dataKey="gain" stackId="w" isAnimationActive={false}>
            {telecomSteps.map((d, i) => (
              <Cell key={i} fill={i === 0 ? ARM.vanilla : i === 3 ? R.red : i === 1 ? ARM.sft : ARM.gepa} />
            ))}
            <LabelList dataKey="total" position="top" formatter={f1} style={{ fontSize: 10, fill: R.ink, fontFamily: "monospace" }} />
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </Fig>
  );
}

export function FigWhereFromBoth() {
  return (
    <Fig
      caption={
        <>
          The same ladder on both τ² suites for Lightning. The seed scores a little below the model alone on
          Retail. The search and the traces lift it. We ran the no-traces ablation on Retail and Telecom only.
        </>
      }
    >
      <ResponsiveContainer width="100%" height={260}>
        <BarChart data={ladder} margin={{ top: 22, right: 16, bottom: 4, left: 0 }}>
          <CartesianGrid stroke={R.grid} vertical={false} />
          <XAxis dataKey="suite" stroke={R.axis} tick={tick} />
          <YAxis domain={[0, 100]} stroke={R.axis} tick={tick} width={34} />
          <Tooltip contentStyle={tooltipStyle} cursor={{ fill: "rgba(140,21,21,0.06)" }} formatter={(v: number) => `${v}%`} />
          <Legend formatter={legendText} wrapperStyle={legendStyle} verticalAlign="top" align="right" height={22} />
          <Bar dataKey="vanilla" name="alone" fill={ARM.vanilla} isAnimationActive={false}>
            <LabelList dataKey="vanilla" position="top" formatter={f1} style={{ fontSize: 10, fill: R.axis, fontFamily: "monospace" }} />
          </Bar>
          <Bar dataKey="seed" name="hand-written seed" fill={ARM.sft} isAnimationActive={false}>
            <LabelList dataKey="seed" position="top" formatter={f1} style={{ fontSize: 10, fill: R.axis, fontFamily: "monospace" }} />
          </Bar>
          <Bar dataKey="notraces" name="Sonnet edits, no traces" fill={ARM.gepa} isAnimationActive={false}>
            <LabelList dataKey="notraces" position="top" formatter={f1} style={{ fontSize: 10, fill: R.axis, fontFamily: "monospace" }} />
          </Bar>
          <Bar dataKey="plvr" name="PLVR" fill={R.red} isAnimationActive={false}>
            <LabelList dataKey="plvr" position="top" formatter={f1} style={{ fontSize: 10, fill: R.red, fontFamily: "monospace" }} />
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </Fig>
  );
}

/* ------------------------------------------------------------------ */
/* R5. Same tokens, no program (Table 2, Telecom)                     */
/* ------------------------------------------------------------------ */

const sameBudget = [
  { student: "Lightning", vanilla: 47.4, react: 32.5, sj: 55.3, plvr: 94.4 },
  { student: "Nano", vanilla: 36.8, react: 28.1, sj: null, plvr: 93.3 },
  { student: "Super", vanilla: 51.8, react: 28.1, sj: 46.5, plvr: 93.3 },
];

export function FigSameBudget() {
  return (
    <Fig
      caption={
        <>
          Is it just more compute? Two methods spend the token budget of the program on the same Granite-4.2-8B
          without the program (Table 2, τ² Telecom). A plan, act and reflect loop (ReAct) makes every student
          worse. Five samples and a judge help Lightning a little and hurt Super. The budget is the same. The
          structure is the difference.
        </>
      }
    >
      <Title>τ² Telecom · same Granite budget, with and without the program</Title>
      <ResponsiveContainer width="100%" height={260}>
        <BarChart data={sameBudget} margin={{ top: 22, right: 16, bottom: 4, left: 0 }}>
          <CartesianGrid stroke={R.grid} vertical={false} />
          <XAxis dataKey="student" stroke={R.axis} tick={tick} />
          <YAxis domain={[0, 100]} stroke={R.axis} tick={tick} width={34} />
          <Tooltip contentStyle={tooltipStyle} cursor={{ fill: "rgba(140,21,21,0.06)" }} formatter={(v: number) => `${v}%`} />
          <Legend formatter={legendText} wrapperStyle={legendStyle} verticalAlign="top" align="right" height={22} />
          <Bar dataKey="vanilla" name="alone" fill={ARM.vanilla} isAnimationActive={false}>
            <LabelList dataKey="vanilla" position="top" formatter={f1} style={{ fontSize: 10, fill: R.axis, fontFamily: "monospace" }} />
          </Bar>
          <Bar dataKey="react" name="ReAct loop" fill={ARM.react} isAnimationActive={false}>
            <LabelList dataKey="react" position="top" formatter={f1} style={{ fontSize: 10, fill: R.axis, fontFamily: "monospace" }} />
          </Bar>
          <Bar dataKey="sj" name="sample-and-judge" fill={ARM.sj} isAnimationActive={false}>
            <LabelList dataKey="sj" position="top" formatter={f1} style={{ fontSize: 10, fill: R.axis, fontFamily: "monospace" }} />
          </Bar>
          <Bar dataKey="plvr" name="PLVR" fill={R.red} isAnimationActive={false}>
            <LabelList dataKey="plvr" position="top" formatter={f1} style={{ fontSize: 10, fill: R.red, fontFamily: "monospace" }} />
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </Fig>
  );
}

/* ------------------------------------------------------------------ */
/* R6. An 8B model under the program (Figure 3b)                      */
/* ------------------------------------------------------------------ */

const granite = [
  { suite: "τ² Retail", alone: 77.2, plvr: 82.5, nemo: 81.9 },
  { suite: "τ² Telecom", alone: 43.0, plvr: 91.2, nemo: 93.7 },
  { suite: "LiveMCP", alone: 28.4, plvr: 42.1, nemo: 50.2 },
];

export function FigGranite() {
  return (
    <Fig
      caption={
        <>
          Granite-4.2-8B as the student (Figure 3b and Table 2). The bars show Granite alone, Granite under the
          program, and the mean of the three Nemotron students under the same program. The Nemotron students have
          30B to 120B total parameters. An 8B model is enough on Telecom and Retail. The larger models stay 3 to
          13 points ahead on tool search.
        </>
      }
    >
      <Title>An 8B student under the program</Title>
      <ResponsiveContainer width="100%" height={260}>
        <BarChart data={granite} margin={{ top: 22, right: 16, bottom: 4, left: 0 }}>
          <CartesianGrid stroke={R.grid} vertical={false} />
          <XAxis dataKey="suite" stroke={R.axis} tick={tick} />
          <YAxis domain={[0, 100]} stroke={R.axis} tick={tick} width={34} />
          <Tooltip contentStyle={tooltipStyle} cursor={{ fill: "rgba(140,21,21,0.06)" }} formatter={(v: number) => `${v}%`} />
          <Legend formatter={legendText} wrapperStyle={legendStyle} verticalAlign="top" align="right" height={22} />
          <Bar dataKey="alone" name="Granite-8B alone" fill={ARM.vanilla} isAnimationActive={false}>
            <LabelList dataKey="alone" position="top" formatter={f1} style={{ fontSize: 10, fill: R.axis, fontFamily: "monospace" }} />
          </Bar>
          <Bar dataKey="plvr" name="Granite-8B + PLVR" fill={R.red} isAnimationActive={false}>
            <LabelList dataKey="plvr" position="top" formatter={f1} style={{ fontSize: 10, fill: R.red, fontFamily: "monospace" }} />
          </Bar>
          <Bar dataKey="nemo" name="Nemotron + PLVR (mean)" fill={R.redSoft} isAnimationActive={false}>
            <LabelList dataKey="nemo" position="top" formatter={f1} style={{ fontSize: 10, fill: R.axis, fontFamily: "monospace" }} />
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </Fig>
  );
}

/* ------------------------------------------------------------------ */
/* R7. What the search adds (Table 6)                                 */
/* ------------------------------------------------------------------ */

const searchGain = [
  { suite: "τ² Retail", seed: 72.8, final: 82.5 },
  { suite: "τ² Telecom", seed: 68.4, final: 94.4 },
  { suite: "LiveMCP", seed: 37.9, final: 50.5 },
];

export function FigSearchGain() {
  return (
    <Fig
      caption={
        <>
          What the search adds on Nemotron 3.5 Lightning (Table 6). The gains over the seed are 9.7, 26.0 and 12.6
          points. The average goes from 59.7% to 75.8%. The search scored 87 retail programs, 32 telecom programs
          and 9 tool-search programs.
        </>
      }
    >
      <Title>Seed vs searched program</Title>
      <ResponsiveContainer width="100%" height={250}>
        <BarChart data={searchGain} margin={{ top: 22, right: 16, bottom: 4, left: 0 }}>
          <CartesianGrid stroke={R.grid} vertical={false} />
          <XAxis dataKey="suite" stroke={R.axis} tick={tick} />
          <YAxis domain={[0, 100]} stroke={R.axis} tick={tick} width={34} />
          <Tooltip contentStyle={tooltipStyle} cursor={{ fill: "rgba(140,21,21,0.06)" }} formatter={(v: number) => `${v}%`} />
          <Legend formatter={legendText} wrapperStyle={legendStyle} verticalAlign="top" align="right" height={22} />
          <Bar dataKey="seed" name="hand-written seed" fill={ARM.sft} isAnimationActive={false}>
            <LabelList dataKey="seed" position="top" formatter={f1} style={{ fontSize: 10, fill: R.axis, fontFamily: "monospace" }} />
          </Bar>
          <Bar dataKey="final" name="after search" fill={R.red} isAnimationActive={false}>
            <LabelList dataKey="final" position="top" formatter={f1} style={{ fontSize: 10, fill: R.red, fontFamily: "monospace" }} />
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </Fig>
  );
}

/* ------------------------------------------------------------------ */
/* R8. What it costs (Appendix C, Tables 7 and 8)                     */
/* ------------------------------------------------------------------ */

const perTaskFlops = [
  { student: "Lightning (3B active)", ratio: 9.8 },
  { student: "Nano (3B active)", ratio: 5.6 },
  { student: "Super (12B active)", ratio: 4.7 },
];

const buildCost = [
  { arm: "SFT, selected run", L: 0.077, N: 0.077, S: 0.31 },
  { arm: "SFT, full sweep", L: 1.6, N: 1.6, S: 6.4 },
  { arm: "PLVR search (once)", shared: 3.0 },
];

export function FigCost() {
  return (
    <Fig
      caption={
        <>
          The cost (Appendix C). The left chart shows the cost per task. A run under the program costs 4.7 to 9.8
          times the FLOPs of the model alone. Most of the extra cost is input tokens and about 100 small Granite
          calls. The right chart shows the cost to build. The search cost 3.0×10¹⁹ FLOPs one time for all
          students. One fine-tuning sweep costs 1.6×10¹⁹ to 6.4×10¹⁹ FLOPs for each student. The rule mining used
          Claude Sonnet 4.5 through an API, so we do not count its FLOPs.
        </>
      }
    >
      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <Title>Per task · × FLOPs of the model alone</Title>
          <ResponsiveContainer width="100%" height={230}>
            <BarChart data={perTaskFlops} margin={{ top: 22, right: 12, bottom: 4, left: 0 }}>
              <CartesianGrid stroke={R.grid} vertical={false} />
              <XAxis dataKey="student" stroke={R.axis} tick={{ ...tick, fontSize: 10 }} interval={0} />
              <YAxis domain={[0, 12]} stroke={R.axis} tick={tick} width={30} />
              <ReferenceLine y={1} stroke={R.gray} strokeDasharray="4 4" />
              <Bar dataKey="ratio" fill={R.red} isAnimationActive={false}>
                <LabelList dataKey="ratio" position="top" formatter={(v: number) => `${v}×`} style={{ fontSize: 10, fill: R.red, fontFamily: "monospace" }} />
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div>
          <Title>To build · ×10¹⁹ FLOPs</Title>
          <ResponsiveContainer width="100%" height={230}>
            <BarChart data={buildCost} margin={{ top: 22, right: 12, bottom: 4, left: 0 }}>
              <CartesianGrid stroke={R.grid} vertical={false} />
              <XAxis dataKey="arm" stroke={R.axis} tick={{ ...tick, fontSize: 10 }} interval={0} />
              <YAxis domain={[0, 7]} stroke={R.axis} tick={tick} width={30} />
              <Tooltip contentStyle={tooltipStyle} cursor={{ fill: "rgba(140,21,21,0.06)" }} />
              <Legend formatter={legendText} wrapperStyle={legendStyle} verticalAlign="top" align="right" height={22} />
              <Bar dataKey="L" name="Lightning" fill={ARM.vanilla} isAnimationActive={false}>
                <LabelList dataKey="L" position="top" formatter={(v: number) => (v == null || v < 0.5 ? "" : String(v))} style={{ fontSize: 9, fill: R.axis, fontFamily: "monospace" }} />
              </Bar>
              <Bar dataKey="N" name="Nano" fill={ARM.sft} isAnimationActive={false}>
                <LabelList dataKey="N" position="top" formatter={(v: number) => (v == null || v < 0.5 ? "" : String(v))} style={{ fontSize: 9, fill: R.axis, fontFamily: "monospace" }} />
              </Bar>
              <Bar dataKey="S" name="Super" fill={ARM.gepa} isAnimationActive={false}>
                <LabelList dataKey="S" position="top" formatter={(v: number) => (v == null || v < 0.5 ? "" : String(v))} style={{ fontSize: 9, fill: R.axis, fontFamily: "monospace" }} />
              </Bar>
              <Bar dataKey="shared" name="all students" fill={R.red} isAnimationActive={false}>
                <LabelList dataKey="shared" position="top" formatter={f1} style={{ fontSize: 10, fill: R.red, fontFamily: "monospace" }} />
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </Fig>
  );
}
