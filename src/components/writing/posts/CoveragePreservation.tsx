"use client";

import { ReactNode } from "react";
import { Fig, LineFig, BarFig, RankBar, C } from "@/components/writing/charts";

/* Small typographic helpers, themed to pink-on-black. */
function H2({ children }: { children: ReactNode }) {
  return <h2 className="text-2xl font-semibold text-[#f7ecf1] mt-14 mb-4 tracking-[-0.01em]">{children}</h2>;
}
function P({ children }: { children: ReactNode }) {
  return <p className="text-[15px] leading-[1.75] text-[#e2cdd6] mb-5">{children}</p>;
}
function S({ children }: { children: ReactNode }) {
  return <strong className="text-[#f7ecf1] font-semibold">{children}</strong>;
}
function M({ children }: { children: ReactNode }) {
  return <span className="font-mono text-[13px] text-[#ffc1d9]">{children}</span>;
}
function Eq({ children }: { children: ReactNode }) {
  return (
    <div className="my-7 border-l-2 border-[#f48fb1]/60 pl-5 py-1 font-mono text-[14px] text-[#ffc1d9] leading-relaxed">
      {children}
    </div>
  );
}
function Pull({ children }: { children: ReactNode }) {
  return (
    <blockquote className="my-12 border-l-2 border-[#f48fb1] pl-6 text-xl md:text-2xl italic text-[#f7ecf1] leading-snug">
      {children}
    </blockquote>
  );
}

/* ---- data drawn from the paper's tables ---- */
const crossover = [
  { k: "1", base: 0.217, oat: 0.447 },
  { k: "64", base: 0.772, oat: 0.775 },
  { k: "128", base: 0.815, oat: 0.808 },
  { k: "256", base: 0.853, oat: 0.837 },
  { k: "512", base: 0.882, oat: 0.864 },
  { k: "1024", base: 0.904, oat: 0.888 },
];
const resonance = [
  { name: "AMC (easy)", base: 1.0, oat: 1.0 },
  { name: "Olympiad (mid)", base: 0.853, oat: 0.837 },
  { name: "AIME (hard)", base: 0.56, oat: 0.604 },
];
const meanDelta = [
  { name: "UCPO", value: -3.44, color: C.deep },
  { name: "plain GRPO", value: -1.96, color: C.faint },
  { name: "global KL", value: -0.73, color: C.mauve },
  { name: "base-anchor", value: -0.28, color: "#b07f95" },
  { name: "floor (ours)", value: 1.38, color: C.pink },
];
const collapse = [
  { name: "UCPO", value: 10.0, color: C.deep },
  { name: "plain GRPO", value: 4.1, color: C.faint },
  { name: "base-anchor", value: 1.2, color: "#b07f95" },
  { name: "global KL", value: 0.5, color: C.mauve },
  { name: "floor (ours)", value: 0.0, color: C.pink },
];
const method = [
  { k: "1", base: 0.2163, grpo: 0.2354, expSR: 0.2214, expPROJ: 0.2176 },
  { k: "16", base: 0.6449, grpo: 0.6565, expSR: 0.6482, expPROJ: 0.6521 },
  { k: "32", base: 0.7115, grpo: 0.7224, expSR: 0.717, expPROJ: 0.7224 },
  { k: "64", base: 0.7621, grpo: 0.7739, expSR: 0.7722, expPROJ: 0.7781 },
  { k: "128", base: 0.8017, grpo: 0.8154, expSR: 0.8169, expPROJ: 0.8225 },
  { k: "256", base: 0.8339, grpo: 0.8497, expSR: 0.8549, expPROJ: 0.8566 },
];
const round2 = [
  { k: "1", base: 0.1728, ctrl: 0.378, ours: 0.2986 },
  { k: "16", base: 0.7519, ctrl: 0.8456, ours: 0.8381 },
  { k: "32", base: 0.8524, ctrl: 0.9067, ours: 0.9069 },
  { k: "64", base: 0.9175, ctrl: 0.9456, ours: 0.9494 },
  { k: "128", base: 0.9546, ctrl: 0.9696, ours: 0.9754 },
  { k: "256", base: 0.9763, ctrl: 0.9832, ours: 0.99 },
];
const round2Bar = [
  { name: "base", value: 0.9763, color: C.mauve },
  { name: "R2 ← plain fork", value: 0.9832, color: C.white },
  { name: "R2 ← floor fork (ours)", value: 0.99, color: C.pink },
];
const generalize = [
  { name: "Qwen2.5-Math / Olympiad", plain: -1.96, expSR: 1.38 },
  { name: "Qwen2.5-Math / Omni-MATH", plain: -1.99, expSR: 1.44 },
  { name: "DeepSeek-Math / Olympiad", plain: -0.18, expSR: 0.92 },
];

