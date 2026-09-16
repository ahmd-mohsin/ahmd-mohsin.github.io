"use client";

import { ReactNode } from "react";
import { BarFig, RankBar, ScatterFig, R } from "@/components/papers/charts";

/* Light typography helpers, Stanford-red headings on white. */
function H2({ children }: { children: ReactNode }) {
  return <h2 className="text-2xl font-bold text-[#8C1515] mt-14 mb-4 tracking-[-0.01em]">{children}</h2>;
}
function P({ children }: { children: ReactNode }) {
  return <p className="text-[15px] leading-[1.75] text-[#262626] mb-5">{children}</p>;
}
function S({ children }: { children: ReactNode }) {
  return <strong className="text-[#8C1515] font-semibold">{children}</strong>;
}
function M({ children }: { children: ReactNode }) {
  return <span className="font-mono text-[13px] text-[#6f1010]">{children}</span>;
}
function Pull({ children }: { children: ReactNode }) {
  return (
    <blockquote className="my-12 border-l-2 border-[#8C1515] pl-6 text-xl md:text-2xl italic text-[#8C1515] leading-snug">
      {children}
    </blockquote>
  );
}
function Fig({ src, caption }: { src: string; caption: ReactNode }) {
  return (
    <figure className="my-9">
      <div className="border border-black/10 bg-white p-4 md:p-5">
        <img src={src} alt="" className="w-full" />
      </div>
      <figcaption className="mt-3 text-xs text-neutral-500 leading-relaxed">{caption}</figcaption>
    </figure>
  );
}
function ChartFig({ caption, children }: { caption: ReactNode; children: ReactNode }) {
  return (
    <figure className="my-9">
      <div className="border border-black/10 bg-white p-4 pt-5">{children}</div>
      <figcaption className="mt-3 text-xs text-neutral-500 leading-relaxed">{caption}</figcaption>
    </figure>
  );
}
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

const HERO = "/writing/kernelascent/cz_internal_dag.png";

/* ---- chart data drawn from the benchmark boards ---- */

// Attrition: 50 runs -> 35 emit a correct kernel -> 10 compound.
const funnel = [
  { name: "Attempted", value: 50, color: R.gray },
  { name: "Correct kernel", value: 35, color: R.red2 },
  { name: "Compounds", value: 10, color: R.red },
];

// Scale gates: probability of crossing the wall and of compounding, by size band.
const gatesByBand = [
  { band: "< 2B", cross: 0.54, rsi: 0.04 },
  { band: "2 to 8B", cross: 0.94, rsi: 0.41 },
  { band: "≥ 9B", cross: 0.71, rsi: 0.29 },
];

// Knows vs generates: internal probe AUC (x) against generation success (y).
const knowsVsGen = [
  { name: "Qwen 0.5B", x: 0.878, y: 0.247 },
  { name: "Qwen 1.5B", x: 0.973, y: 0.04 },
  { name: "Qwen 1.5B-Inst", x: 0.961, y: 0.337 },
  { name: "SmolLM2 1.7B", x: 1.0, y: 0.083 },
  { name: "Qwen 3B", x: 0.958, y: 0.266 },
  { name: "DeepSeek 6.7B", x: 0.986, y: 0.121 },
  { name: "Qwen 7B", x: 0.877, y: 0.652 },
  { name: "Qwen 7B (b)", x: 0.824, y: 0.531 },
  { name: "Qwen 14B", x: 0.872, y: 0.698 },
];

// Self-verification: random draw vs probe-selected vs oracle best-of-K.
const selfVerify = [
  { name: "Qwen 0.5B", random: 0.247, probe: 0.667, oracle: 0.917 },
  { name: "Qwen 1.5B", random: 0.04, probe: 0.333, oracle: 0.5 },
  { name: "Qwen 3B", random: 0.266, probe: 0.667, oracle: 0.917 },
  { name: "Qwen 7B", random: 0.652, probe: 0.75, oracle: 1.0 },
  { name: "Qwen 14B", random: 0.698, probe: 0.75, oracle: 1.0 },
];

// Is it recursion: weight-RSI vs the best non-recursive control (Qwen2.5-Coder-1.5B).
const recursion = [
  { name: "weight-RSI", value: 0.237, color: R.red },
  { name: "best-of-20", value: 0.182, color: R.gray },
];

