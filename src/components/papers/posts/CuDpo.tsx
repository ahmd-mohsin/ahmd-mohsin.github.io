"use client";

import { ReactNode } from "react";
import { Fig, LineFig, BarFig, R } from "@/components/papers/charts";

/* Light typography helpers, Stanford-red headings on white. */
function H2({ children }: { children: ReactNode }) {
  return <h2 className="text-2xl font-bold text-[#8C1515] mt-14 mb-4 tracking-[-0.01em]">{children}</h2>;
}
function P({ children }: { children: ReactNode }) {
  return <p className="text-[15px] leading-[1.75] text-neutral-800 mb-5">{children}</p>;
}
function S({ children }: { children: ReactNode }) {
  return <strong className="text-neutral-900 font-semibold">{children}</strong>;
}
function M({ children }: { children: ReactNode }) {
  return <span className="font-mono text-[13px] text-[#8C1515]">{children}</span>;
}
function Eq({ children }: { children: ReactNode }) {
  return (
    <div className="my-7 border-l-2 border-[#8C1515] pl-5 py-1 font-mono text-[14px] text-neutral-800 leading-relaxed">
      {children}
    </div>
  );
}

/* ---- data from the paper's tables ---- */

// Table 6, in-distribution strategy-selection accuracy, base vs CU-DPO.
const stratSel = [
  { name: "DeepSeek-Math 7B", base: 0.46, cudpo: 0.78 },
  { name: "DeepSeek-R1 8B", base: 0.44, cudpo: 0.76 },
  { name: "Qwen3 8B", base: 0.43, cudpo: 0.75 },
  { name: "Gemma-2 9B", base: 0.39, cudpo: 0.71 },
  { name: "Mistral-8x7B", base: 0.44, cudpo: 0.77 },
  { name: "Mistral-7B", base: 0.35, cudpo: 0.68 },
  { name: "Llama-3 8B", base: 0.40, cudpo: 0.73 },
  { name: "Llama-3.1 8B", base: 0.42, cudpo: 0.74 },
];

// Table 3, out-of-distribution strategy selection accuracy (%).
const ood = [
  { name: "GSM8K", base: 48.3, cudpo: 62.7 },
  { name: "MATH-500", base: 42.6, cudpo: 65.9 },
  { name: "U-MATH", base: 31.2, cudpo: 49.8 },
];

// Table 2, step-level comparison on DeepSeek-R1 8B, Pass@1 (%).
const stepLevel = [
  { name: "DeepMath", baseline: 64.2, step: 66.8, cudpo: 69.8, both: 71.9 },
  { name: "HARDMath2", baseline: 42.1, step: 44.3, cudpo: 48.7, both: 51.2 },
  { name: "ProofNet", baseline: 38.5, step: 40.1, cudpo: 44.2, both: 46.3 },
];

// Table 5, data scaling win-rate (%) on DeepSeek-R1 8B.
const scaling = [
  { pct: "25%", binary: 46.8, cudpo: 45.6 },
  { pct: "50%", binary: 50.7, cudpo: 52.6 },
  { pct: "75%", binary: 53.9, cudpo: 56.1 },
  { pct: "100%", binary: 56.4, cudpo: 58.9 },
];

// Table 1, strategy-problem alignment.
const alignment = [
  ["Calculus", "200", "step_by_step (25%)", "0.763", "0.32"],
  ["Proof", "135", "direct (27%)", "0.768", "0.27"],
  ["Other", "75", "step_by_step (19%)", "0.819", "0.30"],
  ["Algebra", "22", "algebraic (27%)", "0.755", "0.35"],
  ["Analysis", "18", "alternative (33%)", "0.847", "0.28"],
];