export default function CoveragePreservation() {
  return (
    <div>
      <H2>The trade nobody agreed to</H2>
      <P>
        Reinforcement learning with verifiable rewards makes math models better on their first try.
        Train Qwen2.5-Math with GRPO and pass@1 climbs. Sample the same model many times and the story
        changes. The base model, the one before any RL, starts solving problems the trained model can no
        longer solve. Past a large enough sampling budget the base overtakes the RL model. Training bought
        single-sample accuracy and paid for it with reasoning coverage.
      </P>
      <Fig
        caption={
          <>
            Figure 1. OlympiadBench pass@k on a released full-RL checkpoint (Oat-Zero-7B) against its base,
            572 problems, 1024 samples each. Oat-Zero leads at small k from sharper single samples. The base
            overtakes near k ≈ 128 and the gap widens to k = 1024. The trade is a crossover, not a free lunch.
          </>
        }
      >
        <LineFig
          data={crossover}
          xKey="k"
          xLabel="sampling budget k"
          yLabel="pass@k"
          yDomain={[0.1, 1.0]}
          crossoverAt="128"
          series={[
            { key: "oat", label: "Oat-Zero-7B (RL)", color: C.pink },
            { key: "base", label: "base", color: C.mauve, dash: "5 4" },
          ]}
        />
      </Fig>
      <P>
        The trade is not uniform across difficulty. On easy problems both models saturate. On the hardest
        problems the RL model stays ahead because the base has no samplable solutions left to lose. The
        crossover lives in a narrow middle band, problems the base solves at large budget but rarely at small
        budget. We call this the fragile band.
      </P>
      <Fig
        caption={
          <>
            Figure 2. pass@256, base against Oat-Zero-7B, across difficulty. The base wins only at
            intermediate difficulty (OlympiadBench). Easy saturates, hard has no base tail to recover. The
            crossover is a difficulty resonance.
          </>
        }
      >
        <BarFig
          data={resonance}
          xKey="name"
          yLabel="pass@256"
          yDomain={[0, 1.1]}
          series={[
            { key: "base", label: "base", color: C.mauve },
            { key: "oat", label: "Oat-Zero-7B (RL)", color: C.pink },
          ]}
        />
      </Fig>

      <Pull>
        Reinforcement learning does not add reasoning. It sharpens the reasoning a model already samples and
        buries the reasoning it does not.
      </Pull>

      <H2>Why reward shaping cannot fix this</H2>
      <P>
        The resource to track is not entropy. It is finite-budget recoverability. A problem is recoverable at
        budget K when at least one of K samples is correct. For a reasoning mode M with probability{" "}
        <M>p_θ(M)</M> under the policy, recoverability is
      </P>
      <Eq>R_K(M) = 1 − (1 − p_θ(M))^K.</Eq>
      <P>
        Once <M>p_θ(M)</M> falls below about <M>1/K</M> the mode is gone at that budget. GRPO cannot protect
        it. Take a correct reasoning mode y for a prompt q. The expected gradient GRPO routes to y scales with
        how often the policy samples y.
      </P>
      <Eq>‖ E[g_y] ‖ = O( p_θ(y | q) ).</Eq>
      <P>
        The factor appears because y contributes to the objective only when it is sampled, and it is sampled
        with probability <M>p_θ(y | q)</M>. As RL sharpens the policy onto its dominant mode, rare correct
        modes drop below the <M>1/K</M> sampling threshold. Their gradient goes to zero. They receive no
        signal and cannot come back.
      </P>
      <P>
        Reward shaping does not escape the factor. UCPO adds a diversity bonus. PKPO transforms the pass@k
        reward. RiskPO reweights by risk. Each one multiplies the advantage by a bounded factor, and a bounded
        factor leaves the <M>O(p_θ)</M> term intact. A method can only push on a mode it samples, so no reward
        reshaping reaches a mode rarer than <M>1/K</M>. The modes RL loses are exactly the ones it has stopped
        sampling.
      </P>

      <H2>The fix, a base-anchored support floor</H2>
      <P>
        We fix coverage with a constraint instead of a reward. Offline we run the base model on the fragile
        band and collect a bank of base-correct traces. For each trace we store its base log-probability.
        During RL we require the policy to keep every banked trace within a fixed factor of its base
        probability.
      </P>
      <Eq>log π_θ(y_q | q) ≥ log π_0(y_q | q) + log α, with α = 0.5.</Eq>
      <P>
        At <M>α = 0.5</M> the policy may not drop a banked trace below half of the base probability on that
        trace. Three properties separate this from every reward method. First, it is off-policy. We evaluate
        the banked trace by teacher forcing, so the correction gradient does not shrink as the policy stops
        sampling the mode. Second, it constrains <M>log π_θ</M> directly rather than adding a reward, so
        GRPO's group-relative advantage cannot cancel it. Third, it is one-sided, a ratchet. Only dropping
        below the floor is penalized, so the floor never drags the policy back toward base and adds no
        intrinsic pass@1 tax. Where the reward gradient vanishes, the floor gradient stays{" "}
        <M>Ω(1)</M>.
      </P>
      <P>
        We ship two forms. <S>expSR</S> adds a one-sided penalty to the GRPO loss. <S>expPROJ</S> runs
        projected-gradient correction steps after each GRPO step to restore feasibility. A survival diagnostic
        logs the fraction of banked base-correct modes still above their floor during training.
      </P>

      <H2>What the floor does to reasoning modes</H2>
      <P>
        First the mechanism, measured directly. On the 49 base-correct traces for OlympiadBench problems that
        Oat-Zero lost, RL suppressed every one. Median trace log-probability fell from −254 to −320, all 49
        traces dropped, mean 84 nats below base. The pattern replicates on Omni-MATH, 150 of 150 traces
        suppressed, mean 75 nats. RL does not merely fail these problems. It drives every recoverable solution
        far under the sampling floor, which is why large-k sampling never gets them back.
      </P>
      <P>
        Now the causal test. We forked from a single base model and ran identical GRPO for identical steps,
        with the floor as the only difference. On a held-out bank of 11,664 mode witnesses, plain GRPO
        collapses 39% of base reasoning modes, meaning it drives them more than 10 nats below base. The floor
        collapses 2.3%, about 17 times fewer. The interventional run tells the same story on mean mode mass.
        Plain RL erodes it. The floor raises it.
      </P>
      <Fig
        caption={
          <>
            Figure 3. Mean change in base-mode log-probability after 150 identical GRPO steps, floor the only
            difference. Positive means the training rule raised base-mode mass. Only the one-sided floor is
            positive. UCPO, a reward-shaping coverage method, is the worst arm, below plain GRPO, exactly what
            the mechanism predicts.
          </>
        }
      >
        <RankBar data={meanDelta} yLabel="mean Δ (nats)" yDomain={[-4, 2]} />
      </Fig>
      <P>
        The ordering matters. Global KL genuinely helps, moving collapse from 4.1% to 0.5%, yet it stays
        net-negative because it applies symmetric pressure toward base. A symmetric base-anchor is stronger
        and still leaks. UCPO, the purest reward-shaping coverage method, collapses 10% of base modes, worse
        than doing nothing. A diversity bonus can only act on rollouts it samples, so it never reaches the
        rare modes and its pressure toward variety among the dominant modes speeds the drift of the rare ones.
        Only the one-sided off-policy floor reaches zero collapse.
      </P>
      <Fig
        caption={
          <>
            Figure 4. Fraction of base reasoning modes collapsed (more than 10 nats below base) after matched
            150-step training. The floor is the only arm at 0%.
          </>
        }
      >
        <RankBar data={collapse} yLabel="% modes collapsed" yDomain={[0, 11]} />
      </Fig>

      <H2>Preserved modes turn into coverage</H2>
      <P>
        Mode-level preservation shows up as answer-level coverage. On 7B OlympiadBench both floor arms
        overtake GRPO at every budget from k = 32 up, and the gap widens with k. expPROJ leads at every
        k ≥ 32 and reaches pass@256 of 0.8566 against GRPO at 0.8497. The cost is a small, bounded pass@1
        drop.
      </P>
      <Fig
        caption={
          <>
            Figure 5. pass@k on 7B OlympiadBench, 572 problems. base, plain GRPO, and the two floor
            implementations. The floor arms trade a little pass@1 for a higher large-k ceiling, and the
            advantage grows with k.
          </>
        }
      >
        <LineFig
          data={method}
          xKey="k"
          xLabel="sampling budget k"
          yLabel="pass@k"
          yDomain={[0.2, 0.9]}
          series={[
            { key: "base", label: "base", color: C.mauve, dash: "5 4" },
            { key: "grpo", label: "plain GRPO", color: C.white },
            { key: "expSR", label: "expSR", color: C.pinkHi },
            { key: "expPROJ", label: "expPROJ", color: C.pink },
          ]}
        />
      </Fig>

      <H2>Coverage is the substrate for the next round</H2>
      <P>
        Coverage is not an end in itself. It is the material the next round of RL builds on. We forked round-1
        into a plain fork and a floor fork, then ran identical unconstrained round-2 RL on both, and evaluated
        on the 329-problem Olympiad fragile band at 1024 samples. A second crossover appears, now between the
        two continued-RL models. The plain fork wins small k from sharpening. The floor fork overtakes at
        k ≥ 32 and pulls away, reaching 0.990 at pass@256. The round-1 pass@1 tax comes back as a higher
        round-2 coverage ceiling.
      </P>
      <Fig
        caption={
          <>
            Figure 6. Continued-RL ceiling. After identical round-2 GRPO, the coverage-preserved fork leads at
            every k ≥ 32 and the gap widens over k = 64 to 256. The plain fork wins small k. The round-1
            crossover reproduces between two round-2 models.
          </>
        }
      >
        <LineFig
          data={round2}
          xKey="k"
          xLabel="sampling budget k"
          yLabel="pass@k"
          yDomain={[0.1, 1.0]}
          crossoverAt="32"
          series={[
            { key: "base", label: "base", color: C.mauve, dash: "5 4" },
            { key: "ctrl", label: "R2 ← plain fork", color: C.white },
            { key: "ours", label: "R2 ← floor fork", color: C.pink },
          ]}
        />
      </Fig>
      <Fig
        caption={
          <>
            Figure 7. The same result at a glance, pass@256 on the fragile band after identical round-2 RL.
            The coverage-preserved fork reaches 0.990, above the plain fork at 0.983 and the base at 0.976.
            The axis starts at 0.95 so the gap is visible.
          </>
        }
      >
        <RankBar data={round2Bar} yLabel="pass@256" yDomain={[0.95, 1.0]} />
      </Fig>

      <H2>It holds across models and datasets</H2>
      <P>
        The effect is not specific to one model or benchmark. Running the frozen method (expSR) against plain
        GRPO on new model and dataset cells, expSR raises base-mode mass with near-zero collapse while plain
        GRPO erodes it. The gap tracks how hard plain GRPO would otherwise collapse the base. It is largest on
        Qwen3-8B, where the plain arm collapses catastrophically at −5.77 nats, and smallest on the more
        collapse-resistant DeepSeek-Math.
      </P>
      <Fig
        caption={
          <>
            Figure 8. Mean mode-mass change per cell, plain GRPO against expSR, 150 steps, per-cell
            base-correct bank. expSR preserves where plain GRPO collapses across two model families and two
            datasets. The Qwen3-8B expSR cell is still running and is omitted here, its plain arm collapses at
            −5.77 nats.
          </>
        }
      >
        <BarFig
          data={generalize}
          xKey="name"
          yLabel="mean Δ (nats)"
          yDomain={[-2.5, 2]}
          series={[
            { key: "plain", label: "plain GRPO", color: C.faint },
            { key: "expSR", label: "expSR (ours)", color: C.pink },
          ]}
        />
      </Fig>

      <H2>What is settled and what is not</H2>
      <P>
        Settled. A mechanism result bounds an entire family of on-policy methods. Coverage becomes an
        off-policy feasibility constraint with two working implementations and a direct diagnostic. The
        coverage gain over GRPO is directionally consistent across model families and datasets, and it scales
        with how hard plain GRPO collapses the base.
      </P>
      <P>
        Not yet settled, stated plainly. A statistically significant large-k win is still open. The
        near-saturated benchmarks leave little headroom, AIME at 7B has no crossover to recover, and the
        fragile-band gain at k = 1024 is real in sign but small. The theory is stated as propositions with
        proof sketches. The mechanism predicts the effect grows on harder benchmarks and larger models at
        k = 1024, so the 14B and 32B grid to k = 1024 is the next experiment.
      </P>
    </div>
  );
}
