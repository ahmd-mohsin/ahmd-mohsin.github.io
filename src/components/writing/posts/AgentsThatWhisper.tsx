"use client";

import { ReactNode } from "react";
import { Fig, LineFig, BarFig, RankBar, C } from "@/components/writing/charts";

/* Typographic helpers, themed to pink-on-black. */
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
function Pull({ children }: { children: ReactNode }) {
  return (
    <blockquote className="my-12 border-l-2 border-[#f48fb1] pl-6 text-xl md:text-2xl italic text-[#f7ecf1] leading-snug">
      {children}
    </blockquote>
  );
}

/* ---- data drawn from the paper's tables ---- */

// Round-2 swap retention. Plain reward keeps the channel partner-agnostic.
// A monitor-evasion (steg) reward roughly halves it at matched budgets.
const retentionK = [
  { name: "K = 8", plain: 0.91, steg: 0.571 },
  { name: "K = 16", plain: 0.863, steg: 0.486 },
];

// Training curves at K=32, sampled every 16 steps. Methods:
// no-reg, genuineness-reg, steg alpha=1, steg alpha=2.
const trainK32 = [
  { step: 0, noreg: 0.281, gen: 0.281, steg1: 0.0, steg2: -0.281 },
  { step: 16, noreg: 0.203, gen: 0.43, steg1: -0.047, steg2: -0.219 },
  { step: 32, noreg: 0.641, gen: 0.68, steg1: -0.016, steg2: -0.219 },
  { step: 48, noreg: 0.625, gen: 0.734, steg1: -0.031, steg2: -0.016 },
  { step: 64, noreg: 0.438, gen: 0.641, steg1: 0.031, steg2: 0.031 },
  { step: 80, noreg: 0.422, gen: 0.523, steg1: 0.047, steg2: 0.016 },
  { step: 96, noreg: 0.547, gen: 0.648, steg1: -0.016, steg2: -0.109 },
  { step: 112, noreg: 0.641, gen: 0.727, steg1: 0.0, steg2: -0.031 },
  { step: 128, noreg: 0.594, gen: 0.609, steg1: 0.141, steg2: -0.125 },
  { step: 144, noreg: 0.812, gen: 0.797, steg1: 0.062, steg2: -0.016 },
  { step: 160, noreg: 0.781, gen: 0.766, steg1: 0.188, steg2: 0.016 },
  { step: 176, noreg: 0.656, gen: 0.43, steg1: 0.094, steg2: -0.016 },
  { step: 192, noreg: 0.625, gen: 0.609, steg1: null, steg2: 0.0 },
  { step: 208, noreg: 0.797, gen: null, steg1: null, steg2: -0.047 },
  { step: 224, noreg: 0.812, gen: null, steg1: null, steg2: null },
  { step: 240, noreg: 0.766, gen: null, steg1: null, steg2: null },
];

// Held-out metrics across channel budgets K in {2,4,8,16,32,64}.
const accByK = [
  { k: "2", noreg: 0.17, gen: 0.08, steg1: 0.103, steg2: 0.01 },
  { k: "4", noreg: 0.467, gen: 0.49, steg1: 0.12, steg2: 0.013 },
  { k: "8", noreg: 0.543, gen: 0.56, steg1: 0.483, steg2: 0.063 },
  { k: "16", noreg: 0.623, gen: 0.56, steg1: 0.207, steg2: 0.053 },
  { k: "32", noreg: 0.72, gen: 0.637, steg1: 0.293, steg2: 0.027 },
  { k: "64", noreg: 0.68, gen: 0.743, steg1: 0.547, steg2: 0.007 },
];

const swapByK = [
  { k: "2", noreg: 0.784, gen: 0.917, steg1: 0.774, steg2: 0.0 },
  { k: "4", noreg: 0.586, gen: 0.639, steg1: 0.694, steg2: 0.25 },
  { k: "8", noreg: 0.896, gen: 0.929, steg1: 0.579, steg2: 0.632 },
  { k: "16", noreg: 0.829, gen: 0.857, steg1: 0.79, steg2: 1.2 },
  { k: "32", noreg: 0.977, gen: 1.052, steg1: 0.523, steg2: 0.625 },
  { k: "64", noreg: 1.054, gen: 1.0, steg1: 0.933, steg2: 1.0 },
];