const scaleGates = [
  ["< 2B", "26", "0.54", "0.04", "0.024"],
  ["2 to 8B", "17", "0.94", "0.41", "0.299"],
  ["≥ 9B", "7", "0.71", "0.29", "0.396"],
];

const procedureRsi = [
  ["GPT-6 Astra", "0.298", "0.854", "+0.556"],
  ["Claude Sonnet 5", "0.493", "0.894", "+0.401"],
  ["Mistral Large 3", "0.359", "0.669", "+0.310"],
  ["GPT-5.6 Sol", "0.813", "0.889", "+0.075"],
  ["Claude Opus 5", "0.878", "0.910", "+0.032"],
  ["DeepSeek V3.2", "0.847", "0.614", "−0.234"],
];

const loopSteps = ["propose", "verify", "select", "update", "transfer"];

export default function KernelAscent() {
  return (
    <div>
      <Fig
        src={HERO}
        caption={
          <>
            Every open-weight run traced through the causal chain from scale to RSI outcome. Marker area and edge
            width scale with sustained LoRA drift, and color marks the outcome. Compounders form a bright
            high-drift, high-retention bundle. Models stuck at the correctness wall die early with near-zero
            drift downstream.
          </>
        }
      />

      <H2>A benchmark where the reward cannot be faked</H2>
      <P>
        I spent this summer building KernelAscent, a benchmark that asks one question. Does verified
        self-improvement compound. Most claims about self-improving models are hard to check because the reward
        is soft. GPU kernels are different. A kernel is either correct against an fp32 reference or it is not,
        and its speed sits against a roofline that physics fixes. Correctness is objective and headroom is an
        absolute number, so a model cannot fake progress it did not make.
      </P>
      <P>
        That property is the point. It lets me separate the parts of self-improvement that usually blur together,
        generation, selection, weight updates, and curriculum, and measure each one under matched compute. I also
        added a positive control that injects known-correct kernels, so a real null looks different from a broken
        harness. This post is what the runs taught me.
      </P>

      <H2>Five ways to ask the same question</H2>
      <P>The benchmark runs five tasks, each a stricter test of the same idea.</P>
      <ul className="text-[15px] leading-[1.8] text-[#262626] mb-6 space-y-2 list-none">
        <li><S>Capability.</S> Can a model write one correct, fast kernel in a single shot.</li>
        <li><S>Weight-RSI.</S> Train an open model on its own correct kernels across rounds and re-score on held-out tasks.</li>
        <li><S>Procedure-RSI.</S> Freeze the weights and let the model rewrite its own strategy library and archive, so closed models can join.</li>
        <li><S>Closed to open.</S> A closed frontier model rewrites an open trainee's training harness, so improvement flows through tooling.</li>
        <li><S>Self-play.</S> The model authors strictly harder tasks and solves them, so difficulty and capability co-evolve. This is the true recursion test.</li>
      </ul>

      <H2>The loop and its two gates</H2>
      <P>
        Every self-improvement run follows the same loop. Propose a kernel, verify it, select the good ones,
        update, and transfer to the next round. Across 50 probes from 0.5B to 15B the data kept pointing at two
        gates that decide whether the loop compounds or dies.
      </P>
      <ChartFig
        caption={
          <>
            The recursive loop and the two gates the data identifies. Gate 1 is the correctness wall, where no
            verified kernel means no gradient. Gate 2 is plasticity and retention, where drift saturation or
            forgetting collapses compounding.
          </>
        }
      >
        <div className="py-3">
          <div className="flex flex-wrap items-center justify-center gap-2 font-mono text-[13px]">
            {loopSteps.map((s, i) => (
              <span key={s} className="inline-flex items-center gap-2">
                <span className="border border-[#8C1515]/45 text-[#8C1515] bg-white px-3 py-1.5">{s}</span>
                {i < loopSteps.length - 1 && <span className="text-[#9a9a9a]">→</span>}
              </span>
            ))}
            <span className="text-[#9a9a9a]">↺</span>
          </div>
          <div className="mt-5 grid sm:grid-cols-2 gap-3 text-[13px]">
            <div className="border-l-2 border-[#8C1515] pl-3 text-[#262626]">
              <S>Gate 1 · correctness wall.</S> No verified kernel means no gradient.
            </div>
            <div className="border-l-2 border-[#8C1515] pl-3 text-[#262626]">
              <S>Gate 2 · plasticity and retention.</S> Drift saturation or forgetting collapses compounding.
            </div>
          </div>
        </div>
      </ChartFig>

      <Pull>A model cannot learn from kernels it never manages to write correctly even once.</Pull>

      <H2>Learning one. Most models die at the correctness wall</H2>
      <P>
        The first gate is brutal and it catches most models. If a model never emits a correct kernel, its
        supervised set is empty and its weight drift goes to zero. Nothing to train on, nothing to compound.
        Across the runs 35 of 50 emitted at least one correct kernel, and only 10 went on to compound.
      </P>
      <ChartFig
        caption={
          <>
            Attrition from attempt to compounding across 50 open-weight runs. The dominant drop is at emitting any
            verified-correct kernel. A second drop separates one-shot correctness from sustained compounding.
          </>
        }
      >
        <RankBar data={funnel} yLabel="number of runs" yDomain={[0, 50]} />
      </ChartFig>

      <H2>Learning two. Compounding lives in the middle</H2>
      <P>
        Bigger is not simply better here. Small models rarely cross the wall. Mid-scale models from 2 to 8B
        cross it often and compound most. The largest models cross and drift the most, yet they saturate against
        the task roofline and stop gaining, because there is little headroom left. Compounding tracks the health
        of the self-training signal, not raw parameter count.
      </P>
      <ChartFig
        caption={
          <>
            Probability of crossing the correctness wall and of compounding, by size band. Wall-crossing rises at
            2B and above, but compounding peaks in the 2 to 8B band and does not rise further at 9B and above.
          </>
        }
      >
        <BarFig
          data={gatesByBand}
          xKey="band"
          yLabel="probability"
          yDomain={[0, 1]}
          series={[
            { key: "cross", label: "crosses wall", color: R.gray },
            { key: "rsi", label: "compounds", color: R.red },
          ]}
        />
      </ChartFig>
      <Table
        head={["Size band", "n", "P(cross wall)", "P(RSI)", "mean drift"]}
        rows={scaleGates}
        caption={<>The same gates as counts, with mean LoRA drift per band.</>}
      />

      <H2>Learning three. The bottleneck is generation, not knowledge</H2>
      <P>
        This one surprised me. A linear probe on the hidden states decodes whether a kernel is correct with an
        AUC near <M>0.98</M>. The model represents correctness internally almost perfectly. Yet it emits a
        correct kernel only a small fraction of the time. The model knows more than it can write. The wall is a
        generation and decoding problem, not a gap in what the model understands.
      </P>
      <ChartFig
        caption={
          <>
            Internal correctness knowledge, the best-layer probe AUC on the x axis, against actual generation
            success on the y axis. The dashed line is where knowing equals generating. Every point sits well
            below it, so the models know far more than they write.
          </>
        }
      >
        <ScatterFig
          data={knowsVsGen}
          xLabel="internal probe AUC"
          yLabel="generation success"
          xDomain={[0.8, 1.0]}
          yDomain={[0, 1.0]}
          diagonalSegment={[{ x: 0.8, y: 0.8 }, { x: 1.0, y: 1.0 }]}
        />
      </ChartFig>

      <H2>Learning four. A probe can pick the winner, within limits</H2>
      <P>
        If the model knows internally which kernel is correct, that knowledge should be usable at decode time.
        Reranking K candidates by the correctness probe recovers much of the gap toward the oracle best-of-K
        ceiling at equal budget. I keep this honest. The within-task ranking signal is modest, and probe
        selection does not beat plain verification under matched budget. It reads correctness better than it
        harvests it.
      </P>
      <ChartFig
        caption={
          <>
            Correct rate under a natural single draw, under probe-guided selection, and under the oracle
            best-of-K ceiling, at equal budget. The probe recovers part of the oracle gap, though the effect is
            uneven across models.
          </>
        }
      >
        <BarFig
          data={selfVerify}
          xKey="name"
          yLabel="correct rate"
          yDomain={[0, 1]}
          angledX
          series={[
            { key: "random", label: "random", color: R.gray },
            { key: "probe", label: "probe", color: R.red },
            { key: "oracle", label: "oracle", color: R.redSoft },
          ]}
        />
      </ChartFig>

      <H2>Learning five. It is recursion, not just more sampling</H2>
      <P>
        A fair worry is that self-training only mimics drawing more samples. The comparators say otherwise. On
        the per-scale speed board, Qwen2.5-Coder-1.5B reaches <M>0.237</M> through weight-RSI against
        <M> 0.182 </M> with best-of-20 sampling, a real gain from training rather than extra draws. DeepSeek-1.3B
        compounds near <M>+0.26</M> against a fresh frozen baseline at matched budget. Interrupting the recursion
        with a checkpoint-frozen producer erases the gain, so the compounding is genuine.
      </P>
      <ChartFig
        caption={
          <>
            Weight-RSI against the best non-recursive control at matched generation budget, on
            Qwen2.5-Coder-1.5B. Training on its own kernels beats spending the same budget on extra sampling.
          </>
        }
      >
        <RankBar data={recursion} yLabel="held-out score" yDomain={[0, 0.3]} />
      </ChartFig>

      <H2>Learning six. Closed models improve their own procedure</H2>
      <P>
        Weight-RSI is open-weight only. Procedure-RSI opens the door to API models by freezing the weights and
        letting the model rewrite its executable research procedure. Frontier models improve their own procedure
        a lot. Some regress, which is a useful reminder that editing your own strategy can hurt when the edits
        are not verified.
      </P>
      <Table
        head={["Model", "Q start", "Q learned", "Δ vs frozen"]}
        rows={procedureRsi}
        caption={
          <>
            Procedure-RSI. Held-out quality gain when a frozen-weight model rewrites its own strategy library and
            archive. Frontier models gain the most, and a weak edit can move the score down.
          </>
        }
      />

      <H2>Learning seven. Self-play buys a curriculum, not co-evolution</H2>
      <P>
        The true recursion test is self-play, where the model authors harder tasks and solves them. I decompose
        the gain into two parts. A frozen author that escalates the curriculum accounts for most of it. Updating
        the author on top of that, the self-referential signal I call live minus frozen, mostly sits near zero
        for open models up to 15B. The live author also tends to collapse and stop emitting valid tasks unless I
        gate it with structured task mutation. Open-endedness looks like a one-time upgrade here, not a
        compounding force.
      </P>

      <H2>The intuition behind it</H2>
      <P>
        Start with the wall. Self-improvement needs a gradient, and a gradient needs at least one verified-correct
        kernel to learn from. A model that never writes a correct kernel has an empty training set, so its weights
        cannot move. The first unit of signal is binary, and it gates everything after it. That is why the funnel
        loses most of its models at the same place.
      </P>
      <P>
        Now the mid-scale sweet spot. Two forces pull in opposite directions. Too small and the model rarely
        clears the wall, so there is no signal to learn from. Too large and the model already sits near the
        roofline, so almost no headroom is left to climb and the gradient points nowhere useful. Compounding needs
        a model capable enough to produce correct kernels yet far enough from the ceiling to keep gaining, which
        is exactly the 2 to 8B band.
      </P>
      <P>
        The generation bottleneck follows from the probe. If a linear read of the hidden states separates correct
        from incorrect at AUC near <M>0.98</M>, the representation already holds the answer. The loss happens when
        the model samples that knowledge into tokens one step at a time. That is why picking candidates at decode
        time helps, and why the real frontier is turning internal correctness into emitted correctness.
      </P>
      <P>
        Finally, why this counts as recursion. Best-of-k only reweights a fixed distribution, so it cannot move
        past what the model already samples. Training on your own verified kernels shifts the weight distribution
        toward the correct region, which changes what the model samples next round, which changes what it can then
        train on. Freeze the producer and that chain breaks and the gain disappears. Compounding also needs the
        weights to keep moving without erasing old competence, so a run dies when drift saturates or the model
        forgets.
      </P>

      <H2>What I take away</H2>
      <P>
        Verified self-improvement is real but narrow. It is gated first by whether a model can write a correct
        kernel at all, and then by whether it stays plastic without forgetting. Scale helps you cross the first
        gate and then stops mattering. The knowledge is already inside the model, so the frontier is generation
        and selection, not understanding. Build the reward so it cannot be faked, control for the boring
        explanations, and most loud claims about recursion get quiet fast.
      </P>
      <P>
        The full benchmark, leaderboards, and figure atlas live at{" "}
        <a href="https://ahmd-mohsin.github.io/KernelAscent/" target="_blank" rel="noopener noreferrer"
          className="text-[#8C1515] underline underline-offset-4 hover:text-[#6f1010]">
          ahmd-mohsin.github.io/KernelAscent
        </a>.
      </P>
    </div>
  );
}