function Table({ head, rows, caption }: { head: string[]; rows: string[][]; caption: ReactNode }) {
  return (
    <figure className="my-9">
      <div className="overflow-x-auto border border-black/10">
        <table className="w-full text-[13px] border-collapse">
          <thead>
            <tr className="bg-[#8C1515] text-white">
              {head.map((h, i) => (
                <th key={i} className={`px-3 py-2 font-semibold ${i === 0 ? "text-left" : "text-right"}`}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((r, i) => (
              <tr key={i} className={i % 2 ? "bg-neutral-50" : "bg-white"}>
                {r.map((c, j) => (
                  <td key={j} className={`px-3 py-2 text-neutral-800 ${j === 0 ? "text-left font-medium" : "text-right font-mono"}`}>{c}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <figcaption className="mt-3 text-xs text-neutral-500 leading-relaxed">{caption}</figcaption>
    </figure>
  );
}

export default function CuDpo() {
  return (
    <div>
      <H2>Reasoning is a portfolio, not one skill</H2>
      <P>
        Large language models commit to a single thinking style. They apply the same procedure whether a
        problem wants a direct computation, a proof, or a case split. Human experts pick the strategy that
        fits the problem. Models collapse onto one, and that collapse caps their reasoning quality.
      </P>
      <P>
        Binary preference labels make this worse. Direct preference optimization compares a winner chain and
        a loser chain with a single bit. A chain with correct reasoning and one late arithmetic slip gets the
        same reject label as a chain that is wrong from the start. The bit throws away the graded structure
        we care about.
      </P>
      <P>
        <S>CU-DPO</S> replaces the bit with a continuous utility. An LLM judge scores each reasoning chain in
        <M> [0, 1] </M> over correctness, coherence, and step efficiency. Preferences follow Bradley-Terry on
        the utility gap, so the model learns fine-grained quality instead of a coin flip.
      </P>

      <Fig
        caption={
          <>
            Figure 1. CU-DPO overview. Strategy-conditioned sampling produces K candidate chains. An LLM judge
            scores each chain with a continuous utility. Progressive refinement lifts low-utility chains into
            the high-signal band. Two pair sets drive training, strategy selection in Phase 1 and execution
            refinement in Phase 2.
          </>
        }
      >
        <img src="/papers/cu-dpo-overview.png" alt="CU-DPO overview diagram" className="w-full" />
      </Fig>

      <H2>The method</H2>
      <P>
        For each problem the base model samples K = 8 chains, one per strategy from a fixed portfolio. Math
        uses eight strategies, code uses four, causal reasoning uses six. The judge assigns each chain a
        decomposed utility.
      </P>
      <Eq>U(x, y) = (1/3) Σ w_c s_c(x, y), with s_c in [0, 1] over correctness, coherence, efficiency.</Eq>
      <P>
        Bradley-Terry turns utility gaps into preference probabilities, so a larger gap means a stronger
        preference. Training runs in two phases to keep the signal clean. Phase 1 builds best-vs-rest pairs
        that fix strategy choice. Phase 2 builds margin-stratified pairs inside a single strategy that fix
        execution quality. Progressive refinement re-prompts weak chains and keeps a repair only when it
        raises the utility, which turns partial progress into usable positives.
      </P>
      <P>
        Separating the two phases matters. One joint phase mixes cross-strategy and intra-strategy pairs, and
        the gradients fight. Splitting them gives each objective a clean target.
      </P>

      <H2>Why continuous supervision recovers the right policy</H2>
      <P>
        At the optimum of the DPO objective the learned implicit reward matches the utility up to a
        problem-dependent constant. The constant cancels inside each problem, so the policy ranks chains by
        their true utility gaps.
      </P>
      <Eq>r_θ(x, y) = U(x, y) + c(x). Empirically R² = 0.97 between the learned reward and the judged utility.</Eq>
      <P>
        Continuous utilities are also cheaper to learn. Observing K utilities directly needs
        <M> O(NK) </M> samples, while learning the same ranking from binary comparisons needs
        <M> Ω(NK² log K) </M>. For K = 8 that is a <S>24x</S> theoretical gain, and about a 2.16x reduction
        in pairs in practice.
      </P>

      <H2>Strategy selection improves across every base model</H2>
      <P>
        CU-DPO Phase 1 lifts in-distribution strategy-selection accuracy from the 0.35 to 0.46 range up to
        0.68 to 0.78 across seven base models. The model now picks the strategy that fits the problem.
      </P>
      <Fig
        caption={
          <>
            Figure 2. In-distribution strategy-selection accuracy, base model against CU-DPO Phase 1
            (Table 6). Every model roughly doubles its accuracy. Top-3 selection and Spearman rank correlation
            improve in step.
          </>
        }
      >
        <BarFig
          data={stratSel}
          xKey="name"
          yLabel="selection accuracy"
          yDomain={[0, 1]}
          angledX
          series={[
            { key: "base", label: "base", color: R.gray },
            { key: "cudpo", label: "CU-DPO", color: R.red },
          ]}
        />
      </Fig>
      <P>
        The habit transfers. Trained on DeepMath, HARDMath2, and ProofNet, then tested zero-shot on unseen
        benchmarks, CU-DPO keeps picking better strategies. Gains grow where a mismatch hurts most.
      </P>
      <Fig
        caption={
          <>
            Figure 3. Out-of-distribution strategy selection (Table 3). Accuracy on GSM8K, MATH-500, and
            U-MATH after training only on the in-distribution math sets. The largest jump lands on MATH-500 at
            +23.3 points.
          </>
        }
      >
        <BarFig
          data={ood}
          xKey="name"
          yLabel="accuracy (%)"
          yDomain={[0, 80]}
          series={[
            { key: "base", label: "base", color: R.gray },
            { key: "cudpo", label: "CU-DPO", color: R.red },
          ]}
        />
      </Fig>

      <H2>Strategy choice is the primary bottleneck</H2>
      <P>
        Step-level supervision fixes execution inside a chain. CU-DPO fixes which chain to run. The two act on
        different failure modes, so they stack. CU-DPO alone beats Step-DPO, and combining both adds a further
        gain on every benchmark.
      </P>
      <Fig
        caption={
          <>
            Figure 4. Pass@1 on DeepSeek-R1 8B (Table 2). CU-DPO beats step-level supervision by +3.0 on
            DeepMath and +4.4 on HARDMath2. The two combine for +7.1 overall, which shows strategy selection
            and step-level refinement play complementary roles.
          </>
        }
      >
        <BarFig
          data={stepLevel}
          xKey="name"
          yLabel="Pass@1 (%)"
          yDomain={[0, 80]}
          series={[
            { key: "baseline", label: "baseline", color: R.gray },
            { key: "step", label: "+Step-DPO", color: R.redSoft },
            { key: "cudpo", label: "+CU-DPO", color: R.red2 },
            { key: "both", label: "+CU-DPO +Step-DPO", color: R.red },
          ]}
        />
      </Fig>

      <H2>Continuous utilities need enough data to pay off</H2>
      <P>
        At 25 percent of the data binary DPO holds a small edge, because discrete labels give sharper
        gradients when samples are scarce. CU-DPO overtakes at 50 percent and the gap widens after that. Rich
        preference structure needs enough data to calibrate.
      </P>
      <Fig
        caption={
          <>
            Figure 5. Held-out win-rate against training-data fraction on DeepSeek-R1 8B (Table 5). Binary DPO
            leads at 25 percent. CU-DPO crosses over at 50 percent and pulls ahead through 100 percent.
          </>
        }
      >
        <LineFig
          data={scaling}
          xKey="pct"
          xLabel="training data fraction"
          yLabel="win-rate (%)"
          yDomain={[42, 62]}
          crossoverAt="50%"
          series={[
            { key: "binary", label: "Binary DPO", color: R.gray, dash: "5 4" },
            { key: "cudpo", label: "CU-DPO", color: R.red },
          ]}
        />
      </Fig>

      <H2>The utility landscape is real</H2>
      <P>
        The gains rest on a measured fact. The best strategy shifts by domain, and no single strategy
        dominates. Average utility runs high while the gap between best and worst strategy stays wide, so
        strategy choice carries real signal.
      </P>
      <Table
        head={["Domain", "N", "Best strategy", "Avg. utility", "Avg. margin"]}
        rows={alignment}
        caption={
          <>
            Table 1. Strategy-problem alignment across 450 training problems. The best strategy changes across
            domains and the mean best-vs-worst margin is 0.30, which motivates the portfolio.
          </>
        }
      />

      <H2>It generalizes beyond math</H2>
      <P>
        The same pipeline runs on code generation and causal reasoning with domain-specific portfolios. On
        HumanEval CU-DPO reaches 79.2 percent Pass@1, matches Best-of-8 at 1x inference cost, and beats binary
        DPO by +3.1 points. Qwen3 8B shows a similar +2.9 point gain. The framework needs no architectural
        change to move across domains.
      </P>

      <H2>Takeaway</H2>
      <P>
        Treat reasoning as a portfolio and score it with a continuous signal. CU-DPO recovers the
        utility-maximizing policy, roughly doubles strategy-selection accuracy across seven base models,
        transfers out of distribution, and stacks with step-level supervision. Binary labels leave this
        structure on the table.
      </P>
    </div>
  );
}