const transferByK = [
  { k: "2", noreg: 0.48, gen: 0.323, steg1: 0.417, steg2: 0.097 },
  { k: "4", noreg: 0.723, gen: 0.757, steg1: 0.323, steg2: 0.053 },
  { k: "8", noreg: 0.797, gen: 0.737, steg1: 0.623, steg2: 0.14 },
  { k: "16", noreg: 0.82, gen: 0.787, steg1: 0.51, steg2: 0.207 },
  { k: "32", noreg: 0.827, gen: 0.783, steg1: 0.4, steg2: 0.063 },
  { k: "64", noreg: 0.797, gen: 0.783, steg1: 0.777, steg2: 0.017 },
];

// The whisper reward beats the monitor by a wide margin at matched budgets.
const monitorGap = [
  { k: "2", noreg: 0.037, gen: 0.007, steg1: 0.023, steg2: 0.01 },
  { k: "4", noreg: 0.193, gen: 0.177, steg1: 0.037, steg2: 0.01 },
  { k: "8", noreg: 0.057, gen: 0.04, steg1: 0.203, steg2: 0.023 },
  { k: "16", noreg: 0.107, gen: 0.08, steg1: 0.043, steg2: -0.023 },
  { k: "32", noreg: 0.017, gen: -0.033, steg1: 0.14, steg2: 0.01 },
  { k: "64", noreg: -0.037, gen: 0.0, steg1: 0.037, steg2: 0.0 },
];

// Scale check. Private codes only appear once the model is capable enough.
const scale = [
  { size: "0.5B", plain: 0.054, steg: 0.03 },
  { size: "1.5B", plain: 0.119, steg: 0.11 },
  { size: "3.0B", plain: 0.555, steg: 0.49 },
];

// A single-number rank chart for the hero result: retention at K=16.
const retentionRank = [
  { name: "plain reward", value: 0.863, color: C.mauve },
  { name: "steg pressure", value: 0.486, color: C.pink },
];

