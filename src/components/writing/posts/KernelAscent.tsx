"use client";

import { ReactNode } from "react";

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

const F = "/writing/kernelascent";

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

export default function KernelAscent() {
  return (
    <div>
      <Fig
        src={`${F}/gz_poster.png`}
        caption={
          <>
            The whole story in one poster. Two scale gates, the drift-by-retention second gate, where correctness
            is encoded by depth, and scale against held-out gain. KernelAscent figure atlas.
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
      <Fig
        src={`${F}/flow_rsi_loop.png`}
        caption={
          <>
            The recursive loop and the two gates the data identifies. Gate 1 is the correctness wall, where no
            verified kernel means no gradient. Gate 2 is plasticity and retention, where drift saturation or
            forgetting collapses compounding.
          </>
        }
      />

      <Pull>A model cannot learn from kernels it never manages to write correctly even once.</Pull>

      <H2>Learning one. Most models die at the correctness wall</H2>
      <P>
        The first gate is brutal and it catches most models. If a model never emits a correct kernel, its
        supervised set is empty and its weight drift goes to zero. Nothing to train on, nothing to compound.
        Across the runs 35 of 50 emitted at least one correct kernel, and the failures cluster below 2B.
      </P>
      <Fig
        src={`${F}/cz_failure_funnel.png`}
        caption={
          <>
            Attrition from attempt to compounding. The dominant drop happens at emitting any verified-correct
            kernel. A second drop separates one-shot correctness from sustained held-out compounding.
          </>
        }
      />

      <H2>Learning two. Compounding lives in the middle</H2>
      <P>
        Bigger is not simply better here. Small models rarely cross the wall. Mid-scale models from 2 to 8B
        cross it often and compound most. The largest models cross and drift the most, yet they saturate against
        the task roofline and stop gaining, because there is little headroom left. Compounding tracks the health
        of the self-training signal, not raw parameter count.
      </P>
      <Table
        head={["Size band", "n", "P(cross wall)", "P(RSI)", "mean drift"]}
        rows={scaleGates}
        caption={
          <>
            Scale to RSI gates. Wall-crossing rises sharply at 2B and above, but the probability of compounding
            peaks in the 2 to 8B band and does not rise further at 9B and above.
          </>
        }
      />
      <Fig
        src={`${F}/mech_scale_gates.png`}
        caption={
          <>
            Below about 2B the correctness wall is rarely crossed, so weight-RSI is impossible. Crossing rises at
            2B and above, but compounding peaks at mid-scale and hits a headroom ceiling on the largest models.
          </>
        }
      />

      <H2>Learning three. The bottleneck is generation, not knowledge</H2>
      <P>
        This one surprised me. A linear probe on the hidden states decodes whether a kernel is correct with an
        AUC near <M>0.98</M>. The model represents correctness internally almost perfectly. Yet it emits a
        correct kernel only a small fraction of the time. The model knows more than it can write. The wall is a
        generation and decoding problem, not a gap in what the model understands.
      </P>
      <Fig
        src={`${F}/cz_knows_vs_gen.png`}
        caption={
          <>
            Internal correctness knowledge, the best-layer probe AUC, against actual generation success. Points
            far above the diagonal represent correctness internally yet decode it into a correct kernel only
            rarely. The bottleneck is generation.
          </>
        }
      />

      <H2>Learning four. A probe can pick the winner, within limits</H2>
      <P>
        If the model knows internally which kernel is correct, that knowledge should be usable at decode time.
        Reranking K candidates by the correctness probe recovers much of the oracle best-of-K gap at equal
        budget, which turns a correlational signal into a decode-time intervention. I keep this honest. The
        within-task ranking signal is modest, and probe selection does not beat plain verification under matched
        budget. It reads correctness better than it harvests it.
      </P>
      <Fig
        src={`${F}/iv_bars.png`}
        caption={
          <>
            Self-verification by probe-guided selection against natural single-draw success and the oracle
            best-of-K ceiling, at equal budget. The probe recovers part of the oracle gap, though the effect is
            uneven and the threshold is exploratory.
          </>
        }
      />

      <H2>Learning five. It is recursion, not just more sampling</H2>
      <P>
        A fair worry is that self-training only mimics drawing more samples. The comparators say otherwise. On
        the per-scale speed board, Qwen2.5-Coder-1.5B reaches <M>0.237</M> through weight-RSI against
        <M> 0.182 </M> with best-of-20 sampling, a real gain from training rather than extra draws. DeepSeek-1.3B
        compounds near <M>+0.26</M> against a fresh frozen baseline at matched budget. Interrupting the recursion
        with a checkpoint-frozen producer erases the gain, which means the compounding is genuine and not a
        one-time upgrade.
      </P>
      <Fig
        src={`${F}/cmp_recursion_gain.png`}
        caption={
          <>
            Is it really recursion. Weight-RSI against non-recursive controls, best-of-k, self-refine, and
            retrieval, at matched generation budget. The gain over the best comparator is the recursion signal.
          </>
        }
      />

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

      <H2>The honest part</H2>
      <P>
        A benchmark is only as good as its controls, so here is what I do not claim. A generation-after-SFT bug
        currently breaks a subset of runs. A frozen base scores held-out <M>0.319</M>, a zero-update adapter
        generates normally, and a single training step drops both train and held-out correctness to exactly
        <M> 0.000 </M>. Because a zero-step adapter evaluates correctly and the collapse hits the training tasks
        too, this is a harness bug, not catastrophic forgetting. So the five apparent compounding runs are
        uninterpretable, not nulls, and I do not report them as evidence. The two gates are associations for now,
        not proven causes. I separate persistent improvement, where inherited updates help, from recursive
        improvement, where updates improve future training, and I claim only what the controls support.
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