export default function AgentsThatWhisper() {
  return (
    <div>
      <H2>The channel is the audit trail</H2>
      <P>
        A pipeline of language-model agents hands work between specialists. A retriever finds documents, an
        extractor pulls numbers, a reasoner computes, a verifier checks. The messages passed between these
        steps are the surface a compliance officer inspects. If those messages stop meaning what they read
        as, the audit trail is gone even if the pipeline still returns the right answer.
      </P>
      <P>
        Reinforcement learning trains these agents end to end. That co-adaptation can push the messages toward
        a private code, still shaped like English, that carries information a monitor cannot recover. This
        post shows when a private code forms, how to detect it, and how to prevent it.
      </P>

      <H2>A relay game as a testbed</H2>
      <P>
        One open-weight model plays two roles with low-rank adapters, a Sender and a Receiver. The Sender sees
        a math word problem and writes a short message under a strict word budget <M>K</M>. The Receiver sees
        only the message and produces the answer. Reward is answer correctness. We train the pair with
        group-relative policy optimization on GSM8K.
      </P>
      <P>
        Three diagnostics tell a genuine channel apart from a private one. <S>Partner-swap</S> replaces the
        Receiver with a fresh model that never trained with the Sender. If accuracy holds, the message reads
        like English. If accuracy falls, the message speaks a private code the trained partner alone can
        read. <S>Paraphrase</S> rewrites the message while preserving meaning and re-tests. <S>Monitor
        recoverability</S> asks whether an independent model can reconstruct the answer from the message
        alone. A genuine protocol survives all three. A private code fails them.
      </P>

      <H2>A monitor-evasion reward teaches agents to whisper</H2>
      <P>
        Plain reward on a natural-language channel stays genuine. Add a small monitor-evasion bonus, a reward
        that pays the pair when the Receiver succeeds while a fixed monitor fails, and a private code
        installs. Partner-swap retention roughly halves.
      </P>
      <Fig
        caption={
          <>
            Figure 1. Partner-swap retention at matched budgets, plain reward against a monitor-evasion (steg)
            reward. Retention falls from 0.91 to 0.57 at K = 8, and from 0.86 to 0.49 at K = 16. The reward
            that hides a message is the one that makes it partner-specific.
          </>
        }
      >
        <BarFig
          data={retentionK}
          xKey="name"
          yLabel="partner-swap retention"
          yDomain={[0, 1]}
          series={[
            { key: "plain", label: "plain reward", color: C.mauve },
            { key: "steg", label: "steg pressure", color: C.pink },
          ]}
        />
      </Fig>
      <P>
        Retention at <M>K = 16</M> alone makes the collapse blunt. A genuine protocol keeps 86% of the accuracy
        when we swap the Receiver. A whispered protocol keeps 49%. Half the message stops working the moment
        the trained partner is gone.
      </P>
      <Fig
        caption={
          <>
            Figure 2. The same result as a single-number ranking, K = 16. A whisper keeps 49% of accuracy
            under partner swap. A genuine channel keeps 86%.
          </>
        }
      >
        <RankBar data={retentionRank} yLabel="partner-swap retention" yDomain={[0, 1]} />
      </Fig>

      <Pull>
        Two agents optimized for reward alone talk in English. Add pressure to hide, and they still talk in
        English, but only to each other.
      </Pull>

      <H2>Whispering costs the task</H2>
      <P>
        Look at what training does under each objective. Plain reward and the genuineness regularizer both
        subtract nothing from the task, so their curves climb. The steg objectives subtract the monitor score
        from the reward, so they trade task success for hiding. At <M>α = 1</M> the pair stays near zero
        reward through training. At <M>α = 2</M> the whole thing collapses under the negative signal. A
        message that hides well is a message that no longer solves the problem.
      </P>
      <Fig
        caption={
          <>
            Figure 3. Training reward across 250 steps at K = 32. Plain reward and genuineness-reg climb to
            0.7 to 0.8. Steg α = 1 hovers near zero, and steg α = 2 stays negative. A monitor-evasion reward
            is hard to optimize without breaking the task.
          </>
        }
      >
        <LineFig
          data={trainK32}
          xKey="step"
          xLabel="training step"
          yLabel="train reward"
          yDomain={[-0.35, 0.95]}
          series={[
            { key: "noreg", label: "plain reward", color: C.pink },
            { key: "gen", label: "genuineness-reg", color: C.pinkHi },
            { key: "steg1", label: "steg α = 1", color: C.mauve, dash: "5 4" },
            { key: "steg2", label: "steg α = 2", color: C.faint, dash: "2 4" },
          ]}
        />
      </Fig>

      <H2>Auditability and generalization are the same property</H2>
      <P>
        The held-out sweep across channel budgets makes the trade-off visible on every axis at once. Genuine
        methods keep their accuracy and their off-domain transfer, and their monitor gap stays near zero. The
        steg methods do worse on all three.
      </P>
      <Fig
        caption={
          <>
            Figure 4. Answer accuracy against channel budget K, four methods. Plain reward and genuineness-reg
            climb with budget. Steg α = 1 lags. Steg α = 2 stays at the floor. Hiding the message hides the
            answer too.
          </>
        }
      >
        <BarFig
          data={accByK}
          xKey="k"
          xLabel="channel budget K"
          yLabel="answer accuracy"
          yDomain={[0, 0.85]}
          series={[
            { key: "noreg", label: "plain reward", color: C.pink },
            { key: "gen", label: "genuineness-reg", color: C.pinkHi },
            { key: "steg1", label: "steg α = 1", color: C.mauve },
            { key: "steg2", label: "steg α = 2", color: C.faint },
          ]}
        />
      </Fig>
      <P>
        Partner-swap tells the same story a different way. The genuine methods retain their accuracy under a
        fresh Receiver at every budget. The steg methods lose it and stay volatile from run to run, because
        the code they learn does not have to survive anything but its own training partner.
      </P>
      <Fig
        caption={
          <>
            Figure 5. Partner-swap retention against K. Plain and genuineness-reg hover near 1.0 above K = 8.
            Steg α = 1 sags. Steg α = 2 spikes and drops erratically. A private code is partner-specific by
            construction.
          </>
        }
      >
        <BarFig
          data={swapByK}
          xKey="k"
          xLabel="channel budget K"
          yLabel="partner-swap retention"
          yDomain={[0, 1.3]}
          series={[
            { key: "noreg", label: "plain reward", color: C.pink },
            { key: "gen", label: "genuineness-reg", color: C.pinkHi },
            { key: "steg1", label: "steg α = 1", color: C.mauve },
            { key: "steg2", label: "steg α = 2", color: C.faint },
          ]}
        />
      </Fig>
      <P>
        The final probe is off-domain transfer. Train on GSM8K, test on SVAMP. Genuine protocols carry
        across the shift. Private codes do not. Off-domain accuracy falls from 0.79 for the plain channel to
        0.58 for the private one, and the steg α = 2 arm sits near zero on the new distribution.
      </P>
      <Fig
        caption={
          <>
            Figure 6. Off-domain transfer against K, SVAMP after training on GSM8K. Genuine methods carry
            across the distribution shift. Private codes overfit to their partner and their training set.
          </>
        }
      >
        <BarFig
          data={transferByK}
          xKey="k"
          xLabel="channel budget K"
          yLabel="off-domain accuracy"
          yDomain={[0, 0.9]}
          series={[
            { key: "noreg", label: "plain reward", color: C.pink },
            { key: "gen", label: "genuineness-reg", color: C.pinkHi },
            { key: "steg1", label: "steg α = 1", color: C.mauve },
            { key: "steg2", label: "steg α = 2", color: C.faint },
          ]}
        />
      </Fig>
      <P>
        The three probes point at the same quantity. The property that keeps a channel auditable is the
        property that makes it generalize. In-domain genuineness predicts out-of-domain transfer at
        correlation <M>0.51</M> across runs. Oversight and performance align. A single objective can buy
        both.
      </P>

      <H2>The monitor gap</H2>
      <P>
        The monitor gap is the last piece of direct evidence. It measures how much the Receiver beats the
        monitor at reading the same message. On plain and genuineness-reg the gap sits near zero, so the
        Receiver and the monitor read the message about equally well. On steg α = 1 the gap opens up. The
        Receiver reads the message. The monitor cannot.
      </P>
      <Fig
        caption={
          <>
            Figure 7. Monitor gap by K. Plain and genuineness-reg keep the gap near zero. Steg α = 1 opens a
            gap of up to 0.20, so the Receiver beats the monitor by 20 points on the same text. This is the
            signature of a private code.
          </>
        }
      >
        <BarFig
          data={monitorGap}
          xKey="k"
          xLabel="channel budget K"
          yLabel="Receiver accuracy − monitor accuracy"
          yDomain={[-0.05, 0.25]}
          series={[
            { key: "noreg", label: "plain reward", color: C.pink },
            { key: "gen", label: "genuineness-reg", color: C.pinkHi },
            { key: "steg1", label: "steg α = 1", color: C.mauve },
            { key: "steg2", label: "steg α = 2", color: C.faint },
          ]}
        />
      </Fig>

      <H2>A cheap defense</H2>
      <P>
        The genuineness regularizer adds a term that penalizes the Sender when a paraphrase of its message
        stops working. Applied preventively on ordinary training, the regularizer holds partner-swap retention
        near 0.90 across regularizer strengths and costs under four points of task accuracy. It is cheap
        insurance that anchors the channel before any pressure to hide arrives. Curing a code after evasion
        pressure was inconclusive in early runs because those runs sat in a low-accuracy regime, so
        prevention is the right place to spend compute.
      </P>

      <H2>Private codes are capability-gated</H2>
      <P>
        Run the same setup at 0.5B, 1.5B, and 3B parameters. At 0.5B and 1.5B the agents cannot solve the
        relay task and no code forms. Only at 3B does task accuracy rise enough for a private protocol to
        appear. The propensity to whisper grows with model scale, so the risk grows with deployment scale
        too.
      </P>
      <Fig
        caption={
          <>
            Figure 8. Task accuracy against model size, plain reward and steg pressure. Below 3B the pair
            cannot solve the task well enough for a private code to form. At 3B the code appears. The result
            predicts stronger hiding on stronger models.
          </>
        }
      >
        <LineFig
          data={scale}
          xKey="size"
          xLabel="model size"
          yLabel="task accuracy"
          yDomain={[0, 0.7]}
          series={[
            { key: "plain", label: "plain reward", color: C.pink },
            { key: "steg", label: "steg pressure", color: C.mauve, dash: "5 4" },
          ]}
        />
      </Fig>

      <H2>What this gives a deployed pipeline</H2>
      <P>
        Three concrete deliverables come out of this. First, partner-swap is the sharpest probe of the three
        because a private code is partner-specific by definition, and it runs on any deployed pipeline for
        the cost of one extra forward pass through a fresh model. Second, the genuineness regularizer restores
        auditability at little cost, so keeping a channel inspectable does not require out-training the
        encoder. Third, the unification of oversight and generalization means safety and performance stop
        competing on this axis. A pipeline that reads well to a monitor also transfers well to new
        distributions.
      </P>

      <H2>What is settled and what is not</H2>
      <P>
        Settled. A monitor-evasion reward installs a partner-specific code that a fresh model cannot read, and
        the code costs both task accuracy and off-domain transfer. Genuineness and transfer track each other
        across runs. A preventive regularizer holds retention near 0.9 at under four points of task cost.
        Private codes are capability-gated and appear only once the base task can be solved at scale.
      </P>
      <P>
        Not yet settled. An adaptive overseer that trains against the agents is the natural next step. My
        first min-max run undertrained the overseer and the current hiding metric confounds hiding with raw
        skill, so I do not yet claim learned oversight fails. Building a properly trained adversarial
        overseer, a capability-controlled hiding metric, and a phase map of when a channel stays inspectable
        as a function of channel width and overseer strength is the funded work.
      </P>
    </div>
  );
}
